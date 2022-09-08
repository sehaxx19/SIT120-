// The following is sample code to demonstrate navigation.
// You need not use it for final app.

if (typeof(Storage) !== "undefined"){

    var regionListArr = JSON.parse(localStorage.getItem("regionList"));

    // Instatiating the Region List class
    //var regionList2 = new RegionList();
    //var regionListArr = regionList2.retrieveRegion()

    console.log("**********");
    console.log(APP_PREFIX);

    var output = "";

    var regionListRef = document.getElementById("regionsList");

    if(regionListArr !== null) {

        if(regionListArr.length === 0){
            output = '<p class="noSavedRegions">No Saved Regions.</p>';
        }
        else{
            for(var region = 0; region < regionListArr.length; region++){
                console.log(region);
                //output += "<li>" + regionListArr[region]._nickname + "</li>";
                output += '<li class="mdl-list__item mdl-list__item--two-line" onclick=viewRegion('+region+')>' +
                    '<span class="mdl-list__item-primary-content">' +
                    '<span>' + regionListArr[region]._nickname + '</span>' +
                    '<span class="mdl-list__item-sub-title"> Date: ' + regionListArr[region]._date.substring(0, 10) + '</span>' + 
                    '<span class="mdl-list__item-sub-title"> Time: ' + regionListArr[region]._date.substring(11, 20) + '</span>' +
                    '</span>' +
                    '</li>';
            }
        } 
    }
    else{
        output = '<p class="noSavedRegions">No Saved Regions.</p>';
    }

    regionListRef.innerHTML = output;

    function viewRegion(regionIndex)
    {
        console.log(APP_PREFIX);
        // Save the desired region to local storage so it can be accessed from view region page.
        localStorage.setItem(APP_PREFIX + "-selectedRegion", regionIndex); 
        // ... and load the view region page.
        location.href = 'viewRegion.html';
    }


    function removeAllRegion(){

        var sure = confirm("Are you sure you want to remove all saved regions?");

        if(sure == true){
            if(regionListArr !== null){
                localStorage.removeItem("regionList");
                location.reload();
            }
            else{
                alert("There are no saved regions to remove!");
            }
        }
        else{
            return;
        }
    }
}
else{
    console.log("Error: LocalStorage is not supported by current browser.");
}

