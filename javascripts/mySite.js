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
		this.startingArray = Shuffler.shuffleArray(['W','e','b','D','e','v','e','l','o','p','e','r']);
		this.startingMessage = this.startingArray.join('')
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

})();