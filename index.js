$(document).ready(function () {
  
// ===== BUTTON EVENTS =====
  // Sets the users focus to the search box on page load.
  $("#searchInput").focus();
  
  // On click, run searchWiki function.
  $("#searchBtn").on("click", searchWiki);
  // When a key is released (so it can only be triggered once) with the focus set on #searchInput:
  $("#searchInput").keyup(function(event){
    // If the key pressed is enter/13:
    if(event.keyCode == 13){
        // Click the search button.
        $("#searchBtn").click();
    };
  });
  
// ===== SEARCH FUNCTION =====
  // The main function that executes the search.
  function searchWiki () {
    // Stores the contents of the  #searchInput as a variable.
    var searchTerm = $("#searchInput").val();
    // Closes the autocomplete box.
    $("#searchInput").autocomplete("close");
    // Empties the #searchInput box.
    $("#searchInput").val('');
    // Sends a get request to the Wikipedia API, with the contents of #searchInput as the search term.
    $.getJSON("https://en.wikipedia.org/w/api.php?action=opensearch&datatype=json&limit=10&callback=?&search=" + searchTerm, function(data) {
      // Displays all the recieved from the API at the top of the page in a span (usually hidden).
      $("#msg").html(JSON.stringify(data));
      // Empties the output div of any previous search results.
      $("#searchResultsCol").empty()
      // For the number of search results:
      for (i = 0; i < data[1].length; i++) {
        // Creates a group of html elements for each result, containing the relevant data from the JSON response.
        var row = $("<div>").addClass("row singleResultRow");
        var link = $("<a>").attr({href: data[3][i], target: "_blank"});
        var col = $("<div>").addClass("col-md-12 singleResultCol");
        var header = $("<h3>").text(data[1][i]);
        var span = $("<span>").text(data[2][i]);
        // Places the html element in a structure.
        row.appendTo("#searchResultsCol");
        link.appendTo(row);
        col.appendTo(link);
        header.appendTo(col);
        span.appendTo(col);
      }; // for loop
  })}; // .getJSON's function
  
// ===== AUTOCOMPLETE =====
  // jQuery UI autocomplete for #searchInput using the API.
  $("#searchInput").autocomplete({
    source: function(request, response) {
        $.ajax({
            url: "http://en.wikipedia.org/w/api.php",
            dataType: "jsonp",
            data: {
                'action': "opensearch",
                'format': "json",
                'search': request.term
            },
            // If successful:
            success: function(data) {
                // Passes the article titles array back to the autocomplete to be displayed.
                response(data[1]);
            }
        });
    }
}); // autocomplete
  
}); // document ready