// api.js: funciones que hablan con una API por HTTP.
// Por ahora use una API pública de prueba; luego la cambiare por una creada en C#.

const URL_API_PRUEBA = "https://jsonplaceholder.typicode.com/todos";

// async: la función trabaja con promesas y siempre devuelve una promesa
async function obtenerTareasRemotas(limite = 5) {
  // await espera la respuesta del servidor sin congelar la página
  const respuesta = await fetch(`${URL_API_PRUEBA}?_limit=${limite}`);

  // fetch solo falla por problemas de red; un 404 o un 500 NO lanzan error solos
  if (!respuesta.ok) {
    throw new Error(`Error HTTP ${respuesta.status}`);
  }

  // .json() convierte el texto JSON de la respuesta en objetos de JavaScript
  const datos = await respuesta.json();
  return datos;
}