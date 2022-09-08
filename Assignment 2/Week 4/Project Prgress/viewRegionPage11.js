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

/*
// View Region Object to hold our measurement features
var viewRegion = { 
    'type':'FeatureCollection',
    'features':[]
};
*/
var geojson = {
    'type': 'FeatureCollection',
    'features': []
};

var polygon = {
    'type':'Feature',
    'geometry':{
        'type':'Polygon',
        'coordinates':[[79.86611371317201,6.950514051911881],
                       [79.87093473914081,6.95111225108721],
                       [79.87097629970782,6.946842329959381],
                       [79.86702804567972,6.94665668033457],
                       [79.86603059203168,6.95067907244912]]
    }
};

map.on('load', function () {
    map.addSource('geojson', {
        'type': 'geojson',
        'data': geojson
    });
    
        map.addLayer({
        id: 'measure-area',
        type: 'fill',
        source: 'geojson',
        layout: {},
        paint: {
            'fill-color': '#088',
            'fill-opacity': 0.8
        },
    });
});


/*
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
*/

// View region function call goes here.
// Code for function
// Call coordinates to this property using function

//viewPolygon.geometry.coordinates

// Polygon to contain our coordinates.
/*
var viewPolygon = {
    'type':'Feature',
    'geometry':{
        'type':'Polygon',
        'coordinates':[[79.86611371317201,6.950514051911881],
[79.87093473914081,6.95111225108721],
[79.87097629970782,6.946842329959381],
[79.86702804567972,6.94665668033457],
[79.86603059203168,6.95067907244912]]
    }
};
*/

console.log("############");
//console.log(viewPolygon.geometry.coordinates);
// Input polygon instance into viewRegion object
//viewRegion.features.push(viewPolygon);
geojson.features.push(polygon);
//console.log(viewRegion);
map.getSource('geojson').setData(geojson);
//map.getSource('geojson').setData(viewRegion);

