function callNewsApi(location="") {
    if (location != "") {        
        var url = 'http://newsapi.org/v2/everything?' +
            'apiKey=cf0cba3704c24dda85bd20d224a7cc28&' +
            'language=en&' +
            'sortBy=publishedAt&' +
            'qintitle=coronavirus%26' + location;
    }
    else {
        var url = 'http://newsapi.org/v2/top-headlines?' +
            'apiKey=cf0cba3704c24dda85bd20d224a7cc28&' +
            'sortBy=popularity&' +
            'language=en&' +
            'q=covid-19&' +
            'qintitle=coronavirus';
    }
    
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    var req = new Request(url, requestOptions);

    fetch(req)
    .then(response => response.json())
    .then(result => createNewsCard(result.articles))
    .catch(error => console.log('error', error));
}

function createNewsCard(articles) {
    console.log("Number of Article: " + articles.length);
    for (var i = 0; i < articles.length; i++) {
        cardElement = document.getElementsByClassName('card')[0];

        // Clone card element
        clonedCard = cardElement.cloneNode(true);
        assignValuesToClonedCard(clonedCard, articles[i]);
        clonedCard.classList.remove("card-hidden");
        
        // get main cards grid element and append new card to main cards grid
        cardsGrid = document.getElementsByClassName('cards')[0];
        cardsGrid.appendChild(clonedCard);
    }
    
}

function assignValuesToClonedCard(card, article) {
    // set article url
    card.href = article.url;
    // set image of article
    card.getElementsByClassName('card-header')[0].style.backgroundImage = "url('" + article.urlToImage + "')";
    // set header of article
    clonedCard.getElementsByClassName('card-title')[0].firstElementChild.innerHTML = article.title;
    // set content summary of article
    if (article.content && article.content.slice(-6) == "chars]"){
        clonedCard.getElementsByClassName('card-summary')[0].innerHTML = article.content;
    }
    else {
        clonedCard.getElementsByClassName('card-summary')[0].innerHTML = article.description;
    }
    
    // set published data
    clonedCard.getElementsByClassName('card-meta')[0].innerHTML = "Published on : " + formatDate(article.publishedAt);

    // set source of article
    clonedCard.getElementsByClassName('card-source')[0].innerHTML = "Source : " + article.source.name;

}

function formatDate(strDate) {
    var monthNames = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");

    var today = new Date(strDate);
    var dd = today.getDate();
    var mmm = monthNames[today.getMonth()];
    var yyyy = today.getFullYear();

    return mmm + " " + dd + ", " + yyyy; 
}

function removeExistingArticleCards() {
    oldCards = document.getElementsByClassName('card');
    totalOldCards = oldCards.length;

    // while (document.getElementsByClassName('card'))
    for (var i = totalOldCards - 1; i >= 0; i--) {
        if (!oldCards[i].classList.contains("card-hidden")) {
            oldCards[i].parentNode.removeChild(oldCards[i]);
        }
    }
}

function createWorldMap() {
    var map = new Datamap({
        element: document.getElementById('map-container'),
        fills: {
            defaultFill: 'rgba(157, 187, 63, 0.85)' // Any hex, color name or rgb/rgba value
        },
        geographyConfig: {
            highlightFillColor: '#668700',
            highlightBorderColor: 'rgba(250, 15, 160, 0.2)',
            highlightBorderWidth: 2,
            highlightBorderOpacity: 1
        },
        done: function(datamap) {
            datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
                    alert(geography.properties.name);
                });
            }
        // scope: 'usa'
        // responsive: true
    });
}

function mainScript() {
    // create world map
    createWorldMap();

    // click event on map
    mapObj = document.getElementById('map-container');
    mapObj.addEventListener("click", get_news_according_to_location);

    removeExistingArticleCards();
    callNewsApi();
}

function fetch_location_name(){
    var name_tt = document.getElementsByClassName('datamaps-hoverover')[0];

    if (name_tt.style.display == "block"){
        var location = name_tt.getElementsByClassName('hoverinfo')[0].innerText.toLowerCase();
        console.log(location);
        return location
    }
    return "";
}

function get_news_according_to_location(){
    var location = fetch_location_name();
    if (location != "") {
        removeExistingArticleCards();
        callNewsApi(location);
    } 
}

document.addEventListener('DOMContentLoaded', mainScript);
