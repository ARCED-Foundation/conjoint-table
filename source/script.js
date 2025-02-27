/* global fieldProperties, setAnswer, getPluginParameter, goToNextField, clearAnswer, setMetaData, getPluginParameter */

// Set number of choices
var numChoice = 1
var tempResult = '' // Holds the temporary result
var stringResult = '' // Holds the string result stored as meta data - useful for rebuilding the table.

// Set colors
var DARK_GREY = '#555555'
var LIGHT_GREY = '#e7e7e7'
var GREEN = '#4caf50'
var BLUE = '#008cba'
var RED = '#fe0000'


// Get attributes from form definition
var loadFormAttributes = getPluginParameter('attributes')
// Get bypass value from form definition
var loadByPass = getPluginParameter('bypass')
// Get data format from form definition
var loadedDataFormat = getPluginParameter('data_format')
// Use 0 for string, 1 for numeric
if (loadedDataFormat == 'string') {
  var dataFormat = 0
} else {
  var dataFormat = 1
}

var image1 = getPluginParameter('image1')
var image2 = getPluginParameter('image2')

// Get randomize parameter from form definition
// Convert loaded attributes into an array
var attributeArray = loadFormAttributes.split(',')
// Get randomize parameter from form definition
var loadRandomizeOption = getPluginParameter('randomize')
// Check value of randomize 
if (loadRandomizeOption === 1) {
  var randomizeAttributes = true;
}
// var attributeArray = [' Bread ' , ' Cheese ' , ' Greens ' , ' Meat ' , ' Sauce ' , ' Veggie ' ];
// Get attribute levels from form. 

var loadAttributeLevels_a = getPluginParameter('level1') 
var loadAttributeLevels_b = getPluginParameter('level2') 
// Create array of levels resulting in [levels1, levels2, levels3. . .]

var attributeLevels_a = loadAttributeLevels_a.split('|') 
var attributeLevels_b = loadAttributeLevels_b.split('|') 
// Store an array of arrays - each level will have an array for that level

var levels_a = []
// Create array variables for each set of levels
for (var b = 0; b < attributeLevels_a.length; b++) {
  levels_a[b] = attributeLevels_a[b].split(',')
}

var levels_b = []
// Create array variables for each set of levels
for (var b = 0; b < attributeLevels_b.length; b++) {
  levels_b[b] = attributeLevels_b[b].split(',')
}
// Get labels from form definition
var loadLabels = getPluginParameter('labels')
if (loadLabels == undefined) {
  var loadedLabels = ['Profile 1', 'Profile 2'] // Set default labels
} else {
  var loadedLabels = loadLabels.split(',')
}

//  Create buttons and add labels (from above) to them
var button1 = document.getElementById('button1')
button1.innerHTML = loadedLabels[0]
var button2 = document.getElementById('button2')
button2.innerHTML = loadedLabels[1]
// Create column header and add labels (from above) to them
var header1 = document.getElementById('header1')
header1.innerHTML = loadedLabels[0]
var header2 = document.getElementById('header2')
header2.innerHTML = loadedLabels[1]
// Create bypass button
var bypass = document.getElementById('byPassButton')
if (loadByPass == undefined) {
  bypass.style.display = 'none' // Hide bypass button
} else {
  bypass.style.display = 'block' // Show bypass button
  bypass.innerText = loadByPass
}

// Retrieve current answer
var currentAnswer = fieldProperties.CURRENT_ANSWER
var metadata = getMetaData() // Retrieve metadata

// Perform the randomization and save it
for (var i = 1; i <= numChoice; i++) {
  if (currentAnswer != null) {
    recreateTable(i)
  } else {
    randomize(i)
  }
}
// Define Fisher-Yates shuffle
function shuffle(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1))
    var temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array
}

// Shuffle an array and choose the first entry
function shuffle_one(theArray) {
  var copiedArray = theArray.slice() // Copy the array so the original array is not modified
  var out = shuffle(copiedArray)
  return (out[0])
}

