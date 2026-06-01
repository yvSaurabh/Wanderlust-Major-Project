if (typeof mapboxgl !== "undefined" && document.getElementById("map")) {
  mapboxgl.accessToken = window.mapToken;

  const mapCenter = window.mapCenter || [77.2090, 28.6139];
  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: mapCenter,
    zoom: 9,
  });

  new mapboxgl.Marker()
    .setLngLat(mapCenter)
    .addTo(map);
}
