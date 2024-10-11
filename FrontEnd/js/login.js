import { fetchData } from "./tools.js"

/**
 * Handles the login functionality by listening to the form's submit event,
 * validating the user's input, and sending a login request to the API.
 * 
 * It also manages error handling and hides the error message when the user 
 * begins typing in the input fields again.
 */
async function useLogin() {
    const formLogin = document.querySelector("form");
    const errorLogin = document.getElementById("error-message");

    formLogin.addEventListener("submit", async function(event) {
        event.preventDefault();

        const email = document.getElementById("email")
        const password = document.getElementById("password")

        const login = {
            email: email.value,
            password: password.value
        };

        email.addEventListener('input', () => {
            if (errorLogin.style.display === "block") {
                errorLogin.style.display = 'none';
            }
        });

        password.addEventListener('input', () => {
            if (errorLogin.style.display === "block") {
                errorLogin.style.display = 'none';
            }
        });

        try {
            // Send a login request to the API with user credentials
            const responseLogin = await fetchData('users/login', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(login),
            });

            const response = await responseLogin.json();

            if (response) {
                const responseState = responseLogin.ok;

                if (responseState) {
                    errorLogin.style.display = "none";

                    sessionStorage.setItem("Token", response.token);

                    window.location.replace("index.html");
                } else {
                    errorLogin.style.display = "block";
                    errorLogin.textContent = "Erreur dans l’identifiant ou le mot de passe";
                    console.error("Erreur dans l’identifiant ou le mot de passe");
                }
            }
        } catch (error) {
            console.error("An error occurred", error);
        }
    });
}

// Call the useLogin function to initialize the login process
useLogin();
