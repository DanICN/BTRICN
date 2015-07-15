angular.module('btr')

.config(function($routeProvider){
	$routeProvider

	.when('/sign-up', {
		templateUrl: 'templates/sign-up.html',
		controller: 'signupController'
	})
	.when('/forgot-password', {
		templateUrl: 'templates/forgot-password.html',
		controller: 'forgotPasswordController'
	})
	.when('/change-password/:id', {
		templateUrl: 'templates/change-password.html',
		controller: 'changePasswordController'
	})
	.when('/login', {
		templateUrl: 'templates/login.html',
		controller: 'loginController'
	})
	.when('/user/:id', {
		templateUrl: 'templates/main.html',
		controller: 'mainController'
	})
	.when('/live-matches/:id', {
		templateUrl: 'templates/live-matches.html',
		controller: 'liveMatchesController'
	})
	.when('/settings/:id', {
		templateUrl: 'templates/settings.html',
		controller: 'settingsController'
	})
	.when('/fixtures/:id', {
		templateUrl: 'templates/fixtures.html',
		controller: 'fixturesController'
	})
	.when('/tutorials/:id', {
		templateUrl: 'templates/tutorials.html',
		controller: 'tutorialsController'
	})
	.when('/admin/:id', {
		templateUrl: 'templates/admin.html',
		controller: 'adminController'
	})
	.when('/performances/:id', {
		templateUrl: 'templates/performances.html',
		controller: 'performancesController'
	})
	.when('/twitter/:id', {
		templateUrl: 'templates/twitter.html',
		controller: 'twitterController'
	})
	.when('/about/:id', {
		templateUrl: 'templates/about.html'
	})
	.when('/leagues/:id', {
		templateUrl: 'templates/leagues.html',
		controller: 'leaguesController'
	})
	.when('/live-match-teamsheet/:id', {
		templateUrl: 'templates/live-match-teamsheet.html',
		controller: 'liveMatchTeamsheetController'
	})
	.when('/fixture/:id/:match_id', {
		templateUrl: 'templates/fixture.html',
		controller: 'fixtureController'
	})
	.when('/register', {
		templateUrl: 'templates/register.html',
		controller: 'registerController'
	})

	// Admin Section
	// questions
	.when('/questions/', {
		templateUrl: 'templates/questions.html',
		controller: 'questionsController'
	})
	.when('/question/:id/:name', {
		templateUrl: 'templates/question.html',
		controller: 'questionController'
	})
	// matches
	.when('/matches/', {
		templateUrl: 'templates/matches.html',
		controller: 'matchesController'
	})
	.when('/match/:id', {
		templateUrl: 'templates/match.html',
		controller: 'matchController'
	})
	// answers
	.when('/answers/', {
		templateUrl: 'templates/answers.html',
		controller: 'answersController'
	})
	.when('/answer/:id', {
		templateUrl: 'templates/answer.html',
		controller: 'answerController'
	})
	// scores
	.when('/scores/', {
		templateUrl: 'templates/scores.html',
		controller: 'scoresController'
	})
	.when('/score/:id', {
		templateUrl: 'templates/score.html',
		controller: 'scoreController'
	})
	// teamsheets
	.when('/teamsheets/', {
		templateUrl: 'templates/teamsheets.html',
		controller: 'teamsheetsController'
	})
	.when('/teamsheet/:id', {
		templateUrl: 'templates/teamsheet.html',
		controller: 'teamsheetController'
	})
	// this comes last
	.when('/', {
		templateUrl: 'templates/sign-up.html',
		controller: 'signupController'
	})
	.otherwise({
		redirectTo: '/'
	});

});
