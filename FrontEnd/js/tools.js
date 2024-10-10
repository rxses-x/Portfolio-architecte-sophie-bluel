const api = "http://localhost:5678/api/"

/**
 * Fetches data from the specified API endpoint with optional fetch options.
 * @param {string} name - The endpoint or resource name to append to the base API URL.
 * @param {Object} [options={}] - Optional fetch options (e.g., method, headers, body). Defaults to an empty object.
 * @returns {Promise<Response>} - A promise that resolves to the fetch Response object.
 * @throws Will log an error to the console if the fetch operation fails.
 */
export async function fetchData(name, options = {}) {
    try {
        // Send the fetch request to the constructed URL
        const response = await fetch(`${api}${name}`, options);
        
        // Return the fetch response
        return response;
    } catch (error) {
        // Log any errors encountered during the fetch process
        console.error('Error fetching:', error);
    }
}
