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
			var insertedFishingSite = FishingSites.insert(fishingsite);
			console.log('insertedFishingSite: ', insertedFishingSite);
			return insertedFishingSite;
		} else {
			console.log('User is not logged in.');
			return undefined;
		}
	}

});

