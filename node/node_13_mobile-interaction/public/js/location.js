
/*** LOCATION STUFFS *** /
//
//
*/
// var location_timeout = setTimeout("geolocFail()", 10000);

getLocation();

function getLocation() {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, function(error) {
            clearTimeout(location_timeout);
            // alert(JSON.stringify(error));
            alert("Your location settings are disabled. To enable on iPhone, go to: \n Settings > General > Reset > Reset Location");
            geolocFail();
        });
    } else {
        $("#loc_copy").text("Geolocation is not supported by this browser.");
    }
}

// function geolocFail() {
//     console.log("failed at getting geolocation");
//     //$("#loc_copy").text("Unable to get Location");
// }

function showPosition(position) {
    //clearTimeout(location_timeout);
    //$("#loc_copy").text("Location Found!").hide( "drop", { direction: "down" }, "slow" );
    //$("#loc_copy").text("Location Found!").delay(1000).hide("slow", null);
    $("#loc_copy").text("Location Found!");
    $("#loc_copy").delay(500).fadeTo("slow", 0.0);

    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    console.log("got location >> lat: " + latitude + "  lon: " + longitude);

    $("#_lat").val(latitude); //set form value
    $("#_lon").val(longitude); //set form value
    $("#loc_lat").text('latitude: ' + latitude); //display in footer
    $("#loc_lon").text('longitude ' + longitude); //display in footer
    // alert(">>lat: "+ position.coords.latitude +
    // " >>lon: " + position.coords.longitude);
}