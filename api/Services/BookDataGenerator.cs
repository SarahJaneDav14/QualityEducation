using GrabABook.API.Models;

namespace GrabABook.API.Services
{
    public class BookDataGenerator
    {
        private readonly Random _random = new Random();
        
        private readonly string[] _firstNames = {
            "John", "Jane", "Michael", "Sarah", "David", "Emily", "Robert", "Jessica", "William", "Ashley",
            "James", "Amanda", "Christopher", "Stephanie", "Daniel", "Melissa", "Matthew", "Nicole", "Anthony", "Elizabeth",
            "Mark", "Heather", "Donald", "Amy", "Steven", "Angela", "Paul", "Brenda", "Andrew", "Emma",
            "Joshua", "Olivia", "Kenneth", "Cynthia", "Kevin", "Marie", "Brian", "Janet", "George", "Catherine",
            "Timothy", "Frances", "Ronald", "Christine", "Jason", "Samantha", "Edward", "Deborah", "Jeffrey", "Rachel",
            "Ryan", "Carolyn", "Jacob", "Janet", "Gary", "Virginia", "Nicholas", "Maria", "Eric", "Heather",
            "Jonathan", "Diane", "Stephen", "Julie", "Larry", "Joyce", "Justin", "Victoria", "Scott", "Kelly",
            "Brandon", "Christina", "Benjamin", "Joan", "Samuel", "Evelyn", "Gregory", "Lauren", "Alexander", "Judith",
            "Patrick", "Megan", "Frank", "Cheryl", "Raymond", "Andrea", "Jack", "Hannah", "Dennis", "Jacqueline",
            "Jerry", "Martha", "Tyler", "Gloria", "Aaron", "Teresa", "Jose", "Sara", "Henry", "Janice",
            "Adam", "Marie", "Douglas", "Julia", "Nathan", "Grace", "Zachary", "Judy", "Kyle", "Theresa",
            "Noah", "Madison", "Alan", "Beverly", "Ethan", "Denise", "Jeremy", "Marilyn", "Carl", "Amber",
            "Keith", "Danielle", "Roger", "Rose", "Gerald", "Brittany", "Christian", "Diana", "Terry", "Abigail",
            "Sean", "Jane", "Arthur", "Lori", "Austin", "Mildred", "Noah", "Kathryn", "Lawrence", "Emma",
            "Jesse", "Catherine", "Joe", "Frances", "Bryan", "Christine", "Billy", "Samantha", "Jordan", "Deborah",
            "Ralph", "Rachel", "Roy", "Carolyn", "Eugene", "Janet", "Louis", "Virginia", "Philip", "Maria",
            "Johnny", "Heather", "Bobby", "Diane", "Wayne", "Julie", "Eugene", "Joyce", "Ralph", "Victoria"
        };

        private readonly string[] _lastNames = {
            "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
            "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
            "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson",
            "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
            "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts",
            "Gomez", "Phillips", "Evans", "Turner", "Diaz", "Parker", "Cruz", "Edwards", "Collins", "Reyes",
            "Stewart", "Morris", "Morales", "Murphy", "Cook", "Rogers", "Gutierrez", "Ortiz", "Morgan", "Cooper",
            "Peterson", "Bailey", "Reed", "Kelly", "Howard", "Ramos", "Kim", "Cox", "Ward", "Richardson",
            "Watson", "Brooks", "Chavez", "Wood", "James", "Bennett", "Gray", "Mendoza", "Ruiz", "Hughes",
            "Price", "Alvarez", "Castillo", "Sanders", "Patel", "Myers", "Long", "Ross", "Foster", "Jimenez",
            "Powell", "Jenkins", "Perry", "Russell", "Sullivan", "Bell", "Coleman", "Butler", "Henderson", "Barnes",
            "Gonzales", "Fisher", "Vasquez", "Simmons", "Romero", "Jordan", "Patterson", "Alexander", "Hamilton", "Graham",
            "Reynolds", "Griffin", "Wallace", "Moreno", "West", "Cole", "Hayes", "Bryant", "Herrera", "Gibson",
            "Ellis", "Tran", "Medina", "Aguilar", "Stevens", "Murray", "Ford", "Castro", "Marshall", "Owens",
            "Harrison", "Fernandez", "Mcdonald", "Woods", "Washington", "Kennedy", "Wells", "Vargas", "Henry", "Chen",
            "Freeman", "Webb", "Tucker", "Guzman", "Burns", "Crawford", "Olson", "Simpson", "Porter", "Hunter"
        };

