const addGameBtn = document.getElementById("addGameBtn");

const gameForm = document.getElementById("gameForm");
const gameFormTitle = document.getElementById("gameFormTitle");

const gameNameInput = document.getElementById("gameName");
const gameImageInput = document.getElementById("gameImage");

const saveGameBtn = document.getElementById("saveGameBtn");
const cancelGameBtn = document.getElementById("cancelGameBtn");

const gamesList = document.getElementById("gamesList");


let games =
    JSON.parse(localStorage.getItem("glitch_games")) || [];

let editingId = null;


/* Make sure old games have an image field */

games = games.map(game => ({
    ...game,
    image: game.image || ""
}));


function saveGames() {

    localStorage.setItem(
        "glitch_games",
        JSON.stringify(games)
    );

}


/* OPEN ADD FORM */

addGameBtn.addEventListener("click", () => {

    editingId = null;

    clearForm();

    gameFormTitle.textContent = "ADD GAME";

    saveGameBtn.textContent = "SAVE GAME";

    gameForm.classList.remove("hidden");

});


/* CANCEL */

cancelGameBtn.addEventListener("click", () => {

    gameForm.classList.add("hidden");

    clearForm();

});


/* SAVE */

saveGameBtn.addEventListener("click", () => {

    const name = gameNameInput.value.trim();

    const file = gameImageInput.files[0];


    if (!name) {

        alert("Enter game name.");

        return;

    }


    /* EDIT WITHOUT NEW IMAGE */

    if (editingId && !file) {

        const game = games.find(
            item => item.id === editingId
        );

        if (!game) return;

        game.name = name;

        saveGames();

        renderGames();

        gameForm.classList.add("hidden");

        clearForm();

        return;

    }


    /* NEW GAME NEEDS IMAGE */

    if (!file) {

        alert("Select a game image.");

        return;

    }


    const reader = new FileReader();


    reader.onload = function () {

        const image = reader.result;


        /* EDIT */

        if (editingId) {

            const game = games.find(
                item => item.id === editingId
            );

            if (!game) return;

            game.name = name;

            game.image = image;

        }


        /* ADD */

        else {

            games.push({

                id: Date.now(),

                name: name,

                image: image

            });

        }


        saveGames();

        renderGames();

        gameForm.classList.add("hidden");

        clearForm();

    };


    reader.readAsDataURL(file);

});


/* RENDER */

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

        const card =
            document.createElement("div");

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
                        onclick="event.stopPropagation(); editGame(${game.id})"
                    >
                        EDIT
                    </button>

                    <button
                        onclick="event.stopPropagation(); deleteGame(${game.id})"
                    >
                        DELETE
                    </button>

                </div>

            </div>

        `;


        card.addEventListener("click", () => {

            openGame(game.id);

        });


        gamesList.appendChild(card);

    });

}


/* OPEN GAME */

function openGame(id) {

    const game =
        games.find(item => item.id === id);

    if (!game) return;


    window.location.href =
        `admin-game.html?id=${game.id}&name=${encodeURIComponent(game.name)}`;

}


/* EDIT GAME */

function editGame(id) {

    const game =
        games.find(item => item.id === id);

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


/* DELETE GAME */

function deleteGame(id) {

    const game =
        games.find(item => item.id === id);

    if (!game) return;


    if (!confirm(`Delete "${game.name}"?`)) {

        return;

    }


    games = games.filter(
        item => item.id !== id
    );


    saveGames();

    renderGames();

}


/* CLEAR FORM */

function clearForm() {

    gameNameInput.value = "";

    gameImageInput.value = "";

    editingId = null;

}

function renderOrders() {
    const ordersList = document.getElementById("ordersList");

    if (!ordersList) return;

    const orders =
        JSON.parse(localStorage.getItem("glitch_orders")) || [];

    ordersList.innerHTML = "";

    if (orders.length === 0) {
        ordersList.innerHTML = `
            <div class="empty-state">
                <p>NO ORDERS YET</p>
            </div>
        `;
        return;
    }

    orders.forEach(order => {
        const card = document.createElement("div");

        card.className = "order-card";

        card.innerHTML = `
            <div class="order-info">
                <h3>${order.productName}</h3>

                <p><strong>NAME:</strong> ${order.name}</p>
                <p><strong>PHONE:</strong> ${order.phone}</p>
                <p><strong>WILAYA:</strong> ${order.wilaya}</p>
                <p><strong>COMMUNE:</strong> ${order.commune}</p>
                <p><strong>SIZE:</strong> ${order.size}</p>
                <p><strong>DELIVERY:</strong> ${order.deliveryType}</p>

                <p><strong>PRODUCT:</strong> ${order.productPrice} DA</p>
                <p><strong>DELIVERY PRICE:</strong> ${order.deliveryPrice} DA</p>

                <h4>TOTAL: ${order.total} DA</h4>
            </div>

            <button onclick="deleteOrder(${order.id})">
                DELETE
            </button>
        `;

        ordersList.appendChild(card);
    });
}

function deleteOrder(id) {
    const orders =
        JSON.parse(localStorage.getItem("glitch_orders")) || [];

    const updatedOrders =
        orders.filter(order => order.id !== id);

    localStorage.setItem(
        "glitch_orders",
        JSON.stringify(updatedOrders)
    );

    renderOrders();
}

renderGames();
renderOrders();
renderGames();