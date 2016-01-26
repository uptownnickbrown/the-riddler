// Set up Graph for any given row/column size with row >= 0, col >= 1
var newGraph = function(totalRows, totalCols) {
  var totalRows = totalRows;
  var totalCols = totalCols;
  var g = new graphlib.Graph({
    directed: false,
    compound: false,
    multigraph: false
  });

  g.totalRows = totalRows;
  g.totalCols = totalCols;

  g.setNode("northShore", "northShore");
  g.setNode("southShore", "southShore");

  var currentRow = 1; // row counter
  var currentCol = 1; // col counter
  var nodeCount = totalRows * totalCols;

  if (nodeCount == 0) {
    g.setEdge("northShore", "southShore");
    return g;
  }

  // Make all the edges
  while (currentRow <= totalRows) {
    // reset counter after inner loop
    var currentCol = 1;
    while (currentCol <= totalCols) {
      var currentNodeId = ((nodeCount % totalCols) + currentCol) + (currentRow - 1) * totalCols;
      //console.log('working on node: ' + currentNodeId);
      if (currentRow == 1) {
        //console.log('on the first row, linking to north shore');
        g.setEdge("northShore", currentNodeId);
        if (totalRows != 1) {
          // Make a downward edge
          //console.log('linking down a row');
          g.setEdge(currentNodeId, currentNodeId + totalCols);
        } else {
          //console.log('only one row, linking to south shore');
          g.setEdge(currentNodeId, "southShore");
        }
        if (currentCol != totalCols) {
          // Make a rightward edge
          //console.log('linking to the right');
          g.setEdge(currentNodeId, currentNodeId + 1);
        }
      } else if (currentRow == totalRows) {
        // We're on the last row, make an edge to the shore
        //console.log('on the last row, linking to south shore');
        g.setEdge(currentNodeId, "southShore");
        // Unless we're on the bottom-right node, make a rightward edge
        if (currentCol != totalCols) {
          //console.log('not on the right, linking to the right');
          g.setEdge(currentNodeId, currentNodeId + 1);
        }
      } else {
        // Make an edge to the right and down
        //console.log('linking both right and down');
        g.setEdge(currentNodeId, currentNodeId + totalCols);
        if (currentCol != totalCols) {
          // Make a rightward edge
          //console.log('linking to the right');
          g.setEdge(currentNodeId, currentNodeId + 1);
        }
      }
      currentCol += 1;
    }
    currentRow += 1;
  }

  return g;
};

