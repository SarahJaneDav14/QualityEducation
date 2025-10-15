using Microsoft.AspNetCore.Mvc;
using GrabABook.API.Models;
using GrabABook.API.Services;

namespace GrabABook.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IDatabaseService _databaseService;

        public UsersController(IDatabaseService databaseService)
        {
            _databaseService = databaseService;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            try
            {
                var user = await _databaseService.GetUserByIdAsync(id);
                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }
                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving user", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<User>> CreateUser([FromBody] User user)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(user.Name) || string.IsNullOrWhiteSpace(user.Email))
                {
                    return BadRequest(new { message = "Name and email are required" });
                }

                // Check if user already exists
                var existingUser = await _databaseService.GetUserByEmailAsync(user.Email);
                if (existingUser != null)
                {
                    return Conflict(new { message = "User with this email already exists" });
                }

                var createdUser = await _databaseService.CreateUserAsync(user);
                return CreatedAtAction(nameof(GetUser), new { id = createdUser.Id }, createdUser);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating user", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<User>> UpdateUser(int id, [FromBody] User user)
        {
            try
            {
                if (id != user.Id)
                {
                    return BadRequest(new { message = "User ID mismatch" });
                }

                var existingUser = await _databaseService.GetUserByIdAsync(id);
                if (existingUser == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                var updatedUser = await _databaseService.UpdateUserAsync(user);
                return Ok(updatedUser);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating user", error = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<User>> Login([FromBody] LoginRequest request)
        {
            try
            {
                var user = await _databaseService.GetUserByEmailAsync(request.Email);
                if (user == null)
                {
                    // For demo purposes, create a user if they don't exist
                    user = new User
                    {
                        Name = request.Name ?? "Demo User",
                        Email = request.Email,
                        IsQualifiedForFree = true
                    };
                    user = await _databaseService.CreateUserAsync(user);
                }

                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error during login", error = ex.Message });
            }
        }
    }

    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string? Name { get; set; }
    }
}
