// Isolate the station list
stationList = document.getElementById("station_list");

function createStationList(){
    var jqxhr = $.getJSON("/station_info", function(data){
        console.log("success", data);
        var stations = data;

        // Loop through each station
        for (station_num in stations){
            // Create a new list item
            const listItem = document.createElement("li");
            const linkItem = document.createElement("a")
            linkItem.href = "station/" + stations[station_num].number;
            const stationInfo = document.createTextNode(stations[station_num].address);
            linkItem.appendChild(stationInfo);
            listItem.appendChild(linkItem);
            stationList.appendChild(listItem);
        }
    })
    .fail(function(){
        console.log("error");
    })
}

// Filter the stations list - reference: https://www.w3schools.com/howto/howto_js_filter_lists.asp
function filterStationList() {
    // Declare variables
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById('myInput');
    filter = input.value.toUpperCase();
    ul = document.getElementById("station_list");
    li = ul.getElementsByTagName('li');

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

function displayStationInfo(){

    var jqxhr = $.getJSON("/station_info/" + station_id, function(data){
        console.log("success", data);
        var stationInfo = data;

        // Display header
        const stationHeader = document.createTextNode(stationInfo[0]["address"])
        document.getElementById("station_title").appendChild(stationHeader);
        
        const stationInfoList = document.getElementById("station_info");

        // Display real time availability information
        var jqxhr = $.getJSON("/availability/" + station_id, function(data){
            console.log("success", data);
            var availability = data;
    
            for (key in availability[0]){
                const listItem = document.createElement("li");
                const listText = key + ": " + availability[0][key];
                listItem.innerHTML = listText;
                stationInfoList.appendChild(listItem)
            }

        })
        .fail(function(){
            console.log("error");
        })
    })
    .fail(function(){
        console.log("error");
    })
}


// Function to create the bike availability chart
function displayBikeAvailabilityChart(day){
    var day = day;
    var jqxhr = $.getJSON("/hourly_availability/available_bikes/" + station_id + "/" + day, function(data){
        var availabilityData = data;

        // Create the data table.
        var chart_data = new google.visualization.DataTable();
        chart_data.addColumn("string", "Hour");
        chart_data.addColumn("number", "# Bikes");
        chart_data.addRows(availabilityData["data"]);


        // Set chart options.
        var options = {
                title : "Average Available Bikes on " + day,
                width : 1900,
                height : 500};

        // Instantiate and draw a chart, passing in some options.
        var chart = new google.visualization.ColumnChart(document.getElementById("chartDiv"));
        chart.draw(chart_data, options);
    })
    .fail(function(){
        console.log("Error");
    });    
}