Meteor.publish("fishingsites", function () {
	return FishingSites.find({});
});

Meteor.publish("fish", function () {
	return Fish.find({});
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
			// is there an active spot nearby?
			var allFishingSites = FishingSites.find({}).fetch();
			var site = undefined;
			allFishingSites.forEach(function(item) {
				var deltaLatitude = coords.lat - item.coord.lat;
				var deltaLongitude = coords.lng - item.coord.lng;
				var delta = Math.sqrt((deltaLatitude * deltaLatitude) + (deltaLongitude * deltaLongitude));
				if (delta < 0.05) {
					site = item;
				}
			});

			var id = undefined;
			if (site) {
				FishingSites.update(
					{ _id: site._id },
					{ $push: { people: user._id } }
				);
				id = site._id;
			} else {
				var fishingSite = {
					coord: coords,
					crowdedness: 1,
					cleanliness: 1,
					createdOn: new Date(),
					people: [user._id]
				};
				id = FishingSites.insert(fishingSite);
			}

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

	},

	addFish: function(fishdata, coords) {
		var user = Meteor.user();
		if (user) {
			var fish = {
				coord : coords,
				type : fishdata.type,
				length: fishdata.length,
				createdOn: new Date(),
				user: user._id,
			};

		} else {
			console.log('User is not logged in.');
			return undefined;
		}
	}

});

