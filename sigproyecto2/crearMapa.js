/// crearmapa.js
// Define el codigo para cargar los archivos con leaflet, y formatearlos para que ya queden asi bien bonitos

async function cargarMapa() {
	// Obtenemos el GeoJSON como archivo de texto desde la misma pagina github
	// (para no tener que cambiar todo cada vez que actualizamos algo)
	let response = await fetch("distritos.geo.json");
	let mapaDat = await response.text();

	let pJson = JSON.parse(mapaDat); // cargamos el JSON como un objeto

	// agregamos cada elemento
	for(let feature of pJson.features) {
		L.geoJson(feature, {style: formatoMapa, onEachFeature:modifFeatures}).addTo(map);
	}
}

// Se encarga de llamar a las otras funciones de formato idk
function formatoMapa(feature) {
	if(feature.geometry.type == "Point")
		return {}; // nos encargamos de esto despues porque LEAFLET ME ODIA
	if(feature.geometry.type == "LineString")
		return {color: "white", weight:10, opacity:1};
	if(feature.geometry.type == "Polygon")
		return formatoPolys(feature)
}

// Llamada para cada area en el mapa, se encarga del formateo de area 
// + linkearlo con la libreria de areas con textura
// (un desastre)
function formatoPolys(f) {
	const styles = {
		// {color:"gray", icon:"construction.png", weight:1, bgOp:.2, dashes:"20,20"},
		
		// provincia
		"SAN JOSE": {color: "#AFD2E9", weight: 2, bgOp: 0},
		"ALAJUELA": {color: "#FCD0A1", weight: 2, bgOp: 0},
		"HEREDIA": {color: "#FF817B", weight: 2, bgOp: 0},
		"LIMON": {color: "#AAC995", weight: 2, bgOp: 0},
		"GUANACASTE": {color: "#74B09E", weight: 2, bgOp: 0},
		"PUNTARENAS": {color: "#FEAF91", weight: 2, bgOp: 0},
		"CARTAGO": {color: "#A690A4", weight: 2, bgOp: 0},
	}
	
	let style = {weight:2};
	let llave = f.properties.PROVINCIA ?? f.properties.NPROVINCIA;

	let myStyle = styles[llave] ?? {color:"gray", weight:2, bgOp: 0}; // los sacamos y sino default

	// los asignamos ya al style propio
	style.color = myStyle.color;
	style.fillColor = myStyle.color;
	style.weight = myStyle.weight;
	style.dashArray = myStyle.dashes;

	if(myStyle.icon != undefined && settings.areaIconos)
		style.fill = `url(polyicos/${ myStyle.icon })`;

	// if(myStyle.bgOp != undefined)
	// 	style.fillOpacity = myStyle.bgOp;

	return style;
}

// Corre para cada feature DESPUES de que se agregaran al mapa
// Se encarga de:
//  - agregar los popup a los markers
//  
function modifFeatures(f,l) {
	// agregamos un marker extra para cada area tipo edificio, si tiene nombre
	if(f.properties.NCANTON != undefined && f.geometry.type == "Polygon") {
		// L.marker(l.getBounds().getCenter(), {
		// 	icon: L.divIcon({
		// 		iconSize:[0,0], html: `<p>${f.properties.NDISTRITO}</p>`
		// 	})
		// }).addTo(labelsLayer);
	}

	// tenemos que agregar los iconos manualmente para cada otro marker que ya existia porque leaflet me odia
	else if(f.geometry.type == "Point") {
		l.options.icon = iconoPuntos(f);
		l.options.title = f.properties.name;

		if(f.properties.name != undefined)
			l.bindPopup(f.properties.name, {offset:[0,-32]});
			l.on("mouseover", function(){this.openPopup()});
			l.on("mouseout", function(){this.closePopup()});

		if(!settings.markers) {
			l.options.opacity = 0;
		}
	}
}

const pixelIcoSize = 40;
var pixelIcono = L.Icon.extend({options:{
	iconSize:[pixelIcoSize,pixelIcoSize], 
	iconAnchor:[pixelIcoSize/2,pixelIcoSize],
}})

// Llamada para cada punto en el mapa, busca su icono correspondiente 
// (si no existe default a dog_park porque se ve chistoso)
function iconoPuntos(f) {
	const markIconos = {
		// agua
		storage_tank: new pixelIcono({iconUrl:"markers/water_tank.png"}),
		wastewater_plant: new pixelIcono({iconUrl:"markers/water_treatment.png"}),
		water_well: new pixelIcono({iconUrl:"markers/water_well.png"}),
	
		// postes de luz
		mast: L.icon({iconUrl:"markers/light.png", iconSize:[50,50], iconAnchor:[25,50]}),
	
		// edificios
		place_of_worship: new pixelIcono({iconUrl:"markers/church.png"}),
		park: new pixelIcono({iconUrl:"markers/park.png"}),
		dog_park: new pixelIcono({iconUrl:"markers/dog_park.png"}),
		pitch: new pixelIcono({iconUrl:"markers/leisure.png"}),

		// place
		neighbourhood: new pixelIcono({iconUrl:"markers/neighborhood.png"}),


		default: new pixelIcono({iconUrl:"markers/default.png"}),
	};

	let style = {};
	// sacamos los datos que existan dependiendo del tipo de punto
	let llave = f.properties.building ?? f.properties.leisure ?? 
				f.properties.amenity ?? f.properties.man_made ?? f.properties.place;

	style.icon = markIconos[llave];
	return style.icon ?? markIconos.default;
}