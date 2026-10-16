-- ============================================================================
-- RaícesGT — Inventario
-- Ejecutar DESPUÉS de 01_esquema.sql y 02_productos.sql, en SQL Editor.
-- Se puede ejecutar más de una vez.
--
-- Reutiliza la tabla antigua `productos` (que tenía stock, costo, punto de
-- reorden, unidad y artesano) y la convierte en `inventario`: una fila por
-- cada producto del catálogo, ligada por `producto_id`. Así hay UNA sola lista
-- de productos (`product`) y el inventario solo guarda lo interno.
--
-- Todo esto es privado: solo los administradores lo ven y lo editan.
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1. Tabla inventario (a partir de `productos` si existe)
-- ----------------------------------------------------------------------------
do $$
begin
  if to_regclass('public.inventario') is null and to_regclass('public.productos') is not null then
    alter table public.productos rename to inventario;
  end if;

  if to_regclass('public.inventario') is null then
    create table public.inventario (producto_id bigint);
  end if;
end $$;

alter table public.inventario add column if not exists producto_id bigint;

-- La fila de ejemplo ("corte-ejemplo") no corresponde a ningún producto real
delete from public.inventario where producto_id is null;

-- Renombra las columnas antiguas a nombres en español (si existen)
do $$
begin
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'inventario' and column_name = 'reorder_level') then
    alter table public.inventario rename column reorder_level to punto_reorden;
  end if;
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'inventario' and column_name = 'unit_of_measure') then
    alter table public.inventario rename column unit_of_measure to unidad;
  end if;
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'inventario' and column_name = 'artisano') then
    alter table public.inventario rename column artisano to artesana;
  end if;
end $$;

-- Quita las columnas que ahora viven en `product` (estaban duplicadas)
alter table public.inventario drop column if exists nombre;
alter table public.inventario drop column if exists descripcion;
alter table public.inventario drop column if exists categoria;
alter table public.inventario drop column if exists municipio;
alter table public.inventario drop column if exists departamento;
alter table public.inventario drop column if exists color;
alter table public.inventario drop column if exists imagen;
alter table public.inventario drop column if exists status;
alter table public.inventario drop column if exists precio;   -- el precio de venta está en product.precio
alter table public.inventario drop column if exists id cascade;

-- Columnas del inventario
alter table public.inventario add column if not exists stock          integer       default 1;
alter table public.inventario add column if not exists costo          numeric(10,2);
alter table public.inventario add column if not exists punto_reorden  integer       default 0;
alter table public.inventario add column if not exists unidad         text          default 'pieza';
alter table public.inventario add column if not exists artesana       text;
alter table public.inventario add column if not exists notas          text;
alter table public.inventario add column if not exists actualizado_en timestamptz   default now();

alter table public.inventario alter column stock set default 1;
alter table public.inventario alter column punto_reorden set default 0;
alter table public.inventario alter column unidad set default 'pieza';
update public.inventario set stock = 0 where stock is null;
update public.inventario set punto_reorden = 0 where punto_reorden is null;
alter table public.inventario alter column stock set not null;
alter table public.inventario alter column producto_id set not null;

-- Clave primaria y relación con el catálogo (si se borra el producto, se borra su inventario)
do $$
begin
  if not exists (select 1 from pg_index where indrelid = 'public.inventario'::regclass and indisprimary) then
    alter table public.inventario add primary key (producto_id);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'inventario_producto_fk') then
    alter table public.inventario
      add constraint inventario_producto_fk foreign key (producto_id)
      references public.product (id) on delete cascade;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'inventario_stock_no_negativo') then
    alter table public.inventario add constraint inventario_stock_no_negativo check (stock >= 0);
  end if;
end $$;

drop trigger if exists inventario_actualizado_en on public.inventario;
create or replace function public.tocar_actualizado_en()
returns trigger language plpgsql as $$
begin
  new.actualizado_en = now();
  return new;
end $$;
create trigger inventario_actualizado_en before update on public.inventario
  for each row execute function public.tocar_actualizado_en();

