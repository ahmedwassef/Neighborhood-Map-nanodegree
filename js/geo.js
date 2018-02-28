var SearchText = ko.observable("");
var Places =[
   {
		position: {lat: 30.0444196, lng: 31.23571160000006},
		name: "cairo, Egypt ",
		wikipedia: "cairo"
	},

    {	position: {lat: 30.045131 , lng: 31.223835},
		name: "cairo tower, Egypt ",
		wikipedia: "cairo tower"
	},
    {	position: {lat: 30.0427343 , lng:31.2241919},
		name: "Cairo Opera House, egypt ",
		wikipedia: "Cairo Opera House"
	},
    {	position: {lat: 24.977941 , lng: 32.873762},
		name: "The Temple of Horus at Edfu, Egypt ",
		wikipedia: " Temple of Edfu"
	},
	{
		position: {lat: 30.096655, lng: 31.662533},
		name: "Madinaty, Cairo Governorate, Egypt",
		wikipedia: "Madinaty"
	},
	{
		position: {lat: 30.063486, lng: 31.230076},
		name: "Boulaq,Cairo Governorate, Egypt",
		wikipedia: "Boulaq"
	},
	{
		position: {lat: 25.066668, lng: 34.900002},
		name: "Marsa Alam, Qesm Marsa Alam, Red Sea Governorate, Egypt ",
		wikipedia: "Marsa Alam"
	},
	{
		position: {lat: 24.978548, lng: 32.875820},
		name: "Edfu, Aswan Governorate, Egypt",
		wikipedia: "Edfu",
	}
  ];
  
var placeinfo = function (data, map){
	var e = this;
	this.position = ko.observable(data.position);
	this.name = ko.observable(data.name);
	this.marker = ko.observable();
    this.content = '<h4>' + e.name() + '</h4>';
	this.wikipedia = data.wikipedia;

    // passing data to marker

	this.marker = new google.maps.Marker({
		position: this.position(),
		map: map,
		icon: 'http://www.fmschool.com/images/icons/locationIconHover50x50.png',
		title: this.name()
	  });
      
    e.marker.setAnimation(null); 

	// wikipedia search using ajax and error  handler

	$.ajax({
		url:'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&callback=wikiCallBack&search='+e.wikipedia,
		dataType: 'jsonp',
		timeout: 2000
	}).done(function(data) {
		   e.content = '<h4>' + e.name() + '</h4>'+'<p>' + data[2][0] +'from '+'<a href=' + data[3][0] + ' target="blank"> Wikipedia</a></p>';
	}).fail(function(jqXHR, textStatus){
			alert("an error happened when  searching in wikipedia or URL isn't correct  ");
	});
    	//when search filter is reset,  the visibility was rechecked

	this.visible = ko.computed(function(){
		if (SearchText().length > 0){
			return (e.name().toLowerCase().indexOf(SearchText().toLowerCase()) > -1);
		}
		else{
			return true;
		}
	},this);

	this.toggleBounce = function() {
		if (e.marker.getAnimation() !== null) 
		{
			e.marker.setAnimation(null);
		} 
		else 
		{
			e.marker.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function(){
				e.marker.setAnimation(null);
			}, 1000);
		}
	};
};

/*
* knockout viewmodel
 * function
* */
var ViewModel = function(){
	var e = this;
	//init map
	this.map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 30.0444196, lng: 31.23571160000006},
		zoom: 13,
         disableDefaultUI: !0
	});
	//initialize for marker List
	this.placesList = ko.observableArray([]);
		Places.forEach(function(placeItem){
			e.placesList.push(new placeinfo(placeItem, e.map));
	});
	//setup the event listeners for marker clicks
	this.placesList().forEach(function(placeinfo){
		google.maps.event.addListener(placeinfo.marker, 'click', function () {
			e.placeClicker(placeinfo);
		});
	});
	//show the info Window when click on marker or list
	var infowindow = new google.maps.InfoWindow();
	this.placeClicker = function(placeinfo){
		infowindow.setContent(placeinfo.content);
		infowindow.open(this.map, placeinfo.marker);
		placeinfo.toggleBounce();
	};

    // show searchFilter result
	e.SeacrhList = ko.computed(function(){
		var searchFilter = [];
		this.placesList().forEach(function(placeinfo){
			if (placeinfo.visible())
			{
				searchFilter.push(placeinfo);
				placeinfo.marker.setVisible(true);

			}
			if (!placeinfo.visible())
			{
				placeinfo.marker.setVisible(false);

			}
		});
		return searchFilter;
	}, this);

// show and hide search box
	document.getElementById("tog").addEventListener("click", changeWidth);
	function changeWidth() {

		if(document.getElementById("side").style.width!="40%")
		{
			document.getElementById("side").style.transitionDelay = "1000";
			document.getElementById("side").style.width = "40%";
			document.getElementById("side").style.height = "100%";
			document.getElementById("tog").style.marginLeft = "40%";
			document.getElementById("map").style.transitionDelay = "1000";
			document.getElementById("map").style.width = "60%";
		}
		else {
			document.getElementById("side").style.width = "0%";
			document.getElementById("tog").style.marginLeft = "2%";
			document.getElementById("map").style.width = "100%";
		}
	}
};
  

// start the   project
function projectStart(){
	ko.applyBindings(new ViewModel());
}

function mapError() {
	// error handling here
	alert("an Error happened in google map resources");
}