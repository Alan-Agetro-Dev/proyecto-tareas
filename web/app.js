// app.js: la lógica de la lista de tareas.

console.log("app.js cargado correctamente");

// ===== Referencias a los elementos del HTML (buscados por su id) =====
const formTarea = document.getElementById("form-tarea");
const inputTitulo = document.getElementById("titulo");
const inputFecha = document.getElementById("fecha-limite");
const listaTareas = document.getElementById("lista-tareas");
const contadorPendientes = document.getElementById("contador-pendientes");
const mensajeEstado = document.getElementById("mensaje-estado");
const mensajeVacio = document.getElementById("mensaje-vacio");
const botonesFiltro = document.querySelectorAll(".filtro");

// ===== Estado: aquí viven las tareas mientras la página está abierta =====
const tareas = [];
let siguienteId = 1;
let filtroActual = "todas"; // NUEVO: "todas", "pendientes" o "completadas"

// ===== Convierte "2026-10-30" en "30/10/2026" =====
function formatearFecha(fecha) {
  const [anio, mes, dia] = fecha.split("-");
  return `${dia}/${mes}/${anio}`;
}

// Cambia una tarea entre pendiente y completada, y guarda el cambio en la API
async function alternarCompletada(id) {
  // find devuelve la primera tarea cuyo id coincide, o undefined si no existe
  const tarea = tareas.find((t) => t.id === id);

  if (!tarea) {
    return;
  }

  try {
    // Mandamos a la API una copia de la tarea con el estado contrario al actual
    await actualizarTareaRemota({ ...tarea, completada: !tarea.completada });

    // Solo si la API aceptó el cambio, lo reflejamos en el estado de la web
    tarea.completada = !tarea.completada;
    mostrarEstado(""); // limpia un posible mensaje de error anterior
  } catch (error) {
    console.error("No se pudo actualizar la tarea:", error);
    mostrarEstado("No se pudo guardar el cambio. Intenta de nuevo.", true);
  }

  // Se dibuja siempre: si falló, la casilla vuelve a mostrar su estado real
  renderizar();
}

// ===== Crea el elemento <li> de una tarea =====
function crearElementoTarea(tarea) {
  const li = document.createElement("li");
  li.className = tarea.completada ? "tarea completada" : "tarea";

  // Casilla para marcar la tarea
  const check = document.createElement("input");
  check.type = "checkbox";
  check.id = `tarea-${tarea.id}`;
  check.className = "tarea-check";
  check.checked = tarea.completada;

  // NUEVO: cuando el usuario marca o desmarca la casilla, actualizamos la tarea
  check.addEventListener("change", () => alternarCompletada(tarea.id));

  // Texto de la tarea (enlazado a la casilla con htmlFor)
  const label = document.createElement("label");
  label.htmlFor = check.id;
  label.className = "tarea-titulo";
  label.append(tarea.titulo); // append con texto es seguro: no interpreta HTML

  // Fecha límite, solo si se eligió una
  if (tarea.fechaLimite !== "") {
    const fecha = document.createElement("small");
    fecha.className = "tarea-fecha";
    fecha.textContent = `Vence: ${formatearFecha(tarea.fechaLimite)}`;
    label.append(fecha);
  }

  // Botón de eliminar
  const btnEliminar = document.createElement("button");
  btnEliminar.type = "button";
  btnEliminar.className = "btn-eliminar";
  btnEliminar.setAttribute("aria-label", "Eliminar tarea");
  btnEliminar.textContent = "Eliminar";

  // NUEVO: al hacer clic, elimina esta tarea
  btnEliminar.addEventListener("click", () => eliminarTarea(tarea.id));

  li.append(check, label, btnEliminar);
  return li;
}

// NUEVO: devuelve solo las tareas que corresponden al filtro elegido
function obtenerTareasVisibles() {
  if (filtroActual === "pendientes") {
    return tareas.filter((t) => !t.completada);
  }
  if (filtroActual === "completadas") {
    return tareas.filter((t) => t.completada);
  }
  return tareas;
}

