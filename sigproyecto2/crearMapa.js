/// crearmapa.js
// Define el codigo para cargar los archivos con leaflet, y formatearlos para que ya queden asi bien bonitos

async function cargarMapa(mapa, archivo) {
	// Obtenemos el GeoJSON como archivo de texto desde la misma pagina github
	// (para no tener que cambiar todo cada vez que actualizamos algo)
	let response = await fetch(archivo);
	let mapaDat = await response.text();

	let pJson = JSON.parse(mapaDat); // cargamos el JSON como un objeto

	// agregamos cada elemento
	for(let feature of pJson.features) {
		L.geoJson(feature, {style: formatoMapa, onEachFeature:modifFeatures}).addTo(mapa);
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
		"SAN JOSE": {color: "#AFD2E9", weight: 1, bgOp: 0},
		"ALAJUELA": {color: "#FCD0A1", weight: 1, bgOp: 0},
		"HEREDIA": {color: "#FF817B", weight: 1, bgOp: 0},
		"LIMON": {color: "#AAC995", weight: 1, bgOp: 0},
		"GUANACASTE": {color: "#74B09E", weight: 1, bgOp: 0},
		"PUNTARENAS": {color: "#FEAF91", weight: 1, bgOp: 0},
		"CARTAGO": {color: "#A690A4", weight: 1, bgOp: 0},
	}
	
	let style = {weight:2};
	let llave = f.properties.PROVINCIA ?? f.properties.NPROVINCIA;

	let myStyle = styles[llave] ?? {color:"gray", weight:2, bgOp: 0}; // los sacamos y sino default

	// los asignamos ya al style propio
	style.color = myStyle.color;
	style.fillColor = myStyle.color;
	style.weight = myStyle.weight;
	style.dashArray = myStyle.dashes;

	if(myStyle.bgOp != undefined)
		style.fillOpacity = myStyle.bgOp;

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

		if(f.properties.NOMBRE != undefined || f.properties.NOMBRE_REC != undefined) {
			var nom = f.properties.NOMBRE != undefined? f.properties.NOMBRE : f.properties.NOMBRE_REC;
			var suffix = ""

			if(f.properties.valor_fallamiento != null) {
				var magnitud = f.properties.valor_fallamiento;
				var clasificacion = "moderado";
				if(magnitud >= 4) clasificacion = "fuerte";
				if(magnitud >= 5) clasificacion = "peligroso";

				suffix = `<br> <b style="color: color-mix(in srgb, yellow, red ${(magnitud-3.5) * 100 + 10}%); background: white;">MAGNITUD: ${magnitud.toFixed(1)} (${clasificacion})<b>`
			}

			l.bindPopup(`${nom} ${suffix}`, {offset:[0,-32]});

			l.on("mouseover", function(){this.openPopup()});
			l.on("mouseout", function(){this.closePopup()});
		}

		// if(!settings.markers) {
		// 	l.options.opacity = 0;
		// }
	}
}

const pixelIcoSize = 25;
var pixelIcono = L.Icon.extend({options:{
	iconSize:[pixelIcoSize,pixelIcoSize], 
	iconAnchor:[pixelIcoSize/2,pixelIcoSize],
}})

// Llamada para cada punto en el mapa, busca su icono correspondiente 
// (si no existe default a dog_park porque se ve chistoso)
function iconoPuntos(f) {
	const markIconos = {
		// agua
		escuela: new pixelIcono({iconUrl:"markers/escuelas.png"}),
		gasolinera: new pixelIcono({iconUrl:"markers/gasolineras.png"}),
	};

	let style = {};
	// sacamos los datos que existan dependiendo del tipo de punto
	let llave = (f.properties.NOMBRE != undefined? "escuela" : null) ??
				(f.properties.NOMBRE_REC != undefined? "gasolinera" : null);

	style.icon = markIconos[llave];
	return style.icon ?? markIconos.default;
}