// Grab-a-Book - Free Library Application
class GrabABook {
    constructor() {
        this.currentUser = null;
        this.books = [];
        this.apBooks = [];
        this.checkedOutBooks = [];
        this.readingHistory = []; // Store previously read books
        this.currentPage = 'home';
        this.lateFees = 0;
        this.apiBaseUrl = 'http://localhost:5000/api'; // Update this to match your API URL
        this.isAdmin = false;
        this.donations = []; // Store donations data
        this.init();
    }

    async init() {
        await this.loadBooksFromAPI();
        this.loadFeaturedBooks();
        this.setupEventListeners();
        this.checkUserSession();
    }

    // Load books from API
    async loadBooksFromAPI() {
        try {
            // Try to fetch from API first
            const [booksResponse, apBooksResponse] = await Promise.all([
                fetch(`${this.apiBaseUrl}/books`),
                fetch(`${this.apiBaseUrl}/apbooks`)
            ]);
            
            if (booksResponse.ok && apBooksResponse.ok) {
                this.books = await booksResponse.json();
                this.apBooks = await apBooksResponse.json();
                
                // Convert formats from comma-separated string to array
                this.books = this.books.map(book => ({
                    ...book,
                    formats: typeof book.formats === 'string' ? book.formats.split(',') : book.formats
                }));
                this.apBooks = this.apBooks.map(book => ({
                    ...book,
                    formats: typeof book.formats === 'string' ? book.formats.split(',') : book.formats
                }));
                
                console.log('Successfully loaded books from API', {
                    books: this.books.length,
                    apBooks: this.apBooks.length
                });
            } else {
                throw new Error('API not responding');
            }
        } catch (error) {
            console.log('API not available, using sample data:', error);
            this.books = this.generateSampleBooks();
            this.apBooks = this.generateAPBooks();
        }
    }

    // Sample book data - fallback when API is not available
    generateSampleBooks() {
        return [
            {
                id: 1,
                title: "To Kill a Mockingbird",
                author: "Harper Lee",
                category: "fiction",
                description: "A gripping tale of racial injustice and childhood innocence in the American South.",
                cover: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNEE5MEUyIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlRvIEtpbGwgYSBNb2NraW5nYmlyZDwvdGV4dD4KPC9zdmc+",
                available: true,
                formats: ["digital", "physical"],
                dueDate: null,
                popularity: 95
            },
            {
                id: 2,
                title: "Mathematics for Beginners",
                author: "Dr. Sarah Johnson",
                category: "education",
                description: "Essential math concepts explained in simple terms for all ages.",
                cover: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMjdBRTYwIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk1hdGggQmFzaWNzPC90ZXh0Pgo8L3N2Zz4=",
                available: true,
                formats: ["digital", "physical"],
                dueDate: null,
                popularity: 78
            },
            {
                id: 3,
                title: "The Little Prince",
                author: "Antoine de Saint-Exupéry",
                category: "children",
                description: "A timeless story about friendship, love, and the importance of seeing with the heart.",
                cover: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRjM5QzEyIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxpdHRsZSBQcmluY2U8L3RleHQ+Cjwvc3ZnPg==",
                available: true,
                formats: ["digital", "physical"],
                dueDate: null,
                popularity: 92
            },
            {
                id: 4,
                title: "Sapiens: A Brief History of Humankind",
                author: "Yuval Noah Harari",
                category: "non-fiction",
                description: "Explore the history and impact of Homo sapiens on the world.",
                cover: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjOUI1OUI2Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlNhcGllbnM8L3RleHQ+Cjwvc3ZnPg==",
                available: true,
                formats: ["digital", "physical"],
                dueDate: null,
                popularity: 88
            },
            {
                id: 5,
                title: "The Great Gatsby",
                author: "F. Scott Fitzgerald",
                category: "fiction",
                description: "A classic American novel about the Jazz Age and the American Dream.",
                cover: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRTc0QzNDIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkdyZWF0IEdhdHNieTwvdGV4dD4KPC9zdmc+",
                available: false,
                formats: ["digital", "physical"],
                dueDate: "2024-02-15",
                popularity: 90
            },
            {
                id: 6,
                title: "Science Made Simple",
                author: "Prof. Michael Chen",
                category: "education",
                description: "Basic science concepts made accessible for everyone.",
                cover: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzQ5OEQiLz4KICA8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjRkZGRkZGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+U2NpZW5jZSBTaW1wbGU8L3RleHQ+Cjwvc3ZnPg==",
                available: true,
                formats: ["digital"],
                dueDate: null,
                popularity: 75
            },
            {
                id: 7,
                title: "Harry Potter and the Sorcerer's Stone",
                author: "J.K. Rowling",
                category: "children",
                description: "The magical beginning of Harry Potter's journey at Hogwarts School of Witchcraft and Wizardry.",
                cover: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkY2QjAwIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkhhcnJ5IFBvdHRlcjwvdGV4dD4KPC9zdmc+",
                available: true,
                formats: ["digital", "physical"],
                dueDate: null,
                popularity: 98
            },
            {
                id: 8,
                title: "Pride and Prejudice",
                author: "Jane Austen",
                category: "fiction",
                description: "A romantic novel about Elizabeth Bennet and Mr. Darcy in 19th century England.",
                cover: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjOUI1OUI2Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlByaWRlICYgUHJlanVkaWNlPC90ZXh0Pgo8L3N2Zz4=",
                available: true,
                formats: ["digital", "physical"],
                dueDate: null,
                popularity: 89
            },
            {
                id: 9,
                title: "The Cat in the Hat",
                author: "Dr. Seuss",
                category: "children",
                description: "A classic children's book about a mischievous cat who visits two children on a rainy day.",
                cover: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkY0NDQ0Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNhdCBpbiB0aGUgSGF0PC90ZXh0Pgo8L3N2Zz4=",
                available: true,
                formats: ["digital", "physical"],
                dueDate: null,
                popularity: 85
            },
            {
                id: 10,
                title: "1984",
                author: "George Orwell",
                category: "fiction",
                description: "A dystopian novel about totalitarian surveillance and thought control.",
                cover: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzMzMzIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPjE5ODQ8L3RleHQ+Cjwvc3ZnPg==",
                available: true,
                formats: ["digital", "physical"],
                dueDate: null,
                popularity: 91
            },
            {
                id: 11,
                title: "The Diary of Anne Frank",
                author: "Anne Frank",
                category: "non-fiction",
                description: "The diary of a young Jewish girl hiding from the Nazis during World War II.",
                cover: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjOEI0NkQ5Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkFubmUgRnJhbmvigJlzIERpYXJ5PC90ZXh0Pgo8L3N2Zz4=",
                available: true,
                formats: ["digital", "physical"],
                dueDate: null,
                popularity: 87
            },
            {
                id: 12,
                title: "Basic Physics",
                author: "Dr. James Wilson",
                category: "education",
                description: "Introduction to physics concepts for high school students.",
                cover: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRTc0QzNDIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkJhc2ljIFBoeXNpY3M8L3RleHQ+Cjwvc3ZnPg==",
                available: true,
                formats: ["digital", "physical"],
                dueDate: null,
                popularity: 73
            },
            {
                id: 13,
                title: "Charlotte's Web",
                author: "E.B. White",
                category: "children",
                description: "A heartwarming story about friendship between a pig named Wilbur and a spider named Charlotte.",
                cover: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRjM5QzEyIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNoYXJsb3R0ZSdzIFdlYjwvdGV4dD4KPC9zdmc+",
                available: true,
                formats: ["digital", "physical"],
                dueDate: null,
                popularity: 84
            },
            {
                id: 14,
                title: "The Hunger Games",
                author: "Suzanne Collins",
                category: "fiction",
                description: "A dystopian novel about a televised fight to the death in a post-apocalyptic world.",
                cover: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjQ0M0QzQzIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkh1bmdlciBHYW1lczwvdGV4dD4KPC9zdmc+",
                available: true,
                formats: ["digital", "physical"],
                dueDate: null,
                popularity: 93
            },
            {
                id: 15,
                title: "World War II: A History",
                author: "Dr. Robert Smith",
                category: "non-fiction",
                description: "Comprehensive account of the Second World War and its global impact.",
                cover: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjOUI1OUI2Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPldXSUkgSGlzdG9yeTwvdGV4dD4KPC9zdmc+",
                available: true,
                formats: ["digital", "physical"],
                dueDate: null,
                popularity: 81
            },
            {
                id: 16,
                title: "Algebra Made Easy",
                author: "Prof. Maria Garcia",
                category: "education",
                description: "Step-by-step guide to algebra concepts and problem solving.",
                cover: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMjdBRTYwIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkFsZ2VicmEgTWFkZSBFYXN5PC90ZXh0Pgo8L3N2Zz4=",
                available: true,
                formats: ["digital", "physical"],
                dueDate: null,
                popularity: 76
            }
        ];
    }

