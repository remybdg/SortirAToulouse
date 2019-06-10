/* Code principale */

//déclaration des listes d'événements
var eventsList;
var originalDb;

//quand tout le html est chargé on lance le code
document.addEventListener('DOMContentLoaded', function() {
	
	//lancement de l'animation d'ouverture, du chargement de l'API GoogleMaps et de la requete AJAX
	Promise.all([ouverture(), loadData(), googleMapsLoadingScript(event)])
	//quand les trois fonctions ont réussis, on initialise la nouvelle map
	.then(function (result1, result2, content) {
		console.info('API googleMaps chargé !');
		console.log(result1, result2, content);
		return initMap();
	})
	//puis on lance la deuxieme animation d'ouverture
	.then(function () {
		console.info('initMap ok!');
		return ouverture2();
	})
	//puis on affiche les sections du site
	.then(function () {
		console.info('ouverture2 ok!');
		displayMainSections(originalDb);
	})
	//si erreur:
	.catch(function (err) {
		console.error('Erreur !');
		console.dir(err);
	});

});

/*-----------fonctions de lancement du site-------------*/
//animation de lancement du site
function ouverture() {
	return new Promise(function(resolve) {
		//on attend la fin de l'animation pour résoudre la promesse
		document.getElementById("leftSide").addEventListener("transitionend", function(event) {		
			resolve('1st transition ended');
		}, false);	
		
		
		//slide des deux panneaux jusqu'au centre de l'écran
		document.getElementById("leftSide").style.left = "0";
		document.getElementById("rightSide").style.left = "50vw";			
		
	});	
}

//requete AJAX de récupération de la liste originale d'evenements
function loadData() {
		
	return new Promise(function(resolve, reject) {
	
		$.get('https://data.toulouse-metropole.fr/api/records/1.0/search/?dataset=agenda-des-manifestations-culturelles-so-toulouse&rows=300&sort=-date_debut', onAjaxGetContent);

		function onAjaxGetContent(reponse) {
			originalDb = reponse.records;
			//console.log(originalDb);
			if (reponse!=null) {
				resolve(originalDb);
			} else {
				reject("echec load ajax");
			}
					
		}

	})
}

//lancement de la deuxième animation d'ouverture
function ouverture2() {
	return new Promise(function(resolve) {
		
		//on enlève le fond noir du départ
		document.getElementById("blackBg").classList.add("hidden");
		
		//affichage de maps
		document.getElementById("googleMap").classList.remove("hidden");

		//position définitive des panneaux
		document.getElementById("rightSide").style.left = "67vw";
		document.getElementById("sortirA").style.left = "-40vw";
		document.getElementById("leftSide").style.width = "33vw";
		document.getElementById("rightSide").style.width = "33vw";	
		
	//on attend la fin de l'animation pour résoudre la promesse
	document.getElementById("toulouse").addEventListener("transitionend", function(event) {		
		resolve('transition ended');
	}, false);	
		
		document.getElementById("toulouse").style.left = "101vw";
		
	});
}

//affichage des sections du site et initialisation nouvelle liste d'evenements
function displayMainSections(originalDb) {
	
	//création de l'objet de la class EventsList
	eventsList = new EventsList(originalDb);
	
	//récupération de la date du jour
	eventsList.setDate(new Date());
	
	//création de la nouvelle liste d'evenements
	eventsList.setDbTable();
	
	//affichage du prochain evenement
	eventsList.nextEvent();
		
	//mise en place d'event listener sur les boutons de recherche par catégorie
	setCategorySearchListener();
	
	//remplissage du calendrier
	renderCalendar();

	//affichage des sections et affichage defiinif du titre
	document.getElementById("leftContent").classList.remove("hidden");
	document.getElementById("events").classList.remove("hidden");
	document.getElementById("permanentSortirA").classList.remove("hidden");
	document.getElementById("permanentToulouse").classList.remove("hidden");
	document.getElementById("sortirA").classList.add("hidden");
	document.getElementById("toulouse").classList.add("hidden");	
	
}

/* ajax alternatif

ajaxGet("https://data.toulouse-metropole.fr/api/records/1.0/search/?dataset=agenda-des-manifestations-culturelles-so-toulouse&rows=200&sort=date_debut&facet=type_de_manifestation", function (reponse) {

    var manif = JSON.parse(reponse);
	console.log(manif);

    manif.forEach(function(records) {
       console.log(manif.records);
   })
});
*/



/*--------------------------Google Map-------------------------*/

//déclaration de la map et de l'array contenant les markers
var map;
var markers = [];

//lancementdel'API GoogleMaps
function googleMapsLoadingScript(event) {
	return new Promise(function(resolve, reject) {	
		var googleMaps = document.createElement('script');
		googleMaps.src= "https://maps.googleapis.com/maps/api/js?key=AIzaSyDPLmut0IgchQzUWnBUVP0zaZVPKplQGH4";
		document.getElementById("googleMap").appendChild(googleMaps);
		
		googleMaps.onload = function(event) {
			resolve(event);
		}
		
		googleMaps.onerror = function(err) {
			reject(err);
		}		
	});
}


