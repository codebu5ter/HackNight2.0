queue()
    .defer(d3.json, "/data")
    .await(makeGraphs);

function makeGraphs(error, recordsJson) {
	
	//Clean data
	var records = recordsJson;
	var dateFormat = d3.time.format("%Y-%m-%d");
	
	records.forEach(function(d) {
		d["Date"] = dateFormat.parse(d["Date"]);
	});

	//Create a Crossfilter instance
	var ndx = crossfilter(records);

	//Define Dimensions
	var dateDim = ndx.dimension(function(d) { return d["Date"]; });
	var genderDim = ndx.dimension(function(d) { return d["Open"]; });
	var tenureSegmentDim = ndx.dimension(function(d) { return d["High"]; });
	var seniorCitizenDim = ndx.dimension(function(d) { return d["Low"]; });
	var partnerDim = ndx.dimension(function(d) { return d["Close"]; });
	var contractDim = ndx.dimension(function(d) { return d["Volume"]; });
	var allDim = ndx.dimension(function(d) {return d;});


	//Group Data
	var numRecordsByDate = dateDim.group();
	var genderGroup = genderDim.group();
	var tenureSegmentGroup = tenureSegmentDim.group();
	var seniorCitizenGroup = seniorCitizenDim.group();
	var partnerDGroup = partnerDim.group();
	var contractGroup = contractDim.group();
	var all = ndx.groupAll();


	// Define values (to be used in charts)
	var minDate = dateDim.bottom(1)[0]["Date"];
	var maxDate = dateDim.top(1)[0]["Date"];


    //Charts
    var numberRecordsND = dc.numberDisplay("#number-records-nd");
	var timeChart = dc.barChart("#time-chart");
	var genderChart = dc.barChart("#gender-row-chart");
	var tenureSegmentChart = dc.barChart("#location-row-chart");
	var seniorCitizenChart = dc.barChart("#phone-brand-row-chart");
	var contractChart = dc.barChart("#contract-row-chart");
	var partnerChart = dc.barChart("#age-segment-row-chart");



	numberRecordsND
		.formatNumber(d3.format("d"))
		.valueAccessor(function(d){return d; })
		.group(all);


	timeChart
		.width(650)
		.height(140)
		.margins({top: 10, right: 50, bottom: 20, left: 20})
		.dimension(dateDim)
		.group(numRecordsByDate)
		.transitionDuration(500)
		.x(d3.time.scale().domain([minDate, maxDate]))
		.elasticY(true)
		.yAxis().ticks(4);

	genderChart
		.width(650)
		.height(140)
		.margins({top: 10, right: 50, bottom: 20, left: 20})
		.dimension(genderDim)
		.group(genderGroup)
		.transitionDuration(500)
		.x(d3.scale.linear().domain([2540,57500]))
		.elasticY(true)
		.yAxis().ticks(4);

	tenureSegmentChart
		.width(1300)
		.height(140)
		.margins({top: 10, right: 50, bottom: 20, left: 20})
		.dimension(tenureSegmentDim)
		.group(tenureSegmentGroup)
		.transitionDuration(500)
		.x(d3.scale.linear().domain([2760,57500]))
		.elasticY(true)
		.yAxis().ticks(4);

	seniorCitizenChart
		.width(650)
		.height(140)
		.margins({top: 10, right: 50, bottom: 20, left: 20})
		.dimension(seniorCitizenDim)
		.group(seniorCitizenGroup)
		.transitionDuration(500)
		.x(d3.scale.linear().domain([2420,56760]))
		.elasticY(true)
		.yAxis().ticks(4);
		
	contractChart
		.width(650)
		.height(200)
		.margins({top: 10, right: 50, bottom: 20, left: 20})
		.dimension(contractDim)
		.group(contractGroup)
		.transitionDuration(500)
		.x(d3.scale.linear().domain([0,164215000]))
		.y(d3.scale.linear().domain([]))

    partnerChart
		.width(650)
		.height(140)
		.margins({top: 10, right: 50, bottom: 20, left: 20})
		.dimension(partnerDim)
		.group(partnerDGroup)
		.transitionDuration(500)
		.x(d3.scale.linear().domain([2730,57220]))
		.elasticY(true)
		.yAxis().ticks(4);

    // var map = L.map('map');

	// var drawMap = function(){

	//     map.setView([31.75, 110], 4);
	// 	mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
	// 	L.tileLayer(
	// 		'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	// 			attribution: '&copy; ' + mapLink + ' Contributors',
	// 			maxZoom: 15,
	// 		}).addTo(map);

	// 	//HeatMap
	// 	var geoData = [];
	// 	_.each(allDim.top(Infinity), function (d) {
	// 		geoData.push([d["latitude"], d["longitude"], 1]);
	//       });
	// 	var heat = L.heatLayer(geoData,{
	// 		radius: 10,
	// 		blur: 20, 
	// 		maxZoom: 1,
	// 	}).addTo(map);

	// };

	// //Draw Map
	// drawMap();

	//Update the heatmap if any dc chart get filtered
	// dcCharts = [timeChart, genderChart, tenureSegmentChart, seniorCitizenChart, partnerChart];

	// _.each(dcCharts, function (dcChart) {
	// 	dcChart.on("filtered", function (chart, filter) {
	// 		map.eachLayer(function (layer) {
	// 			map.removeLayer(layer)
	// 		}); 
	// 		drawMap();
	// 	});
	// });

	dc.renderAll();

};