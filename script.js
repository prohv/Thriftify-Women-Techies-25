// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyABy3Pe6oQHI0SFLgwqoyoVeCbH0u_vIyo",
    authDomain: "thriftify-2c973.firebaseapp.com",
    projectId: "thriftify-2c973",
    storageBucket: "thriftify-2c973.appspot.com",
    messagingSenderId: "105212347644",
    appId: "1:105212347644:web:14b66bfc80a9e8875b4379",
    measurementId: "G-CT0E1MM2LC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Signup Function
async function signUpUser() {
    const email = prompt("Enter Email:");
    const password = prompt("Enter Password:");
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await addDoc(collection(db, "users"), { email });
        alert("Sign Up Successful!");
    } catch (error) {
        console.error("Signup Error:", error);
        alert(error.message);
    }
}

// Signin Function
async function signInUser() {
    const email = prompt("Enter Email:");
    const password = prompt("Enter Password:");
    try {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Login Successful!");
    } catch (error) {
        console.error("Signin Error:", error);
        alert(error.message);
    }
}

// Logout Function
async function logOutUser() {
    try {
        await signOut(auth);
        alert("Logged Out Successfully!");
    } catch (error) {
        console.error("Logout Error:", error);
        alert(error.message);
    }
}

// Fetch Items from Firestore with improved debugging
async function loadItems() {
    const itemList = document.querySelector(".item-list");
    
    if (!itemList) {
        console.error("Error: '.item-list' element not found.");
        return;
    }

    itemList.innerHTML = "";
    console.log("Fetching items from Firestore...");

    try {
        const querySnapshot = await getDocs(collection(db, "items"));

        if (querySnapshot.empty) {
            console.warn("No items found in Firestore collection.");
            itemList.innerHTML = "<p>No items available.</p>";
            return;
        }

        querySnapshot.forEach((doc) => {
            const item = doc.data();
            console.log("Fetched item:", item);

            itemList.innerHTML += `
                <div class="item">
                    <img src="${item.Image || 'https://placehold.co/200x200?text=No+Image'}" alt="${item.Name}">
                    <h3>${item.Name || 'Unnamed Item'}</h3>
                    <p>Tag: ${item.Tag || 'No Tag'}</p>
                    <p class="price">₹${item.Price || 'N/A'}</p>
                </div>
            `;
        });

        console.log("Items loaded successfully.");
    } catch (error) {
        console.error("Error fetching items from Firestore:", error);
        itemList.innerHTML = `<p>Error loading items. Please try again later.</p>`;
    }
}

// Ensure Firebase is initialized before loading items
document.addEventListener("DOMContentLoaded", () => {
    console.log("Document loaded. Initializing Firebase...");
    loadItems();
});

// Expose functions globally
window.signUpUser = signUpUser;
window.signInUser = signInUser;
window.logOutUser = logOutUser;
window.loadItems = loadItems;
