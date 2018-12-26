var _ChartMode = function () {
	
	var chartFeatureLayerName = 'chartModeLayer';
	var odorReductionForSvg = 'odorReductionForSvg';
	var chartInterval;
	var playArr;
	var playIndex = 0;
	var selectedObj = {};
	
	var chartModeOnePoint = 'chartModeOnePoint';
	
	var instCode = '';
	
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
    			$('#mapNavBar').hide();
    		}else{
    			$('#chartDiv').hide();
    			$('#chartSpotId').text('');
				$('#chartSpotNm').text('');
				$('#chartArea').html('');
				$('#foreCastOccurrenceDiv').hide();
				$('#foreCastOccurrencePopupDiv').hide();
				$('#mapNavBar').show();
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
				$('#chartPlay').find('img').attr('src','/map/images/pause_b.png');
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
			}else{
				playIndex = 0;
			}
		}, 7000);
		
	};
	
	var getChartFeature = function(){
		Common.getData({url: '/map/getFeature.do', contentType: 'application/json', params:{contentsId:'chart'}}).done(function(featureData){
			
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
					
					var imgSrc = '/map/images/symbol/';
					var textOffset = 35;
					
					var intMesure = parseFloat(prop.MESURE_DNSTY);
					
					var detailSrc = '';
					
					if(intMesure >= 50.1){
						detailSrc = '1';
					}else if(intMesure >= 20.1  && intMesure <= 50){
						detailSrc = '2';
					}else if(intMesure >= 10.1 && intMesure <= 20.0){
						detailSrc = '3';
					}else{
						detailSrc = '4';
					}
					
					if(prop.SENSOR_TY_CODE=='SEN01001'){
						prop.CODE == instCode?imgSrc += 'item2_' + detailSrc + '_ov':imgSrc += 'item2_' + detailSrc;
					}else if(prop.SENSOR_TY_CODE=='SEN01003'){
						imgSrc += 'item1_' + detailSrc;
					}
			    
					var style = new ol.style.Style({
			    		geometry: feature.getGeometry(),
		    			image: new ol.style.Icon(({
		    				src: imgSrc + '.png'
		        		})),
						text: new ol.style.Text({
							text: _CoreMap.getMap().getView().getZoom() > 15?prop.SENSOR_NM:'',
							fill: new ol.style.Fill({
								color: '#000'
							}),
							stroke : new ol.style.Stroke({
								color : '#fff',
								width : 3
							}),
							font: 'bold 12px Arial',
							offsetY: textOffset
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
		
		$.when(Common.getData({ url: '/map/getChart.do', contentType: 'application/json', params: param }),
				Common.getData({ url: '/map/getClick.do', contentType: 'application/json', params: {contentsId:'chart',code:param.code} }),
				Common.getData({ url: '/map/getPlotLine.do', contentType: 'application/json', params: {contentsId:'chart',code:param.code} })).then(function (chartData, clickData, plotData) {

					writeChart({data:chartData,plotData:plotData});
					
					var coord = ol.proj.transform([parseFloat(clickData[0][0].LO), parseFloat(clickData[0][0].LA)], 'EPSG:4326', 'EPSG:3857');
					_MapEventBus.trigger(_MapEvents.map_move, {x:coord[0],y:coord[1]});
					
					instCode = param.code;
					
					$('#chartSpotId').text(clickData[0][0].SENSOR_NM);
					$('#chartSpotNm').text(clickData[0][0].CODE);
				});

	};
	
	var writeChart = function(param){
		var data = param.data[0];
		var plotData = param.plotData[0][0];
		
		var item =[{name:'OU',title:'복합 악취',con:''},
				     {name:'H2S',title:'황화수소',con:'ppm'},
				     {name:'NH3',title:'암모니아',con:'ppm'},
				     {name:'VOCS',title:'휘발성유기물',con:'ppm'},
			     {name:'MESURE_DT',title:'날짜'}]
		$('#chartArea').html('');
		
		if(!data){
			return;
		}
		
		var chartObj = {
				chart: {
					backgroundColor: '#00ff0000',
					height:210,
					width:350
				},
				title: {
					text: '',
					style: {
						color: '#FFFF00',
						fontSize: '15px',
						margin: 0
					}
				},
				subtitle: {
					text: '',
					style: {
						color: '#fff',
						fontSize: '15px'
					},
					x: 150
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
				chartObj.title.text = '<span>' + item[i].title + '</span>' + ' (' + item[i].name + ') ' + item[i].con;
				chartObj.yAxis.plotLines = [{ value: plotData[item[i].name], color: 'red', width: 2, zIndex: 4}];
				chartObj.yAxis.min = 0;
				
				var max = Math.max.apply(null,dataObj[item[i].name]);
				chartObj.yAxis.max = plotData[item[i].name] > max ? plotData[item[i].name] + 0.1 : max + 0.1;
				//chartObj.subtitle.text = item[i].con;
				
				Highcharts.chart('chart'+ i,chartObj);
			}
		}
	};
	
	var stopPlay = function(){
		$('#chartPlay').find('img').attr('src','/map/images/reset.png');
		if(chartInterval){
			clearInterval(chartInterval);
			chartInterval = null;	
		}
	};
	
	var setProcMsg = function(msg){
		if(msg.type == 'chartMode'){
			$.ajax({
				url:'/map/getOdorForecastXY.do', 
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
					    			src: '/map/images/pinIcon.png',
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