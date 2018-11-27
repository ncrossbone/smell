var _ChartMode = function () {
	var itemConfig = {
			'environmentCorporation':[{col:'NO2_DNSTY',title:'먼지'},{col:'OZ_DNSTY',title:'OZ'},{col:'PM10_DNSTY',title:'미세먼지'}]
	}
	var setEvent = function(){
		
		_MapEventBus.on(_MapEvents.chartMode, function(){
			if($('#tabOpeners').attr('class').indexOf('on') > -1){
				$('#tabOpeners').trigger('click');
			}
			
			if(!$('#airMaps').attr('class')){
				$('#airMaps').trigger('click');
			}
			
			var eventParam = {
					layerArr: ['environmentCorporation']
			};
			
			$('#chartDiv').show();
			
			_MapEventBus.trigger(_MapEvents.getChartFeature, eventParam);
		});
		
		_MapEventBus.on(_MapEvents.getChartData, function(evt, param){
			Common.getData({
    			url: '/getChart.do',
    			contentType: 'application/json',
    			params: param
    		}).done(function(data){
    			var eventParam = {
    				data:data,
    				id:param.contentsId
    			};
    			_MapEventBus.trigger(_MapEvents.writeChart, eventParam);
    		});
		});
		
		_MapEventBus.on(_MapEvents.writeChart, function(evt, param){
			var data = param.data;
			var id = param.id;
			var item = itemConfig[id];
			
			$('#chartDiv').html('');
			
			
			var chartObj = {
					chart: {
						backgroundColor: '#00ff0000'
					},
					title: {
						text: ''
					},
					subtitle: {
						text: ''
					},
					yAxis: {
						title: {
							text: ''
						},
						labels: {
							style: {
								color: '#fff'
							}
						}
					},
					xAxis:{
						labels: {
							style: {
								color: '#fff'
							}
						},
						gridLineWidth: 1
					},
					legend: false,
					credits:false,
					plotOptions: {
						series: {
							label: {
								connectorAllowed: false
							},
							pointStart: 2010
						}
					},
					series: [{
						name: 'Installation',
						data: [],
						color:'#01e0e6'
					}],
					responsive: {
						rules: [{
							condition: {
								maxWidth: 500
							},
							chartOptions: {
								legend: {
									layout: 'horizontal',
									align: 'center',
									verticalAlign: 'bottom'
								}
							}
						}]
					},
					height: 100
			};
			
			for(var i = 0; i < item.length; i++){
				$('#chartDiv').append('<div id="chart' + i + '"></div>');
				chartObj.series[0].data = randomSeriesValue();
				Highcharts.chart('chart'+ i,chartObj);
			}
			
			function randomSeriesValue(){
				var arr = [];
				for(var i = 0; i < 11; i++){
					arr.push(parseInt(Math.random()*10));
				}
				return arr;
			}
		});
		
		_MapEventBus.on(_MapEvents.getChartFeature, function(evt, data){
			var paramObj = {
					chartMode : 1
			};
			
			var contentsId = data.layerArr[0];
			paramObj.contentsId = contentsId;
			
			Common.getData({url: '/getFeature.do', contentType: 'application/json', params: paramObj }).done(function(featureData){
				var contentsConfig = _WestCondition.getContentsConfig();
				
				_WestCondition.writeLayer(contentsId,featureData,contentsConfig[contentsId].isUseGeoserver);
    		});
		});
	};
	
	setEvent();
	
	return {
    };
}();