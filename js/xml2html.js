"use strict"
class XML2HTML{
    cargarDatos(){
        $.ajax({
            dataType: 'xml',
            url: 'xml/rutas.xml',
            method: 'GET',
            success: function(datos) {
                var rutas = $('ruta',datos);
                var xml2html = this;
                rutas.each(function(indice){
                    var nombre = $('> nombre',rutas[indice]).text();
                    var tipo = $('tipo',rutas[indice]).text();
                    var medio = $('medio',rutas[indice]).text();
                    var duracion = $('duracion',rutas[indice]).text() + " " + $('duracion',rutas[indice]).attr('unidades');
                    var agencia = $('agencia',rutas[indice]).text();
                    var descripcion = $('descripcion',rutas[indice]).text();
                    var personasAdecuadas = $('personasAdecuadas',rutas[indice]).text();
                    var inicio = $('inicio',rutas[indice]);
                    var fechaInicio = $('fecha',inicio).text();
                    var horaInicio = $('hora',inicio).text();
                    var lugarInicio = $('lugar',inicio).text();
                    var direccionInicio = $('direccion',inicio).text();
                   
                    var coordenadasInicio = $('coordenadas',inicio);
                    var latitudInicio = $('latitud',coordenadasInicio).text();
                    var longitudInicio = $('longitud',coordenadasInicio).text();
                    var altitudInicio = $('altitud',coordenadasInicio).text() + " " + $('altitud',coordenadasInicio).attr('unidades');

                    var recomendacion = $('recomendacion',rutas[indice]).text();
                    
                    var article = document.createElement('article');
                    
                    var h3ruta = document.createElement('h3');
                    h3ruta.innerText = nombre;
                    article.append(h3ruta);
                    
                    var section = document.createElement('section');
                    var h4 = document.createElement('h4');
                    h4.innerText = 'Información de la ruta';
                    section.append(h4);
                    
                    var stringDatos = "<p>Tipo: " + tipo+ "</p>";
                    stringDatos += "<p>Medio: " + medio+ "</p>";
                    stringDatos += "<p>Duración: " +duracion+ "</p>";
                    stringDatos += "<p>Agencia: " + agencia+ "</p>";
                    stringDatos += "<p>Recomendacion: " + recomendacion + "</p>";
                    stringDatos += "<p>Adecuado para: " + personasAdecuadas + "</p>\n";
                    stringDatos += "<p>" + descripcion + "</p>\n";
                    
                    stringDatos += "<p>Fecha y hora de inicio: " + fechaInicio + " a las " + horaInicio + "</p>\n";

                    stringDatos += "<ul title=\"Punto de inicio\">\n";
                    stringDatos += "<li><p>Lugar: " + lugarInicio + "</p></li>\n";
                    stringDatos += "<li><p>Dirección: " + direccionInicio + "</p></li>\n";
                    stringDatos += "<li><p>Coordenadas: "+latitudInicio+", "+longitudInicio+"</p></li>\n";
                    stringDatos += "<li><p>Altitud: " + altitudInicio + "</p></li>\n";
                    stringDatos += "</ul>\n";

                    stringDatos += "<ul title=\"Referencias\">\n";
                    
                    var referenciasElement = $('referencias',rutas[indice]);
                    var referencias = $('referencia',referenciasElement)
                    referencias.each(function(referencia){
                        var texto = referencias[referencia].textContent;
                        stringDatos += "<li><a href=\""+texto;
				        stringDatos += "\">" + texto;
				        stringDatos += "</a></li>\n";
                    });

                    stringDatos += "</ul>\n";
                    
                    $(section).append(stringDatos);
                   
                    $(article).append(section);
                    
                    var hitosElement = $('hitos',rutas[indice]);
                    var hitos = $('hito',hitosElement);

                    hitos.each(function(hito){
                        var nombreHito = $('nombre',hitos[hito]).text();
                        var descripcionHito = $('descripcion',hitos[hito]).text();

                        var coordenadasHito = $('coordenadas',hitos[hito]);
                        var latitudHito = $('latitud',coordenadasHito).text();
                        var longitudHito = $('longitud',coordenadasHito).text();
                        var altitudHito = $('altitud',coordenadasHito).text() + " " + $('altitud',coordenadasHito).attr('unidades');
                        
                        var sectionHito = document.createElement('section');
                        var stringDatosHito = "<h5>"+ nombreHito +"</h5>\n";
                        stringDatosHito += "<p>" + descripcionHito + "</p>\n";
                        if(typeof (distancia) != 'undefined' && distancia.length > 0)
                            stringDatosHito += "<p>Distancia desde el hito anterior: "+distancia+"</p>\n";
                        stringDatosHito += "<ul title=\"Ubicación\">\n";
                        stringDatosHito += "<li><p>Coordenadas: "+latitudHito+", "+longitudHito+"</p></li>\n";
                        stringDatosHito += "<li><p>Altitud: " + altitudHito + "</p></li>\n";
                        stringDatosHito += "</ul>\n";

                        var fotosElement = $('fotos',hitos[hito]);
                        var fotos = $('foto',fotosElement);
                        fotos.each(function(foto){
                            var urlFoto = "multimedia/imagenes/"+fotos[foto].textContent;
                            var titulo = fotos[foto].getAttribute('titulo');
                            stringDatosHito += "<img src=\""+urlFoto;
                            stringDatosHito += "\" title = \""+titulo;
                            stringDatosHito += "\" alt = \""+titulo+"\"/>\n";
                        });

                        var videosElement = $('videos',hitos[hito]);
                        if(typeof(videosElement) != 'undefined' && videosElement.length > 0){
                            var videos = $('video',videosElement);
                            videos.each(function(video){
                                var urlVideo = "multimedia/videos/"+videos[video].textContent;
                                var type = videos[video].getAttribute('type');
                                stringDatosHito += "<video controls preload=\"auto\"><source src=\"" + urlVideo + "\" type=\""+type+"\">Video no soportado por el navegador</video>\n";
                             });
                        }
                        $(sectionHito).append(stringDatosHito);
                        $(article).append(sectionHito);
                    })
                    xml2html.insertKML('xml/kml/'+$(rutas[indice]).attr('id')+'.kml',article,Number(latitudInicio),Number(longitudInicio));
                    xml2html.insertSVG('xml/svg/'+$(rutas[indice]).attr('id')+'.svg',article);
                    $('main').append(article);
                });
            }.bind(this)
        });
    }

