"use strict"
class Juego{
    validar(){
        var respuestas = Array.from(document.querySelectorAll('input:checked'));
        var contador = 0;
        respuestas.forEach(respuesta => {
            var value = respuesta.getAttribute("value");
            contador = value === "true" ? contador + 1 : contador;
        });
        window.alert('Has conseguido '+contador+' de 10 puntos');
    }
}

var juego = new Juego();
const boton = document.querySelector('input[type="button"]');
boton.addEventListener('click',juego.validar);