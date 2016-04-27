Meteor.subscribe("fishingsites");

// counter starts at 0
Session.setDefault('counter', 0);

Template.home.helpers({
  counter: function () {
    return Session.get('counter');
  }
});

Template.fishmap.helpers({
    fishMapOptions: function() {
    // Make sure the maps API has loaded
    if (GoogleMaps.loaded()) {
    	var currentLocation = Geolocation.currentLocation();
    	var lat = -37.8136;
    	var lng = 144.9631;
    	lat = currentLocation.coords.latitude;
    	lng = currentLocation.coords.longitude;
      // Map initialization options
      return {
        center: new google.maps.LatLng(lat, lng),
        zoom: 12
      };

// 		var fishingSites = FishingSites.find({}).fetch();


    }
  }
});

// events

Template.home.events({
  'click button': function () {
    // increment the counter when button is clicked
    Session.set('counter', Session.get('counter') + 1);
  }
});


// events for the fishmap (google map)
Template.fishmap.onCreated(function() {  
  GoogleMaps.ready('fishMap', function(map) {

  	 var markers = {};
      FishingSites.find().observe({

        added: function (fishingSite) {
        	console.log('fiwhbowl.js - fishingSite added called: ', fishingSite);
          var marker = new google.maps.Marker({
            draggable: true,
            animation: google.maps.Animation.DROP,
            position: new google.maps.LatLng(fishingSite.coord.lat, fishingSite.coord.lng),
            map: map.instance,
            id: fishingSite._id
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


