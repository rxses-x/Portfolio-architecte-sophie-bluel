async function getGallerys() {
    const response = await fetch("http://localhost:5678/api/works")
    const data = await response.json()

    for (let work of data) {
        document.querySelector(".gallery").innerHTML += `<figure><img src="${work.imageUrl}" alt="${work.title}"><figcaption>${work.title}</figcaption></figure>`
    }
}

getGallerys();