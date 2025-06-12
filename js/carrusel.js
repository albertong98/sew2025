"use strict";
class Carrusel{
    constructor(){
        this.dir = "multimedia/imagenes/";
        this.mapa = {
            "onis.jpg" : "Benia de Onís",
            "mapa-situacion.png" : "Mapa de situación del concejo de Onís",
            "hibeu.jpg" : "Pico Hibeu",
            "montana.jpg" : "Montaña en la que se encuentra el pico Hibeu",
            "carretera.jpg" : "Carretera del municipio de Onís"
        }
        this.imagenes = ["onis.jpg","mapa-situacion.png","hibeu.jpg","montana.jpg","carretera.jpg"];
        this.imagenActual = 1;
        this.cargarSiguiente();
    }

    cargarSiguiente(){
        var x = window.matchMedia("(min-width: 800px)");
        
        var img = document.querySelector('img');
        if(img == null) img = document.createElement('img');
        
        if(x.matches){
            img.setAttribute("src", this.dir + this.imagenes[this.imagenActual]);
        }else{
            img.setAttribute("src", this.dir + "50" +this.imagenes[this.imagenActual]);
        }
        img.setAttribute("title",this.mapa[this.imagenes[this.imagenActual]]);
        img.setAttribute("alt",this.mapa[this.imagenes[this.imagenActual]]);
        document.querySelector("main > picture").append(img);
        this.imagenActual = this.imagenActual === this.imagenes.length - 1 ? 0 : this.imagenActual+1
        
    }
}
var carrusel = new Carrusel();
window.setInterval(()=> {carrusel.cargarSiguiente();}, 5000);