// Code for the View Region page.

// The following is sample code to demonstrate navigation.
// You need not use it for final app.

var regionIndex = localStorage.getItem(APP_PREFIX + "-selectedRegion"); 
var regionList = JSON.parse(localStorage.getItem("regionList"));
if (regionIndex !== null)
{
    // If a region index was specified, show name in header bar title. This
    // is just to demonstrate navigation.  You should set the page header bar
    // title to an appropriate description of the region being displayed.
    //var regionNames = [ "Region A", "Region B" ];
    document.getElementById("headerBarTitle").textContent = regionList[regionIndex]._nickname;
}

mapboxgl.accessToken = 'pk.eyJ1IjoibHVjaWZlcmJvbmQiLCJhIjoiY2tob291bDBlMTE0bDJxazFleHZ2dm45NyJ9.tt3YE8JnXtz_LvE9e9Yj8Q';
var coordinates = document.getElementById('coordinates');
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [79.861244,6.927079], // starting position chosen as colombo 
    zoom: 12 // starting zoom
});
 
// View Region Object to hold our measurement features
var viewRegion = { 
    'type':'FeatureCollection',
    'features':[]
};





// Calling features on load
map.on('load', function () {
map.addSource('geojson', {
'type': 'geojson',
'data': 'viewRegion'
});


map.addLayer({
'id': 'viewPolygon',
'type': 'fill',
'source': 'geojson',
'layout': {},
'paint': {
'fill-color': '#088',
'fill-opacity': 0.8
}
});
});

// View region function call goes here.
// Code for function
// Call coordinates to this property using function

viewPolygon.geometry.coordinates

// Polygon to contain our coordinates.
var viewPolygon = {
    'type':'Feature',
    'geometry':{
        'type':'Polygon',
        'coordinates':[regionList.cornerLocations]
    }
};
console.log("############");
console.log(viewPolygon.geometry.coordinates);
// Input polygon instance into viewRegion object
viewRegion.features.push(viewPolygon);
map.getSource('geojson').setData('viewRegion');

