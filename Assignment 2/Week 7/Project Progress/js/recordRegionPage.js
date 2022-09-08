/* code for the record region page
DOCUMENTATION => VARIABLES:
1. map - mapboxgl.map object class
2. coordinates - is used to link the DOM element, coordinates 
3. distanceContainer - is used to link the DOM element, distance
4. addCurrentLocRef  - is used to link the DOM element, add 
5. coordinate - is an object with a single array property, the object is  {[longitude, latitude]}
6. sure - purpose - validation, true when the user clicks on the OK button
7. cornerLatLng - object with multiple arrays containing lattitude and longitude, stores the longitude and latitude of the current location 
8. point - object storing the coordinates - used to display points for corners
9. regionName - text, stores name
10 region - object, stores region data

FUNCTIONS:
1. showDialog - displays a dialog every time the user enters the record region page 
2. onDragEnd - a call back function that runs when event 'dragged' is triggered
3. addCurrentLocation - called when the ADD CURRENT LOCCATION  button is clicked
4. addCornerLocation - is called when the user clicks on the ADD CORNER button on recordRegion.html
5. validate - allows user to confirm, when a region is reset
6. saveRegion - called when SAVE REGION button is clicked
7. resetRegion - called when RESET REGION button is clicked.                            */

//Display a dialog to the user by calling the showDialog() function
showDialog();

// The API key to authenicate with the API
mapboxgl.accessToken = 'pk.eyJ1Ijoic2VoYW5kdWsiLCJhIjoiY2w3cmtzOGptMGdiNTN2bnZxemNmajNzaCJ9.ZmuUXZWARzCl1SybKVojww';

var coordinates = document.getElementById('coordinates');

// Initialization of the map 
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [144.995,-37.824], // starting position chosen as colombo 
    zoom: 12 // starting zoom
});


// Initiating the global variables
var distanceContainer = document.getElementById('distance');

var addCurrentLocRef = document.getElementById('add');
// Object to store coordinates in the form of latitude and longitude for click locations
var coordinate = {};
// Array to store coordinates of corner Locations
var cornerLocations = [];
// Instatiating the Region List class
var regionList = new RegionList();


