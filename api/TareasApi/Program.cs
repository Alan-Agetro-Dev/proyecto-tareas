var builder = WebApplication.CreateBuilder(args);
// Nombre de la política de CORS que vamos a usar
const string PoliticaWeb = "PermitirWeb";

// CORS: lista de direcciones (orígenes) que pueden llamar a la API desde un navegador
builder.Services.AddCors(opciones =>
{
    opciones.AddPolicy(PoliticaWeb, politica =>
    {
        politica.WithOrigins("http://127.0.0.1:5500", "http://localhost:5500")
                .AllowAnyHeader()   // por ejemplo, Content-Type: application/json
                .AllowAnyMethod();  // GET, POST, PUT y DELETE
    });
});

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// Activa la política de CORS (debe ir antes de UseAuthorization y MapControllers)
app.UseCors(PoliticaWeb);

app.UseAuthorization();

app.MapControllers();

app.Run();
