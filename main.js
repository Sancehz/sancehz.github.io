var map = L.map(
	'map', {
	center: [9.86568, -83.891875],
	zoom: 19
	}
);

function formatoMapa(feature) {
	if(feature.geometry.type == "Point")
		return {};
	if(feature.geometry.type == "LineString")
		return {color: "white", weight:10, opacity:1};
	if(feature.geometry.type == "Polygon")
		return formatoPolys(feature)
}

var markIconos = {
	storage_tank: L.icon({iconUrl:"markers/water_tank.png", iconSize:[32,32], iconAnchor:[16,32]}),
	wastewater_plant: L.icon({iconUrl:"markers/water_treatment.png", iconSize:[32,32], iconAnchor:[16,32]}),
	water_well: L.icon({iconUrl:"markers/water_well.png", iconSize:[32,32], iconAnchor:[16,32]}),

	mast: L.icon({iconUrl:"markers/light.png", iconSize:[32,32], iconAnchor:[16,32]}),

	place_of_worship: L.icon({iconUrl:"markers/church.png", iconSize:[32,32], iconAnchor:[16,32]}),
	park: L.icon({iconUrl:"markers/park.png", iconSize:[32,32], iconAnchor:[16,32]}),
	dog_park: L.icon({iconUrl:"markers/dog_park.png", iconSize:[32,32], iconAnchor:[16,32]}),
	pitch: L.icon({iconUrl:"markers/leisure.png", iconSize:[32,32], iconAnchor:[16,32]}),
};

function formatoPuntos(f) {
	var style = {color: "gray"};

	// sacamos los datos que existan dependiendo del tipo de punto
	var llave = f.properties.building ?? f.properties.leisure ?? 
				f.properties.amenity ?? f.properties.man_made;

	style.icon = markIconos[llave];

	return style.icon ?? markIconos.dog_park;
}

function formatoPolys(f) {
	var style = {weight:2};

	const styles = {
		// landuse
		residential: {color:"#e0e0e0", weight:2, bgOp:1},
		grass: {color:"green", icon:"grass.png", weight:1, bgOp:.1, dashes:"20,20"},
		farmland: {color:"brown", icon:"farmland.png", weight:1, bgOp:.1, dashes:"20,20"},

		// building
		house: {color:"#cf657f", weight:2, bgOp:.4},

		// leisure
		pitch: {color:"#165a4c", icon:"leisure.png", weight:2, bgOp:.3},
		park: {color:"#239063", icon:"park.png", weight:2, bgOp:.3, dashes:"10,10"},
		dog_park: {color:"#239063", icon:"dog_park.png", weight:2, bgOp:.3, dashes:"10,10"},

		// amenity
		parking: {color:"#7f708a", icon:"parking.png", weight:2, bgOp:.3, dashes:"10,10"},

		// man_made
		storage_tank: {color:"gray", icon:"water_tank.png", weight:2, bgOp:.3},
		wastewater_plant: {color:"gray", icon:"water_treatment.png", weight:2, bgOp:.3},
	}

	// sacamos los datos que existan dependiendo del tipo de poly, si es landuse usamos "residential" | "grass" | "farmland", etc.
	var llave = f.properties.landuse ?? f.properties.building ?? f.properties.leisure ?? 
				f.properties.amenity ?? f.properties.man_made;

	var myStyle = styles[llave] ?? {color:"gray", weight:2};

	// los asignamos basado en algunas condiciones
	style.color = myStyle.color;
	style.fillColor = myStyle.color;
	style.weight = myStyle.weight;
	style.dashArray = myStyle.dashes;

	if(myStyle.icon != undefined)
		style.fill = `url(polyicos/${ myStyle.icon })`;

	if(myStyle.bgOp != undefined)
		style.fillOpacity = myStyle.bgOp;

	return style;
}

// Solo para generar los labels porque leaflet no deja hacer eso 
function modifFeatures(f,l) {
	if(f.properties.name != undefined && f.geometry.type == "Polygon" && f.properties.building != undefined) {
		l.bindPopup(f.properties.name, {permanent: true, direction:"center"});

		L.marker(l.getBounds().getCenter(), {
			icon: L.divIcon({
				iconSize:[0,0], html: `<p>${f.properties.name}</p>`
			})
		}).addTo(labelsLayer);
	}

	// tenemos que agregar los iconos manualmente porque leaflet me odia
	else if(f.geometry.type == "Point") {
		console.log(formatoPuntos(f));
		console.log(f.geometry.type, f.properties);
		l.options.icon = formatoPuntos(f);
		l.options.title = f.properties.name;

		if(f.properties.name != undefined)
			l.bindPopup(f.properties.name);
	}
}

var labelsLayer = L.layerGroup();

async function crearMapa() {
	// Obtenemos el GeoJSON como archivo de texto desde la misma pagina github
	// (para no tener que cambiar todo cada vez que actualizamos algo)
	var response = await fetch("mapa.json");
	var mapaDat = await response.text();

	var pJson = JSON.parse(mapaDat); // cargamos el JSON como un objeto

	// agregamos cada elemento
	for(var feature of pJson.features) {
		L.geoJson(feature, {style: formatoMapa, onEachFeature:modifFeatures}).addTo(map);
	}
}

crearMapa();

/// Marcador Central
var markIcon = L.icon({
	iconUrl:"imagenes/marker.png",
	iconSize: [20,32],
	iconAnchor: [10,32]
})

labelsLayer.addTo(map);

// L.marker([9.86568, -83.891875], {
// 	icon: markIcon,
// 	title: "Condominio Florencia", 
// 	alt: "Condominio Florencia",
// 	draggable: false,
// }).addTo(map);


map.on("zoomend", ()=>{
	console.log(map.getZoom());

	if(map.getZoom() < 19) map.removeLayer(labelsLayer);
	else labelsLayer.addTo(map);
})