$(document).ready(function() {

  // table = selector for <table> element
  // data = array of game results
  var pushGameDataToTable = function(table, data) {
    var tableBody = table + ' tbody',
      $table = $(table);

    // Remove all current table rows
    $tableBody = $(tableBody);
    $tableBody.children().remove();

    // Populate new rows based on data array
    data.forEach(function(gameData) {
      if (gameData.switch) {
        gameData.switchString = "Switch";
      } else {
        gameData.switchString = "Stay";
      }

      if (gameData.verdict) {
        gameData.verdictString = "Winner";
      } else {
        gameData.verdictString = "Loser";
      }
      $table.append('<tr">\
                <td>Door ' + gameData.guess + '</td>\
                <td>Door ' + gameData.reveal + '</td>\
                <td>' + gameData.switchString + '</td>\
                <td>Door ' + gameData.carLocation + '</td>\
                <td>' + gameData.verdictString + '</td>\
                </tr>');
    });
  };

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
