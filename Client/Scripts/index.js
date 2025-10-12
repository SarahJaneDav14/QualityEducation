// Grab-a-Book - Free Library Application
class GrabABook {
    constructor() {
        this.currentUser = null;
        this.books = this.generateSampleBooks();
        this.apBooks = this.generateAPBooks();
        this.checkedOutBooks = [];
        this.currentPage = 'home';
        this.lateFees = 0;
        this.init();
    }

    init() {
        this.loadFeaturedBooks();
        this.setupEventListeners();
        this.checkUserSession();
    }

    // Sample book data - in real app this would come from API
    generateSampleBooks() {
        return [
            {
                id: 1,
                title: "To Kill a Mockingbird",
                author: "Harper Lee",
                category: "fiction",
                description: "A gripping tale of racial injustice and childhood innocence in the American South.",
                cover: "https://via.placeholder.com/200x300/4A90E2/FFFFFF?text=To+Kill+a+Mockingbird",
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
                cover: "https://via.placeholder.com/200x300/27AE60/FFFFFF?text=Math+Basics",
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
                cover: "https://via.placeholder.com/200x300/F39C12/FFFFFF?text=Little+Prince",
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
                cover: "https://via.placeholder.com/200x300/9B59B6/FFFFFF?text=Sapiens",
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
                cover: "https://via.placeholder.com/200x300/E74C3C/FFFFFF?text=Great+Gatsby",
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
                cover: "https://via.placeholder.com/200x300/3498DB/FFFFFF?text=Science+Simple",
                available: true,
                formats: ["digital"],
                dueDate: null,
                popularity: 75
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
                cover: "https://via.placeholder.com/200x300/8E44AD/FFFFFF?text=AP+Calculus",
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
                cover: "https://via.placeholder.com/200x300/27AE60/FFFFFF?text=AP+Biology",
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
                cover: "https://via.placeholder.com/200x300/E74C3C/FFFFFF?text=AP+English",
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
                cover: "https://via.placeholder.com/200x300/F39C12/FFFFFF?text=AP+History",
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
                cover: "https://via.placeholder.com/200x300/3498DB/FFFFFF?text=AP+Chemistry",
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
                cover: "https://via.placeholder.com/200x300/16A085/FFFFFF?text=AP+Spanish",
                available: true,
                formats: ["digital", "physical"],
                dueDate: null,
                popularity: 82
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

        // Book donation form
        document.getElementById('book-donation-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitBookDonation();
        });

        // Magazine subscription form
        document.getElementById('magazine-subscription-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitMagazineSubscription();
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
        const userBooks = this.books.filter(book => !book.available);
        
        if (userBooks.length === 0) {
            myBooksContainer.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-info text-center">
                        <i class="fas fa-book-open fa-3x mb-3"></i>
                        <h4>No books checked out</h4>
                        <p>Start exploring our collection to find your next great read!</p>
                        <button class="btn btn-primary" onclick="showBrowse()">Browse Books</button>
                    </div>
                </div>
            `;
        } else {
            myBooksContainer.innerHTML = userBooks.map(book => 
                this.createBookCard(book, 'my-books')
            ).join('');
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

        const deliveryMethod = document.querySelector('input[name="deliveryMethod"]:checked').value;
        const checkoutPeriod = document.querySelector('select').value;
        
        // Calculate due date
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + parseInt(checkoutPeriod));
        
        // Update book status
        book.available = false;
        book.dueDate = dueDate.toISOString().split('T')[0];
        
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

    returnBook(bookId) {
        const book = this.books.find(b => b.id === bookId) || this.apBooks.find(b => b.id === bookId);
        if (!book) return;

        if (confirm(`Return "${book.title}"?`)) {
            // Check if book is overdue and remove late fees
            if (book.dueDate && new Date(book.dueDate) < new Date()) {
                const daysOverdue = Math.ceil((new Date() - new Date(book.dueDate)) / (1000 * 60 * 60 * 24));
                const lateFee = daysOverdue * 0.50; // $0.50 per day
                this.lateFees = Math.max(0, this.lateFees - lateFee);
                this.showNotification('success', `"${book.title}" returned! Late fee of $${lateFee.toFixed(2)} has been removed from your account.`);
            } else {
                this.showNotification('success', `"${book.title}" has been returned successfully!`);
            }
            
            book.available = true;
            book.dueDate = null;
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
        document.getElementById('late-fee-amount').textContent = `$${totalLateFees.toFixed(2)}`;
        
        // Update color based on amount
        const lateFeeElement = document.getElementById('late-fee-amount');
        if (totalLateFees > 0) {
            lateFeeElement.className = 'text-danger';
        } else {
            lateFeeElement.className = 'text-success';
        }
    }

    // Donation functions
    donateAmount(amount) {
        if (confirm(`Donate $${amount} to Grab-a-Book?`)) {
            this.showNotification('success', `Thank you for your $${amount} donation to Grab-a-Book! Your contribution helps us provide free books to students in need.`);
        }
    }

    donateCustomAmount() {
        const amount = parseFloat(document.getElementById('custom-donation').value);
        if (amount && amount > 0) {
            if (confirm(`Donate $${amount} to Grab-a-Book?`)) {
                this.showNotification('success', `Thank you for your $${amount} donation to Grab-a-Book! Your contribution helps us provide free books to students in need.`);
                document.getElementById('custom-donation').value = '';
            }
        } else {
            this.showNotification('error', 'Please enter a valid donation amount.');
        }
    }

    submitBookDonation() {
        const form = document.getElementById('book-donation-form');
        const formData = new FormData(form);
        
        // Simulate form submission
        this.showNotification('success', 'Thank you for your book donation! We will contact you within 2-3 business days to arrange pickup or drop-off.');
        form.reset();
    }

    // Magazine subscription functions
    submitMagazineSubscription() {
        const form = document.getElementById('magazine-subscription-form');
        const formData = new FormData(form);
        const subscriptionType = form.querySelector('select').value;
        
        // Simulate form submission
        const subscriptionTypes = {
            'monthly': 'Monthly ($2/month)',
            'quarterly': 'Quarterly ($5/3 months)',
            'yearly': 'Yearly ($15/year)'
        };
        
        this.showNotification('success', `Thank you for subscribing to Grab-a-Book Magazine! You've selected ${subscriptionTypes[subscriptionType]}. Your first magazine will arrive within 7-10 business days.`);
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
        // For demo, we'll simulate a logged-in user
        this.currentUser = { id: 1, name: 'Demo User' };
        this.updateUserInterface();
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
function donateAmount(amount) { grabABook.donateAmount(amount); }
function donateCustomAmount() { grabABook.donateCustomAmount(); }
