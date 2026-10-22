console.log("app.js cargado correctamente");

// ===== Referencias a los elementos del HTML (buscados por su id) =====
const formTarea = document.getElementById("form-tarea");
const inputTitulo = document.getElementById("titulo");
const inputFecha = document.getElementById("fecha-limite");

// ===== Envío del formulario =====
// "submit" ocurre al pulsar el botón "Agregar tarea" o al dar Enter en el campo
formTarea.addEventListener("submit", (evento) => {
  // Evita que el navegador recargue la página (su comportamiento por defecto)
  evento.preventDefault();

  // .trim() quita los espacios al inicio y al final del texto
  const titulo = inputTitulo.value.trim();
  const fechaLimite = inputFecha.value; // viene como "2026-10-30", o vacío si no se eligió

  // Si solo escribieron espacios, no hacemos nada
  if (titulo === "") {
    return;
  }

  // Por ahora solo mostramos los datos en la consola
  console.log("Nueva tarea:", { titulo, fechaLimite });

  // Limpia el formulario y deja el cursor listo para la siguiente tarea
  formTarea.reset();
  inputTitulo.focus();
});