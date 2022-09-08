
// The following is sample code to demonstrate navigation.
// You need not use it for final app.

var regionListArr = JSON.parse(localStorage.getItem("regionList"));
console.log("**********");
console.log(APP_PREFIX);

var output = "";

var regionListRef = document.getElementById("regionsList");

if(regionListArr !== null) {
    
    for(var each = 0; each < regionListArr.length; each++){
    console.log(each);
    //output += "<li>" + regionList[region]._nickname + "</li>";
    output += '<li class="mdl-list__item mdl-list__item--two-line" onclick=viewRegion('+each+')>' +
              '<span class="mdl-list__item-primary-content">' +
                '<span>' + regionListArr[each]._nickname + '</span>' +
                '<span class="mdl-list__item-sub-title">' + regionListArr[each]._date + '</span>' +
              '</span>' +
              '</li>'
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
