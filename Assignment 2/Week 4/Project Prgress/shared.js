// Shared code needed by the code of all three pages.

//global variables
var corner = {
        lat: [],
        lng: []
};

/*
var saveRegionRef = document.getElementById('save');


// Unhide the 'Next Game' button
saveRegionRef.hidden = true;
// Disable the 'Next Game' button so that it can't be clicked on
saveRegionRef.disabled = true;
*/

// Prefix to use for Local Storage.  You may change this.
var APP_PREFIX = "monash.eng1003.fencingApp";

// Array of saved Region objects.
var savedRegions = [];


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
        // adding a newregion to the regionlist
        this._regionList.push(newReg);
        var regionListvar = JSON.parse(localStorage.getItem("regionList"));
        
        if(regionListvar !== null) {
            regionListvar.push(newReg);
            localStorage.setItem("regionList", JSON.stringify(regionListvar));
        }
        else{
            localStorage.setItem("regionList", JSON.stringify(this._regionList)); 
        }

        //count++ // incrementing the number of the list
    }
    
    removeReg(regToRemove)
    {
        // Remove a region from the list
        
        var i = 0;
        
        do 
        {
            this.regionList[i].pop();
            i++;
        } while (regToRemove === this.regionList[i]);
    }

    getNumOfRegions()
    {
        return this._regionList.length;
    }
}



