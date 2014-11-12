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
		this.endValues = endValues;
		this.messages = [];
		this.arraysToEvaluate = [];
		this.activePivots = [];
		this.pivotObjects = []

		this.init = function() {
			var shuffledMessage = Shuffler.shuffleArray(this.startingMessage)
			this.messages.push(shuffledMessage)
			this.arraysToEvaluate.push(this.getValues())
			this.createFirstPivot()
			this.interval = setInterval(this.switchboard.bind(this), 200)
		};
		this.switchboard = function() {
			if (this.getValues() === this.endValues) {
				console.log("clearing the loop")
				clearInterval(this.interval)
			}
			else {	
				this.evaluateStep()			
			}
		};
		this.evaluateStep = function() {
			for (i = 0; i < this.arraysToEvaluate.length; i++) {
				var currentCell = this.arraysToEvaluate[i][0]
				var currentPivot = this.activePivots[i]
				var objectToEvaluate = this.showEvaluated(currentCell)
				this.evaluateCell(objectToEvaluate,currentPivot)
				if (this.arraysToEvaluate[i].length === 1) {
					this.setNewPivot(currentPivot)
				}
				this.arraysToEvaluate[i].shift()				
			}
		};
		this.evaluateCell = function(cellObject,pivot) {
			console.log("appending new cell")
			console.log(cellObject)
			console.log(pivot)
		};
		this.showEvaluated = function(currentCell) {
			console.log("updating old cell")
			console.log(currentCell)
			return {Hello:"makingprogress"}
		};
		this.createFirstPivot = function() {
			console.log("getting there")
			var middleIndex = Math.ceil(this.arraysToEvaluate[0].length / 2) - 1
			this.activePivots.push(this.arraysToEvaluate[0][middleIndex])
		};
		this.setNewPivot = function() {
			console.log("still a bit stumped")
		}
		this.getValues= function() {
			return this.messages[this.messages.length-1].map(function(letterObject) {
				return letterObject.value
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
    var endValues = [1,2,3,4,5,6,7,8,9,10,11,12]
})();