    insertKML(file,article,lat,lon) {
        var section = document.createElement('section');
        $(section).append('<h4>Planimetría de la ruta</h4>');
        var div = document.createElement('div');
        section.append(div);
        $(article).append(section);
        //var projection = ol.proj.get('EPSG:3857');

        var raster = new ol.layer.Tile({
            source: ol.source.OSM()
            //source: new ol.source.BingMaps({
            //imagerySet: 'Aerial',
            //key: 'Your Bing Maps Key from http://www.bingmapsportal.com/ here'
            //})
        });

        var vector = new ol.layer.Vector({
            source: new ol.source.Vector({
                url: file,
                format: new ol.format.KML()
            })
        });

        var map = new ol.Map({
            layers: [raster, vector],
            target: div,
            view: new ol.View({
            center: ol.proj.fromLonLat([lon, lat]),
            //projection: projection,
            zoom: 11
            })
        });
    }

//insertKMLGoogle(src,article,lat, long)
    insertKMLGoogle(src,article,lat, long) {
        var section = document.createElement('section');
        $(section).append('<h4>Planimetría de la ruta</h4>');
        var div = document.createElement('div');
        section.append(div);

        var map = new google.maps.Map(document.querySelector('div'), {
          center: new google.maps.LatLng(-19.257753, 146.823688),
          zoom: 2,
          mapTypeId: 'terrain'
        });

        /*var kmlLayer = new google.maps.KmlLayer(src, {
          suppressInfoWindows: true,
          preserveViewport: false,
          map: map
        });*/
        
        console.log(section);
        $(article).append(section);
    }

    insertSVG(file, article) {
        var section = document.createElement('section');
        var svgImg = document.createElement('img');
        svgImg.setAttribute("src",file);
        $(section).append(`<h4>Altimetria de la ruta</h4>`);
        section.append(svgImg);
        $(article).append(section);
    }
}

var lector = new XML2HTML();

lector.cargarDatos();