var map = L.map(
	'map', {
	center: [9.86568, -83.891875],
	zoom: 19
	}
);

function formatoMapa(feature) {
	if(feature.geometry.type == "Point")
		return formatoPuntos(feature);
	if(feature.geometry.type == "LineString")
		return formatoLineas(feature);
	if(feature.geometry.type == "Polygon")
		return formatoPolys(feature)
}

function formatoPuntos(f) {
	var style = {color: "gray"};
	return style;
}

function formatoLineas(f) {
	var style = {color: "green"};
	return style;
}

function formatoPolys(f) {
	var style = {color: "blue"};
	return style;
}

async function crearMapa() {
	// Obtenemos el GeoJSON como archivo de texto desde la misma pagina github
	// (para no tener que cambiar todo cada vez que actualizamos algo)
	var response = await fetch("mapa.json");
	var mapaDat = await response.text();

	var pJson = JSON.parse(mapaDat); // cargamos el JSON como un objeto

	// agregamos cada elemento
	for(var feature of pJson.features) {
		L.geoJson(feature, {style: formatoMapa}).addTo(map);
	}
}

crearMapa();

/// Marcador Central
var markIcon = L.icon({
	iconUrl:"imagenes/marker.png",
	iconSize: [20,32],
	iconAnchor: [10,32]
})

L.marker([9.86568, -83.891875], {
	icon: markIcon,
	title: "Condominio Florencia", 
	alt: "Condominio Florencia",
	draggable: false,
}).addTo(map);
