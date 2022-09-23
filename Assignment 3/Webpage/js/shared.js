// Shared code needed by the code of all three pages.

// Prefix to use for Local Storage.  You may change this.
var APP_PREFIX = "monash.eng1003.fencingApp";

// creating an instance of the geodesic class
let geod = GeographicLib.Geodesic.WGS84;


// Array of saved Region objects.
var savedRegions = [];
var span = 4;


// Code for the main app page (Regions List).
class Region 
{
    constructor(userNickname, cornerLoc, regDate) 
    {
        this._nickname = userNickname;
        this._cornerLocation = cornerLoc;
        this._date = regDate;
    }

    set nickname(name)
    {
        this._nickname = name;
    }
    get nickname()
    {
        return this._nickname;
    }
    set date(regDate)
    {
        this._date = regDate;
    }
    get date()
    {
        return this._date;
    }
    set cornerLocation(cornerLoc)
    {
        this._cornerLocation = cornerLoc;
    }
    get regionIn()
    {
        return this._cornerLocation;
    }
    
    areaCalculation(calculations)
    {
        // variable used to calculate area 
        var p = geod.Polygon(false), i, calculations;
        
        for (i = 0; i < calculations.length; ++i)
            p.AddPoint(calculations[i][0], calculations[i][1]);
        p = p.Compute(false, true);
        document.getElementById('area').innerHTML =
        'Area: ' + Math.abs(p.area.toFixed(1)) + " m^2";

        console.log("Area of the region is " + Math.abs(p.area.toFixed(1)) + " m^2"); 
    }
    
    perimeterCalculation(calculations)
    {
        // variable used to calculate perimeter
        var q = geod.Polygon(false), j, calculations;
        
        for (j = 0; j < calculations.length; ++j)
            q.AddPoint(calculations[j][1], calculations[j][0]);
        q = q.Compute(false, true);
        document.getElementById('perimeter').innerHTML =
        'Perimeter: ' + Math.abs(q.perimeter.toFixed(3)) + " m";

        console.log("Perimeter of the region is " + Math.abs(q.perimeter.toFixed(3)) + " m");
    }
    
    boundaryFencePosts(calculations)
    {
        var distances = [];
        var FencePosts = [];
        var azimuths = [];

        var j;
        for(j = 0; j < calculations.length - 1; j++)
        {
            var result = geod.Inverse(calculations[j][1],calculations[j][0],calculations[j+1][1],calculations[j+1][0]);
            console.log(result);
            // inputting distances between corresponding points to distances array.
            distances.push(result.s12);
            // Inputting azimuthal(direction) to azimuths array.
            azimuths.push(result.azi1);
        }

        // Test case for azimuths array.
        console.log(azimuths);

        // Calculating distance between the last point and the initial point using variable j defined in the global scope.
        var b = geod.Inverse(calculations[j][1],calculations[j][0],calculations[0][1],calculations[0][0]);

        // Inputting distance between last point and initial point to distances array
        distances.push(b.s12);
        // Inputting direction from last point to initial point to azimuths array.
        azimuths.push(b.azi1);

        // Variable obtained by user via settings page
        var spanLocalStorage = JSON.parse(localStorage.getItem("span"));

        
        if(spanLocalStorage !== null)
        {
            span = spanLocalStorage;
        }
        else
        {
            span = 4;
        }
        console.log(spanLocalStorage);
        
        //giving output of the fence span to display to the user in viewRegion Page
        document.getElementById("postDistance").innerHTML= "Fence Span" + " = " + span + " m";


        //Iteration to calculate number of fence posts between two adjacent points
        for( let k = 0; k < distances.length ; k++)
        {
            // Calculations are pushed into Fenceposts array.
            FencePosts.push(Math.floor(distances[k] / span));
        }

        console.log(FencePosts)
        // Variable to store the number of required fence posts.
        var numberOfFencePosts = 0;

        // number of fence posts = addition of each element in the array Fence posts array.
        // Iteration to calculate the number of fence posts required
        for ( let z = 0; z < FencePosts.length; z++)
        {
            // Updating Total
            numberOfFencePosts = numberOfFencePosts + FencePosts[z];   
        }

        // Display this value in the blue box
        document.getElementById("total").innerHTML= "Total No of Posts: " +numberOfFencePosts+"";

        console.log(numberOfFencePosts);

        // First push coordinates of all corners into this array
        var postCoordinates = [];

        //Loop to calculate the coordinates of the fence posts
        for(let n = 0; n < calculations.length; n++)
        {
            for( let m = 0 ; m < FencePosts[n] ; m++ )
            {
                var gap = span * (m + 1);
                var c = geod.Direct(calculations[n][1],calculations[n][0],azimuths[n],gap);
                postCoordinates.push([c.lon2,c.lat2]);
            }
        }
        console.log(postCoordinates);

        // Displaying Markers on map
        for(let y = 0; y <postCoordinates.length; y++){
            var point = {
                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': [postCoordinates[y][0],postCoordinates[y][1]]          
                },
                'properties': {
                    'id': String(new Date().getTime())
                }
          }
          geojson.features.push(point)
        }
        map.getSource('geojson').setData(geojson);
    }
    
    removeFencePosts()
    {
        // Recreating the initial geosjon object 
        geojson.features = [];

        for(var i in regionListArr[regionIndex]._cornerLocation)
        {
            var point = {
                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': [regionListArr[regionIndex]._cornerLocation[i].lng, regionListArr[regionIndex]._cornerLocation[i].lat]
                },
                'properties': {
                    'id': String(new Date().getTime())
                }
            };
            // Input point objects into geojson object.                 
            geojson.features.push(point);   
        }

        // adding the first point once again to have a complete cycle
        var point = {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [regionListArr[regionIndex]._cornerLocation[0].lng, regionListArr[regionIndex]._cornerLocation[0].lat]
            },
            'properties': {
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


        console.log(geojson);

        map.getSource('geojson').setData(geojson);
        //hiding the fencing information until toggle button is clicked
        document.getElementById('total').innerHTML = "";
        document.getElementById("postDistance").innerHTML= "";

    }
}

