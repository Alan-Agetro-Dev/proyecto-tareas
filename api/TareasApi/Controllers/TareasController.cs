using Microsoft.AspNetCore.Mvc;
using TareasApi.Models;

namespace TareasApi.Controllers;

[ApiController]
[Route("api/[controller]")] // la ruta es /api/tareas
public class TareasController : ControllerBase
{
    // Lista en memoria, solo de ejemplo. Más adelante vendrá de SQL Server.
    private static readonly List<Tarea> _tareas = new()
    {
        new Tarea { Id = 1, Titulo = "Repasar async/await en JavaScript", FechaLimite = new DateOnly(2026, 11, 15), Completada = false },
        new Tarea { Id = 2, Titulo = "Instalar el SDK de .NET", Completada = true },
        new Tarea { Id = 3, Titulo = "Crear la base de datos en SQL Server", FechaLimite = new DateOnly(2026, 11, 30), Completada = false },
    };

    // Contador para dar un id único a cada tarea nueva
    private static int _siguienteId = 4;

    // GET /api/tareas
    [HttpGet]
    public ActionResult<IEnumerable<Tarea>> ObtenerTodas()
    {
        return Ok(_tareas); // 200 con la lista en JSON
    }

    // GET /api/tareas/2
    // {id:int} exige que el id sea un número entero
    [HttpGet("{id:int}")]
    public ActionResult<Tarea> ObtenerPorId(int id)
    {
        // FirstOrDefault (LINQ) devuelve la primera tarea que cumple, o null si no hay
        var tarea = _tareas.FirstOrDefault(t => t.Id == id);

        if (tarea is null)
        {
            return NotFound(); // 404
        }

        return Ok(tarea);
    }

    // POST /api/tareas
    // El cuerpo de la petición (JSON) se convierte automáticamente en un objeto Tarea
    [HttpPost]
    public ActionResult<Tarea> Crear(Tarea nueva)
    {
        nueva.Id = _siguienteId++; // el servidor decide el id, no el cliente
        _tareas.Add(nueva);

        // 201 Created, con la dirección de la tarea nueva y la tarea en el cuerpo
        return CreatedAtAction(nameof(ObtenerPorId), new { id = nueva.Id }, nueva);
    }

    // PUT /api/tareas/2
    [HttpPut("{id:int}")]
    public IActionResult Actualizar(int id, Tarea datos)
    {
        var tarea = _tareas.FirstOrDefault(t => t.Id == id);

        if (tarea is null)
        {
            return NotFound();
        }

        tarea.Titulo = datos.Titulo;
        tarea.FechaLimite = datos.FechaLimite;
        tarea.Completada = datos.Completada;

        return NoContent(); // 204: se hizo, y no hay nada que devolver
    }

    // DELETE /api/tareas/2
    [HttpDelete("{id:int}")]
    public IActionResult Eliminar(int id)
    {
        var tarea = _tareas.FirstOrDefault(t => t.Id == id);

        if (tarea is null)
        {
            return NotFound();
        }

        _tareas.Remove(tarea);

        return NoContent();
    }
}