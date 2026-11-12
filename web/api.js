// api.js: funciones que hablan con la API por HTTP.
// Ahora usamos nuestra propia API en C# (ASP.NET Core).

const URL_API = "http://localhost:5126/api/tareas";

// async: la función trabaja con promesas y siempre devuelve una promesa
async function obtenerTareasRemotas() {
  // await espera la respuesta del servidor sin congelar la página
  const respuesta = await fetch(URL_API);

  // fetch solo falla por problemas de red; un 404 o un 500 NO lanzan error solos
  if (!respuesta.ok) {
    throw new Error(`Error HTTP ${respuesta.status}`);
  }

  // .json() convierte el texto JSON de la respuesta en objetos de JavaScript
  return await respuesta.json();
}