function randomize(i) {
  // Get table element
  var tableElement = document.getElementById('conjoint_table_' + i);

  // var attributeOrder = [1 ,2 ,3 ,4 ,5 ,6]
  // Get order of attributes
  var attributeOrder = [] // Array to store order of attributes
  // Generate order of attributes. By default this is a fixed order
  for (var a = 1; a <= attributeArray.length; a++) {
    attributeOrder.push(a)
  } // Will result in ordered array starting at 1 upto total number of attributes

  // Active if attributes are to be shown randomly. 
  if(randomizeAttributes) {
    shuffle(attributeOrder)
    var attributeOrderString = attributeOrder.join(',');
    setMetaData(attributeOrderString)
  }
   
  var s1 = []
  var s2 = []

  for (var c = 0; c < attributeLevels_a.length; c++) {
    s1.push(levels_a[c])
    s2.push(levels_b[c])
  }
  
  if (image1!=undefined && image2!=undefined) {
	  const table1 = document.getElementById('conjoint_table_1');
	  const lastRowIndex = table1.rows.length - 1; // Get the index of the last row
	  const lastRow = table1.rows[lastRowIndex]; // Get the last row
	  
	  // Create and configure the image elements
	  const image_a = document.createElement('img');
	  image_a.src = image1;
	  image_a.style.width = '100%';
	  
	  const image_b = document.createElement('img');
	  image_b.src = image2;
	  image_b.style.width = '100%';
	  
	  lastRow.cells[1].innerHTML = ''; // Clear existing content in cell2
	  lastRow.cells[1].appendChild(image_a); // Append the updated image_a
	  
	  lastRow.cells[2].innerHTML = ''; // Clear existing content in cell3
	  lastRow.cells[2].appendChild(image_b); // Append the updated image_b
  }
 
 

  // Create table
  for(var k = 1; k <= attributeOrder.length; k++) {
    var index = attributeOrder[k - 1] - 1
    var rowElement = document.createElement('tr')
    var labelCell = document.createElement('td')
    var label = document.createElement('strong')
    label.innerHTML = attributeArray[index]
   
    labelCell.appendChild(label)
    var option1Cell = document.createElement('td')
    var option1 = document.createTextNode(s1[index])
    option1Cell.appendChild(option1)
    var option2Cell = document.createElement('td');
    var option2 = document.createTextNode(s2[index])
    option2Cell.appendChild(option2)

    k === 1 ? stringResult = attributeArray[index] + ',' + s1[index] + ',' + s2[index] + '|' : stringResult += attributeArray[index] + ',' + s1[index] + ',' + s2[index] + '|'

    // if(dataFormat == 0) { // Save as string
    //   k === 1 ? tempResult = attributeArray[index] + ',' + s1[index] + ',' + s2[index] + '|' : tempResult += attributeArray[index] + ',' + s1[index] + ',' + s2[index] + '|'
    // } else { // Save as numeric
    //   k === 1 ? tempResult = (attributeArray.indexOf(attributeArray[index]) + 1) + ',' +(levels_a[index].indexOf(s1[index]) + 1) + ',' + (levels_b[index].indexOf(s2[index]) + 1) + '|' : tempResult += (attributeArray.indexOf(attributeArray[index]) + 1) + ',' +(levels[index].indexOf(s1[index]) + 1) + ',' + (levels[index].indexOf(s2[index]) + 1) + '|'
    // }
    
    rowElement.appendChild(labelCell)
    rowElement.appendChild(option1Cell).style.fontWeight = "bold"
    rowElement.appendChild(option2Cell).style.fontWeight = "bold"

    tableElement.appendChild(rowElement)
  }
}

console.log('String result: ' + stringResult)
console.log('Temp result: ' + tempResult)
//  Handle click events on button 1
function addResult1() {
  var result = ''
  if(dataFormat == 0) {
    result = tempResult + loadedLabels[0]
  } else {
    result = tempResult + 1
  }
  // setMetaData(stringResult)
  setAnswer(result)
  button1.style.backgroundColor = GREEN
  button2.style.backgroundColor = BLUE
  bypass.style.backgroundColor = RED
}

