/* code for the view region page
DOCUMENTATION =>
FUNCTIONS:
1. calculatePerimeter() - called when the  calculateArea button is clicked , calls the areaCalculation method
2. calculatePerimeter() - called when the  calculatePerimeter button is clicked , calls the perimeterCalculation method
3. estimatefencing(checkbox) - called when toggle button is clicked ON 
4. removeRegion() - called when the REMOVE REGION button is clicked , calls the removeReg(regionIndex) method
*/

// The API key to authenicate with the API
mapboxgl.accessToken = 'pk.eyJ1Ijoic2VoYW5kdWsiLCJhIjoiY2w3cmtzOGptMGdiNTN2bnZxemNmajNzaCJ9.ZmuUXZWARzCl1SybKVojww';

var map = new mapboxgl.Map(
{
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [144.995,-37.824], // starting position chosen as colombo 
    zoom: 12 // starting zoom
});

if (typeof(Storage) !== "undefined")
{
    // regionIndex and regionListArr - stores a copy of the properties from by parsing from the local storage
    var regionIndex = localStorage.getItem(APP_PREFIX + "-selectedRegion");
    var regionListArr = JSON.parse(localStorage.getItem("regionList"));

    // creating an instance of the Region class
    var region1 = new Region();

    // creating an instance of the RegionList class
    var regionList1 = new RegionList();



    // GeoJSON object to hold our measurement features
    var geojson = 
    {
        'type': 'FeatureCollection',
        'features': []
    };

    // Used to draw a line between points
    var linestring = 
    {
        'type': 'Feature',
        'geometry': 
            {
                'type': 'LineString',
                'coordinates': []
            }
    };
    var polygon = 
    {
        'type':'Feature',
        'geometry':
            {
            'type':'Polygon',
            'coordinates':[]
            }
    };

    // Event to load sources and layers of the map
    map.on('load', function () 
    {
        map.addSource('geojson', 
        {
            'type': 'geojson',
            'data': geojson
        });

        // Add styles to the map
        // Layer to add points to the map
        map.addLayer(
            {
            id: 'measure-points',
            type: 'circle',
            source: 'geojson',
            paint: 
                {
                    'circle-radius': 5,
                    'circle-color': ' rgba(9, 5, 216, 0.8)'
                },
            filter: ['in', '$type', 'Point']
        });
        // Layer to add lines to the map
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
        // Layer to add polygon to the map
        map.addLayer(
        {
            id: 'measure-area',
            type: 'fill',
            source: 'geojson',
            layout: {},
            paint: 
            {
                'fill-color': '#088',
                'fill-opacity': 0.5
            },
        });

    });
    // Array to store data necessary for perimeter, area and fencing calculations.
    var calculations = []; 


    if (regionIndex !== null)
    {
        // If a region index was specified, show name in header bar title. This
        // is just to demonstrate navigation.  You should set the page header bar
        // title to an appropriate description of the region being displayed.
        //var regionNames = [ "Region A", "Region B" ];
        document.getElementById("headerBarTitle").textContent = regionListArr[regionIndex]._nickname;

        for(var i in regionListArr[regionIndex]._cornerLocation){
            var point = 
                {
                    'type': 'Feature',
                    'geometry': 
                    {
                        'type': 'Point',
                        'coordinates': [regionListArr[regionIndex]._cornerLocation[i].lng, regionListArr[regionIndex]._cornerLocation[i].lat]             //[e.lngLat.lng, e.lngLat.lat]
                    },
                    'properties': 
                    {
                        'id': String(new Date().getTime())
                    }
                };

            calculations.push([regionListArr[regionIndex]._cornerLocation[i].lng, regionListArr[regionIndex]._cornerLocation[i].lat])

            // Input point objects into geojson object.                 
            geojson.features.push(point);   
        }

        // adding the first point once again to have a complete cycle
        var point = 
            {
            'type': 'Feature',
            'geometry': 
            {
                'type': 'Point',
                'coordinates': [regionListArr[regionIndex]._cornerLocation[0].lng, regionListArr[regionIndex]._cornerLocation[0].lat]             //[e.lngLat.lng, e.lngLat.lat]
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

        }

        
        // finding the min and max longitudes 
        // therefore when viewing the region the polygon/region is centred in the map
        var minLng = Math.min.apply(null, regionListArr[regionIndex]._cornerLocation.map(function(item) 
        {                                                                                 
            return item.lng;
        }))
        var maxLng = Math.max.apply(null, regionListArr[regionIndex]._cornerLocation.map(function(item) 
        {                                                                                 
            return item.lng;
        }));

        // finding the min and max latitudes to centerize the polygon
        var minLat = Math.min.apply(null, regionListArr[regionIndex]._cornerLocation.map(function(item) 
        {                                                                                 
            return item.lat;
        }))
        var maxLat = Math.max.apply(null, regionListArr[regionIndex]._cornerLocation.map(function(item)                                                              
        {
            return item.lat;
        }));


        // calculating the midpoint of the longitude
        var midLng = (minLng + maxLng) / 2;

        // calculating the midpoint of the latitude
        var midLat = (minLat + maxLat) / 2;

        // centering the map with respect to the midpoints
        map.flyTo(
            {
                center: [midLng, midLat]
            })
    }


    // Function to calculate Area of the selected region.
    function calculateArea()
    {    
        region1.areaCalculation(calculations);

    }


    // Function to calculate the perimeter of the selected region.
    function calculatePerimeter()
    {

        region1.perimeterCalculation(calculations);

    }

    // remmoveRegion - removes a selected region from region list
    function removeRegion()
    {

        /*using splice to select the item in array and deleting selected item
        using set item to set a blank array item instead of the present data
        regionList.splice(regionIndex, 1);
        localStorage.setItem("regionList",JSON.stringify(regionList));*/

        var sure = confirm("Are you sure you want to delete this region?");

        if(sure == true)
        {
            regionList1.removeReg(regionIndex);

            // reloads the index page of the app.
            // assign() method allows the user to click on the back button and go back to the recordRegionPage
            // this can be prevented by using the replace() method 
            document.location.assign("index.html");
        }
        else
        {
            return;
        }
    }
    // estimateFencing - checks whether the toggle button is on/checked - if so then number of
    // fence post required is calculated
    function estimatefencing(checkbox)
    {
        if(checkbox.checked)
        {
            region1.boundaryFencePosts(calculations);
        }
        else
        {  
            // .removeFencePost() - method from the region object that removes the fence posts
            region1.removeFencePosts()
        }

    }
}
else
{
    console.log("Error: LocalStorage is not supported by current browser.");
}
