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
					this.setNewPivots(currentPivot)
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
		this.getWorkingPivotIndex = function(pivot) {
			//goes through this.messages and finds the row with the value of pivot and status = pivot
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
			pivotObjectOnDom.status = 'pivot'
			picotObjectOnDom.parentPivot = 'first'
			//copy this nonsense and make a new object in the next row as solved not pivot
			var values = this.getValues()
			this.activePivots.push(values[middleIndex])
			values.splice(middleIndex,1)
			this.arraysToEvaluate.push(values)
			this.messages.push([pivotObjectOnDom])
		};
		this.setNewPivots = function(usedPivot) {
			/*okay bro heres the scoop
			every time you set a pivot you push it to the next row on the dom because
			evaluated cells are pushed based on the row after the active pivot duhh
			this function will take the pivot go find the objects they got sorted into,
			get the middle index assign the pivot which is always located on the objects that will be on the flipping
			dom in the row after the pivot that is passed into this
			you will make them pivots in that row and then push and unshift them into the row after that
			and start evaluating
			also if the array length is 1 in the object then that will be created as a pivot then 
			pushed or unshifted into the next row immediately (based on parent once agian) then u will destroy
			the object and not queue it because it doesnt need to be sorted */
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
