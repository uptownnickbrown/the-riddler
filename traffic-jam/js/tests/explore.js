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

var n = 1;
var predicted = 0;

console.log('n\tpredict\tresults\tdiff');
while (n < 500) {
	var trialResult = runBulkTrial(n,10000);
  predicted += (1 / n);
  roundResult = Math.floor(trialResult * 1000) /  1000;
  roundPredict = Math.floor(predicted * 1000) /  1000;
	console.log(n + '\t' + roundPredict + '\t' +  roundResult + '\t' + (Math.floor(1000 * Math.abs(roundPredict - roundResult)) / 1000));

	n += 1;
}

// It's a harmonic mean! When you add the second car, there's a 50/50 chance that it is going
// as fast or faster than the previous car (and doesn't add a new traffic jam) and a 50/50 chance
// it is going slower and does cause a new jam.

// When you add a 3rd car, it has a 1/3 chance of doing the same. Add a 4th? 1/4

// This series (1/1 + 1/2 + 1/3 + 1/4 + ... + 1/N) is known as a harmonic series and pops up in a
// lot of interesting places. In particular in music.

// H_n	=	sum_(k=1)^(n)1/k

// http://mathworld.wolfram.com/HarmonicSeries.html


// sum_(k=1)^infty1/k
