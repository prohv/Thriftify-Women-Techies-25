import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

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
const db = getFirestore(app);

let itemsData = []; // Store fetched items for filtering

// Redirect to Auth Page
function redirectToAuth(type) {
    window.location.href = `auth.html?type=${type}`;
}

// Fetch Items from Firestore
async function loadItems() {
    const itemList = document.querySelector(".item-list");
    itemList.innerHTML = "";

    try {
        const querySnapshot = await getDocs(collection(db, "items"));
        itemsData = [];
        querySnapshot.forEach((doc) => {
            const item = doc.data();
            itemsData.push(item);
        });
        displayItems(itemsData);
    } catch (error) {
        console.error("Error fetching items:", error);
    }
}

// Function to display items in the UI
function displayItems(items) {
    const itemList = document.querySelector(".item-list");
    itemList.innerHTML = "";

    items.forEach((item) => {
        itemList.innerHTML += `
            <div class="item">
                <img src="${item.Image || 'https://placehold.co/200x200?text=No+Image'}" alt="${item.Name}">
                <h3>${item.Name}</h3>
                <p>Tag: ${item.Tag}</p>
                <p class="price">₹${item.Price}</p>
            </div>
        `;
    });
}

// Search Function
function searchItems() {
    const searchInput = document.querySelector(".search-bar").value.toLowerCase();
    const filteredItems = itemsData.filter(item => 
        item.Name.toLowerCase().includes(searchInput) || 
        item.Tag.toLowerCase().includes(searchInput)
    );
    displayItems(filteredItems);
}

// Attach event listener to the search bar
document.addEventListener("DOMContentLoaded", () => {
    const searchBar = document.querySelector(".search-bar");
    if (searchBar) {
        searchBar.addEventListener("input", searchItems);
    }
    document.getElementById("signup-button")?.addEventListener("click", () => redirectToAuth("signup"));
    document.getElementById("login-button")?.addEventListener("click", () => redirectToAuth("login"));
});

// Expose functions globally
window.redirectToAuth = redirectToAuth;
window.loadItems = loadItems;

// Load items on page load
window.onload = loadItems;
