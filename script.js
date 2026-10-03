const gamesList = document.getElementById("gamesList");
const searchInput = document.getElementById("storeSearch");

const games =
    JSON.parse(localStorage.getItem("glitch_games")) || [];

function renderGames(search = "") {
    gamesList.innerHTML = "";

    const query = search.trim().toLowerCase();

    const filteredGames = games.filter(game => {
        if (!query) return true;

        if (game.name.toLowerCase().includes(query)) {
            return true;
        }

        const tshirts =
            JSON.parse(
                localStorage.getItem(`glitch_tshirts_${game.id}`)
            ) || [];

        return tshirts.some(tshirt =>
            tshirt.name.toLowerCase().includes(query)
        );
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

searchInput.addEventListener("input", () => {
    renderGames(searchInput.value);
});

renderGames();