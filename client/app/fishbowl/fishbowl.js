Meteor.subscribe('fishingsites');
Meteor.subscribe('fish');

var markers = {};
var selectedMarker;

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
          markers[newDocument._id].setPosition({ lat: newDocument.lat, lng: newDocument.lng });
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


// helper

function getCurrentLocation() {
    var currentLocation = Geolocation.currentLocation();
//    var lat = currentLocation.coords.latitude; // 52.4;
//    var lng = currentLocation.coords.longitude; // 8.7;
    return { 
    	lat: currentLocation.coords.latitude, 
    	lng: currentLocation.coords.longitude
    };
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
}