// Class RegionList is a class with a list of the regions  
class RegionList 
{
    constructor()
    {
        this._regionList = [];
        //count = numOfReg;
    }

    addReg(newReg)
    {
        // adding a new region to the regionlist
        this._regionList.push(newReg);
        savedRegions = JSON.parse(localStorage.getItem("regionList"));
        
        if(savedRegions !== null) {
            savedRegions.push(newReg);
            localStorage.setItem("regionList", JSON.stringify(savedRegions));
        }
        else{
            localStorage.setItem("regionList", JSON.stringify(this._regionList)); 
        }
        console.log(savedRegions);
        //count++ // incrementing the number of the list
    }
    
    removeReg(regToRemove)
    {   
        savedRegions = JSON.parse(localStorage.getItem("regionList"));
        
        // using splice to select the item in array and deleting selected item
        // using set item to set a blank array item instead of the present data
        
        savedRegions.splice(regToRemove, 1);
        localStorage.setItem("regionList",JSON.stringify(savedRegions));
    }

    retrieveRegion()
    {
        savedRegions = JSON.parse(localStorage.getItem("regionList"));
        
        return savedRegions;
    }

    getNumOfRegions()
    {
        savedRegions = JSON.parse(localStorage.getItem("regionList"));
        
        //return this._regionList.length;
        //return savedRegions.length;
        if(savedRegions !== null) 
        {
            return savedRegions.length;
        }
        else
        {
            return 0;
        }
    }
}


//settings page to save changes
function saveChanges(){
    
    console.log("changes saved");
    
    var spanRef = document.getElementById("fencingDataTextBox");
    span = Number(spanRef.value);
    console.log(span);
    
    //validate the user input
    if(span === 0) {
        window.alert("Please enter a valid number.");
        location.reload();
    }
    else if(isNaN(span)){
        window.alert("Please enter a number.");
        location.reload();
    }
    else{
    
        localStorage.setItem("span", JSON.stringify(span));

        displayMessage('Successfully saved changes',1000);

        setTimeout(function() {
            history.back();

        }, 700);
    }
}


//Settings page default settings 
function defaultValue(){
    localStorage.removeItem("span");
    displayMessage('Successfully reset to default',1000);
    setTimeout(function(){
        history.back();
    },700);
    
}


 