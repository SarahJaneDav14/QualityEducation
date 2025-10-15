using Microsoft.AspNetCore.Mvc;
using GrabABook.API.Models;
using GrabABook.API.Services;

namespace GrabABook.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DonationsController : ControllerBase
    {
        private readonly IDatabaseService _databaseService;

        public DonationsController(IDatabaseService databaseService)
        {
            _databaseService = databaseService;
        }

        [HttpPost]
        public async Task<ActionResult<Donation>> CreateDonation([FromBody] Donation donation)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(donation.DonorName) || string.IsNullOrWhiteSpace(donation.DonorEmail))
                {
                    return BadRequest(new { message = "Donor name and email are required" });
                }

                var createdDonation = await _databaseService.CreateDonationAsync(donation);
                return CreatedAtAction(nameof(GetDonation), new { id = createdDonation.Id }, createdDonation);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating donation", error = ex.Message });
            }
        }

        [HttpGet]
        public async Task<ActionResult<List<Donation>>> GetAllDonations()
        {
            try
            {
                var donations = await _databaseService.GetAllDonationsAsync();
                return Ok(donations);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving donations", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Donation>> GetDonation(int id)
        {
            try
            {
                var donations = await _databaseService.GetAllDonationsAsync();
                var donation = donations.FirstOrDefault(d => d.Id == id);
                
                if (donation == null)
                {
                    return NotFound(new { message = "Donation not found" });
                }
                
                return Ok(donation);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving donation", error = ex.Message });
            }
        }

        [HttpPost("money")]
        public async Task<ActionResult<Donation>> CreateMoneyDonation([FromBody] MoneyDonationRequest request)
        {
            try
            {
                var donation = new Donation
                {
                    Type = "money",
                    Amount = request.Amount,
                    DonorName = request.DonorName,
                    DonorEmail = request.DonorEmail,
                    DonorPhone = request.DonorPhone ?? ""
                };

                var createdDonation = await _databaseService.CreateDonationAsync(donation);
                return CreatedAtAction(nameof(GetDonation), new { id = createdDonation.Id }, createdDonation);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating money donation", error = ex.Message });
            }
        }

        [HttpPost("book")]
        public async Task<ActionResult<Donation>> CreateBookDonation([FromBody] BookDonationRequest request)
        {
            try
            {
                var donation = new Donation
                {
                    Type = "book",
                    BookTitle = request.BookTitle,
                    BookAuthor = request.BookAuthor,
                    BookCategory = request.BookCategory,
                    BookCondition = request.BookCondition,
                    DonorName = request.DonorName,
                    DonorEmail = request.DonorEmail,
                    DonorPhone = request.DonorPhone ?? ""
                };

                var createdDonation = await _databaseService.CreateDonationAsync(donation);
                return CreatedAtAction(nameof(GetDonation), new { id = createdDonation.Id }, createdDonation);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating book donation", error = ex.Message });
            }
        }
    }

    public class MoneyDonationRequest
    {
        public decimal Amount { get; set; }
        public string DonorName { get; set; } = string.Empty;
        public string DonorEmail { get; set; } = string.Empty;
        public string? DonorPhone { get; set; }
    }

    public class BookDonationRequest
    {
        public string BookTitle { get; set; } = string.Empty;
        public string BookAuthor { get; set; } = string.Empty;
        public string BookCategory { get; set; } = string.Empty;
        public string BookCondition { get; set; } = string.Empty;
        public string DonorName { get; set; } = string.Empty;
        public string DonorEmail { get; set; } = string.Empty;
        public string? DonorPhone { get; set; }
    }
}
