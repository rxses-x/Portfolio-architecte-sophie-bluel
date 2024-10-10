import { fetchData } from "./tools.js"

/**
 * Handles the login functionality by listening to the form's submit event,
 * validating the user's input, and sending a login request to the API.
 * 
 * It also manages error handling and hides the error message when the user 
 * begins typing in the input fields again.
 */
async function useLogin() {
    // Select the login form element and error message element
    const formLogin = document.querySelector("form");
    const errorLogin = document.getElementById("error-message");

    // Add an event listener for form submission
    formLogin.addEventListener("submit", async function(event) {
        event.preventDefault(); // Prevent default form submission behavior

        // Gather login details from the form inputs
        const login = {
            email: document.getElementById("email").value,
            password: document.getElementById("password").value
        };

        // Hide error message when the user starts typing in the password field
        document.getElementById("password").addEventListener('input', () => {
            if (errorLogin.style.display === "block") {
                errorLogin.style.display = 'none';
            }
        });

        // Hide error message when the user starts typing in the email field
        document.getElementById("email").addEventListener('input', () => {
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

            const response = await responseLogin.json(); // Parse the response

            if (response) {
                // Check if the login response is successful (status OK)
                const responseState = responseLogin.ok;

                if (responseState) {
                    // If login is successful, hide the error message
                    errorLogin.style.display = "none";

                    // Store the token in sessionStorage
                    sessionStorage.setItem("Token", response.token);

                    // Redirect to the homepage
                    window.location.replace("index.html");
                } else {
                    // If login fails, display an error message
                    errorLogin.style.display = "block";
                    errorLogin.textContent = "Erreur dans l’identifiant ou le mot de passe";
                    console.error("Erreur dans l’identifiant ou le mot de passe");
                }
            }
        } catch (error) {
            // Handle any errors that occur during the fetch or login process
            console.error("An error occurred", error);
        }
    });
}

// Call the useLogin function to initialize the login process
useLogin();
