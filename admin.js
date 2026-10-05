import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import { db, auth } from "./firebase.js";

console.log("ADMIN JS WORKING");


const addGameBtn = document.getElementById("addGameBtn");
const gameForm = document.getElementById("gameForm");
const gameFormTitle = document.getElementById("gameFormTitle");
const gameNameInput = document.getElementById("gameName");
const gameImageInput = document.getElementById("gameImage");
const saveGameBtn = document.getElementById("saveGameBtn");
const cancelGameBtn = document.getElementById("cancelGameBtn");
const gamesList = document.getElementById("gamesList");

let games = [];
let editingId = null;

// ==============================
// LOAD GAMES FROM FIREBASE
// ==============================

async function loadGames() {

    gamesList.innerHTML = `
        <div class="empty-state">
            <p>LOADING...</p>
        </div>
    `;

    try {

        const snapshot = await getDocs(
            collection(db, "games")
        );

        games = [];

        snapshot.forEach((item) => {

            games.push({
                id: item.id,
                ...item.data()
            });

        });

        renderGames();

    } catch (error) {

        console.error(error);

        gamesList.innerHTML = `
            <div class="empty-state">
                <p>ERROR LOADING GAMES</p>
            </div>
        `;

        alert("Firebase error. Check the browser console.");

    }
}


// ==============================
// SAVE GAME
// ==============================

saveGameBtn.addEventListener("click", async () => {

    const name = gameNameInput.value.trim();
    const file = gameImageInput.files[0];

    if (!name) {
        alert("Enter game name.");
        return;
    }


    saveGameBtn.disabled = true;
    saveGameBtn.textContent = "SAVING...";


    try {

        // EDIT WITHOUT NEW IMAGE

        if (editingId && !file) {

            const gameRef = doc(
                db,
                "games",
                editingId
            );

            await updateDoc(gameRef, {
                name: name
            });

        }


        // EDIT WITH NEW IMAGE

        else if (editingId && file) {

            const image = await fileToDataURL(file);

            const gameRef = doc(
                db,
                "games",
                editingId
            );

            await updateDoc(gameRef, {
                name: name,
                image: image
            });

        }


        // ADD NEW GAME

        else {

            if (!file) {
                alert("Select a game image.");
                saveGameBtn.disabled = false;
                saveGameBtn.textContent = "SAVE GAME";
                return;
            }

            const image = await fileToDataURL(file);

            await addDoc(
                collection(db, "games"),
                {
                    name: name,
                    image: image,
                    createdAt: Date.now()
                }
            );

        }


        await loadGames();

        gameForm.classList.add("hidden");
        clearForm();

    } catch (error) {

        console.error(error);

        alert(
            "Could not save game.\n\n" +
            error.message
        );

    }


    saveGameBtn.disabled = false;
    saveGameBtn.textContent = "SAVE GAME";

});


// ==============================
// ADD GAME BUTTON
// ==============================

addGameBtn.addEventListener("click", () => {

    editingId = null;

    clearForm();

    gameFormTitle.textContent = "ADD GAME";

    saveGameBtn.textContent = "SAVE GAME";

    gameForm.classList.remove("hidden");

});


// ==============================
// CANCEL
// ==============================

cancelGameBtn.addEventListener("click", () => {

    gameForm.classList.add("hidden");

    clearForm();

});


// ==============================
// RENDER GAMES
// ==============================

function renderGames() {

    gamesList.innerHTML = "";


    if (games.length === 0) {

        gamesList.innerHTML = `
            <div class="empty-state">
                <p>NO GAMES YET</p>
            </div>
        `;

        return;
    }


    games.forEach((game) => {

        const card = document.createElement("div");

        card.className = "game-card";


        const imageHTML = game.image
            ? `
                <div class="game-image">
                    <img
                        src="${game.image}"
                        alt="${game.name}"
                    >
                </div>
            `
            : `
                <div class="game-image">
                    <div class="game-no-image">
                        NO IMAGE
                    </div>
                </div>
            `;


        card.innerHTML = `

            ${imageHTML}

            <div class="game-info">

                <h3>${game.name}</h3>

                <div class="game-actions">

                    <button
                        data-edit="${game.id}"
                    >
                        EDIT
                    </button>

                    <button
                        data-delete="${game.id}"
                    >
                        DELETE
                    </button>

                </div>

            </div>
        `;


        card
            .querySelector("[data-edit]")
            .addEventListener("click", (event) => {

                event.stopPropagation();

                editGame(game.id);

            });


        card
            .querySelector("[data-delete]")
            .addEventListener("click", (event) => {

                event.stopPropagation();

                deleteGame(game.id);

            });


        card.addEventListener("click", () => {

            openGame(game.id);

        });


        gamesList.appendChild(card);

    });

}


