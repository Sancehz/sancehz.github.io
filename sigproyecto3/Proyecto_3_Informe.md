
---
# Proyecto 3
## Mapas de Mosaico Web: Canton de Liberia
---
##

#### Krissia Nicole Bejarano Trigueros
#### Sebastián Sánchez Delgado

##

#### Instituto Tecnológico de Costa Rica
#### Escuela de Computación
#### IC8058-Sistemas de Información Geográfica

##

#### Mtr. Armando Arce Orozco
#### 27 de octubre del 2024

##
---
##

## Tabla de Contenidos:
1. **[Introduccion](#introduccion)**
1. **[Metodologia](#metodologia)**
	1. **[Creacion de mapas](#creacion-de-mapas)**
	1. **[Publicacion de Resultados](#publicacion-de-resultados)**
	1. **[Conversion de MBTiles](#conversion-de-mbtiles)**
1. **[Conclusion](#conclusion)**
1. **[Referencias](#referencias)**
1. **[Anexos](#anexos)**

##
---
##

## Introduccion
Para este proyecto se generaron mapas de mosaico enfocados en el canton de Liberia. Todos estos mapas se basaron en los archivos proporcionados
por el profesor junto con datos geometricos adicionales de OpenStreetMap, lo que permitió la creación exitosa del mapa con los siguientes elementos:
- Imagen base utilizando calculos de pendiente norte-sur
- Elementos poligonales correspondientes a la forma del canton
- Elementos lineales correspondientes a los rios y carreteras
- Elementos puntuales representando hospitales, clinicas, hoteles y bancos

Estos mapas fueron generados utilizando GRASS GIS, junto con TileMill. Asimismo, los archivos de mosaico han sido publicados a GitHub bajo la estructura de carpetas TMS y usando la libreria Leaflet para desplegarlo interactivamente.

La aplicacion web para acceder a los mapas de mosaico de manera interactiva se puede encontrar en **[sanechz.github.io/sigproyecto3](https://sancehz.github.io/sigproyecto3/)**.  

Asimismo, puede acceder el codigo fuente bajo el repositorio de github **[github.com/Sancehz/sancehz.github.io/tree/main/sigproyecto3](https://github.com/Sancehz/sancehz.github.io/tree/main/sigproyecto3)**.

##
---
##

## Metodologia
Este proyecto fue realizado en tres etapas principales por medio de las herramientas de GrassGIS, MButil, TileMill y Github Pages, con el objetivo de convertir los datos vectoriales y raster a un formato adecuado para su uso por medio de TileMill. 
Todos los datos fueron tomados de los archivos proporcionados por el Tec Digital junto con las capas de acceso libre de OpenStreetMap.

### Creacion de Mapas
Todas las capas vectoriales y raster de datos fueron reproyectadas utilizando los metodos descritos en los proyectos 1 y 2 con el proposito de exportarlas como ShapeFile y GeoTIFF respectivamente para su importacion en TileMill, los detalles de estas operaciones pueden ser vistos en el archivo de texto adjunto a este documento.

Al ser importados estos datos a TileMill, se aplico una serie de estilos de CartoCSS para generar visuales claras para el usuario. Los archivos documentados de CartoCSS pueden ser vistos como adjuntos.

Seguidamente, se rasteriza el area de Liberia utilizando los niveles de zoom de 10 a 15 y se guarda como MBTiles.

En el desarrollo del mapa en TileMill, se emplean diferentes niveles de zoom para facilitar la visualización de los elementos y evitar la superposición o confusión entre ellos. Cada nivel de zoom permite observar un conjunto específico de datos, detallados según su relevancia y complejidad visual:

Nivel 10: En este nivel, se muestran únicamente los nombres de los cantones, evitando cualquier elemento de línea o polígono. Esto proporciona una visión general clara del territorio y su división administrativa principal.

Nivel 11: A medida que se acerca el zoom, se revelan los nombres de los distritos, permitiendo una mayor precisión en la identificación de las áreas geográficas dentro de los cantones.

Nivel 12: En este nivel se introducen los elementos lineales y poligonales clave, como carreteras principales, ríos y áreas destacadas del territorio. Esto ofrece una primera aproximación a la infraestructura y características naturales del lugar.

Nivel 13: Además de los elementos visibles en el nivel anterior, se incluyen los nombres de las carreteras y los ríos. Sin embargo, algunos de estos elementos carecen de denominación en la base de datos, por lo que se indica su estado como "sin nombre", lo cual también resalta las áreas que podrían requerir mayor información cartográfica.

Niveles 14 y 15: En los niveles más detallados, se añaden íconos y etiquetas correspondientes a puntos de interés importantes, como escuelas, hospitales, clínicas, gasolineras y otros lugares relevantes para los usuarios. Este nivel de detalle permite identificar fácilmente servicios esenciales y otros sitios de interés local, facilitando su ubicación en el mapa.

Esta estructura jerárquica asegura que la visualización sea clara y progresiva, adaptándose a las necesidades del usuario en cada nivel de acercamiento. También permite que el mapa sea funcional tanto para quienes requieren una visión general como para aquellos que buscan detalles específicos.

Podemos ver de forma mas detallada los como se ajustaron los elementos, colores, fuentes y demas aspectos en el archivo style.txt adjunto. 

### Conversion de MBTiles
Para propositos de conversion a un formato facil de utilizar y servir al usuario de manera estatica desde Github Pages, convertimos este MBTiles a una estructura de carpetas e imagenes PNG utilizando la opcion por defecto de TMS del programa MButil, el comando exacto para convertir el archivo es el siguiente:
    `python3 mbutil.py P3.mbtiles ./P3_tiles`

Esto nos genera una estructura de carpetas que fue subida a Github Pages.

### Publicacion de Resultados
La publicacion de estos resultados fue realizada por medio de una simple aplicacion web que utiliza Leaflet y su funcionalidad `L.tileLayer` para pedir los tiles necesarios para el usuario:

	var tilesLiberia = L.tileLayer('https://sancehz.github.io/sigproyecto3/tiles/{z}/{x}/{y}.png', {
		minZoom: 9,
		maxZoom: 15,
		errorTileUrl: "./imagenes/notile.png",
		tms: true,
	});


##
---
##

## Conclusion
Se logró de manera satisfactoria la creación del proyecto de mapas mosaicos, donde se exportaron y publicaron cinco niveles de zoom. Los resultados se publicaron utilizando herramientas como GitHub Pages, lo que permite visualizar de forma interactiva los datos generados. Este proceso consolidó el uso de herramientas avanzadas como GRASS GIS y TileMill, cada una desempeñando un rol fundamental en las distintas etapas del desarrollo.

En GRASS GIS, se llevó a cabo la preparación de los datos base. Este proceso incluyó:

La generación de las imágenes base, necesarias para el diseño del mapa.
Las reproyecciones de rasters y vectores, asegurando que se ajustaran al sistema de coordenadas requerido.
La segmentación de los elementos geográficos para limitar los datos al cantón de Liberia, optimizando así la carga de información para el área de interés.
Posteriormente, en TileMill, se cargaron y organizaron las capas con base en los archivos GeoTIFF y shapefiles de polígonos, puntos y líneas de Costa Rica. Estas capas representaban diversos elementos, como áreas, carreteras, ríos y puntos de interés. Para garantizar una visualización clara y eficiente, se realizaron ajustes en el diseño y estilo de las capas según el nivel de zoom.

Cada nivel de zoom fue diseñado para mostrar información específica:

En los niveles más bajos, se priorizaron divisiones administrativas y elementos principales.
En niveles intermedios, se añadieron infraestructuras como carreteras y ríos.
En niveles más altos, se detallaron puntos de interés y etiquetas.
Sin embargo, debido a la gran cantidad de archivos generados, no fue posible completar la carga del nivel 15. A pesar de esta limitación, los niveles exportados y publicados ofrecen un mapa funcional y detallado que satisface los objetivos del proyecto.

Este proceso no solo permitió desarrollar un mapa interactivo útil, sino que también demostró la capacidad de integrar herramientas especializadas como GRASS GIS y TileMill con plataformas modernas de publicación como GitHub Pages. De esta forma, se logró un resultado accesible y visualmente claro, alineado con las necesidades del proyecto.


##
---
##

## Referencias
Agafonkin, V. (2010). *Leaflet: An open-source JavaScript library for interactive maps.* Leaflet.
 - https://leafletjs.com/reference.html

GRASS GIS Team. (2024). *GRASS GIS: Bringing advanced geospatial technologies to the world.*
 - https://grass.osgeo.org/

OpenStreetMap contributors. (2024). *Mapa del canton de Liberia, Costa Rica.* OpenStreetMap. 
 - https://www.openstreetmap.org/  

Tardie, J. (2017). *MButil: Importer and Exporter of MBTiles.* MButil.
 - https://github.com/mapbox/mbutil

TileMill Project. (2019). *TileMill is a modern map design studio.* TileMill.
 - https://tilemill-project.github.io/tilemill/
##
---
##

## Anexos

 > Vista del pais completo desde TileMill `zoom=8`
![Vista del pais completo desde TileMill](https://sancehz.github.io/sigproyecto3/imagenes/mapa_base_full.jpg)


 > Vista de Liberia desde TileMill en una de las areas mas pobladas `zoom=16`
![Vista del pais completo desde TileMill](https://sancehz.github.io/sigproyecto3/imagenes/mapa_zoom_16.jpg)


 > Vista de Liberia desde TileMill en una de las areas mas pobladas `zoom=18`
![Vista del pais completo desde TileMill](https://sancehz.github.io/sigproyecto3/imagenes/mapa_zoom_16_2.jpg)