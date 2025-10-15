using Microsoft.Data.Sqlite;
using GrabABook.API.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://127.0.0.1:5500", "http://localhost:5500", "null")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// Add database service
builder.Services.AddSingleton<IDatabaseService, DatabaseService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Enable CORS
app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

// Initialize database
using (var scope = app.Services.CreateScope())
{
    var dbService = scope.ServiceProvider.GetRequiredService<IDatabaseService>();
    await dbService.InitializeDatabaseAsync();
}

app.Run();
