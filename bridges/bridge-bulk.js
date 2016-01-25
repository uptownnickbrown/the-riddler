var graphlib = require('graphlib');

// rows >= 1, cols >= 1, failRate = range from 0-1
var nightPasses = function(rows,cols,failRate) {
	var totalRows = rows;
	var totalCols = cols;

	var g = new graphlib.Graph({ directed: false, compound: false, multigraph: false});

	g.setNode("northShore", "North Shore");
	g.setNode("southShore", "South Shore");

	var currentRow = 1; // row counter
	var currentCol = 1; // col counter
	var nodeCount = totalRows * totalCols;

	// Make all the edges
	while (currentRow <= totalRows) {
		// reset counter after inner loop
		var currentCol = 1;
		while (currentCol <= totalCols) {
			var currentNodeId = ((nodeCount % totalCols) + currentCol) + (currentRow-1) * totalCols;
			//console.log('working on node: ' + currentNodeId);
			if (currentRow == 1) {
				//console.log('on the first row, linking to north shore');
				g.setEdge("northShore",currentNodeId);
				if (totalRows != 1) {
					// Make a downward edge
					//console.log('linking down a row');
					g.setEdge(currentNodeId,currentNodeId + totalCols);
				} else {
					//console.log('only one row, linking to south shore');
					g.setEdge(currentNodeId,"southShore");
				}
				if (currentCol != totalCols) {
					// Make a rightward edge
					//console.log('linking to the right');
					g.setEdge(currentNodeId,currentNodeId + 1);
				}
			} else if (currentRow == totalRows) {
				// We're on the last row, make an edge to the shore
				//console.log('on the last row, linking to south shore');
				g.setEdge(currentNodeId,"southShore");
				// Unless we're on the bottom-right node, make a rightward edge
				if (currentCol != totalCols) {
					//console.log('not on the right, linking to the right');
					g.setEdge(currentNodeId,currentNodeId + 1);
				}
			} else {
				// Make an edge to the right and down
				//console.log('linking both right and down');
				g.setEdge(currentNodeId,currentNodeId + totalCols);
				if (currentCol != totalCols) {
					// Make a rightward edge
					//console.log('linking to the right');
					g.setEdge(currentNodeId,currentNodeId + 1);
				}
			}
			currentCol  += 1;
		}
		currentRow  += 1;
	}

	g.edges().map(function(edge){
		if (Math.random() >= failRate) {
			//console.log('removing edge: ' + edge);
			g.removeEdge(edge);
		} else {
			//console.log('keeping edge: ' + edge);
		}
	});
	var results = graphlib.alg.dijkstra(g,'northShore',null,function(v) { return g.nodeEdges(v); });
	return results.southShore.distance;
}

var runBulkTrial = function (n,numTrials) {
	console.log('analyzing ' + n + ' rows and ' + (n+1) + ' columns.');
	var i = 0,
		trials = numTrials,
		results = [];

	while (i < trials) {
		results.push(nightPasses(n,n+1,.5));
		i += 1;
		process.stdout.write(".");
	}

	return results.filter(function(i){return i != Infinity}).length / trials;
}

var xResults = []
var yResults = []

var n = 2;

while (n < 20) {
	var trialResult = runBulkTrial(n,1000);
	console.log('\n' + n + ': ' + trialResult);
	xResults.push(n);
	yResults.push(trialResult);
	n += 1;
}

//var trace1 = {
//  x: xResults,
//  y: yResults,
//  type: "scatter"
//};
//
//var data = [trace1];
//var graphOptions = {filename: "basic-line", fileopt: "overwrite"};
//plotly.plot(data, graphOptions, function (err, msg) {
//    console.log(msg);
//});
