// Code for the Record Region page.

// Initialization of the map 
mapboxgl.accessToken = 'pk.eyJ1IjoibHVjaWZlcmJvbmQiLCJhIjoiY2tob291bDBlMTE0bDJxazFleHZ2dm45NyJ9.tt3YE8JnXtz_LvE9e9Yj8Q';
var coordinates = document.getElementById('coordinates');
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [79.861244,6.927079], // starting position chosen as colombo 
    zoom: 12 // starting zoom
});


// Initiating the global variables
var distanceContainer = document.getElementById('distance');
/*
var saveRegionRef = document.getElementById('save');


// Unhide the 'Next Game' button
saveRegionRef.hidden = true;
// Disable the 'Next Game' button so that it can't be clicked on
saveRegionRef.disabled = true;
*/

var coordinate = {};
var cornerLocations = [];
var regionList = new RegionList();


// User can select his current location through this event 
map.on('click',function(e){
    var clickLocation = e.lngLat; // user location is stored
    map.flyTo({
        center: clickLocation
    })

    // Popup to display latitude and longitude of clicked position so that user can select current position.
    new mapboxgl.Popup()
    .setLngLat(clickLocation)
    .setHTML('Current Location <br/>Latitude: ' + clickLocation.lat.toFixed(4) + '<br/>Longitude: ' + clickLocation.lng.toFixed(4))
    .addTo(map);

    coordinate = JSON.stringify(clickLocation); // User location stringified  )and stored to local storage
    //localStorage.setItem('coordinates',coordinates);
})


// User can use add current button on regionpage to select current location.

// This function allow a user to register his current location.
function addCurrentLocation() {
    //Converting stringified data to object
    var initialSelection = JSON.parse(coordinate);
    // Test case
    console.log(initialSelection);

    // Adding a marker to user's current location.
    var marker = new mapboxgl.Marker({
        draggable: true, // draggable marker incase user needs to change his location.
        color:'red'
    })
    .setLngLat([initialSelection.lng,initialSelection.lat])
    .addTo(map);

    // Function that allows marker to be dragged.
    function onDragEnd() {
        var lngLat = marker.getLngLat(); // This variable gives our current coordinates
        console.log(lngLat)
        coordinates.style.display = 'block';
        coordinates.innerHTML =
        'Longitude: ' + lngLat.lng.toFixed(4) + '<br />Latitude: ' + lngLat.lat.toFixed(4);
    }
    // Event for drag marker.
    marker.on('dragend', onDragEnd);
}


// Code to remove marker
/*
var marker = new mapboxgl.Marker().addTo(map);
marker.remove();
*/


map.on('mousemove', function (e) {
    document.getElementById('info').innerHTML =
    // e.point is the x, y coordinates of the mousemove event relative
    // to the top-left corner of the map
    'x position: ' + JSON.stringify(e.point.x) + 
    '<br />y position: ' +  JSON.stringify(e.point.y)
});


// User interaction handler cross hair to select precise location
map.on('load',function(e){
    map.getCanvas().style.cursor = 'crosshair'
});

// GeoJSON object to hold our measurement features
var geojson = {
    'type': 'FeatureCollection',
    'features': []
};
     
// Used to draw a line between points
var linestring = {
    'type': 'Feature',
    'geometry': {
        'type': 'LineString',
        'coordinates': []
    }
};
var polygon = {
    'type':'Feature',
    'geometry':{
        'type':'Polygon',
        'coordinates':[]
    }
};

