
// The following is sample code to demonstrate navigation.
// You need not use it for final app.

var regionList = JSON.parse(localStorage.getItem("regionList"));
console.log("**********");
console.log(regionList);

var output = "";

var regionListRef = document.getElementById("regionsList");

if(regionList !== null) {
    
    for(var region = 0; region < regionList.length; region++){
    console.log(region);
    //output += "<li>" + regionList[region]._nickname + "</li>";
    output += '<li class="mdl-list__item mdl-list__item--two-line" onclick=viewRegion('+region+')>' +
              '<span class="mdl-list__item-primary-content">' +
                '<span>' + regionList[region]._nickname + '</span>' +
                '<span class="mdl-list__item-sub-title">' + regionList[region]._date + '</span>' +
              '</span>' +
              '</li>'
    }
}

regionListRef.innerHTML = output;

function viewRegion(regionIndex)
{
    console.log(regionIndex);
    // Save the desired region to local storage so it can be accessed from view region page.
    localStorage.setItem(APP_PREFIX + "-selectedRegion", regionIndex); 
    // ... and load the view region page.
    location.href = 'viewRegion.html';
}
