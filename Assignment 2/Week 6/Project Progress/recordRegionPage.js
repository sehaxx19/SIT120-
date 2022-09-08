// Code for the Record Region page.


//Display a dialog to the user by calling the showDialog() function
showDialog();
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

// Unhide the 'Save Region' button
saveRegionRef.hidden = true;
// Disable the 'Save Region' button so that it can't be clicked on
saveRegionRef.disabled = true;
*/

var addCurrentLocRef = document.getElementById('add');
// Object to store coordinates in the form of latitude and longitude for click locations
var coordinate = {};
// Array to store coordinates of corner Locations
var cornerLocations = [];
// Instatiating the Region List class
var regionList = new RegionList();


// User can select his current location through this event 
map.on('click',function(e){
    var clickLocation = e.lngLat; // user location is stored
    map.flyTo({
        center: clickLocation // Centering on user click location
    })

    // Popup to display latitude and longitude of clicked position so that user can select current position.
    new mapboxgl.Popup()
    .setLngLat(clickLocation) 
    .setHTML('Current Location <br/>Latitude: ' + clickLocation.lat.toFixed(4) + '<br/>Longitude: ' + clickLocation.lng.toFixed(4))// Text appearing on popup.
    .addTo(map);

    if (typeof(Storage) !== "undefined"){
        coordinate = JSON.stringify(clickLocation); // User location stringified and stored to local storage
        localStorage.setItem('coordinates',coordinate);
    }
    else{
        alert("Error: LocalStorage is not supported by current browser.");
    }
})



/*function dialogBox() {
  // Get the checkbox
  var checkBox = document.getElementById("myCheck");
  // Get the output text
  var text = document.getElementById("text");

  // If the checkbox is checked, display the output text
  if (checkBox.checked == true){
    text.style.display = "block";
  } else {
    text.style.display = "none";
  }
}
dialogBox();*/

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

    // displaying the current location of the user.
    coordinates.style.display = 'block';
    coordinates.innerHTML =
    'Longitude: ' + initialSelection.lng.toFixed(4) + '<br />Latitude: ' + initialSelection.lat.toFixed(4);
    
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
    
    // Disable the 'Add Current Location' button so that it can't be clicked on
    addCurrentLocRef.disabled = true;
    
    // Enable the 'Add Corner' button so that it can't be clicked on
    addCornerRef.disabled = false;
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
     
// Var used to draw a line between points
var linestring = {
    'type': 'Feature',
    'geometry': {
        'type': 'LineString',
        'coordinates': []
    }
};
// var used to draw the polygon
var polygon = {
    'type':'Feature',
    'geometry':{
        'type':'Polygon',
        'coordinates':[]
    }
};
// Event function 
map.on('load', function () {
    map.addSource('geojson', {
        'type': 'geojson',
        'data': geojson
    });

    // Add layer for adding points to the map 
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
    // Add layer for drawing measure lines between the points
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
    // Add layer to construct the polygon between the selected points.
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
    var cornerLatlng = {};  
    
    map.on('click', function (e) {
        var features = map.queryRenderedFeatures(e.point, {
            layers: ['measure-points']
        });
        cornerLatlng = {lng:e.lngLat.lng , lat: e.lngLat.lat}
        console.log(cornerLatlng);
        cornerLocations.push(cornerLatlng);
        console.log(cornerLocations);
        
        // Remove the linestring from the group
        // So we can redraw it based on the points collection
        if (geojson.features.length > 1) geojson.features.pop();

        // Clear the Distance container to populate it with a new value
        distanceContainer.innerHTML = '';
        // creating point objects
        // If a feature was clicked, remove it from the map
        /*if (features.length) {
            console.log(e.lngLat.lng)
            for(i = 0; i < cornerLocations.length; i++){
                console.log(cornerLocations[i])
                if(e.lngLat.lng == cornerLocations[i].lng){
                    //delete cornerLocations[i];
                    cornerLocations.splice(i, 1);
                    console.log(cornerLocations.length)
                    
                }
            }
            var id = features[0].properties.id;
            geojson.features = geojson.features.filter(function (point) {
                return point.properties.id !== id;
            });
        }*/
        //else{   
        var point = {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [e.lngLat.lng, e.lngLat.lat]    //     [cornerLatlng.lng,cornerLatlng.lat] 
            },
            'properties': {
                'id': String(new Date().getTime())
           }
        };

        // Input point objects into geojson object.                 
        geojson.features.push(point);
        //}
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

        setTimeout(function(){
            if (cornerLocations.length >= 3){
                // Unhide the 'Save Region' button
                ///////saveRegionRef.hidden = false;
                // Enable the 'Save Region' button so that it can't be clicked on
                saveRegionRef.disabled = false;
            }else{
                saveRegionRef.disabled = true;
            }
        },2000
        )

    });
    /*
    console.log(cornerLocations.length + "-->")
    setTimeout(function(){
        if (cornerLocations.length >= 3){
            // Unhide the 'Save Region' button
            ///////saveRegionRef.hidden = false;
            // Enable the 'Save Region' button so that it can't be clicked on
            saveRegionRef.disabled = false;
        }
    },2000
    )
    */
    
    
    // var cornerLatlng = JSON.parse(coordinate);
    //cornerLocations.push(cornerLatlng);

    /*
    corner.lat.push(cornerLatlng.lat);
    corner.lng.push(cornerLatlng.lng);
    */
    console.log(cornerLocations.length);
} // End of function add corner
    console.log(geojson)

