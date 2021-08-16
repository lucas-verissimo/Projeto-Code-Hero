const timeStamp = Math.floor(Date.now() / 1000);
const privatekey = 'c62a451dab4c4534c8a8ca9feb3cc0a53b42f7f2';
const publicKey = '144300013a53cdff6ed77f0af4be6661';
const md5Key = md5(timeStamp + privatekey + publicKey);
var last_button = 0

// Captura qual botão foi clicado e acrescenta o nº do botão na url
document.getElementById("category").addEventListener('click', (e) => {
    if (! isNaN(e.target.textContent)) location.href = location.origin + location.pathname + '#' + e.target.textContent;
});

// Toda vez que a url mudar, a página será renderizada
window.addEventListener('popstate', () => {
    renderOnPageLoadOrURLChange();
})

/* Quando a página recarregar, se tiver sem hash renderiza a página 1,
   se tiver com hash renderiza a página do hash*/
window.onload = () => {
    if (location.hash.substr(1) === ''){
        location.href = location.origin + location.pathname + '#' + '1'
    } else {
        renderOnPageLoadOrURLChange();
    }
}

// Renderiza a página
function renderOnPageLoadOrURLChange() {
    document.getElementById('RendererPage').innerHTML = null; // Limpa a div
    var currentPath = location.hash.substr(1); // Busca o Hash da página
//  Se a currentPath não for numérica é porque está na página "DETALHES"
    if (isNaN(currentPath)) {
        document.querySelector('body').style.backgroundColor = '#E5E5E5'
        let index = currentPath.indexOf('detalhes=')
        renderDetalhes(currentPath.substr(9 + index))
    } else {
        renderHome(timeStamp, publicKey, md5Key, Number(currentPath))
    }
}

// Muda os botões de numeração das páginas
function changeButton(currentPath, numPages) {
    /* Lógica:
    Se:
        * Número da página atual for menor que 3
    Então:
        Botão azul = página atual. Botões numerados de 1 a 5.
    Senão se:
        * Número de páginas que faltam para o último personagem (numPages) for igual a 2
    Então:
        Página atual (currentPath) e botão azul será o 4º botão
    Senão se:
        * Número de páginas que faltam para o último personagem (numPages) for igual a 1
    Então:
        Página atual (currentPath) e botão azul será o 5º botão
    Senão:
        Botão azul e página atual sempre será a do meio (botão 3)
    */

//    var numPages = Math.ceil(num_heros / 4) //Nº de páginas que faltam até o último personagem (limite de 5) 

    if (currentPath <= 3){
        for (var i = 1; i < 6; i++) {
            var button = document.getElementById(i)
            button.style.display = 'list-item' // Caso o display tenha sido mudado para "none"
            button.innerText = i
            button.style.backgroundColor = '#fffafa'
            button.style.color = '#000000'
        }
        document.getElementById(currentPath).style.backgroundColor = '#167ABC'
        document.getElementById(currentPath).style.color = '#ffffff'
    }else if (numPages == 2){
        for (var i = 1; i < 6; i++) {
            var button = document.getElementById(i)
            button.style.display = 'list-item' // Caso o display tenha sido mudado para "none"
            if(currentPath - (4 - i) > 0) {
                button.innerText = `${currentPath - (4 - i)}`
            } else {
                button.style.display = 'none'
            }
            button.style.backgroundColor = '#fffafa'
            button.style.color = '#000000'
        }
        document.getElementById('4').style.backgroundColor = '#167ABC'
        document.getElementById('4').style.color = '#ffffff'
    } else if (numPages == 1){
        for (var i = 1; i < 6; i++) {
            var button = document.getElementById(i)
            button.style.display = 'list-item' // Caso o display tenha sido mudado para "none"
            if(currentPath - (5 - i) > 0) {
                button.innerText = `${currentPath - (5 - i)}`
            } else {
                button.style.display = 'none'
            }
            button.style.backgroundColor = '#fffafa'
            button.style.color = '#000000'
        }
        document.getElementById('5').style.backgroundColor = '#167ABC'
        document.getElementById('5').style.color = '#ffffff'
    }else {
        for (var i = 1; i < 6; i++) {
            var button = document.getElementById(i)
            button.style.display = 'list-item' // Caso o display tenha sido mudado para "none"
            button.innerText = `${currentPath - (3 - i)}`
            button.style.backgroundColor = '#fffafa'
            button.style.color = '#000000'
        }
        document.getElementById('3').style.backgroundColor = '#167ABC'
        document.getElementById('3').style.color = '#ffffff'
    }

    /*Se a pesquisa retornar menos de 20 personagens, a página carregará só o
      número de botões necessários */
    if (currentPath + (numPages - 1) < 5){
        for (var i = 1; i < 6; i++) {
            var button = document.getElementById(i)
            if (i > numPages && Number(button.textContent) > currentPath){
                button.style.display = 'none'
            }
        }
    }
}

