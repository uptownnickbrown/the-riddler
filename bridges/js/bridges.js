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

  // Make all the edges
  while (currentRow <= totalRows) {
    // reset counter after inner loop
    var currentCol = 1;
    while (currentCol <= totalCols) {
      if (totalRows == 0) {
        g.setEdge("northShore", "southShore");
        break;
      }
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

  var width = $targetElement.width();
  var height = $targetElement.height();

  var svgString = '<svg width="' + width + '" height="' + height + '" viewBox="0 0 ' + width + ' ' + height + '" xmlns="http://www.w3.org/2000/svg">';
  svgString += '<rect x="0" y="0" width="' + width + '" height="' + height + '" fill="#ECECEC" />';
  svgString += '<rect x="0" y="0" width="' + width + '" height="10" fill="#ED6F39" />';
  svgString += '<rect x="0" y="' + height + '" width="' + width + '" height="10" fill="#ED6F39" />';

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
              // vertical line to first node
              svgString += '<line x1="85" y1="20" x2="85" y2="120" stroke="#ED6F39" stroke-width="2"/>';
          }
          j += 1;
          nodeCount += 1;
        } else {
          if (g.hasEdge(nodeCount - totalCols, nodeCount)) {
            svgString += '<line x1="85" y1="20" x2="85" y2="120" stroke="#ED6F39" stroke-width="2"/>';
          }
          j += 1;
          nodeCount += 1;
        }
      }
      nodeCount -= totalCols;
    } else {
      var j = 0;
      while (j < totalCols) {
        // node
        svgString += '<rect x="100" y="60" width="20" height="20" fill="#ED6F39" />';
        if (g.hasEdge(nodeCount, nodeCount + 1)) {
          // horizontal line between nodes
          svgString += '<line x1="85" y1="20" x2="85" y2="120" stroke="#ED6F39" stroke-width="2"/>';
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
      svgString += '<line x1="85" y1="20" x2="85" y2="120" stroke="#ED6F39" stroke-width="2"/>';
    }
    j += 1;
    nodeCount += 1;
  }

  console.log(svgString);

  $targetElement.append(svgString);

  // return the target element, so you can jQuery method chain it
  return $targetElement;
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



$(document).ready(function() {

  drawGraph($('.zeroRow .graphic'), newGraph(2,3));


  // Set up button handlers
  function setupButtons() {
    $('.thousandRunTrial .button.goAgain').click(function() {
      console.log('clicked!');
      buildThousandRunSection();
      return false;
    });

    $('.tenRunTrial .button.goAgain').click(function() {
      console.log('clicked!');
      buildTenRunSection();
      return false;
    });
  }

  //setupButtons();

});