    // AP Books data
    generateAPBooks() {
        return [
            {
                id: 101,
                title: "AP Calculus AB Textbook",
                author: "Dr. Michael Thompson",
                subject: "math",
                type: "textbook",
                description: "Comprehensive textbook covering all AP Calculus AB topics with practice problems and solutions.",
                cover: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjOEU0NEFEIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkFQIENhbGN1bHVzPC90ZXh0Pgo8L3N2Zz4=",
                available: true,
                formats: ["digital", "physical"],
                dueDate: null,
                popularity: 92
            },
            {
                id: 102,
                title: "AP Biology Study Guide",
                author: "Dr. Sarah Wilson",
                subject: "science",
                type: "study-guide",
                description: "Essential study guide for AP Biology exam with practice tests and detailed explanations.",
                cover: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMjdBRTYwIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkFQIEJpb2xvZ3k8L3RleHQ+Cjwvc3ZnPg==",
                available: true,
                formats: ["digital", "physical"],
                dueDate: null,
                popularity: 88
            },
            {
                id: 103,
                title: "AP English Literature Textbook",
                author: "Prof. Jennifer Davis",
                subject: "english",
                type: "textbook",
                description: "Complete guide to AP English Literature with literary analysis and essay writing techniques.",
                cover: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRTc0QzNDIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkFQIEVuZ2xpc2g8L3RleHQ+Cjwvc3ZnPg==",
                available: true,
                formats: ["digital", "physical"],
                dueDate: null,
                popularity: 85
            },
            {
                id: 104,
                title: "AP World History Study Guide",
                author: "Dr. Robert Chen",
                subject: "history",
                type: "study-guide",
                description: "Comprehensive study guide covering all periods of world history for AP exam preparation.",
                cover: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRjM5QzEyIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkFQIEhpc3Rvcnk8L3RleHQ+Cjwvc3ZnPg==",
                available: false,
                formats: ["digital", "physical"],
                dueDate: "2024-02-20",
                popularity: 90
            },
            {
                id: 105,
                title: "AP Chemistry Textbook",
                author: "Dr. Lisa Martinez",
                subject: "science",
                type: "textbook",
                description: "Complete AP Chemistry textbook with lab experiments and practice problems.",
                cover: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzQ5OEQiLz4KICA8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjRkZGRkZGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+QVAgQ2hlbWlzdHJ5PC90ZXh0Pgo8L3N2Zz4=",
                available: true,
                formats: ["digital", "physical"],
                dueDate: null,
                popularity: 87
            },
            {
                id: 106,
                title: "AP Spanish Language Study Guide",
                author: "Prof. Carlos Rodriguez",
                subject: "languages",
                type: "study-guide",
                description: "Essential guide for AP Spanish Language exam with cultural context and practice tests.",
                cover: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMTZBMDg1Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkFQIFNwYW5pc2g8L3RleHQ+Cjwvc3ZnPg==",
                available: true,
                formats: ["digital", "physical"],
                dueDate: null,
                popularity: 82
            },
            {
                id: 107,
                title: "AP Physics 1 Textbook",
                author: "Dr. David Kim",
                subject: "science",
                type: "textbook",
                description: "Complete AP Physics 1 textbook covering mechanics, waves, and electricity.",
                cover: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRTc0QzNDIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkFQIFBoeXNpY3MgMTwvdGV4dD4KPC9zdmc+",
                available: true,
                formats: ["digital", "physical"],
                dueDate: null,
                popularity: 86
            },
            {
                id: 108,
                title: "AP US History Study Guide",
                author: "Dr. Patricia Adams",
                subject: "history",
                type: "study-guide",
                description: "Comprehensive study guide for AP US History from colonial times to present.",
                cover: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRjM5QzEyIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkFQIFVTIElpc3Rvcnk8L3RleHQ+Cjwvc3ZnPg==",
                available: true,
                formats: ["digital", "physical"],
                dueDate: null,
                popularity: 89
            },
            {
                id: 109,
                title: "AP Psychology Textbook",
                author: "Dr. Rachel Green",
                subject: "science",
                type: "textbook",
                description: "Complete AP Psychology textbook covering all major psychological concepts and theories.",
                cover: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjOUI1OUI2Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkFQIFBzeWNob2xvZ3k8L3RleHQ+Cjwvc3ZnPg==",
                available: true,
                formats: ["digital", "physical"],
                dueDate: null,
                popularity: 83
            },
            {
                id: 110,
                title: "AP French Language Study Guide",
                author: "Prof. Marie Dubois",
                subject: "languages",
                type: "study-guide",
                description: "Essential guide for AP French Language exam with cultural context and practice tests.",
                cover: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMjdBRTYwIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkFQIEZyZW5jaDwvdGV4dD4KPC9zdmc+",
                available: true,
                formats: ["digital", "physical"],
                dueDate: null,
                popularity: 80
            },
            {
                id: 111,
                title: "AP Statistics Textbook",
                author: "Dr. Kevin Lee",
                subject: "math",
                type: "textbook",
                description: "Complete AP Statistics textbook covering data analysis, probability, and statistical inference.",
                cover: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjOEU0NEFEIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkFQIFN0YXRpc3RpY3M8L3RleHQ+Cjwvc3ZnPg==",
                available: true,
                formats: ["digital", "physical"],
                dueDate: null,
                popularity: 84
            },
            {
                id: 112,
                title: "AP Environmental Science Study Guide",
                author: "Dr. Amanda Foster",
                subject: "science",
                type: "study-guide",
                description: "Comprehensive study guide for AP Environmental Science covering ecosystems, pollution, and sustainability.",
                cover: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMjdBRTYwIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkFQIEVudmlyb25tZW50YWw8L3RleHQ+Cjwvc3ZnPg==",
                available: true,
                formats: ["digital", "physical"],
                dueDate: null,
                popularity: 81
            }
        ];
    }

