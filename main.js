var map = L.map(
	'map', {
	center: [9.86568, -83.891875],
	zoom: 18
	}
);

async function crearMapa() {
	// Obtenemos el GeoJSON (lo hago asi para que el codigo no se vea tan feo)
	// (((y para no tener que cambiar todo cuando actualizamos el mapa)))
	var response = await fetch("mapa.json");
	var mapaDat = await response.text();

	var pJson = JSON.parse(mapaDat);

	for(var feature of pJson.features) {
		L.geoJson(feature).addTo(map);

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
