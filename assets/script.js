// These are page elements that need to be declared as global variables so that we can do stuff to them later on
var queryInputEl = $("#query-input");
var submitBtn = $("#submit-button");
var dropDown = $("#format-select");

// this is the event listener that will call the handleQuery function.
submitBtn.on("click", handleQuery);

function handleQuery () {
    var formatType = $("#format-select option:selected").text();
    var queryValue = queryInputEl.val();
    console.log(formatType);
    console.log(queryValue);
// this line validates the input to make sure that someone has actually searched for something and not just a blank search
        if (!queryValue){
// console.error displays an error message in the console.
            console.error("You need an input value!");
            return;
        }
//this line creates a new URL using the query the user has input in the select and input elements
    var queryString = "./search-results.html?q=" + queryValue + "&format=" + formatType;
// the location.assign() function reroutesthe browser to a different page
// here that is the search-results.html page (which is the other html page we created), with the query and format creating query parameters
        location.assign(queryString);
}

// // function that fetches the data from the library of congress using the fetch method
// fetch("https://www.loc.gov/search?fo=json&q=")

// //