// app.js: la lógica de la lista de tareas.

console.log("app.js cargado correctamente");

// ===== Referencias a los elementos del HTML (buscados por su id) =====
const formTarea = document.getElementById("form-tarea");
const inputTitulo = document.getElementById("titulo");
const inputFecha = document.getElementById("fecha-limite");

// ===== Estado: aquí viven las tareas mientras la página está abierta =====
const tareas = [];      // arreglo (lista) de objetos, uno por tarea
let siguienteId = 1;    // contador para darle un id único a cada tarea

// ===== Envío del formulario =====
formTarea.addEventListener("submit", (evento) => {
  // Evita que el navegador recargue la página
  evento.preventDefault();

  const titulo = inputTitulo.value.trim();
  const fechaLimite = inputFecha.value; // "2026-10-30", o vacío si no se eligió

  // Si solo escribieron espacios, no hacemos nada
  if (titulo === "") {
    return;
  }

  // Un objeto con todos los datos de la tarea
  const nuevaTarea = {
    id: siguienteId,
    titulo: titulo,
    fechaLimite: fechaLimite,
    completada: false,
  };
  siguienteId++;

  // Agrega la tarea al final del arreglo
  tareas.push(nuevaTarea);

  // console.table muestra el arreglo como una tabla en la consola
  console.table(tareas);

  // Limpia el formulario y deja el cursor listo para la siguiente tarea
  formTarea.reset();
  inputTitulo.focus();
});