// app.js: la lógica de la lista de tareas.

console.log("app.js cargado correctamente");

// ===== Referencias a los elementos del HTML (buscados por su id) =====
const formTarea = document.getElementById("form-tarea");
const inputTitulo = document.getElementById("titulo");
const inputFecha = document.getElementById("fecha-limite");
const listaTareas = document.getElementById("lista-tareas");

// ===== Estado: aquí viven las tareas mientras la página está abierta =====
const tareas = [];
let siguienteId = 1;

// ===== Convierte "2026-10-30" en "30/10/2026" =====
function formatearFecha(fecha) {
  const [anio, mes, dia] = fecha.split("-");
  return `${dia}/${mes}/${anio}`;
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

  // Botón de eliminar (se activará en el Día 12)
  const btnEliminar = document.createElement("button");
  btnEliminar.type = "button";
  btnEliminar.className = "btn-eliminar";
  btnEliminar.setAttribute("aria-label", "Eliminar tarea");
  btnEliminar.textContent = "Eliminar";

  li.append(check, label, btnEliminar);
  return li;
}

// ===== Dibuja en la página todo lo que hay en el arreglo =====
function renderizar() {
  listaTareas.innerHTML = ""; // vacía la lista (también quita las tareas de ejemplo)

  tareas.forEach((tarea) => {
    listaTareas.append(crearElementoTarea(tarea));
  });
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

  renderizar(); // actualiza la pantalla con el nuevo estado

  formTarea.reset();
  inputTitulo.focus();
});

// Dibujo inicial al cargar la página
renderizar();