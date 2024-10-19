// GeocodeAddress.js

export async function translate(address) {
  // Encode the address string to be used in the URL
  const encoded_address = encodeURIComponent(address);

  // Nominatim API endpoint
  const api_url = `https://nominatim.openstreetmap.org/search.php?q=${encoded_address}&format=json`;

  try {
    const response = await fetch(api_url);

    if (!response.ok) {
      throw new Error(`Error: Unable to fetch data. Status ${response.status}`);
    }

    const data = await response.json();

    if (data.length > 0) {
      const { lat, lon } = data[0];
      return [lat, lon];
    }
  } catch (error) {
    console.error("Error:", error.message);
    throw new Error(`Error: Unable to fetch data. Status ${error.message}`);
  }
  return [];
}