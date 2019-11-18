// Initialize the platform object:
var platform = new H.service.Platform({
  apikey: "mwdeRgol51c1qnfPdN9nxBFTf1gKeTtM_K2dp2w_Aik"
});

// Obtain the default map types from the platform object
var defaultLayers = platform.createDefaultLayers();

// Instantiate (and display) a map object:
var map = new H.Map(
  document.getElementById("mapContainer"),
  defaultLayers.vector.normal.map,
  {
    zoom: 12,
    center: { lat: 34.0522, lng: -118.2437 },
    pixelRatio: window.devicePixelRatio || 1
  }
);

var traffic = $("#traffic").click(() => {
  map.addLayer(defaultLayers.vector.normal.traffic);
});

var accident = $("#accident").click(() => {
  map.addLayer(defaultLayers.vector.normal.trafficincidents);
});
