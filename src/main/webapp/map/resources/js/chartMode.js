var _ChartMode = function () {
	var setEvent = function(){
		
		_MapEventBus.on(_MapEvents.chartMode, function(){
			if($('#tabOpeners').attr('class').indexOf('on') > -1){
				$('#tabOpeners').trigger('click');
			}
			
			if(!$('#airMaps').attr('class')){
				$('#airMaps').trigger('click');
			}
			
			$('#chartDiv').show();
			
			_MapEventBus.trigger(_MapEvents.getChartFeature,{});
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
			var item = ['VOCS','CCNT','NH3','ERCRT','H2S','ARCSR','OU','SOLRAD','HD','TMPRT','WD','WS','NO2','SO2','PM10','PM2_5','CFC','CH3SH','TMA','ETHANOL','MESURE_DT'];
			
			$('#chartDiv').html('');
			
			if(!data){
				return;
			}
			
			var chartObj = {
					chart: {
						backgroundColor: '#00ff0000',
						height: 220,
						width:450
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
				for(var j = 0; j < item.length; j++){
					if(!dataObj[item[j]]){
						dataObj[item[j]] = [];
					}
					dataObj[item[j]].push(data[i][item[j]]);
				}
			}
			for(var i = 0; i < item.length; i++){
				$('#chartDiv').append('<div id="chart' + i + '"></div>');
				chartObj.series[0].data = dataObj[item[i]];
				chartObj.series[0].name = item[i];
				chartObj.xAxis.categories = dataObj.MESURE_DT;
				chartObj.title.text = item[i] + ' (' + item[i] + ')';
				Highcharts.chart('chart'+ i,chartObj);
			}
		});
		
		_MapEventBus.on(_MapEvents.getChartFeature, function(evt, data){
			Common.getData({url: '/getFeature.do', contentType: 'application/json', params:{contentsId:'chart'}}).done(function(featureData){
				
				var pointArr = [];
				
				for(var i = 0; i < featureData.length; i++){
					var resultFeature = new ol.Feature();
					resultFeature.setGeometry(new ol.geom.Point(_CoreMap.convertLonLatCoord([featureData[i].LO,featureData[i].LA],true)));
					resultFeature.setProperties(featureData[i]);
					pointArr.push(resultFeature);
				}
				
				var source = new ol.source.Vector({
					features: pointArr
				});
				
				var originLayer = new ol.layer.Vector({
					source: source,
					zIndex:1000,
					name:'chartModeLayer',
					style:function(feature){
						var prop = feature.getProperties();
						var text = prop.SENSOR_NM;
						var typeConfig = {
							'SEN01001':{icon:new ol.style.Icon(({
				    					src: '../images/fixed.png'
				    				   })),
				    				   offset:30},
	    				    'SEN01002':{icon:new ol.style.Icon(({
	    				    			src: '../images/portable.png'
	    				    		   })),
	    				    		   offset:30},
	    				    'SEN01003':{icon:new ol.style.Circle({
	    		    			radius: 15,
	    		    			fill: new ol.style.Fill({
	    		    		        color: '#70AD47'
	    		    		    }),
	    		    		    stroke: new ol.style.Stroke({
	    		    		    	color: '#AFABAB',
	    		    		    	width: 3
	    		    		    })
	    		    		}),
	    				   			   offset:30},
	    				   	 'SEN01004':{icon:new ol.style.Circle({
	    			    			radius: 15,
	    			    			fill: new ol.style.Fill({
	    			    				color: '#792BFF'
	    			    			}),
	    			    			stroke: new ol.style.Stroke({
	    			    				color: '#AFABAB',
	    			    				width: 3
	    			    			})
	    			    		}),
	    				   	 		   offset:30}
						};
						
						var style = new ol.style.Style({
				    		geometry: feature.getGeometry(),
				    		image: typeConfig[prop.SENSOR_TY_CODE].icon,
							text: new ol.style.Text({
								text: prop.SENSOR_NM,
								fill: new ol.style.Fill({
									color: '#000'
								}),
								stroke : new ol.style.Stroke({
									color : '#fff',
									width : 3
								}),
								font: 'bold 12px Arial',
								offsetY: typeConfig[prop.SENSOR_TY_CODE].offset
							})
				  		});
				    	
				    	return style;
					}
				});
				
				_MapEventBus.trigger(_MapEvents.map_addLayer, originLayer);
    		});
		});
	};
	
	setEvent();
	
	return {
    };
}();