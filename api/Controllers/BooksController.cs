using Microsoft.AspNetCore.Mvc;
using GrabABook.API.Models;
using GrabABook.API.Services;

namespace GrabABook.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BooksController : ControllerBase
    {
        private readonly IDatabaseService _databaseService;

        public BooksController(IDatabaseService databaseService)
        {
            _databaseService = databaseService;
        }

        [HttpGet]
        public async Task<ActionResult<List<Book>>> GetAllBooks()
        {
            try
            {
                var books = await _databaseService.GetAllBooksAsync();
                return Ok(books);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving books", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Book>> GetBook(int id)
        {
            try
            {
                var book = await _databaseService.GetBookByIdAsync(id);
                if (book == null)
                {
                    return NotFound(new { message = "Book not found" });
                }
                return Ok(book);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving book", error = ex.Message });
            }
        }

        [HttpGet("search")]
        public async Task<ActionResult<List<Book>>> SearchBooks([FromQuery] string q)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(q))
                {
                    return BadRequest(new { message = "Search query is required" });
                }

                var books = await _databaseService.SearchBooksAsync(q);
                return Ok(books);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error searching books", error = ex.Message });
            }
        }

        [HttpGet("category/{category}")]
        public async Task<ActionResult<List<Book>>> GetBooksByCategory(string category)
        {
            try
            {
                var books = await _databaseService.GetBooksByCategoryAsync(category);
                return Ok(books);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving books by category", error = ex.Message });
            }
        }
    }
}
