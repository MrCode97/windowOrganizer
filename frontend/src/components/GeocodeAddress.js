// GeocodeAddress.js

export async function translate(address) {
  // Encode the address string to be used in the URL
  const encoded_address = encodeURIComponent(address);

  // Nominatim API endpoint
  const api_url = `https://nominatim.openstreetmap.org/search.php?q=${encoded_address}&format=json`;

  try {
    // Make a GET request to the Nominatim API
    const response = await fetch(api_url);

    if (!response.ok) {
      throw new Error(`Error: Unable to fetch data. Status ${response.status}`);
    }

    // Parse the JSON response
    const data = await response.json();

    // Check if there is at least one result
    if (data.length > 0) {
      // Extract latitude and longitude from the first result
      const { lat, lon } = data[0];

      // Return the latitude and longitude
      return [lat, lon];
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
  return [];
}