# coursera-fishbowl
As part of my coursera course 'Responsive Website Development and Design Capstone' I create a meteor application called "global fishbowl". During time of the course, this repository will be closed for changes from other people.

To run the application, simply install meteor and run the application:
```
$ meteor
```

After the first startups, two accounts and fishing sites will be created in the mongo database.

## About

Thank you for checking out the *Global Fishbowl*. It is a collaborative web application for anglers. Imagine you want to go fishing and you want to meet some friends or like-minded people. Then you can check with this application, whether a person you know is already fishing nearby. Or if you want some alone-time then you can check if your favourite spot is already taken.    
  
After you open the main page, you will see the main window with the following areas:
* Navigation Bar - navigation area with links to the map, the fishlist and the about page. On the right there is the login or account button.
* Fishing Map - the map shows all spots, where people are currently fishing.
* Spot Information - information about the currently selected spot on the map. This information is right now crowdedness and cleanliness. Crowdedness describes how many people are currently fishing in the area. Cleanliness describes, whether the spot is clean or dirty.
* Action Controls - at the bottom of the page is the action controls area. Depending on the current state, you have several options. If you are not logged in, you can not do any actions. If you are logged in, you can *Start Fishing* Then a new spot (marker on the map) is created or if you are near an existing spot, you are assigned to this spot. Your email-address will appear in the *People in this spot* list. If you are assigned to a spot, you can either *Stop Fishing* or add a fish to your personal fishlist via *Fish caught!*

My main focus of this application was to have a small feature set, that will be presented as easy as possible. It should only serve one purpose: Help anglers to connect.

## Technology

Base components:
* Meteor v1.2.1
* Bootstrap v3.3.6 for the main design elements
* jQuery v1.12.0 for some of the browser interactivity and DOM manipulation

Meteor packages:
* accounts-ui and accounts-password for the user account handling and design widgets
* dburles:google-maps for the Google Maps Javascript API v3 support
* iron:router for the routing of the meteor application
* mdg:geolocation provides a reactive geolocation on desktop and mobile
* momentjs:moment for time formatting


## Known issues:

* Chrome (since version 50) doesn't allow geolocation requests from http connections. So testing with a mobile device is a bit tricky, when you don't have an ssl proxy.
* The crowdedness and cleanliness buttons can be disabled; so no real radio-button type yet.

