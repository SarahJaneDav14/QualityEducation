using Microsoft.Data.Sqlite;
using GrabABook.API.Models;
using System.Text;
using System.Text.Json;

namespace GrabABook.API.Services
{
    public class DatabaseService : IDatabaseService
    {
        private readonly string _connectionString;

        public DatabaseService(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? "Data Source=./database.db";
        }

        public async Task InitializeDatabaseAsync()
        {
            using var connection = new SqliteConnection(_connectionString);
            await connection.OpenAsync();

            // Create tables
            var createTables = @"
                CREATE TABLE IF NOT EXISTS Users (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    Name TEXT NOT NULL,
                    Email TEXT UNIQUE NOT NULL,
                    Phone TEXT,
                    Address TEXT,
                    City TEXT,
                    State TEXT,
                    ZipCode TEXT,
                    LateFees DECIMAL(10,2) DEFAULT 0,
                    IsQualifiedForFree BOOLEAN DEFAULT 0,
                    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
                );

                CREATE TABLE IF NOT EXISTS Books (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    Title TEXT NOT NULL,
                    Author TEXT NOT NULL,
                    Category TEXT NOT NULL,
                    Description TEXT,
                    Cover TEXT,
                    Available BOOLEAN DEFAULT 1,
                    Formats TEXT DEFAULT 'digital,physical',
                    DueDate DATETIME,
                    Popularity INTEGER DEFAULT 0,
                    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
                );

                CREATE TABLE IF NOT EXISTS APBooks (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    Title TEXT NOT NULL,
                    Author TEXT NOT NULL,
                    Subject TEXT NOT NULL,
                    Type TEXT NOT NULL,
                    Description TEXT,
                    Cover TEXT,
                    Available BOOLEAN DEFAULT 1,
                    Formats TEXT DEFAULT 'digital,physical',
                    DueDate DATETIME,
                    Popularity INTEGER DEFAULT 0,
                    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
                );

                CREATE TABLE IF NOT EXISTS Checkouts (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    UserId INTEGER NOT NULL,
                    BookId INTEGER NOT NULL,
                    DeliveryMethod TEXT NOT NULL,
                    CheckoutDate DATETIME DEFAULT CURRENT_TIMESTAMP,
                    DueDate DATETIME NOT NULL,
                    ReturnDate DATETIME,
                    IsReturned BOOLEAN DEFAULT 0,
                    LateFee DECIMAL(10,2) DEFAULT 0,
                    Status TEXT DEFAULT 'active',
                    FOREIGN KEY (UserId) REFERENCES Users(Id),
                    FOREIGN KEY (BookId) REFERENCES Books(Id)
                );

                CREATE TABLE IF NOT EXISTS Donations (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    Type TEXT NOT NULL,
                    Amount DECIMAL(10,2) DEFAULT 0,
                    BookTitle TEXT,
                    BookAuthor TEXT,
                    BookCategory TEXT,
                    BookCondition TEXT,
                    DonorName TEXT NOT NULL,
                    DonorEmail TEXT NOT NULL,
                    DonorPhone TEXT,
                    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                    Status TEXT DEFAULT 'pending'
                );

                CREATE TABLE IF NOT EXISTS MagazineRequests (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    Name TEXT NOT NULL,
                    Address TEXT NOT NULL,
                    City TEXT NOT NULL,
                    State TEXT NOT NULL,
                    ZipCode TEXT NOT NULL,
                    Phone TEXT,
                    MagazineType TEXT NOT NULL,
                    RequestDate DATETIME DEFAULT CURRENT_TIMESTAMP,
                    Status TEXT DEFAULT 'pending'
                );

            ";

            using var command = new SqliteCommand(createTables, connection);
            await command.ExecuteNonQueryAsync();

            // Insert sample data if tables are empty
            await InsertSampleDataAsync(connection);
        }

