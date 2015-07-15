# Be The Ref
AngularJS Application

Design structure:
* DB firebase
* Frontend Angular and jQuery
* iOS and Android Build Cordova

The purpose of the app is so the a BTR ref can ask questions and select answers for users to play the game.

Users earn points from every correct answer and time it took them to answer the question.

By design users when users create their profile they can see a dropdown list of all the existing teams and they can associate themselves to that team - this then takes a copy of the teams state at a given time, this means that if the team changes their name or logo later the users data will not change.

This is the same structure for matches and teams that when a match is created they create a copy ref of the teams state at any given time so that they can change that structure if they choose to without effecting the team.

i.e. Team - Chelsea, stadium - Stanford bridge
this is be the stadium given to the game but in the match you can alter this and save it to the match without altering the teams stadium it will also save a reference to the teams squad at a given time so as the team changes this will not effect the history of the match

To start the app run grunt server 
