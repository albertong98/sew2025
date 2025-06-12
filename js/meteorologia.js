class Meteorologia{
    
    constructor(){
        this.apiKey = "f27e388816e3e7ace91eb06f36818262";
        this.lat = '43.33472002664907';
        this.lon = '-4.969117002856396';
    }

    getCurrentWeather(){
        const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
        $.ajax({
            url: apiUrl,
            data:{
                "lat": this.lat,
                "lon": this.lon,
                "appid": this.apiKey,
                "units" : "metric",
                "lang" : "es",
                "mode" : "xml"
            },
            cache: false,
            type:"GET",
            dataType: "xml",
            success:function(res) {
                var temperatura = $(res).find('temperature').attr('value') + ' ' + $(res).find('temperature').attr('unit');
                var feelslike = $(res).find('feels_like').attr('value') + ' ' + $(res).find('feels_like').attr('unit');
                var humedad = $(res).find('feels_like').attr('value');
                var icon = $(res).find('weather').attr('icon');
                var iconurl = "http://openweathermap.org/img/w/" + icon + ".png";
                var alt = $(res).find('weather').attr('value');

                this.writeCurrent(temperatura,feelslike,humedad,iconurl,alt);
            }.bind(this)
        });
    }

    writeCurrent(temperatura,feelslike,humedad,iconurl,alt){
        var section = document.createElement('section');
        
        var h3 = document.createElement('h3');
        
        h3.textContent = 'Tiempo actual en Onís';
        $(section).append(h3);

        $(section).append(`<p><img src="${iconurl}" alt="${alt}"></p>`);
        $(section).append(`<p>Temperatura: ${temperatura}</p>`);
        $(section).append(`<p>Sensacion térmica: ${feelslike}</p>`);
        $(section).append(`<p>Humedad: ${humedad}</p>`);
        $('h2').after(section);
    }

    getWeatherReport7Days(){
    
        var URL = `https://api.openweathermap.org/data/3.0/onecall?lat=${this.lat}&lon=${this.lon}&exclude=current,hourly,minutely&units=metric&appid=${this.apiKey}`;
        $.ajax({
            dataType: 'json',
            url: URL,
            method: 'GET',
            success: function(datos) {
                var list = datos.daily;
                var i = 0;
                list.forEach(day => {
                    if(i<7){
                        var section = document.createElement('section');
                        var fecha = new Date(day.dt * 1000);
                        var temperaturaMax = day.temp.max;
                        var temperaturaMin = day.temp.min;
                        var humedad = day.humidity;
                        var icon = day.weather[0].icon;
                        var iconurl = "http://openweathermap.org/img/w/" + icon + ".png";
                        var alt = day.weather[0].description;

                        var html = `<h3>${fecha.toLocaleDateString('es-ES')}</h3><p><img src="${iconurl}" alt="${alt}"></p><p>Temperatura máxima: ${temperaturaMax} °C</p><p>Temperatura mínima: ${temperaturaMin} °C</p><p>Humedad: ${humedad}</p>`
                        $(section).append(html);
                        $('main').last().append(section);
                        i++
                    }
                });
            }
        });
    }
}

var meteorologia = new Meteorologia();
meteorologia.getCurrentWeather();
meteorologia.getWeatherReport7Days();