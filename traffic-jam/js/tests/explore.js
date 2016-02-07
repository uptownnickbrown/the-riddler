// emulate python's range() function. sometimes I miss Python
function range(start, stop, step) {
    if (typeof stop == 'undefined') {
        // one param defined
        stop = start;
        start = 0;
    }

    if (typeof step == 'undefined') {
        step = 1;
    }

    if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
        return [];
    }

    var result = [];
    for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
        result.push(i);
    }

    return result;
};

// Fischer-Yates shuffle
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// How many groups of cars are there?
function analyzeGroups(orderedCars) {
  var i = 0,
      groupLeaderSpeed = orderedCars[0],
      currentCarSpeed,
      groups = [[]];

  while (i < orderedCars.length) {
    currentCarSpeed = orderedCars[i];
    if (currentCarSpeed >= groupLeaderSpeed) {
      groups[groups.length-1].push(currentCarSpeed);
    } else {
      groups.push([currentCarSpeed]);
      groupLeaderSpeed = currentCarSpeed;
    }
    i += 1;
  }
  return groups;
}

var createTrafficJam = function (numCars) {
  var cars = range(numCars);
  cars = shuffle(cars);
  //console.log(cars);
  var groups = analyzeGroups(cars);
  //console.log(groups);
  //console.log(groups.length + ' total groups');
  return groups.length;
}

var runBulkTrial = function (numCars,numTrials) {
	//console.log('analyzing ' + numCars + ' cars for ' + numTrials + ' trials.');
	var i = 0,
		trials = numTrials,
		results = [];

	while (i < trials) {
		results.push(createTrafficJam(numCars));
		i += 1;
	}

	return (results.reduce( (prev, curr) => prev + curr )) / trials;
}
