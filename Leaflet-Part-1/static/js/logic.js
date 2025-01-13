// Initialize the map
var map = L.map('map').setView([37.09, -95.71], 5);  // Set map view to USA

// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Define the earthquake data URL (USGS feed for the past 7 days)
var earthquakeDataUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Fetch the earthquake data using D3.js
d3.json(earthquakeDataUrl).then(function(data) {

  // Function to determine the color based on depth
  function getColor(depth) {
    if (depth <= 10) {
      return "#00FF00"; // Green
    } else if (depth <= 30) {
      return "#FFFF00"; // Yellow
    } else if (depth <= 50) {
      return "#FFA500"; // Orange
    } else if (depth <= 70) {
      return "#FF4500"; // Red-Orange
    } else {
      return "#FF0000"; // Red
    }
  }

  // Function to determine the radius of the marker based on magnitude
  function getRadius(magnitude) {
    return magnitude * 3; // Scale the radius by the magnitude
  }

  // Loop through the earthquake data and create markers for each earthquake
  L.geoJSON(data, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng, {
        radius: getRadius(feature.properties.mag),
        fillColor: getColor(feature.geometry.coordinates[2]),  // Depth is the third coordinate
        color: "#000000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.7
      }).bindPopup("<h3>" + feature.properties.title + "</h3><p><b>Magnitude:</b> " + feature.properties.mag + 
                   "</p><p><b>Location:</b> " + feature.properties.place + "</p><p><b>Depth:</b> " + feature.geometry.coordinates[2] + " km</p>");
    }
  }).addTo(map);

  // Create a legend for the depth colors
  var legend = L.control({ position: "bottomright" });

  legend.onAdd = function () {
    var div = L.DomUtil.create('div', 'info legend');
    var depthCategories = [0, 10, 30, 50, 70];
    var labels = [];

    // Loop through depth categories and create a label with a colored square
    for (var i = 0; i < depthCategories.length; i++) {
      div.innerHTML +=
        '<i style="background:' + getColor(depthCategories[i] + 1) + '"></i> ' +
        depthCategories[i] + (depthCategories[i + 1] ? '&ndash;' + depthCategories[i + 1] + ' km<br>' : '+ km');
    }

    return div;
  };

  // Add the legend to the map
  legend.addTo(map);
});
