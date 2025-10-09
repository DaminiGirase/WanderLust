document.addEventListener("DOMContentLoaded", () => {
  const mapDiv = document.getElementById("map");
  const lat = mapDiv.getAttribute("data-lat");
  const lng = mapDiv.getAttribute("data-lng");
  const locationName = mapDiv.getAttribute("data-location"); // get location name

  if (!lat || !lng) return;

  const map = L.map("map").setView([lat, lng], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  // Use location name in popup
  L.marker([lat, lng]).addTo(map).bindPopup(locationName).openPopup();
});
