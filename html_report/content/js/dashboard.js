/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.80353634577604, "KoPercent": 0.19646365422396855};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.3948919449901768, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.13, 500, 1500, "Agent Login"], "isController": false}, {"data": [1.0, 500, 1500, "System Virtual Money Creation"], "isController": false}, {"data": [0.25, 500, 1500, "Deposit Agent To Customer 2"], "isController": false}, {"data": [0.72, 500, 1500, "Search Transaction By Transaction ID"], "isController": false}, {"data": [1.0, 500, 1500, "Deposit System To Customer"], "isController": false}, {"data": [0.63, 500, 1500, "Transaction History"], "isController": false}, {"data": [0.4, 500, 1500, "Payment Customer 1 to Merchant"], "isController": false}, {"data": [0.52, 500, 1500, "Withdraw Customer 2 To Agent"], "isController": false}, {"data": [1.0, 500, 1500, "Save all local data to global(Easily accessible from one thread group to another)"], "isController": false}, {"data": [0.28, 500, 1500, "Send Money Customer 2 To Customer 1"], "isController": false}, {"data": [0.5, 500, 1500, "Admin Login"], "isController": false}, {"data": [0.15, 500, 1500, "Customer 2 Login"], "isController": false}, {"data": [1.0, 500, 1500, "Create Customer"], "isController": false}, {"data": [0.17, 500, 1500, "Customer Login"], "isController": false}, {"data": [1.0, 500, 1500, "Create Customer 2"], "isController": false}, {"data": [1.0, 500, 1500, "Create Merchant"], "isController": false}, {"data": [1.0, 500, 1500, "Create Agent"], "isController": false}, {"data": [1.0, 500, 1500, "Deposit System To Agent"], "isController": false}, {"data": [0.6, 500, 1500, "Check Customer 1 Balance"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 509, 1, 0.19646365422396855, 1486.8035363457768, 56, 4505, 1383.0, 2983.0, 3360.0, 3677.2999999999984, 16.446411838831626, 13.524297281414585, 9.308818792610424], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Agent Login", 50, 0, 0.0, 2325.2400000000002, 301, 3739, 2445.0, 3470.5, 3555.6, 3739.0, 2.2150356620741594, 1.5120214138572632, 0.6294681422495902], "isController": false}, {"data": ["System Virtual Money Creation", 1, 0, 0.0, 124.0, 124, 124, 124.0, 124.0, 124.0, 124.0, 8.064516129032258, 2.811554939516129, 5.81999747983871], "isController": false}, {"data": ["Deposit Agent To Customer 2", 50, 1, 2.0, 1626.7400000000002, 308, 3289, 1642.0, 2732.4, 2899.849999999999, 3289.0, 2.1942335542195113, 1.6741316320709176, 1.6156758787905385], "isController": false}, {"data": ["Search Transaction By Transaction ID", 50, 0, 0.0, 704.2, 56, 3112, 438.5, 2048.6, 2577.049999999999, 3112.0, 2.3291563795593233, 1.4187837727675037, 1.442075336563097], "isController": false}, {"data": ["Deposit System To Customer", 1, 0, 0.0, 84.0, 84, 84, 84.0, 84.0, 84.0, 84.0, 11.904761904761903, 4.917689732142857, 8.696056547619047], "isController": false}, {"data": ["Transaction History", 50, 0, 0.0, 892.9000000000002, 66, 2993, 516.5, 2450.0, 2795.1499999999987, 2993.0, 2.2574382590636146, 7.894861223983024, 1.4263306187638267], "isController": false}, {"data": ["Payment Customer 1 to Merchant", 50, 0, 0.0, 1333.26, 366, 3024, 1167.0, 2733.4, 2823.5, 3024.0, 2.1869395967283385, 0.7655997135109128, 1.5910839839478634], "isController": false}, {"data": ["Withdraw Customer 2 To Agent", 50, 0, 0.0, 1189.86, 274, 3221, 713.0, 2826.1, 2938.3999999999996, 3221.0, 2.20799293442261, 0.7436451203356149, 1.6085573526164716], "isController": false}, {"data": ["Save all local data to global(Easily accessible from one thread group to another)", 1, 0, 0.0, 85.0, 85, 85, 85.0, 85.0, 85.0, 85.0, 11.76470588235294, 0.0, 0.0], "isController": false}, {"data": ["Send Money Customer 2 To Customer 1", 50, 0, 0.0, 1516.7199999999998, 418, 3167, 1530.5, 2838.8, 2964.45, 3167.0, 2.181691247054717, 0.7543027042063007, 1.5915267202635484], "isController": false}, {"data": ["Admin Login", 1, 0, 0.0, 1348.0, 1348, 1348, 1348.0, 1348.0, 1348.0, 1348.0, 0.741839762611276, 0.5042192136498516, 0.20284681008902075], "isController": false}, {"data": ["Customer 2 Login", 50, 0, 0.0, 2255.7, 294, 3684, 2305.0, 3467.3, 3550.15, 3684.0, 2.4235373951820076, 1.670915430662595, 0.6792531566574572], "isController": false}, {"data": ["Create Customer", 1, 0, 0.0, 427.0, 427, 427, 427.0, 427.0, 427.0, 427.0, 2.34192037470726, 1.2121267564402811, 1.9302546838407495], "isController": false}, {"data": ["Customer Login", 50, 0, 0.0, 2219.68, 418, 4505, 2278.5, 3567.7999999999997, 3982.9499999999985, 4505.0, 2.704749540192578, 1.864798022828086, 0.7765589500162284], "isController": false}, {"data": ["Create Customer 2", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 1.150074743735763, 1.8507972665148065], "isController": false}, {"data": ["Create Merchant", 1, 0, 0.0, 336.0, 336, 336, 336.0, 336.0, 336.0, 336.0, 2.976190476190476, 1.5316917782738095, 2.453031994047619], "isController": false}, {"data": ["Create Agent", 1, 0, 0.0, 427.0, 427, 427, 427.0, 427.0, 427.0, 427.0, 2.34192037470726, 1.1892564402810304, 1.914245462529274], "isController": false}, {"data": ["Deposit System To Agent", 1, 0, 0.0, 91.0, 91, 91, 91.0, 91.0, 91.0, 91.0, 10.989010989010989, 3.831129807692308, 7.930546016483516], "isController": false}, {"data": ["Check Customer 1 Balance", 50, 0, 0.0, 1004.1399999999999, 231, 2999, 537.5, 2489.5999999999995, 2831.9999999999995, 2999.0, 2.2119978764820387, 0.7322922657494249, 1.3781783644487702], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500/Internal Server Error", 1, 100.0, 0.19646365422396855], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 509, 1, "500/Internal Server Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Deposit Agent To Customer 2", 50, 1, "500/Internal Server Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
