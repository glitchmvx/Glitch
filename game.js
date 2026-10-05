import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

import { db } from "./firebase.js";


const params = new URLSearchParams(window.location.search);

const gameId = params.get("id");
const gameName = params.get("name");

const gameNameElement =
    document.getElementById("gameName");

const tshirtsList =
    document.getElementById("tshirtsList");


gameNameElement.textContent =
    gameName || "GAME";


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


        const tshirts = [];


        snapshot.forEach((item) => {

            tshirts.push({
                id: item.id,
                ...item.data()
            });

        });


        renderTshirts(tshirts);


    } catch (error) {

        console.error(error);

        tshirtsList.innerHTML = `
            <div class="empty-state">
                <p>ERROR LOADING T-SHIRTS</p>
            </div>
        `;

    }

}


// ==============================
// RENDER
// ==============================

function renderTshirts(tshirts) {

    tshirtsList.innerHTML = "";


    if (tshirts.length === 0) {

        tshirtsList.innerHTML = `
            <div class="empty-state">
                <p>NO T-SHIRTS AVAILABLE</p>
            </div>
        `;

        return;

    }


    tshirts.forEach((tshirt) => {

        const card = document.createElement("a");

        card.className =
            "store-tshirt-card";


        card.href =
            `product.html?id=${tshirt.id}&game=${gameId}`;


        card.innerHTML = `

            <div class="store-tshirt-image">

                <img
                    src="${tshirt.image}"
                    alt="${tshirt.name}"
                >

            </div>


            <div class="store-tshirt-info">

                <h3>${tshirt.name}</h3>

                <p>${tshirt.price} DA</p>

                <span>
                    VIEW PRODUCT →
                </span>

            </div>

        `;


        tshirtsList.appendChild(card);

    });

}


// ==============================
// START
// ==============================

loadTshirts();