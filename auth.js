import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Function to toggle between login and signup forms
function toggleForms() {
    const params = new URLSearchParams(window.location.search);
    const type = params.get("type");
    if (type === "signup") {
        document.getElementById("login-form").style.display = "none";
        document.getElementById("signup-form").style.display = "block";
    } else {
        document.getElementById("signup-form").style.display = "none";
        document.getElementById("login-form").style.display = "block";
    }
}

toggleForms();

document.getElementById("signup-link").addEventListener("click", () => {
    window.location.href = "auth.html?type=signup";
});

document.getElementById("login-link").addEventListener("click", () => {
    window.location.href = "auth.html?type=login";
});

// Handle sign-up
const signupForm = document.getElementById("signupForm");
signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    
    createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
            alert("Sign-up successful! Redirecting...");
            window.location.href = "index.html";
        })
        .catch((error) => {
            alert(error.message);
        });
});

// Handle login
const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    
    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            alert("Login successful! Redirecting...");
            window.location.href = "index.html";
        })
        .catch((error) => {
            alert(error.message);
        });
});
