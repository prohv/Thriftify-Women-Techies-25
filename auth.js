// Firebase Config (Move this to an environment variable for security)
const firebaseConfig = {
    apiKey: "AIzaSyABy3Pe6oQHI0SFLgwqoyoVeCbH0u_vIyo", // Store securely
    authDomain: "thriftify-2c973.firebaseapp.com",
    projectId: "thriftify-2c973",
    storageBucket: "thriftify-2c973.appspot.com",
    messagingSenderId: "105212347644",
    appId: "1:105212347644:web:14b66bfc80a9e8875b4379",
    measurementId: "G-CT0E1MM2LC"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Ensure authentication persistence
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

// Signup Function
async function signUpUser() {
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value.trim();

    if (!email || !password) {
        alert("Email and password are required.");
        return;
    }

    try {
        // Check if email is already in use
        const methods = await auth.fetchSignInMethodsForEmail(email);
        if (methods.length > 0) {
            alert("This email is already registered. Please log in.");
            return;
        }

        // Create the user
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Store user data in Firestore
        await db.collection("users").doc(user.uid).set({
            email: user.email,
            uid: user.uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        alert("Sign Up Successful!");
        loadItems();
    } catch (error) {
        alert("Error: " + error.message);
    }
}

// Sign-in Function
async function signInUser() {
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();

    if (!email || !password) {
        alert("Email and password are required.");
        return;
    }

    try {
        await auth.signInWithEmailAndPassword(email, password);
        alert("Login Successful!");
        loadItems();
    } catch (error) {
        alert("Error: " + error.message);
    }
}

// Logout Function
async function logOutUser() {
    try {
        await auth.signOut();
        alert("Logged Out Successfully!");
        loadItems();
    } catch (error) {
        alert("Error: " + error.message);
    }
}

// Fetch Items from Firestore (Optimized)
async function loadItems() {
    const itemList = document.querySelector(".item-list");
    itemList.innerHTML = "<p class='text-gray-500 text-center'>Loading items...</p>";

    try {
        const querySnapshot = await db.collection("items").orderBy("createdAt", "desc").limit(20).get();
        itemsData = [];

        itemList.innerHTML = "";
        if (querySnapshot.empty) {
            itemList.innerHTML = "<p class='text-gray-500 text-center'>No items found.</p>";
            return;
        }

        querySnapshot.forEach((doc) => {
            const item = doc.data();
            itemsData.push(item);
        });

        displayItems(itemsData);
    } catch (error) {
        console.error("Error fetching items:", error);
        itemList.innerHTML = "<p class='text-red-500 text-center'>Error loading items. Please check your connection.</p>";
    }
}

// Display Items
function displayItems(items) {
    const itemList = document.querySelector(".item-list");
    itemList.innerHTML = "";

    if (items.length === 0) {
        itemList.innerHTML = "<p class='text-gray-500 text-center'>No items match your search.</p>";
        return;
    }

    items.forEach((item) => {
        const imageUrl = item.Image || 'https://placehold.co/200x200?text=No+Image';

        const itemElement = document.createElement('div');
        itemElement.className = 'item';
        itemElement.innerHTML = `
            <img src="${imageUrl}" alt="${item.Name}">
            <h3>${item.Name}</h3>
            <p>Tag: ${item.Tag}</p>
            <p class="price">₹${item.Price}</p>
        `;

        itemList.appendChild(itemElement);
    });
}

// Optimized Search Function (Firestore Query)
async function searchItems() {
    const searchInput = document.querySelector(".search-bar").value.toLowerCase();
    
    if (!searchInput) {
        loadItems();
        return;
    }

    try {
        const querySnapshot = await db.collection("items")
            .where("Name", ">=", searchInput)
            .where("Name", "<=", searchInput + '\uf8ff')
            .limit(10)
            .get();

        let filteredItems = [];
        querySnapshot.forEach((doc) => {
            filteredItems.push(doc.data());
        });

        displayItems(filteredItems);
    } catch (error) {
        console.error("Error searching items:", error);
    }
}

// Attach event listener to search bar
document.addEventListener("DOMContentLoaded", () => {
    const searchBar = document.querySelector(".search-bar");
    if (searchBar) {
        searchBar.addEventListener("input", searchItems);
    }
    loadItems();
});

// Expose functions globally
window.signUpUser = signUpUser;
window.signInUser = signInUser;
window.logOutUser = logOutUser;
window.loadItems = loadItems;
