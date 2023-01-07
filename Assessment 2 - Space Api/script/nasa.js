// NASA API KEY
var nasakey = "fdlQhb62Szn7dtpYyag7qcPGVprhsOxQDYoXgeQ9"


/* Function to call the nasa APOD api
   (and grab most recent) */
function getAPOD() {
    var queryURL = "https://api.nasa.gov/planetary/apod?api_key=" + nasakey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(response => {
        pushAPOD(response);
        // console.log(response);
    });
}

/* Function to call the nasa APOD api 
   for a given date */
function getAPODbyDate(date) {
    var queryURL = "https://api.nasa.gov/planetary/apod?date=" + date + "&api_key=" + nasakey;
    // Grab today's date and turn it to an int
    let today = parseInt(moment().format("YYYYMMDD"));
    // turn the input date into a int for comparison
    let inputDate = parseInt(date.split("-").reduce((a, b) => a+b))
    // ONLY PERFORM THE AJAX CALL if 
    // the given date is between today's date and June 20, 1995
    if (inputDate <= today && inputDate >= 19950620){
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(response => {
            pushAPOD(response);
        });
    }
}


/* Function to push the relevant parts of the APOD
   into the page elements */
function pushAPOD(response) {
    // Save the url and the destination div
    let apodURL = response.hdurl;
    let apodDiv = $("#apod");
    // Empty destination
    apodDiv.empty();
    // Add media Title 
    apodHeader = $("<h5>").text(response.title);
    apodDiv.append(apodHeader);
    //CHECK IF THE MEDIA IS A VIDEO OR AN IMAGE
    if (response.media_type === "video") {
        //Make an iframe if video
        let videoDiv = $("<div>").addClass("embed-responsive embed-responsive-16by9");
        let apodVideo = $("<iframe>");
        apodVideo.attr("src", response.url);
        apodVideo.addClass("embed-responsive-item");
        videoDiv.append(apodVideo);
        apodDiv.append(videoDiv);
    } else if (response.media_type === "image") {
        //make an img if image
        let apodImg = $("<img>").attr("src", apodURL);
        apodImg.addClass("w-100");
        apodDiv.append(apodImg);
    }
    // Add the description for the APOD
    let textp = $("<p>").text(response.explanation);
    apodDiv.append($("<br>"), textp);
}



/* A function to create and return a carousel element
   from a provided list of links and a id name */
function createCarousel(list, divID) {
    // Creates the inner part of the carousel
    // containing the images from the list of links provided
    let carouselInner = $("#" + divID);
    list.forEach(element => {
        //makes the item div
        let carouselItem = $("<div>");
        carouselItem.addClass("carousel-item");
        //creates the image amd adds classes
        let carouselImage = $("<img>");
        carouselImage.attr("src", element)
        carouselImage.addClass("d-block carousel-image mx-auto w-100");
        //appends the created elements to the inner
        carouselImage.appendTo(carouselItem);
        carouselItem.appendTo(carouselInner);

    });

    // Activates the first element in the carousel
    carouselInner.children().first().addClass("active");
}

/* Function to grab time of last known
   Coronal Mass Ejection from DONKI */
function getCMEfromDONKI() {
    let queryURL = "https://api.nasa.gov/DONKI/CME?api_key=" + nasakey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(response => {
        $("#cme-date").text(response[response.length - 1].startTime);
    })
}

/* Function to grab time of last known
   Solar Flare from DONKI */
function getFLRfromDONKI() {
    let queryURL = "https://api.nasa.gov/DONKI/FLR?startDate=2020-01-01&api_key=" + nasakey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(response => {
        // console.log(response)
        $("#flr-date").text(response[response.length - 1].beginTime);
    })
}


function getNASAsearch(searchTerm){
    if(searchTerm != null){
        let queryURL = "https://images-api.nasa.gov/search?media_type=image&q=" + searchTerm;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(response => {
            // console.log(response);
            pushNASAsearch(response);
        });

    }
}

function pushNASAsearch(response){
    var resultsDiv = $("#nasa-results");
    resultsDiv.empty();
    var results = response.collection.items
    // console.log(results);
    if (results.length >= 10) {
        results = results.slice(0,10);
    }
    // console.log(results)
    results.forEach(element => {

        let imgLink = element.links[0].href;
        let imgDescription = element.data[0].description;
        let imgTitle = element.data[0].description;
        let resultCard = $("<div>");
        resultCard.addClass("card bg-dark");
        let cardImg = $("<img>").attr("src", imgLink)
        cardImg.attr("alt", imgTitle);
        cardImg.addClass("card-image-top");
        let cardBody = $("<div>").addClass("card-body");
        

        if (imgDescription != imgTitle) {
            let cardHeader = $("<h5>").text(imgTitle);
            cardHeader.addClass("card-title")
            cardBody.append(cardHeader);
        }
  
        let cardText = $("<p>").text(imgDescription);
        cardText.addClass("card-text")
        cardBody.append(cardText);
        resultCard.append(cardImg,cardBody);
        resultsDiv.append(resultCard);
    })
}

function setMaxDate(todayStr){
    $("#apod-date").attr("max", todayStr);
}

// On document load, grab the content from the APIs
$(document).ready(x => {
    let todayStr = moment().format("YYYY-MM-DD");
    // getAPOD();
    getAPODbyDate(todayStr);
    setMaxDate(todayStr);
    getCMEfromDONKI();
    getFLRfromDONKI();
});

$("#apod-btn").on("click", function(){
    getAPODbyDate($("#apod-date").val());
});

$("#search-button").on("click", function(event){
    event.preventDefault();
    getNASAsearch($("#search-input").val().trim());
})



//Leaflet.js Map Setup
const mymap = L.map('mapid').setView([51.505, -0.09], 13);
const tileURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const icon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/jlthompson96/NASA-API-Website/06c5ec7d068a51683574d54959441ff8ff75abba/assets/iss.svg",
  iconSize:[175,175]
});
const issMarker = L.marker([0,0],{icon:icon}).addTo(mymap);
L.tileLayer(tileURL, {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'your.mapbox.access.token'
}).addTo(mymap);

const iss_url = "https://api.wheretheiss.at/v1/satellites/25544";

//ISS Info
async function getISSInfo(){
  const response = await fetch(iss_url);
  const data = await response.json();
  const{latitude,longitude, velocity, altitude} = data;
  mymap.setView([latitude,longitude],3);
  issMarker.setLatLng([latitude,longitude]);
  const formatter = new Intl.NumberFormat('en');
  document.getElementById('lat').textContent = latitude.toFixed(4);
  document.getElementById('lng').textContent = longitude.toFixed(4);
  document.getElementById('velocity').textContent = formatter.format(velocity.toFixed(2));
  document.getElementById('altitude').textContent = altitude.toFixed(2);
}


getISSInfo();
setInterval(getISSInfo,1000);


