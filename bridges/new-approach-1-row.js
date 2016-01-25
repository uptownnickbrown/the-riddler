var totalRows = 1;
var totalCols = 2;

var bridges = {
	'a':1,
	'b':1,
	'c':1,
	'd':1,
	'e':1
};

//console.log(bridges);

Object.keys(bridges).map(function(key) {
	if (Math.random() >= .5) {
		//console.log('deleting ' + key);
		bridges[key] = 0;
	} else {
		//console.log('keeping ' + key);
		bridges[key] = 0;
	}
});



var paths = [
	'ad',
	'ace',
	'be',
	'bcd'
];

var counter = 0;

var canCross = 0,
	noCross = 0;

while (counter < 32) {
	var resultString = (counter >>> 0).toString(2);
	while (resultString.length < 5) {
		resultString = '0' + resultString;
	}

	var results = resultString.split('');

	var bridgeKeys = Object.keys(bridges),
		trialBridges = bridges;

	var i = 0;
	while (i < 5) {
		trialBridges[bridgeKeys[i]] = results[i];
		i += 1;
	}



	var goodPaths = paths.filter(function(path){
		var bridgesPresent = path.split('').filter(function(bridge){
			return trialBridges[bridge] == 1;
		});
		return path.length == bridgesPresent.length;
	});

	console.log('<tr><td>' + Object.keys(trialBridges).filter(function(key){return trialBridges[key] == 1;}).join(', ') + '</td><td>' + goodPaths.map(function(path){return path.split('').join(' → ');}) + '</td></tr>');

	if (goodPaths.length > 0) {
		canCross += 1;
	} else {
		noCross += 1;
	}
	counter += 1;
}

console.log(canCross);
console.log(noCross);
