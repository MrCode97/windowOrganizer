// GeocodeAddress.js

export async function translate(address) {
  const response = await fetch(`/api/geocode?q=${encodeURIComponent(address)}`);

  if (!response.ok) {
    const err = response.status === 404 ? 'Invalid Address' : 'Geocoding service unavailable';
    throw new Error(err);
  }

  const data = await response.json();
  return [data.lat, data.lon];
}