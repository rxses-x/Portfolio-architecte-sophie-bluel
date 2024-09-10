const api = "http://localhost:5678/api/users/login";

async function fetchData(url, options = {}) {
    const response = await fetch(url, options);
    return response;
}

async function useLogin() {
    const formLogin = document.querySelector("form");
    formLogin.addEventListener("submit", async function(event) {
        event.preventDefault(); // Prevent the default form submission

        const login = {
            email: document.querySelector("[name='email']").value,
            password: document.querySelector("[name='password']").value
        };

        const responseLogin = await fetchData(api, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(login),
        });

        const response = await responseLogin.json();
        const responseToken = response.token;
        const responseState = responseLogin.ok;

        if (responseState) {
            sessionStorage.setItem("Token", responseToken);
            window.location.replace("index.html");
        } else {
            window.alert("Erreur dans l’identifiant ou le mot de passe");
            window.location.replace("login.html");
        }
    });
}

useLogin();