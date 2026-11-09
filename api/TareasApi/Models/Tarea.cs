namespace TareasApi.Models;

// Representa una tarea. Tiene los mismos datos que ya usa la web:
// id, titulo, fechaLimite y completada (en JSON los nombres viajan en camelCase).
public class Tarea
{
    public int Id { get; set; }

    // string.Empty evita que el título sea null por accidente
    public string Titulo { get; set; } = string.Empty;

    // El "?" indica que la fecha es opcional: puede ser null
    public DateOnly? FechaLimite { get; set; }

    public bool Completada { get; set; }
}