// Render a graph to a target element using SVG.
// Graph should fit the size of the target element (must have height and width set).
var drawGraph = function($targetElement, graph, path) {
  // path is optional. if included, it will highlight a single path through the graph
  var p = path || [];
  var g = graph;
  var totalRows = g.totalRows,
      totalCols = g.totalCols;

  var fullWidth = $targetElement.width();
  var width = $targetElement.width() * .9;
  var fullHeight = $targetElement.height();
  var height = $targetElement.height() * .9;
  var xOffset = width * .05;
  var yOffset = width * .05;

  var nodeWidth = width / (5 + totalCols + (totalCols - 1) * 2);
  var nodeHeight = height / (7 + totalRows + (totalRows - 1) * 2);
  var nodeSize = nodeWidth < nodeHeight ? nodeWidth : nodeHeight;
      nodeSize = height * .15 > nodeSize ? nodeSize : height * .15;
  var lineWidth = nodeSize / 7;

  var northShoreLine = yOffset + nodeSize * 2;
  var southShoreLine = (yOffset + height - (nodeSize * 2));
  var vertBridgeLength = (southShoreLine - northShoreLine  - totalRows * nodeSize) / (totalRows + 1);

  // Setup the background and north / south shores
  var svgString = '<svg width="' + fullWidth + '" height="' + fullHeight + '" viewBox="0 0 ' + fullWidth + ' ' + fullHeight + '" xmlns="http://www.w3.org/2000/svg">';
  svgString += '<rect x="' + xOffset + '" y="' + yOffset + '" width="' + width + '" height="' + height + '" fill="#ECECEC" />';
  svgString += '<rect x="' + xOffset + '" y="' + yOffset + '" width="' + width + '" height="' + nodeSize * 2 + '" fill="#ED6F39" />';
  svgString += '<rect x="' + xOffset + '" y="' + southShoreLine + '" width="' + width + '" height="' + nodeSize * 2 + '" fill="#ED6F39" />';

  if (g.hasEdge('northShore', 'southShore')) {
    svgString += '<line x1="' + (fullWidth / 2) + '" y1="' + northShoreLine + '" x2="' + (fullWidth / 2) + '" y2="' + southShoreLine + '" stroke="#ED6F39" stroke-width="' + lineWidth + '"/>';
  }

  var i = 0,
      j = 0;
  var nodeCount = 1;
  while (i < totalRows * 2) {
    if (i % 2 == 0) {
      var j = 0;
      while (j < totalCols) {
        // top row
        if (i == 0) {
          if (g.hasEdge('northShore', nodeCount)) {
              // vertical line to node
              svgString += '<line x1="' + (xOffset + ((j * 2) + 1.5) * (width / ((totalCols * 2) + 1))) + '" y1="' + northShoreLine + '" x2="' + (xOffset + ((j * 2) + 1.5) * (width / ((totalCols * 2) + 1)))  + '" y2="' + (northShoreLine + vertBridgeLength) + '" stroke="#ED6F39" stroke-width="' + lineWidth + '"/>';
          }
          j += 1;
          nodeCount += 1;
        } else {
          if (g.hasEdge(nodeCount - totalCols, nodeCount)) {
            svgString += '<line x1="' + (xOffset + ((j * 2) + 1.5) * (width / ((totalCols * 2) + 1))) + '" y1="' + ((i / 2) * (vertBridgeLength + nodeSize) + northShoreLine) + '" x2="' + (xOffset + ((j * 2) + 1.5) * (width / ((totalCols * 2) + 1)))  + '" y2="' + ((i / 2) * (vertBridgeLength + nodeSize) + northShoreLine + vertBridgeLength) + '" stroke="#ED6F39" stroke-width="' + lineWidth + '"/>';
          }
          j += 1;
          nodeCount += 1;
        }
      }
      nodeCount -= totalCols;
    } else {
      var j = 0;
      while (j < totalCols) {
        // draw node
        svgString += '<rect x="' + (xOffset + ((j * 2) + 1.5) * (width / ((totalCols * 2) + 1)) - nodeSize / 2) + '" y="' + (((i-1) / 2) * (vertBridgeLength + nodeSize) + vertBridgeLength + northShoreLine) + '" width="' + nodeSize + '" height="' + nodeSize + '" fill="#ED6F39" />';
        if (g.hasEdge(nodeCount, nodeCount + 1)) {
          // horizontal line between nodes
          svgString += '<line x1="' + (xOffset + ((j * 2) + 1.5) * (width / ((totalCols * 2) + 1)) + nodeSize / 2) + '" y1="' + (((i-1) / 2) * (vertBridgeLength + nodeSize) + vertBridgeLength + northShoreLine + .5 * nodeSize) + '" x2="' + (xOffset + (((j+1) * 2) + 1.5) * (width / ((totalCols * 2) + 1)) - nodeSize / 2) + '" y2="' + (((i-1) / 2) * (vertBridgeLength + nodeSize) + vertBridgeLength + northShoreLine  + .5 * nodeSize) + '" stroke="#ED6F39" stroke-width="' + lineWidth + '"/>';
        }
        j += 1;
        nodeCount += 1;
      }
    }
    i += 1;
  };
  nodeCount -= totalCols;
  var j = 0;
  while (j < totalCols) {
    if (g.hasEdge(nodeCount, 'southShore')) {
      // vertical line to the bottom
      svgString += '<line x1="' + (xOffset + ((j * 2) + 1.5) * (width / ((totalCols * 2) + 1))) + '" y1="' + ((i / 2) * (vertBridgeLength + nodeSize) + northShoreLine) + '" x2="' + (xOffset + ((j * 2) + 1.5) * (width / ((totalCols * 2) + 1)))  + '" y2="' + southShoreLine + '" stroke="#ED6F39" stroke-width="' + lineWidth + '"/>';
    }
    j += 1;
    nodeCount += 1;
  }

  svgString += '</svg>';
  $targetElement.html(svgString);

  // return the graph chain methods on it
  return g;
};

