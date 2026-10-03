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


function loadTshirts() {

    const saved =
        localStorage.getItem(`glitch_tshirts_${gameId}`);

    tshirts = saved ? JSON.parse(saved) : [];

    renderTshirts();
}


function saveTshirts() {

    localStorage.setItem(
        `glitch_tshirts_${gameId}`,
        JSON.stringify(tshirts)
    );
}


addTshirtBtn.addEventListener("click", () => {

    editingId = null;

    clearForm();

    tshirtForm.classList.remove("hidden");
});


cancelTshirtBtn.addEventListener("click", () => {

    tshirtForm.classList.add("hidden");

    clearForm();
});


saveTshirtBtn.addEventListener("click", () => {

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


    if (editingId && !file) {

        const tshirt = tshirts.find(
            item => item.id === editingId
        );

        tshirt.name = name;
        tshirt.price = Number(price);
        tshirt.stock = Number(stock);
        tshirt.sizes = sizes;

        saveTshirts();
        renderTshirts();

        tshirtForm.classList.add("hidden");
        clearForm();

        return;
    }


    if (!file) {

        alert("Select an image.");
        return;
    }


    const reader = new FileReader();


    reader.onload = function () {

        const image = reader.result;


        if (editingId) {

            const tshirt = tshirts.find(
                item => item.id === editingId
            );

            tshirt.name = name;
            tshirt.price = Number(price);
            tshirt.stock = Number(stock);
            tshirt.sizes = sizes;
            tshirt.image = image;

        } else {

            tshirts.push({

                id: Date.now(),

                name: name,

                price: Number(price),

                stock: Number(stock),

                sizes: sizes,

                image: image
            });
        }


        saveTshirts();

        renderTshirts();

        tshirtForm.classList.add("hidden");

        clearForm();
    };


    reader.readAsDataURL(file);
});


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
                    Sizes: ${tshirt.sizes.join(" / ")}
                </p>

                <p>
                    Stock: ${tshirt.stock}
                </p>


                <div class="tshirt-actions">

                    <button onclick="editTshirt(${tshirt.id})">
                        EDIT
                    </button>

                    <button onclick="deleteTshirt(${tshirt.id})">
                        DELETE
                    </button>

                </div>

            </div>
        `;


        tshirtsList.appendChild(card);
    });
}


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
                tshirt.sizes.includes(checkbox.value);

        });
}


function deleteTshirt(id) {

    const tshirt = tshirts.find(
        item => item.id === id
    );

    if (!tshirt) return;


    if (!confirm(`Delete "${tshirt.name}"?`)) {
        return;
    }


    tshirts = tshirts.filter(
        item => item.id !== id
    );

    saveTshirts();

    renderTshirts();
}


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


loadTshirts();