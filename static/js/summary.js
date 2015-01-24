/****************************************
	Created on 05/01/2013
	Used to populate summary charts with data
	Reading from summary.json
	*****************************************/
// histogram plot / about the data 


var BEERVIZ = BEERVIZ || {};

BEERVIZ.summary = (function(){


	var colorSelector = 40;
	var colorIndex = [];
	var summaryChartMin = 2000;
	var summaryChartMax = 13000;
	var darkColor ='#963500'
	var mediumColor ='#CB6C00'
	var lightColor ='#FDD978'
	


	/****************************************
	** Module:: Global Initialization
	*****************************************/
	var init = function(){
		// console.log('summary page');

		evtHandler();
		getSummaryData();
		
		//hChartPopularity();
		
	}
	
	function evtHandler(){

	}

	var getSummaryData  = function(){

		var categories=[];
		var series=[];
		var title = [];
		var chart2categories = [];
		var chart2series= [];

		jQuery.getJSON('data/summary.json', function(data) {
			  			  
			  jQuery.each(data, function(key, val) {

			  	var tmpcat=[];
				var tmpser=[];
				var tmptitle=[];
				var tmpseries = {};
				var temp={"name":'',"color":'1',"data":[]};

			  	chart2categories.push(val.type);
				tmpseries.name = val.type;
				tmpseries.color = val.color;
				tmpseries.data = [val.user];
				chart2series.push(tmpseries);
			  	
			  	for(var i=0; i<val.beers.length;i++){
					var temp={"name":'',"color":'1',"data":[]};
	  				tmpcat.push(val.beers[i].name);
	  				temp.name = val.beers[i].name;
	  				temp.data = [val.beers[i].data];
	  				temp.color = val.beers[i].color;
	  				//console.log(val.beers);
	  				tmpser.push(temp);
			  	}
			  	tmptitle.push("Top 5 "+val.type+" Beer Styles");
			  	
			  	categories.push(tmpcat);
			  	series.push(tmpser);
			  	title.push(tmptitle);    
			  });
			 	intialisecharts(categories,series,title,chart2categories,chart2series);
			 
			});
		}

function intialisecharts(categories,series,title,chart2categories,chart2series){
	var charts = [];
	var chart2data = {
	            chart: {
	                type: 'column'
	            },
	            title: {
	                text: 'Popularity'
	            },
	            xAxis: {
	                categories: chart2categories
	            },
	            yAxis: {
	                min: summaryChartMin, 
	                max: 140000,
	                title: {
	                    text: 'Number of users who rated the beer'
	                }
	            },
	            tooltip: {
	                headerFormat: '<span style="font-size:10px">{}</span><table>',
	                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
	                    '<td style="padding:0"><b>{point.y:.0f}</b></td></tr>',
	                footerFormat: '</table>',
	                shared: false,
	                useHTML: true
	            },
	            plotOptions: {
	                column: {
	                    pointPadding: 0.1,
	                    borderWidth: 0
	                }
	            },
	            series: chart2series
	        };
	 	for(var i=3;i<=5;i++){
	 		//console.log("category:",categories[i-3]);
	 		//console.log("series:",series[i-3]);

	 		var tempdata = {
		            chart: {
		                type: 'column'
		            },
		            title: {

		                text: title[i-3]
		            },
		            xAxis: {
		                categories: categories[i-3]		                
		            },
		           
		            tooltip: {
		                headerFormat: '<span style="font-size:10px">{}</span><table>',
		                pointFormat: '<tr><td style="color:{#274b6d};padding:0">{series.name}: </td>' +
		                    '<td style="padding:0"><b>{point.y:.0f}</b></td></tr>',
		                footerFormat: '</table>',
		                shared: false,
		                useHTML: true
		            },
		            plotOptions: {
		                column: {
		                    pointPadding: 0.1,
		                    borderWidth: 1
		                }
		            },
		            series: series[i-3]

		        }
		        charts.push(tempdata);     

	 	}
 	 hChartPopularity(chart2data,charts);
 	}

	function hChartPopularity(chart2data,ch){

	        $('#chart1').highcharts({
	            chart: {
	                type: 'column'
	            },
	            title: {
	                text: 'Ratings by Attributes (Scale 1-5)'
	            },
	            xAxis: {
	                categories: [
	                    'Aroma',
	                    'Taste',
	                    'Appearance',
	                    'Overall',
	                ]

	            },
	            yAxis: {
	                min: 2.51, 
	                max: 4.5,
	                title: {
	                    text: 'Avg. Rating (1-5)'
	                }
	            },
	            tooltip: {
	                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
	                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
	                    '<td style="padding:0"><b>{point.y:.2f}</b></td></tr>',
	                footerFormat: '</table>',
	                shared: true,
	                useHTML: true
	            },
	            plotOptions: {
	                column: {
	                    pointPadding: 0.1,
	                    borderWidth: 0
	                }
	            },
	            series: [{
	                name: 'Dark',
	                color: '#39080b',
	                data: [3.93,3.93,3.93,0.0]
	    
	            },  
	            {
	                name: 'Medium',
	                color:'#CB6C00',
	                data: [3.94,4.01,3.93,0.0]
	    
	            },
	            {
	                name: 'Light',
	                color:'#FDD978',
	                data: [3.61,3.71,3.69,0.0]
	    
	            }
	             ]
	        });   
	
	    $('#chart2').highcharts(chart2data);
	    $('#chart3').highcharts(ch[0]);
    	$('#chart4').highcharts(ch[1]);
    	$('#chart5').highcharts(ch[2]);
 
	}

    return {
	    'init' : init
    }

})();

jQuery(document).ready(function(){
	BEERVIZ.summary.init();

  // console.log("BeerViz getdata", BEERVIZ.getData() )
});
