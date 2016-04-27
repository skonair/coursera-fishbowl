Meteor.publish("fishingsites", function () {
	return FishingSites.find({});
});


Meteor.methods({

	isLoggedIn:function() {
		if (Meteor.user()) {
			return true;
		} else {
			return false;
		}
	},

	addFishingSite:function(fishingsite) {
		if (Meteor.user()) {
			FishingSites.insert(fishingsite);
		} else {
			console.log('User is not logged in.');
		}
	}

});

