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

    for (var i = totalOldCards - 1; i >= 0; i--) {
        if (!oldCards[i].classList.contains("card-hidden")) {
            oldCards[i].parentNode.removeChild(oldCards[i]);
        }
    }
}

function countryClicked(country_element) {
    data = country_element.__data__;
    var location = data.properties.name;
    console.log(location);
    
    removeExistingArticleCards();
    callNewsApi(location);
}

function getWorldometerData() {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    
    var url = "http://51.15.213.116:8000/stats";
    var req = new Request(url, requestOptions);

    fetch(req)
    .then(response => response.json())
    .then(result => createWorldMap(result.country_data))
    .catch(error => console.log('error', error));
}

function createWorldMap(worldometer_data) {
    console.log("in" + worldometer_data);

    var map = new Datamap({
        element: document.getElementById('map-container'),
        // responsive: true,
        fills: {
            defaultFill: 'rgba(157, 187, 63, 0.85)' // Any hex, color name or rgb/rgba value
        },
        geographyConfig: {
            highlightFillColor: '#668700',
            highlightBorderColor: 'rgba(250, 15, 160, 0.2)',
            highlightBorderWidth: 2,
            highlightBorderOpacity: 1,
            popupTemplate: function(geography, data) {
                if (data == null){
                    return '<div class="hoverinfo"><strong>' + geography.properties.name + '</strong></div>';
                }
                return '<div class="hoverinfo"><strong>' + geography.properties.name + '</strong><br/><div class="color-box total-cases"></div><span>' + data.total_cases + '</span><br/><div class="color-box total-deaths"></div><span>' + data.total_deaths + '</spna><br/><div class="color-box total-recovered"></div><span>' + data.total_recovered + '</span><br/><div class="color-box recovery-percentage"></div><span>' + data.recovery_percentage + '%</span></div>';
            }
        },
        data: worldometer_data
    });

    // attach onclick event
    var countries_svg = document.querySelectorAll('path.datamaps-subunit');
    countries_svg.forEach(element => {
        element.addEventListener('click', function(){
            countryClicked(element);
        });
      });

    // // to resize map
    // window.addEventListener('resize', function() {
    //     map.resize();
    // });
}

function mainScript() {
    // create world map
    getWorldometerData();
        
    removeExistingArticleCards();
    callNewsApi();
}

document.addEventListener('DOMContentLoaded', mainScript);


