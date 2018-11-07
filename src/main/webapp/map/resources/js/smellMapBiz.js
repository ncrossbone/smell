var _SmellMapBiz = function () {
	var datePickerDefine = {
		    dateFormat: 'yy.mm.dd',
		    prevText: '이전 달',
		    nextText: '다음 달',
		    monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
		    monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
		    dayNames: ['일','월','화','수','목','금','토'],
		    dayNamesShort: ['일','월','화','수','목','금','토'],
		    dayNamesMin: ['일','월','화','수','목','금','토'],
		    showMonthAfterYear: true,
		    changeMonth: true,
		    changeYear: true,
		    yearSuffix: '년'
		  }
	
	var bizUrl = window.location.protocol+'//'+window.location.host;
	
	var bizLayers = {'CELL9KM' : 'cell_200m_utmk',
					 'ALL9KM' : 'ALL_CMAQ_9KM',
			         'LINE' : 'line_test_wgs84',
			         'POINT' : 'CELL_AIR_9KM_PT',
			         'WIND_FILD':'shp_windfild',
			         'ANALS_AREA':'shp_anals_area',
			         'COURS':'COURS'};
	
	// 특수문자 제거 정규표현식
	var regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
	
	var wmsSelectTestLayer;
	var wmsWindLayer;
	
	var highlightVectorLayer;
	var popupOverlay;
	
	var bufferVectorLayer;
	var bufferFeatureLayer;
	
	var noCacheCount = 0;
	
	var pointTestFeatures;
	var selectFeatureLayer;
	var pointBufferVectorLayer;
	var pointBufferFeatureLayer;
	
	var clusterVectorLayer;
	
	// 기상장 분석 부분
	var weatherAnalysisLayer;
	var weatherAnalysisStartDates;
	var weatherAnalysisTimeSeries = [];
	var weatherAnalysisIndex = 0;
	var weatherAnalysisInterval = null;
	
	// 악취확산분석
	var odorSpreadStartDates;
	var odorSpreadLayer;
	var odorSpreadTimeSeries = [];
	var odorSpreadIndex = 0;
	var odorSpreadInterval = null;
	
	// 악취 이동경로
	var odorMovementLayer = null;
	var trackingFeatures;
	var trackingIdx = 0;
	var trackingInterval = null;
	var trackingIntervalTime = 1000;
	
	var init = function(){
		proj4.defs('EPSG:32652','+proj=utm +zone=52 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ');
		proj4.defs('EPSG:5179','+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs');
		
		ol.proj.proj4.register(proj4);
		
		setEvent();
		
		setComponents();
		
//		drawCell();
		
		setPopupOverlay();
//		drawBufferLayer();
		
		getPoints();
	}
	var setComponents = function(){
		var toDay = new Date();
		var hour = toDay.getHours()+1;
		var timeOptions = '';
		for(var i=1; i<25; i++){
			timeOptions += '<option '+(i==hour?'selected':'')+' value="'+(i<10 ? ('0'+i): i)+'">'+i+'시</option>';
		}
		
		//기상장
		$('#weatherAnalysisStartTime').html(timeOptions);
		$('#weatherAnalysisEndTime').html(timeOptions);
		
		weatherAnalysisStartDates = $( "#weatherAnalysisStartDate, #weatherAnalysisEndDate" ).datepicker($.extend(datePickerDefine,{
			  yearSuffix: '년',
			  onSelect: function( selectedDate ) {
				  if(this.id == "distributionChartStartDate"){
				      instance = $( this ).data( "datepicker" ),
				      date = $.datepicker.parseDate(
				        instance.settings.dateFormat ||
				        $.datepicker._defaults.dateFormat,
				        selectedDate, instance.settings );
					  distributionChartDates.not( this ).datepicker( "option", "minDate", date );
				  }
			  }
		}));
		
		$('#weatherAnalysisStartDate').datepicker('setDate', toDay);
		$('#weatherAnalysisEndDate').datepicker('setDate', toDay);
		
		//악취 확산 분석
		$('#odorSpreadStartTime').html(timeOptions);
		$('#odorSpreadEndTime').html(timeOptions);
		
		odorSpreadStartDates = $( "#odorSpreadStartDate, #odorSpreadEndDate" ).datepicker($.extend(datePickerDefine,{
			  yearSuffix: '년',
			  onSelect: function( selectedDate ) {
				  if(this.id == "distributionChartStartDate"){
				      instance = $( this ).data( "datepicker" ),
				      date = $.datepicker.parseDate(
				        instance.settings.dateFormat ||
				        $.datepicker._defaults.dateFormat,
				        selectedDate, instance.settings );
				      odorSpreadStartDates.not( this ).datepicker( "option", "minDate", date );
				  }
			  }
		}));
		
		$('#odorSpreadStartDate').datepicker('setDate', toDay);
		$('#odorSpreadEndDate').datepicker('setDate', toDay);
		
	}
	
	var getPoints = function(){
		_MapService.getWfs(':'+bizLayers.POINT, '*','RESULT_DT=\'2018062501\'', '').then(function(result){
			if(result == null || result.features.length <= 0){
				return;
			}
			pointTestFeatures = [];
			
			for(var i=0; i<result.features.length; i++){
				var feature = new ol.Feature({geometry:new ol.geom.Point(result.features[i].geometry.coordinates), properties:{idx:i+1}});
				feature.setId(result.features[i].properties.INDEXID);
				pointTestFeatures.push(feature);
			}
		});
	}
	
	var drawCell = function(){
//		var layerInfos = [{layerNm:'CE-TECH:'+bizLayers.CELL9KM,style:'',isVisible:true,isTiled:true,opacity:0.7, cql:'RESULT_DT=\'2018062501\' AND FLAG=0', zIndex:10}];
		var layerInfos = [{layerNm:'CE-TECH:'+bizLayers.CELL9KM,style:'',isVisible:true,isTiled:true,opacity:0.7, cql:'1=1', zIndex:10}];
		wmsSelectTestLayer = _CoreMap.createTileLayer(layerInfos)[0];
		
		_MapEventBus.trigger(_MapEvents.map_addLayer, wmsSelectTestLayer);
	}
	var drawWindLayer = function(){
		var layerInfos = [{layerNm:'CE-TECH:'+bizLayers.POINT,style:'',isVisible:true,isTiled:true,opacity:0.7, cql:'RESULT_DT=\'2018062501\'', zIndex:10}];
		wmsWindLayer = _CoreMap.createTileLayer(layerInfos)[0];
		
		_MapEventBus.trigger(_MapEvents.map_addLayer, wmsWindLayer);
	}
	var drawBufferLayer = function(){
		_MapService.getWfs(':'+bizLayers.LINE, '*','1=1', '').then(function(result){
			if(result == null || result.features.length <= 0){
				return;
			}
			var features = [];
			
			var bufferFeatures = [];
			
			for(var i=0; i<result.features.length; i++){
				features.push(new ol.Feature({geometry:new ol.geom.LineString(result.features[i].geometry.coordinates), properties:{idx:i+1}}));
				
				bufferFeatures.push(new ol.Feature({geometry:new ol.geom.LineString(result.features[i].geometry.coordinates), properties:{idx:i+1}}));
//				
//				features.push(new ol.Feature({geometry:new ol.geom.Point(result.features[i].geometry.coordinates), properties:{idx:i+1}}));
//				
//				bufferFeatures.push(new ol.Feature({geometry:new ol.geom.Point(result.features[i].geometry.coordinates), properties:{idx:i+1}}));
			}
			  
			bufferVectorLayer = new ol.layer.Vector({
				source : new ol.source.Vector({
					features : features
				}),
				style : highlightVectorStyle,
				visible: true,
				zIndex: 1001,
				id:'highlightVectorLayer'
			});
			
//			var source = new ol.source.Vector();
//			var format = new ol.format.GeoJSON();
//			var parser = new jsts.io.OL3Parser();
//			for (var i = 0; i < bufferFeatures.length; i++) {
//				var feature = bufferFeatures[i];
//				var jstsGeom = parser.read(feature.getGeometry());
//				var buffered = jstsGeom.buffer(1000);
//				feature.setGeometry(parser.write(buffered));
//			}
//			source.addFeatures(bufferFeatures);
//			var vectorLayer = new ol.layer.Vector({
//				source: source,
//				zIndex:1000
//			});
		        
			_MapEventBus.trigger(_MapEvents.map_addLayer, bufferVectorLayer);
//			_MapEventBus.trigger(_MapEvents.map_addLayer, vectorLayer);
				
		});
	}
	
	var drawPointBufferLayer = function(){
		pointBufferVectorLayer = new ol.layer.Vector({
				source : new ol.source.Vector({
					features : pointTestFeatures
				}),
				style : pointBufferStyle,
				visible: true,
				zIndex: 1001,
				id:'pointBufferLayer'});
		_MapEventBus.trigger(_MapEvents.map_addLayer, pointBufferVectorLayer);
	}
	
	var setPopupOverlay = function(){
		popupOverlay = new ol.Overlay({
	    	element: document.getElementById('popupOverlay')
	    });
		_CoreMap.getMap().addOverlay(popupOverlay);
	}
	
	var setEvent = function(){
		
		
		$('#testBtn0').on('click', function(){
			if(!wmsWindLayer){
				drawWindLayer();
				$(this).addClass('on');
			}else{
				_MapEventBus.trigger(_MapEvents.map_removeLayer, wmsWindLayer);
				wmsWindLayer = null;
				$(this).removeClass('on');
			}
		});
		$('#testBtn1').on('click', function(){
			if(!wmsSelectTestLayer){
				drawCell();
				$(this).addClass('on');
			}else{
				_MapEventBus.trigger(_MapEvents.map_removeLayer, wmsSelectTestLayer);
				wmsSelectTestLayer = null;
				$(this).removeClass('on');
				$('#popup-closer').trigger('click');
				if(highlightVectorLayer){
					_MapEventBus.trigger(_MapEvents.map_removeLayer, highlightVectorLayer);
				}
			}
		});
		
		$('#testBtn2').on('click', function(){
			if(!bufferVectorLayer){
				drawBufferLayer();
				$(this).addClass('on');
				_MapEventBus.on(_MapEvents.map_pointermove, function(event, data){
				    var hit = _CoreMap.getMap().forEachFeatureAtPixel([data.result.offsetX, data.result.offsetY], function (feature, layer) {
				        return feature;
				    });
				    
				    if (hit) {
				        $('.ol-viewport').css("cursor", 'pointer');
				    } else {
				    	$('.ol-viewport').css("cursor", "");
				    }
				});
			}else{
				_MapEventBus.trigger(_MapEvents.map_removeLayer, bufferVectorLayer);
				bufferVectorLayer = null;
				$(this).removeClass('on');
				if(bufferFeatureLayer){
					_MapEventBus.trigger(_MapEvents.map_removeLayer, bufferFeatureLayer);
					
				}
				if(selectFeatureLayer){
					_MapEventBus.trigger(_MapEvents.map_removeLayer, selectFeatureLayer);
				}
			}
		});
		$('#testBtn3').on('click', function(){
			if(!pointBufferVectorLayer){
				drawPointBufferLayer();
				$(this).addClass('on');
				_MapEventBus.on(_MapEvents.map_pointermove, function(event, data){
				    var hit = _CoreMap.getMap().forEachFeatureAtPixel([data.result.offsetX, data.result.offsetY], function (feature, layer) {
				        return feature;
				    });
				    if (hit) {
				        $('.ol-viewport').css("cursor", 'pointer');
				    } else {
				    	$('.ol-viewport').css("cursor", "");
				    }
				});
			}else{
				_MapEventBus.trigger(_MapEvents.map_removeLayer, pointBufferVectorLayer);
				pointBufferVectorLayer = null;
				$(this).removeClass('on');pointBufferVectorLayer
				if(pointBufferFeatureLayer){
					_MapEventBus.trigger(_MapEvents.map_removeLayer, pointBufferFeatureLayer);
					pointBufferFeatureLayer = null;
				}
			}
		});
		$('#testBtn4').on('click', function(){
			if(!pointBufferVectorLayer){
				drawPointBufferLayer();
				$(this).addClass('on');
				
				var idx = 2600;
				
				bufferInterval = setInterval(function(){
					var feature = pointBufferVectorLayer.getSource().getFeatureById(idx);
					if(idx == 2600){
						var centerCoord = feature.getGeometry().getCoordinates();
						_CoreMap.centerMap(centerCoord[0], centerCoord[1], 9);
					}
					idx++;
					if(feature == null){
						clearInterval(bufferInterval);
						return;
					}
					
					var parser = new jsts.io.OL3Parser();
					
					var bufferFeature = feature.clone();
					var jstsGeom = parser.read(bufferFeature.getGeometry());
					var buffered = jstsGeom.buffer(8500);
					bufferFeature.setGeometry(parser.write(buffered));
//					bufferFeature.getProperties().properties.isBuffered = true;
					
					
					if(pointBufferFeatureLayer){
						source = pointBufferFeatureLayer.getSource();
						var bufferFeature = source.getFeatures();
						if(bufferFeature.length > 0){
							var bufferJSTSGeom = parser.read(bufferFeature[0].getGeometry());
							var bufferGeom = bufferJSTSGeom.union(buffered);
							bufferFeature[0].setGeometry(parser.write(bufferGeom));
						}
					}else{
						var source = new ol.source.Vector();
						source.addFeatures([bufferFeature]);
						pointBufferFeatureLayer = new ol.layer.Vector({
							source: source,
							zIndex:1000,
							name:'pointBufferFeatureLayer',
							style: bufferVectorStyle
						});
						_MapEventBus.trigger(_MapEvents.map_addLayer, pointBufferFeatureLayer);
					}
					
				}, 100);
			}else{
				_MapEventBus.trigger(_MapEvents.map_removeLayer, pointBufferVectorLayer);
				pointBufferVectorLayer = null;
				$(this).removeClass('on');
				if(pointBufferFeatureLayer){
					_MapEventBus.trigger(_MapEvents.map_removeLayer, pointBufferFeatureLayer);
					pointBufferFeatureLayer = null;
				}
				if(bufferInterval){
					clearInterval(bufferInterval);
				}
			}
		});
		
		$('#testBtn5').on('click', function(){
			if(!clusterVectorLayer){
				var source = new ol.source.Vector({
					features: pointTestFeatures
				});

				var clusterSource = new ol.source.Cluster({
					distance: parseInt(15, 10),
					source: source
				});

				var styleCache = {};
				clusterVectorLayer = new ol.layer.Vector({
			        source: clusterSource,
			        style: function(feature) {
			        	var size = feature.get('features').length;
			        	var style = styleCache[size];
			        	if (!style) {
			        		style = new ol.style.Style({
			        			image: new ol.style.Circle({
			        				radius: 10,
			        				stroke: new ol.style.Stroke({
			        					color: '#fff'
			        				}),
			        				fill: new ol.style.Fill({
			        					color: '#3399CC'
			        				})
			        			}),
			        			text: new ol.style.Text({
			        				text: size.toString(),
			        				fill: new ol.style.Fill({
			        					color: '#fff'
			        				})
			        			})
			        		});
			        		styleCache[size] = style;
			        	}
			        	return style;
			        	}
				});
				_MapEventBus.trigger(_MapEvents.map_addLayer, clusterVectorLayer);
				$(this).addClass('on');
			}else{
				_MapEventBus.trigger(_MapEvents.map_removeLayer, clusterVectorLayer);
				clusterVectorLayer = null;
				$(this).removeClass('on');
			}
		});
		
		$('#cellRemeveBtn').on('click', function(){
			if(highlightVectorLayer){
				var flag = $(this).attr('flag');
				var indexId = $(this).attr('indexId');
				$.ajax({
		            url : bizUrl+'/putFlag.do?flag='+(flag == 0 ? 1:0)+'&indexId='+indexId,
		            type : 'GET',
		            contentType : 'application/json'
		    	}).done(function(result){
		    		noCacheCount++;
		    		
		    		var wmsSource = wmsSelectTestLayer.getSource();
		    		wmsSource.updateParams({CQL_FILTER:"RESULT_DT='2018062501' AND FLAG=0 AND "+noCacheCount+"="+noCacheCount});
		    		
		    		$('#popup-closer').trigger('click');
		    	});
			}
		});
		
		$('#popup-closer').on('click', function(){
			 $('#popupOverlay').hide();
			 $('#popup-content').hide();
			 if(highlightVectorLayer){
				 _MapEventBus.trigger(_MapEvents.map_removeLayer, highlightVectorLayer);
				 highlightVectorLayer = null;
			 }
		});
		
		_MapEventBus.on(_MapEvents.clickLayerOnOff, function(event, data){
			console.log(event, data);
			if(data.target == 'weatherAnalysis'){
				if(weatherAnalysisLayer){
					weatherAnalysisLayer.setVisible(data.isShow);
				}
			}else if(data.target == 'odorSpread'){
				if(odorSpreadLayer){
					odorSpreadLayer.setVisible(data.isShow);
				}
			}else if(data.target == 'odorMovement'){
				if(odorMovementLayer){
					odorMovementLayer.setVisible(data.isShow);
				}
			}
		});
		_MapEventBus.on(_MapEvents.map_singleclick, function(event, data){
			
			var feature = _CoreMap.getMap().forEachFeatureAtPixel(data.result.pixel,function(feature, layer){
				var lyrNm = layer.get('name');
				
				if(_WestCondition.getContentsConfig()[layer.get('name')]){
					if(_CoreMap.getMap().getLayerForName(lyrNm)){
						_WestCondition.onClickLayer(feature,lyrNm);
					}
				}
			});
			
			if(wmsSelectTestLayer){
				wmsSelectTestLayer.setOpacity(0.0);
				
				var wmsSource = wmsSelectTestLayer.getSource();
				wmsSource.updateParams({CQL_FILTER:"RESULT_DT='2018062501' AND "+noCacheCount+"="+noCacheCount});
				
				var view = _CoreMap.getMap().getView();
				var viewResolution = /** @type {number} */ (view.getResolution());
				var viewProjection = view.getProjection();
				  
				var url = wmsSource.getGetFeatureInfoUrl( data.result.coordinate, viewResolution, viewProjection, {'INFO_FORMAT': 'application/json'});
				if (url) {
					$.getJSON(url, function(result){
						
						wmsSource.updateParams({CQL_FILTER:"RESULT_DT='2018062501' AND FLAG=0 AND "+noCacheCount+"="+noCacheCount});
						
						setTimeout(function(){wmsSelectTestLayer.setOpacity(0.7);}, 10);
						
						if(highlightVectorLayer){
							_MapEventBus.trigger(_MapEvents.map_removeLayer, highlightVectorLayer);
							highlightVectorLayer = null;
						}
						
						if(result.features == null || result.features.length <= 0){
							return;
						}
						  
						var feature = new ol.Feature({id:result.features[0].id,geometry:new ol.geom.Polygon(result.features[0].geometry.coordinates), properties:{}});
						feature.setProperties(result.features[0].properties);
						feature.setId(result.features[0].id);
						  
						highlightVectorLayer = new ol.layer.Vector({
								source : new ol.source.Vector({
									features : [feature]
								}),
								style : highlightVectorStyle,
								visible: true,
								zIndex: 100,
								id:'highlightVectorLayer'
						});
							
						_MapEventBus.trigger(_MapEvents.map_addLayer, highlightVectorLayer);
						var geometry = feature.getGeometry();
						var featureExtent = geometry.getExtent();
						var featureCenter = ol.extent.getCenter(featureExtent);
						
						if(popupOverlay){
							$('#popupOverlay').show();
							$('#popup-content').show();
							popupOverlay.setPosition(featureCenter);
							
							$('#cellRemeveBtn').attr('flag', result.features[0].properties.FLAG);
							$('#cellRemeveBtn').attr('indexId', result.features[0].properties.IDX);
							
							if(result.features[0].properties.FLAG == 0){
								$('#cellRemeveBtn').val('격자해제');
							}else{
								$('#cellRemeveBtn').val('격자추가');
							}
						}
					});
				}
			}
			
			if(bufferVectorLayer){
				var feature = _CoreMap.getMap().forEachFeatureAtPixel(data.result.pixel,
			        function (feature) {
			            return feature;
		        });
			        
			    if (feature) {
//			    	if(feature.getProperties().properties.isBuffered ){
//			    		return;
//			    	}
			    	
					var parser = new jsts.io.OL3Parser();
					
					var bufferFeature = feature.clone();
					var jstsGeom = parser.read(bufferFeature.getGeometry());
					var buffered = jstsGeom.buffer(2000);
					bufferFeature.setGeometry(parser.write(buffered));
//					bufferFeature.getProperties().properties.isBuffered = true;
					
					
					if(bufferFeatureLayer){
						source = bufferFeatureLayer.getSource();
						source.addFeatures([bufferFeature]);
					}else{
						var source = new ol.source.Vector();
						source.addFeatures([bufferFeature]);
						bufferFeatureLayer = new ol.layer.Vector({
							source: source,
							zIndex:1000,
							name:'bufferedVectorLayer',
							style: bufferVectorStyle
						});
						_MapEventBus.trigger(_MapEvents.map_addLayer, bufferFeatureLayer);
					}
					
					var selectedFeatures = [];

					var bufferPolygon = bufferFeature.getGeometry();
					for(var i=0; i<pointTestFeatures.length; i++){
						var pointCoord = pointTestFeatures[i].getGeometry().getCoordinates();
						
						if(bufferPolygon.intersectsCoordinate(pointCoord)){
							selectedFeatures.push(pointTestFeatures[i]);
						}
					}
					if(selectFeatureLayer){
						var selectFeatureSource = selectFeatureLayer.getSource();
						selectFeatureSource.addFeatures(selectedFeatures);
					}else{
						var selectFeatureSource = new ol.source.Vector();
						selectFeatureSource.addFeatures(selectedFeatures);
						
						selectFeatureLayer = new ol.layer.Vector({
							source: selectFeatureSource,
							zIndex:1005,
							name:'selectPointVectorLayer',
							style:pointStyle
						});
						_MapEventBus.trigger(_MapEvents.map_addLayer, selectFeatureLayer);
					}
			    }
			}
			if(pointBufferVectorLayer){
				var feature = _CoreMap.getMap().forEachFeatureAtPixel(data.result.pixel,
				        function (feature) {
				            return feature;
			        });
				
				var parser = new jsts.io.OL3Parser();
				
				var bufferFeature = feature.clone();
				var jstsGeom = parser.read(bufferFeature.getGeometry());
				var buffered = jstsGeom.buffer(8500);
				bufferFeature.setGeometry(parser.write(buffered));
//				bufferFeature.getProperties().properties.isBuffered = true;
				
				
				if(pointBufferFeatureLayer){
					source = pointBufferFeatureLayer.getSource();
					var bufferFeature = source.getFeatures();
					if(bufferFeature.length > 0){
						var bufferJSTSGeom = parser.read(bufferFeature[0].getGeometry());
						var bufferGeom = bufferJSTSGeom.union(buffered);
						bufferFeature[0].setGeometry(parser.write(bufferGeom));
					}
				}else{
					var source = new ol.source.Vector();
					source.addFeatures([bufferFeature]);
					pointBufferFeatureLayer = new ol.layer.Vector({
						source: source,
						zIndex:1000,
						name:'pointBufferFeatureLayer',
						style: bufferVectorStyle
					});
					_MapEventBus.trigger(_MapEvents.map_addLayer, pointBufferFeatureLayer);
				}
			}
		});
		
		_MapEventBus.on(_MapEvents.map_mousemove, function(event, data){
			var coreMap = _CoreMap.getMap();
			var pixel = coreMap.getEventPixel(data.result.originalEvent);
			var hit = coreMap.forEachFeatureAtPixel(pixel, function(feature, layer) {
				if(_WestCondition.getContentsConfig()[layer.get('name')]){
					return true;
				}else{
					return false;
				}
			});
			
			if (hit) {
				coreMap.getViewport().style.cursor = 'pointer';
			} else {
				coreMap.getViewport().style.cursor = '';
			}
		});
		
		
		
		// 기상장 분석
		$('#weatherAnalysisPlay').on('click', function(){
			var weatherAnalysisStartDate = $('#weatherAnalysisStartDate').val().replace(regExp, '');
			var weatherAnalysisStartTime = parseInt($('#weatherAnalysisStartTime').val());
			if(weatherAnalysisStartTime < 10){
				weatherAnalysisStartTime = '0'+weatherAnalysisStartTime;
			}
			var weatherAnalysisEndDate= $('#weatherAnalysisEndDate').val().replace(regExp, '');
			var weatherAnalysisEndTime = $('#weatherAnalysisEndTime').val();	
			if(weatherAnalysisEndTime < 10){
				weatherAnalysisEndTime = '0'+weatherAnalysisEndTime;
			}
			
			if(weatherAnalysisStartDate == weatherAnalysisEndDate){
				if(parseInt(weatherAnalysisStartTime) > parseInt(weatherAnalysisEndTime)){
					alert('같은 날짜일때 두번째 시간이 더 빠를 수 없습니다.');
					return;
				}	
			}
			
			if(weatherAnalysisLayer){
				_MapEventBus.trigger(_MapEvents.map_removeLayer, weatherAnalysisLayer);
				weatherAnalysisLayer = null;
				
				clearInterval(weatherAnalysisInterval);
				weatherAnalysisInterval = null;
			}
			
			weatherAnalysisTimeSeries = setTimeSeries(weatherAnalysisStartDate, weatherAnalysisEndDate, weatherAnalysisStartTime, weatherAnalysisEndTime);
			weatherAnalysisIndex = 0;
			
			var layerInfos = [{layerNm:bizLayers.WIND_FILD,style:null,isVisible:true,isTiled:true,cql:null,opacity:0.7, cql:'DTA_DT=\''+weatherAnalysisStartDate+weatherAnalysisStartTime+'\'', zIndex:4}];
			weatherAnalysisLayer = _CoreMap.createTileLayer(layerInfos)[0];
			_MapEventBus.trigger(_MapEvents.map_addLayer, weatherAnalysisLayer);
			
			setCurrentDate(weatherAnalysisStartDate, weatherAnalysisStartTime, 'weatherAnalysisDate');
			playWeatherAnalysisLayer();
			
		});
		$('#weatherAnalysisPrevious').on('click', function(){
			if(weatherAnalysisLayer){
				clearInterval(weatherAnalysisInterval);
				weatherAnalysisInterval = null;
				
				weatherAnalysisIndex--;
				
				if(weatherAnalysisIndex < 0){
					weatherAnalysisIndex = 0;
				}
				
				updateLayer(weatherAnalysisLayer, {sdate:weatherAnalysisTimeSeries[weatherAnalysisIndex].date, stime:weatherAnalysisTimeSeries[weatherAnalysisIndex].time, style:null});
				setCurrentDate(weatherAnalysisTimeSeries[weatherAnalysisIndex].date, weatherAnalysisTimeSeries[weatherAnalysisIndex].time, 'weatherAnalysisDate');
			}
		});
		$('#weatherAnalysisNext').on('click', function(){
			if(weatherAnalysisLayer){
				clearInterval(weatherAnalysisInterval);
				weatherAnalysisInterval = null;
				
				weatherAnalysisIndex++;
				
				if(weatherAnalysisTimeSeries.length <= (weatherAnalysisIndex+1)){
					weatherAnalysisIndex = weatherAnalysisTimeSeries.length-1;
				}
				
				updateLayer(weatherAnalysisLayer, {sdate:weatherAnalysisTimeSeries[weatherAnalysisIndex].date, stime:weatherAnalysisTimeSeries[weatherAnalysisIndex].time, style:null});
				setCurrentDate(weatherAnalysisTimeSeries[weatherAnalysisIndex].date, weatherAnalysisTimeSeries[weatherAnalysisIndex].time, 'weatherAnalysisDate');
			}
		}); 
		
		
		// 악취 확산 분석
		$('#odorSpreadPlay').on('click', function(){
			var odorSpreadStartDate = $('#odorSpreadStartDate').val().replace(regExp, '');
			var odorSpreadStartTime = parseInt($('#odorSpreadStartTime').val());
			if(odorSpreadStartTime < 10){
				odorSpreadStartTime = '0'+odorSpreadStartTime;
			}
			var odorSpreadEndDate= $('#odorSpreadEndDate').val().replace(regExp, '');
			var odorSpreadEndTime = $('#odorSpreadEndTime').val();	
			if(odorSpreadEndTime < 10){
				odorSpreadEndTime = '0'+odorSpreadEndTime;
			}
			
			if(odorSpreadStartDate == odorSpreadEndDate){
				if(parseInt(odorSpreadStartTime) > parseInt(odorSpreadEndTime)){
					alert('같은 날짜일때 두번째 시간이 더 빠를 수 없습니다.');
					return;
				}	
			}
			
			if(odorSpreadLayer){
				_MapEventBus.trigger(_MapEvents.map_removeLayer, odorSpreadLayer);
				odorSpreadLayer = null;
				
				clearInterval(odorSpreadInterval);
				odorSpreadInterval = null;
			}
			
			odorSpreadTimeSeries = setTimeSeries(odorSpreadStartDate, odorSpreadEndDate, odorSpreadStartTime, odorSpreadEndTime);
			odorSpreadIndex = 0;
			
			var layerInfos = [{layerNm:bizLayers.ANALS_AREA,style:null,isVisible:true,isTiled:true,cql:null,opacity:0.7, cql:'DTA_DT=\''+odorSpreadStartDate+odorSpreadStartTime+'\'', zIndex:4}];
			odorSpreadLayer = _CoreMap.createTileLayer(layerInfos)[0];
			_MapEventBus.trigger(_MapEvents.map_addLayer, odorSpreadLayer);
			
			setCurrentDate(odorSpreadStartDate, odorSpreadStartTime, 'odorSpreadDate');
			playOdorSpreadLayer();
			
		});
		$('#odorSpreadPrevious').on('click', function(){
			if(odorSpreadLayer){
				clearInterval(odorSpreadInterval);
				odorSpreadInterval = null;
				
				odorSpreadIndex--;
				
				if(odorSpreadIndex < 0){
					odorSpreadIndex = 0;
				}
				
				updateLayer(odorSpreadLayer, {sdate:odorSpreadTimeSeries[odorSpreadIndex].date, stime:odorSpreadTimeSeries[odorSpreadIndex].time, style:null});
				setCurrentDate(odorSpreadTimeSeries[odorSpreadIndex].date, odorSpreadTimeSeries[odorSpreadIndex].time, 'odorSpreadDate');
			}
		});
		$('#odorSpreadNext').on('click', function(){
			if(odorSpreadLayer){
				clearInterval(odorSpreadInterval);
				odorSpreadInterval = null;
				
				odorSpreadIndex++;
				
				if(odorSpreadTimeSeries.length <= (odorSpreadIndex+1)){
					odorSpreadIndex = odorSpreadTimeSeries.length-1;
				}
				
				updateLayer(odorSpreadLayer, {sdate:odorSpreadTimeSeries[odorSpreadIndex].date, stime:odorSpreadTimeSeries[odorSpreadIndex].time, style:null});
				setCurrentDate(odorSpreadTimeSeries[odorSpreadIndex].date, odorSpreadTimeSeries[odorSpreadIndex].time, 'odorSpreadDate');
			}
		}); 
		// 악취 이동경로
		$('#odorMovementPlay').on('click', function(){
			if(trackingInterval){
				clearInterval(trackingInterval);
				trackingInterval = null;
			}
			if(odorMovementLayer){
				_MapEventBus.trigger(_MapEvents.map_removeLayer, odorMovementLayer);
				odorMovementLayer = null;
			}
			
			_MapService.getWfs(':'+bizLayers.COURS, '*','ANALS_AREA_ID=\'C05\' AND DTA=\'2018110211\'', 'SN').then(function(result){
				if(result == null || result.features.length <= 0){
					alert('모델링 데이터가 없습니다.');
					return;
				}
				
				trackingFeatures = [];
				
				for(var i=0; i<result.features.length; i++){
					var coord = ol.proj.transform([parseInt(result.features[i].properties.UTMX), parseInt(result.features[i].properties.UTMY)], 'EPSG:32652', 'EPSG:3857');
					var feature = new ol.Feature({geometry:new ol.geom.Point(coord), properties:result.features[i].properties});
					feature.setId(result.features[i].id);
					trackingFeatures.push(feature);
				}
				
				odorMovementLayer = new ol.layer.Vector({
					source : new ol.source.Vector({
						features : [trackingFeatures[0]]
					}),
					style : pointStyle,
					zIndex: 3000,
					id:'odorMovementLayer'
				});
				
				_MapEventBus.trigger(_MapEvents.map_addLayer, odorMovementLayer);
				
				var centerCoord = trackingFeatures[0].getGeometry().getCoordinates();
				_CoreMap.centerMap(centerCoord[0], centerCoord[1]);
				
				trackingIdx = 0;
				trackingIntervalTime = 1000;
				tracking();
			});
		});
		
		$('#odorMovementPrevious').on('click', function(){
			if(odorSpreadLayer){
				clearInterval(odorSpreadInterval);
				odorSpreadInterval = null;
				
				odorSpreadIndex--;
				
				if(odorSpreadIndex < 0){
					odorSpreadIndex = 0;
				}
				
				updateLayer(odorSpreadLayer, {sdate:odorSpreadTimeSeries[odorSpreadIndex].date, stime:odorSpreadTimeSeries[odorSpreadIndex].time, style:null});
				setCurrentDate(odorSpreadTimeSeries[odorSpreadIndex].date, odorSpreadTimeSeries[odorSpreadIndex].time, 'odorSpreadDate');
			}
		});
		$('#odorMovementNext').on('click', function(){
			if(odorSpreadLayer){
				clearInterval(odorSpreadInterval);
				odorSpreadInterval = null;
				
				odorSpreadIndex++;
				
				if(odorSpreadTimeSeries.length <= (odorSpreadIndex+1)){
					odorSpreadIndex = odorSpreadTimeSeries.length-1;
				}
				
				updateLayer(odorSpreadLayer, {sdate:odorSpreadTimeSeries[odorSpreadIndex].date, stime:odorSpreadTimeSeries[odorSpreadIndex].time, style:null});
				setCurrentDate(odorSpreadTimeSeries[odorSpreadIndex].date, odorSpreadTimeSeries[odorSpreadIndex].time, 'odorSpreadDate');
			}
		}); 
		
	};
	var tracking = function(){
		
		trackingInterval = setInterval(function(){
			trackingIdx++;
			if(trackingFeatures[trackingIdx]){
				odorMovementLayer.getSource().addFeature(trackingFeatures[trackingIdx]);
				
				var centerCoord = trackingFeatures[trackingIdx].getGeometry().getCoordinates();
				_CoreMap.centerMap(centerCoord[0], centerCoord[1]);	
			}else{
				clearInterval(trackingInterval);
				trackingInterval = null;
			}
		}, trackingIntervalTime); 
	}

	var playWeatherAnalysisLayer = function(){
		weatherAnalysisInterval = setInterval(function(){
			weatherAnalysisIndex++;
			
			if(weatherAnalysisTimeSeries[weatherAnalysisIndex]){
				updateLayer(weatherAnalysisLayer, {sdate:weatherAnalysisTimeSeries[weatherAnalysisIndex].date, stime:weatherAnalysisTimeSeries[weatherAnalysisIndex].time, style:null});
				setCurrentDate(weatherAnalysisTimeSeries[weatherAnalysisIndex].date, weatherAnalysisTimeSeries[weatherAnalysisIndex].time, 'weatherAnalysisDate');	
			}else{
				clearInterval(weatherAnalysisInterval);
				return;
			}
		}, 1000 * 3);
	};
	
	var playOdorSpreadLayer = function(){
		odorSpreadInterval = setInterval(function(){
			odorSpreadIndex++;
			
			if(odorSpreadTimeSeries[odorSpreadIndex]){
				updateLayer(odorSpreadLayer, {sdate:odorSpreadTimeSeries[odorSpreadIndex].date, stime:odorSpreadTimeSeries[odorSpreadIndex].time, style:null});
				setCurrentDate(odorSpreadTimeSeries[odorSpreadIndex].date, odorSpreadTimeSeries[odorSpreadIndex].time, 'odorSpreadDate');	
			}else{
				clearInterval(odorSpreadInterval);
				return;
			}
		}, 1000 * 3);
	};
	var updateLayer = function(layer, param){
		var source = layer.getSource();
		source.updateParams({'FORMAT': 'image/png', 
				'VERSION': '1.1.0',
				tiled: true,
				STYLES:param.style,
				CQL_FILTER:'DTA_DT=\''+param.sdate+param.stime+'\''
		});
	} 
	
	var setTimeSeries = function(sdate, edate, stime, etime){
		var timeSeriesArr = [];
		var syear = sdate.substring(0,4);
		var smonth = sdate.substring(4,6);
		var sday = sdate.substring(6,8);
		
		var eyear = parseInt(edate.substring(0,4));
		var emonth = parseInt(edate.substring(4,6));
		var eday = parseInt(edate.substring(6,8));
		
		var tdate = new Date(syear, parseInt(smonth)-1, sday);
		
		var stime = parseInt(stime);
		var etime = parseInt(etime);
		while(true){
			var y = tdate.getFullYear();
			var m = tdate.getMonth()+1;
			var d = tdate.getDate();
			
			if(y == eyear && m == emonth && d == eday && stime > etime){
				break;
			}
			var timeSeries = {date : y+''+(m<10?'0'+m:m)+''+(d<10?'0'+d:d), time:(stime<10?'0'+stime:stime+'')};
			if(stime > 23){
				stime = 0;
				tdate.setDate(d + 1);
				continue;
			}else{
				stime++;
			}
			timeSeriesArr.push(timeSeries);
		}
		return timeSeriesArr;
	}
	var setCurrentDate = function(cdate, ctime, targetId){
		$('#'+targetId).val(cdate.substring(0,4)+'.'+cdate.substring(4,6)+'.'+cdate.substring(6,8)+'일  '+ctime+'시');
	}
	var bufferVectorStyle = function(){
		return new ol.style.Style({
	          stroke: new ol.style.Stroke({
	            color: 'blue',
	            width: 2
	          }),
	          fill: new ol.style.Fill({
	            color: 'rgba(255, 255, 0, 0.5)'
	          })
	        })
	};
	var highlightVectorStyle = function(){
		return new ol.style.Style({
	          stroke: new ol.style.Stroke({
	            color: 'red',
	            width: 2
	          }),
	          fill: new ol.style.Fill({
	            color: 'rgba(255, 255, 0, 0.0)'
	          })
	        })
	};
	var pointStyle = function(){
		return new ol.style.Style({
	        image: new ol.style.Icon(/** @type {module:ol/style/Icon~Options} */ ({
	            src: '/map/resources/images/icon/c1.png'
	        }))
		});
	}
	var pointBufferStyle = function(){
		return new ol.style.Style({
	        image: new ol.style.Icon(/** @type {module:ol/style/Icon~Options} */ ({
	            src: '/map/resources/images/icon/c2.png'
	        }))
		});
	}
    // public functions
    return {
    	  
        init: function () {
        	var me = this;
        	init();
        	return me;
        }
    };
}();