//initialisation de la map
function initMap() {
	
	//coordonnées de Toulouse qui serve debase pour le centrage
	var toulouse = {lat: 43.604599, lng: 1.444141};
	
	//tyle personnalisé de la map
	map = new google.maps.Map(document.getElementById('googleMap'), {
		zoom: 14,
		center: toulouse,
		mapTypeId: 'terrain',
		styles:[
			{
				featureType: "administrative",
				elementType: "labels.text.fill",
				stylers: [{color: "#c7c4c7"}]
			},
			{
				featureType: "administrative.country",
				elementType: "labels.text.stroke",
				stylers: [{color: "#6d438d"}]
			},
			{
				featureType: "administrative.province",
				elementType: "geometry.stroke",
				stylers: [{visibility: "off"}]
			},
			{
				featureType: "administrative.neighborhood",
				elementType: "geometry.fill",
				stylers: [{color: "#8e6ba8"}]
			},
			{
				featureType: "landscape",
				elementType: "geometry",
				stylers: [
					{
						lightness: "0"
					},
					{
						saturation: "0"
					},
					{
						color: "#f4f5f1"
					},
					{
						gamma: "1"
					}]
			},
			{
				featureType: "landscape.man_made",
				elementType: "all",
				stylers: [
					{
						lightness: "-3"
					},
					{
						gamma: "1.00"
					}]
			},
			{
				featureType: "landscape.natural.terrain",
				elementType: "all",
				stylers: [
					{
						visibility: "off"
					}]
			},
			{
				featureType: "poi",
				elementType: "all",
				stylers: [
					{
						visibility: "off"
					}]
			},
			{
				featureType: "poi",
				elementType: "geometry.fill",
				stylers: [
					{
						color: "#b59ac9"
					}]
			},
			{
				featureType: "poi.park",
				elementType: "geometry.fill",
				stylers: [
					{
						color: "#cbe2a7"
					},
					{
						visibility: "on"
					}]
			},
			{
				featureType: "road",
				elementType: "all",
				stylers: [
					{
						saturation: -100
					},
					{
						lightness: "65"
					},
					{
						visibility: "simplified"
					}]
			},
			{
				featureType: "road.highway",
				elementType: "all",
				stylers: [
					{
						visibility: "simplified"
					}]
			},
			{
				featureType: "road.highway",
				elementType: "geometry.fill",
				stylers: [
					{
						color: "#dbcce4"
					},
					{
						visibility: "simplified"
					}]
			},
			{
				featureType: "road.highway",
				elementType: "labels.text",
				stylers: [
					{
						color: "#4e4e4e"
					}]
			},
			{
				featureType: "road.arterial",
				elementType: "labels.text.fill",
				stylers: [
					{
						color: "#787878"
					}]
			},
			{
				featureType: "road.arterial",
				elementType: "labels.icon",
				stylers: [
					{
						visibility: "off"
					}]
			},
			{
				featureType: "transit",
				elementType: "all",
				stylers: [
					{
						visibility: "simplified"
					}]
			},
			{
				featureType: "transit",
				elementType: "geometry.fill",
				stylers: [
					{
						color: "#b59ac9"
					}]
			},
			{
				featureType: "transit",
				elementType: "labels.text.fill",
				stylers: [
					{
						color: "#947fa0"
					},
					{
						saturation: "-50"
					},
					{
						lightness: "0"
					}]
			},
			{
				featureType: "transit.line",
				elementType: "geometry.fill",
				stylers: [
					{
						color: "#b59ac9"
					}]
			},
			{
				featureType: "transit.line",
				elementType: "labels.text.fill",
				stylers: [
					{
						lightness: "0"
					}]
			},
			{
				featureType: "transit.station.airport",
				elementType: "labels.icon",
				stylers: [
					{
						hue: "#0a00ff"
					},
					{
						saturation: "-77"
					},
					{
						gamma: "0.57"
					},
					{
						lightness: "0"
					}]
			},
			{
				featureType: "transit.station.rail",
				elementType: "labels.text.fill",
				stylers: [
					{
						color: "#8f7f93"
					},
					{
						lightness: "0"
					}]
			},
			{
				featureType: "transit.station.rail",
				elementType: "labels.icon",
				stylers: [
					{
						lightness: "42"
					},
					{
						gamma: "0.75"
					},
					{
						saturation: "-68"
					},
					{
						hue: "#9200ff"
					}]
			},
			{
				featureType: "water",
				elementType: "all",
				stylers: [
					{
						color: "#eaf6f8"
					},
					{
						visibility: "on"
					}]
			},
			{
				featureType: "water",
				elementType: "geometry.fill",
				stylers: [
					{
						color: "#cee5f2"
					}]
			},
			{
				featureType: "water",
				elementType: "labels.text.fill",
				stylers: [
					{
						lightness: "-49"
					},
					{
						saturation: "-53"
					},
					{
						gamma: "0.79"
					}]
			}]
	});
}

