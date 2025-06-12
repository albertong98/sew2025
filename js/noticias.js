class Noticias{
    constructor(){
        this.apikey = "838265e39a234a57b3978b05046bd8b2";
        this.maxNews = 5;
    }

    cargarNoticias(){
        var URL = 'https://api.worldnewsapi.com/search-news?text=onís&language=es&location-filter=43.33472002664907,-4.969117002856396,10&api-key='+this.apikey;
        $.ajax({
            dataType: 'json',
            url: URL,
            method: 'GET',
            
            success: function(datos){
                $('main').append('<section></section>');
                for(var i = 0 ; i < datos.news.length || i < maxNews; i++){
                    if(datos.news[i].summary){
                        var article = document.createElement('article');
                        $(article).append(`<h3><a href=${datos.news[i].url}>${datos.news[i].title}</a></h3>`);
                        $(article).append(`<p>${datos.news[i].summary}</>`);
                        $('section').append(article);
                    }
                }
            }
        });
    }
}

var noticias = new Noticias();
noticias.cargarNoticias();