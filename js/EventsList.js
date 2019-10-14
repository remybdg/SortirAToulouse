/* class EventsList dont l'objet unique sera la liste des evenéments après traitement de la liste originale */
/* les evenements seront transformés en objet de la class Event */

var EventsList = function(originalDb) {
	this.date;
	this.list;
	this.dbTable;	
	this.originalDb = originalDb;
	this.event;
};

/* Création du nouveau array contenant les evenements */
EventsList.prototype.setDbTable = function () {

	var currentTable = [];
	
	//on boucle dans la liste originale
	for (cpt=0; cpt< this.originalDb.length; cpt++) {
		
		//on ne traite pas les evenements anterieurs à la date du jour
		if (new Date(this.originalDb[cpt].fields.date_debut).valueOf() >= this.date.valueOf() || !("date_debut" in this.originalDb[cpt].fields)) {

			//création d'un nouvel objet Event
			var event = new Event();
			
			//récupération des informations et transformation en propriété de l'objet
			event.setNom(this.originalDb[cpt].fields.nom_de_la_manifestation);
			event.setDescrCourt(this.originalDb[cpt].fields.descriptif_court);
			event.setDescrLong(this.originalDb[cpt].fields.descriptif_long);
			event.setAge(this.originalDb[cpt].fields.tranche_age_enfant);
			event.setIsFree(this.originalDb[cpt].fields.manifestation_gratuite);
			// si la clé 'type' existe on la récupère pour definir 3 propriétés
			if ('type_de_manifestation' in this.originalDb[cpt].fields) {
				event.setType(this.originalDb[cpt].fields.type_de_manifestation);
				event.setIconType(this.originalDb[cpt].fields.type_de_manifestation);
				event.setColor(this.originalDb[cpt].fields.type_de_manifestation);	
			}
			event.setLieu(this.originalDb[cpt].fields.lieu_nom);
			event.setLieuAdr1(this.originalDb[cpt].fields.lieu_adresse_1);
			event.setLieuAdr2(this.originalDb[cpt].fields.lieu_adresse_2);
			event.setCP(this.originalDb[cpt].fields.code_postal);
			event.setCommune(this.originalDb[cpt].fields.commune);
			event.setLong(this.originalDb[cpt].fields.googlemap_longitude);
			event.setLat(this.originalDb[cpt].fields.googlemap_latitude);
			event.setHoraires(this.originalDb[cpt].fields.horaires);
			event.setMail(this.originalDb[cpt].fields.reservation_email);
			event.setSite(this.originalDb[cpt].fields.reservation_site_internet);
			event.setTel(this.originalDb[cpt].fields.reservation_telephone);
			
			event.setDateDeb(new Date(this.originalDb[cpt].fields.date_debut));
			event.setDateFin(new Date(this.originalDb[cpt].fields.date_fin));
			
			currentTable.push(event);

		}
	}	
	
	//on rempli le nouvel array avec l'event créée
	this.dbTable = currentTable;
	
	//console.log(this.originalDb);
	console.log(this.dbTable);

	
}

/* définition de la propriété date */
EventsList.prototype.setDate = function(date) {

	this.date = new Date(date);
	if (this.date.valueOf() > 1572134400000) {
		this.date.setHours(1,0,0,0);
		return;
	}
	this.date.setHours(2,0,0,0);
};


/* affichage du prochain événement */
EventsList.prototype.nextEvent = function() {

	//on vide l'array markers , et on enlève les markers sur maps
	deleteMarkers();
	
	//on boucle dans l'array des events
	for (cpt=0; cpt< this.dbTable.length; cpt++) {
		//console.log((this.dbTable[cpt].dateDeb),this.date);
		//si un event a la meme date que la date du jour ou de la date clické sur le calendrier
		if (this.dbTable[cpt].dateDeb.valueOf() == this.date.valueOf()) {
			this.event = this.dbTable[cpt];
			//on affiche une mini fiche de l'event dans la partie droite de résultat de recherche
			this.event.nextEventWindow();
			
			return;
		}
	}
};


