function setStyle(map) {
  // get the vector provider from the base layer
  var provider = map.getBaseLayer().getProvider();
  // Create the style object from the YAML configuration.
  // First argument is the style path and the second is the base URL to use for
  // resolving relative URLs in the style like textures, fonts.
  // all referenced resources relative to the base path https://js.api.here.com/v3/3.1/styles/omv.
  var style = new H.map.Style(
    "https://heremaps.github.io/maps-api-for-javascript-examples/change-style-at-load/data/dark.yaml",
    "https://js.api.here.com/v3/3.1/styles/omv/"
  );
  // set the style on the existing layer
  provider.setStyle(style);
}

// Instantiate a map and platform object:
var platform = new H.service.Platform({
  apikey: "mwdeRgol51c1qnfPdN9nxBFTf1gKeTtM_K2dp2w_Aik"
});
// Retrieve the target element for the map:
var targetElement = document.getElementById("mapContainer");

// Get the default map types from the platform object:
var defaultLayers = platform.createDefaultLayers();

// Instantiate the map:
var map = new H.Map(
  document.getElementById("mapContainer"),
  defaultLayers.vector.normal.map,
  {
    zoom: 6,
    center: { lat: 34.0522, lng: -118.2437 },
    pixelRatio: window.devicePixelRatio || 1
  }
);
// Create the parameters for the routing request:
var routingParameters = {
  // The routing mode:
  mode: "fastest;car",
  // The start point of the route:
  waypoint0: "geo!34.0403207,-118.2717511",
  // The end point of the route:
  waypoint1: "geo!34.0597,-118.3009",
  // To retrieve the shape of the route we choose the route
  // representation mode 'display'
  representation: "display"
};

// Define a callback function to process the routing response:
var onResult = function(result) {
  var route, routeShape, startPoint, endPoint, linestring;
  if (result.response.route) {
    // Pick the first route from the response:
    route = result.response.route[0];
    // Pick the route's shape:
    routeShape = route.shape;

    // Create a linestring to use as a point source for the route line
    linestring = new H.geo.LineString();

    // Push all the points in the shape into the linestring:
    routeShape.forEach(function(point) {
      var parts = point.split(",");
      linestring.pushLatLngAlt(parts[0], parts[1]);
    });

    // Retrieve the mapped positions of the requested waypoints:
    startPoint = route.waypoint[0].mappedPosition;
    endPoint = route.waypoint[1].mappedPosition;

    // Create a polyline to display the route:
    var routeLine = new H.map.Polyline(linestring, {
      style: { strokeColor: "blue", lineWidth: 3 }
    });

    // Create a marker for the start point:
    var startMarker = new H.map.Marker({
      lat: startPoint.latitude,
      lng: startPoint.longitude
    });

    // Create a marker for the end point:
    var endMarker = new H.map.Marker({
      lat: endPoint.latitude,
      lng: endPoint.longitude
    });

    var routeOutline = new H.map.Polyline(linestring, {
      style: {
        lineWidth: 10,
        strokeColor: "rgba(0, 128, 255, 0.7)",
        lineTailCap: "arrow-tail",
        lineHeadCap: "arrow-head"
      }
    });
    // Create a patterned polyline:
    var routeArrows = new H.map.Polyline(linestring, {
      style: {
        lineWidth: 10,
        fillColor: "white",
        strokeColor: "rgba(255, 255, 255, 1)",
        lineDash: [0, 2],
        lineTailCap: "arrow-tail",
        lineHeadCap: "arrow-head"
      }
    });
    // create a group that represents the route line and contains
    // outline and the pattern
    var routeLine = new H.map.Group();
    routeLine.addObjects([routeOutline, routeArrows]);

    // Add the route polyline and the two markers to the map:
    map.addObjects([routeLine, startMarker, endMarker]);

    // Set the map's viewport to make the whole route visible:
    map.getViewModel().setLookAtData({ bounds: routeLine.getBoundingBox() });
  }

  // Create an outline for the route polyline:
};

// Get an instance of the routing service:
var router = platform.getRoutingService();

// Call calculateRoute() with the routing parameters,
// the callback and an error callback function (called if a
// communication error occurs):
router.calculateRoute(routingParameters, onResult, function(error) {
  alert(error.message);
});
