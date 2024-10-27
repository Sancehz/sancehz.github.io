"use strict";

// creamos los obj de leaflet
var map = L.map(
	'map', {
		center: [9.6, -84.3],
		zoom: 8
	}
);
map.on("zoomend", ()=>{
	console.log(map.getZoom())
	if(map.getZoom() < 11) map.removeLayer(labelsLayer);
	else labelsLayer.addTo(map);
})

var labelsLayer = L.layerGroup(); 
var distriLayer = L.layerGroup();

var mapaLayers = {
	"fallamiento": L.layerGroup(),
	"subduccion": L.layerGroup(),
	"escuelas": L.layerGroup(),
	"gasolineras": L.layerGroup()
}


// definimos los contenidos de cada mapa
L.imageOverlay("fallamientoRaster.png", [
	[8.04121504, -85.95022887],
    [11.21977547, -82.55246223],
    ], {
    opacity: 1,
	// pane: "overlay"
}).addTo(mapaLayers.fallamiento).addTo(mapaLayers.escuelas).addTo(mapaLayers.gasolineras);

L.imageOverlay("subduccionRaster.png", [
	[8.04121504, -85.95022887],
    [11.21977547, -82.55246223],
    ], {
    opacity: 1,
	// pane: "overlay"
}).addTo(mapaLayers.subduccion);

map.addLayer(mapaLayers.fallamiento);
map.addLayer(distriLayer);

console.log(mapaLayers);

// Cargamos datos geojson para capas especificas con mis formatos cool
cargarMapa(distriLayer, "distritos.geo.json"); // Cargamos los datos desde geoJSON - lo puse en crearMapa.js porque se veia muy desordenado aqui
cargarMapa(mapaLayers.escuelas, "escuelas_afectadas_magnitud_3.5.geo.json");
cargarMapa(mapaLayers.gasolineras, "gasolineras_afectadas_magnitud_3.5.geo.json");


function cambiarMapa() {
	var mapaActual = document.querySelector('input[name="mapa-opciones"]:checked').value;
	console.log(mapaActual);
	
	map.eachLayer(function(layer) {
		map.removeLayer(layer);
	});

	map.addLayer(mapaLayers[mapaActual]);
	map.addLayer(distriLayer);

	console.log(map.getPanes().overlayPane);
}

window.onload(function() {
	document.querySelector('input[name="mapa-opciones"]')[0].click();
})

/// SETTINGS 

// // Manejamos los parametros del link y los carga para settings globales
// var urlParams = new URLSearchParams(window.location.search);
// var settings = {
	// 	autores:(urlParams.get("autores") != undefined),
	// 	markers:!(urlParams.get("noMarkers") != undefined),
	// 	areaIconos:!(urlParams.get("noAreaIconos") != undefined),
	// }
	// // modificamos los checkboxes de settings
	// document.getElementById("check-autores").checked = settings.autores;
	// document.getElementById("check-markers").checked = settings.markers;
	// document.getElementById("check-iconos").checked = settings.areaIconos;
	
	// // Corre cuando se hace click en el boton en tab settings
	// // Crea una nueva url basada en los checks y vuelve a cargar la pagina
	// function aplicarSettings() {
		// 	console.log("aplicando...");
		// 	console.log(window.location.search)
		
		// 	let checkAutores = document.getElementById("check-autores").checked;
		// 	let checkMarkers = document.getElementById("check-markers").checked;
		// 	let checkIconos = document.getElementById("check-iconos").checked;
		
		// 	let strSearch = "";
		// 	strSearch += checkAutores? "autores&" : "";
		// 	strSearch += checkMarkers? "" : "noMarkers&";
		// 	strSearch += checkIconos? "" : "noAreaIconos&";
		
		// 	console.log(strSearch);
		
		// 	window.location.search = strSearch;
// }