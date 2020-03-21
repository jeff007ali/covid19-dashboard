region_list = get_regions_name();

function fetch_location_name(){
    var name_tt = document.getElementById('tt_sm_map');

    if(name_tt.style.display == "block"){
        var location = document.getElementsByClassName('tt_name_sm')[0].innerHTML;
        console.log(location);

        if(region_list.includes(location)){
            return location;
        }
    }
    return "";
}

function search_news(location, keyword = "corona"){
    var url = 'http://newsapi.org/v2/everything?' +
              'q=' + keyword + '&' +
              'sortBy=popularity&' +
              'apiKey=cf0cba3704c24dda85bd20d224a7cc28';

    var req = new Request(url);

    fetch(req)
        .then(function(response) {
            console.log(response.json());
            return response.json();
        })
}

function get_regions_name(){
    var region_list = new Array();

    var regions = simplemaps_worldmap_mapdata.regions;
    for (var r in regions){
        region_list.push(regions[r].name);
    }

    // console.log(region_list);
    return region_list;
}

function get_news_according_to_location(){
    console.log(region_list);
    var location = fetch_location_name();

    if(location != ""){
        console.log("main function");
        console.log(search_news(location));
    }
}

window.addEventListener("mousedown", get_news_according_to_location);
