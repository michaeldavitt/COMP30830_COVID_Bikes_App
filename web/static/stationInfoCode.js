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
    .done(function(){
        console.log("second success");
    })
    .fail(function(){
        console.log("error");
    })
    .always(function(){
        console.log("complete");
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
        const stationHeader = document.createTextNode("Information for station: " + stationInfo[0]["address"])
        document.getElementById("station_title").appendChild(stationHeader);
        
        // Display all other information
        const stationInfoList = document.getElementById("station_info");
        console.log(stationInfo);

        for (key in stationInfo[0]){
            const listItem = document.createElement("li");
            const listText = document.createTextNode(key + ": " + stationInfo[0][key]);
            listItem.appendChild(listText);
            stationInfoList.appendChild(listItem)
        }

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
        .done(function(){
            console.log("second success");
        })
        .fail(function(){
            console.log("error");
        })
        .always(function(){
            console.log("complete");
        })
    })
    .done(function(){
        console.log("second success");
    })
    .fail(function(){
        console.log("error");
    })
    .always(function(){
        console.log("complete");
    })
}


// Function to create the charts
function displayCharts(){
    var jqxhr = $.getJSON("/availability/" + station_id, function(data){
        var availabilityData = data;

        // Create the data table.
        var chart_data = new google.visualization.DataTable();
        chart_data.addColumn("string", "Description");
        chart_data.addColumn("number", "Available Units");
        chart_data.addRows([
        ["Available Stands", availabilityData[0]["available_stands"]],
        ["Available Bikes", availabilityData[0]["available_bikes"]],
        ]);


        // Set chart options.
        var options = {
                title : "Bikes availability",
                width : 700,
                height : 500};

        // Instantiate and draw a chart, passing in some options.
        var chart = new google.visualization.ColumnChart(document.getElementById("chartDiv"));
        chart.draw(chart_data, options);
    });    
}

function testing(){
    var jqxhr = $.getJSON("/occupancy/" + station_id, function(data){
        var availabilityData = data;
        console.log(availabilityData)
        console.log(availabilityData["data"][0][0].getDay());     

    });
}