// ==============================
// OPEN GAME
// ==============================

function openGame(id) {

    const game = games.find(
        item => item.id === id
    );

    if (!game) return;


    window.location.href =
        `admin-game.html?id=${game.id}&name=${encodeURIComponent(game.name)}`;

}


// ==============================
// EDIT GAME
// ==============================

function editGame(id) {

    const game = games.find(
        item => item.id === id
    );

    if (!game) return;


    editingId = id;

    gameNameInput.value = game.name;

    gameImageInput.value = "";

    gameFormTitle.textContent = "EDIT GAME";

    saveGameBtn.textContent = "SAVE CHANGES";

    gameForm.classList.remove("hidden");


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ==============================
// DELETE GAME
// ==============================

async function deleteGame(id) {

    const game = games.find(
        item => item.id === id
    );

    if (!game) return;


    if (!confirm(`Delete "${game.name}"?`)) {
        return;
    }


    try {

        await deleteDoc(
            doc(db, "games", id)
        );

        await loadGames();

    } catch (error) {

        console.error(error);

        alert(
            "Could not delete game.\n\n" +
            error.message
        );

    }

}


// ==============================
// FILE → DATA URL
// ==============================

function fileToDataURL(file) {

    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.onload = () => {
            resolve(reader.result);
        };

        reader.onerror = reject;

        reader.readAsDataURL(file);

    });

}


// ==============================
// CLEAR FORM
// ==============================

function clearForm() {

    gameNameInput.value = "";

    gameImageInput.value = "";

    editingId = null;

}


// ==============================
// START
// ==============================
// ==============================
// LOAD ORDERS FROM FIREBASE
// ==============================

async function renderOrders() {

    ordersList.innerHTML = `
        <div class="empty-state">
            <p>LOADING...</p>
        </div>
    `;

    try {

        const snapshot = await getDocs(
            collection(db, "orders")
        );

        ordersList.innerHTML = "";

        if (snapshot.empty) {

            ordersList.innerHTML = `
                <div class="empty-state">
                    <p>NO ORDERS YET</p>
                </div>
            `;

            return;
        }

        snapshot.forEach((item) => {

            const order = {
                id: item.id,
                ...item.data()
            };

            const card = document.createElement("div");

            card.className = "order-card";

            card.innerHTML = `
                <div class="order-info">

                    <h3>${order.productName || "PRODUCT"}</h3>

                    <p>
                        <strong>NAME:</strong>
                        ${order.name || "-"}
                    </p>

                    <p>
                        <strong>PHONE:</strong>
                        ${order.phone || "-"}
                    </p>

                    <p>
                        <strong>SIZE:</strong>
                        ${order.size || "-"}
                    </p>

                    <p>
                        <strong>WILAYA:</strong>
                        ${order.wilaya || "-"}
                    </p>

                    <p>
                        <strong>COMMUNE:</strong>
                        ${order.commune || "-"}
                    </p>

                    <p>
                        <strong>DELIVERY:</strong>
                        ${order.deliveryType || "-"}
                    </p>

                    <p>
                        <strong>TOTAL:</strong>
                        ${order.total || 0} DA
                    </p>

                    <p>
                        <strong>DATE:</strong>
                        ${order.date || "-"}
                    </p>

                </div>

                <button data-delete-order="${order.id}">
                    DELETE
                </button>
            `;

            card
                .querySelector("[data-delete-order]")
                .addEventListener("click", async () => {

                    if (!confirm("Delete this order?")) {
                        return;
                    }

                    try {

                        await deleteDoc(
                            doc(db, "orders", order.id)
                        );

                        await renderOrders();

                    } catch (error) {

                        console.error(error);

                        alert(
                            "Could not delete order.\n\n" +
                            error.message
                        );

                    }

                });

            ordersList.appendChild(card);

        });

    } catch (error) {

        console.error(error);

        ordersList.innerHTML = `
            <div class="empty-state">
                <p>ERROR LOADING ORDERS</p>
            </div>
        `;

    }
}
loadGames();
renderOrders();
ordersList = document.getElementById("ordersList");
