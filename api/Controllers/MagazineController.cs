using Microsoft.AspNetCore.Mvc;
using GrabABook.API.Models;
using GrabABook.API.Services;

namespace GrabABook.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MagazineController : ControllerBase
    {
        private readonly IDatabaseService _databaseService;

        public MagazineController(IDatabaseService databaseService)
        {
            _databaseService = databaseService;
        }

        [HttpPost("request")]
        public async Task<ActionResult<MagazineRequest>> RequestMagazine([FromBody] MagazineRequestRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.Address))
                {
                    return BadRequest(new { message = "Name and address are required" });
                }

                var magazineRequest = new MagazineRequest
                {
                    Name = request.Name,
                    Address = request.Address,
                    City = request.City,
                    State = request.State,
                    ZipCode = request.ZipCode,
                    Phone = request.Phone ?? "",
                    MagazineType = request.MagazineType
                };

                var createdRequest = await _databaseService.CreateMagazineRequestAsync(magazineRequest);
                return CreatedAtAction(nameof(GetMagazineRequest), new { id = createdRequest.Id }, createdRequest);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating magazine request", error = ex.Message });
            }
        }

        [HttpGet]
        public async Task<ActionResult<List<MagazineRequest>>> GetAllMagazineRequests()
        {
            try
            {
                var requests = await _databaseService.GetAllMagazineRequestsAsync();
                return Ok(requests);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving magazine requests", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MagazineRequest>> GetMagazineRequest(int id)
        {
            try
            {
                var requests = await _databaseService.GetAllMagazineRequestsAsync();
                var request = requests.FirstOrDefault(r => r.Id == id);
                
                if (request == null)
                {
                    return NotFound(new { message = "Magazine request not found" });
                }
                
                return Ok(request);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving magazine request", error = ex.Message });
            }
        }

        [HttpGet("types")]
        public ActionResult<object> GetMagazineTypes()
        {
            return Ok(new
            {
                types = new[]
                {
                    new { value = "ap", label = "AP Class Materials", description = "Textbooks and study guides for AP courses" },
                    new { value = "children-fantasy", label = "Children's Fantasy & Adventure", description = "Fantasy books and adventure stories for children" },
                    new { value = "historical-nonfiction", label = "Historical Non-Fiction", description = "Real stories and historical facts" },
                    new { value = "fiction", label = "Fiction & Literature", description = "Novels, stories, and literary works" },
                    new { value = "education", label = "Educational & Textbooks", description = "Learning materials and educational resources" },
                    new { value = "general", label = "General Catalog (All Books)", description = "Complete catalog with all available books" }
                },
                description = "Get our book catalog delivered to your door - completely free! Perfect for areas with limited internet access.",
                features = new[]
                {
                    "Complete book catalog with descriptions",
                    "AP class materials and study guides",
                    "New arrivals and featured books",
                    "Pre-addressed return envelope",
                    "Book request forms",
                    "Free delivery and return shipping"
                },
                process = new[]
                {
                    "Request your free magazine",
                    "Browse books in the catalog",
                    "Fill out request form",
                    "Mail back in provided envelope",
                    "Books delivered to your door!"
                }
            });
        }
    }

    public class MagazineRequestRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string ZipCode { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string MagazineType { get; set; } = string.Empty;
    }
}
