/* class Event dont les objets seront les evenements avec leurs informations en propriétés*/

var Event = function() {
	this.nom;
	this.descrCourt;
	this.descrLong;
	this.age;
	this.isFree
	this.type = 'autres';
	
	this.lieu;
	this.lieuAdr1;
	this.lieuAdr2;
	this.CP;
	this.commune;
	
	this.long;
	this.lat;
	
	this.dateDeb;
	this.dateFin;
	this.horaires;

	this.mail;
	this.site;
	this.tel;
	
	this.marker;
	this.newEventWindow;
	this.iconType ='autres';
	this.color = 'autres';
};


Event.prototype.setNom = function(nom) {
	this.nom = nom;
};

Event.prototype.setDescrCourt = function(descrCourt) {
	this.descrCourt = descrCourt;
};

Event.prototype.setDescrLong = function(descrLong) {
	this.descrLong = descrLong;
};

Event.prototype.setAge = function(age) {
	this.age = age;
};

Event.prototype.setIsFree = function(isFree) {
	this.isFree = isFree;
};

Event.prototype.setType = function(type) {
	this.type = type;
};

Event.prototype.setIconType = function(iconType) {
	switch (iconType) {
		case 'Culturelle':
			this.iconType = 'culture.png';
			break;
		case 'Musique':
			this.iconType = 'music.png';
			break;			
		case 'Manifestation commerciale':
			this.iconType = 'commerce.png';
			break;			
		case 'Sports et loisirs':
			this.iconType = 'cycling.png';
			break;			
		case 'Insolite':
			this.iconType = 'insolite.png';
			break;			
		case 'Nature et détente':
			this.iconType = 'tree.png';
			break;		
		case 'Danse':
			this.iconType = 'dance.png';
			break;			
		default:
			this.iconType = 'trad.png';
			break;			
	}
};

Event.prototype.setColor = function(color) {
	switch (color) {
		case 'Culturelle':
			this.color = '#2f26b3';
			break;
		case 'Musique':
			this.color = '#d45cd6';
			break;			
		case 'Manifestation commerciale':
			this.color = '#5ec8bd';
			break;			
		case 'Sports et loisirs':
			this.color= '#ff8922';
			break;			
		case 'Insolite':
			this.color = '#f2f064';
			break;			
		case 'Nature et détente':
			this.color = '#36ba74';
			break;		
		case 'Danse':
			this.color = '#f34648';
			break;
		default:
			this.color = '#d44e64';
			break;			
	}
};

Event.prototype.setLieu = function(lieu) {
	this.lieu = lieu;
};

Event.prototype.setLieuAdr1 = function(lieuAdr1) {
	this.lieuAdr1 = lieuAdr1;
};

Event.prototype.setLieuAdr2 = function(lieuAdr2) {
	this.lieuAdr2 = lieuAdr2;
};

Event.prototype.setCP = function(CP) {
	this.CP = CP;
};

Event.prototype.setCommune = function(commune) {
	this.commune = commune;
};

Event.prototype.setLong = function(long) {
	this.long = long;
};

Event.prototype.setLat = function(lat) {
	this.lat = lat;
};

Event.prototype.setDateDeb = function(DateDeb) {
	this.dateDeb = DateDeb;
};

Event.prototype.setDateFin = function(dateFin) {
	this.dateFin = dateFin;
};

Event.prototype.setHoraires = function(horaires) {
	this.horaires = horaires;
};

Event.prototype.setMail = function(mail) {
	this.mail = mail;
};
	
Event.prototype.setSite = function(site) {
	this.site = site;
};	

Event.prototype.setTel = function(tel) {
	this.tel = tel;
};

/* mini-fiche evenement avec nom et description courte */
Event.prototype.nextEventWindow = function() {
	// création d'une div dans la partie droite d'affichage des résultat de recherche
	this.newEventWindow = document.createElement('div');
	this.newEventWindow.classList.add("newEventWindow");
	
	//affichage de la couleur de bg en fonction de la catégorie principale de l'event
	this.newEventWindow.style.backgroundColor = this.color;
	document.getElementById('events').appendChild(this.newEventWindow);
	
	//mise en place de l'event listener pour l'affichage de la fiche au click sur la mini fiche
	this.newEventWindow.addEventListener("click", this.eventFullDisplay.bind(this));

	//affichage d'un icone sur maps
	this.showOnMap();	
	
	//affichage nom et description de l'event
	var NETitle = document.createElement('h3');
	NETitle.innerHTML = this.nom ;
	this.newEventWindow.appendChild(NETitle);
	var NEDescr = document.createElement('div');
	NEDescr.innerHTML = this.descrCourt ;
	this.newEventWindow.appendChild(NEDescr);
};

