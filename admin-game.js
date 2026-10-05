import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

import { db } from "./firebase.js";


const params = new URLSearchParams(window.location.search);

const gameId = params.get("id");
const gameName = params.get("name");


const gameNameElement = document.getElementById("gameName");
const addTshirtBtn = document.getElementById("addTshirtBtn");

const tshirtForm = document.getElementById("tshirtForm");

const tshirtName = document.getElementById("tshirtName");
const tshirtPrice = document.getElementById("tshirtPrice");
const tshirtImage = document.getElementById("tshirtImage");
const tshirtStock = document.getElementById("tshirtStock");

const saveTshirtBtn = document.getElementById("saveTshirtBtn");
const cancelTshirtBtn = document.getElementById("cancelTshirtBtn");

const tshirtsList = document.getElementById("tshirtsList");


let tshirts = [];
let editingId = null;


gameNameElement.textContent = gameName || "GAME";


// ==============================
// LOAD T-SHIRTS
// ==============================

async function loadTshirts() {

    tshirtsList.innerHTML = `
        <div class="empty-state">
            <p>LOADING...</p>
        </div>
    `;

    try {

        const snapshot = await getDocs(
            collection(
                db,
                "games",
                gameId,
                "tshirts"
            )
        );

        tshirts = [];

        snapshot.forEach((item) => {

            tshirts.push({
                id: item.id,
                ...item.data()
            });

        });

        renderTshirts();

    } catch (error) {

        console.error(error);

        tshirtsList.innerHTML = `
            <div class="empty-state">
                <p>ERROR LOADING T-SHIRTS</p>
            </div>
        `;

        alert("Firebase error. Check the browser console.");

    }

}


// ==============================
// ADD / EDIT T-SHIRT
// ==============================

saveTshirtBtn.addEventListener("click", async () => {

    const name = tshirtName.value.trim();
    const price = tshirtPrice.value;
    const stock = tshirtStock.value;

    const sizes = [];

    document
        .querySelectorAll(".sizes input[type='checkbox']:checked")
        .forEach((checkbox) => {

            sizes.push(checkbox.value);

        });


    if (!name) {

        alert("Enter T-Shirt name.");

        return;

    }


    if (!price) {

        alert("Enter price.");

        return;

    }


    if (sizes.length === 0) {

        alert("Select at least one size.");

        return;

    }


    if (stock === "") {

        alert("Enter stock.");

        return;

    }


    const file = tshirtImage.files[0];


    saveTshirtBtn.disabled = true;
    saveTshirtBtn.textContent = "SAVING...";


    try {

        // ==========================
        // EDIT WITHOUT IMAGE
        // ==========================

        if (editingId && !file) {

            const tshirtRef = doc(
                db,
                "games",
                gameId,
                "tshirts",
                editingId
            );

            await updateDoc(tshirtRef, {

                name: name,
                price: Number(price),
                stock: Number(stock),
                sizes: sizes

            });

        }


        // ==========================
        // EDIT WITH IMAGE
        // ==========================

        else if (editingId && file) {

            const image = await fileToDataURL(file);

            const tshirtRef = doc(
                db,
                "games",
                gameId,
                "tshirts",
                editingId
            );

            await updateDoc(tshirtRef, {

                name: name,
                price: Number(price),
                stock: Number(stock),
                sizes: sizes,
                image: image

            });

        }


        // ==========================
        // ADD NEW T-SHIRT
        // ==========================

        else {

            if (!file) {

                alert("Select an image.");

                saveTshirtBtn.disabled = false;
                saveTshirtBtn.textContent = "SAVE T-SHIRT";

                return;

            }


            const image = await fileToDataURL(file);


            await addDoc(

                collection(
                    db,
                    "games",
                    gameId,
                    "tshirts"
                ),

                {

                    name: name,
                    price: Number(price),
                    stock: Number(stock),
                    sizes: sizes,
                    image: image,
                    createdAt: Date.now()

                }

            );

        }


        await loadTshirts();


        tshirtForm.classList.add("hidden");

        clearForm();


    } catch (error) {

        console.error(error);

        alert(
            "Could not save T-Shirt.\n\n" +
            error.message
        );

    }


    saveTshirtBtn.disabled = false;
    saveTshirtBtn.textContent = "SAVE T-SHIRT";

});


// ==============================
// ADD BUTTON
// ==============================

addTshirtBtn.addEventListener("click", () => {

    editingId = null;

    clearForm();

    tshirtForm.classList.remove("hidden");

});


// ==============================
// CANCEL
// ==============================

cancelTshirtBtn.addEventListener("click", () => {

    tshirtForm.classList.add("hidden");

    clearForm();

});


// ==============================
// RENDER
// ==============================

function renderTshirts() {

    tshirtsList.innerHTML = "";


    if (tshirts.length === 0) {

        tshirtsList.innerHTML = `
            <div class="empty-state">
                <p>NO T-SHIRTS YET</p>
            </div>
        `;

        return;

    }


    tshirts.forEach((tshirt) => {

        const card = document.createElement("div");

        card.className = "tshirt-card";


        card.innerHTML = `

            <div class="tshirt-image">

                <img
                    src="${tshirt.image}"
                    alt="${tshirt.name}"
                >

            </div>


            <div class="tshirt-info">

                <h3>${tshirt.name}</h3>

                <p>${tshirt.price} DA</p>

                <p>
                    Sizes:
                    ${tshirt.sizes.join(" / ")}
                </p>

                <p>
                    Stock:
                    ${tshirt.stock}
                </p>


                <div class="tshirt-actions">

                    <button
                        data-edit="${tshirt.id}"
                    >
                        EDIT
                    </button>

                    <button
                        data-delete="${tshirt.id}"
                    >
                        DELETE
                    </button>

                </div>

            </div>

        `;


        card
            .querySelector("[data-edit]")
            .addEventListener("click", () => {

                editTshirt(tshirt.id);

            });


        card
            .querySelector("[data-delete]")
            .addEventListener("click", () => {

                deleteTshirt(tshirt.id);

            });


        tshirtsList.appendChild(card);

    });

}


// ==============================
// EDIT
// ==============================

function editTshirt(id) {

    const tshirt = tshirts.find(
        item => item.id === id
    );

    if (!tshirt) return;


    editingId = id;


    tshirtForm.classList.remove("hidden");


    tshirtName.value = tshirt.name;

    tshirtPrice.value = tshirt.price;

    tshirtStock.value = tshirt.stock;


    document
        .querySelectorAll(".sizes input[type='checkbox']")
        .forEach((checkbox) => {

            checkbox.checked =
                tshirt.sizes.includes(
                    checkbox.value
                );

        });

}


// ==============================
// DELETE
// ==============================

async function deleteTshirt(id) {

    const tshirt = tshirts.find(
        item => item.id === id
    );

    if (!tshirt) return;


    if (!confirm(`Delete "${tshirt.name}"?`)) {

        return;

    }


    try {

        await deleteDoc(

            doc(
                db,
                "games",
                gameId,
                "tshirts",
                id
            )

        );


        await loadTshirts();


    } catch (error) {

        console.error(error);

        alert(
            "Could not delete T-Shirt.\n\n" +
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

    tshirtName.value = "";

    tshirtPrice.value = "";

    tshirtStock.value = "";

    tshirtImage.value = "";


    document
        .querySelectorAll(".sizes input[type='checkbox']")
        .forEach((checkbox) => {

            checkbox.checked = false;

        });


    editingId = null;

}


// ==============================
// START
// ==============================

loadTshirts();