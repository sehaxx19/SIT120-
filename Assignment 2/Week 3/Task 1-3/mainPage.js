// Code for the main app page (Regions List).
class Region 
{
    constructor(regNum, cornerLoc,regDate) 
    {
        this._regionIn = regNum;
        this._cornerLocation = cornerLoc;
        this._date = regDate;
    }

    set regionIn(regNum)
    {
        this._regionIn = regNum;
    }
    get regionIn()
    {
        return this._regionIn;
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
    constructor(regArray, numOfReg)
    {
        this._regionList = regArray;
        count = numOfReg;
    }

    set regionList(regArray)
    {
        this._regionList= regArray;
    }
    get regionList()
    {
        return this._regionList;
    }
    
    addReg(newReg)
    {
        // adding a newregion to the regionlist
        regionList.push(newReg);
        count++ // incrementing the number of the list
    }
    removeReg(regToRemove)
    {
        // Remove a region from the list
        do 
        {
            this.regionList[i].pop();
            i++;
        } while (regToRemove === this.regionList[i]);
    }

}
// The following is sample code to demonstrate navigation.
// You need not use it for final app.

function viewRegion(regionIndex)
{
    // Save the desired region to local storage so it can be accessed from view region page.
    localStorage.setItem(APP_PREFIX + "-selectedRegion", regionIndex); 
    // ... and load the view region page.
    location.href = 'viewRegion.html';
}
