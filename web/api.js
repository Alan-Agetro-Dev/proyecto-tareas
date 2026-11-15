// api.js: funciones que hablan con la API por HTTP.
// Ahora usamos nuestra propia API en C# (ASP.NET Core).

const URL_API = "http://localhost:5126/api/tareas";

// async: la función trabaja con promesas y siempre devuelve una promesa
async function obtenerTareasRemotas() {
  // await espera la respuesta del servidor sin congelar la página
  const respuesta = await fetch(URL_API);
 
  if (!respuesta.ok) {
    throw new Error(`Error HTTP ${respuesta.status}`);
  }

  // La API responde 201 con la tarea creada en el cuerpo
  return await respuesta.json();
}

 // Envía una tarea nueva a la API (POST) y devuelve la tarea creada, ya con su id
async function crearTareaRemota(tarea) {
  const respuesta = await fetch(URL_API, {
    method: "POST",
    // Avisa a la API que el cuerpo de la petición es JSON
    headers: { "Content-Type": "application/json" },
    // JSON.stringify convierte el objeto de JavaScript en texto JSON
    body: JSON.stringify({
      titulo: tarea.titulo,
      // La API espera null cuando no hay fecha; en la web usamos "" para "sin fecha"
      fechaLimite: tarea.fechaLimite === "" ? null : tarea.fechaLimite,
      completada: tarea.completada,
    }),
  });
  
  // fetch solo falla por problemas de red; un 404 o un 500 NO lanzan error solos
  if (!respuesta.ok) {
    throw new Error(`Error HTTP ${respuesta.status}`);
  }

  // .json() convierte el texto JSON de la respuesta en objetos de JavaScript
  return await respuesta.json();
}