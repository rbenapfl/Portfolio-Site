(function(){
	var app = angular.module('mySite', [ ])

	app.controller('PanelController', function() {
		this.activePanel = 1;

		this.setPanel = function(tabClicked) {
			this.activePanel = tabClicked
		};

		this.checkSelected = function(panel) {
			return this.activePanel === panel
		};
	});

	app.controller('QuicksortController', function(Shuffler) {
		this.startingMessage = homeMessage;
		this.endLetters = endLetters;
		this.messages = [];
		this.arraysToEvaluate = [];
		this.activePivots = [];

		this.init = function() {
			var shuffledMessage = Shuffler.shuffleArray(this.startingMessage)
			this.messages.push(shuffledMessage)
			this.interval = setInterval(this.switchboard.bind(this), 200)
		};

		this.switchboard = function() {
			if (this.checkLetters() === this.endLetters) {
				console.log("clearing the loop")
				clearInterval(this.interval)
			}
			else {				
				console.log("in the loop")
			}
		};

		this.checkLetters= function() {
			return this.messages[this.messages.length-1].map(function(letterObject) {
				return letterObject.letter
			})
		};


		this.init()

	});

	app.service('Shuffler', function() {
		this.shuffleArray = function(unshuffled) {
			var unshuffled = unshuffled
			var shuffled = []
			for (var i = unshuffled.length - 1; i >= 0; i--) {
				var randomIndex = Math.floor(Math.random() * (i + 1));
				shuffled.push(unshuffled[randomIndex])
				unshuffled.splice(randomIndex,1)
			}
			return shuffled
    	};
	});

	var homeMessage = [
			{letter:'W',value:1,status:'unsolved'},
			{letter:'e',value:2,status:'unsolved'},
			{letter:'b',value:3,status:'unsolved'},
			{letter:'D',value:4,status:'unsolved'},
			{letter:'e',value:5,status:'unsolved'},
			{letter:'v',value:6,status:'unsolved'},
			{letter:'e',value:7,status:'unsolved'},
			{letter:'l',value:8,status:'unsolved'},
			{letter:'o',value:9,status:'unsolved'},
			{letter:'p',value:10,status:'unsolved'},
			{letter:'e',value:11,status:'unsolved'},
			{letter:'r',value:12,status:'unsolved'}
	]
    var endLetters = ['W','e','b','D','e','v','e','l','o','p','e','r']
})();