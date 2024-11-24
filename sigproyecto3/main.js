"use strict";

// creamos los obj de leaflet
var map = L.map(
	'map', {
		center: [10.6667, -85.4702],
		zoom: 10,
		minZoom: 10,
		maxZoom: 16,
	}
);

// L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(map);

var tilesLiberia = L.tileLayer('https://sancehz.github.io/sigproyecto3/tiles/{z}/{x}/{y}.png', {
    attribution: '',
	minZoom: 10,
	maxZoom: 15,
	errorTileUrl: "./imagenes/notile.png",
	tms: true,
});

tilesLiberia.on("tileerror", function(e) {console.log(`tileerror: ${e.url}`)});
tilesLiberia.addTo(map);
