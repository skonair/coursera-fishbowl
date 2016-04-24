// counter starts at 0
Session.setDefault('counter', 0);

Template.home.helpers({
  counter: function () {
    return Session.get('counter');
  }
});

Template.fishmap.helpers({
    exampleMapOptions: function() {
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

Template.fishmap.onRendered(function() {
  GoogleMaps.load();
});