        private async Task InsertSampleDataAsync(SqliteConnection connection)
        {
            // Check if we already have data
            using var checkCommand = new SqliteCommand("SELECT COUNT(*) FROM Books", connection);
            var bookCount = Convert.ToInt32(await checkCommand.ExecuteScalarAsync());
            
            if (bookCount > 0) return; // Data already exists

            // Generate and insert 3000+ books
            var generator = new BookDataGenerator();
            var books = generator.GenerateBooks(3000);
            
            // Insert books in batches of 1000 for better performance
            for (int i = 0; i < books.Count; i += 1000)
            {
                var batch = books.Skip(i).Take(1000);
                var insertBooks = new StringBuilder();
                
                foreach (var book in batch)
                {
                    insertBooks.AppendLine($@"
                        INSERT INTO Books (Title, Author, Category, Description, Cover, Available, Popularity) VALUES
                        ('{book.Title.Replace("'", "''")}', '{book.Author.Replace("'", "''")}', '{book.Category}', 
                         '{book.Description.Replace("'", "''")}', '{book.Cover}', {(book.Available ? 1 : 0)}, {book.Popularity});");
                }
                
                using var bookCommand = new SqliteCommand(insertBooks.ToString(), connection);
                await bookCommand.ExecuteNonQueryAsync();
            }

            // Generate and insert 500+ AP books
            var apBooks = generator.GenerateAPBooks(500);
            
            // Insert AP books in batches of 100 for better performance
            for (int i = 0; i < apBooks.Count; i += 100)
            {
                var batch = apBooks.Skip(i).Take(100);
                var insertAPBooks = new StringBuilder();
                
                foreach (var apBook in batch)
                {
                    insertAPBooks.AppendLine($@"
                        INSERT INTO APBooks (Title, Author, Subject, Type, Description, Cover, Available, Popularity) VALUES
                        ('{apBook.Title.Replace("'", "''")}', '{apBook.Author.Replace("'", "''")}', '{apBook.Subject}', '{apBook.Type}',
                         '{apBook.Description.Replace("'", "''")}', '{apBook.Cover}', {(apBook.Available ? 1 : 0)}, {apBook.Popularity});");
                }
                
                using var apBookCommand = new SqliteCommand(insertAPBooks.ToString(), connection);
                await apBookCommand.ExecuteNonQueryAsync();
            }

            // Insert demo user
            var insertUser = @"
                INSERT INTO Users (Name, Email, Phone, Address, City, State, ZipCode, IsQualifiedForFree) VALUES
                ('Demo User', 'demo@grababook.com', '555-0123', '123 Main St', 'Anytown', 'CA', '12345', 1);
            ";

            using var userCommand = new SqliteCommand(insertUser, connection);
            await userCommand.ExecuteNonQueryAsync();
        }

        // Book methods
        public async Task<List<Book>> GetAllBooksAsync()
        {
            using var connection = new SqliteConnection(_connectionString);
            await connection.OpenAsync();

            var books = new List<Book>();
            using var command = new SqliteCommand("SELECT * FROM Books ORDER BY Popularity DESC", connection);
            using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                books.Add(MapBookFromReader(reader));
            }

            return books;
        }

        public async Task<List<APBook>> GetAllAPBooksAsync()
        {
            using var connection = new SqliteConnection(_connectionString);
            await connection.OpenAsync();

            var books = new List<APBook>();
            using var command = new SqliteCommand("SELECT * FROM APBooks ORDER BY Popularity DESC", connection);
            using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                books.Add(MapAPBookFromReader(reader));
            }

            return books;
        }

        public async Task<Book?> GetBookByIdAsync(int id)
        {
            using var connection = new SqliteConnection(_connectionString);
            await connection.OpenAsync();

            using var command = new SqliteCommand("SELECT * FROM Books WHERE Id = @id", connection);
            command.Parameters.AddWithValue("@id", id);
            using var reader = await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                return MapBookFromReader(reader);
            }

            return null;
        }

        public async Task<List<Book>> SearchBooksAsync(string searchTerm)
        {
            using var connection = new SqliteConnection(_connectionString);
            await connection.OpenAsync();

            var books = new List<Book>();
            using var command = new SqliteCommand(
                "SELECT * FROM Books WHERE Title LIKE @search OR Author LIKE @search OR Description LIKE @search ORDER BY Popularity DESC", 
                connection);
            command.Parameters.AddWithValue("@search", $"%{searchTerm}%");
            using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                books.Add(MapBookFromReader(reader));
            }

