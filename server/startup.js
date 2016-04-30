Meteor.startup(function () {
  // code to run on server at startup

  if (!FishingSites.findOne()){
	console.log("No fishing sites yet. Creating starter data.");

	FishingSites.insert({
		coord : {
			lat: 52.334043,
			lng: 8.622670
		},
		crowdedness: 2,
		cleanliness: 2,
		createdOn: new Date(),
		people: ['1'],
	});
	FishingSites.insert({
		coord : {
			lat: 52.334810,
			lng: 8.634648
		},
		crowdedness: 1,
		cleanliness: 3,
		createdOn: new Date(),
		people: ['2'],
	});
  }
});
