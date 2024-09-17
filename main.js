"use strict";
// Holis mi js es un desastre sorry

// creamos los obj de leaflet
var map = L.map(
	'map', {
		center: [9.86568, -83.891875],
		zoom: 19
	}
);
map.on("zoomend", ()=>{
	if(map.getZoom() < 19) map.removeLayer(labelsLayer);
	else labelsLayer.addTo(map);
})

var labelsLayer = L.layerGroup(); // aqui van todos los numeros de casa y asi

crearMapa(); // Cargamos los datos desde geoJSON - lo puse en crearMapa.js porque se veia muy desordenado aqui
// Y agregamos las labels para que salgan encima de todo
labelsLayer.addTo(map);



/// SETTINGS 

// Manejamos los parametros del link y los carga para settings globales
var urlParams = new URLSearchParams(window.location.search);
var settings = {
	autores:(urlParams.get("autores") != undefined),
	markers:!(urlParams.get("noMarkers") != undefined),
	areaIconos:!(urlParams.get("noAreaIconos") != undefined),
}
// modificamos los checkboxes de settings
document.getElementById("check-autores").checked = settings.autores;
document.getElementById("check-markers").checked = settings.markers;
document.getElementById("check-iconos").checked = settings.areaIconos;

// Corre cuando se hace click en el boton en tab settings
// Crea una nueva url basada en los checks y vuelve a cargar la pagina
function aplicarSettings() {
	console.log("aplicando...");
	console.log(window.location.search)

	let checkAutores = document.getElementById("check-autores").checked;
	let checkMarkers = document.getElementById("check-markers").checked;
	let checkIconos = document.getElementById("check-iconos").checked;

	let strSearch = "";
	strSearch += checkAutores? "autores&" : "";
	strSearch += checkMarkers? "" : "noMarkers&";
	strSearch += checkIconos? "" : "noAreaIconos&";

	console.log(strSearch);

	window.location.search = strSearch;
}