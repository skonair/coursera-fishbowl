Meteor.subscribe('fishingsites');
Meteor.subscribe('fish');
Meteor.subscribe('users');

var markers = {};
var selectedMarker;

Session.set('selectedFishingSite', undefined);

Template.fishmap.helpers({
    fishMapOptions: function() {
    // Make sure the maps API has loaded
    if (GoogleMaps.loaded()) {
	    var	coords = getCurrentLocation();
    	// Map initialization options
    	if (coords) {
	      	return {
	        	center: new google.maps.LatLng(coords.lat, coords.lng),
	        	zoom: 12
	      	};    		
    	}
    }
  }
});

Template.siteinfo.helpers({
	selectedSite: function() {
		return Session.get('selectedFishingSite');
	}
});

Template.fishlist.helpers({
	fishes: function() {
		var user = Meteor.user();
		if (user) {
			return Fish.find( { user: user._id } ).fetch();
		} else {
			return undefined;
		}
	}
});

Template.actioncontrolsbuttons.helpers({
	isLoggedIn: function() {
		if (Meteor.user()) {
			return true;
		} else {
			return false;
		}
	},
	isFishing: function() {
		return Session.get('isFishing');
	}
});

Template.showsiteinformation.helpers({
	getName: function(id) {
		var user = Meteor.users.findOne( {_id: id} );
		if (user) {
			return user.emails[0].address;
		} else {
			return undefined;
		}
	},
	isdisabled: function() {
		if (Meteor.user()) {
			return '';
		} else {
			return 'disabled';
		}
	},
	isclean: function(id) {
		return (this.cleanliness == id) ? 'active' : '';
	},
	iscrowd: function(id) {
		return (this.crowd == id) ? 'active' : '';
	},
	isclean1: function(id) {
		return Session.get('clean_1');
	},
	isclean2: function() {
		return Session.get('clean_2');
	},
	isclean3: function() {
		return Session.get('clean_3');
    },
	iscrowd1: function(id) {
		return Session.get('crowd_1');
	},
	iscrowd2: function() {
		return Session.get('crowd_2');
	},
	iscrowd3: function() {
		return Session.get('crowd_3');
    },
    fishingsite: function() {
    	return Session.get('selectedFishingSite');
    },
    fpeople: function() {
    	return Session.get('fpeople');
    }

});

// events for the fishmap (google map)
Template.fishmap.onCreated(function() {  
  GoogleMaps.ready('fishMap', function(map) {

      FishingSites.find().observe({

        added: function (fishingSite) {
        	// create a google map marker for each fishing spot
          var marker = new google.maps.Marker({
            draggable: false,
            animation: google.maps.Animation.DROP,
            icons: 'https://www.google.com/mapfiles/marker.png',
            position: new google.maps.LatLng(fishingSite.coord.lat, fishingSite.coord.lng),
            map: map.instance,
            id: fishingSite._id
          });

          marker.addListener('click', function() {
          	selectMarker(fishingSite._id);
          });

//          google.maps.event.addListener(marker, 'dragend', function(event) {
//            Markers.update(marker.id, { $set: { lat: event.latLng.lat(), lng: event.latLng.lng() }});
//          });

          markers[fishingSite._id] = marker;
        },
        changed: function (newDocument, oldDocument) {
        	if (markers[oldDocument._id] == selectedMarker) {
        		setCleanliness(newDocument.cleanliness);
        		setCrowdedness(newDocument.crowdedness);
        		setPeople(newDocument.people);
        	}
//          markers[newDocument._id].setPosition({ lat: newDocument.lat, lng: newDocument.lng });
        },
        removed: function (oldDocument) {
          markers[oldDocument._id].setMap(null);
          google.maps.event.clearInstanceListeners(markers[oldDocument._id]);
          delete markers[oldDocument._id];
        }
      });

  });
});

Template.fishmap.onRendered(function() {
	GoogleMaps.load();
});

Template.actioncontrolsbuttons.events({
	"click .js-start-fishing": function(event) {
		var savedFishingSite = Meteor.call('startFishing', getCurrentLocation(), function(err, id) {
			if (err) {
				console.log('Error ', err);
			} else {
				selectMarker(id);
			}
		});
		Session.set('isFishing', true);
		return false; // prevent browser reload
	},
	"click .js-stop-fishing": function(event) {
		Meteor.call('stopFishing');
		Session.set('isFishing', false);
		Session.set('selectedFishingSite', undefined);
		return false; // prevent browser reload
	},
	"click .js-tweet": function(event) {
		event.preventDefault();

		$('#addFishModal').modal('show');
		return false; // prevent browser reload
	}
});

Template.addfischli.events({
	"submit .js-save-fish": function(event) {
		event.preventDefault();

		var fishdata = {
			type: event.target.fishType.value,
			length: event.target.fishLength.value
		};

		var savedFish = Meteor.call('addFish', fishdata, getCurrentLocation(), function(err, id) {
			if (err) {
				console.log('Error ', err);
			} else {
				// fish added
			}
		});
		$('#addFishModal').modal('hide');

		return false; // prevent browser reload
	}
});


Template.showsiteinformation.events({
  'click .js-cleanliness': function (e) {
//  	$('.js-cleanliness').removeClass('active');
//	Session.set('selectedMessage', e.currentTarget.id);

	var _cleanliness = e.target.getAttribute('data-id');

	setCleanliness(_cleanliness);

    var fishingSite = Session.get('selectedFishingSite');

    Meteor.call('updateCleanliness', fishingSite._id, _cleanliness);
 },

  'click .js-crowdedness': function (e) {
//  	$('.js-cleanliness').removeClass('active');
//	Session.set('selectedMessage', e.currentTarget.id);

	var _crowdedness = e.target.getAttribute('data-id');
	var disabled = e.target.getAttribute('class');

	console.log('disabled: ', disabled);

	setCrowdedness(_crowdedness);

    var fishingSite = Session.get('selectedFishingSite');

    Meteor.call('updateCrowdedness', fishingSite._id, _crowdedness);
 }


});



// helper

function setCleanliness(_cleanliness) {
		Session.set('clean_1', '');
		Session.set('clean_2', '');
		Session.set('clean_3', '');
		Session.set('clean_' + _cleanliness, 'active');
}

function setCrowdedness(_crowdedness) {
		Session.set('crowd_1', '');
		Session.set('crowd_2', '');
		Session.set('crowd_3', '');
		Session.set('crowd_' + _crowdedness, 'active');
}

function setPeople(_people) {
	Session.set('fpeople', _people);	
}

function getCurrentLocation() {
    var currentLocation = Geolocation.currentLocation();
//    var lat = currentLocation.coords.latitude; // 52.4;
//    var lng = currentLocation.coords.longitude; // 8.7;
	if (currentLocation) {
		    return { 
 			   	lat: currentLocation.coords.latitude, 
    			lng: currentLocation.coords.longitude
	    };
	} else {
		return undefined;
	}
}

function selectMarker(fishingSiteId) {
	var fishingSite = FishingSites.findOne({_id: fishingSiteId});
	var marker = markers[fishingSiteId];

	if (selectedMarker) {
  		selectedMarker.setIcon('https://www.google.com/mapfiles/marker.png');          		
    }
	marker.setIcon('https://www.google.com/mapfiles/marker_green.png');
	selectedMarker = marker;

	Session.set('selectedFishingSite', fishingSite);

	setCleanliness(fishingSite.cleanliness);
	setCrowdedness(fishingSite.crowdedness);
	setPeople(fishingSite.people);
}