// ajouter un marker et le rajouter dans l'array markers
function addMarker(location, title) {
  //console.log("addm ",markers);

	var marker = new google.maps.Marker({
		animation: google.maps.Animation.DROP,
		icon: image,
		position: location,
		map: map,
		title: title
	});
	markers.push(marker);
}

//rajouter tous les markers de l'array markers sur la map
function setMapOnAll(map) {
	for (var i = 0; i < markers.length; i++) {
	    markers[i].setMap(map);
	}
}

//on enleve les markers sur maps mais on les garde dans l'array markers pour un futur réaffichage
function clearMarkers() {
	setMapOnAll(null);
}

//afficher tous les markers de l'array markers
function showMarkers() {
	//console.log(markers);
	setMapOnAll(map);
}

// enleve les markers de la map et les supprime de l'array markers
function deleteMarkers() {
	clearMarkers();
	markers = [];
}	




/*--------------------------Calendrier-------------------------*/

//déclaration de la date courante et initialisationà la date du jour
let CURR_DATE = new Date;

const MONTHS = [
  'Janvier',
  'Fevrier',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Aout',
  'Septembre',
  'Octobre',
  'Novembre',
  'Decembre'
];

function getTotalDaysInMonth(year, month) {
 
    return 32 - new Date(year, month, 32)
    .getDate();
}

const grid = document.querySelectorAll('#calendar-table td');
const dateText = document.getElementById('date-text');


//au click sur une cellule e du calendrier(si celle-cicorrespond bien à un jour)
//la date courrante devient la date corrspondante au jour cliqué
grid.forEach(cell => cell.onclick = function() {
	const selectedDate = cell.innerHTML;
	if (selectedDate === '')
		return;
	CURR_DATE.setDate(selectedDate);
	//dans la propriété date d'eventsList, on remplace la date du jour par la date clické 
	eventsList.setDate(CURR_DATE);

	//affichage des evenements du jour
	eventsList.dayEvents();
 
	renderCalendar();
  
});

const calendarTitle = document.querySelectorAll('#calendar-title > span')[0];

// clears all cells
function clearGrid() {
    grid.forEach(cell => {
		cell.innerHTML = '';
		cell.classList.remove('today-cell');
		cell.classList.remove('colorCell');
  });
}

//colore les cellules-dates contenant des evenements
function colorGridCells() {
    grid.forEach(cell => {
		//on recupere le tableau des jours "remplis" d'au moins 1 evenement
	    var daysToColorTable = eventsList.setCalendarDaysColors();
		//on boucle dedans
	    for (cpt = 0; cpt < daysToColorTable.length; cpt++) {
			//si un jour du calendrier correspond à un jour du tableau
		    if (cell.innerHTML == daysToColorTable[cpt]) {
				//on colore la case du calendrier correspondante
			    cell.classList.add("colorCell");
		    }
	   }
   
    });	
}


function renderCalendar(date = CURR_DATE) {	
	clearGrid();

	// sets month and year
	calendarTitle.innerText = `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;

	const dayOfWeek  = date.getDay();
	const dateOfMnth = date.getDate();

	let totalMonthDays = getTotalDaysInMonth(
		date.getFullYear(),
		date.getMonth()
	);

	let startDay = dayOfWeek - dateOfMnth % 7 ;

	if (startDay < 0)
		startDay = (startDay + 35) % 7;

	for ( let i = startDay; i < totalMonthDays + startDay; i++ )

		grid[i % 35].innerHTML = (i - startDay + 1);

		colorGridCells();

		grid[(startDay + dateOfMnth - 1) % 35].classList.add('today-cell');
  
	}

	[...document.getElementsByClassName('btn')].forEach(btn => {
  
	let incr = 1;
	// left button decreases month
	if (btn.classList.contains('left'))
		incr = -1;

	btn.onclick = function() {
		CURR_DATE.setMonth(CURR_DATE.getMonth() + incr);

		renderCalendar(); 
		
		//au chargement d'un nouveau mois on relance la coloration des jours evenements
		eventsList.setCalendarDaysColors();  

	};
  
})



// function affichage de date
function displayDate(dateToDisplay) {

	var options =  {weekday: "long", year: "numeric", month: "long", day: "numeric"};
	return dateToDisplay.toLocaleDateString('fr-FR', options);
}

/*---------------------recherche par categorie--------------------------------*/

function setCategorySearchListener() {
	
	var categoriesButtonElts = document.getElementsByClassName("categoriesButton");
	//mise en place event listener sur les boutons de recherche par categorie
	for (cpt = 0; cpt < categoriesButtonElts.length; cpt++) {
		categoriesButtonElts[cpt].addEventListener('click', eventsList.getEventsByCategory.bind(eventsList));
	}
}











