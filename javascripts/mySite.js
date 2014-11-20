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
		this.messages = [];
		this.arraysToEvaluate = [];
		this.activePivots = [];
		this.sortedObjectsQueue = []
		this.solvedObjects = []
		this.shuffledMessage = Shuffler.shuffleArray(this.startingMessage)
		this.messages.push(this.shuffledMessage)

		this.init = function() {
			this.createFirstPivot()
			this.interval = $interval(this.switchboard.bind(this), 200, [0], [true])
		};
		this.switchboard = function() {
			if (this.arraysToEvaluate.length === 0) {
				$interval.cancel(this.interval)
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
					this.arraysToEvaluate.splice(i,1)
					this.activePivots.splice(i,1)
					this.setNewPivots(currentPivot,rowOfActivePivot)
				}
				else {
					this.arraysToEvaluate[i].shift()	
				}			
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
			var currentPivotIndex = this.retrievePivotIndex(pivot,pivotRow)
			if (cellObject.value < pivot) {
				currentObjectArray.splice(currentPivotIndex,0,cellObject)
				this.assignToSortedArray(cellObject.value,pivot,'left')
			} else {
				currentObjectArray.splice(currentPivotIndex + 1,0,cellObject)
				this.assignToSortedArray(cellObject.value,pivot,'right')
			}		
		};
		this.retrievePivotIndex = function(pivot,row) {
			var currentObjectArray = this.messages[row + 1]
			var index = 0
			for (var i = 0; i < currentObjectArray.length; i++) {
				if (currentObjectArray[i].value === pivot) {
					index = i
				}
			}
			return index
		};
		this.createFirstPivot = function() {
			var middleIndex = Math.ceil(this.messages[0].length / 2) - 1
			var pivotObjectOnDom = this.messages[0][middleIndex]
			var solvedObjectOnDom = JSON.parse(JSON.stringify(pivotObjectOnDom))
			pivotObjectOnDom.status = 'pivot'
			solvedObjectOnDom.status = 'solved'
			var values = this.getValues()
			this.activePivots.push(values[middleIndex])
			values.splice(middleIndex,1)
			this.arraysToEvaluate.push(values)
			this.messages.push([solvedObjectOnDom])
			this.solvedObjects.push(solvedObjectOnDom)
		};
		this.setNewPivots = function(usedPivot,usedPivotRow) {
			var sortedValueArrays = this.getNewWorkingArrays(usedPivot)
			var newPivots = this.getMiddleValues(sortedValueArrays)
			var newPivotValues = newPivots.values
			this.removePivotFromArray(sortedValueArrays,newPivots.indexes)
			for (var i = 0; i < sortedValueArrays.length; i++) {
				if (sortedValueArrays[i].length === 0 ) {
					var solvedObject = this.solveObject(usedPivotRow,newPivotValues[i])
					this.addToSolvedArray(usedPivot,solvedObject)
					var futureRow = this.messages[usedPivotRow + 2]
					if (futureRow != undefined) {
						this.appenedSolvedToExistingRow(usedPivotRow + 2, futureRow,usedPivot,solvedObject)
					}
				} else {
					var newPivotObject = this.addPivotToDom(usedPivotRow,newPivotValues[i])
					this.addSolvedToDom(newPivotObject,usedPivot,usedPivotRow)
					this.queuePivot(sortedValueArrays[i],newPivotValues[i])
				}
			}
		};
		this.getNewWorkingArrays = function(pivotValue) {
			var sortedObjectsArrays = []
			for (var i = this.sortedObjectsQueue.length - 1; i >= 0; i--) {
				if (this.sortedObjectsQueue[i].pivot === pivotValue) {
					sortedObjectsArrays.push(this.sortedObjectsQueue[i].cellValueArray)
					this.sortedObjectsQueue.splice(i,1)				}
			}
			return sortedObjectsArrays
		}
		this.getMiddleValues = function(valueArrays) {
			var pivots = {indexes: [], values: []}
			for (var i = 0; i < valueArrays.length; i++) {
				var middleIndex = Math.ceil((valueArrays[i].length / 2 ) - 1 )
				pivots.indexes.push(middleIndex)
				pivots.values.push(valueArrays[i][middleIndex])
			}
			return pivots
		};
		this.removePivotFromArray = function(arrays,pivotIndexes) {
			var arraysWithoutPivots = arrays
			for (var i = 0; i < arraysWithoutPivots.length; i++) {
				arraysWithoutPivots[i].splice(pivotIndexes[i],1)
			}
			return arraysWithoutPivots
		};
		this.getValues = function() {
			return this.messages[this.messages.length-1].map(function(letterObject) {
				return letterObject.value
			})
		};
		this.solveObject = function(rowAboveObject,valueToSolve) {
			var rowOfObject = this.messages[rowAboveObject + 1]
			var solvedObject = {}
			for (var i = 0; i < rowOfObject.length; i++) {
				if (rowOfObject[i].value === valueToSolve) {
					rowOfObject[i].status = 'solved'
					solvedObject = rowOfObject[i]
				}
			}
			return solvedObject
		};
		this.addToSolvedArray = function(oldPivotValue,newSolvedObject) {
			var oldPivotIndex = 0
			var objectToAdd = JSON.parse(JSON.stringify(newSolvedObject))
			for (var i = 0; i < this.solvedObjects.length; i++) {
				if (this.solvedObjects[i].value === oldPivotValue) {
					oldPivotIndex = i
				}
			}
			if (oldPivotValue < newSolvedObject.value) {
				this.solvedObjects.splice(oldPivotIndex+1,0,objectToAdd)
			} else {
				this.solvedObjects.splice(oldPivotIndex,0,objectToAdd)
			}
		};
		this.addPivotToDom = function(usedPivotRow,newPivotValue) {
			var rowWithNewPivot = this.messages[usedPivotRow + 1]
			for (var i = 0; i < rowWithNewPivot.length; i++) {
				if (rowWithNewPivot[i].value === newPivotValue) {
					rowWithNewPivot[i].status = 'pivot'
					return rowWithNewPivot[i]
				}
			}
		};
		this.addSolvedToDom = function(pivotObject,oldPivotValue,oldPivotRow) {
			var rowIndex = oldPivotRow + 2
			var rowToAppendTo = this.messages[rowIndex]
			var newSolvedObject = JSON.parse(JSON.stringify(pivotObject))
			newSolvedObject.status = 'solved'
			if (rowToAppendTo === undefined) {
				this.addToSolvedArray(oldPivotValue,newSolvedObject)
				this.messages.push(this.solvedObjects.slice(0))
			} else {
				this.appenedSolvedToExistingRow(rowIndex,rowToAppendTo,oldPivotValue,newSolvedObject)
				this.addToSolvedArray(oldPivotValue,newSolvedObject)
			}
		};
		this.appenedSolvedToExistingRow = function(rowNumber,row,oldPivotValue,objectToAppend) {
			var workingRowNumber = rowNumber
			var workingRow = row
			var indexOfOldPivotOnWorkingRow = 0
			for (var i = workingRowNumber; i < this.messages.length; i++) {
				for (var i = 0; i < workingRow.length; i++) {
					if (workingRow[i].value === oldPivotValue) {
						indexOfOldPivotOnWorkingRow = i
					}
				}
				if (objectToAppend.value > oldPivotValue) {
					workingRow.splice(indexOfOldPivotOnWorkingRow + 1,0,objectToAppend)
				} else {
					workingRow.splice(indexOfOldPivotOnWorkingRow,0,objectToAppend)
				}
			}
		};
		this.queuePivot = function(valuesToSort,pivotValue) {
			this.activePivots.push(pivotValue)
			this.arraysToEvaluate.push(valuesToSort)
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
						if (currentObject.directionSortedTo === 'right') {
							currentObject.cellValueArray.unshift(cellValue)
						} else {
							currentObject.cellValueArray.push(cellValue)
						}
						notFound = false
					}
				}
				if (notFound === true) {
					this.sortedObjectsQueue.push(newObjectToPush)
					notFound = true
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
})();
