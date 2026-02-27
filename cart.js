let cart = [];
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartBox = document.getElementById("cartBox");
const totalElement = document.getElementById("total");

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    updateCartUI();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Add a book to cart
// Add a book to cart by book id (reads book info from books.js)
function addToCartById(id) {
    const books = window.booksAPI.getBooks() || [];
    const book = books.find(b => b.id === id);
    if (!book) { showNotification('Book not found'); return; }
    if (book.stock <= 0) { showNotification('Out of stock'); return; }

    const existing = cart.find(item => item.id === id);
    if (existing) {
        if (existing.qty + 1 > book.stock) { showNotification('Not enough stock'); return; }
        existing.qty++;
    } else {
        cart.push({ id: id, n: book.title, p: book.price, qty: 1 });
    }

    saveCart();
    updateCartUI();
    showNotification(`${book.title} added to cart!`);
}

// backward-compatible wrapper (keeps old signature)
function addToCart(name, price) {
    // try to find book by title
    const books = window.booksAPI.getBooks() || [];
    const book = books.find(b => b.title === name);
    if (book) return addToCartById(book.id);
    // fallback: add a temporary cart item
    const existing = cart.find(item => item.n === name);
    if (existing) existing.qty++; else cart.push({ id: null, n: name, p: price, qty: 1 });
    saveCart(); updateCartUI(); showNotification(`${name} added to cart!`);
}

// Remove book from cart
function removeFromCart(index) {
    const itemName = cart[index].n;
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
    showNotification(`${itemName} removed from cart!`);
}

// Clear entire cart
function clearCart() {
    if (confirm("Clear all items from cart?")) {
        cart = [];
        saveCart();
        updateCartUI();
        showNotification("Cart cleared!");
    }
}

// Checkout action
function checkout() {
    if (cart.length === 0) {
        alert("Cart is empty!");
        return;
    }

    let total = cart.reduce((sum, item) => sum + item.p * item.qty, 0);

    if (confirm(`Proceed to checkout? Total: $${total.toFixed(2)}`)) {
        // decrement stock for each book in cart
        const books = window.booksAPI.getBooks() || [];
        cart.forEach(ci => {
            if (!ci.id) return;
            const b = books.find(x => x.id === ci.id);
            if (b) b.stock = Math.max(0, b.stock - ci.qty);
        });
        window.booksAPI.saveBooks(books);

        cart = [];
        saveCart();
        updateCartUI();
        closeCart();
        showNotification("Order placed successfully!");
        // re-render books on page (if present)
        if (window.renderBooks) window.renderBooks();
    }
}

// Update cart display
function updateCartUI() {
    cartCount.innerText = cart.reduce((sum, item) => sum + item.qty, 0);
    let total = 0;
    cartItems.innerHTML = "";

    if (cart.length === 0) {
        document.getElementById("cartContent").style.display = "none";
        document.getElementById("emptyCart").style.display = "block";
    } else {
        document.getElementById("cartContent").style.display = "block";
        document.getElementById("emptyCart").style.display = "none";

        cart.forEach((item, index) => {
            const li = document.createElement("li");
            const subtotal = item.p * item.qty;
            total += subtotal;

            li.innerHTML = `
                <div class="cart-item">
                    <span>${item.n} x${item.qty}</span>
                    <span>$${subtotal.toFixed(2)}</span>
                    <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
                </div>
            `;

            cartItems.appendChild(li);
        });
    }

    totalElement.innerText = total.toFixed(2);
}

// Open/Close cart modal
function openCart() { cartBox.style.display = "block"; updateCartUI(); }
function closeCart() { cartBox.style.display = "none"; }

// Notification message
function showNotification(message) {
    const notif = document.getElementById("notification");
    notif.innerText = message;
    notif.style.display = "block";

    setTimeout(() => {
        notif.style.display = "none";
    }, 2000);
}

// Load cart when page loads
window.addEventListener("DOMContentLoaded", loadCart);