//Renderiza a página principal
function renderHome(timeStamp, publicKey, md5Key, num) {
    var offset = (num - 1) * 4; // Deslocamento API
    var search = (document.getElementById('txtSearch').value).replace(' ', '_'); //Caixa de pesquisa página principal
    var url = ''
    if (search == ''){
        url = `https://gateway.marvel.com/v1/public/characters?ts=${timeStamp}&limit=4&offset=${offset}&apikey=${publicKey}&hash=${md5Key}`;
    } else {
        url = `https://gateway.marvel.com/v1/public/characters?ts=${timeStamp}&nameStartsWith=${search}&limit=4&offset=${offset}&apikey=${publicKey}&hash=${md5Key}`;
    }

    fetch(url).then((response) => {
        return response.json();
    }).then((jsonParsed) => {
        last_button = Math.ceil(jsonParsed.data.total / 4) //Salva em qual página está o último personagem
        changeButton(num, (last_button - num + 1));
        jsonParsed.data.results.forEach(element => {
            var n_img = document.createElement('img');
            var n_p_description_Pers = document.createElement('p');
            var n_divPers = document.createElement('div');
            var n_divSeries = document.createElement('div');
            var n_divEventos = document.createElement('div');
            var n_divHerois = document.createElement('div');

            n_img.src = `${element.thumbnail.path}.${element.thumbnail.extension}`;
            n_p_description_Pers.innerText = element.name;
            n_divPers.id = 'hero-name'
            n_divPers.className = 'hero-data'
            n_divSeries.className = 'hero-data'
            n_divEventos.className = 'hero-data'
            n_divHerois.className = 'herois'
            n_divHerois.id = element.id
            n_divHerois.addEventListener("click", function(){
                location.href += `detalhes=${element.id}`; // Quando clicar em um personagem muda a url
            });
            n_divPers.appendChild(n_img);
            n_divPers.appendChild(n_p_description_Pers);

            //Se o personagem não tiver series escrever "SEM SERIES" em vez de deixar em branco
            if (element.series.items.length == 0) {
                var n_p_description_Series = document.createElement('p');
                n_p_description_Series.innerText = '"Sem Series"'
                n_divSeries.appendChild(n_p_description_Series);
            }else{
                for (var i = 0; i < (element.series.items.length); i++) {
                    if(i < 3) {
                        var n_p_description_Series = document.createElement('p');
                        n_p_description_Series.innerText = element.series.items[i].name
                        n_divSeries.appendChild(n_p_description_Series);
                    }
                }
            }

            //Se o personagem não tiver eventos escrever "SEM EVENTOS" em vez de deixar em branco
            if (element.events.items.length == 0) {
                var n_p_description_Eventos = document.createElement('p');
                n_p_description_Eventos.innerText = '"Sem Eventos"'
                n_divEventos.appendChild(n_p_description_Eventos);
            }else{
                for (var i = 0; i < (element.events.items.length); i++) {
                    if(i < 3) {
                        var n_p_description_Eventos = document.createElement('p');
                        n_p_description_Eventos.innerText = element.events.items[i].name
                        n_divEventos.appendChild(n_p_description_Eventos);
                    }
                }
            }
            
            n_divHerois.appendChild(n_divPers);
            n_divHerois.appendChild(n_divSeries);
            n_divHerois.appendChild(n_divEventos);

            document.querySelector(`#RendererPage`).appendChild(n_divHerois)
        });
    }
)}

//Renderiza a página detalhes
function renderDetalhes(id) {
    //Atualiza o cabeçalho (nome e imagem do personagem)
    fetch(`https://gateway.marvel.com:443/v1/public/characters/${id}?ts=${timeStamp}&apikey=${publicKey}&hash=${md5Key}`).then((response) => {
        return response.json();
    }).then((jsonParsed) => {
        jsonParsed.data.results.forEach(element => {
            document.querySelector('#name-hero-detalhes').innerText = element.name
            document.querySelector('#img-hero-detalhes').src = `${element.thumbnail.path}.${element.thumbnail.extension}`
        })
    });

    //Atualiza as séries do personagem
    var series_detalhes = document.querySelector('#series-detalhes')
    series_detalhes.innerHTML = '<p class="titulos-detalhes">SÉRIES</p>'
    fetch(`https://gateway.marvel.com/v1/public/characters/${id}/series?ts=${timeStamp}&apikey=${publicKey}&hash=${md5Key}`).then((response) => {
        return response.json();
    }).then((jsonParsed) => {
        jsonParsed.data.results.forEach(element => {
            var n_h3 = document.createElement('h3')
            var n_p_description = document.createElement('p')
            var n_p_creators = document.createElement('p')
            var n_div = document.createElement('div')

            n_h3.className = 'title-series'
            n_h3.innerText = element.title
            n_p_description.className = 'description-serie'
            n_p_description.innerText = (element.description) ? element.description : 'Sem descrição.'
            n_p_creators.className = 'creators-serie'
            n_p_creators.innerText = 'Creators: '
            n_div.className = 'div-serie'

            element.creators.items.forEach(creator => {
                n_p_creators.innerText += creator.name
                n_p_creators.innerText += ', '
            });

            n_p_creators.innerText = n_p_creators.textContent.slice(0, -2);

            n_div.appendChild(n_h3)
            n_div.appendChild(n_p_description)
            n_div.appendChild(n_p_creators)

            series_detalhes.appendChild(n_div)
        });
    });

    //Atualiza os eventos do personagem
    var events_detalhes = document.querySelector('#eventos-detalhes')
    events_detalhes.innerHTML = '<p class="titulos-detalhes">EVENTOS</p>'
    fetch(`https://gateway.marvel.com/v1/public/characters/${id}/events?ts=${timeStamp}&apikey=${publicKey}&hash=${md5Key}`).then((response) => {
        return response.json();
    }).then((jsonParsed) => {
        jsonParsed.data.results.forEach(element => {
            var n_h3 = document.createElement('h3')
            var n_p = document.createElement('p')
            var n_div = document.createElement('div')

            
            n_h3.className = 'title-events'
            n_p.className = 'description-events'
            n_div.className = 'div-events'

            n_h3.innerText = element.title
            n_p.innerText = element.description

            n_div.appendChild(n_h3)
            n_div.appendChild(n_p)

            events_detalhes.appendChild(n_div)
        });
    });
    document.querySelector('#home').style.display = 'none'
    document.querySelector('#detalhes').style.display = 'block';
};