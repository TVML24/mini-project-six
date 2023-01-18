// These are page elements that need to be declared as global variables so that we can do stuff to them later on
var searchReminder = $("#result-text");
var resultHolder = $("#result-content");
var queryInputEl = $("#query-input-two");
var submitBtn = $("#submit-button-two");
var dropDown = $("#format-select-two");
var goBack = $("#go-back");
var resultsHeader = $('#head-results');

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
// this will return an object comprised of all of the response data
            fetch(locationqueryURL)

// .then() allows you to plan an asychronous action to be started after the previous one is completed
// then takes a promise -- here the promise is the return of the completed object. Hence when the promise has been fulfilled the execution will continue.
// e.g. here the code execution will stop until the fetch is completed (in case there is a delay in getting the info from the server)
// so after the data has been fetched and returned as a response object, a function is created and we pass the response to that un-named function
             .then (function(response) {
// The ok read-only property of the Response object contains a Boolean stating whether the response was successful (status in the range 200-299) or not.
// hence here if the request is not successful
                if (!response.ok) {
// The throw statement throws a user-defined exception. Execution of the current function will stop (the statements after throw won't be executed)
// and control will be passed to the first catch block in the call stack. If no catch block exists among caller functions, the program will terminate. 
// this is a way repeated requests can be made if the first is not successful
                    throw response.json();
                }
// if everything is ok the function will return the response parsed with JSON
                return response.json();              
            })
// then() method is applied again to make sure that this code waits for the promise to be fulfilled before running
             .then (function (locResults) {
                console.log(locResults);
// if there are no results found it will log no results in the console and on the page
// results here refers to the data that fulfilled the promise, here the return of response.json().
                if(!locResults.results.length) {
                    console.log("No Results Found!");
                    searchReminder.text("");
                    resultsHeader.text("Sorry, No Results Found!");
// otherwise it will clear the resultHolder element of text and run the for loop
// the for loop will call the function printResults() for every result passed to it
                } else {
                    resultHolder.text("");
                    for (var i =0; i <locResults.results.length; i++) {
                        printResults(locResults.results[i]);
                    }
                }
            })
// above there was a throw exception, here is the catch
// should an error be encountered (and the promise unable to be fuilfilled) the code will resume from this block
             .catch (function (error) {
                console.error(error);
                });
}

// this is the function that will print the results on the page
// it has the resultobject passed to it from the end of the searchAPI function
// this means that the return will be each value in the object
// e.g. {access_restricted: false, aka: Array(5), campaigns: Array(0), contributor: Array(1), date: '1912', …} and so on
function printResults(resultObj) {
    console.log(resultObj);
// creates a div element
    var resultCard = document.createElement("div");
// adds classes to an element seperated by spaces (these are bootstrap classes)
        resultCard.classList.add("card", "bg-light", "text-dark", "mb-3", "p-3");
// adds another div
    var resultBody = document.createElement("div");
    console.log(resultBody);
// adds a class to this div
        resultBody.classList.add("card-body");
// appends the first div to the second
        resultCard.append(resultBody);
// creates a h3 element
    var titleEl = document.createElement('div');
// sets the text to match the title key of the resultObj object
        titleEl.innerHTML = resultObj.title;
// creates a body paragraph
    var bodycontentEl = document.createElement('p');
// changes the content of the paragraph to be (plaintext) 'Date' followed by the return from the date key in the resultObj object.
// this is followed by a line break 
        bodycontentEl.innerHTML= "<strong> Date: </strong>" + resultObj.date + "</br>";
// if the result has a subject key in the resultObj object...
        if (resultObj.subject) {
// add the text (to what is already inside the p element) (plaintext) 'subject' and the return from the subject key from the resultObj object 
// the join method is then used with ", " to join all the elements of the array together in a concatenated object.
// the ", " means that you will see those characters between each element in the array.
            bodycontentEl.innerHTML += "<strong> Subject: </strong>" + resultObj.subject.join(", "); + "</br>";
        } else {
            bodycontentEl.innerHTML += "No Subject Text for this Entry";
        }
        if (resultObj.description) {
            bodycontentEl.innerHTML += "<strong> Description: </strong>" + resultObj.description[0];
        } else {
            bodycontentEl.innerHTML += "No Description Text for this Entry";
        }
    var linkButton = document.createElement('a');
        linkButton.innerHTML = "Read More";
        linkButton.setAttribute("href", resultObj.url);
        linkButton.classList.add("btn", "btn-dark");
        resultBody.append(titleEl, bodycontentEl, linkButton);
        resultHolder.append(resultCard);
    }

// this is the event listener that will call the handleQuery function.
submitBtn.on("click", handleQuery);

function handleQuery () {
    var formatType = $("#format-select-two option:selected").text().toLowerCase();
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

    

grabParams();