    setupEventListeners() {
        // Search functionality
        document.getElementById('search-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchBooks();
            }
        });

        // Filter listeners
        document.getElementById('category-filter').addEventListener('change', () => {
            this.applyFilters();
        });

        document.getElementById('digital-filter').addEventListener('change', () => {
            this.applyFilters();
        });

        document.getElementById('physical-filter').addEventListener('change', () => {
            this.applyFilters();
        });

        document.getElementById('sort-filter').addEventListener('change', () => {
            this.applyFilters();
        });

        // AP type filter
        document.getElementById('ap-type-filter').addEventListener('change', () => {
            this.applyAPFilters();
        });

        // Money donation form
        document.getElementById('money-donation-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitMoneyDonation();
        });

        // Amount button click handlers
        document.querySelectorAll('.amount-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const amount = e.target.getAttribute('data-amount');
                document.getElementById('donation-amount').value = amount;
                // Highlight selected button
                document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // Book donation form
        document.getElementById('book-donation-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitBookDonation();
        });

        // Magazine request form
        document.getElementById('magazine-request-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitMagazineRequest();
        });

    }

    // Navigation functions
    showHome() {
        this.showPage('home');
        this.updateNavActive('home');
    }

    showBrowse() {
        this.showPage('browse');
        this.updateNavActive('browse');
        this.loadBrowseBooks();
    }

    showMyBooks() {
        if (!this.currentUser) {
            this.showLogin();
            return;
        }
        this.showPage('my-books');
        this.updateNavActive('my-books');
        this.loadMyBooks();
        this.updateLateFees();
    }

    showAPClasses() {
        this.showPage('ap-classes');
        this.updateNavActive('ap-classes');
        this.loadAPBooks();
    }


    showMagazine() {
        this.showPage('magazine');
        this.updateNavActive('magazine');
    }

    showDonate() {
        this.showPage('donate');
        this.updateNavActive('donate');
    }

    showPage(pageName) {
        // Hide all pages
        document.querySelectorAll('.page-content').forEach(page => {
            page.classList.add('d-none');
        });
        
        // Show selected page
        document.getElementById(`${pageName}-page`).classList.remove('d-none');
        this.currentPage = pageName;
    }

    updateNavActive(activePage) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`[onclick="show${activePage.charAt(0).toUpperCase() + activePage.slice(1)}()"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    // AP Books functions
    loadAPBooks() {
        const apContainer = document.getElementById('ap-books');
        apContainer.innerHTML = this.apBooks.map(book => 
            this.createAPBookCard(book)
        ).join('');
    }

    createAPBookCard(book) {
        const availabilityBadge = book.available ? 
            '<span class="badge bg-success">Available</span>' : 
            '<span class="badge bg-warning">Checked Out</span>';
        
        const typeBadge = book.type === 'textbook' ? 
            '<span class="badge bg-primary">Textbook</span>' : 
            '<span class="badge bg-info">Study Guide</span>';

        const dueDateInfo = book.dueDate ? 
            `<small class="text-muted d-block">Due: ${new Date(book.dueDate).toLocaleDateString()}</small>` : '';

        return `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="card h-100 book-card">
                    <img src="${book.cover}" class="card-img-top" alt="${book.title}" style="height: 250px; object-fit: cover;">
                    <div class="card-body d-flex flex-column">
                        <h6 class="card-title">${book.title}</h6>
                        <p class="card-text text-muted small">by ${book.author}</p>
                        <p class="card-text small flex-grow-1">${book.description}</p>
                        <div class="mt-auto">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                ${availabilityBadge}
                                ${typeBadge}
                            </div>
                            ${dueDateInfo}
                            <div class="d-flex gap-2">
                                <button class="btn btn-outline-secondary btn-sm flex-fill" onclick="grabABook.showBookDetails(${book.id}, 'ap')">
                                    <i class="fas fa-info-circle me-1"></i>Details
                                </button>
                                <button class="btn btn-primary btn-sm flex-fill" onclick="grabABook.checkoutBook(${book.id}, 'ap')" ${!book.available ? 'disabled' : ''}>
                                    <i class="fas fa-shopping-cart me-1"></i>Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    filterAPBySubject(subject) {
        const subjectTitles = {
            'all': 'All AP Materials',
            'math': 'Mathematics',
            'science': 'Sciences',
            'english': 'English',
            'history': 'History',
            'languages': 'Languages'
        };

        document.getElementById('ap-subject-title').textContent = subjectTitles[subject];
        
        let filteredBooks = [...this.apBooks];
        if (subject !== 'all') {
            filteredBooks = filteredBooks.filter(book => book.subject === subject);
        }

        const apContainer = document.getElementById('ap-books');
        apContainer.innerHTML = filteredBooks.map(book => 
            this.createAPBookCard(book)
        ).join('');

        // Update active filter button
        document.querySelectorAll('#ap-classes-page .list-group-item').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
    }

    applyAPFilters() {
        const typeFilter = document.getElementById('ap-type-filter').value;
        let filteredBooks = [...this.apBooks];

        if (typeFilter !== 'all') {
            filteredBooks = filteredBooks.filter(book => book.type === typeFilter);
        }

        const apContainer = document.getElementById('ap-books');
        apContainer.innerHTML = filteredBooks.map(book => 
            this.createAPBookCard(book)
        ).join('');
    }

    // Book loading functions
    loadFeaturedBooks() {
        const featuredContainer = document.getElementById('featured-books');
        const featuredBooks = this.books.slice(0, 4);
        
        featuredContainer.innerHTML = featuredBooks.map(book => 
            this.createBookCard(book, 'featured')
        ).join('');
    }

    loadBrowseBooks() {
        const browseContainer = document.getElementById('browse-books');
        browseContainer.innerHTML = this.books.map(book => 
            this.createBookCard(book, 'browse')
        ).join('');
    }

    loadMyBooks() {
        const myBooksContainer = document.getElementById('checked-out-books');
        const userBooks = [...this.books, ...this.apBooks].filter(book => !book.available);
        
        // Count books by delivery method
        const digitalBooks = userBooks.filter(book => book.deliveryMethod === 'digital');
        const physicalBooks = userBooks.filter(book => book.deliveryMethod === 'physical');
        
        // Check for overdue books
        const today = new Date();
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(today.getDate() + 3);
        
        const overdueBooks = userBooks.filter(book => {
            if (!book.dueDate) return false;
            return new Date(book.dueDate) < today;
        });
        
        const dueSoonBooks = userBooks.filter(book => {
            if (!book.dueDate) return false;
            const dueDate = new Date(book.dueDate);
            return dueDate >= today && dueDate <= threeDaysFromNow;
        });
        
        const statsHtml = `
            <div class="row mb-4">
                <div class="col-md-3">
                    <div class="card bg-light">
                        <div class="card-body text-center">
                            <h5 class="card-title">Digital Books</h5>
                            <h3 class="text-primary">${digitalBooks.length}/5</h3>
                            <small class="text-muted">Limit: 5 digital books</small>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card bg-light">
                        <div class="card-body text-center">
                            <h5 class="card-title">Physical Books</h5>
                            <h3 class="text-warning">${physicalBooks.length}/3</h3>
                            <small class="text-muted">Limit: 3 physical books</small>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card bg-light">
                        <div class="card-body text-center">
                            <h5 class="card-title">Total Books</h5>
                            <h3 class="text-success">${userBooks.length}</h3>
                            <small class="text-muted">Currently checked out</small>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card ${dueSoonBooks.length > 0 ? 'bg-warning' : 'bg-light'}">
                        <div class="card-body text-center">
                            <h5 class="card-title">Due Soon</h5>
                            <h3>${dueSoonBooks.length}</h3>
                            <small>Within 3 days</small>
                        </div>
                    </div>
                </div>
            </div>
            ${overdueBooks.length > 0 ? `
                <div class="alert alert-danger mb-4">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    <strong>Warning:</strong> You have ${overdueBooks.length} overdue book(s). Please return them immediately to avoid additional late fees.
                </div>
            ` : ''}
        `;
        
        if (userBooks.length === 0 && this.readingHistory.length === 0) {
            myBooksContainer.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-info text-center">
                        <i class="fas fa-book-open fa-3x mb-3"></i>
                        <h4>No books checked out</h4>
                        <p>Start exploring our collection to find your next great read!</p>
                        <button class="btn btn-primary" onclick="grabABook.showBrowse()">Browse Books</button>
                    </div>
                </div>
            `;
        } else {
            let content = statsHtml;
            
            // All checked out books in one section
            if (userBooks.length > 0) {
                content += `
                    <div class="col-12 mb-4">
                        <h4 class="mb-3">
                            <i class="fas fa-book-open me-2"></i>My Books (${userBooks.length})
                        </h4>
                        <div class="row">
                            ${userBooks.map(book => this.createBookCard(book, 'my-books')).join('')}
                        </div>
                    </div>
                `;
            }
            
            // Reading history section
            if (this.readingHistory.length > 0) {
                content += `
                    <div class="col-12 mb-4">
                        <h4 class="text-primary mb-3">
                            <i class="fas fa-history me-2"></i>Reading History (${this.readingHistory.length})
                        </h4>
                        <div class="row">
                            ${this.readingHistory.map(historyItem => this.createHistoryCard(historyItem)).join('')}
                        </div>
                    </div>
                `;
            }
            
            myBooksContainer.innerHTML = content;
        }
    }

    createBookCard(book, context = 'browse') {
        const availabilityBadge = book.available ? 
            '<span class="badge bg-success">Available</span>' : 
            '<span class="badge bg-warning">Checked Out</span>';
        
        const dueDateInfo = book.dueDate ? 
            `<small class="text-muted d-block">Due: ${new Date(book.dueDate).toLocaleDateString()}</small>` : '';

        const actionButton = context === 'my-books' ? 
            `<button class="btn btn-outline-primary btn-sm" onclick="grabABook.returnBook(${book.id})">
                <i class="fas fa-undo me-1"></i>Return
            </button>` :
            `<button class="btn btn-primary btn-sm" onclick="grabABook.checkoutBook(${book.id})" ${!book.available ? 'disabled' : ''}>
                <i class="fas fa-shopping-cart me-1"></i>Checkout
            </button>`;

        return `
            <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div class="card h-100 book-card">
                    <img src="${book.cover}" class="card-img-top" alt="${book.title}" style="height: 250px; object-fit: cover;">
                    <div class="card-body d-flex flex-column">
                        <h6 class="card-title">${book.title}</h6>
                        <p class="card-text text-muted small">by ${book.author}</p>
                        <p class="card-text small flex-grow-1">${book.description}</p>
                        <div class="mt-auto">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                ${availabilityBadge}
                                <span class="badge bg-info">${book.category}</span>
                            </div>
                            ${dueDateInfo}
                            <div class="d-flex gap-2">
                                <button class="btn btn-outline-secondary btn-sm flex-fill" onclick="grabABook.showBookDetails(${book.id})">
                                    <i class="fas fa-info-circle me-1"></i>Details
                                </button>
                                ${actionButton}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    createHistoryCard(historyItem) {
        const book = historyItem.book;
        const checkedOutDate = new Date(historyItem.checkedOutDate).toLocaleDateString();
        const returnedDate = new Date(historyItem.returnedDate).toLocaleDateString();
        const wasOverdue = historyItem.wasOverdue;
        
        return `
            <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div class="card h-100 book-card opacity-75">
                    <img src="${book.cover}" class="card-img-top" alt="${book.title}" style="height: 250px; object-fit: cover;">
                    <div class="card-body d-flex flex-column">
                        <h6 class="card-title">${book.title}</h6>
                        <p class="card-text text-muted small">by ${book.author}</p>
                        <div class="mt-auto">
                            <div class="mb-2">
                                <small class="text-muted">
                                    <i class="fas fa-calendar me-1"></i>Checked out: ${checkedOutDate}
                                </small>
                            </div>
                            <div class="mb-2">
                                <small class="text-muted">
                                    <i class="fas fa-calendar-check me-1"></i>Returned: ${returnedDate}
                                </small>
                            </div>
                            ${wasOverdue ? '<span class="badge bg-danger mb-2">Was Overdue</span>' : '<span class="badge bg-success mb-2">Returned On Time</span>'}
                            <div class="d-flex gap-2 mt-2">
                                <button class="btn btn-outline-primary btn-sm flex-fill" onclick="grabABook.checkoutBook(${book.id})">
                                    <i class="fas fa-redo me-1"></i>Read Again
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Search and filter functions
    searchBooks() {
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        if (!searchTerm) return;

        const filteredBooks = this.books.filter(book => 
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm) ||
            book.description.toLowerCase().includes(searchTerm)
        );

        this.showSearchResults(filteredBooks, searchTerm);
    }

    showSearchResults(books, searchTerm) {
        this.showPage('browse');
        this.updateNavActive('browse');
        
        const browseContainer = document.getElementById('browse-books');
        const resultsHeader = document.querySelector('#browse-page h2');
        
        resultsHeader.textContent = `Search Results for "${searchTerm}" (${books.length} found)`;
        
        if (books.length === 0) {
            browseContainer.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-warning text-center">
                        <i class="fas fa-search fa-3x mb-3"></i>
                        <h4>No books found</h4>
                        <p>Try adjusting your search terms or browse our categories.</p>
                    </div>
                </div>
            `;
        } else {
            browseContainer.innerHTML = books.map(book => 
                this.createBookCard(book, 'browse')
            ).join('');
        }
    }

    filterByCategory(category) {
        this.showPage('browse');
        this.updateNavActive('browse');
        
        document.getElementById('category-filter').value = category;
        this.applyFilters();
    }

    applyFilters() {
        const categoryFilter = document.getElementById('category-filter').value;
        const digitalFilter = document.getElementById('digital-filter').checked;
        const physicalFilter = document.getElementById('physical-filter').checked;
        const sortFilter = document.getElementById('sort-filter').value;

        let filteredBooks = [...this.books];

        // Apply category filter
        if (categoryFilter) {
            filteredBooks = filteredBooks.filter(book => book.category === categoryFilter);
        }

        // Apply format filters
        if (digitalFilter && !physicalFilter) {
            filteredBooks = filteredBooks.filter(book => book.formats.includes('digital'));
        } else if (physicalFilter && !digitalFilter) {
            filteredBooks = filteredBooks.filter(book => book.formats.includes('physical'));
        }

        // Apply sorting
        filteredBooks.sort((a, b) => {
            switch (sortFilter) {
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'author':
                    return a.author.localeCompare(b.author);
                case 'popularity':
                    return b.popularity - a.popularity;
                default:
                    return 0;
            }
        });

        const browseContainer = document.getElementById('browse-books');
        browseContainer.innerHTML = filteredBooks.map(book => 
            this.createBookCard(book, 'browse')
        ).join('');
    }

    // Book detail and checkout functions
    showBookDetails(bookId, type = 'regular') {
        const book = type === 'ap' ? 
            this.apBooks.find(b => b.id === bookId) : 
            this.books.find(b => b.id === bookId);
        if (!book) return;

        const modal = new bootstrap.Modal(document.getElementById('bookModal'));
        document.getElementById('bookModalTitle').textContent = book.title;
        
        document.getElementById('bookModalBody').innerHTML = `
            <div class="row">
                <div class="col-md-4">
                    <img src="${book.cover}" class="img-fluid rounded" alt="${book.title}">
                </div>
                <div class="col-md-8">
                    <h4>${book.title}</h4>
                    <p class="text-muted">by ${book.author}</p>
                    <p><strong>Category:</strong> <span class="badge bg-info">${book.category || book.subject}</span></p>
                    ${book.type ? `<p><strong>Type:</strong> <span class="badge bg-primary">${book.type === 'textbook' ? 'Textbook' : 'Study Guide'}</span></p>` : ''}
                    <p><strong>Available Formats:</strong> ${book.formats.map(format => 
                        `<span class="badge bg-secondary me-1">${format}</span>`
                    ).join('')}</p>
                    <p><strong>Description:</strong></p>
                    <p>${book.description}</p>
                    <div class="mt-3">
                        ${book.available ? 
                            `<button class="btn btn-primary" onclick="grabABook.checkoutBook(${book.id}); bootstrap.Modal.getInstance(document.getElementById('bookModal')).hide();">
                                <i class="fas fa-shopping-cart me-1"></i>Checkout This Book
                            </button>` :
                            `<button class="btn btn-secondary" disabled>
                                <i class="fas fa-times me-1"></i>Currently Unavailable
                            </button>`
                        }
                    </div>
                </div>
            </div>
        `;
        
        modal.show();
    }

    checkoutBook(bookId, type = 'regular') {
        const book = type === 'ap' ? 
            this.apBooks.find(b => b.id === bookId) : 
            this.books.find(b => b.id === bookId);
        if (!book || !book.available) return;

        const modal = new bootstrap.Modal(document.getElementById('checkoutModal'));
        
        document.getElementById('checkoutModalBody').innerHTML = `
            <div class="text-center mb-4">
                <img src="${book.cover}" class="img-fluid rounded" style="max-height: 200px;" alt="${book.title}">
                <h5 class="mt-2">${book.title}</h5>
                <p class="text-muted">by ${book.author}</p>
            </div>
            
            <form id="checkout-form">
                <div class="mb-3">
                    <label class="form-label">Delivery Method</label>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="deliveryMethod" id="digital-delivery" value="digital" checked>
                        <label class="form-check-label" for="digital-delivery">
                            <i class="fas fa-tablet-alt me-1"></i> Digital Copy (Instant)
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="deliveryMethod" id="physical-delivery" value="physical">
                        <label class="form-check-label" for="physical-delivery">
                            <i class="fas fa-truck me-1"></i> Physical Copy (3-5 days)
                        </label>
                    </div>
                </div>
                
                <div id="address-section" class="d-none">
                    <div class="mb-3">
                        <label class="form-label">Full Address</label>
                        <textarea class="form-control" rows="3" placeholder="Street address, city, state, ZIP code"></textarea>
                    </div>
                    <div class="alert alert-info">
                        <i class="fas fa-info-circle me-1"></i>
                        Free delivery and return shipping included!
                    </div>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Checkout Period</label>
                    <select class="form-select">
                        <option value="14">2 weeks (Standard)</option>
                        <option value="21">3 weeks (Extended)</option>
                        <option value="30">1 month (Maximum)</option>
                    </select>
                </div>
                
                <div class="alert alert-success">
                    <i class="fas fa-gift me-1"></i>
                    <strong>Free Service!</strong> No fees, no hidden costs. Just return the book by the due date.
                </div>
            </form>
        `;

        // Show/hide address section based on delivery method
        document.querySelectorAll('input[name="deliveryMethod"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                const addressSection = document.getElementById('address-section');
                if (e.target.value === 'physical') {
                    addressSection.classList.remove('d-none');
                } else {
                    addressSection.classList.add('d-none');
                }
            });
        });

        // Add checkout button
        const modalFooter = document.createElement('div');
        modalFooter.className = 'modal-footer';
        modalFooter.innerHTML = `
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" onclick="grabABook.confirmCheckout(${book.id})">
                <i class="fas fa-check me-1"></i>Confirm Checkout
            </button>
        `;
        document.getElementById('checkoutModal').querySelector('.modal-content').appendChild(modalFooter);
        
        modal.show();
    }

    confirmCheckout(bookId, type = 'regular') {
        const book = type === 'ap' ? 
            this.apBooks.find(b => b.id === bookId) : 
            this.books.find(b => b.id === bookId);
        if (!book) return;

        // Check if user has overdue books - prevent checkout if they do
        const overdueBooks = this.getOverdueBooks();
        if (overdueBooks.length > 0) {
            this.showNotification('error', `You cannot check out books because you have ${overdueBooks.length} overdue book(s). Please return them first.`);
            bootstrap.Modal.getInstance(document.getElementById('checkoutModal')).hide();
            return;
        }

        const deliveryMethod = document.querySelector('input[name="deliveryMethod"]:checked').value;
        const checkoutPeriodSelect = document.querySelector('select');
        const checkoutPeriod = checkoutPeriodSelect ? parseInt(checkoutPeriodSelect.value) : 14;
        
        // Check checkout limits
        if (!this.checkCheckoutLimits(deliveryMethod)) {
            return;
        }
        
        // Validate checkout period
        const validPeriod = isNaN(checkoutPeriod) || checkoutPeriod <= 0 ? 14 : checkoutPeriod;
        
        // Calculate due date
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + validPeriod);
        
        // Validate the date is valid
        if (isNaN(dueDate.getTime())) {
            console.error('Invalid due date calculated');
            dueDate.setDate(new Date().getDate() + 14); // fallback to 14 days
        }
        
        // Update book status
        book.available = false;
        book.dueDate = dueDate.toISOString().split('T')[0];
        book.deliveryMethod = deliveryMethod; // Store the delivery method
        book.checkedOutDate = new Date().toISOString(); // Store checkout date for history
        
        // Show success message
        this.showNotification('success', `Successfully checked out "${book.title}"! ${deliveryMethod === 'digital' ? 'Digital copy is now available.' : 'Physical copy will be delivered in 3-5 days.'}`);
        
        // Close modal
        bootstrap.Modal.getInstance(document.getElementById('checkoutModal')).hide();
        
        // Refresh current page
        if (this.currentPage === 'browse') {
            this.loadBrowseBooks();
        } else if (this.currentPage === 'home') {
            this.loadFeaturedBooks();
        } else if (this.currentPage === 'ap-classes') {
            this.loadAPBooks();
        }
    }

    checkCheckoutLimits(deliveryMethod) {
        // Count current checked out books by their delivery method
        const checkedOutBooks = [...this.books, ...this.apBooks].filter(book => !book.available);
        
        const digitalCount = checkedOutBooks.filter(book => 
            book.deliveryMethod === 'digital'
        ).length;
        
        const physicalCount = checkedOutBooks.filter(book => 
            book.deliveryMethod === 'physical'
        ).length;
        
        // Check limits
        if (deliveryMethod === 'digital' && digitalCount >= 5) {
            this.showNotification('warning', `You have reached the limit of 5 digital books (currently have ${digitalCount}). Please return some books before checking out more digital copies.`);
            return false;
        }
        
        if (deliveryMethod === 'physical' && physicalCount >= 3) {
            this.showNotification('warning', `You have reached the limit of 3 physical books (currently have ${physicalCount}). Please return some books before checking out more physical copies.`);
            return false;
        }
        
        return true;
    }

    returnBook(bookId) {
        const book = this.books.find(b => b.id === bookId) || this.apBooks.find(b => b.id === bookId);
        if (!book) return;

        if (confirm(`Return "${book.title}"?`)) {
            const wasOverdue = book.dueDate && new Date(book.dueDate) < new Date();
            
            // Add to reading history
            const historyItem = {
                book: {
                    id: book.id,
                    title: book.title,
                    author: book.author,
                    cover: book.cover,
                    category: book.category || book.subject,
                    description: book.description
                },
                checkedOutDate: book.checkedOutDate || new Date(Date.now() - (14 * 24 * 60 * 60 * 1000)).toISOString(), // Default to 14 days ago if not set
                returnedDate: new Date().toISOString(),
                wasOverdue: wasOverdue
            };
            this.readingHistory.unshift(historyItem); // Add to beginning of array
            
            // Check if book is overdue and remove late fees
            if (wasOverdue) {
                const daysOverdue = Math.ceil((new Date() - new Date(book.dueDate)) / (1000 * 60 * 60 * 24));
                const lateFee = daysOverdue * 0.50; // $0.50 per day
                this.lateFees = Math.max(0, this.lateFees - lateFee);
                this.showNotification('success', `"${book.title}" returned! Late fee of $${lateFee.toFixed(2)} has been removed from your account.`);
            } else {
                this.showNotification('success', `"${book.title}" has been returned successfully!`);
            }
            
            book.available = true;
            book.dueDate = null;
            book.deliveryMethod = null; // Clear delivery method
            book.checkedOutDate = null; // Clear checkout date
            this.updateLateFees();
            this.loadMyBooks();
        }
    }

    // Late fee system
    updateLateFees() {
        let totalLateFees = 0;
        const today = new Date();
        
        // Check regular books
        this.books.forEach(book => {
            if (book.dueDate && !book.available) {
                const dueDate = new Date(book.dueDate);
                if (today > dueDate) {
                    const daysOverdue = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));
                    totalLateFees += daysOverdue * 0.50; // $0.50 per day
                }
            }
        });

        // Check AP books
        this.apBooks.forEach(book => {
            if (book.dueDate && !book.available) {
                const dueDate = new Date(book.dueDate);
                if (today > dueDate) {
                    const daysOverdue = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));
                    totalLateFees += daysOverdue * 0.50; // $0.50 per day
                }
            }
        });

        this.lateFees = totalLateFees;
        
        // Only update if element exists
        const lateFeeElement = document.getElementById('late-fee-amount');
        if (lateFeeElement) {
            lateFeeElement.textContent = `$${totalLateFees.toFixed(2)}`;
        }
        
        // Update color based on amount
        if (lateFeeElement) {
            if (totalLateFees > 0) {
                lateFeeElement.className = 'text-danger';
            } else {
                lateFeeElement.className = 'text-success';
            }
        }
    }

    // Donation functions
    submitMoneyDonation() {
        const amount = parseFloat(document.getElementById('donation-amount').value);
        const donorName = document.getElementById('donor-name').value.trim() || 'Anonymous';
        const donorEmail = document.getElementById('donor-email').value.trim();
        const paymentMethod = document.getElementById('payment-method').value;

        if (!amount || amount <= 0) {
            this.showNotification('error', 'Please enter a valid donation amount.');
            return;
        }

        if (!donorEmail) {
            this.showNotification('error', 'Please enter your email address.');
            return;
        }

        if (!paymentMethod) {
            this.showNotification('error', 'Please select a payment method.');
            return;
        }

        // Store donation
        this.donations.push({
            type: 'money',
            amount: amount,
            donorName: donorName,
            donorEmail: donorEmail,
            paymentMethod: paymentMethod,
            createdAt: new Date().toISOString(),
            status: 'Completed'
        });

        // Show success message
        const message = donorName === 'Anonymous' 
            ? `Thank you for your $${amount} donation! A receipt has been sent to ${donorEmail}.`
            : `Thank you, ${donorName}, for your $${amount} donation! A receipt has been sent to ${donorEmail}.`;
        
        this.showNotification('success', message);

        // Reset form
        document.getElementById('money-donation-form').reset();
        document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('active'));
    }

    submitBookDonation() {
        const form = document.getElementById('book-donation-form');
        const formData = new FormData(form);
        
        // Store book donation
        this.donations.push({
            type: 'book',
            bookTitle: formData.get('bookTitle') || 'Book Donation',
            bookAuthor: formData.get('bookAuthor') || 'Unknown',
            bookCategory: formData.get('bookCategory') || 'General',
            bookCondition: formData.get('bookCondition') || 'Good',
            donorName: formData.get('donorName') || 'Anonymous',
            donorEmail: formData.get('donorEmail') || '',
            donorPhone: formData.get('donorPhone') || '',
            createdAt: new Date().toISOString(),
            status: 'Pending'
        });
        
        this.showNotification('success', 'Thank you for your book donation! We will contact you within 2-3 business days to arrange pickup or drop-off.');
        form.reset();
    }

    // Free magazine request functions
    submitMagazineRequest() {
        const form = document.getElementById('magazine-request-form');
        const formData = new FormData(form);
        const magazineType = form.querySelector('select').value;
        
        // Simulate form submission
        const magazineTypes = {
            'ap': 'AP Class Materials',
            'children-fantasy': 'Children\'s Fantasy & Adventure',
            'historical-nonfiction': 'Historical Non-Fiction',
            'fiction': 'Fiction & Literature',
            'education': 'Educational & Textbooks',
            'general': 'General Catalog (All Books)'
        };
        
        this.showNotification('success', `Thank you for requesting your free ${magazineTypes[magazineType]} magazine! Your magazine will arrive within 7-10 business days.`);
        form.reset();
    }


    // User authentication (simplified for demo)
    showLogin() {
        alert('Login functionality would be implemented here. For demo purposes, you are automatically logged in.');
        this.currentUser = { id: 1, name: 'Demo User' };
        this.updateUserInterface();
    }

    showRegister() {
        alert('Registration functionality would be implemented here. For demo purposes, you are automatically registered and logged in.');
        this.currentUser = { id: 1, name: 'Demo User' };
        this.updateUserInterface();
    }

    checkUserSession() {
        // In a real app, this would check for stored session/token
        // For demo, we'll simulate a logged-in user with realistic checked-out books
        this.currentUser = { id: 1, name: 'Demo User' };
        
        // Set up demo user's checked-out books: 5 digital, 3 physical
        this.setupDemoUserBooks();
        
        this.updateUserInterface();
    }

    setupDemoUserBooks() {
        // First, make sure ALL books are available (clear any existing checkouts)
        [...this.books, ...this.apBooks].forEach(book => {
            book.available = true;
            book.dueDate = null;
            book.deliveryMethod = null;
        });

        // Calculate due dates
        const getDueDate = (daysFromNow) => {
            const date = new Date();
            date.setDate(date.getDate() + daysFromNow);
            return date.toISOString().split('T')[0];
        };

        // Mark ONLY 5 digital books as checked out (different due dates)
        const digitalBooks = [
            { id: 1, days: 7 },   // The Great Gatsby - due in 1 week
            { id: 3, days: 14 },  // To Kill a Mockingbird - due in 2 weeks
            { id: 5, days: 10 },  // Pride and Prejudice - due in 10 days
            { id: 101, days: 21 }, // AP Calculus AB Textbook - due in 3 weeks
            { id: 103, days: 5 }   // AP English Literature Study Guide - due in 5 days
        ];

        digitalBooks.forEach(({ id, days }) => {
            const book = this.books.find(b => b.id === id) || this.apBooks.find(b => b.id === id);
            if (book) {
                book.available = false;
                book.dueDate = getDueDate(days);
                book.deliveryMethod = 'digital';
                // Set checkout date (assume it was checked out when the due date period started)
                const checkoutDate = new Date();
                checkoutDate.setDate(checkoutDate.getDate() - (21 - days)); // Adjusted based on due date
                book.checkedOutDate = checkoutDate.toISOString();
            }
        });

        // Mark ONLY 3 physical books as checked out (different due dates)
        const physicalBooks = [
            { id: 7, days: 12 },  // The Catcher in the Rye - due in 12 days
            { id: 9, days: 18 },  // Brave New World - due in 18 days
            { id: 105, days: 21 } // AP Biology Textbook - due in 3 weeks
        ];

        physicalBooks.forEach(({ id, days }) => {
            const book = this.books.find(b => b.id === id) || this.apBooks.find(b => b.id === id);
            if (book) {
                book.available = false;
                book.dueDate = getDueDate(days);
                book.deliveryMethod = 'physical';
                // Set checkout date (assume it was checked out when the due date period started)
                const checkoutDate = new Date();
                checkoutDate.setDate(checkoutDate.getDate() - (21 - days)); // Adjusted based on due date
                book.checkedOutDate = checkoutDate.toISOString();
            }
        });

        // Verify: Count the checked-out books
        const checkedOut = [...this.books, ...this.apBooks].filter(b => !b.available);
        console.log(`Demo user setup: ${checkedOut.length} total books checked out`);
        console.log(`- Digital: ${checkedOut.filter(b => b.deliveryMethod === 'digital').length}`);
        console.log(`- Physical: ${checkedOut.filter(b => b.deliveryMethod === 'physical').length}`);
    }

    updateUserInterface() {
        if (this.currentUser) {
            // Update navbar to show user info
            const navbarRight = document.querySelector('.navbar .d-flex');
            navbarRight.innerHTML = `
                <span class="navbar-text me-3">
                    <i class="fas fa-user me-1"></i>Welcome, ${this.currentUser.name}
                </span>
                <button class="btn btn-outline-light" onclick="grabABook.logout()">
                    <i class="fas fa-sign-out-alt me-1"></i>Logout
                </button>
            `;
        }
    }

    logout() {
        this.currentUser = null;
        this.updateUserInterface();
        this.showHome();
    }

    // Utility functions
    showNotification(type, message) {
        // Create and show a toast notification
        const toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
        toastContainer.style.zIndex = '9999';
        
        const toastId = 'toast-' + Date.now();
        toastContainer.innerHTML = `
            <div id="${toastId}" class="toast align-items-center text-white bg-${type} border-0" role="alert">
                <div class="d-flex">
                    <div class="toast-body">
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        `;
        
        document.body.appendChild(toastContainer);
        
        const toast = new bootstrap.Toast(document.getElementById(toastId));
        toast.show();
        
        // Remove toast container after it's hidden
        document.getElementById(toastId).addEventListener('hidden.bs.toast', () => {
            document.body.removeChild(toastContainer);
        });
    }

    // Admin functionality
    showAdminLogin() {
        const modal = new bootstrap.Modal(document.getElementById('adminLoginModal'));
        modal.show();
    }

    loginAsAdmin() {
        // Automatic admin login - no credentials needed for demo
        this.isAdmin = true;
        this.showAdminDashboard();
        this.showNotification('success', 'Welcome, Admin! (Demo Mode)');
    }

    loginAdmin() {
        const username = document.getElementById('admin-username').value;
        const password = document.getElementById('admin-password').value;
        
        // Simple admin credentials (in production, this would be server-side)
        if (username === 'admin' && password === 'admin123') {
            this.isAdmin = true;
            bootstrap.Modal.getInstance(document.getElementById('adminLoginModal')).hide();
            this.showAdminDashboard();
            this.showNotification('success', 'Welcome, Admin!');
        } else {
            this.showNotification('error', 'Invalid admin credentials');
        }
    }

    logoutAdmin() {
        this.isAdmin = false;
        this.showHome();
        this.showNotification('info', 'Logged out successfully');
    }

    showAdminDashboard() {
        this.showPage('admin');
        this.updateNavActive('admin');
        this.loadAdminData();
        
        // Initialize Bootstrap tabs
        setTimeout(() => {
            const tabElements = document.querySelectorAll('#adminTabs button[data-bs-toggle="tab"]');
            tabElements.forEach(tabElement => {
                    tabElement.addEventListener('shown.bs.tab', (event) => {
                        const target = event.target.getAttribute('data-bs-target');
                        
                        // Only load data if content is empty (first time viewing tab)
                        if (target === '#overdue' && !document.getElementById('overdue-books-content').innerHTML) {
                            this.loadOverdueBooks();
                        } else if (target === '#donations' && !document.getElementById('donations-content').innerHTML) {
                            this.loadDonations();
                        } else if (target === '#popular' && !document.getElementById('popular-books-content').innerHTML) {
                            this.loadPopularBooksByCategory();
                        } else if (target === '#inventory' && !document.getElementById('inventory-content').innerHTML) {
                            this.loadLibraryInventory();
                        }
                    });
            });
        }, 100);
    }

    loadAdminData() {
        // Add some sample donations if none exist
        if (this.donations.length === 0) {
            this.donations = [
                {
                    type: 'money',
                    amount: 25,
                    donorName: 'John Smith',
                    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
                    status: 'Completed'
                },
                {
                    type: 'money',
                    amount: 50,
                    donorName: 'Sarah Johnson',
                    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
                    status: 'Completed'
                },
                {
                    type: 'book',
                    bookTitle: 'The Great Gatsby',
                    bookAuthor: 'F. Scott Fitzgerald',
                    bookCategory: 'literature',
                    donorName: 'Mike Wilson',
                    createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
                    status: 'Completed'
                }
            ];
        }

        // Make some books overdue for testing
        this.makeSomeBooksOverdue();

        
        // Load popular books by category
        this.loadPopularBooksByCategory();
        
        // Load overdue books
        this.loadOverdueBooks();
        
        // Load donations
        this.loadDonations();
    }

    makeSomeBooksOverdue() {
        // Make first few checked out books overdue for demo purposes
        const checkedOutBooks = [...this.books, ...this.apBooks].filter(book => !book.available);
        const today = new Date();
        
        checkedOutBooks.slice(0, 3).forEach((book, index) => {
            // Set due date to 5-10 days ago to make them overdue
            const overdueDate = new Date(today.getTime() - (5 + index) * 24 * 60 * 60 * 1000);
            book.dueDate = overdueDate.toISOString().split('T')[0];
        });
    }


    loadPopularBooksByCategory() {
        const allBooks = [...this.books, ...this.apBooks];
        const categories = [...new Set(allBooks.map(book => book.category || book.subject))];
        
        let content = '';
        
        categories.forEach(category => {
            const categoryBooks = allBooks.filter(book => (book.category || book.subject) === category);
            const popularBooks = categoryBooks
                .sort((a, b) => b.popularity - a.popularity)
                .slice(0, 3);
            
            content += `
                <div class="mb-4">
                    <h6 class="text-primary">${category.charAt(0).toUpperCase() + category.slice(1)}</h6>
                    <div class="row">
                        ${popularBooks.map(book => `
                            <div class="col-md-4 mb-2">
                                <div class="card h-100">
                                    <div class="card-body p-2">
                                        <h6 class="card-title small">${book.title}</h6>
                                        <p class="card-text small text-muted">by ${book.author}</p>
                                        <span class="badge bg-info small">Popularity: ${book.popularity}</span>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        });
        
        document.getElementById('popular-books-content').innerHTML = content;
    }

    loadOverdueBooks() {
        // Use cached overdue books or calculate quickly
        let overdueBooks = this.cachedOverdueBooks;
        
        if (!overdueBooks) {
            overdueBooks = this.getOverdueBooks();
            this.cachedOverdueBooks = overdueBooks; // Cache for faster loading
        }
        
        if (overdueBooks.length === 0) {
            document.getElementById('overdue-books-content').innerHTML = `
                <div class="alert alert-success">
                    <i class="fas fa-check-circle me-2"></i>No overdue books! Great job!
                </div>
            `;
            return;
        }
        
        // Simplified content generation
        let tableRows = '';
        const today = new Date();
        
        for (let i = 0; i < overdueBooks.length; i++) {
            const book = overdueBooks[i];
            const dueDate = new Date(book.dueDate);
            const daysOverdue = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));
            const lateFee = daysOverdue * 0.50;
            
            tableRows += `
                <tr>
                    <td>${book.title}</td>
                    <td>${book.author}</td>
                    <td>${dueDate.toLocaleDateString()}</td>
                    <td><span class="badge bg-danger">${daysOverdue} days</span></td>
                    <td>$${lateFee.toFixed(2)}</td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="grabABook.sendOverdueNotice(${book.id}, '${book.type || 'regular'}')">
                            <i class="fas fa-envelope me-1"></i>Send Notice
                        </button>
                    </td>
                </tr>
            `;
        }
        
        document.getElementById('overdue-books-content').innerHTML = `
            <div class="alert alert-warning mb-3">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        <strong>${overdueBooks.length} overdue book(s) found.</strong>
                    </div>
                    <button class="btn btn-sm btn-primary" onclick="grabABook.sendAllOverdueNotices()">
                        <i class="fas fa-paper-plane me-1"></i>Send All Notices
                    </button>
                </div>
            </div>
            <div class="table-responsive">
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>Book Title</th>
                            <th>Author</th>
                            <th>Due Date</th>
                            <th>Days Overdue</th>
                            <th>Late Fee</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>${tableRows}</tbody>
                </table>
            </div>
        `;
    }

    loadDonations() {
        // Use cached donations or load from memory
        const donations = this.donations || [];
        
        if (donations.length === 0) {
            document.getElementById('donations-content').innerHTML = `
                <div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i>No donations yet. Encourage users to support the library!
                </div>
            `;
            return;
        }
        
        // Calculate donation statistics
        let totalMoneyDonations = 0;
        let totalMoneyAmount = 0;
        let totalBookDonations = 0;
        
        donations.forEach(donation => {
            if (donation.type === 'money') {
                totalMoneyDonations++;
                totalMoneyAmount += parseFloat(donation.amount || 0);
            } else if (donation.type === 'book') {
                totalBookDonations++;
            }
        });
        
        // Simplified content generation - show only 5 most recent
        let tableRows = '';
        const recentDonations = donations.slice(-5); // Show only 5 most recent for faster loading
        
        for (let i = recentDonations.length - 1; i >= 0; i--) {
            const donation = recentDonations[i];
            const date = new Date(donation.createdAt || Date.now()).toLocaleDateString();
            const amount = donation.type === 'money' ? `$${donation.amount}` : donation.bookTitle || 'Book';
            
            tableRows += `
                <tr>
                    <td>${date}</td>
                    <td>${donation.type}</td>
                    <td>${amount}</td>
                    <td>${donation.donorName || 'Anonymous'}</td>
                    <td><span class="badge bg-success">${donation.status || 'Completed'}</span></td>
                </tr>
            `;
        }
        
        document.getElementById('donations-content').innerHTML = `
            <div class="row mb-4">
                <div class="col-md-4">
                    <div class="card bg-success bg-gradient text-white">
                        <div class="card-body text-center">
                            <h3 class="mb-0">$${totalMoneyAmount.toFixed(2)}</h3>
                            <small>Total Money Donations</small>
                            <div class="mt-2">
                                <small>${totalMoneyDonations} donation(s)</small>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card bg-info bg-gradient text-white">
                        <div class="card-body text-center">
                            <h3 class="mb-0">${totalBookDonations}</h3>
                            <small>Total Book Donations</small>
                            <div class="mt-2">
                                <small>${totalBookDonations} book(s) donated</small>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card bg-primary bg-gradient text-white">
                        <div class="card-body text-center">
                            <h3 class="mb-0">${donations.length}</h3>
                            <small>Total Donations</small>
                            <div class="mt-2">
                                <small>All types combined</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <h5 class="mb-3">Recent Donations</h5>
            <div class="table-responsive">
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Type</th>
                            <th>Amount/Item</th>
                            <th>Donor</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>${tableRows}</tbody>
                </table>
            </div>
            <div class="mt-3">
                <small class="text-muted">
                    <i class="fas fa-info-circle me-1"></i>
                    Showing ${recentDonations.length} most recent donation(s) out of ${donations.length} total.
                </small>
            </div>
        `;
    }

    getOverdueBooks() {
        const today = new Date();
        return [...this.books, ...this.apBooks].filter(book => {
            if (!book.dueDate || book.available) return false;
            const dueDate = new Date(book.dueDate);
            return today > dueDate;
        });
    }

    loadLibraryInventory() {
        // Combine all books and add copy tracking
        const allBooks = [...this.books, ...this.apBooks];
        const inventoryData = this.processInventoryData(allBooks);
        
        // Display inventory first
        this.displayInventory(inventoryData);
        
        // Set up event listeners for filters and search after a short delay
        setTimeout(() => {
            this.setupInventoryFilters();
        }, 100);
    }

    processInventoryData(allBooks) {
        // Group books by title and author to track copies
        const bookGroups = {};
        
        allBooks.forEach(book => {
            const key = `${book.title}|${book.author}`;
            if (!bookGroups[key]) {
                bookGroups[key] = {
                    title: book.title,
                    author: book.author,
                    category: book.category || book.subject,
                    type: book.type || 'regular',
                    totalCopies: 0,
                    availableCopies: 0,
                    checkedOutCopies: 0,
                    books: []
                };
            }
            
            bookGroups[key].totalCopies++;
            bookGroups[key].books.push(book);
            
            if (book.available) {
                bookGroups[key].availableCopies++;
            } else {
                bookGroups[key].checkedOutCopies++;
            }
        });
        
        return Object.values(bookGroups);
    }

    setupInventoryFilters() {
        console.log('Setting up inventory filters...');
        
        // Filter buttons
        const filterButtons = document.querySelectorAll('input[name="inventory-filter"]');
        console.log('Found filter buttons:', filterButtons.length);
        
        filterButtons.forEach(button => {
            button.addEventListener('change', (e) => {
                console.log('Filter changed to:', e.target.id);
                this.filterInventory();
            });
        });
        
        // Search input
        const searchInput = document.getElementById('inventory-search');
        if (searchInput) {
            console.log('Found search input');
            searchInput.addEventListener('input', (e) => {
                console.log('Search input changed:', e.target.value);
                this.filterInventory();
            });
        } else {
            console.log('Search input not found');
        }
    }

    filterInventory() {
        console.log('filterInventory called');
        const allBooks = [...this.books, ...this.apBooks];
        let filteredData = this.processInventoryData(allBooks);
        console.log('Initial data count:', filteredData.length);
        
        // Apply availability filter
        const selectedFilterElement = document.querySelector('input[name="inventory-filter"]:checked');
        if (selectedFilterElement) {
            const selectedFilter = selectedFilterElement.id;
            console.log('Selected filter:', selectedFilter);
            if (selectedFilter === 'available-books') {
                filteredData = filteredData.filter(book => book.availableCopies > 0);
                console.log('After available filter:', filteredData.length);
            } else if (selectedFilter === 'checked-out-books') {
                filteredData = filteredData.filter(book => book.checkedOutCopies > 0);
                console.log('After checked-out filter:', filteredData.length);
            }
        }
        
        // Apply search filter
        const searchInput = document.getElementById('inventory-search');
        if (searchInput) {
            const searchTerm = searchInput.value.toLowerCase();
            if (searchTerm) {
                console.log('Search term:', searchTerm);
                filteredData = filteredData.filter(book => 
                    book.title.toLowerCase().includes(searchTerm) || 
                    book.author.toLowerCase().includes(searchTerm)
                );
                console.log('After search filter:', filteredData.length);
            }
        }
        
        this.displayInventory(filteredData);
    }

    displayInventory(inventoryData) {
        if (inventoryData.length === 0) {
            document.getElementById('inventory-content').innerHTML = `
                <div class="alert alert-info text-center">
                    <i class="fas fa-info-circle me-2"></i>No books found matching your criteria.
                </div>
            `;
            return;
        }
        
        // Sort by title
        inventoryData.sort((a, b) => a.title.localeCompare(b.title));
        
        let tableRows = '';
        
        for (let i = 0; i < inventoryData.length; i++) {
            const book = inventoryData[i];
            const availabilityClass = book.availableCopies > 0 ? 'text-success' : 'text-warning';
            const availabilityText = book.availableCopies > 0 ? 
                `${book.availableCopies} available` : 'All checked out';
            
            tableRows += `
                <tr>
                    <td>
                        <strong>${book.title}</strong><br>
                        <small class="text-muted">by ${book.author}</small>
                    </td>
                    <td>
                        <span class="badge bg-info">${book.category}</span>
                        ${book.type ? `<br><span class="badge bg-secondary small">${book.type}</span>` : ''}
                    </td>
                    <td class="text-center">${book.totalCopies}</td>
                    <td class="text-center ${availabilityClass}">${book.availableCopies}</td>
                    <td class="text-center text-warning">${book.checkedOutCopies}</td>
                    <td class="text-center">
                        <div class="progress" style="height: 20px;">
                            <div class="progress-bar bg-success" role="progressbar" 
                                 style="width: ${(book.availableCopies / book.totalCopies) * 100}%">
                                ${book.availableCopies}
                            </div>
                            <div class="progress-bar bg-warning" role="progressbar" 
                                 style="width: ${(book.checkedOutCopies / book.totalCopies) * 100}%">
                                ${book.checkedOutCopies}
                            </div>
                        </div>
                    </td>
                </tr>
            `;
        }
        
        document.getElementById('inventory-content').innerHTML = `
            <div class="table-responsive">
                <table class="table table-striped table-hover">
                    <thead class="table-dark">
                        <tr>
                            <th>Book Details</th>
                            <th>Category/Type</th>
                            <th class="text-center">Total Copies</th>
                            <th class="text-center">Available</th>
                            <th class="text-center">Checked Out</th>
                            <th class="text-center">Availability</th>
                        </tr>
                    </thead>
                    <tbody>${tableRows}</tbody>
                </table>
            </div>
            <div class="mt-3">
                <small class="text-muted">
                    <i class="fas fa-info-circle me-1"></i>
                    Showing ${inventoryData.length} book(s). Green indicates available copies, yellow indicates checked out copies.
                </small>
            </div>
        `;
    }

    sendOverdueNotice(bookId, type = 'regular') {
        const book = type === 'ap' ? 
            this.apBooks.find(b => b.id === bookId) : 
            this.books.find(b => b.id === bookId);
        
        if (!book) {
            this.showNotification('error', 'Book not found.');
            return;
        }
        
        const dueDate = new Date(book.dueDate);
        const today = new Date();
        const daysOverdue = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));
        const lateFee = daysOverdue * 0.50;
        
        // Show modal to select notification method
        const modalHtml = `
            <div class="modal fade" id="noticeModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                <i class="fas fa-envelope me-2"></i>Send Overdue Notice
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <h6 class="mb-3">Book Details:</h6>
                            <p><strong>Title:</strong> ${book.title}</p>
                            <p><strong>Author:</strong> ${book.author}</p>
                            <p><strong>Due Date:</strong> ${dueDate.toLocaleDateString()}</p>
                            <p><strong>Days Overdue:</strong> <span class="badge bg-danger">${daysOverdue} days</span></p>
                            <p><strong>Late Fee:</strong> $${lateFee.toFixed(2)}</p>
                            
                            <hr>
                            
                            <h6 class="mb-3">Select Notification Method:</h6>
                            <div class="form-check mb-2">
                                <input class="form-check-input" type="radio" name="noticeMethod" id="emailNotice" value="email" checked>
                                <label class="form-check-label" for="emailNotice">
                                    <i class="fas fa-at me-1"></i>Send Email Notice
                                </label>
                            </div>
                            <div class="form-check mb-2">
                                <input class="form-check-input" type="radio" name="noticeMethod" id="mailNotice" value="mail">
                                <label class="form-check-label" for="mailNotice">
                                    <i class="fas fa-envelope me-1"></i>Send Physical Mail Notice
                                </label>
                            </div>
                            <div class="form-check mb-3">
                                <input class="form-check-input" type="radio" name="noticeMethod" id="bothNotice" value="both">
                                <label class="form-check-label" for="bothNotice">
                                    <i class="fas fa-share-nodes me-1"></i>Send Both Email and Mail
                                </label>
                            </div>
                            
                            <div class="alert alert-info">
                                <i class="fas fa-info-circle me-2"></i>
                                <small>The user will be notified about their overdue book and the late fee amount.</small>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" onclick="grabABook.confirmSendNotice(${bookId}, '${type}')">
                                <i class="fas fa-paper-plane me-1"></i>Send Notice
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Remove existing modal if present
        const existingModal = document.getElementById('noticeModal');
        if (existingModal) existingModal.remove();
        
        // Add modal to page
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('noticeModal'));
        modal.show();
    }

    confirmSendNotice(bookId, type = 'regular') {
        const book = type === 'ap' ? 
            this.apBooks.find(b => b.id === bookId) : 
            this.books.find(b => b.id === bookId);
        
        if (!book) return;
        
        const noticeMethod = document.querySelector('input[name="noticeMethod"]:checked').value;
        const dueDate = new Date(book.dueDate);
        const today = new Date();
        const daysOverdue = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));
        const lateFee = daysOverdue * 0.50;
        
        // In a real application, this would send to an API endpoint
        // For demo purposes, we'll simulate the notification
        let methodText = '';
        if (noticeMethod === 'email') {
            methodText = 'email';
        } else if (noticeMethod === 'mail') {
            methodText = 'physical mail';
        } else {
            methodText = 'email and physical mail';
        }
        
        console.log('Sending overdue notice:', {
            book: book.title,
            method: noticeMethod,
            daysOverdue: daysOverdue,
            lateFee: lateFee,
            userEmail: this.currentUser?.email || 'demo@example.com',
            message: `Dear User,\n\nThis is a reminder that "${book.title}" by ${book.author} was due on ${dueDate.toLocaleDateString()}.\n\nIt is now ${daysOverdue} day(s) overdue.\nLate Fee: $${lateFee.toFixed(2)}\n\nPlease return the book as soon as possible to avoid additional fees.\n\nThank you,\nGrab-a-Book Team`
        });
        
        this.showNotification('success', `Overdue notice for "${book.title}" sent via ${methodText}!`);
        
        // Close modal
        bootstrap.Modal.getInstance(document.getElementById('noticeModal')).hide();
    }

    sendAllOverdueNotices() {
        const overdueBooks = this.getOverdueBooks();
        
        if (overdueBooks.length === 0) {
            this.showNotification('info', 'No overdue books to notify about.');
            return;
        }
        
        // Show confirmation modal
        const modalHtml = `
            <div class="modal fade" id="bulkNoticeModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header bg-warning">
                            <h5 class="modal-title">
                                <i class="fas fa-paper-plane me-2"></i>Send All Overdue Notices
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <p><strong>You are about to send overdue notices for ${overdueBooks.length} book(s).</strong></p>
                            
                            <h6 class="mb-3">Select Notification Method:</h6>
                            <div class="form-check mb-2">
                                <input class="form-check-input" type="radio" name="bulkNoticeMethod" id="bulkEmailNotice" value="email" checked>
                                <label class="form-check-label" for="bulkEmailNotice">
                                    <i class="fas fa-at me-1"></i>Send Email Notices
                                </label>
                            </div>
                            <div class="form-check mb-2">
                                <input class="form-check-input" type="radio" name="bulkNoticeMethod" id="bulkMailNotice" value="mail">
                                <label class="form-check-label" for="bulkMailNotice">
                                    <i class="fas fa-envelope me-1"></i>Send Physical Mail Notices
                                </label>
                            </div>
                            <div class="form-check mb-3">
                                <input class="form-check-input" type="radio" name="bulkNoticeMethod" id="bulkBothNotice" value="both">
                                <label class="form-check-label" for="bulkBothNotice">
                                    <i class="fas fa-share-nodes me-1"></i>Send Both Email and Mail
                                </label>
                            </div>
                            
                            <div class="alert alert-warning">
                                <i class="fas fa-exclamation-triangle me-2"></i>
                                <small>All users with overdue books will receive a notification.</small>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" onclick="grabABook.confirmSendAllNotices()">
                                <i class="fas fa-paper-plane me-1"></i>Send All Notices
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Remove existing modal if present
        const existingModal = document.getElementById('bulkNoticeModal');
        if (existingModal) existingModal.remove();
        
        // Add modal to page
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('bulkNoticeModal'));
        modal.show();
    }

    confirmSendAllNotices() {
        const overdueBooks = this.getOverdueBooks();
        const noticeMethod = document.querySelector('input[name="bulkNoticeMethod"]:checked').value;
        
        let methodText = '';
        if (noticeMethod === 'email') {
            methodText = 'email';
        } else if (noticeMethod === 'mail') {
            methodText = 'physical mail';
        } else {
            methodText = 'email and physical mail';
        }
        
        // In a real application, this would send to an API endpoint
        // For demo purposes, we'll log the notifications
        overdueBooks.forEach(book => {
            const dueDate = new Date(book.dueDate);
            const today = new Date();
            const daysOverdue = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));
            const lateFee = daysOverdue * 0.50;
            
            console.log('Sending bulk overdue notice:', {
                book: book.title,
                method: noticeMethod,
                daysOverdue: daysOverdue,
                lateFee: lateFee
            });
        });
        
        this.showNotification('success', `Sent ${overdueBooks.length} overdue notice(s) via ${methodText}!`);
        
        // Close modal
        bootstrap.Modal.getInstance(document.getElementById('bulkNoticeModal')).hide();
    }

    async downloadDatabaseExport() {
        try {
            this.showNotification('info', 'Preparing database export... This may take a moment.');
            
            // Call the API endpoint
            const response = await fetch(`${this.apiBaseUrl}/admin/export`);
            
            if (!response.ok) {
                throw new Error('Failed to export database');
            }
            
            // Get the blob from the response
            const blob = await response.blob();
            
            // Create a download link
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `GrabABook_Database_Export_${new Date().toISOString().slice(0,10)}.docx`;
            document.body.appendChild(a);
            a.click();
            
            // Clean up
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            this.showNotification('success', 'Database exported successfully! Check your downloads folder.');
        } catch (error) {
            console.error('Error exporting database:', error);
            this.showNotification('error', 'Failed to export database. Please try again.');
        }
    }
}

// Initialize the application
const grabABook = new GrabABook();

// Global functions for onclick handlers
function showHome() { grabABook.showHome(); }
function showBrowse() { grabABook.showBrowse(); }
function showMyBooks() { grabABook.showMyBooks(); }
function showAPClasses() { grabABook.showAPClasses(); }
function showMagazine() { grabABook.showMagazine(); }
function showDonate() { grabABook.showDonate(); }
function showLogin() { grabABook.showLogin(); }
function showRegister() { grabABook.showRegister(); }
function searchBooks() { grabABook.searchBooks(); }
function filterByCategory(category) { grabABook.filterByCategory(category); }
function filterAPBySubject(subject) { grabABook.filterAPBySubject(subject); }