var nightPasses = function(g, failureRate) {
  // default failure rate is .5
  var fail = failureRate || .5;
  g.edges().map(function(edge) {
    if (Math.random() >= fail) {
      //console.log('removing edge: ' + edge);
      g.removeEdge(edge);
    } else {
      //console.log('keeping edge: ' + edge);
    }
  });
  return g;
};

var plannedNight = function(g, outcome) {
  var outcomes = outcome.split('');
  console.log(outcomes);

  // a, b, c, d, e, f, g, h, i, j, k, l, m ==
  // 1, 4, 7, 3, 6, 2, 5, 8, 10, 12, 9, 13, 13
  // doy...

  var keyMap = {
    '0':1,
    '1':4,
    '2':7,
    '3':3,
    '4':6,
    '5':2,
    '6':5,
    '7':8,
    '8':10,
    '9':12,
    '10':9,
    '11':11,
    '12':13
  };

  var edges = g.edges();

  for (i in outcomes) { // these match the letter from gridOfResults or the keys from the keymap above
    if (outcomes[i] == 0) {
      var edgeIndex = keyMap[i] - 1;
      //console.log('removing edge: ' + edges[edgeIndex]);
      g.removeEdge(edges[edgeIndex]);
    } else {
      //console.log('keeping edge');
    }
  }
  return g;
};

var sampleLabeledRoad = function(g, paths) {
  var validPaths = paths;

  // a, b, c, d, e ==
  // 1, 4, 3, 2, 5
  // doy...TODO fix whatever causes this weird mapping shit
  var keyMap = {
    0: 'a',
    1: 'd',
    2: 'c',
    3: 'b',
    4: 'e'
  };
  var edges = g.edges();

  var i = 0;

  while (i < 5) { // these match the letter from valid path list or the keys from the keymap above

    if ($.inArray(keyMap[i],validPaths) > -1) {
      //console.log('keeping edge');
    } else {
      //console.log('removing edge: ' + edges[i]);
      g.removeEdge(edges[i]);
    }
    i += 1;
  }
  return g;
};

var analyzeGraph = function(g) {
  // Huge props to http://www.redblobgames.com/pathfinding/a-star/introduction.html for the A* algo with early exit
  // Alternate simpler, but way slower approach uses built-in Dijkstra algo in graphlib
  // var results = graphlib.alg.dijkstra(g,'northShore',null,function(v) { return g.nodeEdges(v); });
  var frontier = new Heap(function(a, b) {
    return a.priority - b.priority;
  });
  frontier.push({
    'name': g.node('northShore'),
    'priority': 0
  });
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
        frontier.push({
          'name': next,
          'priority': priority
        });
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

  if (path[0] == undefined) {
    return false;
  } else {
    return path;
  }
};

var runBulkTrial = function (totalRows, totalCols, failureRate, numTrials, $targetElement) {
  var failureRate = failureRate || .5;
  var numTrials = numTrials || 1000;
	console.log('analyzing ' + totalRows + ' rows and ' + totalCols + ' columns, ' + numTrials + ' times with fail rate ' + failureRate);

  var i = 0,
		results = [];




	while (i < numTrials) {
    if ($targetElement && ((i+1) % numTrials == 0)) {
      var g = drawGraph($targetElement,nightPasses(newGraph(totalRows,totalCols),failureRate));
      results.push(analyzeGraph(g));
    } else {
      results.push(analyzeGraph(nightPasses(newGraph(totalRows,totalCols),failureRate)));
    }
		i += 1;
	}

	return results.filter(function(result){return result.length > 0}).length / numTrials;
};

// TODO make this work dynamically on the graph provided in
var addLabels = function($targetedChart,activeLabels) {
  var activeLabels = activeLabels || ['a','b','c','d','e'];

  var labelStrings = {
    'a': '<text x="132" y="120" font-size="22" fill="#333333">a</text>',
    'b': '<text x="276" y="120" font-size="22" fill="#333333">b</text>',
    'c': '<text x="190" y="147" font-size="22" fill="#333333">c</text>',
    'd': '<text x="132" y="200" font-size="22" fill="#333333">d</text>',
    'e': '<text x="276" y="200" font-size="22" fill="#333333">e</text>'
  }

  var labelOutput = activeLabels.map(function(path){
    return labelStrings[path];
  });

  $(labelOutput.join('')).appendTo($targetedChart.children('svg'));
  $targetedChart.html($targetedChart.html());
};

