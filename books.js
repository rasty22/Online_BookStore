// books.js - manages book data in localStorage
const BOOKS_KEY = 'books_store_v1';

const defaultBooks = [
    { id: 1, title: 'Atomic Habits', price: 10, desc: 'Build better habits', img: 'https://images-na.ssl-images-amazon.com/images/I/51-uspgqWIL._SX331_BO1,204,203,200_.jpg', stock: 10 },
    { id: 2, title: 'The Midnight Library', price: 14, desc: 'Life-changing fiction', img: 'https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1602190253i/52578297.jpg', stock: 8 },
    { id: 3, title: 'Sapiens', price: 18, desc: 'History of humankind', img: 'https://images-na.ssl-images-amazon.com/images/I/713jIoMO3UL.jpg', stock: 5 },
    { id: 4, title: 'Educated', price: 16, desc: 'Inspiring memoir', img: 'https://images-na.ssl-images-amazon.com/images/I/81WojUxbbFL.jpg', stock: 6 },
    { id: 5, title: 'Deep Work', price: 12, desc: 'Master concentration', img: 'https://i0.wp.com/amberrfield.com/wp-content/uploads/2024/01/DeepWork.png?w=516&ssl=1', stock: 7 },
    { id: 6, title: 'Thinking Fast', price: 15, desc: 'Psychology insights', img: 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', stock: 4 }
];

function getBooks() {
    const raw = localStorage.getItem(BOOKS_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
}

function saveBooks(list) {
    localStorage.setItem(BOOKS_KEY, JSON.stringify(list));
}

function initBooks() {
    if (!getBooks()) {
        saveBooks(defaultBooks);
    }
}

function addBook(book) {
    const books = getBooks() || [];
    const nextId = books.length ? Math.max(...books.map(b => b.id)) + 1 : 1;
    book.id = nextId;
    books.push(book);
    saveBooks(books);
}

function updateBook(updated) {
    const books = getBooks() || [];
    const idx = books.findIndex(b => b.id === updated.id);
    if (idx === -1) return false;
    books[idx] = updated;
    saveBooks(books);
    return true;
}

function removeBook(id) {
    let books = getBooks() || [];
    books = books.filter(b => b.id !== id);
    saveBooks(books);
}

// Expose for other scripts
window.booksAPI = { initBooks, getBooks, saveBooks, addBook, updateBook, removeBook };

// initialize on load
initBooks();
