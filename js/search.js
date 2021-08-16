/* Depois de pressionar ENTER ou clicar na LUPA, captura o que foi digitado
   na pesquisa e renderiza a página home */
const txtSearch = document.getElementById('txtSearch');
txtSearch.addEventListener('keyup', function(e){
    var key = e.which || e.keyCode;
    if (key == 13) { 
        updateURL('1');
    };
});

function searchClick() {
    updateURL('1');
};

function updateURL(hash) {
    location.href = location.origin + location.pathname + '#' + `${hash}`
};

/* Na página "DETALHES" quando clicar no botão "FECHAR", retorna para o
   nº da página que estava no "HOME" */
function closeDetalhes(){
    document.querySelector('body').style.backgroundColor = '#EC1D24'
    let index = location.href.indexOf('detalhes=')
    location.href = location.href.substring(index, 0) // remove da url o campo "DETALHES" e deixa só o nº da página
    document.querySelector('#detalhes').style.display = 'none';
    document.querySelector('#home').style.display = 'block'
}