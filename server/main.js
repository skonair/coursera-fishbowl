Meteor.publish("fishingsites", function () {
	return FishingSites.find({});
});

Meteor.methods({

	isLoggedIn: function() {
		if (Meteor.user()) {
			return true;
		} else {
			return false;
		}
	},

	startFishing: function(coords) {
		var user = Meteor.user();
		if (user) {
			var fishingSite = {
				coord: coords,
				crowdedness: 1,
				cleanliness: 1,
				createdOn: new Date(),
				people: [user._id]
			};
			var id = FishingSites.insert(fishingSite);
			return id;
		} else {
			console.log('User is not logged in.');
			return undefined;
		}
	},

	stopFishing: function() {
		var user = Meteor.user();
		if (user) {
			// remove the current users from the people field in the fishing site (or sites if the db is outdated)
			var result = FishingSites.update(
				{ people: { $in: [user._id] } }, // where clause
				{ $pull: { people: { $in: [user._id] } } }, // set clause
				{ multi: true }
			);
			// remove the fishing sites with no avtive anglers	
			var cleanup = FishingSites.remove({ people: [] });

			return result;
		} else {
			console.log('User is not logged in.');
			return undefined;
		}

	}

});

