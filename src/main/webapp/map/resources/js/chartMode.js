var _ChartMode = function () {
	var itemConfig = {
			'environmentCorporation':[{col:'NO2_DNSTY',title:'먼지'},{col:'OZ_DNSTY',title:'OZ'},{col:'PM10_DNSTY',title:'미세먼지'},{col:'SO2_DNSTY',title:'so2'}]
	}
	var setEvent = function(){
		
		_MapEventBus.on(_MapEvents.chartMode, function(){
			if($('#tabOpeners').attr('class').indexOf('on') > -1){
				$('#tabOpeners').trigger('click');
			}
			
			if(!$('#airMaps').attr('class')){
				$('#airMaps').trigger('click');
			}
			
			var layerArr = [];
			for(key in itemConfig){
				layerArr.push(key);
			}
			
			$('#chartDiv').show();
			
			_MapEventBus.trigger(_MapEvents.getChartFeature, {layerArr:layerArr});
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
						backgroundColor: '#00ff0000',
						height: 220
					},
					title: {
						text: '',
						style: {
							color: '#fff'
						}
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
					series: [{
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
			var dataObj = {};
			
			for(var i = 0; i < data.length; i++){
				for(key in data[i]){
					if(!dataObj[key]){
						dataObj[key] = [];
					}
					dataObj[key].push(data[i][key]);
				}
			}
			
			for(var i = 0; i < item.length; i++){
				$('#chartDiv').append('<div id="chart' + i + '"></div>');
				chartObj.series[0].data = dataObj[item[i].col];
				chartObj.series[0].name = item[i].title;
				chartObj.xAxis.categories = dataObj.MESURE_DT;
				chartObj.title.text = item[i].title + ' (' + item[i].col + ')';
				Highcharts.chart('chart'+ i,chartObj);
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