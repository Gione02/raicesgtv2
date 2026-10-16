// ============================================================================
// PANEL DE ADMINISTRACIÓN DEL CATÁLOGO (Supabase)
// - Inicia sesión con Supabase Auth (usuarios creados en el panel de Supabase).
// - Solo los correos de la tabla `administradores` pueden editar (ver supabase/01_esquema.sql).
// - Crea, edita, oculta y elimina productos de la tabla `product`.
// - Sube las fotos al bucket público "catalogo".
// Requiere supabase-js, js/config.js y js/datos.js.
// ============================================================================
(function () {
  const DEPARTAMENTOS = [
    "Alta Verapaz", "Baja Verapaz", "Chimaltenango", "Chiquimula", "El Progreso", "Escuintla",
    "Guatemala", "Huehuetenango", "Izabal", "Jalapa", "Jutiapa", "Petén", "Quetzaltenango",
    "Quiché", "Retalhuleu", "Sacatepéquez", "San Marcos", "Santa Rosa", "Sololá",
    "Suchitepéquez", "Totonicapán", "Zacapa",
  ];
  const CATEGORIAS = ["Traje", "Traje de gala", "Huipil", "Blusa", "Corte"];
  const COLUMNAS = "id,nombre,descripcion,categoria,municipio,departamento,color,precio,imagen,status";

  const cliente = supabase.createClient(SITIO.supabase.url, SITIO.supabase.clave);
  const bucket = SITIO.supabase.bucketFotos;

  let lista = [];

  // ---------------- Utilidades ----------------
  const $ = (id) => document.getElementById(id);
  function escaparHTML(texto) {
    return String(texto ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  }
  function normalizar(texto) {
    return String(texto ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
  }
  // "Traje Rojo (2).JPG" -> "traje-rojo-2-k3x9.jpg" (sufijo para no sobrescribir otra foto)
  function nombreArchivoSeguro(nombre) {
    const punto = nombre.lastIndexOf(".");
    const base = punto > 0 ? nombre.slice(0, punto) : nombre;
    const ext = punto > 0 ? nombre.slice(punto + 1).toLowerCase() : "jpg";
    const limpio = normalizar(base).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "foto";
    return `${limpio}-${Date.now().toString(36)}.${ext}`;
  }

  function mostrarAviso(texto, tipo = "ok") {
    const aviso = $("aviso");
    aviso.textContent = texto;
    aviso.className =
      "rounded-xl px-5 py-3 text-sm font-medium " +
      (tipo === "error" ? "bg-error-container text-on-error-container" : "bg-tertiary-fixed/40 text-on-tertiary-fixed-variant");
    clearTimeout(mostrarAviso.t);
    mostrarAviso.t = setTimeout(() => aviso.classList.add("hidden"), 6000);
  }

  // Traduce los errores más comunes de Supabase
  function mensajeError(error) {
    const m = String(error?.message || error || "");
    if (/Invalid login credentials/i.test(m)) return "Correo o contraseña incorrectos.";
    if (/Email not confirmed/i.test(m)) return "Este correo aún no ha sido confirmado.";
    if (/row-level security|permission denied/i.test(m)) return "Tu cuenta no tiene permiso para hacer esto. Pide que agreguen tu correo a la tabla administradores.";
    if (/Failed to fetch|NetworkError/i.test(m)) return "No hay conexión con Supabase. Revisa tu internet.";
    return m || "Ocurrió un error inesperado.";
  }

  // ---------------- Sesión ----------------
  async function mostrarSegunSesion() {
    const { data } = await cliente.auth.getSession();
    const sesion = data.session;
    if (!sesion) {
      $("vista-login").classList.remove("hidden");
      $("vista-panel").classList.add("hidden");
      $("btn-salir").classList.add("hidden");
      $("usuario-actual").textContent = "";
      return;
    }

    const { data: esAdmin, error } = await cliente.rpc("es_admin");
    if (error || !esAdmin) {
      await cliente.auth.signOut();
      $("vista-login").classList.remove("hidden");
      $("vista-panel").classList.add("hidden");
      $("error-login").textContent = error
        ? mensajeError(error)
        : `La cuenta ${sesion.user.email} no está autorizada como administrador.`;
      $("error-login").classList.remove("hidden");
      return;
    }

    $("vista-login").classList.add("hidden");
    $("vista-panel").classList.remove("hidden");
    $("btn-salir").classList.remove("hidden");
    $("usuario-actual").textContent = sesion.user.email;
    await cargarLista();
  }

  $("form-login").addEventListener("submit", async (e) => {
    e.preventDefault();
    const boton = e.target.querySelector("button[type=submit]");
    const datos = new FormData(e.target);
    $("error-login").classList.add("hidden");
    boton.disabled = true;
    const { error } = await cliente.auth.signInWithPassword({
      email: String(datos.get("email")).trim(),
      password: String(datos.get("password")),
    });
    boton.disabled = false;
    if (error) {
      $("error-login").textContent = mensajeError(error);
      $("error-login").classList.remove("hidden");
      return;
    }
    e.target.reset();
    mostrarSegunSesion();
  });

  $("btn-salir").addEventListener("click", async () => {
    await cliente.auth.signOut();
    mostrarSegunSesion();
  });

  // ---------------- Lista ----------------
  async function cargarLista() {
    $("lista").innerHTML = `<li class="px-5 py-10 text-center text-on-surface-variant">Cargando…</li>`;
    const { data, error } = await cliente.from("product").select(COLUMNAS).order("id");
    if (error) {
      $("lista").innerHTML = "";
      mostrarAviso(mensajeError(error), "error");
      return;
    }
    lista = data;
    actualizarCategorias();
    pintarLista();
  }

  function pintarLista() {
    const texto = normalizar($("buscar").value);
    const visibles = lista.filter(
      (p) => !texto || [p.nombre, p.municipio, p.departamento, p.categoria, p.color, p.id].some((c) => normalizar(c).includes(texto))
    );
    const ocultos = lista.filter((p) => !p.status).length;
    $("total").textContent = `${visibles.length} de ${lista.length}` + (ocultos ? ` · ${ocultos} ocultos` : "");

    $("lista").innerHTML =
      visibles
        .map(
          (p) => `
      <li class="flex items-center gap-4 px-5 py-3 hover:bg-surface-container-low/60 ${p.status ? "" : "opacity-60"}">
        <img src="${escaparHTML(urlImagenProducto(p.imagen))}" alt="" loading="lazy" class="w-14 h-16 object-cover rounded-md bg-surface-container shrink-0" onerror="this.style.visibility='hidden'" />
        <div class="min-w-0 flex-grow">
          <div class="font-semibold truncate">${escaparHTML(p.nombre)} <span class="text-xs font-normal text-outline">#${p.id}</span>
            ${p.status ? "" : `<span class="ml-1 text-xs font-bold uppercase text-error">Oculto</span>`}
          </div>
          <div class="text-sm text-on-surface-variant truncate">${escaparHTML(p.categoria)} · ${escaparHTML(p.municipio)}, ${escaparHTML(p.departamento)} · ${escaparHTML(p.color)}</div>
        </div>
        <div class="hidden sm:block text-sm font-semibold text-primary w-24 text-right">${p.precio != null ? "Q" + Number(p.precio).toLocaleString("es-GT") : ""}</div>
        <div class="flex gap-1 shrink-0">
          <button type="button" data-editar="${p.id}" class="px-3 py-1.5 rounded-lg text-sm font-semibold text-secondary hover:bg-secondary-fixed">Editar</button>
          <button type="button" data-eliminar="${p.id}" class="px-3 py-1.5 rounded-lg text-sm font-semibold text-error hover:bg-error-container">Eliminar</button>
        </div>
      </li>`
        )
        .join("") || `<li class="px-5 py-10 text-center text-on-surface-variant">No hay productos que coincidan.</li>`;
  }

  $("lista").addEventListener("click", async (e) => {
    const editar = e.target.closest("[data-editar]");
    const eliminar = e.target.closest("[data-eliminar]");
    if (editar) abrirFormulario(lista.find((p) => p.id === Number(editar.dataset.editar)));
    if (eliminar) {
      const p = lista.find((x) => x.id === Number(eliminar.dataset.eliminar));
      if (!p) return;
      const mensaje = `¿Eliminar "${p.nombre}" (#${p.id}) definitivamente?\n\nSi solo quieres que no se vea, edítalo y desmarca "Visible en el catálogo".`;
      if (!confirm(mensaje)) return;
      const { error } = await cliente.from("product").delete().eq("id", p.id);
      if (error) return mostrarAviso(mensajeError(error), "error");
      mostrarAviso(`"${p.nombre}" fue eliminado.`);
      cargarLista();
    }
  });
  $("buscar").addEventListener("input", pintarLista);
  $("btn-recargar").addEventListener("click", cargarLista);

  // ---------------- Formulario ----------------
  const panel = $("panel");
  const form = $("form");
  const campo = (nombre) => form.elements.namedItem(nombre); // evita choques con propiedades del form
  let archivoElegido = null;
  let editandoId = null;

  campo("departamento").innerHTML = DEPARTAMENTOS.map((d) => `<option>${d}</option>`).join("");

  function actualizarCategorias() {
    const categorias = [...new Set([...CATEGORIAS, ...lista.map((p) => p.categoria).filter(Boolean)])];
    $("lista-categorias").innerHTML = categorias.map((c) => `<option value="${escaparHTML(c)}">`).join("");
  }

  function mostrarVistaPrevia(src) {
    const img = $("vista-previa");
    if (!src) {
      img.classList.add("hidden");
      $("sin-imagen").classList.remove("hidden");
      return;
    }
    img.src = src;
    img.classList.remove("hidden");
    $("sin-imagen").classList.add("hidden");
  }

  function abrirFormulario(producto) {
    editandoId = producto ? producto.id : null;
    archivoElegido = null;
    $("archivo").value = "";
    $("errores").classList.add("hidden");
    $("panel-titulo").textContent = producto ? `Editar producto #${producto.id}` : "Nuevo producto";

    const datos = producto || { nombre: "", categoria: "", color: "", municipio: "", departamento: "Guatemala", precio: "", descripcion: "", status: true, imagen: "" };
    ["nombre", "categoria", "color", "municipio", "precio", "descripcion"].forEach((c) => (campo(c).value = datos[c] ?? ""));
    if (!DEPARTAMENTOS.includes(datos.departamento) && datos.departamento) {
      campo("departamento").insertAdjacentHTML("afterbegin", `<option>${escaparHTML(datos.departamento)}</option>`);
    }
    campo("departamento").value = datos.departamento || "Guatemala";
    campo("status").checked = datos.status !== false;
    mostrarVistaPrevia(datos.imagen ? urlImagenProducto(datos.imagen) : "");

    panel.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    campo("nombre").focus();
  }

  function cerrarFormulario() {
    panel.classList.add("hidden");
    document.body.style.overflow = "";
  }

  panel.addEventListener("click", (e) => {
    if (e.target === panel || e.target.closest("[data-cerrar]")) cerrarFormulario();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !panel.classList.contains("hidden")) cerrarFormulario();
  });

  $("archivo").addEventListener("change", () => {
    archivoElegido = $("archivo").files[0] || null;
    if (archivoElegido) mostrarVistaPrevia(URL.createObjectURL(archivoElegido));
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const datos = {};
    ["nombre", "categoria", "color", "municipio", "departamento", "descripcion"].forEach((c) => (datos[c] = String(campo(c).value).trim()));
    datos.precio = campo("precio").value === "" ? null : Number(campo("precio").value);
    datos.status = campo("status").checked;

    const problemas = [];
    ["nombre", "categoria", "color", "municipio", "departamento", "descripcion"].forEach((c) => {
      if (!datos[c]) problemas.push(`Falta llenar: ${c}.`);
    });
    if (datos.precio !== null && (!Number.isFinite(datos.precio) || datos.precio < 0)) problemas.push("El precio debe ser un número válido.");
    if (normalizar(datos.descripcion) === normalizar(datos.nombre)) problemas.push("La descripción no debe ser igual al nombre.");
    if (!editandoId && !archivoElegido) problemas.push("Elige una foto para el producto nuevo.");
    if (archivoElegido && archivoElegido.size > 8 * 1024 * 1024) problemas.push("La foto pesa más de 8 MB.");

    if (problemas.length) {
      $("errores").innerHTML = problemas.map(escaparHTML).join("<br>");
      $("errores").classList.remove("hidden");
      return;
    }

    const boton = $("btn-guardar");
    boton.disabled = true;
    boton.textContent = "Guardando…";
    try {
      if (archivoElegido) {
        const nombreFoto = nombreArchivoSeguro(archivoElegido.name);
        const { error } = await cliente.storage.from(bucket).upload(nombreFoto, archivoElegido, {
          contentType: archivoElegido.type,
          upsert: false,
        });
        if (error) throw error;
        datos.imagen = nombreFoto;
      }

      const consulta = editandoId
        ? cliente.from("product").update(datos).eq("id", editandoId)
        : cliente.from("product").insert(datos);
      const { error } = await consulta;
      if (error) throw error;

      cerrarFormulario();
      mostrarAviso(editandoId ? `"${datos.nombre}" fue actualizado.` : `"${datos.nombre}" fue agregado al catálogo.`);
      cargarLista();
    } catch (error) {
      $("errores").textContent = mensajeError(error);
      $("errores").classList.remove("hidden");
    } finally {
      boton.disabled = false;
      boton.textContent = "Guardar";
    }
  });

  $("btn-nuevo").addEventListener("click", () => abrirFormulario(null));

  // ---------------- Inicio ----------------
  cliente.auth.onAuthStateChange((evento) => {
    if (evento === "SIGNED_OUT") mostrarSegunSesion();
  });
  mostrarSegunSesion();
})();
