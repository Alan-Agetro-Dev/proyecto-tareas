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

// NUEVO: cambia una tarea de pendiente a completada (y al revés)
function alternarCompletada(id) {
  // find devuelve la primera tarea cuyo id coincide, o undefined si no existe
  const tarea = tareas.find((t) => t.id === id);

  if (tarea) {
    tarea.completada = !tarea.completada; // ! invierte true/false
  }

  renderizar(); // vuelve a dibujar la lista con el estado actualizado
}

// NUEVO: elimina una tarea del arreglo según su id
function eliminarTarea(id) {
  // findIndex devuelve la posición de la tarea en el arreglo, o -1 si no existe
  const indice = tareas.findIndex((t) => t.id === id);

  if (indice !== -1) {
    tareas.splice(indice, 1); // splice quita 1 elemento a partir de esa posición
  }

  renderizar(); // vuelve a dibujar la lista sin la tarea eliminada
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
formTarea.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const titulo = inputTitulo.value.trim();
  const fechaLimite = inputFecha.value;

  if (titulo === "") {
    return;
  }

  tareas.push({
    id: siguienteId,
    titulo: titulo,
    fechaLimite: fechaLimite,
    completada: false,
  });
  siguienteId++;

  renderizar();

  formTarea.reset();
  inputTitulo.focus();
});

 // ===== Clic en un filtro (fuera del formulario, se registra una sola vez)=====
botonesFiltro.forEach((boton) => {
  boton.addEventListener("click", () => {
    filtroActual = boton.dataset.filtro; // lee el data-filtro del HTML

    // Deja la clase "activo" solo en el botón pulsado
    botonesFiltro.forEach((b) => b.classList.toggle("activo", b === boton));

    renderizar();
  });
});


// Convierte una tarea de la API de prueba ({ userId, id, title, completed })
// al formato que usa nuestra aplicación
function convertirTareaRemota(remota) {
  return {
    id: remota.id,
    titulo: remota.title,
    fechaLimite: "", // la API de prueba no trae fecha
    completada: remota.completed,
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