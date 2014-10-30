(function(){
	var app = angular.module('mySite', [ ])
	app.controller('PanelController', function(){
		this.activePanel = 1;

		this.setPanel = function(tabClicked) {
			this.activePanel = tabClicked
		};

		this.checkSelected = function(panel) {
			return this.activePanel === panel
		};
	})

})();