        private readonly string[] _categories = {
            "fiction", "non-fiction", "education", "children", "science", "history", "biography", "mystery",
            "romance", "fantasy", "science-fiction", "thriller", "horror", "adventure", "comedy", "drama",
            "poetry", "philosophy", "psychology", "business", "health", "cooking", "travel", "art",
            "music", "sports", "technology", "politics", "religion", "self-help", "memoir", "essays"
        };

        private readonly string[] _bookTitles = {
            "The", "A", "An", "My", "Your", "Our", "Their", "This", "That", "These", "Those",
            "Journey", "Adventure", "Mystery", "Secret", "Hidden", "Lost", "Found", "Broken", "Whole", "Complete",
            "Story", "Tale", "Legend", "Myth", "Dream", "Nightmare", "Vision", "Hope", "Fear", "Love",
            "War", "Peace", "Life", "Death", "Birth", "Beginning", "End", "Middle", "Center", "Edge",
            "Mountain", "Valley", "River", "Ocean", "Sky", "Earth", "Fire", "Water", "Wind", "Storm",
            "Light", "Dark", "Shadow", "Sun", "Moon", "Star", "Galaxy", "Universe", "World", "Planet",
            "City", "Village", "Town", "Country", "Nation", "Empire", "Kingdom", "Realm", "Land", "Place",
            "Time", "Past", "Present", "Future", "Yesterday", "Today", "Tomorrow", "Forever", "Never", "Always",
            "Heart", "Soul", "Mind", "Body", "Spirit", "Essence", "Core", "Center", "Focus", "Point",
            "Path", "Road", "Way", "Route", "Journey", "Quest", "Mission", "Goal", "Destination", "End"
        };

        private readonly string[] _bookSuffixes = {
            "Chronicles", "Saga", "Trilogy", "Series", "Collection", "Anthology", "Compilation", "Volume",
            "Book", "Novel", "Story", "Tale", "Legend", "Myth", "Epic", "Adventure", "Journey", "Quest",
            "Mystery", "Secret", "Code", "Key", "Door", "Gate", "Bridge", "Path", "Road", "Way",
            "Truth", "Lie", "Promise", "Vow", "Oath", "Pledge", "Commitment", "Dedication", "Devotion", "Faith",
            "Hope", "Dream", "Vision", "Reality", "Fantasy", "Illusion", "Mirage", "Phantom", "Ghost", "Spirit",
            "Warrior", "Hero", "Villain", "Guardian", "Protector", "Defender", "Champion", "Master", "Student", "Teacher",
            "King", "Queen", "Prince", "Princess", "Lord", "Lady", "Knight", "Noble", "Commoner", "Peasant",
            "Magic", "Power", "Force", "Energy", "Strength", "Weakness", "Courage", "Fear", "Bravery", "Cowardice"
        };

