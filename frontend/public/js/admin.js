// ============================================================================
// PANEL DE ADMINISTRACIÓN (Supabase)
// Pestaña Catálogo: tarjetas con foto, visible/oculto en un clic, editor con
//   foto arrastrable y vista previa.
// Pestaña Inventario: resumen, stock bajo/agotados, ventas/entradas/ajustes
//   con historial, exportar a CSV.
// Permisos: solo correos en la tabla `administradores` (supabase/01_esquema.sql).
// Inventario: tablas `inventario` e `inventario_movimientos` (supabase/03_inventario.sql).
// Requiere js/vendor/supabase.min.js, js/config.js y js/datos.js.
// ============================================================================
(function () {
  const DEPARTAMENTOS = [
    "Alta Verapaz", "Baja Verapaz", "Chimaltenango", "Chiquimula", "El Progreso", "Escuintla",
    "Guatemala", "Huehuetenango", "Izabal", "Jalapa", "Jutiapa", "Petén", "Quetzaltenango",
    "Quiché", "Retalhuleu", "Sacatepéquez", "San Marcos", "Santa Rosa", "Sololá",
    "Suchitepéquez", "Totonicapán", "Zacapa",
  ];
  const CATEGORIAS = ["Traje", "Traje de gala", "Huipil", "Blusa", "Corte"];
  const COLUMNAS_PRODUCTO = "id,nombre,descripcion,categoria,municipio,departamento,color,precio,imagen,status";
  const CLAVE_GUIA = "raicesgt-admin-guia-vista";
  const CLAVE_PESTANA = "raicesgt-admin-pestana";

  const cliente = supabase.createClient(SITIO.supabase.url, SITIO.supabase.clave);
  const bucket = SITIO.supabase.bucketFotos;

  const estado = {
    productos: [],
    inventario: new Map(), // producto_id -> fila
    movimientos: [],
    inventarioActivo: true,
    filtroEstado: "todos",
    filtroCategoria: "",
    filtroStock: "todos",
    pestana: "catalogo",
  };

  // ============================== Utilidades ===============================
  const $ = (id) => document.getElementById(id);
  const escaparHTML = (t) =>
    String(t ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const normalizar = (t) => String(t ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
  const quetzales = (n) => (n == null || n === "" ? "—" : "Q" + Number(n).toLocaleString("es-GT", { maximumFractionDigits: 2 }));
  const leerLocal = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const guardarLocal = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };

  function nombreArchivoSeguro(nombre) {
    const punto = nombre.lastIndexOf(".");
    const base = punto > 0 ? nombre.slice(0, punto) : nombre;
    const ext = punto > 0 ? nombre.slice(punto + 1).toLowerCase() : "jpg";
    const limpio = normalizar(base).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "foto";
    return `${limpio}-${Date.now().toString(36)}.${ext}`;
  }

  function mensajeError(error) {
    const m = String(error?.message || error || "");
    if (/Invalid login credentials/i.test(m)) return "Correo o contraseña incorrectos.";
    if (/Email not confirmed/i.test(m)) return "Este correo aún no ha sido confirmado.";
    if (/No hay suficiente stock/i.test(m)) return m;
    if (/row-level security|permission denied/i.test(m)) return "Tu cuenta no tiene permiso para hacer esto.";
    if (/Failed to fetch|NetworkError|Load failed/i.test(m)) return "No hay conexión. Revisa tu internet e inténtalo de nuevo.";
    if (/precio.*does not exist/i.test(m)) return "Falta la columna precio: ejecuta de nuevo supabase/01_esquema.sql.";
    return m || "Ocurrió un error inesperado.";
  }

  const tablaNoExiste = (error) => error && (error.code === "PGRST205" || error.code === "42P01" || /does not exist|schema cache/i.test(error.message));

  // Avisos flotantes
  function avisar(texto, tipo = "ok") {
    const aviso = document.createElement("div");
    aviso.className =
      "pointer-events-auto w-full rounded-xl px-4 py-3 shadow-lg text-sm font-semibold transition-all duration-300 " +
      (tipo === "error" ? "bg-error text-white" : "bg-deep-indigo text-white");
    aviso.textContent = (tipo === "error" ? "⚠ " : "✓ ") + texto;
    $("avisos").appendChild(aviso);
    setTimeout(() => {
      aviso.style.opacity = "0";
      setTimeout(() => aviso.remove(), 300);
    }, tipo === "error" ? 6000 : 3500);
  }

  // Confirmación con diálogo propio
  function confirmar({ titulo, texto, boton = "Eliminar" }) {
    return new Promise((resolver) => {
      $("confirmar-titulo").textContent = titulo;
      $("confirmar-texto").textContent = texto;
      $("confirmar-si").textContent = boton;
      $("dialogo-confirmar").classList.remove("hidden");
      const cerrar = (valor) => {
        $("dialogo-confirmar").classList.add("hidden");
        $("confirmar-si").onclick = $("confirmar-no").onclick = null;
        resolver(valor);
      };
      $("confirmar-si").onclick = () => cerrar(true);
      $("confirmar-no").onclick = () => cerrar(false);
    });
  }

  // Grupo de botones tipo "píldora" (filtros)
  function pintarPildoras(contenedor, opciones, activo, alElegir) {
    contenedor.innerHTML = opciones
      .map(
        ([valor, texto]) =>
          `<button type="button" data-valor="${escaparHTML(valor)}" class="px-3.5 py-1.5 rounded-full text-sm font-semibold transition-colors ${
            valor === activo ? "bg-primary text-white" : "text-on-surface-variant hover:text-primary"
          }">${texto}</button>`
      )
      .join("");
    contenedor.onclick = (e) => {
      const b = e.target.closest("[data-valor]");
      if (b) alElegir(b.dataset.valor);
    };
  }

  // =============================== Sesión ==================================
  async function mostrarSegunSesion() {
    const { data } = await cliente.auth.getSession();
    const sesion = data.session;
    if (!sesion) return mostrarLogin();

    const { data: esAdmin, error } = await cliente.rpc("es_admin");
    if (error || !esAdmin) {
      await cliente.auth.signOut();
      mostrarLogin(error ? mensajeError(error) : `La cuenta ${sesion.user.email} no está autorizada como administrador.`);
      return;
    }

    $("vista-login").classList.add("hidden");
    $("vista-panel").classList.remove("hidden");
    $("btn-salir").classList.remove("hidden");
    $("usuario-actual").textContent = sesion.user.email;
    if (!leerLocal(CLAVE_GUIA)) $("guia").classList.remove("hidden");
    cambiarPestana(leerLocal(CLAVE_PESTANA) || "catalogo");
    await cargarTodo();
  }

  function mostrarLogin(error) {
    $("vista-login").classList.remove("hidden");
    $("vista-panel").classList.add("hidden");
    $("btn-salir").classList.add("hidden");
    $("usuario-actual").textContent = "";
    if (error) {
      $("error-login").textContent = error;
      $("error-login").classList.remove("hidden");
    }
  }

  $("form-login").addEventListener("submit", async (e) => {
    e.preventDefault();
    const boton = e.target.querySelector("button[type=submit]");
    const datos = new FormData(e.target);
    $("error-login").classList.add("hidden");
    boton.disabled = true;
    boton.textContent = "Entrando…";
    const { error } = await cliente.auth.signInWithPassword({
      email: String(datos.get("email")).trim(),
      password: String(datos.get("password")),
    });
    boton.disabled = false;
    boton.textContent = "Entrar";
    if (error) return mostrarLogin(mensajeError(error));
    e.target.reset();
    mostrarSegunSesion();
  });

  $("btn-salir").addEventListener("click", async () => {
    await cliente.auth.signOut();
    mostrarLogin();
  });

  $("cerrar-guia").addEventListener("click", () => {
    $("guia").classList.add("hidden");
    guardarLocal(CLAVE_GUIA, "1");
  });

  // =============================== Pestañas ================================
  function cambiarPestana(nombre) {
    estado.pestana = nombre;
    guardarLocal(CLAVE_PESTANA, nombre);
    document.querySelectorAll(".pestana").forEach((b) => {
      const activa = b.dataset.pestana === nombre;
      b.classList.toggle("bg-primary", activa);
      b.classList.toggle("text-white", activa);
      b.classList.toggle("text-on-surface-variant", !activa);
      b.setAttribute("aria-selected", activa);
    });
    $("tab-catalogo").classList.toggle("hidden", nombre !== "catalogo");
    $("tab-inventario").classList.toggle("hidden", nombre !== "inventario");
  }
  document.querySelectorAll(".pestana").forEach((b) => b.addEventListener("click", () => cambiarPestana(b.dataset.pestana)));

  // ================================ Datos ==================================
  async function cargarTodo() {
    $("tarjetas").innerHTML = `<p class="col-span-full text-center text-on-surface-variant py-12">Cargando productos…</p>`;

    const [prod, inv, mov] = await Promise.all([
      cliente.from("product").select(COLUMNAS_PRODUCTO).order("id", { ascending: false }),
      cliente.from("inventario").select("*"),
      cliente
        .from("inventario_movimientos")
        .select("id,producto_id,tipo,cantidad,stock_antes,stock_despues,nota,creado_por,creado_en")
        .order("creado_en", { ascending: false })
        .limit(40),
    ]);

    if (prod.error) {
      $("tarjetas").innerHTML = "";
      avisar(mensajeError(prod.error), "error");
      return;
    }
    estado.productos = prod.data;

    estado.inventarioActivo = !tablaNoExiste(inv.error);
    estado.inventario = new Map((inv.data || []).map((f) => [Number(f.producto_id), f]));
    estado.movimientos = mov.data || [];
    if (inv.error && estado.inventarioActivo) avisar(mensajeError(inv.error), "error");

    pintarCatalogo();
    pintarInventario();
  }

  const stockDe = (id) => estado.inventario.get(Number(id))?.stock;

  // =============================== Catálogo ================================
  function pintarFiltrosCatalogo() {
    const visibles = estado.productos.filter((p) => p.status).length;
    pintarPildoras(
      $("filtro-estado"),
      [
        ["todos", `Todos (${estado.productos.length})`],
        ["visibles", `Visibles (${visibles})`],
        ["ocultos", `Ocultos (${estado.productos.length - visibles})`],
      ],
      estado.filtroEstado,
      (v) => { estado.filtroEstado = v; pintarCatalogo(); }
    );
    const categorias = [...new Set([...CATEGORIAS, ...estado.productos.map((p) => p.categoria).filter(Boolean)])];
    $("filtro-categoria").innerHTML = categorias
      .map((c) => {
        const activa = estado.filtroCategoria === c;
        return `<button type="button" data-cat="${escaparHTML(c)}" class="px-3 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
          activa ? "bg-tertiary text-white border-tertiary" : "bg-white border-border-cool text-on-surface-variant hover:border-tertiary"
        }">${escaparHTML(c)}</button>`;
      })
      .join("");
  }
  $("filtro-categoria").addEventListener("click", (e) => {
    const b = e.target.closest("[data-cat]");
    if (!b) return;
    estado.filtroCategoria = estado.filtroCategoria === b.dataset.cat ? "" : b.dataset.cat;
    pintarCatalogo();
  });

  function etiquetaStock(id) {
    if (!estado.inventarioActivo) return "";
    const fila = estado.inventario.get(Number(id));
    if (!fila) return "";
    if (fila.stock === 0) return `<span class="text-xs font-bold px-2 py-0.5 rounded-full bg-error-container text-on-error-container">Agotado</span>`;
    if (fila.stock <= (fila.punto_reorden || 0)) return `<span class="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">Quedan ${fila.stock}</span>`;
    return `<span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-surface-container-low text-on-surface-variant">${fila.stock} en stock</span>`;
  }

  function pintarCatalogo() {
    pintarFiltrosCatalogo();
    const texto = normalizar($("buscar").value);
    const lista = estado.productos.filter((p) => {
      if (estado.filtroEstado === "visibles" && !p.status) return false;
      if (estado.filtroEstado === "ocultos" && p.status) return false;
      if (estado.filtroCategoria && p.categoria !== estado.filtroCategoria) return false;
      return !texto || [p.nombre, p.municipio, p.departamento, p.color, p.categoria, p.id].some((c) => normalizar(c).includes(texto));
    });
    $("total").textContent = `${lista.length} producto${lista.length === 1 ? "" : "s"}`;

    if (!lista.length) {
      $("tarjetas").innerHTML = `
        <div class="col-span-full text-center py-16 bg-white rounded-2xl border border-dashed border-outline-variant">
          <p class="font-bold">No hay productos que coincidan</p>
          <p class="text-sm text-on-surface-variant mt-1">Cambia la búsqueda o los filtros, o agrega un producto nuevo.</p>
        </div>`;
      return;
    }

    $("tarjetas").innerHTML = lista
      .map(
        (p) => `
      <article class="group bg-white rounded-2xl border border-border-cool shadow-sm overflow-hidden flex flex-col ${p.status ? "" : "opacity-70"}">
        <button type="button" data-editar="${p.id}" class="relative aspect-[4/3] bg-surface-container-low overflow-hidden" aria-label="Editar ${escaparHTML(p.nombre)}">
          <img src="${escaparHTML(urlImagenProducto(p.imagen))}" alt="" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${p.status ? "" : "grayscale"}" onerror="this.style.visibility='hidden'" />
          <span class="absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full bg-white/90 text-on-surface-variant">#${p.id}</span>
          ${p.status ? "" : `<span class="absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full bg-deep-indigo text-white">Oculto</span>`}
        </button>
        <div class="p-4 flex flex-col gap-2 flex-grow">
          <div class="flex flex-wrap items-center gap-1.5">
            <span class="text-[11px] font-bold uppercase tracking-wide text-tertiary">${escaparHTML(p.categoria)}</span>
            ${etiquetaStock(p.id)}
          </div>
          <h3 class="font-bold leading-snug line-clamp-2">${escaparHTML(p.nombre)}</h3>
          <p class="text-xs text-on-surface-variant">${escaparHTML(p.municipio)}, ${escaparHTML(p.departamento)} · ${escaparHTML(p.color)}</p>
          <div class="mt-auto pt-3 flex items-center justify-between gap-2 border-t border-border-cool">
            <label class="flex items-center gap-2 cursor-pointer text-sm font-semibold" title="Mostrar u ocultar en la web y la app">
              <input type="checkbox" data-visible="${p.id}" class="sr-only peer" ${p.status ? "checked" : ""} />
              <span class="relative w-10 h-6 rounded-full bg-outline-variant peer-checked:bg-tertiary transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-4"></span>
              <span class="text-on-surface-variant">${p.status ? "Visible" : "Oculto"}</span>
            </label>
            <div class="flex gap-1">
              <button type="button" data-editar="${p.id}" class="px-3 py-1.5 rounded-lg text-sm font-bold text-secondary hover:bg-secondary-fixed">Editar</button>
              <button type="button" data-eliminar="${p.id}" class="p-1.5 rounded-lg text-error hover:bg-error-container" aria-label="Eliminar ${escaparHTML(p.nombre)}" title="Eliminar">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg>
              </button>
            </div>
          </div>
        </div>
      </article>`
      )
      .join("");
  }

  $("buscar").addEventListener("input", pintarCatalogo);
  $("btn-nuevo").addEventListener("click", () => abrirEditor(null));

  $("tarjetas").addEventListener("click", async (e) => {
    const editar = e.target.closest("[data-editar]");
    const eliminar = e.target.closest("[data-eliminar]");
    if (editar) return abrirEditor(estado.productos.find((p) => p.id === Number(editar.dataset.editar)));
    if (eliminar) {
      const p = estado.productos.find((x) => x.id === Number(eliminar.dataset.eliminar));
      const ok = await confirmar({
        titulo: `¿Eliminar “${p.nombre}”?`,
        texto: "Se borrará para siempre, junto con su historial de inventario. Si solo quieres que no se vea, mejor apaga el interruptor Visible.",
      });
      if (!ok) return;
      const { error } = await cliente.from("product").delete().eq("id", p.id);
      if (error) return avisar(mensajeError(error), "error");
      avisar(`“${p.nombre}” fue eliminado.`);
      cargarTodo();
    }
  });

  $("tarjetas").addEventListener("change", async (e) => {
    const casilla = e.target.closest("[data-visible]");
    if (!casilla) return;
    const id = Number(casilla.dataset.visible);
    const p = estado.productos.find((x) => x.id === id);
    const { error } = await cliente.from("product").update({ status: casilla.checked }).eq("id", id);
    if (error) {
      casilla.checked = !casilla.checked;
      return avisar(mensajeError(error), "error");
    }
    p.status = casilla.checked;
    avisar(p.status ? `“${p.nombre}” ya se ve en la web y la app.` : `“${p.nombre}” quedó oculto.`);
    pintarCatalogo();
  });

  // ================================ Editor =================================
  const form = $("form");
  const campo = (n) => form.elements.namedItem(n); // evita choques con propiedades del form
  let editandoId = null;
  let archivoElegido = null;
  let fotoActual = "";

  campo("departamento").innerHTML = DEPARTAMENTOS.map((d) => `<option>${d}</option>`).join("");

  function pintarCategoriasEditor() {
    const actual = campo("categoria").value;
    const categorias = [...new Set([...CATEGORIAS, ...estado.productos.map((p) => p.categoria).filter(Boolean)])];
    $("opciones-categoria").innerHTML = categorias
      .map(
        (c) => `<button type="button" data-categoria="${escaparHTML(c)}" class="px-4 py-2 rounded-xl border-2 font-semibold text-sm transition-colors ${
          c === actual ? "border-primary bg-mesh-blue text-primary" : "border-border-cool hover:border-primary"
        }">${escaparHTML(c)}</button>`
      )
      .join("");
  }
  $("opciones-categoria").addEventListener("click", (e) => {
    const b = e.target.closest("[data-categoria]");
    if (!b) return;
    campo("categoria").value = b.dataset.categoria;
    pintarCategoriasEditor();
    pintarVistaPrevia();
  });

  function llenarSugerencias() {
    const unicos = (lista) => [...new Set(lista.filter(Boolean))].sort((a, b) => a.localeCompare(b, "es"));
    $("lista-colores").innerHTML = unicos(estado.productos.map((p) => p.color)).map((c) => `<option value="${escaparHTML(c)}">`).join("");
    $("lista-municipios").innerHTML = unicos(estado.productos.map((p) => p.municipio)).map((c) => `<option value="${escaparHTML(c)}">`).join("");
  }

  function mostrarFoto(src) {
    $("foto-previa").classList.toggle("hidden", !src);
    $("foto-icono").classList.toggle("hidden", Boolean(src));
    if (src) $("foto-previa").src = src;
    pintarVistaPrevia();
  }

  function fotoParaVistaPrevia() {
    if (archivoElegido) return $("foto-previa").src;
    return fotoActual ? urlImagenProducto(fotoActual) : "";
  }

  function pintarVistaPrevia() {
    const nombre = campo("nombre").value.trim() || "Nombre del producto";
    const desc = campo("descripcion").value.trim() || "La descripción aparecerá aquí.";
    const foto = fotoParaVistaPrevia();
    $("contador-desc").textContent = `${campo("descripcion").value.length}/500`;
    $("vista-previa").innerHTML = `
      <div class="relative aspect-[4/5] bg-surface-container-low">
        ${foto ? `<img src="${escaparHTML(foto)}" alt="" class="w-full h-full object-cover" />` : ""}
        <span class="absolute top-3 left-3 bg-white/90 text-primary text-xs font-medium px-2.5 py-1 rounded-full">${escaparHTML(campo("departamento").value)}</span>
      </div>
      <div class="p-4">
        <span class="inline-block text-[11px] font-semibold uppercase tracking-wide text-tertiary bg-tertiary-fixed/40 px-2 py-0.5 rounded-full mb-2">${escaparHTML(campo("categoria").value || "Categoría")}</span>
        <h3 class="font-bold leading-tight mb-1">${escaparHTML(nombre)}</h3>
        <p class="text-xs text-on-surface-variant mb-2">${escaparHTML(campo("municipio").value || "Municipio")}</p>
        <p class="text-sm text-on-surface-variant line-clamp-3">${escaparHTML(desc)}</p>
        <p class="mt-3 pt-3 border-t border-border-cool text-sm font-semibold text-primary">Consúltanos</p>
      </div>
      ${campo("status").checked ? "" : `<p class="px-4 pb-3 text-xs font-bold text-error">Oculto: no se mostrará al público</p>`}`;
  }
  ["nombre", "descripcion", "municipio", "departamento"].forEach((c) => campo(c).addEventListener("input", pintarVistaPrevia));
  campo("status").addEventListener("change", pintarVistaPrevia);

  function abrirEditor(producto) {
    editandoId = producto ? producto.id : null;
    archivoElegido = null;
    fotoActual = producto?.imagen || "";
    $("archivo").value = "";
    $("errores").classList.add("hidden");
    $("editor-titulo").textContent = producto ? "Editar producto" : "Nuevo producto";
    $("editor-subtitulo").textContent = producto ? `Código #${producto.id}` : "Completa los 4 pasos y pulsa Guardar.";

    const p = producto || { nombre: "", categoria: "", color: "", municipio: "", departamento: "Guatemala", descripcion: "", precio: "", status: true };
    ["nombre", "color", "municipio", "descripcion"].forEach((c) => (campo(c).value = p[c] ?? ""));
    campo("precio").value = p.precio ?? "";
    campo("categoria").value = p.categoria || "";
    if (p.departamento && !DEPARTAMENTOS.includes(p.departamento)) {
      campo("departamento").insertAdjacentHTML("afterbegin", `<option>${escaparHTML(p.departamento)}</option>`);
    }
    campo("departamento").value = p.departamento || "Guatemala";
    campo("status").checked = p.status !== false;

    // Inventario
    const inv = producto ? estado.inventario.get(producto.id) : null;
    $("aviso-sin-inventario").classList.toggle("hidden", estado.inventarioActivo);
    ["costo", "stock", "punto_reorden", "artesana"].forEach((c) => (campo(c).disabled = !estado.inventarioActivo));
    campo("costo").value = inv?.costo ?? "";
    campo("punto_reorden").value = inv?.punto_reorden ?? 0;
    campo("artesana").value = inv?.artesana ?? "";
    if (producto) {
      campo("stock").value = inv?.stock ?? 0;
      campo("stock").readOnly = true;
      $("etiqueta-stock").textContent = "Piezas disponibles";
      $("nota-stock").textContent = "Para cambiar el stock usa Venta, Entrada o Ajuste en la pestaña Inventario (así queda registrado).";
    } else {
      campo("stock").value = 1;
      campo("stock").readOnly = false;
      $("etiqueta-stock").textContent = "Piezas iniciales";
      $("nota-stock").textContent = "";
    }

    llenarSugerencias();
    pintarCategoriasEditor();
    mostrarFoto(fotoActual ? urlImagenProducto(fotoActual) : "");
    $("editor").classList.remove("hidden");
    document.body.style.overflow = "hidden";
    setTimeout(() => campo("nombre").focus(), 50);
  }

  function cerrarEditor() {
    $("editor").classList.add("hidden");
    document.body.style.overflow = "";
  }
  $("editor").addEventListener("click", (e) => {
    if (e.target === $("editor") || e.target.closest("[data-cerrar]")) cerrarEditor();
  });

  // Foto: elegir o arrastrar
  function elegirFoto(archivo) {
    if (!archivo) return;
    if (!/^image\/(jpeg|png|webp)$/.test(archivo.type)) return avisar("La foto debe ser JPG, PNG o WEBP.", "error");
    if (archivo.size > 8 * 1024 * 1024) return avisar("La foto pesa más de 8 MB.", "error");
    archivoElegido = archivo;
    mostrarFoto(URL.createObjectURL(archivo));
  }
  $("archivo").addEventListener("change", () => elegirFoto($("archivo").files[0]));
  const zona = $("zona-foto");
  ["dragenter", "dragover"].forEach((ev) =>
    zona.addEventListener(ev, (e) => {
      e.preventDefault();
      zona.classList.add("border-primary", "bg-mesh-blue/40");
    })
  );
  ["dragleave", "drop"].forEach((ev) =>
    zona.addEventListener(ev, (e) => {
      e.preventDefault();
      zona.classList.remove("border-primary", "bg-mesh-blue/40");
    })
  );
  zona.addEventListener("drop", (e) => elegirFoto(e.dataTransfer.files[0]));

  const numeroONulo = (v) => (v === "" || v == null ? null : Number(v));

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const datos = {
      nombre: campo("nombre").value.trim(),
      categoria: campo("categoria").value.trim(),
      color: campo("color").value.trim(),
      municipio: campo("municipio").value.trim(),
      departamento: campo("departamento").value,
      descripcion: campo("descripcion").value.trim(),
      precio: numeroONulo(campo("precio").value),
      status: campo("status").checked,
    };

    const problemas = [];
    if (!editandoId && !archivoElegido) problemas.push("la foto");
    if (!datos.nombre) problemas.push("el nombre");
    if (!datos.categoria) problemas.push("la categoría");
    if (!datos.color) problemas.push("el color");
    if (!datos.municipio) problemas.push("el municipio");
    if (!datos.descripcion) problemas.push("la descripción");
    const errores = [];
    if (problemas.length) errores.push(`Falta ${problemas.join(", ")}.`);
    if (datos.descripcion && normalizar(datos.descripcion) === normalizar(datos.nombre)) errores.push("La descripción no debe ser igual al nombre.");
    for (const c of ["precio", "costo", "stock", "punto_reorden"]) {
      const v = numeroONulo(campo(c).value);
      if (v !== null && (!Number.isFinite(v) || v < 0)) errores.push(`Revisa el campo ${c.replace("_", " ")}: debe ser un número positivo.`);
    }
    if (errores.length) {
      $("errores").textContent = errores.join(" ");
      $("errores").classList.remove("hidden");
      return;
    }

    const boton = $("btn-guardar");
    boton.disabled = true;
    boton.textContent = archivoElegido ? "Subiendo foto…" : "Guardando…";
    try {
      if (archivoElegido) {
        const nombreFoto = nombreArchivoSeguro(archivoElegido.name);
        const { error } = await cliente.storage.from(bucket).upload(nombreFoto, archivoElegido, { contentType: archivoElegido.type, upsert: false });
        if (error) throw error;
        datos.imagen = nombreFoto;
      }
      boton.textContent = "Guardando…";

      let id = editandoId;
      if (editandoId) {
        const { error } = await cliente.from("product").update(datos).eq("id", editandoId);
        if (error) throw error;
      } else {
        const { data, error } = await cliente.from("product").insert(datos).select("id").single();
        if (error) throw error;
        id = data.id;
      }

      if (estado.inventarioActivo) {
        const inv = {
          producto_id: id,
          costo: numeroONulo(campo("costo").value),
          punto_reorden: numeroONulo(campo("punto_reorden").value) ?? 0,
          artesana: campo("artesana").value.trim() || null,
        };
        const { error } = await cliente.from("inventario").upsert(inv, { onConflict: "producto_id" });
        if (error) throw error;

        // Stock inicial de un producto nuevo: se registra como ajuste (queda en el historial)
        if (!editandoId) {
          const inicial = numeroONulo(campo("stock").value) ?? 0;
          const { error: errMov } = await cliente
            .from("inventario_movimientos")
            .insert({ producto_id: id, tipo: "ajuste", cantidad: inicial, nota: "Stock inicial" });
          if (errMov) throw errMov;
        }
      }

      cerrarEditor();
      avisar(editandoId ? `“${datos.nombre}” fue actualizado.` : `“${datos.nombre}” ya está en el catálogo.`);
      cargarTodo();
    } catch (error) {
      $("errores").textContent = mensajeError(error);
      $("errores").classList.remove("hidden");
    } finally {
      boton.disabled = false;
      boton.textContent = "Guardar";
    }
  });

  // =============================== Inventario ==============================
  function pintarResumen() {
    const filas = estado.productos.map((p) => ({ p, inv: estado.inventario.get(p.id) })).filter((x) => x.inv);
    const piezas = filas.reduce((s, x) => s + (x.inv.stock || 0), 0);
    const valorCosto = filas.reduce((s, x) => s + (x.inv.stock || 0) * (Number(x.inv.costo) || 0), 0);
    const valorVenta = filas.reduce((s, x) => s + (x.inv.stock || 0) * (Number(x.p.precio) || 0), 0);
    const agotados = filas.filter((x) => x.inv.stock === 0).length;
    const bajos = filas.filter((x) => x.inv.stock > 0 && x.inv.stock <= (x.inv.punto_reorden || 0)).length;
    const sinCosto = filas.filter((x) => x.inv.costo == null).length;

    const tarjeta = (titulo, valor, detalle, color = "text-on-surface") => `
      <div class="bg-white rounded-2xl border border-border-cool p-4">
        <p class="text-xs font-bold uppercase tracking-wide text-on-surface-variant">${titulo}</p>
        <p class="text-2xl font-extrabold mt-1 ${color}">${valor}</p>
        <p class="text-xs text-on-surface-variant mt-0.5">${detalle}</p>
      </div>`;
    $("resumen").innerHTML =
      tarjeta("Piezas en stock", piezas.toLocaleString("es-GT"), `${filas.length} productos`) +
      tarjeta("Valor a precio de venta", quetzales(valorVenta), "stock × precio", "text-primary") +
      tarjeta("Valor a costo", quetzales(valorCosto), sinCosto ? `${sinCosto} sin costo registrado` : "stock × costo") +
      tarjeta("Stock bajo", bajos, "llegaron al aviso", bajos ? "text-amber-700" : "text-on-surface") +
      tarjeta("Agotados", agotados, "sin piezas", agotados ? "text-error" : "text-on-surface");
  }

  function pintarInventario() {
    $("aviso-inventario").classList.toggle("hidden", estado.inventarioActivo);
    if (!estado.inventarioActivo) {
      $("aviso-inventario").innerHTML =
        "<b>El inventario aún no está activado.</b> Pide que ejecuten <code>supabase/03_inventario.sql</code> en el SQL Editor de Supabase (ver supabase/README.md).";
      $("resumen").innerHTML = "";
      $("lista-inventario").innerHTML = "";
      $("movimientos").innerHTML = "";
      return;
    }
    pintarResumen();

    const conteo = (f) => estado.productos.filter((p) => f(estado.inventario.get(p.id))).length;
    pintarPildoras(
      $("filtro-stock"),
      [
        ["todos", "Todos"],
        ["bajo", `Stock bajo (${conteo((i) => i && i.stock > 0 && i.stock <= (i.punto_reorden || 0))})`],
        ["agotado", `Agotados (${conteo((i) => i && i.stock === 0)})`],
      ],
      estado.filtroStock,
      (v) => { estado.filtroStock = v; pintarInventario(); }
    );

    const texto = normalizar($("buscar-inv").value);
    const filas = estado.productos
      .map((p) => ({ p, inv: estado.inventario.get(p.id) || { stock: 0, punto_reorden: 0 } }))
      .filter(({ p, inv }) => {
        if (estado.filtroStock === "bajo" && !(inv.stock > 0 && inv.stock <= (inv.punto_reorden || 0))) return false;
        if (estado.filtroStock === "agotado" && inv.stock !== 0) return false;
        return !texto || [p.nombre, p.municipio, p.categoria, p.id, inv.artesana].some((c) => normalizar(c).includes(texto));
      })
      .sort((a, b) => a.inv.stock - b.inv.stock || a.p.nombre.localeCompare(b.p.nombre, "es"));

    $("lista-inventario").innerHTML =
      filas
        .map(({ p, inv }) => {
          const color = inv.stock === 0 ? "bg-error-container text-on-error-container" : inv.stock <= (inv.punto_reorden || 0) ? "bg-amber-100 text-amber-900" : "bg-surface-container-low text-on-surface";
          const margen = p.precio != null && inv.costo != null ? Number(p.precio) - Number(inv.costo) : null;
          return `
        <li class="grid grid-cols-[56px_1fr] md:grid-cols-[64px_1fr_90px_100px_100px_260px] gap-x-4 gap-y-2 items-center px-4 md:px-5 py-3">
          <img src="${escaparHTML(urlImagenProducto(p.imagen))}" alt="" loading="lazy" class="w-14 h-16 md:w-16 rounded-lg object-cover bg-surface-container-low row-span-2 md:row-span-1" onerror="this.style.visibility='hidden'" />
          <div class="min-w-0">
            <p class="font-semibold truncate">${escaparHTML(p.nombre)} <span class="text-xs font-normal text-outline">#${p.id}</span>${p.status ? "" : ` <span class="text-xs font-bold text-on-surface-variant">· oculto</span>`}</p>
            <p class="text-xs text-on-surface-variant truncate">${escaparHTML(p.categoria)}${inv.artesana ? " · " + escaparHTML(inv.artesana) : ""}${margen != null ? ` · margen ${quetzales(margen)}` : ""}</p>
          </div>
          <div class="flex md:block items-center gap-3 md:text-center col-start-2 md:col-start-auto">
            <span class="inline-block min-w-[44px] text-center font-extrabold px-2.5 py-1 rounded-lg ${color}">${inv.stock}</span>
            <span class="md:hidden text-xs text-on-surface-variant">Costo ${quetzales(inv.costo)} · Precio ${quetzales(p.precio)}</span>
          </div>
          <span class="hidden md:block text-right text-sm">${quetzales(inv.costo)}</span>
          <span class="hidden md:block text-right text-sm">${quetzales(p.precio)}</span>
          <div class="flex flex-wrap gap-1.5 md:justify-end col-span-2 md:col-span-1">
            <button type="button" data-mov="venta" data-id="${p.id}" class="px-3 py-1.5 rounded-lg text-sm font-bold bg-primary text-white hover:bg-primary-container disabled:bg-outline-variant disabled:cursor-not-allowed" ${inv.stock === 0 ? "disabled title='Sin piezas'" : ""}>Venta</button>
            <button type="button" data-mov="entrada" data-id="${p.id}" class="px-3 py-1.5 rounded-lg text-sm font-bold border border-border-cool hover:border-primary hover:text-primary">Entrada</button>
            <button type="button" data-mov="ajuste" data-id="${p.id}" class="px-3 py-1.5 rounded-lg text-sm font-semibold text-on-surface-variant hover:bg-surface-container-low">Ajustar</button>
          </div>
        </li>`;
        })
        .join("") || `<li class="px-5 py-12 text-center text-on-surface-variant">No hay productos en este filtro. 🎉</li>`;

    pintarMovimientos();
  }

  function pintarMovimientos() {
    const nombres = new Map(estado.productos.map((p) => [p.id, p.nombre]));
    const estilo = {
      venta: ["Venta", "bg-primary/10 text-primary"],
      entrada: ["Entrada", "bg-tertiary-fixed/40 text-tertiary"],
      ajuste: ["Ajuste", "bg-surface-container text-on-surface-variant"],
    };
    $("movimientos").innerHTML =
      estado.movimientos
        .map((m) => {
          const [texto, clase] = estilo[m.tipo] || [m.tipo, ""];
          const fecha = new Date(m.creado_en).toLocaleString("es-GT", { dateStyle: "medium", timeStyle: "short" });
          const detalle = m.tipo === "ajuste" ? `stock ${m.stock_antes ?? "?"} → ${m.stock_despues}` : `${m.tipo === "venta" ? "−" : "+"}${m.cantidad} (${m.stock_antes ?? "?"} → ${m.stock_despues})`;
          return `
        <li class="px-5 py-3 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span class="text-xs font-bold px-2 py-0.5 rounded-full ${clase}">${texto}</span>
          <span class="font-semibold">${escaparHTML(nombres.get(m.producto_id) || `#${m.producto_id}`)}</span>
          <span class="text-on-surface-variant">${detalle}</span>
          ${m.nota ? `<span class="text-on-surface-variant italic">“${escaparHTML(m.nota)}”</span>` : ""}
          <span class="ml-auto text-xs text-outline">${fecha}${m.creado_por ? " · " + escaparHTML(m.creado_por) : ""}</span>
        </li>`;
        })
        .join("") || `<li class="px-5 py-8 text-center text-on-surface-variant">Aún no hay movimientos. Cuando registres una venta aparecerá aquí.</li>`;
  }

  $("buscar-inv").addEventListener("input", pintarInventario);

  // ------------------------- Diálogo de movimiento -------------------------
  const formMov = $("form-mov");
  const campoMov = (n) => formMov.elements.namedItem(n);
  let mov = { id: null, tipo: "venta" };

  const TIPOS = {
    venta: { texto: "Venta", etiqueta: "¿Cuántas piezas se vendieron?", boton: "Registrar venta" },
    entrada: { texto: "Entrada", etiqueta: "¿Cuántas piezas llegaron?", boton: "Registrar entrada" },
    ajuste: { texto: "Ajuste", etiqueta: "¿Cuántas piezas hay en realidad?", boton: "Guardar ajuste" },
  };

  function stockResultante() {
    const actual = stockDe(mov.id) ?? 0;
    const cant = Math.max(0, Math.floor(Number(campoMov("cantidad").value) || 0));
    return { actual, cant, nuevo: mov.tipo === "venta" ? actual - cant : mov.tipo === "entrada" ? actual + cant : cant };
  }

  function pintarMov() {
    $("mov-tipos").innerHTML = Object.entries(TIPOS)
      .map(
        ([clave, t]) => `<button type="button" data-tipo="${clave}" class="py-2.5 rounded-xl border-2 font-bold text-sm ${
          clave === mov.tipo ? "border-primary bg-mesh-blue text-primary" : "border-border-cool"
        }">${t.texto}</button>`
      )
      .join("");
    $("mov-etiqueta").textContent = TIPOS[mov.tipo].etiqueta;
    $("btn-mov").textContent = TIPOS[mov.tipo].boton;
    const { actual, nuevo } = stockResultante();
    const invalido = nuevo < 0;
    $("mov-resultado").textContent = invalido ? `Solo hay ${actual} pieza${actual === 1 ? "" : "s"}.` : `Stock: ${actual} → ${nuevo}`;
    $("mov-resultado").className = `rounded-xl px-4 py-3 text-sm font-semibold ${invalido ? "bg-error-container text-on-error-container" : "bg-surface-container-low"}`;
    const producto = estado.productos.find((p) => p.id === mov.id);
    $("mov-ocultar-fila").classList.toggle("hidden", !(nuevo === 0 && producto?.status));
    $("btn-mov").disabled = invalido;
  }

  function abrirMovimiento(id, tipo) {
    const p = estado.productos.find((x) => x.id === id);
    mov = { id, tipo };
    $("mov-titulo").textContent = p.nombre;
    $("mov-stock-actual").textContent = `Stock actual: ${stockDe(id) ?? 0} pieza(s)`;
    $("mov-foto").src = urlImagenProducto(p.imagen);
    campoMov("cantidad").value = tipo === "ajuste" ? stockDe(id) ?? 0 : 1;
    campoMov("nota").value = "";
    campoMov("ocultar").checked = true;
    $("mov-error").classList.add("hidden");
    pintarMov();
    $("dialogo-mov").classList.remove("hidden");
  }

  function cerrarMovimiento() {
    $("dialogo-mov").classList.add("hidden");
  }

  $("lista-inventario").addEventListener("click", (e) => {
    const b = e.target.closest("[data-mov]");
    if (b && !b.disabled) abrirMovimiento(Number(b.dataset.id), b.dataset.mov);
  });
  $("mov-tipos").addEventListener("click", (e) => {
    const b = e.target.closest("[data-tipo]");
    if (!b) return;
    mov.tipo = b.dataset.tipo;
    if (mov.tipo === "ajuste") campoMov("cantidad").value = stockDe(mov.id) ?? 0;
    pintarMov();
  });
  formMov.addEventListener("click", (e) => {
    const b = e.target.closest("[data-cant]");
    if (b) {
      campoMov("cantidad").value = Math.max(0, (Number(campoMov("cantidad").value) || 0) + Number(b.dataset.cant));
      pintarMov();
    }
    if (e.target.closest("[data-cerrar-mov]")) cerrarMovimiento();
  });
  campoMov("cantidad").addEventListener("input", pintarMov);
  $("dialogo-mov").addEventListener("click", (e) => {
    if (e.target === $("dialogo-mov")) cerrarMovimiento();
  });

  formMov.addEventListener("submit", async (e) => {
    e.preventDefault();
    const { cant, nuevo } = stockResultante();
    if (mov.tipo !== "ajuste" && cant === 0) {
      $("mov-error").textContent = "La cantidad debe ser mayor que 0.";
      $("mov-error").classList.remove("hidden");
      return;
    }
    const boton = $("btn-mov");
    boton.disabled = true;
    const { error } = await cliente.from("inventario_movimientos").insert({
      producto_id: mov.id,
      tipo: mov.tipo,
      cantidad: cant,
      nota: campoMov("nota").value.trim() || null,
    });
    boton.disabled = false;
    if (error) {
      $("mov-error").textContent = mensajeError(error);
      $("mov-error").classList.remove("hidden");
      return;
    }

    const p = estado.productos.find((x) => x.id === mov.id);
    if (nuevo === 0 && p.status && campoMov("ocultar").checked) {
      await cliente.from("product").update({ status: false }).eq("id", mov.id);
      avisar(`${TIPOS[mov.tipo].texto} registrada. “${p.nombre}” quedó agotado y se ocultó del catálogo.`);
    } else {
      avisar(`${TIPOS[mov.tipo].texto} registrada: “${p.nombre}” ahora tiene ${nuevo} pieza${nuevo === 1 ? "" : "s"}.`);
    }
    cerrarMovimiento();
    cargarTodo();
  });

  // ------------------------------ Exportar CSV ------------------------------
  $("btn-csv").addEventListener("click", () => {
    const celda = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const encabezado = ["Código", "Nombre", "Categoría", "Municipio", "Departamento", "Color", "Visible", "Stock", "Avisar en", "Costo", "Precio", "Valor a costo", "Valor a precio", "Artesana"];
    const filas = estado.productos.map((p) => {
      const inv = estado.inventario.get(p.id) || {};
      const stock = inv.stock ?? 0;
      return [p.id, p.nombre, p.categoria, p.municipio, p.departamento, p.color, p.status ? "Sí" : "No", stock, inv.punto_reorden ?? "", inv.costo ?? "", p.precio ?? "",
        inv.costo != null ? stock * inv.costo : "", p.precio != null ? stock * p.precio : "", inv.artesana ?? ""];
    });
    // Punto y coma: Excel en español lo abre en columnas directamente
    const csv = "﻿" + [encabezado, ...filas].map((f) => f.map(celda).join(";")).join("\r\n");
    const enlace = document.createElement("a");
    enlace.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    enlace.download = `inventario-raicesgt-${new Date().toISOString().slice(0, 10)}.csv`;
    enlace.click();
    setTimeout(() => URL.revokeObjectURL(enlace.href), 1000);
  });

  // ============================ Teclado e inicio ===========================
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!$("dialogo-confirmar").classList.contains("hidden")) return $("confirmar-no").click();
    if (!$("dialogo-mov").classList.contains("hidden")) return cerrarMovimiento();
    if (!$("editor").classList.contains("hidden")) cerrarEditor();
  });

  cliente.auth.onAuthStateChange((evento) => {
    if (evento === "SIGNED_OUT") mostrarLogin();
  });
  mostrarSegunSesion();
})();
