using GrabABook.API.Models;

namespace GrabABook.API.Services
{
    public interface IDatabaseService
    {
        Task InitializeDatabaseAsync();
        
        // Books
        Task<List<Book>> GetAllBooksAsync();
        Task<List<APBook>> GetAllAPBooksAsync();
        Task<Book?> GetBookByIdAsync(int id);
        Task<List<Book>> SearchBooksAsync(string searchTerm);
        Task<List<Book>> GetBooksByCategoryAsync(string category);
        
        // Users
        Task<User?> GetUserByIdAsync(int id);
        Task<User?> GetUserByEmailAsync(string email);
        Task<User> CreateUserAsync(User user);
        Task<User> UpdateUserAsync(User user);
        
        // Checkouts
        Task<Checkout> CreateCheckoutAsync(Checkout checkout);
        Task<List<Checkout>> GetUserCheckoutsAsync(int userId);
        Task<Checkout?> GetCheckoutByIdAsync(int id);
        Task<Checkout> UpdateCheckoutAsync(Checkout checkout);
        Task<List<Checkout>> GetOverdueCheckoutsAsync();
        
        // Donations
        Task<Donation> CreateDonationAsync(Donation donation);
        Task<List<Donation>> GetAllDonationsAsync();
        
        // Magazine Requests
        Task<MagazineRequest> CreateMagazineRequestAsync(MagazineRequest request);
        Task<List<MagazineRequest>> GetAllMagazineRequestsAsync();
        
    }
}
