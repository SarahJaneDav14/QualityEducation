using Microsoft.AspNetCore.Mvc;
using GrabABook.API.Models;
using GrabABook.API.Services;

namespace GrabABook.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CheckoutsController : ControllerBase
    {
        private readonly IDatabaseService _databaseService;

        public CheckoutsController(IDatabaseService databaseService)
        {
            _databaseService = databaseService;
        }

        [HttpPost]
        public async Task<ActionResult<Checkout>> CreateCheckout([FromBody] CheckoutRequest request)
        {
            try
            {
                // Verify user exists
                var user = await _databaseService.GetUserByIdAsync(request.UserId);
                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                // Verify book exists and is available
                var book = await _databaseService.GetBookByIdAsync(request.BookId);
                if (book == null)
                {
                    return NotFound(new { message = "Book not found" });
                }

                if (!book.Available)
                {
                    return BadRequest(new { message = "Book is not available" });
                }

                // Calculate due date
                var dueDate = DateTime.UtcNow.AddDays(request.CheckoutPeriod);

                var checkout = new Checkout
                {
                    UserId = request.UserId,
                    BookId = request.BookId,
                    DeliveryMethod = request.DeliveryMethod,
                    DueDate = dueDate
                };

                var createdCheckout = await _databaseService.CreateCheckoutAsync(checkout);
                return CreatedAtAction(nameof(GetCheckout), new { id = createdCheckout.Id }, createdCheckout);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating checkout", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Checkout>> GetCheckout(int id)
        {
            try
            {
                var checkout = await _databaseService.GetCheckoutByIdAsync(id);
                if (checkout == null)
                {
                    return NotFound(new { message = "Checkout not found" });
                }
                return Ok(checkout);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving checkout", error = ex.Message });
            }
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<List<Checkout>>> GetUserCheckouts(int userId)
        {
            try
            {
                var checkouts = await _databaseService.GetUserCheckoutsAsync(userId);
                return Ok(checkouts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving user checkouts", error = ex.Message });
            }
        }

        [HttpPut("{id}/return")]
        public async Task<ActionResult<Checkout>> ReturnBook(int id)
        {
            try
            {
                var checkout = await _databaseService.GetCheckoutByIdAsync(id);
                if (checkout == null)
                {
                    return NotFound(new { message = "Checkout not found" });
                }

                if (checkout.IsReturned)
                {
                    return BadRequest(new { message = "Book has already been returned" });
                }

                // Calculate late fee if overdue
                decimal lateFee = 0;
                if (DateTime.UtcNow > checkout.DueDate)
                {
                    var daysOverdue = (DateTime.UtcNow - checkout.DueDate).Days;
                    lateFee = daysOverdue * 0.50m; // $0.50 per day
                }

                checkout.ReturnDate = DateTime.UtcNow;
                checkout.IsReturned = true;
                checkout.LateFee = lateFee;
                checkout.Status = "returned";

                var updatedCheckout = await _databaseService.UpdateCheckoutAsync(checkout);

                // Update user's late fees
                var user = await _databaseService.GetUserByIdAsync(checkout.UserId);
                if (user != null)
                {
                    user.LateFees = Math.Max(0, user.LateFees - lateFee);
                    await _databaseService.UpdateUserAsync(user);
                }

                return Ok(updatedCheckout);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error returning book", error = ex.Message });
            }
        }

        [HttpGet("overdue")]
        public async Task<ActionResult<List<Checkout>>> GetOverdueCheckouts()
        {
            try
            {
                var checkouts = await _databaseService.GetOverdueCheckoutsAsync();
                return Ok(checkouts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving overdue checkouts", error = ex.Message });
            }
        }
    }
}