map.on('load', function () {
    map.addSource('geojson', {
        'type': 'geojson',
        'data': geojson
    });

    // Add styles to the map
    map.addLayer({
        id: 'measure-points',
        type: 'circle',
        source: 'geojson',
        paint: {
            'circle-radius': 5,
            'circle-color': '#000'
        },
        filter: ['in', '$type', 'Point']
    });
    map.addLayer({
        id: 'measure-lines',
        type: 'line',
        source: 'geojson',
        layout: {
            'line-cap': 'round',
            'line-join': 'round'
        },
        paint: {
            'line-color': '#000',
            'line-width': 2.5
        },
        filter: ['in', '$type', 'LineString']
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


function addCorner(){
    var cornerLatlng = JSON.parse(coordinate);
    cornerLocations.push(cornerLatlng);
    map.on('click', function (e) {
        var features = map.queryRenderedFeatures(e.point, {
            layers: ['measure-points']
        });

        // Remove the linestring from the group
        // So we can redraw it based on the points collection
        if (geojson.features.length > 1) geojson.features.pop();

        // Clear the Distance container to populate it with a new value
        distanceContainer.innerHTML = '';
        // creating point objects
        var point = {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [cornerLatlng.lng,cornerLatlng.lat]             //[e.lngLat.lng, e.lngLat.lat]
            },
            'properties': {
                'id': String(new Date().getTime())
           }
        };
        // Input point objects into geojson object.                 
        geojson.features.push(point);
        // Input coordinates into linestring object
        if (geojson.features.length > 1) {
            linestring.geometry.coordinates = geojson.features.map(
            function (point) {
                return point.geometry.coordinates;
            }
            );
            // Input linestring object into geojson object  
            geojson.features.push(linestring);

            // Populate the distanceContainer with total distance
            var value = document.createElement('pre');
            value.textContent = 'Total distance: ' +
            turf.length(linestring).toLocaleString() +
            'km';
            distanceContainer.appendChild(value);
        }

        // This is essential for the layer to be applied on to the map.
        map.getSource('geojson').setData(geojson);
        console.log(point);

    });
    
    
    if (cornerLocations.length >= 3){
        // Unhide the 'Next Game' button
        saveRegionRef.hidden = false;
        // Disable the 'Next Game' button so that it can't be clicked on
        saveRegionRef.disabled = false;
    }
    
   // var cornerLatlng = JSON.parse(coordinate);
    //cornerLocations.push(cornerLatlng);

    /*
    corner.lat.push(cornerLatlng.lat);
    corner.lng.push(cornerLatlng.lng);
    */
    console.log(cornerLocations);
} // End of function add corner


function saveRegion(){
    // variable to store player name.
    var player = "";
    
    player = prompt("Please enter a nickname: ");
    
    var region = new Region(player, cornerLocations, new Date());
    
    //console.log(region.nickname);
    //region.nickname = "halo";
    console.log(region);
    
    regionList.addReg(region);
    //savedRegions.push(region);
    console.log(regionList.getNumOfRegions());
    
    // reloads the index page of the app.
    // assign() method allows the user to click on the back button and go back to the recordRegionPage
    // this can be prevented by using the replace() method 
    document.location.assign("index.html");
    
    cornerLocations = [];
}


function resetRegion(){
    
    //cornerLocations = [];
    //coordinate = {};
    //geojson.features.length = 0;
    //geojson.features.point = {};
    //map.getSource('geojson').setData(geojson);
    //geojson = {};
    //map.removeLayer(point)
    //map.addLayer
    
    //console.log(geojson);
    
    //linestring = {};
    //polygon ={};
    
    //document.location.assign("recordRegion.html");
}

 function deleteCorner(){
    corner.lat.pop();
    corner.lng.pop();
}








/*    
function addCorner(){
    // Add marker to show selected corner - Manuja
    map.on('click', function (e) {
        var features = map.queryRenderedFeatures(e.point, {
        layers: ['measure-points']
        });
// Circular marker added at point of selection
        var point = {
            'type': 'Feature',
            'geometry': {
            'type': 'Point',
            'coordinates': [e.lngLat.lng, e.lngLat.lat]// this is where the coordinates of the selected location  should go
            },
            'properties': {
            'id': String(new Date().getTime())
            }
            };
            geojson.features.push(point);  
            map.getSource('geojson').setData(geojson);
    });

    
    var cornerLatlng = JSON.parse(localStorage.getItem("coordinates"));
   
    corner.lat.push(cornerLatlng.lat);
    corner.lng.push(cornerLatlng.lng);
console.log(corner); 
    
}


function deleteCorner(){
    corner.lat.pop();
    corner.lng.pop();
}
*/