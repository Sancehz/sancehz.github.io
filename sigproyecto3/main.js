"use strict";

// creamos los obj de leaflet
var map = L.map(
	'map', {
		center: [10.6667, -85.4702],
		zoom: 10
	}
);

L.tileLayer('https://sancehz.github.io/sigproyecto3/tiles/{z}/{x}/{y}.png', {
    attribution: ''
}).addTo(map);