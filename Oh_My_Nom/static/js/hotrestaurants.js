var LOCATION; //a python two value list of latitude and longitude
var RESTAURANTS; // a list of dictionaries containing: image_url; google_url; name; address
var INDEX = 0;

console.log("Javascript is Running! YAY!");
//THESE ARE THE 4 EVENTS THAT ARE HANDLED
window.onload = function(){
	console.log("Document has Loaded!");
	GetLocation();
	document.getElementById("more_information").style.display = "none";
}

function UpdateLocation(){
	console.log("Update Location Pressed!");
	GetLocation(document.getElementById("location_text").value);
	document.getElementById("more_information").style.display = "none";
}

function NextRestaurant(){
	if(RESTAURANTS == null){
		console.log("no restaurants are loaded!");
	}
	else{
		console.log("Getting next restaurant");
		console.log(RESTAURANTS);
		console.log(RESTAURANTS.length);
	
		INDEX = (INDEX+1)%RESTAURANTS.length;
		console.log("restaurant index:");
		console.log(INDEX);	
	
		document.getElementById("restaurant_name").innerHTML = RESTAURANTS[INDEX].name;
		document.getElementById("restaurant_image").src = RESTAURANTS[INDEX].image_url;
		document.getElementById("restaurant_address").innerHTML = RESTAURANTS[INDEX].address;
		document.getElementById("more_information").style.display = "block";
	}	
}
function RestaurantClicked(){
	var xmlhttp = new XMLHttpRequest();
	var url = "/hotrestaurantclicked/"
	var request_json_string = '{ "place_id":"'+RESTAURANTS[INDEX].place_id+'" }';
	console.log(request_json_string);	
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			location.replace(RESTAURANTS[INDEX].google_url);
		}
	}
	xmlhttp.open("POST", url, true);
	xmlhttp.setRequestHeader("Content-Type", "application/json");
	xmlhttp.setRequestHeader("X-CSRFToken", getCookie("csrftoken"));
	xmlhttp.send(request_json_string);	
	console.log("sent post for redirect");
}


function GetLocation(location_text){	
	var xmlhttp = new XMLHttpRequest();
	var url = "/getlocation/";
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var location_json = JSON.parse(this.responseText);
			console.log("Location object received from server, /getlocation/");
			console.log(this.responseText);
			LOCATION = location_json.location
			document.getElementById("location_message").innerHTML = location_json.location_message
			//Do Stuff with location here
			GetRestaurants();
		}
	};
	var request_json_string = '{ "location_text":"'+location_text+'" }';
	xmlhttp.open("POST", url, true);
	xmlhttp.setRequestHeader("Content-Type", "application/json");
	xmlhttp.setRequestHeader("X-CSRFToken", getCookie("csrftoken"));
	xmlhttp.send(request_json_string);	
}
function GetRestaurants() {
	console.log("getting restaurants");
	var xmlhttp = new XMLHttpRequest();
	var url = "/getrestaurants/";	
	var request_json_string = '{ "location":'+JSON.stringify(LOCATION)+' }';
	console.log(request_json_string);
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			json_dict = JSON.parse(this.responseText);
			if(json_dict.status =="ok"){
				RESTAURANTS = json_dict.restaurants
				shuffle(RESTAURANTS);
				INDEX = 0;
				console.log("Restaurants object received from server, /getrestaurants/");
				console.log(this.responseText);
				NextRestaurant();
			}
			else{
				console.log("No restaurants found for that location");
			}
		}
	};
	xmlhttp.open("POST", url, true);
	xmlhttp.setRequestHeader("Content-Type", "application/json");
	xmlhttp.setRequestHeader("X-CSRFToken", getCookie("csrftoken"));
	xmlhttp.send(request_json_string);
}
function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for(var i = 0; i <ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

function shuffle(a) {
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}
