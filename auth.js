// Registration function
function register() {
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!name || !email || !password) {
        showError("All fields are required!");
        return;
    }

    if (!validateEmail(email)) {
        showError("Invalid email format!");
        return;
    }

    if (password.length < 6) {
        showError("Password must be at least 6 characters!");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.some(u => u.email === email)) {
        showError("Email already registered!");
        return;
    }

    users.push({ name, email, password, isAdmin: false });
    localStorage.setItem("users", JSON.stringify(users));
    showSuccess("Account created! Redirecting to login...");

    setTimeout(() => {
        window.location.href = "login.html";
    }, 1500);
}

// Login function
function login() {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
        showError("Email and password are required!");
        return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // store full user object for auth checks
        localStorage.setItem("loggedUser", JSON.stringify(user));
        showSuccess("Login successful! Redirecting...");

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1500);
    } else {
        showError("Invalid email or password!");
        emailInput.value = "";
        passwordInput.value = "";
    }
}

// Ensure default admin exists
(function ensureDefaultAdmin(){
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const adminEmail = 'admin123@gmail.com';
    if (!users.some(u => u.email === adminEmail)) {
        users.push({ name: 'Admin', email: adminEmail, password: 'admin123', isAdmin: true });
        localStorage.setItem('users', JSON.stringify(users));
    }
})();

// Simple email validation
function validateEmail(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
}

// Show error notification
function showError(message) {
    const notif = document.getElementById("notification");
    notif.innerText = message;
    notif.className = "notification error";
    notif.style.display = "block";

    setTimeout(() => {
        notif.style.display = "none";
    }, 3000);
}

// Show success notification
function showSuccess(message) {
    const notif = document.getElementById("notification");
    notif.innerText = message;
    notif.className = "notification success";
    notif.style.display = "block";
}