-- Cada producto del catálogo tiene su fila de inventario (1 pieza por defecto)
insert into public.inventario (producto_id, stock)
select p.id, 1 from public.product p
where not exists (select 1 from public.inventario i where i.producto_id = p.id);

-- Y los productos nuevos la reciben automáticamente
create or replace function public.crear_inventario_de_producto()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.inventario (producto_id, stock) values (new.id, 1)
  on conflict (producto_id) do nothing;
  return new;
end $$;

drop trigger if exists product_crear_inventario on public.product;
create trigger product_crear_inventario after insert on public.product
  for each row execute function public.crear_inventario_de_producto();


-- ----------------------------------------------------------------------------
-- 2. Historial de movimientos: ventas, entradas y ajustes
--    Al registrar un movimiento, el stock se actualiza solo.
-- ----------------------------------------------------------------------------
create table if not exists public.inventario_movimientos (
  id          bigint generated by default as identity primary key,
  producto_id bigint not null references public.product (id) on delete cascade,
  tipo        text   not null check (tipo in ('venta', 'entrada', 'ajuste')),
  cantidad    integer not null check (cantidad >= 0),   -- venta/entrada: piezas; ajuste: stock final
  stock_antes integer,
  stock_despues integer,
  nota        text,
  creado_por  text default (auth.jwt() ->> 'email'),
  creado_en   timestamptz default now()
);
create index if not exists inventario_movimientos_producto on public.inventario_movimientos (producto_id, creado_en desc);

create or replace function public.aplicar_movimiento()
returns trigger language plpgsql as $$
declare
  actual integer;
  nuevo  integer;
begin
  select stock into actual from public.inventario where producto_id = new.producto_id for update;
  if actual is null then
    insert into public.inventario (producto_id, stock) values (new.producto_id, 0);
    actual := 0;
  end if;

  nuevo := case new.tipo
    when 'venta'   then actual - new.cantidad
    when 'entrada' then actual + new.cantidad
    else new.cantidad
  end;

  if nuevo < 0 then
    raise exception 'No hay suficiente stock: hay % y se quieren vender %', actual, new.cantidad;
  end if;

  update public.inventario set stock = nuevo where producto_id = new.producto_id;
  new.stock_antes := actual;
  new.stock_despues := nuevo;
  return new;
end $$;

drop trigger if exists movimiento_aplicar on public.inventario_movimientos;
create trigger movimiento_aplicar before insert on public.inventario_movimientos
  for each row execute function public.aplicar_movimiento();


-- ----------------------------------------------------------------------------
-- 3. Permisos: solo administradores
-- ----------------------------------------------------------------------------
alter table public.inventario enable row level security;
alter table public.inventario_movimientos enable row level security;

revoke all on public.inventario from anon;
revoke all on public.inventario_movimientos from anon;
grant select, insert, update on public.inventario to authenticated;
grant select, insert on public.inventario_movimientos to authenticated;

-- Quita políticas anteriores (incluidas las que tuviera la tabla `productos`)
do $$
declare pol record;
begin
  for pol in select policyname, tablename from pg_policies
             where schemaname = 'public' and tablename in ('inventario', 'inventario_movimientos')
  loop
    execute format('drop policy %I on public.%I', pol.policyname, pol.tablename);
  end loop;
end $$;

create policy "inventario_admin_leer"      on public.inventario for select to authenticated using (public.es_admin());
create policy "inventario_admin_insertar"  on public.inventario for insert to authenticated with check (public.es_admin());
create policy "inventario_admin_editar"    on public.inventario for update to authenticated using (public.es_admin()) with check (public.es_admin());

-- El historial no se edita ni se borra: si hay un error, se registra un ajuste
create policy "movimientos_admin_leer"     on public.inventario_movimientos for select to authenticated using (public.es_admin());
create policy "movimientos_admin_insertar" on public.inventario_movimientos for insert to authenticated with check (public.es_admin());