        private readonly string[] _descriptions = {
            "A captivating tale that will keep you on the edge of your seat from beginning to end.",
            "An inspiring story of courage, hope, and the power of the human spirit.",
            "A thought-provoking exploration of life's deepest questions and mysteries.",
            "A thrilling adventure that takes you on an unforgettable journey.",
            "A heartwarming story that will touch your soul and stay with you forever.",
            "A gripping mystery that will keep you guessing until the very last page.",
            "An epic tale of love, loss, and redemption that spans generations.",
            "A fascinating look into the world of science and discovery.",
            "A powerful story of survival against all odds.",
            "An enchanting tale of magic, wonder, and the power of imagination.",
            "A compelling narrative that explores the complexities of human nature.",
            "A beautiful story of friendship, loyalty, and the bonds that unite us.",
            "An exciting adventure filled with danger, mystery, and unexpected twists.",
            "A profound exploration of the human condition and what it means to be alive.",
            "A mesmerizing tale that blends reality with fantasy in unexpected ways.",
            "A moving story of family, love, and the ties that bind us together.",
            "An intriguing mystery that will challenge your mind and captivate your imagination.",
            "A sweeping epic that spans continents and centuries.",
            "A delightful story that will bring joy and laughter to readers of all ages.",
            "A powerful narrative that examines the darker aspects of human nature.",
            "An uplifting tale of hope, perseverance, and the triumph of the human spirit.",
            "A fascinating journey into the unknown that will expand your horizons.",
            "A compelling story of transformation and personal growth.",
            "An engaging tale that combines history, adventure, and romance.",
            "A thought-provoking work that challenges conventional wisdom and beliefs.",
            "A beautiful story of love, sacrifice, and the power of forgiveness.",
            "An exciting adventure that will transport you to distant lands and times.",
            "A profound meditation on life, death, and the meaning of existence.",
            "A captivating story that weaves together multiple narratives and perspectives.",
            "An inspiring tale of overcoming obstacles and achieving your dreams."
        };

        public List<Book> GenerateBooks(int count)
        {
            var books = new List<Book>();
            
            for (int i = 1; i <= count; i++)
            {
                var book = new Book
                {
                    Id = i,
                    Title = GenerateTitle(),
                    Author = GenerateAuthor(),
                    Category = _categories[_random.Next(_categories.Length)],
                    Description = _descriptions[_random.Next(_descriptions.Length)],
                    Cover = GenerateCoverImage(),
                    Available = _random.Next(100) < 85, // 85% available
                    Formats = GenerateFormats(),
                    DueDate = null,
                    Popularity = _random.Next(20, 100)
                };
                
                books.Add(book);
            }
            
            return books;
        }

        public List<APBook> GenerateAPBooks(int count)
        {
            var apBooks = new List<APBook>();
            var subjects = new[] { "math", "science", "english", "history", "languages", "arts" };
            var types = new[] { "textbook", "study-guide" };
            
            for (int i = 1; i <= count; i++)
            {
                var subject = subjects[_random.Next(subjects.Length)];
                var type = types[_random.Next(types.Length)];
                
                var apBook = new APBook
                {
                    Id = i,
                    Title = GenerateAPTitle(subject, type),
                    Author = GenerateAuthor(),
                    Subject = subject,
                    Type = type,
                    Description = GenerateAPDescription(subject, type),
                    Cover = GenerateAPCoverImage(subject),
                    Available = _random.Next(100) < 80, // 80% available
                    Formats = GenerateFormats(),
                    DueDate = null,
                    Popularity = _random.Next(30, 100)
                };
                
                apBooks.Add(apBook);
            }
            
            return apBooks;
        }

        private string GenerateTitle()
        {
            var titleParts = new List<string>();
            
            // 70% chance of having "The" or "A" at the beginning
            if (_random.Next(100) < 70)
            {
                titleParts.Add(_bookTitles[_random.Next(10)]); // The, A, An, My, etc.
            }
            
            // Add 1-3 more words
            var wordCount = _random.Next(1, 4);
            for (int i = 0; i < wordCount; i++)
            {
                titleParts.Add(_bookTitles[_random.Next(_bookTitles.Length)]);
            }
            
            // 30% chance of adding a suffix
            if (_random.Next(100) < 30)
            {
                titleParts.Add(_bookSuffixes[_random.Next(_bookSuffixes.Length)]);
            }
            
            return string.Join(" ", titleParts);
        }

        private string GenerateAPTitle(string subject, string type)
        {
            var subjectNames = new Dictionary<string, string[]>
            {
                ["math"] = new[] { "Calculus", "Algebra", "Geometry", "Statistics", "Trigonometry", "Pre-Calculus" },
                ["science"] = new[] { "Biology", "Chemistry", "Physics", "Environmental Science", "Psychology" },
                ["english"] = new[] { "English Literature", "English Language", "Composition", "Rhetoric" },
                ["history"] = new[] { "World History", "US History", "European History", "Art History" },
                ["languages"] = new[] { "Spanish", "French", "German", "Italian", "Chinese", "Japanese" },
                ["arts"] = new[] { "Art History", "Music Theory", "Studio Art", "Theater" }
            };
            
            var subjectName = subjectNames[subject][_random.Next(subjectNames[subject].Length)];
            var typeName = type == "textbook" ? "Textbook" : "Study Guide";
            
            return $"AP {subjectName} {typeName}";
        }

