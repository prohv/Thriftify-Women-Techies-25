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
        alert(error.message);
    }
}

// Logout Function
async function logOutUser() {
    await signOut(auth);
    alert("Logged Out Successfully!");
}

// Fetch Items from Firestore
async function loadItems() {
    const itemList = document.querySelector(".item-list");
    itemList.innerHTML = "";
    console.log("Fetching items..."); // Debugging

    try {
        const querySnapshot = await getDocs(collection(db, "items"));
        querySnapshot.forEach((doc) => {
            const item = doc.data();
            console.log("Fetched item:", item); // Debugging

            itemList.innerHTML += `
                <div class="item">
                    <img src="${item.Image || 'https://placehold.co/200x200?text=No+Image'}" alt="${item.Name}">
                    <h3>${item.Name}</h3>
                    <p>Tag: ${item.Tag}</p>
                    <p class="price">₹${item.Price}</p>
                </div>
            `;
        });
    } catch (error) {
        console.error("Error fetching items:", error);
    }
}

// Expose functions globally
window.signUpUser = signUpUser;
window.signInUser = signInUser;
window.logOutUser = logOutUser;
window.loadItems = loadItems;

// Load items on page load
window.onload = loadItems;