var gridOfResults = function() {
  var $render = $('.allCombos');
  var svgString = '<svg width="' + $('.allCombos').width() + '" height="' + $('.allCombos').height() + '" viewBox="0 0 ' +  $('.allCombos').width() + ' ' + $('.allCombos').height()  + '" xmlns="http://www.w3.org/2000/svg">';

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

  while (counter < 8196) {
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

  	var goodPaths = paths.filter(function(path){
  		var bridgesPresent = path.split('').filter(function(bridge){
  			return trialBridges[bridge] == 1;
  		});
  		return path.length == bridgesPresent.length;
  	});

    var horizontalCount = (counter % 90) * 4;
    var vertCount = Math.floor(counter / 90) * 4;
    var caseData = [];

    for(var i in trialBridges) {
        caseData.push(trialBridges[i]);
    }

    if (goodPaths.length > 0) {
  		canCross += 1;
      svgString += '<rect class="case" data-case="' + caseData.join('') + '" x="' + horizontalCount + '" y="' + vertCount + '" width="4" height="4" fill="#64B464" />';
  	} else {
      svgString += '<rect class="case" data-case="' + caseData.join('') + '" x="' + horizontalCount + '" y="' + vertCount + '" width="4" height="4" fill="#F06464" />';
  		noCross += 1;
  	}
  	counter += 1;
  }
  svgString += '</svg>';
  $render.html(svgString);
};


$(document).ready(function() {

  drawGraph($('.zeroRow .graphic'), newGraph(0,1));
  drawGraph($('.threeCharts .oneRow .graphic'), newGraph(1,2));
  drawGraph($('.twoRow .graphic'), newGraph(2,3));

  drawGraph($('.singleChart .oneRow .graphic'), newGraph(1,2));

  var paths = [['a','d'],['a','c','e'],['b','c','d'],['b','e']];

  var i = 0;
  setInterval(function() {
    drawGraph($('.singleChart .oneRowAnimated .graphic'), sampleLabeledRoad(newGraph(1,2),paths[i % 4]));
    addLabels($('.singleChart .oneRowAnimated .graphic'),paths[i % 4]);
    i += 1;
  },1500);

  drawGraph($('.singleChart .twoRowAnimated .graphic'), newGraph(2,3));

  gridOfResults();
  $('.case').click(function(event){
    var outcome = $(this).data('case') + '';
    var focusGraph = newGraph(2,3);
    focusGraph = plannedNight(focusGraph, outcome);
    drawGraph($('.comboDisplay'),focusGraph);
  });

    $('.goRedo').click(function(){
        var $this = $(this);
        $this.toggleClass('again');
        if($this.hasClass('again')){
            $this.text('Again?');
        }
    });

    $('.zeroRow .goRedo').click(function(e) {
      var animate = setInterval(function() {
        drawGraph($('.zeroRow .graphic'),nightPasses(newGraph(0,1)));
      },50);
      var result = runBulkTrial(0,1,.5,5000);
      setTimeout(function() {
        clearInterval(animate);
      },600);
      $('.zeroRow .goRedo').after("<div class='result'>Probability of safety: <span class='liveResult'>" + result + "</span></div>")
    });

    $('.threeCharts .oneRow .goRedo').click(function(e) {
      var animate = setInterval(function() {
        drawGraph($('.threeCharts .oneRow .graphic'),nightPasses(newGraph(1,2)));
      },50);
      var result = runBulkTrial(1,2,.5,5000);
      setTimeout(function() {
        clearInterval(animate);
      },600);
      $('.threeCharts .oneRow .goRedo').after("<div class='result'>Probability of safety: <span class='liveResult'>" + result + "</span></div>")
    });

    $('.twoRow .goRedo').click(function(e) {
      var animate = setInterval(function() {
        drawGraph($('.twoRow .graphic'),nightPasses(newGraph(2,3)));
      },50);
      var result = runBulkTrial(2,3,.5,5000);
      setTimeout(function() {
        clearInterval(animate);
      },600);
      $('.twoRow .goRedo').after("<div class='result'>Probability of safety: <span class='liveResult'>" + result + "</span></div>")
    });


});
