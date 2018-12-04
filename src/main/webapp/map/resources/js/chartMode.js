var _ChartMode = function () {
	
	var chartFeatureLayerName = 'chartModeLayer';
	var odorReductionForSvg = 'odorReductionForSvg';
	var chartInterval;
	var playArr;
	var playIndex = 0;
	var selectedObj = {};
	
	var chartModeOnePoint = 'chartModeOnePoint';
	
	var init = function(){
		setEvent();
	};
	
	var setEvent = function(){
		_MapEventBus.on(_MapEvents.task_mode_changed, function(event, data){
			// GIS 모드
    		if(data.mode == 4){
    			$('#chartDiv').show();
    			getChartData({code:'43114000000202',mesureDt:1});
    			getChartFeature();
    			$('#foreCastOccurrenceDiv').show();
    			playArr = [];
    		}else{
    			$('#chartDiv').hide();
    			$('#chartSpotId').text('');
				$('#chartSpotNm').text('');
				$('#chartArea').html('');
				$('#foreCastOccurrenceDiv').hide();
				$('#foreCastOccurrencePopupDiv').hide();
				
				_MapEventBus.trigger(_MapEvents.map_removeLayerByName, chartFeatureLayerName);
				_MapEventBus.trigger(_MapEvents.map_removeLayerByName, odorReductionForSvg);
				playIndex = 0;
				
				stopPlay();
				
				clearLayerByName(chartModeOnePoint);
    		}
		});
		
		_MapEventBus.on(_MapEvents.map_singleclick, function(event, data){
			var feature = _CoreMap.getMap().forEachFeatureAtPixel(data.result.pixel,function(feature, layer){
				if(layer.get('name') == chartFeatureLayerName){
					var mesureDt = feature.getProperties().MESURE_DT?feature.getProperties().MESURE_DT:1;
					getChartData({code:feature.getProperties().CODE,mesureDt:mesureDt});
					
					stopPlay();
				}
			});
		});
		
		$('#chartPlay').off('click').on('click',function(){
			var me = $(this).find('img');
			
			if(me.attr('src').indexOf('pause') > -1){
				stopPlay();
			}else{
				autoPlay();
				$('#chartPlay').find('img').attr('src','images/pause_b.png');
			}
    	});
	};
	
	var autoPlay = function(){
		if(playArr.length==0){
			_MapEventBus.trigger(_MapEvents.alertShow, {text:'잠시후에 눌러 주세요.'});
			return;
		}
		
		chartInterval = setInterval(function(){
			playIndex++;
			
			if(playArr[playIndex]){
				getChartData({code:playArr[playIndex].id,mesureDt:1});
				_CoreMap.getMap().getView().setCenter(playArr[playIndex].point);
				_CoreMap.getMap().getView().setZoom(17);
			}else{
				playIndex = 0;
			}
		}, 5000);
		
	};
	
	var getChartFeature = function(){
		Common.getData({url: '/getFeature.do', contentType: 'application/json', params:{contentsId:'chart'}}).done(function(featureData){
			
			var pointArr = [];
			
			for(var i = 0; i < featureData.length; i++){
				var resultFeature = new ol.Feature();
				resultFeature.setGeometry(new ol.geom.Point(_CoreMap.convertLonLatCoord([featureData[i].LO,featureData[i].LA],true)));
				resultFeature.setProperties(featureData[i]);
				pointArr.push(resultFeature);
				
				if(featureData[i].SENSOR_TY_CODE=='SEN01001'){
					playArr.push({point:_CoreMap.convertLonLatCoord([featureData[i].LO,featureData[i].LA],true),id:featureData[i].CODE})
				}
			}
			
			var source = new ol.source.Vector({
				features: pointArr
			});
			
			var originLayer = new ol.layer.Vector({
				source: source,
				zIndex:1000,
				name:chartFeatureLayerName,
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
			
			_MapEventBus.trigger(_MapEvents.addWriteLayerForUseGeoserver, {type:2});
		});
	};
	
	var getChartData = function(param){
		Common.getData({
			url: '/getChart.do',
			contentType: 'application/json',
			params: param
		}).done(function(data){

			writeChart({data:data});
			
			Common.getData({
    			url: '/getClick.do',
    			contentType: 'application/json',
    			params: {contentsId:'chart',code:param.code}
			}).done(function(data){
				$('#chartSpotId').text(data[0].CODE);
				$('#chartSpotNm').text(data[0].SENSOR_NM);
			});
		});
	};
	
	var writeChart = function(param){
		var data = param.data;
		var item =[{name:'VOCS',title:'휘발성유기물'},
			     {name:'CCNT',title:'접점센서'},
			     {name:'NH3',title:'암모니아'},
			     {name:'ERCRT',title:'전류센서'},
			     {name:'H2S',title:'황화수소'},
			     {name:'ARCSR',title:'기압'},
			     {name:'OU',title:'복합 악취'},
			     {name:'SOLRAD',title:'일사'},
			     {name:'HD',title:'습도'},
			     {name:'TMPRT',title:'기온'},
			     {name:'WD',title:'풍향'},
			     {name:'WS',title:'풍속'},
			     {name:'NO2',title:'이산화질소'},
			     {name:'SO2',title:'이산화황'},
			     {name:'PM10',title:'미세먼지10'},
			     {name:'PM2_5',title:'미세먼지2.5'},
			     {name:'CFC',title:'염소'},
			     {name:'CH3SH',title:'메틸메르캅탄'},
			     {name:'TMA',title:'트리메틸아민'},
			     {name:'ETHANOL',title:'에탄올'},
			     {name:'MESURE_DT',title:'날짜'}]
		$('#chartArea').html('');
		
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
				if(!dataObj[item[j].name]){
					dataObj[item[j].name] = [];
				}
				dataObj[item[j].name].push(data[i][item[j].name]);
			}
		}
		for(var i = 0; i < item.length; i++){
			if(item[i].name != 'MESURE_DT'){
				$('#chartArea').append('<div id="chart' + i + '"></div>');
				chartObj.series[0].data = dataObj[item[i].name];
				chartObj.series[0].name = item[i].title;
				chartObj.xAxis.categories = dataObj.MESURE_DT;
				chartObj.title.text = item[i].title + ' (' + item[i].name + ')';
				Highcharts.chart('chart'+ i,chartObj);
			}
		}
	};
	
	var stopPlay = function(){
		$('#chartPlay').find('img').attr('src','images/reset.png');
		if(chartInterval){
			clearInterval(chartInterval);
			chartInterval = null;	
		}
	};
	
	var setProcMsg = function(msg){
		if(msg.type == 'chartMode'){
			datetime = '2018120111';
			
			$.ajax({
				url:'/getOdorForecastXY.do', 
				data: JSON.stringify({
					gridId:msg.id
				})}).done(function(data){
					if(data == null || data.length <= 0){
						_MapEventBus.trigger(_MapEvents.alertShow, {text:'관심지역 정보가 없습니다.'});
						return;
						
					}
					
					var xy = data[0].shape;
					
					selectedObj.x  = xy.split(' ')[0].substr(xy.indexOf('(')+1);
					selectedObj.y  = xy.split(' ')[1].substring(0, xy.split(' ')[1].indexOf(')'));
					 
					var coord = ol.proj.transform([parseFloat(selectedObj.x), parseFloat(selectedObj.y)], 'EPSG:4326', 'EPSG:3857');
					
					_MapEventBus.trigger(_MapEvents.map_move, selectedObj);
					
					clearLayerByName(chartModeOnePoint);

					var resultFeature = new ol.Feature();

					resultFeature.setGeometry(new ol.geom.Point(coord));
					resultFeature.setProperties({});
			 
					var source = new ol.source.Vector({
						features: [resultFeature]
					});

					var chartLayer = new ol.layer.Vector({
						source: source,
						zIndex:10000,
						name:chartModeOnePoint,
						style:function(feature){
							return new ol.style.Style({
					    		image: new ol.style.Icon(({
					    			src: '../images/pin2.png',
					    			scale:1.0
					    		})) 
					    	});
						}
					});
			 
					_MapEventBus.trigger(_MapEvents.map_addLayer, chartLayer);
					_CoreMap.getMap().getView().setZoom(17);
					
					$('#foreCastOccurrencePopupDiv').hide();
				});
		}
	};
	
	var clearLayerByName = function(layerNm){
		_MapEventBus.trigger(_MapEvents.map_removeLayerByName, layerNm);
	}; 
	
	return {
		init:function(){
			init();
		},
		stopPlay:function(){
			stopPlay();
		},
		setProcMsg:function(msg){
			setProcMsg(msg);
		}
    };
}();