/* code for the index page
DOCUMENTATION => VARIABLES:
1. regionListArr - creats a local copy of the region list object from the local storage
2. output - displays the regions that are created in the record region page
3. regionListRef - accesses the regionList element in the index page
4. region - counter variable
5. sure - purpose - validation, true when the user clicks on the OK button
FUNCTIONS:
1. viewRegion - invoked when the user clicks on a region on list , parameters: regionIndex 
2. removeAllRegions - invoked when the "REMOVE ALL REGIONS" button is clicked.
*/

// Validation step to ensure the browser is equipped with local storage which is required for the APP to run 
// smoothly
if (typeof(Storage) !== "undefined")
{
    var regionListArr = JSON.parse(localStorage.getItem("regionList"));
    var output = "";
    var regionListRef = document.getElementById("regionsList");
    if(regionListArr !== null) 
    {

        if(regionListArr.length === 0){
            output = '<p class="noSavedRegions">No Saved Regions.</p>';
        }
        else
        {
            for(var region = 0; region < regionListArr.length; region++)
            {
                console.log(region);
                // creatind a new list element to display the region
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
    
    // viewRegion() - loads the region that the user clicks on,
    // parameters : regionIndex - the index of the region in the region list
    function viewRegion(regionIndex)
    {
        // Save the desired region to local storage so it can be accessed from view region page.
        localStorage.setItem(APP_PREFIX + "-selectedRegion", regionIndex); 
        // ... and load the view region page.
        location.href = 'viewRegion.html';
    }

    // removeAllRegions() - will remove all the regions saved and refresh the page
    function removeAllRegion()
    {
        var sure = confirm("Are you sure you want to remove all saved regions?");
        if(sure == true)
        {
            if(regionListArr !== null)
            {
                localStorage.removeItem("regionList");
                location.reload();
            }
            else
            {
                alert("There are no saved regions to remove!");
            }
        }
        else
        {
            return;
        }
    }
}
else
{
    console.log("Error: LocalStorage is not supported by current browser.");
}

