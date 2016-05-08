Meteor.startup(function () {
  // code to run on server at startup

  if (!Meteor.users.findOne()) {
  	console.log("No users yet. Creating starter data.");

  	// angler1@test.com / test123
  	Meteor.users.insert(
  		{ "_id" : "BRHELQCQNGw7ikoak", "createdAt" : ISODate("2016-05-08T11:06:14.485Z"), "services" : { "password" : { "bcrypt" : "$2a$10$kP5NM6FURKlz0A2J1.Q0yOgP8vCaqIdHmm5UkZ08XgPw2q4CiDSxm" }, "resume" : { "loginTokens" : [ ] } }, "emails" : [ { "address" : "angler1@test.com", "verified" : false } ] }
  	);

  	// angler2@test.com / test123
  	Meteor.users.insert(
  		{ "_id" : "RKWu4Ki9mWrSWTqys", "createdAt" : ISODate("2016-05-08T11:09:05.300Z"), "services" : { "password" : { "bcrypt" : "$2a$10$9/6LP6ifU0i2QU1fE.l3oueTQEPcgnUcQBOrb3QDj/3xKsNf.mwmq" }, "resume" : { "loginTokens" : [ { "when" : ISODate("2016-05-08T11:09:05.304Z"), "hashedToken" : "OfKWTURY7Y9kxX/P756zWqQv00O4v9UTfE7lHzkGs5g=" } ] } }, "emails" : [ { "address" : "angler2@test.com", "verified" : false } ] }
  	);

  }

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
		people: ['BRHELQCQNGw7ikoak'],
	});
	FishingSites.insert({
		coord : {
			lat: 52.334810,
			lng: 8.634648
		},
		crowdedness: 1,
		cleanliness: 3,
		createdOn: new Date(),
		people: ['RKWu4Ki9mWrSWTqys'],
	});
  }

  if (!Fish.findOne()){
	console.log("No fish yet. Creating starter data.");

	Fish.insert({
		coord : {
			lat: 52.334043,
			lng: 8.622670
		},
		type : 'trout',
		length: 25,
		createdOn: new Date(),
		user: 'BRHELQCQNGw7ikoak',
	});
	Fish.insert({
		coord : {
			lat: 52.334810,
			lng: 8.634648
		},
		type : 'trout',
		length: 30,
		createdOn: new Date(),
		user: 'RKWu4Ki9mWrSWTqys',
	});
  }

});
