import { fetchData } from "./tools.js"

async function useLogin() {
    const formLogin = document.querySelector("form");
    const errorLogin = document.getElementById("error-message");
    formLogin.addEventListener("submit", async function(event) {
        event.preventDefault(); // Prevent the default form submission
        const login = {
            email: document.getElementById("email").value,
            password: document.getElementById("password").value
        };

        document.getElementById("password").addEventListener('input', () => {
            if (errorLogin.style.display === "block") {
                errorLogin.style.display = 'none';
            }
        });

        document.getElementById("email").addEventListener('input', () => {
            if (errorLogin.style.display === "block") {
                errorLogin.style.display = 'none';
            }
        });

        try {
            const responseLogin = await fetchData('users/login', {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(login),
            })
            const response = await responseLogin.json();
            
            if (response) {
                const responseState = responseLogin.ok;
        
                if (responseState) {
                    errorLogin.style.display = "none"
                    sessionStorage.setItem("Token", response.token);
                    window.location.replace("index.html");
                } else {
                    errorLogin.style.display = "block"
                    errorLogin.textContent = "Erreur dans l’identifiant ou le mot de passe"
                    console.error("Erreur dans l’identifiant ou le mot de passe")
                }
            }
        } catch (error) {
            console.error("An error occurred", error);
        }
    });
}

useLogin();