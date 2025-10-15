using Microsoft.AspNetCore.Mvc;
using GrabABook.API.Models;
using GrabABook.API.Services;

namespace GrabABook.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class APBooksController : ControllerBase
    {
        private readonly IDatabaseService _databaseService;

        public APBooksController(IDatabaseService databaseService)
        {
            _databaseService = databaseService;
        }

        [HttpGet]
        public async Task<ActionResult<List<APBook>>> GetAllAPBooks()
        {
            try
            {
                var books = await _databaseService.GetAllAPBooksAsync();
                return Ok(books);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving AP books", error = ex.Message });
            }
        }

        [HttpGet("subject/{subject}")]
        public async Task<ActionResult<List<APBook>>> GetAPBooksBySubject(string subject)
        {
            try
            {
                var allBooks = await _databaseService.GetAllAPBooksAsync();
                var filteredBooks = subject.ToLower() == "all" 
                    ? allBooks 
                    : allBooks.Where(b => b.Subject.ToLower() == subject.ToLower()).ToList();
                
                return Ok(filteredBooks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving AP books by subject", error = ex.Message });
            }
        }

        [HttpGet("type/{type}")]
        public async Task<ActionResult<List<APBook>>> GetAPBooksByType(string type)
        {
            try
            {
                var allBooks = await _databaseService.GetAllAPBooksAsync();
                var filteredBooks = type.ToLower() == "all" 
                    ? allBooks 
                    : allBooks.Where(b => b.Type.ToLower() == type.ToLower()).ToList();
                
                return Ok(filteredBooks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving AP books by type", error = ex.Message });
            }
        }
    }
}
