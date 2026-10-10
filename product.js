import {
    doc,
    getDoc,
    collection,
    addDoc
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

import { db } from "./firebase.js";
const params = new URLSearchParams(window.location.search);

const productId = params.get("id");
const gameId = params.get("game");

const productContent =
    document.getElementById("productContent");


/* =========================
   DELIVERY PRICES
========================= */

const deliveryPrices = {
    "Adrar 1": { home: 1500, office: 1000 },
    "Chlef": { home: 800, office: 500 },
    "Laghouat": { home: 1000, office: 600 },
    "Oum El Bouaghi": { home: 800, office: 500 },
    "Batna": { home: 800, office: 500 },
    "Béjaïa": { home: 800, office: 500 },
    "Biskra": { home: 1000, office: 600 },
    "Béchar": { home: 1200, office: 800 },
    "Blida": { home: 600, office: 400 },
    "Bouira": { home: 700, office: 450 },
    "Tamanrasset": { home: 2000, office: 1500 },
    "Tébessa": { home: 900, office: 600 },
    "Tlemcen": { home: 800, office: 500 },
    "Tiaret": { home: 900, office: 600 },
    "Tizi Ouzou": { home: 700, office: 450 },
    "Alger": { home: 600, office: 400 },
    "Djelfa": { home: 1000, office: 600 },
    "Jijel": { home: 800, office: 500 },
    "Sétif": { home: 800, office: 500 },
    "Saïda": { home: 900, office: 600 },
    "Skikda": { home: 800, office: 500 },
    "Sidi Bel Abbès": { home: 800, office: 500 },
    "Annaba": { home: 800, office: 500 },
    "Guelma": { home: 900, office: 600 },
    "Constantine": { home: 800, office: 500 },
    "Médéa": { home: 700, office: 450 },
    "Mostaganem": { home: 800, office: 500 },
    "M'Sila": { home: 800, office: 500 },
    "Mascara": { home: 800, office: 500 },
    "Ouargla": { home: 1100, office: 700 },
    "Oran": { home: 800, office: 500 },
    "El Bayadh": { home: 1200, office: 800 },
    "Illizi": { home: 1900, office: 1500 },
    "Bordj Bou Arreridj": { home: 800, office: 500 },
    "Boumerdès": { home: 500, office: 300 },
    "El Tarf": { home: 900, office: 600 },
    "Tindouf": { home: 1700, office: 1000 },
    "Tissemsilt": { home: 800, office: 500 },
    "El Oued": { home: 1100, office: 700 },
    "Khenchela": { home: 900, office: 600 },
    "Souk Ahras": { home: 900, office: 600 },
    "Tipaza": { home: 600, office: 400 },
    "Mila": { home: 800, office: 500 },
    "Aïn Defla": { home: 800, office: 500 },
    "Naâma": { home: 1200, office: 800 },
    "Aïn Témouchent": { home: 800, office: 500 },
    "Ghardaïa": { home: 1100, office: 700 },
    "Relizane": { home: 800, office: 500 },
    "Timimoun": { home: 1500, office: 1000 },
    "Ouled Djellal": { home: 1000, office: 600 },
    "Beni Abbes": { home: 1200, office: 800 },
    "In Salah": { home: 1800, office: 1200 },
    "Touggourt": { home: 1100, office: 700 },
    "Djanet": { home: 2200, office: 1600 },
    "El M'Ghair": { home: 1100, office: 700 },
    "El Meniaa": { home: 1100, office: 800 }
};


/* =========================
   GET PRODUCT
========================= */

let product = null;

async function loadProduct() {

    try {

        const productRef = doc(
            db,
            "games",
            gameId,
            "tshirts",
            productId
        );

        const productSnapshot =
            await getDoc(productRef);

        if (productSnapshot.exists()) {

            product = {
                id: productSnapshot.id,
                ...productSnapshot.data()
            };

        }

        renderProduct();

    } catch (error) {

        console.error(error);

        productContent.innerHTML = `
            <div class="empty-state">
                <p>ERROR LOADING PRODUCT</p>
            </div>
        `;

    }

}


function renderProduct() {

    if (!product) {

    productContent.innerHTML = `
        <div class="empty-state">
            <p>PRODUCT NOT FOUND</p>
        </div>
    `;

} else {

    /* =========================
       PRODUCT HTML
    ========================= */

    productContent.innerHTML = `

        <div class="product-detail">

            <div class="product-detail-image">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

            </div>


            <div class="product-detail-info">

                <p class="product-label">
                    GLITCH / PRODUCT
                </p>

                <h1>${product.name}</h1>

                <h2>
                    ${product.price} DA
                </h2>


                <!-- SIZE -->

                <div class="product-sizes">

                    <p>SELECT SIZE</p>

                    <div id="sizeOptions"></div>

                </div>


                <!-- ORDER FORM -->

                <form id="orderForm">

                    <input
                        type="text"
                        id="customerName"
                        placeholder="الاسم واللقب"
                        required
                    >

                    <input
                        type="tel"
                        id="customerPhone"
                        placeholder="رقم الهاتف"
                        required
                    >


                    <!-- WILAYA -->

                    <select
                        id="customerWilaya"
                        required
                    >

                        <option value="">
                            اختر الولاية
                        </option>

                    </select>


                    <!-- COMMUNE -->

                    <select
                        id="customerCommune"
                        required
                        disabled
                    >

                        <option value="">
                            اختر البلدية
                        </option>

                    </select>


                    <!-- DELIVERY TYPE -->

                    <div class="delivery-type">

                        <p>TYPE DE LIVRAISON</p>

                        <label>

                            <input
                                type="radio"
                                name="deliveryType"
                                value="home"
                                required
                            >

                            <span>
                                للمنزل
                            </span>

                        </label>


                        <label>

                            <input
                                type="radio"
                                name="deliveryType"
                                value="office"
                            >

                            <span>
                                للمكتب
                            </span>

                        </label>

                    </div>


                    <!-- PRICE SUMMARY -->

                    <div class="price-summary">

                        <div>

                            <span>
                                سعر المنتج
                            </span>

                            <strong>
                                ${product.price} DA
                            </strong>

                        </div>


                        <div>

                            <span>
                                سعر التوصيل
                            </span>

                            <strong id="deliveryPrice">
                                —
                            </strong>

                        </div>


                        <div class="total">

                            <span>
                                المجموع النهائي
                            </span>

                            <strong id="finalTotal">
                                ${product.price} DA
                            </strong>

                        </div>

                    </div>


                    <button type="submit">
                        CONFIRM ORDER
                    </button>

                </form>

            </div>

        </div>

    `;


    /* =========================
       SIZE OPTIONS
    ========================= */

    const sizeOptions =
        document.getElementById("sizeOptions");

    product.sizes.forEach(size => {

        const label =
            document.createElement("label");

        label.innerHTML = `

            <input
                type="radio"
                name="size"
                value="${size}"
                required
            >

            <span>
                ${size}
            </span>

        `;

        sizeOptions.appendChild(label);

    });


    /* =========================
       WILAYA / COMMUNE
    ========================= */

    const wilayaSelect =
        document.getElementById(
            "customerWilaya"
        );

    const communeSelect =
        document.getElementById(
            "customerCommune"
        );

    const deliveryPriceElement =
        document.getElementById(
            "deliveryPrice"
        );

    const finalTotalElement =
        document.getElementById(
            "finalTotal"
        );


    ALGERIA_COMMUNES.forEach(wilaya => {

        const option =
            document.createElement("option");

        option.value =
            wilaya.name_fr;

        option.textContent =
            `${wilaya.name_ar} — ${wilaya.name_fr}`;

        wilayaSelect.appendChild(option);

    });


    /* =========================
       WHEN WILAYA CHANGES
    ========================= */

    wilayaSelect.addEventListener(
        "change",
        () => {

            const selectedWilaya =
                ALGERIA_COMMUNES.find(
                    item =>
                        item.name_fr ===
                        wilayaSelect.value
                );


            communeSelect.innerHTML = `
                <option value="">
                    اختر البلدية
                </option>
            `;


            communeSelect.disabled =
                !selectedWilaya;


            if (!selectedWilaya) {

                updateDelivery();

                return;

            }


            selectedWilaya.communes.forEach(
                commune => {

                    const option =
                        document.createElement(
                            "option"
                        );

                    option.value =
                        commune.name_fr;

                    option.textContent =
                        `${commune.name_ar} — ${commune.name_fr}`;

                    communeSelect.appendChild(
                        option
                    );

                }
            );


            updateDelivery();

        }
    );


    /* =========================
       DELIVERY TYPE
    ========================= */

    document
        .querySelectorAll(
            'input[name="deliveryType"]'
        )
        .forEach(input => {

            input.addEventListener(
                "change",
                updateDelivery
            );

        });


    /* =========================
       UPDATE DELIVERY
    ========================= */

    function updateDelivery() {

        const wilaya =
            wilayaSelect.value;

        const deliveryType =
            document.querySelector(
                'input[name="deliveryType"]:checked'
            )?.value;

        const prices =
            deliveryPrices[wilaya];


        if (!prices || !deliveryType) {

            deliveryPriceElement.textContent =
                "—";

            finalTotalElement.textContent =
                `${product.price} DA`;

            return;

        }


        const delivery =
            prices[deliveryType];

        const total =
            Number(product.price) +
            Number(delivery);


        deliveryPriceElement.textContent =
            `${delivery} DA`;

        finalTotalElement.textContent =
            `${total} DA`;

    }


    /* =========================
       SAVE ORDER
    ========================= */

    document
        .getElementById("orderForm")
        .addEventListener(
            "submit",
            async event => {

                event.preventDefault();


                const selectedSize =
                    document.querySelector(
                        'input[name="size"]:checked'
                    );


                const deliveryType =
                    document.querySelector(
                        'input[name="deliveryType"]:checked'
                    );


                if (!selectedSize) {

                    alert(
                        "Select a size."
                    );

                    return;

                }


                if (!deliveryType) {

                    alert(
                        "Select delivery type."
                    );

                    return;

                }


                const name =
                    document.getElementById(
                        "customerName"
                    ).value.trim();


                const phone =
                    document.getElementById(
                        "customerPhone"
                    ).value.trim();


                const wilaya =
                    wilayaSelect.value;


                const commune =
                    communeSelect.value;


                if (!wilaya) {

                    alert(
                        "Select Wilaya."
                    );

                    return;

                }


                if (!commune) {

                    alert(
                        "Select Commune."
                    );

                    return;

                }


                const delivery =
                    deliveryPrices[wilaya]
                    [deliveryType.value];


                const total =
                    Number(product.price) +
                    Number(delivery);


                const deliveryName =
                    deliveryType.value === "home"
                        ? "للمنزل"
                        : "للمكتب";


                /* =========================
                   CREATE ORDER
                ========================= */

                const order = {

                    id: Date.now(),

                    productId:
                        product.id,

                    productName:
                        product.name,

                    productPrice:
                        Number(product.price),

                    deliveryPrice:
                        Number(delivery),

                    total:
                        total,

                    size:
                        selectedSize.value,

                    name:
                        name,

                    phone:
                        phone,

                    wilaya:
                        wilaya,

                    commune:
                        commune,

                    deliveryType:
                        deliveryName,

                    date:
                        new Date().toLocaleString(
                            "fr-DZ"
                        )

                };


                /* =========================
                   SAVE ORDER
                ========================= */

                await addDoc(
    collection(db, "orders"),
    order
);


                /* =========================
                   SUCCESS
                ========================= */

                alert(
                    "تم تسجيل الطلب بنجاح."
                );


                window.location.href =
                    "index.html";

            }
        );

}}loadProduct();