// Checks whether user has given a region name
// validate function
function validate(regionName) {
    if(regionName === "") {
        alert("Please enter a region name for easy identification later.");
        return false;
    }
}

// Function used to save the selected region to local storage.

function saveRegion(){
    // variable to store region name.
    var regionName = "";
    
    // loop to get set approptiate region name.
    while(regionName === "") { 
        regionName = prompt("Please enter a region name: ");        
        if (regionName === null) {
            return;
        }
        validate(regionName)
    }
    
    var region = new Region(regionName, cornerLocations, new Date().toLocaleString());
    
    //console.log(region.nickname);
    //region.nickname = "halo";
    //console.log(region);
    
    if (typeof(Storage) !== "undefined"){
        regionList.addReg(region);
        //savedRegions.push(region);
        console.log(regionList.getNumOfRegions());
    }
    else{
        alert("Error: LocalStorage is not supported by current browser.");
    }
    
    
    //displaying a message after successfully saving the region into the local storage
    //window.alert("Region Saved");
    
    //displaying a message after successfully saving the region into the local storage
    displayMessage('Region Saved',1000);
    
    // reloads the index page of the app.
    // assign() method allows the user to click on the back button and go back to the recordRegionPage
    // this can be prevented by using the replace() method 
    //document.location.assign("index.html");
    
    setTimeout(function() {
        // reloads the index page of the app.
        // assign() method allows the user to click on the back button and go back to the recordRegionPage
        // this can be prevented by using the replace() method 
        document.location.assign("index.html");
    }, 500);
    
    cornerLocations = [];
}


function resetRegion(){
    
    var sure = confirm("Are you sure you want to reset the region?");
    
    if(sure == true){
        if(cornerLocations.length !== 0){
            coordinate = {};
            cornerLocations = [];

            geojson.features = [];

            // This is essential for the layer to be applied on to the map.
            map.getSource('geojson').setData(geojson);

            document.getElementById("distance").innerHTML = '';

            displayMessage('Region Removed',1000);

            if (cornerLocations.length >= 3){
                // Unhide the 'Save Region' button
                ///////saveRegionRef.hidden = false;
                // Enable the 'Save Region' button so that it can't be clicked on
                saveRegionRef.disabled = false;
            }
            else{
                saveRegionRef.disabled = true;
            }

            console.log(geojson.features.length);
        }
        else{
            alert("No corner locations added to remove!\n" + 
                  "\nIf you want to change the current location, drag the current location marker to move it.");
        }
    }
    else{
        return;
    }
    
    /*coordinate = {};
    cornerLocations = [];
    
    geojson.features = [];
    //linestring.geometry.coordinates = [];
    //polygon.geometry.coordinates = [];
    
    // This is essential for the layer to be applied on to the map.
    map.getSource('geojson').setData(geojson);
    
    document.getElementById("distance").innerHTML = '';
    
    //map.getSource('geojson').setData(geojson);
    //geojson = {};
    //map.removeLayer(point)
    //map.addLayer
    
    //console.log(geojson);
    
    //linestring = {};
    //polygon ={};
    
    //map.remove();
    
    //displaying a message after successfully clearing a region
    //displayMessage('Region Removed',500);
    
    ///setTimeout(function() {
    ///    location.reload();//reload page
    ///}, 500);
    
    displayMessage('Region Removed',1000);
    
    if (cornerLocations.length >= 3){
        // Unhide the 'Save Region' button
        ///////saveRegionRef.hidden = false;
        // Enable the 'Save Region' button so that it can't be clicked on
        saveRegionRef.disabled = false;
    }else{
        saveRegionRef.disabled = true;
    }
        
    console.log(geojson.features.length);*/
}


