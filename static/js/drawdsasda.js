﻿/* ==============================================================

Function: Draw HeatMap
Author : RCDD Dujiewen
Version : v1.0.0
Created : 14 Jan  2017
Last update : 14 Feb  2017

============================================================== */
function generateHeatmap(element,dataUrl){
	var margin = { top: 50, right: 0, bottom: 100, left: 30 },
		width = 1100 - margin.left - margin.right,
		height = 600 - margin.top - margin.bottom,
		gridSize = Math.floor(width / 24),
		legendElementWidth = gridSize*2,
		buckets = 9,
		colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"], // alternatively colorbrewer.YlGnBu[9]
		days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
		times = ["1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12a", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p", "12p"];
		dataset = dataUrl;

	var svg = d3.select(element).append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var dayLabels = svg.selectAll(".dayLabel")
						.data(days)
						.enter().append("text")
						.text(function (d) { return d; })
						.attr("x", 0)
						.attr("y", function (d, i) { return i * gridSize; })
						.style("text-anchor", "end")
						.attr("transform", "translate(-6," + gridSize / 1.5 + ")")
						.attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

	var timeLabels = svg.selectAll(".timeLabel")
						.data(times)
						.enter().append("text")
						.text(function(d) { return d; })
						.attr("x", function(d, i) { return i * gridSize; })
						.attr("y", 0)
						.style("text-anchor", "middle")
						.attr("transform", "translate(" + gridSize / 2 + ", -6)")
						.attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });

	var heatmapChart = function(tsvFile) {
		d3.tsv(tsvFile,
			function(d) {
				return {
					day: Number(d.day),
					hour: Number(d.hour),
					value: Number(d.value)
				};
				//	@illustrate:上述是为了将string型数值转换为number类型
			},
			function(error, data) {
				console.log(data);
				var colorScale = d3.scale.quantile()
										.domain([0, d3.max(data, function (d) { return d.value; })])
										.range(colors);
				console.log(colorScale( buckets));

				var cards = svg.selectAll(".hour")
								.data(data, function(d) {return d.day+':'+d.hour;});

				

				cards.enter().append("rect")
					.attr("x", function(d) { return (d.hour - 1) * gridSize; })
					.attr("y", function(d) { return (d.day - 1) * gridSize; })
					.attr("rx", 4)
					.attr("ry", 4)
					.attr("class", "hour bordered")
					.attr("width", gridSize)
					.attr("height", gridSize)
					.style("fill", colors[0]);

				cards.transition().duration(1000)
					.style("fill", function(d) { return colorScale(d.value); });
				/*cards.append("title");
				cards.select("title").text(function(d) { return d.value; });*/

				//  删除多余的数据或者元素
				cards.exit().remove();

				var legend = svg.selectAll(".legend")
					.data([0].concat(colorScale.quantiles()), function(d) { return d; });

				legend.enter().append("g")
					.attr("class", "legend");
				legend.append("rect")
					.attr("x", function(d, i) { return legendElementWidth * i; })
					.attr("y", height)
					.attr("width", legendElementWidth)
					.attr("height", gridSize / 2)
					.style("fill", function(d, i) { return colors[i]; });

				legend.append("text")
					.attr("class", "mono")
					.text(function(d) { return "≥ " + Math.round(d); })
					.attr("x", function(d, i) { return legendElementWidth * i; })
					.attr("y", height + gridSize);

				legend.exit().remove();
			}
		);
	};

	heatmapChart(dataset);
}
generateHeatmap("#heatMap","../static/test.txt");


/*var datasetpicker = d3.select("#dataset-picker").selectAll(".dataset-button")
.data(datasets);

datasetpicker.enter()
.append("input")
.attr("value", function(d){ return "Dataset " + d })
.attr("type", "button")
.attr("class", "dataset-button")
.on("click", function(d) {
heatmapChart(d);
});*/