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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8269886363636364, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.95, 500, 1500, "https://www.easemytrip.com/Login/ReadAllRecentCookies"], "isController": false}, {"data": [0.8, 500, 1500, "https://hotelservice.easemytrip.com/api/HotelService/GetStatic"], "isController": false}, {"data": [0.8, 500, 1500, "https://flightservice.easemytrip.com/EmtAppService/FareCalendar/FillCalendarDataByMonth"], "isController": false}, {"data": [0.95, 500, 1500, "https://flightservice-web.easemytrip.com/EmtAppService//SignIn/CheckSignIn"], "isController": false}, {"data": [0.25, 500, 1500, "https://easemytrip.com/railways/"], "isController": false}, {"data": [0.9, 500, 1500, "https://solr.easemytrip.com/api/auto/GetTrainAutoSuggest/v"], "isController": false}, {"data": [0.95, 500, 1500, "https://loginuser.easemytrip.com/api/Login/VerifyUserLogin"], "isController": false}, {"data": [0.9, 500, 1500, "https://solr.easemytrip.com/api/auto/GetTrainAutoSuggest/h"], "isController": false}, {"data": [0.85, 500, 1500, "https://solr.easemytrip.com/v1/api/autocomplete/common?search=hyder&key=jNUYK0Yj5ibO6ZVIkfTiFA=="], "isController": false}, {"data": [0.0, 500, 1500, "EaseMY Trip LoginTest"], "isController": true}, {"data": [0.95, 500, 1500, "https://busservice.easemytrip.com/api/search/getsourcecity?id=hyd"], "isController": false}, {"data": [1.0, 500, 1500, "https://solr.easemytrip.com/api/auto/GetTrainAutoSuggest/vija"], "isController": false}, {"data": [0.8, 500, 1500, "https://flight.easemytrip.com/Login/CheckSignIn"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.easemytrip.com/Login/ReadRecentTrainSearchCookie"], "isController": false}, {"data": [1.0, 500, 1500, "https://busservice.easemytrip.com/api/Home/WriteHomeLog/"], "isController": false}, {"data": [0.85, 500, 1500, "https://cruise.easemytrip.com/home"], "isController": false}, {"data": [0.98, 500, 1500, "https://www.easemytrip.com/hotelcity.txt"], "isController": false}, {"data": [0.8833333333333333, 500, 1500, "https://solr.easemytrip.com/v1/api/autocomplete/common?search=hyd&key=jNUYK0Yj5ibO6ZVIkfTiFA=="], "isController": false}, {"data": [1.0, 500, 1500, "https://loginuser.easemytrip.com/api/Login/AuthenticateLoginUser"], "isController": false}, {"data": [0.75, 500, 1500, "https://busservice.easemytrip.com/api/bus/CouponRead/"], "isController": false}, {"data": [0.425, 500, 1500, "https://transferapi.easemytrip.com/api/trackOpen/start/list"], "isController": false}, {"data": [1.0, 500, 1500, "https://solr.easemytrip.com/api/auto/GetTrainAutoSuggest/hy"], "isController": false}, {"data": [1.0, 500, 1500, "https://railways.easemytrip.com/Login/CheckSignIn"], "isController": false}, {"data": [0.0, 500, 1500, "https://busservice.easemytrip.com/api/Home/GetSearchResult/"], "isController": false}, {"data": [0.98, 500, 1500, "https://www.easemytrip.com/api/flight/GetDate"], "isController": false}, {"data": [1.0, 500, 1500, "https://busservice.easemytrip.com/api/search/sourceAutoSuggest"], "isController": false}, {"data": [0.0, 500, 1500, "Search Taxi Test"], "isController": true}, {"data": [0.0, 500, 1500, "Search Train and Bus Test"], "isController": true}, {"data": [0.823076923076923, 500, 1500, "https://www.easemytrip.com/"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.easemytrip.com/Train/TrainLogs"], "isController": false}, {"data": [1.0, 500, 1500, "https://hotelservice.easemytrip.com/api/HotelService/RightFilter"], "isController": false}, {"data": [0.775, 500, 1500, "https://solr.easemytrip.com/v1/api/autocomplete/common?search=hydera&key=jNUYK0Yj5ibO6ZVIkfTiFA=="], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://flightservice.easemytrip.com/EmtAppService/UserWallet/GetBalance"], "isController": false}, {"data": [0.85, 500, 1500, "https://railways.easemytrip.com/Train/_TrainBtwnStationList"], "isController": false}, {"data": [0.8625, 500, 1500, "https://transfer.easemytrip.com/list/CTAR273/mapgx25638127938938920507/2023-05-31T17:57:00/4/0/0/other/pickup"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.easemytrip.com/railways/"], "isController": false}, {"data": [0.8, 500, 1500, "https://hotelservice.easemytrip.com/api/HotelService/HotelList"], "isController": false}, {"data": [0.75, 500, 1500, "https://flightservice-web.easemytrip.com/EmtAppService/AirAvail_Lights/AirBusSearch"], "isController": false}, {"data": [0.0, 500, 1500, "Search Cruise Test"], "isController": true}, {"data": [0.975, 500, 1500, "https://www.easemytrip.com/Login/AgentMenuAccess"], "isController": false}, {"data": [1.0, 500, 1500, "https://gi.easemytrip.com/etm/api/etoken/GUT"], "isController": false}, {"data": [0.0, 500, 1500, "Search Hotel and Flight Test"], "isController": true}, {"data": [0.85, 500, 1500, "https://gi.easemytrip.com/etm/api/etoken/GIT"], "isController": false}, {"data": [0.8611111111111112, 500, 1500, "https://getip.easemytrip.com/UserIP.svc/GetIP"], "isController": false}, {"data": [0.7833333333333333, 500, 1500, "https://www.easemytrip.com/flights.html"], "isController": false}, {"data": [0.95, 500, 1500, "https://www.easemytrip.com/Login/ReadSearchCookies"], "isController": false}, {"data": [0.95, 500, 1500, "https://www.easemytrip.com/search.aspx/CheckSignIn"], "isController": false}, {"data": [0.725, 500, 1500, "https://hotelservice.easemytrip.com/api/HotelService/HotelDetailsLogs"], "isController": false}, {"data": [1.0, 500, 1500, "https://getip.easemytrip.com/etm/api/etoken/GenerateTokenV2"], "isController": false}, {"data": [0.95, 500, 1500, "https://www.easemytrip.com/scripts/newloginCommon_captcha.js?a=s2sd2saaa"], "isController": false}, {"data": [0.3, 500, 1500, "https://easemytrip.com/railways/-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://www.easemytrip.com/hotels/login/CheckSignIn"], "isController": false}, {"data": [0.65, 500, 1500, "https://easemytrip.com/railways/-0"], "isController": false}, {"data": [0.8, 500, 1500, "https://flightservice-web.easemytrip.com/EmtAppService//Addons/CurrencyConverter?Country=INR"], "isController": false}, {"data": [0.3, 500, 1500, "https://bus.easemytrip.com/home/list?org=Kadapa&des=Hyderabad&date=29-05-2023&searchid=1248_501"], "isController": false}, {"data": [0.0, 500, 1500, "https://railways.easemytrip.com/TrainListInfo/Hyderabad--All-Stations-(HYB)-to-Vijayawada-Jn-(BZA)/2/25-07-2023"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "https://www.easemytrip.com/hotels/"], "isController": false}, {"data": [0.89, 500, 1500, "https://www.easemytrip.com/autocity.txt"], "isController": false}, {"data": [1.0, 500, 1500, "https://hotelservice.easemytrip.com/api/HotelService/GetCouponlistShow"], "isController": false}, {"data": [1.0, 500, 1500, "https://busservice.easemytrip.com/api/search/getsourcecity?id=Kadapa"], "isController": false}, {"data": [0.94, 500, 1500, "https://flightservice.easemytrip.com/EmtAppService/Analytics/PushEvent"], "isController": false}, {"data": [0.9, 500, 1500, "https://solr.easemytrip.com/api/auto/GetTrainAutoSuggest/vij"], "isController": false}, {"data": [0.875, 500, 1500, "https://transferapi.easemytrip.com/api/offer/offerlist/home"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://solr.easemytrip.com/v1/api/autocomplete/common?search=hyde&key=jNUYK0Yj5ibO6ZVIkfTiFA=="], "isController": false}, {"data": [0.9357142857142857, 500, 1500, "https://www.easemytrip.com/cabs"], "isController": false}, {"data": [0.8, 500, 1500, "https://transferapi.easemytrip.com/api/Login/CheckSignIn"], "isController": false}, {"data": [0.4, 500, 1500, "https://www.easemytrip.com/bus/"], "isController": false}, {"data": [0.7, 500, 1500, "https://www.easemytrip.com/hotels/hotels-in-hyderabad/?e=202351785910&city=Hyderabad,%20India&cin=26/05/2023&cOut=31/05/2023&Hotel=NA&Rooms=1&pax=3_2_3_1"], "isController": false}, {"data": [0.9, 500, 1500, "https://flightservice-web.easemytrip.com/EmtAppService/FlightStatus/FlightAmentiesByListing"], "isController": false}, {"data": [0.95, 500, 1500, "https://busservice.easemytrip.com/api/search/destinationAutoSuggest?sourceId=1248"], "isController": false}, {"data": [0.925, 500, 1500, "https://railways.easemytrip.com/Train/TrainLogs"], "isController": false}, {"data": [0.925, 500, 1500, "https://www.easemytrip.com/api/SignIn/CheckSignIn"], "isController": false}, {"data": [0.5, 500, 1500, "https://transferapi.easemytrip.com/api/search/transfer/"], "isController": false}, {"data": [0.9, 500, 1500, "https://flightservice-web.easemytrip.com/EmtAppService//AppInitialize/GetCoupons"], "isController": false}, {"data": [0.8, 500, 1500, "https://bus.easemytrip.com/SignIn/CheckSignIn"], "isController": false}, {"data": [0.6375, 500, 1500, "https://transfer.easemytrip.com/list/CTAR273/RALKCG/2023-05-31T17:57:00/4/0/0/other/pickup"], "isController": false}, {"data": [1.0, 500, 1500, "https://solr.easemytrip.com/api/auto/GetTrainAutoSuggest/vi"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1710, 0, 0.0, 606.4461988304087, 66, 16501, 176.5, 1337.3000000000006, 2519.2999999999975, 7496.5799999999845, 5.845354481438435, 259.6155987749538, 4.684722602037328], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://www.easemytrip.com/Login/ReadAllRecentCookies", 10, 0, 0.0, 177.79999999999998, 108, 518, 116.0, 498.9000000000001, 518.0, 518.0, 0.05899983480046256, 0.019416937820074105, 0.031401279263918065], "isController": false}, {"data": ["https://hotelservice.easemytrip.com/api/HotelService/GetStatic", 10, 0, 0.0, 462.79999999999995, 168, 1344, 285.5, 1287.7000000000003, 1344.0, 1344.0, 0.1006653982826483, 0.8600305047614734, 0.11875371203656167], "isController": false}, {"data": ["https://flightservice.easemytrip.com/EmtAppService/FareCalendar/FillCalendarDataByMonth", 20, 0, 0.0, 682.65, 224, 4462, 358.5, 1927.5000000000025, 4341.149999999998, 4462.0, 0.16488997716273815, 9.099060487826996, 0.08292806468633804], "isController": false}, {"data": ["https://flightservice-web.easemytrip.com/EmtAppService//SignIn/CheckSignIn", 30, 0, 0.0, 280.8666666666666, 101, 3206, 133.5, 320.0, 1762.7999999999981, 3206.0, 0.2271883921877485, 0.13067769824080455, 0.45748287567493884], "isController": false}, {"data": ["https://easemytrip.com/railways/", 10, 0, 0.0, 5055.3, 1021, 16501, 1484.5, 16318.5, 16501.0, 16501.0, 0.05878583731607381, 20.46659926503007, 0.06469886587423358], "isController": false}, {"data": ["https://solr.easemytrip.com/api/auto/GetTrainAutoSuggest/v", 10, 0, 0.0, 347.79999999999995, 110, 2204, 134.5, 2006.2000000000007, 2204.0, 2204.0, 0.05923082846159769, 0.11637932311009234, 0.02371546842700689], "isController": false}, {"data": ["https://loginuser.easemytrip.com/api/Login/VerifyUserLogin", 10, 0, 0.0, 346.79999999999995, 262, 509, 318.0, 503.0, 509.0, 509.0, 0.11323489446507835, 0.11989186775296676, 0.3529743975903615], "isController": false}, {"data": ["https://solr.easemytrip.com/api/auto/GetTrainAutoSuggest/h", 10, 0, 0.0, 360.0, 265, 736, 288.0, 717.7, 736.0, 736.0, 0.05961891588963346, 0.11458010397538931, 0.023870854994872775], "isController": false}, {"data": ["https://solr.easemytrip.com/v1/api/autocomplete/common?search=hyder&key=jNUYK0Yj5ibO6ZVIkfTiFA==", 30, 0, 0.0, 708.1333333333332, 118, 6781, 191.0, 1693.5000000000011, 5748.0999999999985, 6781.0, 0.17144326656570563, 0.7785600372889104, 0.07349960353744606], "isController": false}, {"data": ["EaseMY Trip LoginTest", 10, 0, 0.0, 19613.7, 11405, 36723, 17442.5, 35866.600000000006, 36723.0, 36723.0, 0.07877861633238274, 109.06763261149143, 1.903303679749169], "isController": true}, {"data": ["https://busservice.easemytrip.com/api/search/getsourcecity?id=hyd", 10, 0, 0.0, 267.1, 128, 1085, 161.5, 1003.9000000000003, 1085.0, 1085.0, 0.06076109345663785, 0.033940767048043795, 0.023972150152814148], "isController": false}, {"data": ["https://solr.easemytrip.com/api/auto/GetTrainAutoSuggest/vija", 10, 0, 0.0, 138.1, 110, 231, 125.5, 223.8, 231.0, 231.0, 0.059236091365747326, 0.055765226637285566, 0.023891118880911763], "isController": false}, {"data": ["https://flight.easemytrip.com/Login/CheckSignIn", 10, 0, 0.0, 419.6, 245, 706, 317.5, 703.0, 706.0, 706.0, 0.07676364473785215, 0.026162609388193748, 0.035907993974053885], "isController": false}, {"data": ["https://www.easemytrip.com/Login/ReadRecentTrainSearchCookie", 50, 0, 0.0, 126.35999999999996, 93, 329, 117.5, 168.29999999999998, 199.09999999999974, 329.0, 0.27829726600765875, 0.07962997943383204, 0.14539945050204828], "isController": false}, {"data": ["https://busservice.easemytrip.com/api/Home/WriteHomeLog/", 10, 0, 0.0, 338.8, 268, 471, 344.0, 462.90000000000003, 471.0, 471.0, 0.0612606210601763, 0.021237812965197844, 0.046902662999197486], "isController": false}, {"data": ["https://cruise.easemytrip.com/home", 20, 0, 0.0, 444.1, 106, 1354, 201.5, 1244.8000000000006, 1350.0, 1354.0, 0.600168047053175, 0.23737115142239829, 0.20279115652382668], "isController": false}, {"data": ["https://www.easemytrip.com/hotelcity.txt", 50, 0, 0.0, 154.46000000000004, 66, 936, 99.0, 261.79999999999995, 561.7499999999986, 936.0, 0.35613550243596687, 2.530161894747714, 0.18711025420952165], "isController": false}, {"data": ["https://solr.easemytrip.com/v1/api/autocomplete/common?search=hyd&key=jNUYK0Yj5ibO6ZVIkfTiFA==", 30, 0, 0.0, 336.5666666666667, 115, 1734, 168.0, 819.7000000000004, 1248.3499999999995, 1734.0, 0.17064361081880494, 0.6210827514860214, 0.07282349407013453], "isController": false}, {"data": ["https://loginuser.easemytrip.com/api/Login/AuthenticateLoginUser", 10, 0, 0.0, 225.5, 136, 371, 210.0, 365.90000000000003, 371.0, 371.0, 0.11382261883081406, 0.1070310543673739, 0.3888198444044801], "isController": false}, {"data": ["https://busservice.easemytrip.com/api/bus/CouponRead/", 10, 0, 0.0, 696.2, 142, 2836, 171.0, 2716.4000000000005, 2836.0, 2836.0, 0.0597239558759414, 0.05389153830993149, 0.026712472452325352], "isController": false}, {"data": ["https://transferapi.easemytrip.com/api/trackOpen/start/list", 20, 0, 0.0, 1826.9, 1132, 8839, 1196.5, 5389.500000000009, 8687.599999999999, 8839.0, 0.11282861333634209, 0.03746262552183234, 0.7244610670766106], "isController": false}, {"data": ["https://solr.easemytrip.com/api/auto/GetTrainAutoSuggest/hy", 10, 0, 0.0, 119.7, 101, 160, 115.0, 157.10000000000002, 160.0, 160.0, 0.059955273366068915, 0.11136223627174129, 0.024064079446732736], "isController": false}, {"data": ["https://railways.easemytrip.com/Login/CheckSignIn", 10, 0, 0.0, 189.2, 109, 352, 140.0, 344.8, 352.0, 352.0, 0.060553214164607856, 0.026314629202393063, 0.1253640762001647], "isController": false}, {"data": ["https://busservice.easemytrip.com/api/Home/GetSearchResult/", 10, 0, 0.0, 3454.3, 2726, 5222, 3101.0, 5131.3, 5222.0, 5222.0, 0.058408826741897235, 38.69747335279808, 0.04089758669330109], "isController": false}, {"data": ["https://www.easemytrip.com/api/flight/GetDate", 50, 0, 0.0, 222.14, 97, 2776, 129.0, 327.4, 439.34999999999974, 2776.0, 0.34857537245278547, 0.12220562374077147, 0.15420375363389827], "isController": false}, {"data": ["https://busservice.easemytrip.com/api/search/sourceAutoSuggest", 10, 0, 0.0, 146.6, 107, 294, 128.5, 280.80000000000007, 294.0, 294.0, 0.061263998823731215, 0.06814423306663073, 0.023991077664371308], "isController": false}, {"data": ["Search Taxi Test", 10, 0, 0.0, 25479.600000000002, 11483, 40499, 23491.5, 40330.7, 40499.0, 40499.0, 0.07214382593137679, 9.234304039783714, 2.6035184994805647], "isController": true}, {"data": ["Search Train and Bus Test", 10, 0, 0.0, 26979.0, 17719, 41709, 25737.0, 40837.100000000006, 41709.0, 41709.0, 0.05382826629919903, 202.4836709010448, 1.6126401889910429], "isController": true}, {"data": ["https://www.easemytrip.com/", 130, 0, 0.0, 648.9384615384618, 96, 9387, 153.5, 1467.3000000000004, 2932.3999999999965, 8685.159999999994, 0.9316124778742036, 56.74753089101567, 0.40478114273019783], "isController": false}, {"data": ["https://www.easemytrip.com/Train/TrainLogs", 10, 0, 0.0, 147.0, 114, 272, 125.5, 262.80000000000007, 272.0, 272.0, 0.05943253812597321, 0.019385222396557666, 0.10656068359305351], "isController": false}, {"data": ["https://hotelservice.easemytrip.com/api/HotelService/RightFilter", 10, 0, 0.0, 208.6, 121, 320, 175.0, 318.4, 320.0, 320.0, 0.09390024038461539, 0.3248728238619291, 0.1622163332425631], "isController": false}, {"data": ["https://solr.easemytrip.com/v1/api/autocomplete/common?search=hydera&key=jNUYK0Yj5ibO6ZVIkfTiFA==", 20, 0, 0.0, 606.65, 121, 3284, 221.5, 1721.1000000000001, 3206.349999999999, 3284.0, 0.11670586038477923, 0.3569045284062064, 0.05014704938408482], "isController": false}, {"data": ["https://flightservice.easemytrip.com/EmtAppService/UserWallet/GetBalance", 60, 0, 0.0, 552.8166666666666, 95, 5627, 282.5, 868.9999999999999, 2265.6, 5627.0, 0.3598783611139435, 0.18275073025317443, 0.18052492007701396], "isController": false}, {"data": ["https://railways.easemytrip.com/Train/_TrainBtwnStationList", 10, 0, 0.0, 482.8, 210, 1274, 363.5, 1226.1000000000001, 1274.0, 1274.0, 0.06053195481894892, 3.2554841951065967, 0.03351720545150785], "isController": false}, {"data": ["https://transfer.easemytrip.com/list/CTAR273/mapgx25638127938938920507/2023-05-31T17:57:00/4/0/0/other/pickup", 40, 0, 0.0, 655.4250000000001, 97, 9126, 138.5, 1673.4999999999998, 3911.1999999999966, 9126.0, 0.2933411557641537, 0.47245400502346724, 0.1339228421091229], "isController": false}, {"data": ["https://www.easemytrip.com/railways/", 20, 0, 0.0, 127.14999999999998, 106, 159, 123.0, 154.8, 158.85, 159.0, 0.11817397572706538, 0.03900664433178526, 0.0474311562732655], "isController": false}, {"data": ["https://hotelservice.easemytrip.com/api/HotelService/HotelList", 10, 0, 0.0, 1162.9, 110, 8782, 302.5, 7997.500000000003, 8782.0, 8782.0, 0.09367418245857259, 0.14521327854954896, 0.15505638600320365], "isController": false}, {"data": ["https://flightservice-web.easemytrip.com/EmtAppService/AirAvail_Lights/AirBusSearch", 10, 0, 0.0, 1346.6999999999998, 107, 9947, 279.5, 9106.900000000003, 9947.0, 9947.0, 0.07689645891806683, 0.040100301818601254, 0.11234092045061327], "isController": false}, {"data": ["Search Cruise Test", 10, 0, 0.0, 5641.0, 2905, 9039, 5196.0, 8987.4, 9039.0, 9039.0, 0.28250981721614826, 55.68196766322005, 3.2369996927705738], "isController": true}, {"data": ["https://www.easemytrip.com/Login/AgentMenuAccess", 20, 0, 0.0, 234.65, 91, 971, 129.5, 472.0000000000001, 946.2499999999997, 971.0, 0.20064406745653549, 0.057410851332778214, 0.11090287322304597], "isController": false}, {"data": ["https://gi.easemytrip.com/etm/api/etoken/GUT", 10, 0, 0.0, 166.70000000000002, 105, 387, 127.0, 376.80000000000007, 387.0, 387.0, 0.07681966583445363, 0.038829940464758975, 0.0672172076051469], "isController": false}, {"data": ["Search Hotel and Flight Test", 10, 0, 0.0, 20934.699999999997, 13398, 38760, 19089.0, 37866.3, 38760.0, 38760.0, 0.08310893919750008, 147.551618767349, 2.8490783218642997], "isController": true}, {"data": ["https://gi.easemytrip.com/etm/api/etoken/GIT", 10, 0, 0.0, 704.3, 251, 3769, 346.0, 3453.000000000001, 3769.0, 3769.0, 0.07673242635605382, 0.04211291368369359, 0.04016462942074691], "isController": false}, {"data": ["https://getip.easemytrip.com/UserIP.svc/GetIP", 90, 0, 0.0, 521.8777777777779, 102, 7069, 298.5, 973.0000000000002, 2046.2000000000012, 7069.0, 0.3629134693317957, 0.21500732883589457, 0.1345961629965362], "isController": false}, {"data": ["https://www.easemytrip.com/flights.html", 30, 0, 0.0, 642.9999999999998, 109, 6738, 168.5, 1401.2000000000007, 3936.2999999999965, 6738.0, 0.25846471956577927, 38.49433194947015, 0.12031398078745585], "isController": false}, {"data": ["https://www.easemytrip.com/Login/ReadSearchCookies", 10, 0, 0.0, 287.5, 99, 1099, 208.5, 1021.2000000000003, 1099.0, 1099.0, 0.1047987340312929, 0.0299863565148133, 0.05813054778298278], "isController": false}, {"data": ["https://www.easemytrip.com/search.aspx/CheckSignIn", 100, 0, 0.0, 337.01000000000005, 98, 10816, 126.5, 381.5000000000002, 775.3999999999976, 10743.819999999963, 0.39071046791485636, 0.12209702122339262, 0.21672221267152192], "isController": false}, {"data": ["https://hotelservice.easemytrip.com/api/HotelService/HotelDetailsLogs", 20, 0, 0.0, 581.3, 93, 1947, 186.5, 1870.0000000000005, 1944.1, 1947.0, 0.1495640208791373, 0.05447986307413888, 0.17256825260615305], "isController": false}, {"data": ["https://getip.easemytrip.com/etm/api/etoken/GenerateTokenV2", 10, 0, 0.0, 192.1, 104, 404, 128.5, 397.70000000000005, 404.0, 404.0, 0.1019045969163669, 0.08862913477901987, 0.07961296634091164], "isController": false}, {"data": ["https://www.easemytrip.com/scripts/newloginCommon_captcha.js?a=s2sd2saaa", 10, 0, 0.0, 259.3, 121, 858, 193.5, 801.9000000000002, 858.0, 858.0, 0.1011316633124665, 2.8977579426280076, 0.057182844783123146], "isController": false}, {"data": ["https://easemytrip.com/railways/-1", 10, 0, 0.0, 2478.9000000000005, 746, 5834, 1125.5, 5825.2, 5834.0, 5834.0, 0.058912591388157395, 20.4832291500975, 0.03434650103391598], "isController": false}, {"data": ["https://www.easemytrip.com/hotels/login/CheckSignIn", 20, 0, 0.0, 207.45000000000002, 98, 594, 122.0, 519.8000000000001, 590.4499999999999, 594.0, 0.19150301138485404, 0.065268116184877, 0.1008009015004261], "isController": false}, {"data": ["https://easemytrip.com/railways/-0", 10, 0, 0.0, 2575.4, 249, 10666, 402.5, 10516.800000000001, 10666.0, 10666.0, 0.059044773651860206, 0.02756191582577068, 0.030560283237779207], "isController": false}, {"data": ["https://flightservice-web.easemytrip.com/EmtAppService//Addons/CurrencyConverter?Country=INR", 10, 0, 0.0, 1087.6, 254, 7388, 317.0, 6723.200000000003, 7388.0, 7388.0, 0.07880779566714739, 0.18301263485984032, 0.03440144986642078], "isController": false}, {"data": ["https://bus.easemytrip.com/home/list?org=Kadapa&des=Hyderabad&date=29-05-2023&searchid=1248_501", 10, 0, 0.0, 1431.2, 686, 3305, 1271.0, 3155.0000000000005, 3305.0, 3305.0, 0.058818685520016005, 20.433462005334853, 0.03406199268883739], "isController": false}, {"data": ["https://railways.easemytrip.com/TrainListInfo/Hyderabad--All-Stations-(HYB)-to-Vijayawada-Jn-(BZA)/2/25-07-2023", 10, 0, 0.0, 6721.599999999999, 2777, 13676, 6123.5, 13431.300000000001, 13676.0, 13676.0, 0.05958374793691273, 114.50489303600051, 0.035436037591386575], "isController": false}, {"data": ["https://www.easemytrip.com/hotels/", 30, 0, 0.0, 1034.0666666666666, 87, 6164, 788.5, 2231.100000000001, 4114.699999999997, 6164.0, 0.18066194536782773, 24.124603484667823, 0.08321505621597533], "isController": false}, {"data": ["https://www.easemytrip.com/autocity.txt", 50, 0, 0.0, 430.24000000000007, 149, 2420, 284.0, 773.8999999999999, 1563.749999999996, 2420.0, 0.35678607107178534, 31.070854368845442, 0.1871036329741687], "isController": false}, {"data": ["https://hotelservice.easemytrip.com/api/HotelService/GetCouponlistShow", 10, 0, 0.0, 199.6, 97, 419, 175.0, 407.00000000000006, 419.0, 419.0, 0.09407780234253728, 0.25325670892327956, 0.12770326685168634], "isController": false}, {"data": ["https://busservice.easemytrip.com/api/search/getsourcecity?id=Kadapa", 10, 0, 0.0, 160.6, 117, 250, 139.0, 248.8, 250.0, 250.0, 0.06128352208658135, 0.03590831372260627, 0.024357806141834585], "isController": false}, {"data": ["https://flightservice.easemytrip.com/EmtAppService/Analytics/PushEvent", 50, 0, 0.0, 364.0, 113, 4389, 144.0, 463.5999999999998, 2372.099999999986, 4389.0, 0.2784475989463543, 0.1313380764561417, 0.35692413904002407], "isController": false}, {"data": ["https://solr.easemytrip.com/api/auto/GetTrainAutoSuggest/vij", 10, 0, 0.0, 298.79999999999995, 103, 1762, 125.5, 1611.1000000000006, 1762.0, 1762.0, 0.059347533219781715, 0.06636027884438483, 0.023878109068896553], "isController": false}, {"data": ["https://transferapi.easemytrip.com/api/offer/offerlist/home", 20, 0, 0.0, 417.55000000000007, 110, 2373, 191.5, 1517.0000000000016, 2333.8499999999995, 2373.0, 0.11409729075983091, 0.1267493877967243, 0.044346407932043655], "isController": false}, {"data": ["https://solr.easemytrip.com/v1/api/autocomplete/common?search=hyde&key=jNUYK0Yj5ibO6ZVIkfTiFA==", 30, 0, 0.0, 450.2, 124, 4863, 231.5, 1076.4000000000015, 2864.8499999999976, 4863.0, 0.17144424633109312, 0.8160679154951309, 0.07333259755177615], "isController": false}, {"data": ["https://www.easemytrip.com/cabs", 70, 0, 0.0, 274.61428571428576, 101, 1570, 138.0, 735.5999999999999, 1166.5500000000009, 1570.0, 0.3837004067224311, 0.0985480536796869, 0.16214125724919698], "isController": false}, {"data": ["https://transferapi.easemytrip.com/api/Login/CheckSignIn", 20, 0, 0.0, 565.75, 115, 3798, 154.5, 1841.5000000000014, 3703.449999999999, 3798.0, 0.1153595468676999, 0.26542271523207456, 0.2834420116397783], "isController": false}, {"data": ["https://www.easemytrip.com/bus/", 10, 0, 0.0, 2117.3999999999996, 825, 9052, 984.5, 8586.800000000003, 9052.0, 9052.0, 0.05805346724333111, 23.588132873501497, 0.0335621607500508], "isController": false}, {"data": ["https://www.easemytrip.com/hotels/hotels-in-hyderabad/?e=202351785910&city=Hyderabad,%20India&cin=26/05/2023&cOut=31/05/2023&Hotel=NA&Rooms=1&pax=3_2_3_1", 30, 0, 0.0, 961.8, 108, 5328, 202.0, 2525.6, 5278.5, 5328.0, 0.2847164224432465, 100.534369720883, 0.14662154306810418], "isController": false}, {"data": ["https://flightservice-web.easemytrip.com/EmtAppService/FlightStatus/FlightAmentiesByListing", 10, 0, 0.0, 319.6, 132, 1598, 168.0, 1463.0000000000005, 1598.0, 1598.0, 0.07701371614284505, 0.5222492625936679, 0.050013790268546826], "isController": false}, {"data": ["https://busservice.easemytrip.com/api/search/destinationAutoSuggest?sourceId=1248", 10, 0, 0.0, 183.8, 112, 527, 136.0, 499.80000000000007, 527.0, 527.0, 0.06118565563489295, 0.02521518230266096, 0.025095679068999063], "isController": false}, {"data": ["https://railways.easemytrip.com/Train/TrainLogs", 20, 0, 0.0, 276.4, 117, 869, 162.5, 764.8000000000003, 864.5, 869.0, 0.12070588803321827, 0.05999931348526181, 0.19048897955242255], "isController": false}, {"data": ["https://www.easemytrip.com/api/SignIn/CheckSignIn", 80, 0, 0.0, 479.16249999999997, 94, 8807, 128.0, 435.9000000000001, 3625.000000000001, 8807.0, 0.3183927533809331, 0.1088256481282486, 0.6127661315678455], "isController": false}, {"data": ["https://transferapi.easemytrip.com/api/search/transfer/", 20, 0, 0.0, 1510.1, 189, 5039, 1181.5, 4227.000000000001, 5001.299999999999, 5039.0, 0.11366348787778902, 3.3570133746405393, 0.07475816316962003], "isController": false}, {"data": ["https://flightservice-web.easemytrip.com/EmtAppService//AppInitialize/GetCoupons", 10, 0, 0.0, 382.5, 106, 1804, 200.5, 1672.1000000000004, 1804.0, 1804.0, 0.07668241212195571, 0.05249450282958101, 0.031302000260720206], "isController": false}, {"data": ["https://bus.easemytrip.com/SignIn/CheckSignIn", 10, 0, 0.0, 768.1999999999998, 122, 3453, 149.0, 3407.0, 3453.0, 3453.0, 0.05938277543215815, 0.025458045326872486, 0.12270893829535805], "isController": false}, {"data": ["https://transfer.easemytrip.com/list/CTAR273/RALKCG/2023-05-31T17:57:00/4/0/0/other/pickup", 40, 0, 0.0, 1063.9750000000001, 94, 9001, 394.0, 2906.5999999999985, 3995.299999999999, 9001.0, 0.25766057084699473, 0.41498700827090435, 0.11285231057116907], "isController": false}, {"data": ["https://solr.easemytrip.com/api/auto/GetTrainAutoSuggest/vi", 10, 0, 0.0, 129.1, 108, 170, 123.0, 167.9, 170.0, 170.0, 0.05921118854618769, 0.10055493836115273, 0.023765428215315566], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1710, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
