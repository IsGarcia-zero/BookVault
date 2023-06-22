function loadData(query = '') {
    fetch('/getData?searchQuery=' + encodeURIComponent(query)).then((res) => {
        return res.json();
    }).then((responseData) => {
        let html = '<ul class="list-group" />';
        if (responseData.length > 0 && document.getElementById('autocomplete_search').value != '') {
            for (let count = 0; count < responseData.length; count++) {
                let regular_expression = new RegExp('(' + query + ')', 'gi');
                html += '<a href=lector?file='+responseData[count].pdf_url+' class="list-group-item list-group-item-action" onclick="get_text(this)">' + responseData[count].titulo.replace(regular_expression, '<span class="text-primary fw-bold">$1</span>') + '</a>';
            }
        } else {
            html += '<a href="#" class="list-group-item list-group-item-action disabled">No hay resultados ...</a>';
        }
        html += '</ul>';
        document.getElementById('search_result').innerHTML = html;
    });
}

const searchElement = document.getElementById('autocomplete_search');
searchElement.onkeyup = () => {
    let query = searchElement.value;
    loadData(query);
}

searchElement.onfocus = () => {
    let query = searchElement.value;
    loadData(query);
}

function get_text(element) {
    let titulo = element.textContent;
    console.log(titulo);
    document.getElementById('autocomplete_search').value = titulo;
    document.getElementById('search_result').innerHTML = '';
}