        private string GenerateAuthor()
        {
            var firstName = _firstNames[_random.Next(_firstNames.Length)];
            var lastName = _lastNames[_random.Next(_lastNames.Length)];
            
            // 20% chance of having a title
            if (_random.Next(100) < 20)
            {
                var titles = new[] { "Dr.", "Prof.", "Professor" };
                var title = titles[_random.Next(titles.Length)];
                return $"{title} {firstName} {lastName}";
            }
            
            return $"{firstName} {lastName}";
        }

        private string GenerateFormats()
        {
            var formats = new List<string>();
            
            if (_random.Next(100) < 90) formats.Add("digital");
            if (_random.Next(100) < 70) formats.Add("physical");
            
            return formats.Count > 0 ? string.Join(",", formats) : "digital";
        }

        private string GenerateCoverImage()
        {
            // Generate a simple colored rectangle with book title
            var colors = new[] { "4A90E2", "27AE60", "F39C12", "9B59B6", "E74C3C", "3498DB", "E67E22", "2ECC71", "9B59B6", "34495E" };
            var color = colors[_random.Next(colors.Length)];
            
            var svg = $@"<svg width=""200"" height=""300"" xmlns=""http://www.w3.org/2000/svg"">
  <rect width=""100%"" height=""100%"" fill=""#{color}""/>
  <text x=""50%"" y=""50%"" font-family=""Arial"" font-size=""14"" fill=""#FFFFFF"" text-anchor=""middle"" dy="".3em"">Book</text>
</svg>";
            
            var bytes = System.Text.Encoding.UTF8.GetBytes(svg);
            var base64 = Convert.ToBase64String(bytes);
            
            return $"data:image/svg+xml;base64,{base64}";
        }

        private string GenerateAPCoverImage(string subject)
        {
            var subjectColors = new Dictionary<string, string>
            {
                ["math"] = "8E44AD",
                ["science"] = "27AE60", 
                ["english"] = "E74C3C",
                ["history"] = "F39C12",
                ["languages"] = "16A085",
                ["arts"] = "9B59B6"
            };
            
            var color = subjectColors[subject];
            
            var svg = $@"<svg width=""200"" height=""300"" xmlns=""http://www.w3.org/2000/svg"">
  <rect width=""100%"" height=""100%"" fill=""#{color}""/>
  <text x=""50%"" y=""50%"" font-family=""Arial"" font-size=""14"" fill=""#FFFFFF"" text-anchor=""middle"" dy="".3em"">AP</text>
</svg>";
            
            var bytes = System.Text.Encoding.UTF8.GetBytes(svg);
            var base64 = Convert.ToBase64String(bytes);
            
            return $"data:image/svg+xml;base64,{base64}";
        }

        private string GenerateAPDescription(string subject, string type)
        {
            var subjectDescriptions = new Dictionary<string, string>
            {
                ["math"] = "Comprehensive coverage of mathematical concepts and problem-solving techniques.",
                ["science"] = "In-depth exploration of scientific principles and experimental methods.",
                ["english"] = "Detailed analysis of literature and development of critical thinking skills.",
                ["history"] = "Thorough examination of historical events and their impact on society.",
                ["languages"] = "Complete language learning program with cultural context and practice exercises.",
                ["arts"] = "Comprehensive study of artistic movements, techniques, and cultural significance."
            };
            
            var typeDescriptions = new Dictionary<string, string>
            {
                ["textbook"] = "Complete textbook with detailed explanations, examples, and practice problems.",
                ["study-guide"] = "Essential study guide with key concepts, practice tests, and exam strategies."
            };
            
            return $"{subjectDescriptions[subject]} {typeDescriptions[type]}";
        }
    }
}
