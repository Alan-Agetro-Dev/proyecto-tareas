using Microsoft.AspNetCore.Mvc;
using TareasApi.Models;

namespace TareasApi.Controllers;

[ApiController]
[Route("api/[controller]")] // [controller] toma el nombre de la clase: la ruta es /api/tareas
public class TareasController : ControllerBase
{
    // Lista en memoria, solo de ejemplo. Más adelante vendrá de SQL Server.
    private static readonly List<Tarea> _tareas = new()
    {
        new Tarea { Id = 1, Titulo = "Repasar async/await en JavaScript", FechaLimite = new DateOnly(2026, 11, 15), Completada = false },
        new Tarea { Id = 2, Titulo = "Instalar el SDK de .NET", Completada = true },
        new Tarea { Id = 3, Titulo = "Crear la base de datos en SQL Server", FechaLimite = new DateOnly(2026, 11, 30), Completada = false },
    };

    // GET /api/tareas
    [HttpGet]
    public ActionResult<IEnumerable<Tarea>> ObtenerTodas()
    {
        return Ok(_tareas); // Ok devuelve el código HTTP 200 con la lista convertida a JSON
    }
}