// Code for the Record Region page.

// Initialization of the map 
mapboxgl.accessToken = 'pk.eyJ1IjoibHVjaWZlcmJvbmQiLCJhIjoiY2tob291bDBlMTE0bDJxazFleHZ2dm45NyJ9.tt3YE8JnXtz_LvE9e9Yj8Q';
var map = new mapboxgl.Map({
container: 'map', // container id
style: 'mapbox://styles/mapbox/streets-v11',
center: [79.861244,6.927079], // starting position chosen as colombo 
zoom: 12 // starting zoom
});


// Just added this as an extra feature might not need this 
map.on('mousemove', function (e) {
                document.getElementById('info').innerHTML =
                // e.point is the x, y coordinates of the mousemove event relative
                // to the top-left corner of the map
                JSON.stringify(e.point) +
                '<br />' +
                // e.lngLat is the longitude, latitude geographical position of the event
                JSON.stringify(e.lngLat.wrap());
                });


// This part is definitely required
// Obtaining Coordinates on mouse click 
// Declare a suitable variable 
map.on('click',function(e){
    map.flyTo({
        center: e.lngLat// Location is centered repetitively on users current location
    })
    var clicklocation = e.lngLat;
    new mapboxgl.Popup()
      .setLngLat(clicklocation)
      .setHTML('you clicked here: <br/>' + clicklocation)//Popup to show click location
      .addTo(map);
    var coordinates = JSON.stringify(e.lngLat);// Variable to store coordinates of clicked position
    localStorage.setItem("coordinates",coordinates);// Saving to local storage.

    });