/* fiche complète de l'evenement */
Event.prototype.eventFullDisplay = function(event) {
	//TO DO affichage de la fiche au niveau de sa mini fiche (et non pas systématiquement en haut)
	
	//on enleve les markers sur maps mais on les garde dans l'array markers pour un futur réaffichage
	clearMarkers();
	
	//création de la div
	this.fulldisplay = document.createElement('div');
	this.fulldisplay.classList.add("eventFullDisplay");
	
	//affichage de la couleur de bg en fonction de la catégorie principale de l'event	
	this.fulldisplay.style.backgroundColor = this.color;
	
	//création d'un bouton close
	var closeButton = document.createElement('div');
	closeButton.classList.add("closeButton");
	closeButton.innerText = "X";
	this.fulldisplay.appendChild(closeButton);	
	document.getElementById('events').appendChild(this.fulldisplay);
	closeButton.addEventListener("click", function() {
		document.getElementById('events').removeChild(document.querySelector(".eventFullDisplay"));
		showMarkers();
	});	
	
	//affichage d'un icone sur maps
	this.showOnMap();	
	
	//affichage de tous les info de l'event
	// TO DO ne pas afficher les propriétés 'undefined'
	var NETitle = document.createElement('h3');
	NETitle.innerHTML = this.nom ;
	this.fulldisplay.appendChild(NETitle);
	var NEDescr = document.createElement('div');
	NEDescr.innerHTML = this.descrLong ;
	this.fulldisplay.appendChild(NEDescr);
	
	var NEDate = document.createElement('div');
	NEDate.innerHTML = displayDate(this.dateDeb);
	this.fulldisplay.appendChild(NEDate);
	var NEHoraires = document.createElement('div');
	NEHoraires.innerHTML = this.horaires ;
	this.fulldisplay.appendChild(NEHoraires);
	var NELieu = document.createElement('div');
	NELieu.innerHTML = this.lieu ;
	this.fulldisplay.appendChild(NELieu);
	var NEAdr1 = document.createElement('div');
	NEAdr1.innerHTML = this.adr1 ;
	this.fulldisplay.appendChild(NEAdr1);
	var NEAdresse = document.createElement('div');
	NEAdresse.innerHTML = this.adr2 + "</br>" + this.CP + "</br>" + this.commune ;
	this.fulldisplay.appendChild(NEAdresse);
	var NEInfoResa = document.createElement('div');	
	NEInfoResa.innerHTML = this.mail + "</br>" + this.site + "</br>" + this.tel ;
	this.fulldisplay.appendChild(NEInfoResa);
	var NEInfoSup = document.createElement('div');	
	NEInfoSup.innerHTML = this.age + "</br>" + this.isFree + "</br>" + this.type ;
	this.fulldisplay.appendChild(NEInfoSup);
	
    
};

//on fais sautiller le marker sur maps au survole  de la mini fiche
Event.prototype.onmousenterNewEventWindow = function(event) {
    this.marker.setAnimation(google.maps.Animation.BOUNCE);
	// console.log("on");
    
};

//on arrete le sautillement
Event.prototype.onmouseoutNewEventWindow = function(event) {
	if (document.getElementById("events") !== event.target) return;
    this.marker.setAnimation(null);
	// console.log("off");
};

/* affichage du marker maps avec icone personnalisé selon la catégorie principale de l'event */
Event.prototype.showOnMap = function() {
	//addMarker(this.lat, this.long);
	
	//debut de l'url d'host des icones
	var iconBase= 'http://www.webdevrem.fr/icons/';
		
	//création du marker
	this.marker = new google.maps.Marker({
		position: {lat: this.lat, lng: this.long},
		map: map, 
		title: this.nom,
		icon: iconBase + this.iconType
	});
	this.marker.id = this.nom;
	
	//ajout du marker dans l'array markers
	markers.push(this.marker);
	//mise en place de l'event listener pour le sautillement du marker
	this.newEventWindow.addEventListener("mouseenter", this.onmousenterNewEventWindow.bind(this));
	//mise en place de l'event listener pour l'arret du sautillement du marker
	document.getElementById("events").addEventListener("mouseout", this.onmouseoutNewEventWindow.bind(this));
	//mise en place de l'event listener pour l'affichage de la fiche au click sur le marker
	this.marker.addListener('click', this.eventFullDisplay.bind(this));	
		

	//console.log(this.iconType);

};
