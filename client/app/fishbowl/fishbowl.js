Meteor.subscribe("fishingsites");

var markers = {};
var selectedMarker;


Template.fishmap.helpers({
    fishMapOptions: function() {
    // Make sure the maps API has loaded
    if (GoogleMaps.loaded()) {
    	coords = getCurrentLocation();
      // Map initialization options
      return {
        center: new google.maps.LatLng(coords.lat, coords.lng),
        zoom: 12
      };
    }
  }
});

Template.siteinfo.helpers({
	selectedSite: function() {
		return Session.get('selectedFishingSite');
	}
});

Template.actioncontrols.helpers({
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
            draggable: true,
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

Template.actioncontrols.events({
	"click .js-start-fishing": function(event) {

		var currentLocation = getCurrentLocation();
		var currentFishingSite = {
			coord: getCurrentLocation(),
			crowdedness: 1,
			cleanliness: 1,
			createdOn: new Date(),
			people: []
		};

		var savedFishingSite = Meteor.call('addFishingSite', currentFishingSite, function(err, id) {
			if (err) {
				console.log('Error ', err);
			} else {
				selectMarker(id);
			}
		});

		if (savedFishingSite) {
			currentFishingSite = savedFishingSite;
		}

		Session.set('isFishing', true);
		return false; // prevent browser reload
	},
	"click .js-stop-fishing": function(event) {
		Session.set('isFishing', false);
		return false; // prevent browser reload
	},
	"click .js-tweet": function(event) {
		// TODO implement the tweet function
		return false; // prevent browser reload
	}
});


// helper

function getCurrentLocation() {
    var currentLocation = Geolocation.currentLocation();
    var lat = -37.8136;
    var lng = 144.9631;
    lat = currentLocation.coords.latitude;
    lng = currentLocation.coords.longitude;
    return { 
    	lat: lat, 
    	lng: lng
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