// User can select his current location through this event 
map.on('click',function(e)
    {
    var clickLocation = e.lngLat; // user location is stored
    map.flyTo({
        center: clickLocation // Centering on user click location
    })

    // Popup to display latitude and longitude of clicked position so that user can select current position.
    new mapboxgl.Popup()
    .setLngLat(clickLocation) 
    .setHTML('Current Location <br/>Latitude: ' + clickLocation.lat.toFixed(4) + '<br/>Longitude: ' + clickLocation.lng.toFixed(4))// Text appearing on                                                                                                                                             popup.
    .addTo(map);

    if (typeof(Storage) !== "undefined"){
        coordinate = JSON.stringify(clickLocation); // User location stringified and stored to local storage
        localStorage.setItem('coordinates',coordinate);
    }
    else
    {
        alert("Error: LocalStorage is not supported by current browser.");
    }
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

    // displaying the current location of the user.
    coordinates.style.display = 'block';
    coordinates.innerHTML =
    'Longitude: ' + initialSelection.lng.toFixed(4) + '<br />Latitude: ' + initialSelection.lat.toFixed(4);
    
    // Function that allows marker to be dragged.
    function onDragEnd() {
        var lngLat = marker.getLngLat(); // This variable gives our current coordinates
        console.log(lngLat);
        coordinates.style.display = 'block';
        coordinates.innerHTML =
        'Longitude: ' + lngLat.lng.toFixed(4) + '<br />Latitude: ' + lngLat.lat.toFixed(4);
        /*map.flyTo({
            center: [lngLat.lng, lngLat.lat] // Centering on user click location
        })*/
    }
    // Event for drag marker.
    marker.on('dragend', onDragEnd);
    
    // Disable the 'Add Current Location' button so that it can't be clicked on
    addCurrentLocRef.disabled = true;
    
    // Enable the 'Add Corner' button so that it can't be clicked on
    addCornerRef.disabled = false;
}


map.on('mousemove', function (e) 
{
    document.getElementById('info').innerHTML =
    // e.point is the x, y coordinates of the mousemove event relative
    // to the top-left corner of the map
    'x position: ' + JSON.stringify(e.point.x) + 
    '<br />y position: ' +  JSON.stringify(e.point.y)
});


// User interaction handler cross hair to select precise location
map.on('load',function(e)
{
    map.getCanvas().style.cursor = 'crosshair'
});

// GeoJSON object to hold our measurement features
var geojson = {
    'type': 'FeatureCollection',
    'features': []
};
     
// Variable used to draw a line between points
var linestring = 
    {
    'type': 'Feature',
    'geometry': 
        {
        'type': 'LineString',
        'coordinates': []
        }
    };
// Variable used to draw the polygon
var polygon = 
    {
    'type':'Feature',
    'geometry':
        {
        'type':'Polygon',
        'coordinates':[]
        }
    };
// Event function 
map.on('load', function () 
    {
    map.addSource('geojson', 
        {
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
    map.addLayer(
        {
            id: 'measure-lines',
            type: 'line',
            source: 'geojson',
            layout: 
                {
                'line-cap': 'round',
                'line-join': 'round'
                },
            paint: 
                {
                'line-color': '#000',
                'line-width': 2.5
                },
            filter: ['in', '$type', 'LineString']
        });
    // Add layer to construct the polygon between the selected points.
    map.addLayer(
        {
        id: 'measure-area',
        type: 'fill',
        source: 'geojson',
        layout: {},
        paint: 
            {
            'fill-color': '#088',
            'fill-opacity': 0.8
            },
        });
});

// This function allow a user to register his corner locations.
function addCorner()
{
    var cornerLatLng = {};  
    
    map.on('click', function (e) 
    {
        var features = map.queryRenderedFeatures(e.point, 
        {
            layers: ['measure-points']
        });
        cornerLatLng = {lng:e.lngLat.lng , lat: e.lngLat.lat}
        cornerLocations.push(cornerLatLng);
        
        // Remove the linestring from the group
        // So we can redraw it based on the points collection
        if (geojson.features.length > 1) geojson.features.pop();

        // Clear the Distance container to populate it with a new value
        distanceContainer.innerHTML = '';
        // creating point objects  
        var point = 
            {
            'type': 'Feature',
            'geometry': 
                {
                'type': 'Point',
                'coordinates': [e.lngLat.lng, e.lngLat.lat] //     
                },
            'properties': 
            {
                'id': String(new Date().getTime())
            }
        };

        // Input point objects into geojson object.                 
        geojson.features.push(point);
        
        // Input coordinates into linestring object
        if (geojson.features.length > 1) 
        {
            linestring.geometry.coordinates = geojson.features.map(
            function (point) 
            {
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
            if (cornerLocations.length >= 3)
            {
                // Unhide the 'Save Region' button
                //saveRegionRef.hidden = false;
                // Enable the 'Save Region' button so that it can't be clicked on
                saveRegionRef.disabled = false;
            }
            else
            {
                saveRegionRef.disabled = true;
            }
        },2000
        )

    });
} // End of function add corner

// Checks whether user has given a region name
// Validation step to ensure the browser is equipped with local storage which is required for the APP to run 
// smoothly
function validate(regionName)
{
    if(regionName === "") 
    {
        alert("Please enter a region name for easy identification later.");
        return false;
    }
}

// Function used to save the selected region to local storage.
function saveRegion()
{
    // variable to store region name.
    var regionName = "";
    
    // loop to get set approptiate region name.
    while(regionName === "")
    { 
        regionName = prompt("Please enter a region name: ");        
        if (regionName === null) 
        {
            return;
        }
        validate(regionName)
    }
    
    var region = new Region(regionName, cornerLocations, new Date().toLocaleString());
    
    if (typeof(Storage) !== "undefined"){
        regionList.addReg(region);
        //savedRegions.push(region);
        console.log(regionList.getNumOfRegions());
    }
    else
    {
        alert("Error: LocalStorage is not supported by current browser.");
    }
    
    //displaying a message after successfully saving the region into the local storage
    displayMessage('Region Saved',1000);
    
    setTimeout(function() 
    {
        // reloads the index page of the app.
        // assign() method allows the user to click on the back button and go back to the recordRegionPage
        // this can be prevented by using the replace() method 
        document.location.assign("index.html");
    }, 500);
    
    cornerLocations = [];
}

// the function is used to reset the region in the record region page
function resetRegion()
{
    
    var sure = confirm("Are you sure you want to reset the region?");
    
    if(sure == true)
    {
        if(cornerLocations.length !== 0)
        {
            coordinate = {};
            cornerLocations = [];

            geojson.features = [];

            // This is essential for the layer to be applied on to the map.
            map.getSource('geojson').setData(geojson);

            document.getElementById("distance").innerHTML = '';

            displayMessage('Region Removed',1000);

            if (cornerLocations.length >= 3)
            {
                // Unhide the 'Save Region' button
                //saveRegionRef.hidden = false;
                // Enable the 'Save Region' button so that it can't be clicked on
                saveRegionRef.disabled = false;
            }
            else
            {
                saveRegionRef.disabled = true;
            }
        }
        else
        {
            alert("No corner locations added to remove!\n" + 
                  "\nIf you want to change the current location, drag the current location marker to move it.");
        }
    }
    else
    {
        return;
    }
    
}