// ===== Dibuja en la página todo lo que hay en el arreglo =====
function renderizar() {
  listaTareas.innerHTML = ""; // vacía la lista

   obtenerTareasVisibles().forEach((tarea) => {
    listaTareas.append(crearElementoTarea(tarea));
  });

   // NUEVO: cuenta las tareas que todavía no están completadas
  const pendientes = tareas.filter((t) => !t.completada).length;
  contadorPendientes.textContent = pendientes;

    // NUEVO: muestra el mensaje solo cuando no hay ninguna tarea
  mensajeVacio.hidden = tareas.length > 0;
}

// ===== Envío del formulario =====
// ===== Envío del formulario =====
formTarea.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const titulo = inputTitulo.value.trim();
  const fechaLimite = inputFecha.value;

  if (titulo === "") {
    return;
  }

  try {
    // Guarda la tarea en la API; devuelve la tarea creada, ya con su id real
    const creada = await crearTareaRemota({ titulo, fechaLimite, completada: false });

    // La agregamos al estado en el formato de la web y dibujamos la lista
    tareas.push(convertirTareaRemota(creada));
    mostrarEstado(""); // limpia un posible mensaje de error anterior
    renderizar();

    // Solo si salió bien, limpiamos el formulario
    formTarea.reset();
    inputTitulo.focus();
  } catch (error) {
    console.error("No se pudo crear la tarea:", error);
    mostrarEstado("No se pudo guardar la tarea. Intenta de nuevo.", true);
  }
  
});

// Actualiza una tarea en la API (PUT). La API responde 204 sin cuerpo, así que no devuelve nada
async function actualizarTareaRemota(tarea) {
  // El id va en la dirección: /api/tareas/2
  const respuesta = await fetch(`${URL_API}/${tarea.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      titulo: tarea.titulo,
      // La API espera null cuando no hay fecha; en la web usamos "" para "sin fecha"
      fechaLimite: tarea.fechaLimite === "" ? null : tarea.fechaLimite,
      completada: tarea.completada,
    }),
  });

  if (!respuesta.ok) {
    throw new Error(`Error HTTP ${respuesta.status}`);
  }
}


 // ===== Clic en un filtro (fuera del formulario, se registra una sola vez)=====
botonesFiltro.forEach((boton) => {
  boton.addEventListener("click", () => {
    filtroActual = boton.dataset.filtro; // lee el data-filtro del HTML

    // Deja la clase "activo" solo en el botón pulsado
    botonesFiltro.forEach((b) => b.classList.toggle("activo", b === boton));

    renderizar();
  });
});


// Adapta una tarea de la API ({ id, titulo, fechaLimite, completada })
// al formato que usa nuestra aplicación
function convertirTareaRemota(remota) {
  return {
    id: remota.id,
    titulo: remota.titulo,
    // La API manda null cuando no hay fecha; en la web usamos "" para "sin fecha"
    fechaLimite: remota.fechaLimite ?? "",
    completada: remota.completada,
  };
}

// Muestra un mensaje de estado; con texto vacío lo oculta
function mostrarEstado(texto, esError = false) {
  mensajeEstado.textContent = texto;
  mensajeEstado.classList.toggle("error", esError);
  mensajeEstado.hidden = texto === "";
}

// Pide las tareas a la API y las agrega al estado
async function cargarTareasIniciales() {
  // Mientras carga: lista vacía, sin mensaje de "no hay tareas" y aviso de carga
  listaTareas.innerHTML = "";
  mensajeVacio.hidden = true;
  mostrarEstado("Cargando tareas...");

  try {
    const remotas = await obtenerTareasRemotas();
    remotas.forEach((remota) => tareas.push(convertirTareaRemota(remota)));

    // El próximo id debe ser mayor que cualquier id que ya exista
    siguienteId = Math.max(0, ...tareas.map((t) => t.id)) + 1;

    mostrarEstado(""); // todo salió bien: oculta el mensaje
  } catch (error) {
    console.error("No se pudieron cargar las tareas:", error);
    mostrarEstado("No se pudieron cargar las tareas. Revisa tu conexión.", true);
  } finally {
    renderizar(); // se ejecuta siempre, haya salido bien o mal
  }
}

// Dibujo inicial al cargar la página
renderizar();
cargarTareasIniciales();