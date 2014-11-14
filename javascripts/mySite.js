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

	app.controller('QuicksortController', function(Shuffler,$timeout,$interval) {
		this.startingMessage = homeMessage;
		this.endValues = endValues;
		this.messages = [];
		this.arraysToEvaluate = [];
		this.activePivots = [];
		this.sortedObjectsQueue = []
		this.shuffledMessage = Shuffler.shuffleArray(this.startingMessage)
		this.messages.push(this.shuffledMessage)

		this.init = function() {
			this.createFirstPivot()
			this.interval = $interval(this.switchboard.bind(this), 200, [0], [true])
		};
		this.switchboard = function() {
			if (this.getValues() === this.endValues) {
				console.log("clearing the loop")
				cancel(this.interval)
			}
			else {	
				this.evaluateStep()			
			}
		};
		this.evaluateStep = function() {
			for (i = 0; i < this.arraysToEvaluate.length; i++) {
				var currentCellValue = this.arraysToEvaluate[i][0]
				var currentPivot = this.activePivots[i]
				var rowOfActivePivot = this.getWorkingPivotRow(currentPivot)
				var objectToEvaluate = this.showEvaluated(currentCellValue,currentPivot,rowOfActivePivot)
				this.evaluateCell(objectToEvaluate,currentPivot,rowOfActivePivot)
				if (this.arraysToEvaluate[i].length === 1) {
					this.setNewPivots(currentPivot,rowOfActivePivot)
				}
				this.arraysToEvaluate[i].shift()				
			}
		};
		this.showEvaluated = function(value,pivot,pivotRow) {
			var pastObjectArray = this.messages[pivotRow]
			var objectToSort = {}
			for (var i = 0; i < pastObjectArray.length; i++) {
				if (pastObjectArray[i].value === value) {
					objectToSort = JSON.parse(JSON.stringify(pastObjectArray[i]))
					pastObjectArray[i].status = 'evaluated'
				}
			}
			return objectToSort
		};
		this.getWorkingPivotRow = function(pivot) {
			var row = 0
			for (var i = 0; i < this.messages.length; i++) {
				for (var j = 0; j < this.messages[i].length; j++) {
					if (this.messages[i][j].value === pivot && this.messages[i][j].status === 'pivot'){
						row = i
					}
				}
			}
			return row
		}
		this.evaluateCell = function(cellObject,pivot,pivotRow) {
			var currentObjectArray = this.messages[pivotRow + 1]
			var currentPivotIndex = this.retrievePivotIndex(pivot)
			if (cellObject.value < pivot) {
				currentObjectArray.splice(currentPivotIndex,0,cellObject)
				this.assignToSortedArray(cellObject.value,pivot,'left')
			} else {
				currentObjectArray.splice(currentPivotIndex+1,0,cellObject)
				this.assignToSortedArray(cellObject.value,pivot,'Right')
			}		
		};
		this.retrievePivotIndex = function(pivot) {
			var currentObjectArray = this.messages[this.messages.length-1]
			var index = 0
			for (var i = 0; i < currentObjectArray.length; i++) {
				if (currentObjectArray[i].value === pivot) {
					index = i
				}
			}
			return index
		}
		this.createFirstPivot = function() {
			var middleIndex = Math.ceil(this.messages[0].length / 2) - 1
			var pivotObjectOnDom = this.messages[0][middleIndex]
			var solvedObjectOnDom = JSON.parse(JSON.stringify(pivotObjectOnDom))
			pivotObjectOnDom.status = 'pivot'
			pivotObjectOnDom.parentPivot = ['first']
			solvedObjectOnDom.status = 'solved'
			var values = this.getValues()
			this.activePivots.push(values[middleIndex])
			values.splice(middleIndex,1)
			this.arraysToEvaluate.push(values)
			this.messages.push([solvedObjectOnDom])
		};
		this.setNewPivots = function(usedPivot,usedPivotRow) {
			//keep track of parent pivots by pushing used pivot into its parentPivot array
			//search for the object to turn into a pivot looking in row after used pivot row
			//turn those into pivots queue the arrays
			//turn them into solved in the next row if it is empty aka two rows after the used pivot is empty
			//push the pivot first into the new row of this.messages as solved
			//drag down all parent pivots that are solved (all of them will be in the row of this object)
			//if they arent already there
		};
		this.getValues = function() {
			return this.messages[this.messages.length-1].map(function(letterObject) {
				return letterObject.value
			})
		};
		this.assignToSortedArray = function(cellValue,pivotValue,direction) {
			var newObjectToPush = {
					pivot: pivotValue,
					cellValueArray: [cellValue],
					directionSortedTo: direction
				}
			if (this.sortedObjectsQueue.length === 0) {
				this.sortedObjectsQueue.push(newObjectToPush)
			} else {
				var notFound = true
				for (var i = 0; i < this.sortedObjectsQueue.length; i++) {
					var currentObject = this.sortedObjectsQueue[i]
					if (currentObject.pivot === pivotValue && currentObject.directionSortedTo === direction ) {
						notFound = false
						currentObject.cellValueArray.push(cellValue)
					}
				}
				if (notFound) {
					this.sortedObjectsQueue.push(newObjectToPush)
				}
			}
		};
		$timeout(this.init.bind(this), [1000], [true])
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
