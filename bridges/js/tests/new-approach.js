var totalRows = 2;
var totalCols = 3;

var bridges = {
	'a':1,
	'b':1,
	'c':1,
	'd':1,
	'e':1,
	'f':1,
	'g':1,
	'h':1,
	'i':1,
	'j':1,
	'k':1,
	'l':1,
	'm':1
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
	'afk',
	'afil',
	'afijm',
	'afigehm',
	'adgik',
	'adgl',
	'adgjm',
	'adehm',
	'adehjl',
	'adehjik',
	'bdfk',
	'bdfil',
	'bdfijm',
	'bgl',
	'bgik',
	'bgjm',
	'behm',
	'behjl',
	'behjik',
	'chm',
	'chjl',
	'chjik',
	'chjgdfk',
	'cegjm',
	'cegl',
	'cegik',
	'cedfk',
	'cedfil',
	'cedfijm'
];

var counter = 0;

var canCross = 0,
	noCross = 0;

while (counter < 8192) {
	var resultString = (counter >>> 0).toString(2);
	while (resultString.length < 13) {
		resultString = '0' + resultString;
	}
	
	var results = resultString.split('');
	
	var bridgeKeys = Object.keys(bridges),
		trialBridges = bridges;
	
	var i = 0;
	while (i < 13) {
		trialBridges[bridgeKeys[i]] = results[i];
		i += 1;
	}
	//console.log(trialBridges);
	
	var goodPaths = paths.filter(function(path){
		var bridgesPresent = path.split('').filter(function(bridge){
			return trialBridges[bridge] == 1;
		});
		return path.length == bridgesPresent.length;
	});
	
	console.log(counter + ': ' + goodPaths.length);
	if (goodPaths.length > 0) {
		canCross += 1;
	} else {
		noCross += 1;
	}
	counter += 1;
}

console.log(canCross);
console.log(noCross);