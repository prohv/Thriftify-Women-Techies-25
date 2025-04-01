<script type="module">
        import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
        import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
        import { getFirestore, collection, addDoc, getDocs, query, orderBy, where } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

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

        async function loadItems(sortType = null, filters = {}, searchTerm = "") {
            const itemList = document.querySelector(".item-list");
            itemList.innerHTML = "";

            let itemsRef = collection(db, "items");
            let q;

            if (searchTerm) {
                q = query(itemsRef, where("name", ">=", searchTerm), where("name", "<=", searchTerm + "\uf8ff"));
            } else if (Object.keys(filters).length > 0) {
                let conditions = [];
                for (const key in filters) {
                    if (filters[key] !== 'all') {
                        conditions.push(where(key, "==", filters[key]));
                    }
                }
                q = query(itemsRef, ...conditions);
            } else {
                q = itemsRef;
            }


            if (sortType) {
                if (sortType === "price-asc") {
                    q = query(q, orderBy("price", "asc"));
                } else if (sortType === "price-desc") {
                    q = query(q, orderBy("price", "desc"));
                } else if (sortType === "time-latest") {
                    q = query(q, orderBy("timestamp", "desc"));
                }
            }


            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                const item = doc.data();
                itemList.innerHTML += `
                    <div class="item"
                        data-gender="${item.gender || 'all'}"
                        data-color="${item.color || 'all'}"
                        data-size="${item.size || 'all'}"
                        data-price="${item.price}"
                        data-time="${item.timestamp?.toDate() || new Date()}"
                        >
                        <img src="${item.image || 'https://placehold.co/200x200?text=No+Image'}" alt="${item.name}">
                        <h3>${item.name}</h3>
                        <p>${item.description}</p>
                        <p class="price">$${item.price}</p>
                    </div>
                `;
            });
        }

        window.signUpUser = signUpUser;
        window.signInUser = signInUser;
        window.logOutUser = logOutUser;
        window.loadItems = loadItems;
    </script>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const sortButton = document.querySelector('.sort-button');
            const sortOptions = document.querySelector('.sort-options');
            const filterButton = document.querySelector('.filter-button');
            const filterOptions = document.querySelector('.filter-options');
            const items = document.querySelectorAll('.item');
            const genderOptions = document.querySelector('.filter-options .gender-options');
            const sizeOptions = document.querySelector('.filter-options .size-options');
            const colorOptions = document.querySelector('.filter-options .color-options');
            const searchBar = document.querySelector('.search-bar');


            let activeFilters = {};

            sortButton.addEventListener('click', () => {
                sortOptions.classList.toggle('show');
            });

            filterButton.addEventListener('click', () => {
                filterOptions.classList.toggle('show');
            });

            filterOptions.addEventListener('click', (event) => {
                if (event.target.dataset.filter === 'gender') {
                    genderOptions.classList.toggle('show');
                }
                else if (event.target.dataset.filter === 'size') {
                    sizeOptions.classList.toggle('show');
                }
                else if (event.target.dataset.filter === 'color') {
                    colorOptions.classList.toggle('show');
                }
                else if (event.target.tagName === 'BUTTON' && event.target.parentElement === genderOptions) {
                    const filterType = 'gender';
                    const filterValue = event.target.dataset.value;
                     if (filterValue) {
                        activeFilters[filterType] = filterValue.toLowerCase();
                        loadItems(null, activeFilters);
                    }
                    filterOptions.classList.remove('show');
                    genderOptions.classList.remove('show');

                }
                else if (event.target.tagName === 'BUTTON' && event.target.parentElement === sizeOptions) {
                    const filterType = 'size';
                    const filterValue = event.target.dataset.value;
                     if (filterValue) {
                        activeFilters[filterType] = filterValue.toLowerCase();
                        loadItems(null, activeFilters);
                    }
                    filterOptions.classList.remove('show');
                    sizeOptions.classList.remove('show');

                }
                 else if (event.target.tagName === 'BUTTON' && event.target.parentElement === colorOptions) {
                    const filterType = 'color';
                    const filterValue = event.target.dataset.value;
                     if (filterValue) {
                        activeFilters[filterType] = filterValue.toLowerCase();
                        loadItems(null, activeFilters);
                    }
                    filterOptions.classList.remove('show');
                    colorOptions.classList.remove('show');

                }
                else if (event.target.tagName === 'BUTTON') {
                    const filterType = event.target.dataset.filter;
                    const filterValue = prompt(`Enter ${filterType} value (e.g., blue):`);

                    if (filterValue) {
                        activeFilters[filterType] = filterValue.toLowerCase();
                        loadItems(null, activeFilters); // Pass filters to loadItems
                    }
                    filterOptions.classList.remove('show');
                }
            });

            searchBar.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    const searchTerm = searchBar.value;
                    loadItems(null, {}, searchTerm);
                }
            });


            // Close dropdown when clicking outside
            document.addEventListener('click', (event) => {
                if (!sortOptions.contains(event.target) && !sortButton.contains(event.target) && !filterOptions.contains(event.target) && !filterButton.contains(event.target)) {
                    sortOptions.classList.remove('show');
                    filterOptions.classList.remove('show');
                    genderOptions.classList.remove('show');
                    sizeOptions.classList.remove('show');
                    colorOptions.classList.remove('show');
                }
            });
        });
    </script>
