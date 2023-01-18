// These are page elements that need to be declared as global variables so that we can do stuff to them later on
var searchReminder = $("#result-text");
var resultHolder = $("result-content");
var queryInputEl = $("#query-input-two");
var submitBtn = $("#submit-button-two");
var dropDown = $("#format-select-two");
var goBack = $("#go-back");

// this grabs the url with the parameters provided from the main search page
// it only grabs the text after the html
// it then uses .split() at the character &
// this seperates the two queries
// e.g. now if logged params returns an array containing 0:"?q=Helmet" (the searchquery we made) and 1:"format=Books (what we selected from the dropdown).
function grabParams() {
    var params = document.location.search.split("&");
// The pop() method removes the last element from an array and returns that element. This method changes the length of the array. 
// so here we started with ?=Helmet and split it into [?q=, Helmet] then returned the last element.  
    var query = params[0].split("=").pop();
    var format = params[1].split("=").pop();
// this element will return if there is no query
        if (!query) {
            return;
        }
// this element alters the text in the searchReminder element to display the contents of the search
        searchReminder.text("'" + query + "'" + " in " + format);
// this calls the function search API and passes the variables query and format
    searchApi(query, format);
}

function searchApi(query, format) {
// this sets the base url
    var locationqueryURL = "https://www.loc.gov/?fo=json";
// this instructs that if the format URL is truthy the format should be inserted into the url between the domain name and the query for JSON
// so the outcome would be "https://www.loc.gov/books/?fo=json"
        if (format) {
            locationqueryURL = "https://www.loc.gov/" + format + "/?fo=json";
        }
// after the above the next lines add &q= to signify a query parameter followed by our variable query which contains out original search term
        locationqueryURL = locationqueryURL + "&q=" + query;
// it then calls the function fetch with the variable of the URL as it's parameter
            fetch(locationqueryURL);
}


grabParams();