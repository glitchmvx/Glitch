const params = new URLSearchParams(window.location.search);

const gameId = params.get("id");
const gameName = params.get("name");

const gameNameElement = document.getElementById("gameName");
const tshirtsList = document.getElementById("tshirtsList");

gameNameElement.textContent = gameName || "GAME";

const saved =
    localStorage.getItem(`glitch_tshirts_${gameId}`);

const tshirts = saved ? JSON.parse(saved) : [];


function renderTshirts() {

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

        card.className = "store-tshirt-card";

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


renderTshirts();