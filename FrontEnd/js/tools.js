const api = "http://localhost:5678/api/"

export async function fetchData(string, options = {}) {
    try {
        const response = await fetch(`${api}${string}`, options);
        return response;
    } catch (error) {
        console.error('Error fetching:', error);
    }
}