// Handle click events on button 2
function addResult2() {
  var result = ''
  if(dataFormat == 0) {
    result = tempResult + loadedLabels[1]
  } else {
    result = tempResult + 2
  }
  // setMetaData(stringResult)
  setAnswer(result)
  button2.style.backgroundColor = GREEN
  button1.style.backgroundColor = BLUE
  bypass.style.backgroundColor = RED
}

// Handle click events on bypass button
function pass() {
  var result = ''
  if(dataFormat == 0) {
    result = tempResult + loadByPass
  } else {
    result = tempResult + 0
  }
  // setMetaData(stringResult)
  setAnswer(result)
  bypass.style.backgroundColor = GREEN
  button1.style.backgroundColor = BLUE
  button2.style.backgroundColor = BLUE
}




// If a there is already has a response create a table not to be edited
function recreateTable(i) {
  // Get table element
  var tableElement = document.getElementById('conjoint_table_' + i);
  // Keep the same answer for the result
  result = currentAnswer 
  // Keep the same answer for the result
  var currentAnswerArray = currentAnswer.split('|')
  var metaDataArray = metadata.split('|')

  for(var l = 0; l < currentAnswerArray.length; l++) {
    if (l === (currentAnswerArray.length - 1)) {
      if(currentAnswerArray[currentAnswerArray.length - 1] === loadedLabels[0]) {
        button1.innerHTML = loadedLabels[0]
        disableButtons()
        button1.style.backgroundColor = DARK_GREY
        button1.style.color = LIGHT_GREY
      } else if(loadByPass != undefined && currentAnswerArray[currentAnswerArray.length - 1] === loadByPass) {
        bypass.innerHTML = loadByPass
        disableButtons()
        bypass.style.backgroundColor = DARK_GREY
        bypass.style.color = LIGHT_GREY
      } else {
        button2.innerHTML = loadedLabels[1]
        // button2.innerHTML = 2
        disableButtons()
        button2.style.backgroundColor = DARK_GREY
        button2.style.color = LIGHT_GREY
      }
    } else {
      var currentItem = currentAnswerArray[l].split(',')
      var currentMetaItem = metaDataArray[l].split(',')
      var rowElement = document.createElement('tr')
      var labelCell = document.createElement('td')
      var label = document.createElement('strong')
      if(dataFormat == 0) {
        label.innerHTML = currentItem[0]
      } else {
        label.innerHTML = currentMetaItem[0] //attributeArray[currentItem[0] - 1] 
      }
      labelCell.appendChild(label)
      var option1Cell = document.createElement('td')
      if(dataFormat == 0) {
        var option1 = document.createTextNode(currentItem[1])
      } else {
        var option1 = document.createTextNode(currentMetaItem[1]) //(levels[l][currentItem[1]-1])
      }
      option1Cell.appendChild(option1)
      var option2Cell = document.createElement('td')
      if(dataFormat == 0) {
        var option2 = document.createTextNode(currentItem[2])
      } else {
        var option2 = document.createTextNode(currentMetaItem[2]) //(levels[l][currentItem[2]-1])
      }
      option2Cell.appendChild(option2)
  
      rowElement.appendChild(labelCell)
      rowElement.appendChild(option1Cell)
      rowElement.appendChild(option2Cell)
  
      tableElement.appendChild(rowElement)
    }
  }
}

// Disable all buttons
function disableButtons() {
  button1.disabled = true;
  button2.disabled = true;
  bypass.disabled = true;
  button1.style.backgroundColor = LIGHT_GREY
  button2.style.backgroundColor = LIGHT_GREY
  bypass.style.backgroundColor = LIGHT_GREY
  button1.style.color = DARK_GREY
  button2.style.color = DARK_GREY
  bypass.style.color = DARK_GREY
}