-- ============================================================================
-- RaícesGT — Carga inicial de los 42 productos
-- Generado con: node supabase/generar-productos-sql.js
-- Ejecutar DESPUÉS de 01_esquema.sql, en Supabase > SQL Editor.
--
-- Inserta o actualiza por id. El producto de ejemplo con id 1
-- ("corte-ejemplo") se reemplaza por el "Traje de Patzún".
-- ============================================================================

insert into public.product
  (id, nombre, descripcion, categoria, municipio, departamento, color, precio, imagen, status)
overriding system value
values
  (1, 'Traje de Patzún', 'Traje típico de Patzún, Chimaltenango, en tonos rojos característicos del municipio. Una pieza que refleja la identidad textil de la región.', 'Traje', 'Patzún', 'Chimaltenango', 'Rojo', 350, 'patzun.png', true),
  (2, 'Huipil de Santiago Atitlán', 'Huipil multicolor de Santiago Atitlán, Sololá. Sus colores y diseños representan la tradición textil de las orillas del lago de Atitlán.', 'Huipil', 'Santiago Atitlán', 'Sololá', 'Multicolor', 450, 'santiago.jpeg', true),
  (3, 'Corte tradicional', 'Corte tradicional en tonos azules de San Juan Sacatepéquez. Una base versátil para combinar con huipiles y blusas bordadas.', 'Corte', 'San Juan Sacatepéquez', 'Guatemala', 'Azul', 300, 'san-juan.jpg', true),
  (4, 'Indumentaria de gala de Patzún', 'Indumentaria de gala de Patzún en color rojo. Un conjunto pensado para ocasiones especiales, que luce el detalle y la elegancia del traje del municipio.', 'Traje de gala', 'Patzún', 'Chimaltenango', 'Rojo', 3200, 'traje-01.jpeg', true),
  (5, 'Set Clavel', 'Conjunto completo de Patzicía, Chimaltenango, en tonos rojos. Un set coordinado listo para lucir de pies a cabeza.', 'Traje', 'Patzicía', 'Chimaltenango', 'Rojo', 3500, 'traje-02.jpeg', true),
  (6, 'Blusa bordada beige', 'Blusa bordada a mano de Patzún en tono beige. Un color suave que resalta el bordado y combina con cortes de distintos colores.', 'Blusa', 'Patzún', 'Chimaltenango', 'Beige', 3500, 'traje-03.jpeg', true),
  (7, 'Blusa bordada rosa', 'Blusa bordada a mano de Patzún en color rosa. Una pieza delicada y llamativa, ideal para combinar con un corte tradicional.', 'Blusa', 'Patzún', 'Chimaltenango', 'Rosa', 3500, 'traje-04.jpeg', true),
  (8, 'Blusa bordada rojo y blanco', 'Blusa bordada a mano de San Lucas en rojo y blanco. El contraste de colores hace que cada detalle del bordado destaque.', 'Blusa', 'San Lucas', 'Guatemala', 'Rojo y blanco', 3500, 'traje-05.jpeg', true),
  (9, 'Set Flora', 'Set de Patzún en tonos rosa: blusa bordada a mano acompañada de un corte de gala. Un conjunto coordinado para eventos y celebraciones.', 'Traje', 'Patzún', 'Chimaltenango', 'Rosa', 4500, 'traje-06.jpeg', true),
  (10, 'Blusa bordada rosa', 'Blusa bordada a mano de Patzún en tono rosa, con un bordado que aporta color y textura a la prenda.', 'Blusa', 'Patzún', 'Chimaltenango', 'Rosa', 3500, 'traje-07.jpeg', true),
  (11, 'Blusa bordada roja', 'Blusa bordada a mano de Patzún en color rojo. Un clásico del municipio que combina con cortes oscuros o multicolores.', 'Blusa', 'Patzún', 'Chimaltenango', 'Rojo', 1900, 'traje-08.jpeg', true),
  (12, 'Indumentaria de gala de San Lucas', 'Indumentaria de gala de San Lucas en color lila, con blusa bordada a mano. Un conjunto elegante para ocasiones especiales.', 'Traje de gala', 'San Lucas', 'Guatemala', 'Lila', 2800, 'traje-09.jpeg', true),
  (13, 'Set Kotzij', 'Traje tradicional de Sacapulas, Quiché. Un conjunto multicolor que representa la riqueza textil del altiplano.', 'Traje', 'Sacapulas', 'Quiché', 'Multicolor', 2500, 'traje-10.jpeg', true),
  (14, 'Indumentaria tradicional de San Pedro La Laguna', 'Indumentaria tradicional original de San Pedro La Laguna, Sololá, en tonos blanco y verde.', 'Traje', 'San Pedro La Laguna', 'Sololá', 'Blanco y verde', 3500, 'traje-11.jpeg', true),
  (15, 'Indumentaria tradicional de San Lucas Tolimán', 'Indumentaria tradicional original de San Lucas Tolimán, Sololá. Un conjunto multicolor que muestra el estilo textil del municipio.', 'Traje', 'San Lucas Tolimán', 'Sololá', 'Multicolor', 4800, 'traje-12.jpeg', true),
  (16, 'Blusa bordada verde', 'Blusa bordada a mano de San Lucas Tolimán en color verde. Fresca, colorida y fácil de combinar.', 'Blusa', 'San Lucas Tolimán', 'Sololá', 'Verde', 900, 'traje-13.jpeg', true),
  (17, 'Blusa bordada blanca', 'Blusa bordada a mano de San Lucas Tolimán, con base blanca y bordado multicolor que resalta cada detalle.', 'Blusa', 'San Lucas Tolimán', 'Sololá', 'Blanco, multicolor', 900, 'traje-14.jpeg', true),
  (18, 'Blusa bordada café', 'Blusa bordada a mano de San Lucas Tolimán en tono café. Un color sobrio que da protagonismo al bordado.', 'Blusa', 'San Lucas Tolimán', 'Sololá', 'Café', 900, 'traje-15.jpeg', true),
  (19, 'Set Iris', 'Set de Patzún en color rojo: blusa bordada a mano acompañada de un corte de gala. Un conjunto completo para lucir en celebraciones.', 'Traje', 'Patzún', 'Chimaltenango', 'Rojo', 4500, 'traje-16.jpeg', true),
  (20, 'Indumentaria de gala de San Lucas Tolimán', 'Indumentaria tradicional de gala de San Lucas Tolimán en color rosa. Una pieza especial para eventos y ocasiones importantes.', 'Traje de gala', 'San Lucas Tolimán', 'Sololá', 'Rosa', 4800, 'traje-17.jpeg', true),
  (21, 'Blusa bordada negra', 'Blusa bordada a mano de San Lucas Tolimán en color negro. El fondo oscuro hace que los colores del bordado resalten.', 'Blusa', 'San Lucas Tolimán', 'Sololá', 'Negro', 900, 'traje-18.jpeg', true),
  (22, 'Blusa bordada celeste', 'Blusa bordada a mano de San Lucas Tolimán en color celeste, ligera y alegre.', 'Blusa', 'San Lucas Tolimán', 'Sololá', 'Celeste', 900, 'traje-19.jpeg', true),
  (23, 'Indumentaria de gala de San Lucas Tolimán', 'Indumentaria tradicional de gala de San Lucas Tolimán en color amarillo. Un conjunto luminoso y lleno de detalle.', 'Traje de gala', 'San Lucas Tolimán', 'Sololá', 'Amarillo', 4800, 'traje-20.jpeg', true),
  (24, 'Blusa bordada celeste', 'Blusa bordada a mano de Patzún en color celeste. Una alternativa suave al rojo tradicional del municipio.', 'Blusa', 'Patzún', 'Chimaltenango', 'Celeste', 3500, 'traje-21.jpeg', true),
  (25, 'Indumentaria tradicional de Santiago Atitlán', 'Indumentaria tradicional original de Santiago Atitlán, Sololá, en color amarillo.', 'Traje', 'Santiago Atitlán', 'Sololá', 'Amarillo', 4800, 'traje-22.jpeg', true),
  (26, 'Huipil bordado de Sacatepéquez', 'Huipil bordado a mano de Sacatepéquez, con diseño multicolor que llena de vida la prenda.', 'Huipil', 'Sacatepéquez', 'Sacatepéquez', 'Multicolor', 2900, 'traje-23.png', true),
  (27, 'Huipil bordado de Nebaj', 'Huipil bordado a mano de Nebaj, Quiché. Sus colores vivos son característicos de la región ixil.', 'Huipil', 'Nebaj', 'Quiché', 'Multicolor', 3000, 'traje-24.png', true),
  (28, 'Blusa bordada naranja', 'Blusa bordada a mano de Cobán, Alta Verapaz, en color naranja. Una pieza alegre y fresca para el día a día.', 'Blusa', 'Cobán', 'Alta Verapaz', 'Naranja', 450, 'traje-25.png', true),
  (29, 'Huipil bordado de San Pedro Sacatepéquez', 'Huipil bordado a mano de San Pedro Sacatepéquez, con un diseño multicolor lleno de detalle.', 'Huipil', 'San Pedro Sacatepéquez', 'Guatemala', 'Multicolor', 3000, 'traje-26.png', true),
  (30, 'Blusa bordada roja', 'Blusa bordada a mano de Patzún en color rojo, el tono que identifica al traje del municipio.', 'Blusa', 'Patzún', 'Chimaltenango', 'Rojo', 3500, 'traje-27.png', true),
  (31, 'Indumentaria de Sumpango', 'Indumentaria de Sumpango, Sacatepéquez, con base blanca y detalles multicolor.', 'Traje', 'Sumpango', 'Sacatepéquez', 'Blanco', 3500, 'traje-28.jpeg', true),
  (32, 'Indumentaria de San Miguel Totonicapán', 'Indumentaria de San Miguel Totonicapán en color rojo. Un conjunto tradicional con fuerte presencia de color.', 'Traje', 'San Miguel Totonicapán', 'Totonicapán', 'Rojo', 4500, 'traje-29.jpeg', true),
  (33, 'Indumentaria de San Juan La Laguna', 'Indumentaria de San Juan La Laguna, Sololá, en color amarillo. Luminosa y llena de tradición.', 'Traje', 'San Juan La Laguna', 'Sololá', 'Amarillo', 2800, 'traje-30.jpeg', true),
  (34, 'Indumentaria de San Juan La Laguna', 'Indumentaria de San Juan La Laguna, Sololá, modelo «Mojado» en color azul.', 'Traje', 'San Juan La Laguna', 'Sololá', 'Azul', 2800, 'traje-31.jpeg', true),
  (35, 'Indumentaria de San Cristóbal', 'Indumentaria de San Cristóbal Totonicapán en color rojo, representativa de la tradición textil del municipio.', 'Traje', 'San Cristóbal Totonicapán', 'Totonicapán', 'Rojo', 3900, 'traje-32.jpeg', true),
  (36, 'Indumentaria de San Pedro', 'Indumentaria de San Pedro, San Marcos, en color amarillo. Un conjunto vistoso del occidente del país.', 'Traje', 'San Pedro', 'San Marcos', 'Amarillo', 5000, 'traje-33.jpeg', true),
  (37, 'Indumentaria de San Pedro Soloma', 'Indumentaria de San Pedro Soloma, Huehuetenango, en rojo y blanco. Un diseño tradicional de los Cuchumatanes.', 'Traje', 'San Pedro Soloma', 'Huehuetenango', 'Rojo y blanco', 4500, 'traje-34.jpeg', true),
  (38, 'Indumentaria de Sumpango negra', 'Indumentaria de Sumpango, Sacatepéquez, bordada a mano en color negro. Elegante y con bordados que contrastan con el fondo oscuro.', 'Traje', 'Sumpango', 'Sacatepéquez', 'Negro', 3500, 'traje-35.jpeg', true),
  (39, 'Indumentaria bordada de San Pedro Sacatepéquez', 'Indumentaria de San Pedro Sacatepéquez bordada a mano, con un diseño multicolor de gran detalle.', 'Traje', 'San Pedro Sacatepéquez', 'Guatemala', 'Multicolor', 5200, 'traje-36.jpeg', true),
  (40, 'Indumentaria bordada de San Juan Sacatepéquez', 'Indumentaria de San Juan Sacatepéquez bordada a mano en color amarillo.', 'Traje', 'San Juan Sacatepéquez', 'Guatemala', 'Amarillo', 5200, 'traje-37.jpeg', true),
  (41, 'Indumentaria bordada de Palín', 'Indumentaria de Palín, Escuintla, bordada a mano en blanco, rojo y negro.', 'Traje', 'Palín', 'Escuintla', 'Blanco, rojo y negro', 5200, 'traje-38.jpeg', true),
  (42, 'Indumentaria bordada de Palín', 'Indumentaria de Palín, Escuintla, bordada a mano en color celeste.', 'Traje', 'Palín', 'Escuintla', 'Celeste', 5200, 'traje-39.jpeg', true)
on conflict (id) do update set
  nombre       = excluded.nombre,
  descripcion  = excluded.descripcion,
  categoria    = excluded.categoria,
  municipio    = excluded.municipio,
  departamento = excluded.departamento,
  color        = excluded.color,
  precio       = excluded.precio,
  imagen       = excluded.imagen,
  status       = excluded.status;

-- Para que los productos nuevos continúen después del id más alto
select setval(pg_get_serial_sequence('public.product', 'id'), (select max(id) from public.product));
