var graphlib = require('graphlib');
var Heap = require('heap');

var totalRows = 2;
var totalCols = 3;

var g = new graphlib.Graph({ directed: false, compound: false, multigraph: false});

g.setNode("northShore", "northShore");
g.setNode("southShore", "southShore");

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

var nightPasses = function(g) {
	g.edges().map(function(edge){
		if (Math.random() >= .5) {
			//console.log('removing edge: ' + edge);
			g.removeEdge(edge);
		} else {
			//console.log('keeping edge: ' + edge);
		}
	});
	return g;
}

var drawBoard = function(g,totalRows,totalCols,path) {
	var visitedNodes = path || [];


	console.log(Array(11 + totalCols + (totalCols - 1) * 2).join("_"));
	var i = 0, j = 0;
	var nodeCount = 1;
	while (i < totalRows * 2) {
		if (i % 2 == 0) {
			process.stdout.write("||   ");
			var j = 0;
			while (j < totalCols) {
				// top row
				if (i == 0) {
					if (g.hasEdge('northShore',nodeCount)) {
						process.stdout.write("|");
					} else {
						process.stdout.write(" ");
					}
					process.stdout.write("  ");
					j += 1;
					nodeCount += 1;
				} else {
					if (g.hasEdge(nodeCount-totalCols,nodeCount)) {
						process.stdout.write("|");
					} else {
						process.stdout.write(" ");
					}
					process.stdout.write("  ");
					j += 1;
					nodeCount += 1;
				}
			}
			console.log(" ||");
			nodeCount -= totalCols;
		} else {
			process.stdout.write("||   ");
			var j = 0;
			while (j < totalCols) {
				process.stdout.write("O");
				if (g.hasEdge(nodeCount,nodeCount+1)) {
					process.stdout.write("——");
				} else {
					process.stdout.write("  ");
				}
				j += 1;
				nodeCount += 1;
			}
			console.log(" ||");
		}
		i += 1;
	};
	nodeCount -= totalCols;
	process.stdout.write("||   ");
	var j = 0;
	while (j < totalCols) {
		if (g.hasEdge(nodeCount,'southShore')) {
			process.stdout.write("|");
		} else {
			process.stdout.write(" ");
		}
		process.stdout.write("  ");
		j += 1;
		nodeCount += 1;
	}
	console.log(" ||");
	console.log(Array(11 + totalCols + (totalCols - 1) * 2).join("‾"));
}


drawBoard(g,totalRows,totalCols);
g = nightPasses(g);
drawBoard(g,totalRows,totalCols);
//console.log(g.edges());


// Huge props to http://www.redblobgames.com/pathfinding/a-star/introduction.html
var frontier = new Heap(function(a, b) {
    return a.priority - b.priority;
});
frontier.push({'name':g.node('northShore'),'priority':0});
console.log(frontier);
var cameFrom = {};
cameFrom['northShore'] = 0;

while (frontier.size() > 0) {
	var current = frontier.pop().name;
	if (current == 'southShore') {
		break;
	}
	var neighbors = g.neighbors(current);
	neighbors.map(function(next) {
		if (!(next in cameFrom)) {
			priority = next;
			frontier.push({'name':next,'priority':priority});
			cameFrom[next] = current;
		}
   	});
}

current = 'southShore';
path = ['southShore'];
while (current != 'northShore' && current != undefined) {
	current = cameFrom[current];
	path.push(current);
}
path.reverse();
console.log(path);

//var results = graphlib.alg.dijkstra(g,'northShore',null,function(v) { return g.nodeEdges(v); });
