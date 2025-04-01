import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// 🔥 Replace with your actual Firebase credentials
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Debugging: Check if Firebase is correctly initialized
console.log("Firebase Initialized:", app);
console.log("Auth Instance:", auth);

// Function to toggle between login and signup forms
function toggleForms(type = "login") {
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");

    if (!loginForm || !signupForm) {
        console.error("Login or Signup form not found!");
        return;
    }

    if (type === "signup") {
        loginForm.style.display = "none";
        signupForm.style.display = "block";
        console.log("Switched to Sign-up Form");
    } else {
        signupForm.style.display = "none";
        loginForm.style.display = "block";
        console.log("Switched to Login Form");
    }
}

// Run on page load
document.addEventListener("DOMContentLoaded", () => {
    // Read URL parameter
    const params = new URLSearchParams(window.location.search);
    const type = params.get("type") || "login";
    toggleForms(type);
});

// Handle sign-up
const signupForm = document.getElementById("signupForm");
signupForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
            alert("Sign-up successful! Redirecting...");
            window.location.href = "index.html";
        })
        .catch((error) => {
            alert("Error: " + error.message);
            console.error("Signup Error:", error);
        });
});

// Handle login
const loginForm = document.getElementById("loginForm");
loginForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            alert("Login successful! Redirecting...");
            window.location.href = "index.html";
        })
        .catch((error) => {
            alert("Error: " + error.message);
            console.error("Login Error:", error);
        });
});

// Handle switching between forms (without page reload)
document.getElementById("signup-link")?.addEventListener("click", (event) => {
    event.preventDefault();
    toggleForms("signup");
});

document.getElementById("login-link")?.addEventListener("click", (event) => {
    event.preventDefault();
    toggleForms("login");
});
