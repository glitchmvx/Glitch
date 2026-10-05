import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import { auth } from "./firebase.js";


const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const errorBox = document.getElementById("error");


loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    errorBox.textContent = "";

    loginBtn.disabled = true;
    loginBtn.textContent = "LOGIN...";

    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        window.location.href = "admin.html";

    } catch (error) {

        console.error(error);

        errorBox.textContent =
            "Invalid email or password.";

        loginBtn.disabled = false;
        loginBtn.textContent = "LOGIN";

    }

});