/* affichage des evenements du jour */
EventsList.prototype.dayEvents = function() {
	
	//on vide l'array markers , et on enlève les markers sur maps
	deleteMarkers();
	//on vide les résultats de recherche précédents
	document.getElementById('events').innerHTML = '';
	
	//Affichage de la date du jour séléctionné dans le calendrier
	var dateTitle = document.createElement('h2');
	dateTitle.innerText = displayDate(this.date);
	document.getElementById('events').appendChild(dateTitle);
	
	//on boucle dans l'array des events
	for (cpt=0; cpt< this.dbTable.length; cpt++) {
		console.log((this.dbTable[cpt].dateDeb),this.date.valueOf());
		//si un event a la meme date que la date du jour ou de la date clické sur le calendrier
		if (this.dbTable[cpt].dateDeb.valueOf() == this.date.valueOf()) {
			this.event = this.dbTable[cpt];
			//on affiche une mini fiche de l'event dans la partie droite de résultat de recherche
			this.event.nextEventWindow();
			
		}
	}
	
	//on adapte l'affichage de maps aux nouveaux markers à afficher
	var bounds = new google.maps.LatLngBounds();
	for (var i = 0; i < markers.length; i++) {
	    bounds.extend(markers[i].getPosition());
	}
	
	if (markers.length > 0) {
		map.fitBounds(bounds);	
	}
};

/* recherche d'evenements par catégorie */
EventsList.prototype.getEventsByCategory = function() {
	//on définit le nombre de résultat max à afficher
	var compteur = 5;

	//on vide l'array markers , et on enlève les markers sur maps
	deleteMarkers();
	//on vide les résultats de recherche précédents
	document.getElementById('events').innerHTML = '';	
	
	//affichage de la catégorie sélectionnée
	var categoryTitle = document.createElement('h2');
	categoryTitle.innerText = 'prochains évenements: ' + event.target.dataset.cat;
	document.getElementById('events').appendChild(categoryTitle);
	
	//on boucle dans l'array des events
	for (cpt=0; cpt< this.dbTable.length; cpt++) {
		//si l'event courrant est de la catégorie selectionné et que l'on n'a pas encore résultats
		if (this.dbTable[cpt].type.includes(event.target.dataset.cat) && compteur > 0 ) {
			//console.log(this.dbTable[cpt].nom,this.dbTable[cpt].type);
			this.event = this.dbTable[cpt];
			//on affiche une mini fiche de l'event dans la partie droite de résultat de recherche
			this.event.nextEventWindow();
			compteur--;				
		}

	}	
	
	//on adapte l'affichage de maps aux nouveaux markers à afficher
	var bounds = new google.maps.LatLngBounds();
	for (var i = 0; i < markers.length; i++) {
	    bounds.extend(markers[i].getPosition());
	}

	if (markers.length > 0) {
		map.fitBounds(bounds);	
	}
};

/* On colore les jours du calendrier qui contiennent des evenements */
EventsList.prototype.setCalendarDaysColors = function() {
	var daysToColorTable = [];
	
	//en se basant sur la date courante du calendrier on créée une date de début de mois
	//et une date de fin de mois
	var lastDay = new Date(CURR_DATE);
	var firstDay = new Date(CURR_DATE);
	firstDay.setDate(1);
	firstDay.setHours(2,0,0,0);
	//console.log(firstDay);
		//console.log(CURR_DATE, firstDay, lastDay);	
	
	//dernier jour du mois selon le mois ;)
	switch (lastDay.getMonth()) {
		case 0:
		case 2:
		case 4:
		case 6:
		case 7:
		case 9:
		case 11:
			lastDay.setDate(31);
			break;
			
		case 3:
		case 5:
		case 8:
		case 10:
			lastDay.setDate(30);
			break;
			
		case 1:
			lastDay.setDate(29);
			break;	
	}	
		// console.log(CURR_DATE, firstDay, lastDay);	
		
	//on boucle dans l'array des events pour récupérer les jours qui contiennent des events
	for (cpt=0; cpt< this.dbTable.length; cpt++) {
		//console.log(cpt, this.dbTable[cpt].dateDeb, CURR_DATE);
		//si l'event courant a lieu entre le premmier jour et le dernier jour du mois sélctionné
		if (this.dbTable[cpt].dateDeb.valueOf() >= firstDay.valueOf() && this.dbTable[cpt].dateDeb.valueOf() <= lastDay.valueOf()) {
			
			//console.log('okkkkkkkkkkkkkkkkkkkkk',this.dbTable[cpt].dateDeb );
			//on récupère le jour de l'event si c'est le premier event du mois 
			//ou si on n'a pas déjà récupéré un event de ce jour-là pour éviter les doublons
			if ( daysToColorTable.length == 0 || (daysToColorTable.length > 0 && this.dbTable[cpt].dateDeb.getDate() != daysToColorTable[daysToColorTable.length -1])) {

				daysToColorTable.push(this.dbTable[cpt].dateDeb.getDate());
			}
		}
		
		
	}
	// console.log("daysToColor", daysToColorTable);
	//renvoi de l'aaray qui contient les jours 'remplis' sans doublons
	return daysToColorTable;
};