            return books;
        }

        public async Task<List<Book>> GetBooksByCategoryAsync(string category)
        {
            using var connection = new SqliteConnection(_connectionString);
            await connection.OpenAsync();

            var books = new List<Book>();
            using var command = new SqliteCommand("SELECT * FROM Books WHERE Category = @category ORDER BY Popularity DESC", connection);
            command.Parameters.AddWithValue("@category", category);
            using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                books.Add(MapBookFromReader(reader));
            }

            return books;
        }

        // User methods
        public async Task<User?> GetUserByIdAsync(int id)
        {
            using var connection = new SqliteConnection(_connectionString);
            await connection.OpenAsync();

            using var command = new SqliteCommand("SELECT * FROM Users WHERE Id = @id", connection);
            command.Parameters.AddWithValue("@id", id);
            using var reader = await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                return new User
                {
                    Id = reader.GetInt32(0),
                    Name = reader.GetString(1),
                    Email = reader.GetString(2),
                    Phone = reader.IsDBNull(3) ? "" : reader.GetString(3),
                    Address = reader.IsDBNull(4) ? "" : reader.GetString(4),
                    City = reader.IsDBNull(5) ? "" : reader.GetString(5),
                    State = reader.IsDBNull(6) ? "" : reader.GetString(6),
                    ZipCode = reader.IsDBNull(7) ? "" : reader.GetString(7),
                    LateFees = reader.GetDecimal(8),
                    IsQualifiedForFree = reader.GetBoolean(9),
                    CreatedAt = reader.GetDateTime(10),
                    UpdatedAt = reader.GetDateTime(11)
                };
            }

            return null;
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            using var connection = new SqliteConnection(_connectionString);
            await connection.OpenAsync();

            using var command = new SqliteCommand("SELECT * FROM Users WHERE Email = @email", connection);
            command.Parameters.AddWithValue("@email", email);
            using var reader = await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                return new User
                {
                    Id = reader.GetInt32(0),
                    Name = reader.GetString(1),
                    Email = reader.GetString(2),
                    Phone = reader.IsDBNull(3) ? "" : reader.GetString(3),
                    Address = reader.IsDBNull(4) ? "" : reader.GetString(4),
                    City = reader.IsDBNull(5) ? "" : reader.GetString(5),
                    State = reader.IsDBNull(6) ? "" : reader.GetString(6),
                    ZipCode = reader.IsDBNull(7) ? "" : reader.GetString(7),
                    LateFees = reader.GetDecimal(8),
                    IsQualifiedForFree = reader.GetBoolean(9),
                    CreatedAt = reader.GetDateTime(10),
                    UpdatedAt = reader.GetDateTime(11)
                };
            }

            return null;
        }

        public async Task<User> CreateUserAsync(User user)
        {
            using var connection = new SqliteConnection(_connectionString);
            await connection.OpenAsync();

            using var command = new SqliteCommand(@"
                INSERT INTO Users (Name, Email, Phone, Address, City, State, ZipCode, IsQualifiedForFree)
                VALUES (@name, @email, @phone, @address, @city, @state, @zipCode, @isQualified)
                RETURNING Id", connection);

            command.Parameters.AddWithValue("@name", user.Name);
            command.Parameters.AddWithValue("@email", user.Email);
            command.Parameters.AddWithValue("@phone", user.Phone);
            command.Parameters.AddWithValue("@address", user.Address);
            command.Parameters.AddWithValue("@city", user.City);
            command.Parameters.AddWithValue("@state", user.State);
            command.Parameters.AddWithValue("@zipCode", user.ZipCode);
            command.Parameters.AddWithValue("@isQualified", user.IsQualifiedForFree);

            var id = Convert.ToInt32(await command.ExecuteScalarAsync());
            user.Id = id;
            return user;
        }

        public async Task<User> UpdateUserAsync(User user)
        {
            using var connection = new SqliteConnection(_connectionString);
            await connection.OpenAsync();

            using var command = new SqliteCommand(@"
                UPDATE Users SET 
                    Name = @name, Email = @email, Phone = @phone, Address = @address,
                    City = @city, State = @state, ZipCode = @zipCode, LateFees = @lateFees,
                    IsQualifiedForFree = @isQualified, UpdatedAt = CURRENT_TIMESTAMP
                WHERE Id = @id", connection);

            command.Parameters.AddWithValue("@id", user.Id);
            command.Parameters.AddWithValue("@name", user.Name);
            command.Parameters.AddWithValue("@email", user.Email);
            command.Parameters.AddWithValue("@phone", user.Phone);
            command.Parameters.AddWithValue("@address", user.Address);
            command.Parameters.AddWithValue("@city", user.City);
            command.Parameters.AddWithValue("@state", user.State);
            command.Parameters.AddWithValue("@zipCode", user.ZipCode);
            command.Parameters.AddWithValue("@lateFees", user.LateFees);
            command.Parameters.AddWithValue("@isQualified", user.IsQualifiedForFree);

            await command.ExecuteNonQueryAsync();
            return user;
        }

        // Checkout methods
        public async Task<Checkout> CreateCheckoutAsync(Checkout checkout)
        {
            using var connection = new SqliteConnection(_connectionString);
            await connection.OpenAsync();

            using var command = new SqliteCommand(@"
                INSERT INTO Checkouts (UserId, BookId, DeliveryMethod, DueDate)
                VALUES (@userId, @bookId, @deliveryMethod, @dueDate)
                RETURNING Id", connection);

            command.Parameters.AddWithValue("@userId", checkout.UserId);
            command.Parameters.AddWithValue("@bookId", checkout.BookId);
            command.Parameters.AddWithValue("@deliveryMethod", checkout.DeliveryMethod);
            command.Parameters.AddWithValue("@dueDate", checkout.DueDate);

            var id = Convert.ToInt32(await command.ExecuteScalarAsync());
            checkout.Id = id;

            // Update book availability
            await UpdateBookAvailabilityAsync(connection, checkout.BookId, false, checkout.DueDate);

            return checkout;
        }

        public async Task<List<Checkout>> GetUserCheckoutsAsync(int userId)
        {
            using var connection = new SqliteConnection(_connectionString);
            await connection.OpenAsync();

            var checkouts = new List<Checkout>();
            using var command = new SqliteCommand("SELECT * FROM Checkouts WHERE UserId = @userId ORDER BY CheckoutDate DESC", connection);
            command.Parameters.AddWithValue("@userId", userId);
            using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                checkouts.Add(new Checkout
                {
                    Id = reader.GetInt32(0),
                    UserId = reader.GetInt32(1),
                    BookId = reader.GetInt32(2),
                    DeliveryMethod = reader.GetString(3),
                    CheckoutDate = reader.GetDateTime(4),
                    DueDate = reader.GetDateTime(5),
                    ReturnDate = reader.IsDBNull(6) ? null : reader.GetDateTime(6),
                    IsReturned = reader.GetBoolean(7),
                    LateFee = reader.GetDecimal(8),
                    Status = reader.GetString(9)
                });
            }

            return checkouts;
        }

        public async Task<Checkout?> GetCheckoutByIdAsync(int id)
        {
            using var connection = new SqliteConnection(_connectionString);
            await connection.OpenAsync();

            using var command = new SqliteCommand("SELECT * FROM Checkouts WHERE Id = @id", connection);
            command.Parameters.AddWithValue("@id", id);
            using var reader = await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                return new Checkout
                {
                    Id = reader.GetInt32(0),
                    UserId = reader.GetInt32(1),
                    BookId = reader.GetInt32(2),
                    DeliveryMethod = reader.GetString(3),
                    CheckoutDate = reader.GetDateTime(4),
                    DueDate = reader.GetDateTime(5),
                    ReturnDate = reader.IsDBNull(6) ? null : reader.GetDateTime(6),
                    IsReturned = reader.GetBoolean(7),
                    LateFee = reader.GetDecimal(8),
                    Status = reader.GetString(9)
                };
            }

            return null;
        }

        public async Task<Checkout> UpdateCheckoutAsync(Checkout checkout)
        {
            using var connection = new SqliteConnection(_connectionString);
            await connection.OpenAsync();

            using var command = new SqliteCommand(@"
                UPDATE Checkouts SET 
                    ReturnDate = @returnDate, IsReturned = @isReturned, 
                    LateFee = @lateFee, Status = @status
                WHERE Id = @id", connection);

            command.Parameters.AddWithValue("@id", checkout.Id);
            command.Parameters.AddWithValue("@returnDate", checkout.ReturnDate);
            command.Parameters.AddWithValue("@isReturned", checkout.IsReturned);
            command.Parameters.AddWithValue("@lateFee", checkout.LateFee);
            command.Parameters.AddWithValue("@status", checkout.Status);

            await command.ExecuteNonQueryAsync();

            // Update book availability if returned
            if (checkout.IsReturned)
            {
                await UpdateBookAvailabilityAsync(connection, checkout.BookId, true, null);
            }

            return checkout;
        }

        public async Task<List<Checkout>> GetOverdueCheckoutsAsync()
        {
            using var connection = new SqliteConnection(_connectionString);
            await connection.OpenAsync();

            var checkouts = new List<Checkout>();
            using var command = new SqliteCommand("SELECT * FROM Checkouts WHERE DueDate < CURRENT_TIMESTAMP AND IsReturned = 0", connection);
            using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                checkouts.Add(new Checkout
                {
                    Id = reader.GetInt32(0),
                    UserId = reader.GetInt32(1),
                    BookId = reader.GetInt32(2),
                    DeliveryMethod = reader.GetString(3),
                    CheckoutDate = reader.GetDateTime(4),
                    DueDate = reader.GetDateTime(5),
                    ReturnDate = reader.IsDBNull(6) ? null : reader.GetDateTime(6),
                    IsReturned = reader.GetBoolean(7),
                    LateFee = reader.GetDecimal(8),
                    Status = reader.GetString(9)
                });
            }

            return checkouts;
        }

        // Donation methods
        public async Task<Donation> CreateDonationAsync(Donation donation)
        {
            using var connection = new SqliteConnection(_connectionString);
            await connection.OpenAsync();

            using var command = new SqliteCommand(@"
                INSERT INTO Donations (Type, Amount, BookTitle, BookAuthor, BookCategory, BookCondition, DonorName, DonorEmail, DonorPhone)
                VALUES (@type, @amount, @bookTitle, @bookAuthor, @bookCategory, @bookCondition, @donorName, @donorEmail, @donorPhone)
                RETURNING Id", connection);

            command.Parameters.AddWithValue("@type", donation.Type);
            command.Parameters.AddWithValue("@amount", donation.Amount);
            command.Parameters.AddWithValue("@bookTitle", donation.BookTitle ?? "");
            command.Parameters.AddWithValue("@bookAuthor", donation.BookAuthor ?? "");
            command.Parameters.AddWithValue("@bookCategory", donation.BookCategory ?? "");
            command.Parameters.AddWithValue("@bookCondition", donation.BookCondition ?? "");
            command.Parameters.AddWithValue("@donorName", donation.DonorName);
            command.Parameters.AddWithValue("@donorEmail", donation.DonorEmail);
            command.Parameters.AddWithValue("@donorPhone", donation.DonorPhone);

            var id = Convert.ToInt32(await command.ExecuteScalarAsync());
            donation.Id = id;
            return donation;
        }

        public async Task<List<Donation>> GetAllDonationsAsync()
        {
            using var connection = new SqliteConnection(_connectionString);
            await connection.OpenAsync();

            var donations = new List<Donation>();
            using var command = new SqliteCommand("SELECT * FROM Donations ORDER BY CreatedAt DESC", connection);
            using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                donations.Add(new Donation
                {
                    Id = reader.GetInt32(0),
                    Type = reader.GetString(1),
                    Amount = reader.GetDecimal(2),
                    BookTitle = reader.IsDBNull(3) ? null : reader.GetString(3),
                    BookAuthor = reader.IsDBNull(4) ? null : reader.GetString(4),
                    BookCategory = reader.IsDBNull(5) ? null : reader.GetString(5),
                    BookCondition = reader.IsDBNull(6) ? null : reader.GetString(6),
                    DonorName = reader.GetString(7),
                    DonorEmail = reader.GetString(8),
                    DonorPhone = reader.IsDBNull(9) ? "" : reader.GetString(9),
                    CreatedAt = reader.GetDateTime(10),
                    Status = reader.GetString(11)
                });
            }

            return donations;
        }

        // Magazine request methods
        public async Task<MagazineRequest> CreateMagazineRequestAsync(MagazineRequest request)
        {
            using var connection = new SqliteConnection(_connectionString);
            await connection.OpenAsync();

            using var command = new SqliteCommand(@"
                INSERT INTO MagazineRequests (Name, Address, City, State, ZipCode, Phone, MagazineType)
                VALUES (@name, @address, @city, @state, @zipCode, @phone, @magazineType)
                RETURNING Id", connection);

            command.Parameters.AddWithValue("@name", request.Name);
            command.Parameters.AddWithValue("@address", request.Address);
            command.Parameters.AddWithValue("@city", request.City);
            command.Parameters.AddWithValue("@state", request.State);
            command.Parameters.AddWithValue("@zipCode", request.ZipCode);
            command.Parameters.AddWithValue("@phone", request.Phone);
            command.Parameters.AddWithValue("@magazineType", request.MagazineType);

            var id = Convert.ToInt32(await command.ExecuteScalarAsync());
            request.Id = id;
            return request;
        }

        public async Task<List<MagazineRequest>> GetAllMagazineRequestsAsync()
        {
            using var connection = new SqliteConnection(_connectionString);
            await connection.OpenAsync();

            var requests = new List<MagazineRequest>();
            using var command = new SqliteCommand("SELECT * FROM MagazineRequests ORDER BY RequestDate DESC", connection);
            using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                requests.Add(new MagazineRequest
                {
                    Id = reader.GetInt32(0),
                    Name = reader.GetString(1),
                    Address = reader.GetString(2),
                    City = reader.GetString(3),
                    State = reader.GetString(4),
                    ZipCode = reader.GetString(5),
                    Phone = reader.IsDBNull(6) ? "" : reader.GetString(6),
                    MagazineType = reader.GetString(7),
                    RequestDate = reader.GetDateTime(8),
                    Status = reader.GetString(9)
                });
            }

            return requests;
        }

        // Helper methods
        private Book MapBookFromReader(SqliteDataReader reader)
        {
            return new Book
            {
                Id = reader.GetInt32(0),
                Title = reader.GetString(1),
                Author = reader.GetString(2),
                Category = reader.GetString(3),
                Description = reader.IsDBNull(4) ? "" : reader.GetString(4),
                Cover = reader.IsDBNull(5) ? "" : reader.GetString(5),
                Available = reader.GetBoolean(6),
                Formats = reader.IsDBNull(7) ? "digital,physical" : reader.GetString(7),
                DueDate = reader.IsDBNull(8) ? null : reader.GetDateTime(8),
                Popularity = reader.GetInt32(9),
                CreatedAt = reader.GetDateTime(10),
                UpdatedAt = reader.GetDateTime(11)
            };
        }

        private APBook MapAPBookFromReader(SqliteDataReader reader)
        {
            return new APBook
            {
                Id = reader.GetInt32(0),
                Title = reader.GetString(1),
                Author = reader.GetString(2),
                Subject = reader.GetString(3),
                Type = reader.GetString(4),
                Description = reader.IsDBNull(5) ? "" : reader.GetString(5),
                Cover = reader.IsDBNull(6) ? "" : reader.GetString(6),
                Available = reader.GetBoolean(7),
                Formats = reader.IsDBNull(8) ? "digital,physical" : reader.GetString(8),
                DueDate = reader.IsDBNull(9) ? null : reader.GetDateTime(9),
                Popularity = reader.GetInt32(10),
                CreatedAt = reader.GetDateTime(11),
                UpdatedAt = reader.GetDateTime(12)
            };
        }

        private async Task UpdateBookAvailabilityAsync(SqliteConnection connection, int bookId, bool available, DateTime? dueDate)
        {
            using var command = new SqliteCommand("UPDATE Books SET Available = @available, DueDate = @dueDate WHERE Id = @id", connection);
            command.Parameters.AddWithValue("@id", bookId);
            command.Parameters.AddWithValue("@available", available);
            command.Parameters.AddWithValue("@dueDate", dueDate);
            await command.ExecuteNonQueryAsync();
        }
    }
}