import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

import { db } from "./firebase.js";


const gamesList = document.getElementById("gamesList");
const searchInput = document.getElementById("storeSearch");

let games = [];


// ==============================
// LOAD GAMES
// ==============================

async function loadGames() {

    gamesList.innerHTML = `
        <div class="empty-games">
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

        renderGames(searchInput.value);

    } catch (error) {

        console.error(error);

        gamesList.innerHTML = `
            <div class="empty-games">
                <p>ERROR LOADING GAMES</p>
            </div>
        `;

    }
}


// ==============================
// RENDER GAMES
// ==============================

function renderGames(search = "") {

    gamesList.innerHTML = "";

    const query = search.trim().toLowerCase();

    const filteredGames = games.filter(game => {

        return !query ||
            game.name.toLowerCase().includes(query);

    });


    if (filteredGames.length === 0) {

        gamesList.innerHTML = `
            <div class="empty-games">
                <p>NO RESULTS FOUND</p>
            </div>
        `;

        return;
    }


    filteredGames.forEach(game => {

        const card = document.createElement("a");

        card.className = "game-store-card";

        card.href =
            `game.html?id=${game.id}&name=${encodeURIComponent(game.name)}`;


        const imageHTML = game.image
            ? `<img src="${game.image}" alt="${game.name}">`
            : `<div class="game-no-image">NO IMAGE</div>`;


        card.innerHTML = `

            <div class="game-store-image">

                ${imageHTML}

                <span>VIEW COLLECTION</span>

            </div>

            <div class="game-store-info">

                <h3>${game.name}</h3>

                <span>EXPLORE →</span>

            </div>

        `;


        gamesList.appendChild(card);

    });

}


// ==============================
// SEARCH
// ==============================

searchInput.addEventListener("input", () => {

    renderGames(searchInput.value);

});


// ==============================
// START
// ==============================

loadGames();