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
	
	var bizLayers = {'CELL9KM' : 'shp_anals_area_new',//'cell_200m_utmk',
					 'ALL9KM' : 'ALL_CMAQ_9KM',
			         'LINE' : 'line_test_wgs84',
			         'POINT' : 'CELL_AIR_9KM_PT',
			         'WEATHER_FORECAST':'weather_forecast',
			         'WEATHER_NOW':'weather_now',
			         'ANALS_AREA':'shp_anals_area',
			         'COURS':'COURS',
			         'ANALS_POINT_NOW': 'anals_point_now',
			         'ANALS_POINT_FORECAST': 'anals_point_forecast'};
	
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
	var odorSpreadHeatMapLayer;
	
	var odorSpreadTimeSeries = [];
	var odorSpreadIndex = 0;
	var odorSpreadInterval = null;
	
	// 악취 이동경로
	var odorMovementLayer = null;
	var trackingFeatures;
	var trackingIdx = 0;
	var trackingInterval = null;
	var trackingIntervalTime = 1000;
	
	var originLayer  = null; 
	
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
		var hour = toDay.getHours()-1;
		if(hour < 0 ){
			hour = 0;
		}
		var timeOptions = '';
		for(var i=0; i<24; i++){
			timeOptions += '<option '+(i==hour?'selected':'')+' value="'+(i<10 ? ('0'+i): i) +'">'+i+'시</option>';
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
		$('#weatherAnalysisStartDate').datepicker( "option", "maxDate", toDay );
		$('#weatherAnalysisEndDate').datepicker( "option", "maxDate", toDay );
		
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
		$('#odorSpreadStartDate').datepicker( "option", "maxDate", toDay );
		$('#odorSpreadEndDate').datepicker( "option", "maxDate", toDay );

		// 악취 경로
		$('#odorMovementStartDate').datepicker('setDate', toDay);
		
		$('#odorMovementStartDate').datepicker( "option", "maxDate", toDay );
		
		$('#odorMovementStartTime').html(timeOptions);
		
		setIntrstCombo();
		
	}
	
	var setIntrstCombo = function(){
		$.ajax({
            url: '/getIntrstList.do',
        }).done(function(result){
        	var intrstOptions = '';
        	for(var i=0; i<result.length; i++){
        		intrstOptions += '<option  value="'+result[i].analsAreaId+'">'+result[i].intrstAreaNm+'('+result[i].analsAreaId+')</option>';
    		}
        	$('#odorMovementItem').html(intrstOptions); 
        });	
	}
	var setSensorCombo = function(){
		$.ajax({
            url: '/getSensorList.do',
        }).done(function(result){
        	var intrstOptions = '';
        	for(var i=0; i<result.length; i++){
        		intrstOptions += '<option  value="'+result[i].spotCode+'">'+result[i].sensorNm+'('+result[i].spotCode+')</option>';
    		}
        	$('#odorMovementItem').html(intrstOptions); 
        });	
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
		
		
		$('#tabOpeners').on('click', function(){
			var me = $(this);
			_WestCondition.tabCloseOpen(me);
		});
		
		$('#testBtn7').on('click', function(){
			var me = $(this);
			if($('#gridArea> #tabs').children().length > 1){
				_WestCondition.gridCloseOpen(me);
			}
		});
		
		
		$('#cellRemeveBtn').on('click', function(){
			if(highlightVectorLayer){
				var indexId = $(this).attr('indexId');
				var flag = $(this).attr('reg');
				
				if(flag == "0"){
					$.ajax({
			            url : bizUrl+'/insertAnals.do?indexId='+indexId,
			            type : 'GET',
			            contentType : 'application/json'
			    	}).done(function(result){
			    		
			    		var wmsSource = wmsSelectTestLayer.getSource();
			    		wmsSource.updateParams({"time":Date.now()});
			    		
			    		$('#popup-closer').trigger('click');
			    	});
				}else{
					$.ajax({
			            url : bizUrl+'/deleteAnals.do?indexId='+indexId,
			            type : 'GET',
			            contentType : 'application/json'
			    	}).done(function(result){
			    		
			    		var wmsSource = wmsSelectTestLayer.getSource();
			    		wmsSource.updateParams({"time":Date.now()});
			    		
			    		$('#popup-closer').trigger('click');
			    	});
				}
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
					if(originLayer){
						originLayer.setVisible(data.isShow);	
					}
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
				
				var view = _CoreMap.getMap().getView();
				var viewResolution = /** @type {number} */ (view.getResolution());
				var viewProjection = view.getProjection();
				  
				var url = wmsSource.getGetFeatureInfoUrl( data.result.coordinate, viewResolution, viewProjection, {'INFO_FORMAT': 'application/json'});
				if (url) {
					$.getJSON(url, function(result){
						
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
							
							popupOverlay.setPosition(featureCenter);
							_WestCondition.popupOverlayData(result.features[0].properties.ANALS_AREA_ID , result.features[0].properties.REG);
							
							/*$('#cellRemeveBtn').attr('flag', result.features[0].properties.FLAG);
							$('#cellRemeveBtn').attr('indexId', result.features[0].properties.IDX);
							
							if(result.features[0].properties.FLAG == 0){
								$('#cellRemeveBtn').val('격자해제');
							}else{
								$('#cellRemeveBtn').val('격자추가');
							}*/
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
			
			
			if(originLayer){
				var feature = _CoreMap.getMap().forEachFeatureAtPixel(data.result.pixel, function(feature, layer) {
					if(layer.get('id') == 'originLayer'){
						return feature;	
					}
					return null;
				});
			    if (feature) {
			    	var geometry = feature.getGeometry();
			    	var properties = feature.getProperties().properties;
					var featureExtent = geometry.getExtent();
					var featureCenter = ol.extent.getCenter(featureExtent);
					if(popupOverlay){
						$('#popupOverlay').show();
						$('#popup-content').show();
						popupOverlay.setPosition(featureCenter);
						$('#originTitle').html(properties.CMPNY_NM);
						$('#originTel').html(properties.TELNO);
					}
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
		
		$('a[name="weatherType"]').on('click', function(){
			$('a[name="weatherType"]').removeClass('on');
			$(this).addClass('on');
			var layerNm = $('a[name="weatherType"][class="on"]').attr('value');
			var toDay = new Date();
			
			// 실시간 
			if(layerNm == 'weather_now'){
				$('#weatherAnalysisStartDate').datepicker('setDate', toDay);
				$('#weatherAnalysisEndDate').datepicker('setDate', toDay);
				
				$('#weatherAnalysisStartDate').datepicker( "option", "minDate", null );
				$('#weatherAnalysisEndDate').datepicker( "option", "minDate", null );
				
				$('#weatherAnalysisStartDate').datepicker( "option", "maxDate", toDay );
				$('#weatherAnalysisEndDate').datepicker( "option", "maxDate", toDay );
			}else{ // 예보
				
				$('#weatherAnalysisStartDate').datepicker('setDate', toDay);
				$('#weatherAnalysisEndDate').datepicker('setDate', toDay);
				
				$('#weatherAnalysisStartDate').datepicker( "option", "maxDate", null );
				$('#weatherAnalysisEndDate').datepicker( "option", "maxDate", null );
				
				$('#weatherAnalysisEndDate').datepicker( "option", "minDate", toDay );
				$('#weatherAnalysisStartDate').datepicker( "option", "minDate", toDay );
			}
			if(weatherAnalysisLayer){
				
				_MapEventBus.trigger(_MapEvents.map_removeLayer, weatherAnalysisLayer);
				weatherAnalysisLayer = null;
				
				clearInterval(weatherAnalysisInterval);
				weatherAnalysisInterval = null;
//				for(var i=0; i<weatherAnalysisTimeSeries.length; i++){
//					weatherAnalysisTimeSeries[i].layer = layerNm;
//				}
//				updateLayer(weatherAnalysisLayer, weatherAnalysisTimeSeries[weatherAnalysisIndex]);
			}
		})
		$('#weatherWsBtn').on('click', function(){
			updateWeatherStyle();
		})
		$('#weatherMeasurement').on('change', function(){
			updateWeatherStyle();
		})
		
		var updateWeatherStyle = function(){
			if(weatherAnalysisLayer){
				var weatherOnOff = $('#weatherWsBtn').attr('value');
				var weatherMeasurement = $('#weatherMeasurement').val();
				var styleNm = weatherMeasurement+weatherOnOff;
				
				if(styleNm == ''){
					weatherAnalysisLayer.setVisible(false);
					return;
				}
				weatherAnalysisLayer.setVisible(true);
				
				for(var i=0; i<weatherAnalysisTimeSeries.length; i++){
					weatherAnalysisTimeSeries[i].style = styleNm;
				}
				updateLayer(weatherAnalysisLayer, weatherAnalysisTimeSeries[weatherAnalysisIndex]);
			}
		}
		
		// 기상장 분석
		$('#weatherAnalysisPlay').on('click', function(){
			var layerNm = $('a[name="weatherType"][class="on"]').attr('value');
			
			var weatherOnOff = $('#weatherWsBtn').attr('value');
			var weatherMeasurement = $('#weatherMeasurement').val();
			
			if((weatherOnOff == null || weatherOnOff == '') && weatherMeasurement == ''){
				if(weatherAnalysisLayer){
					_MapEventBus.trigger(_MapEvents.map_removeLayer, weatherAnalysisLayer);
					weatherAnalysisLayer = null;
					
					clearInterval(weatherAnalysisInterval);
					weatherAnalysisInterval = null;
				}
				return;
			}
			
			var styleNm = weatherMeasurement+weatherOnOff;
			
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
			
			weatherAnalysisTimeSeries = setTimeSeries(weatherAnalysisStartDate, weatherAnalysisEndDate, weatherAnalysisStartTime, weatherAnalysisEndTime, layerNm, styleNm);
			weatherAnalysisIndex = 0;
			
			var layerInfos = [{layerNm:layerNm,style:styleNm,isVisible:true,isTiled:true,cql:null,opacity:0.7, cql:'DTA_DT=\''+weatherAnalysisStartDate+weatherAnalysisStartTime+'\'', zIndex:4}];
			weatherAnalysisLayer = _CoreMap.createTileLayer(layerInfos)[0];
			_MapEventBus.trigger(_MapEvents.map_addLayer, weatherAnalysisLayer);
			
			setCurrentDate({date:weatherAnalysisStartDate, time:weatherAnalysisStartTime}, 'weatherAnalysisDate');
			playWeatherAnalysisLayer();
			
		});
		$('#weatherAnalysisPrevious').on('click', function(){
			if(weatherAnalysisLayer){
				clearInterval(weatherAnalysisInterval);
				weatherAnalysisInterval = null;
				
				weatherAnalysisIndex--;
				
				if(weatherAnalysisIndex < 0){
					weatherAnalysisIndex = 0;
//					return;
				}
				
				updateLayer(weatherAnalysisLayer, weatherAnalysisTimeSeries[weatherAnalysisIndex]);
				setCurrentDate(weatherAnalysisTimeSeries[weatherAnalysisIndex], 'weatherAnalysisDate');
			}
		});
		$('#weatherAnalysisNext').on('click', function(){
			if(weatherAnalysisLayer){
				clearInterval(weatherAnalysisInterval);
				weatherAnalysisInterval = null;
				
				weatherAnalysisIndex++;
				
				if(weatherAnalysisTimeSeries.length <= (weatherAnalysisIndex+1)){
					weatherAnalysisIndex = weatherAnalysisTimeSeries.length-1;
//					return;
				}
				
				updateLayer(weatherAnalysisLayer, weatherAnalysisTimeSeries[weatherAnalysisIndex]);
				setCurrentDate(weatherAnalysisTimeSeries[weatherAnalysisIndex], 'weatherAnalysisDate');
			}
		}); 
		
		// 악취 확산 분석
		$('#odorSpreadPlay').on('click', function(){
			
			var layerNm =  $('a[name="odorSpreadLayerType"][class="on"]').attr('value');
			
//			var mapType = $('a[name="odorSpreadMapType"][class="on"]').attr('value');
			var mapType = $('input[name="odorSpreadMapType"]:checked').val();
			
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
			
			odorSpreadTimeSeries = setTimeSeries(odorSpreadStartDate, odorSpreadEndDate, odorSpreadStartTime, odorSpreadEndTime, layerNm, null);
			odorSpreadIndex = 0;
			
			if(mapType == 'cell'){
				var layerInfos = [{layerNm:layerNm,style:null,isVisible:true,isTiled:true,cql:null,opacity:0.7, cql:'DTA_DT=\''+odorSpreadStartDate+odorSpreadStartTime+'\'', zIndex:4}];
				odorSpreadLayer = _CoreMap.createTileLayer(layerInfos)[0];
				_MapEventBus.trigger(_MapEvents.map_addLayer, odorSpreadLayer);
				
				setCurrentDate({date:odorSpreadStartDate, time:odorSpreadStartTime}, 'odorSpreadDate');
				playOdorSpreadLayer();
			}else{
				if(layerNm.indexOf('now') >= 0){
					layerNm = bizLayers.ANALS_POINT_NOW;
				}else{
					layerNm = bizLayers.ANALS_POINT_FORECAST
				}
				
				drawHeatMapLayer(layerNm);
			}
		});
		$('#odorSpreadPrevious').on('click', function(){
			
			var mapType = $('input[name="odorSpreadMapType"]:checked').val();
			
			if(odorSpreadInterval){
				clearInterval(odorSpreadInterval);
				odorSpreadInterval = null;
			}
			
			odorSpreadIndex--;
			
			if(odorSpreadIndex < 0){
				odorSpreadIndex = 0;
			}
			
			if(mapType == 'cell'){
				if(odorSpreadLayer){
					updateLayer(odorSpreadLayer, odorSpreadTimeSeries[odorSpreadIndex]);
					setCurrentDate(odorSpreadTimeSeries[odorSpreadIndex], 'odorSpreadDate');
				}
			}else{
				var layerNm = $('a[name="odorSpreadLayerType"][class="on"]').attr('value');
				if(layerNm.indexOf('now') >= 0){
					layerNm = bizLayers.ANALS_POINT_NOW;
				}else{
					layerNm = bizLayers.ANALS_POINT_FORECAST
				}
				
				if(odorSpreadHeatMapLayer){
					_MapEventBus.trigger(_MapEvents.map_removeLayer, odorSpreadHeatMapLayer);
					odorSpreadHeatMapLayer = null;
				}
				drawHeatMapLayer(layerNm);
			}
		});
		$('#odorSpreadNext').on('click', function(){
			
			var mapType = $('input[name="odorSpreadMapType"]:checked').val();
			
			if(odorSpreadInterval){
				clearInterval(odorSpreadInterval);
				odorSpreadInterval = null;
			}
			
			odorSpreadIndex++;
			
			if(odorSpreadTimeSeries.length <= (odorSpreadIndex+1)){
				odorSpreadIndex = odorSpreadTimeSeries.length-1;
			}
			
			if(mapType == 'cell'){
				if(odorSpreadLayer){
					updateLayer(odorSpreadLayer, odorSpreadTimeSeries[odorSpreadIndex]);
					setCurrentDate(odorSpreadTimeSeries[odorSpreadIndex], 'odorSpreadDate');
				}
			}else{
				var layerNm = $('a[name="odorSpreadLayerType"][class="on"]').attr('value');
				if(layerNm.indexOf('now') >= 0){
					layerNm = bizLayers.ANALS_POINT_NOW;
				}else{
					layerNm = bizLayers.ANALS_POINT_FORECAST
				}
				
				if(odorSpreadHeatMapLayer){
					_MapEventBus.trigger(_MapEvents.map_removeLayer, odorSpreadHeatMapLayer);
					odorSpreadHeatMapLayer = null;
				}
				
				drawHeatMapLayer(layerNm);
			}
		}); 
		$('a[name="odorSpreadLayerType"]').on('click', function(){
			$('a[name="odorSpreadLayerType"]').removeClass('on');
			$(this).addClass('on');
			var layerNm = $('a[name="odorSpreadLayerType"][class="on"]').attr('value');
			
			var toDay  = new Date();
			// 실시간
			if(layerNm == 'anals_area_now'){
				$('#odorSpreadStartDate').datepicker('setDate', toDay);
				$('#odorSpreadEndDate').datepicker('setDate', toDay);
				
				$('#odorSpreadStartDate').datepicker( "option", "minDate", null );
				$('#odorSpreadEndDate').datepicker( "option", "minDate", null );
				
				$('#odorSpreadStartDate').datepicker( "option", "maxDate", toDay );
				$('#odorSpreadEndDate').datepicker( "option", "maxDate", toDay );
			}else{ // 예보
				
				$('#odorSpreadStartDate').datepicker('setDate', toDay);
				$('#odorSpreadEndDate').datepicker('setDate', toDay);
				
				$('#odorSpreadStartDate').datepicker( "option", "maxDate", null );
				$('#odorSpreadEndDate').datepicker( "option", "maxDate", null );
			
				$('#odorSpreadStartDate').datepicker( "option", "minDate", toDay );
				$('#odorSpreadEndDate').datepicker( "option", "minDate", toDay );
			}
			
			if(odorSpreadLayer){
				_MapEventBus.trigger(_MapEvents.map_removeLayer, odorSpreadLayer);
				odorSpreadLayer = null;
				
				clearInterval(odorSpreadInterval);
				odorSpreadInterval = null;
			}
			if(odorSpreadHeatMapLayer){
				_MapEventBus.trigger(_MapEvents.map_removeLayer, odorSpreadHeatMapLayer);
				odorSpreadHeatMapLayer = null;
			}
		})
		$('input[name="odorSpreadMapType"]').on('click', function(){
			var mapType = $('input[name="odorSpreadMapType"]:checked').val();
			var layerNm = $('a[name="odorSpreadLayerType"][class="on"]').attr('value');
			
			// 격자
			if(mapType == 'cell'){
				if(odorSpreadHeatMapLayer){
					_MapEventBus.trigger(_MapEvents.map_removeLayer, odorSpreadHeatMapLayer);
					odorSpreadHeatMapLayer = null;
				}
				if(odorSpreadLayer){
					odorSpreadLayer.setVisible(true);
					updateLayer(odorSpreadLayer, odorSpreadTimeSeries[odorSpreadIndex]);
				}else{
					var layerInfos = [{layerNm:layerNm,style:null,isVisible:true,isTiled:true,cql:null,opacity:0.7, cql:'DTA_DT=\''+odorSpreadTimeSeries[odorSpreadIndex].date+odorSpreadTimeSeries[odorSpreadIndex].time+'\'', zIndex:4}];
					odorSpreadLayer = _CoreMap.createTileLayer(layerInfos)[0];
					_MapEventBus.trigger(_MapEvents.map_addLayer, odorSpreadLayer);
				}
			}else{ // 밀도
				if(odorSpreadLayer){
					odorSpreadLayer.setVisible(false);
				}
				if(layerNm.indexOf('now') >= 0){
					layerNm = bizLayers.ANALS_POINT_NOW;
				}else{
					layerNm = bizLayers.ANALS_POINT_FORECAST
				}
				
				if(odorSpreadHeatMapLayer){
					_MapEventBus.trigger(_MapEvents.map_removeLayer, odorSpreadHeatMapLayer);
					odorSpreadHeatMapLayer = null;
					
					drawHeatMapLayer(layerNm);
				}else{
					drawHeatMapLayer(layerNm);
				}
			}
		});
		// 악취 이동경로
		$('#odorMovementPlay').on('click', function(){
			
			var layerNm = $('a[name="odorMovementType"][class="on"]').attr('value');
			
			var odorMovementStartDate = $('#odorMovementStartDate').val().replace(regExp, '');
			var odorMovementStartTime = $('#odorMovementStartTime').val();
			
			var odorMovementItem = $('#odorMovementItem').val();
			
			if(trackingInterval){
				clearInterval(trackingInterval);
				trackingInterval = null;
			}
			if(odorMovementLayer){
				_MapEventBus.trigger(_MapEvents.map_removeLayer, odorMovementLayer);
				_MapEventBus.trigger(_MapEvents.map_removeLayer, originLayer);
				odorMovementLayer = null;
				originLayer = null;
			}
			
			var params = {"type":layerNm, "analsAreaId":odorMovementItem, "dtaDt":odorMovementStartDate+odorMovementStartTime};
			$.ajax({
	            url: '/getCoursModel.do',
	            data:JSON.stringify(params)
	        }).done(function(result){
	        	if(result == null || result.length <= 0){
					alert('모델링 데이터가 없습니다.');
					return;
				}
	        	trackingFeatures = [];
				
				for(var i=0; i<result.length; i++){
					var coord = ol.proj.transform([parseInt(result[i].utmx), parseInt(result[i].utmy)], 'EPSG:32652', 'EPSG:3857');
					if(i>0){
						if(parseInt(result[i].utmx) ==parseInt(result[i-1].utmx) && parseInt(result[i].utmy) == parseInt(result[i-1].utmy)){
							continue;
						}
					}
					var feature = new ol.Feature({geometry:new ol.geom.Point(coord), properties:result[i]});
//					feature.setId(result.features[i].id);
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
		
		var preOdorType = 'cours_now';
		
		$('a[name="odorMovementType"]').on('click', function(){
			$('a[name="odorMovementType"]').removeClass('on');
			$(this).addClass('on');
			
			var layerNm = $('a[name="odorMovementType"][class="on"]').attr('value');
			var toDay = new Date();
			
			if(layerNm == 'cours_now' || layerNm == 'cours_sensor'){
				$('#odorMovementStartDate').datepicker( "option", "maxDate", toDay );
				$('#odorMovementStartDate').datepicker( "option", "minDate", null );
			}else{
				$('#odorMovementStartDate').datepicker( "option", "minDate", toDay );
				$('#odorMovementStartDate').datepicker( "option", "maxDate", null );
			}
			if(preOdorType == layerNm ){
				return;
			}
			
			if(layerNm == 'cours_sensor'){
				setSensorCombo();
			}else{
				setIntrstCombo();
			}
			preOdorType = layerNm;
		}); 
		
		$('#odorMovementNext').on('click', function(){
			if(odorMovementLayer){
				clearInterval(trackingInterval);
				trackingInterval = null;
				trackingIntervalTime = 100;
				tracking();
			}
		});
		
		$('#odorMovementBufferBtn').on('click', function(){
			if(originLayer){
				_MapEventBus.trigger(_MapEvents.map_removeLayer, originLayer);
				originLayer = null;
			}
			
			if(trackingFeatures == null || trackingFeatures.length <= 0){
				return;
			}
			_MapService.getWfs(':BPLC', '*','1=1', null).then(function(result){
				
				var parser = new jsts.io.OL3Parser();
				
				var linePathCoord = []
				var bufferFeatures = [];
				
				for(var i=0; i<trackingFeatures.length; i++){
					var bufferFeature = trackingFeatures[i].clone();
					linePathCoord.push(bufferFeature.getGeometry().getCoordinates());
				}
				
				var lineFeature = new ol.Feature({geometry:new ol.geom.LineString(linePathCoord), properties:null});
				var jstsGeom = parser.read(lineFeature.getGeometry());
				var buffered = jstsGeom.buffer(100);
				var bufferedGeometry = parser.write(buffered);

				var interFeatures = [];
				var gridData = [];
				
				for(var i=0; i<result.features.length; i++){
					var bplcFeature = new ol.Feature({geometry:new ol.geom.Polygon(result.features[i].geometry.coordinates), properties:result.features[i].properties});
					var target = parser.read(bplcFeature.getGeometry())
					var interFeature = buffered.intersection(target);
					var interGeometry = parser.write(interFeature);
					if(interGeometry.getCoordinates()[0].length > 0){
						interFeatures.push(bplcFeature);
						gridData.push(result.features[i].properties);
					}
				}
				
				if(interFeatures.length <= 0){
					alert('오염원점이 없습니다.');
					return;
				}
				
				var source = new ol.source.Vector();
				source.addFeatures(interFeatures);
				originLayer = new ol.layer.Vector({
					source: source,
					zIndex:1000,
					name:'originLayer',
					style: bufferVectorStyle
				});
				_MapEventBus.trigger(_MapEvents.map_addLayer, originLayer);
			});
		});
		
		
		$('.legendButton').click(function(){
			_WestCondition.legendLayerOnOff(this);
		});
		
	};
	
	var drawHeatMapLayer = function(layerNm){
		odorSpreadHeatMapLayer = new ol.layer.Heatmap({
			name:'odorSpreadHeatMapLayer',
			source:new ol.source.Vector({
			url: _MapServiceInfo.serviceUrl +'/geoserver/CE-TECH/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=CE-TECH:'+layerNm+'&maxFeatures=5000&outputFormat=application/json&CQL_FILTER=DTA_DT=\''+odorSpreadTimeSeries[odorSpreadIndex].date+odorSpreadTimeSeries[odorSpreadIndex].time+'\'',
			format: new ol.format.GeoJSON({
				featureProjection:'EPSG:3857'
				})
			}),
			blur: parseInt(45, 10),
			radius: parseInt(45, 10),
			zIndex: 3000
		});
 
		odorSpreadHeatMapLayer.getSource().on('addfeature', function(event) {
			var val = event.feature.get('BSML_DNSTY');
			
			var coVal = String(event.feature.get('BSML_DNSTY')).split('.');
			var targetVal = String(event.feature.get('BSML_DNSTY')).replace('.','');
			var preFixCnt = coVal[0].length;
			var preFix = '00';
			
			for(var i=0; i<preFixCnt;i++){
				preFix = preFix.substring(0, preFix.length-1);
			}
			
			var sum = parseFloat('0.'+preFix+targetVal);
	        event.feature.set('weight', sum);
		});

		_MapEventBus.trigger(_MapEvents.map_addLayer, odorSpreadHeatMapLayer);
	}
	var writeGrid = function(id, gridData){
		$('#gridArea').show();
    	var tabTitle = $('#tab_title');
    	var tabContent = $('#tab_content');
    	var tabTemplate = '<li><a id=#{id} href="#{href}" style="cursor: pointer;">#{label}</a> <span class="ui-icon ui-icon-close" role="presentation" style="cursor: pointer; background: url(../images/btn_close2.png) 2px 4px no-repeat; background-size: 8px;">Remove Tab</span></li>';
    	var tabs = $('#tabs').tabs();
    	
    	tabs.off('click').on('click','span.ui-icon-close', function() {
    		var panelId = $( this ).closest('li').remove().attr('aria-controls');
    		$('#' + panelId ).remove();
    		tabs.tabs('refresh');
    		
    		if($('ul[role="tablist"]').find('li').length==0){
    			$('#gridArea').hide();
    		}
    	});
    	var tabId = 'tabs-' + id;
    	var li = $(tabTemplate.replace(/#\{id\}/g,tabId).replace(/#\{href\}/g, '#grid'+id).replace(/#\{label\}/g,'악취원점'));
    	
    	if($('#'+tabId).length == 0){
    		tabs.find('.ui-tabs-nav').append( li );
        	tabs.append('<div id="grid' + id + '" style="padding: 10px 3px !important;"></div>');
    	}
    	
    	tabs.tabs('refresh');

    	tabs.tabs({
    		active:$('ul[role="tablist"]').find('li').index($('#' + tabId).parent())
    	});
    	
    	$('#grid' + id).jsGrid({
    		width: '1300px',
    		height: '170px',

    		inserting: false,
    		editing: false,
    		sorting: true,
    		paging: false,	
    		noDataContent: '데이터가 없습니다.',
    		data: gridData,
    		fields: [{name:'BPLC_ID',title:'악취원점ID'},
//		             {name:'BSML_TRGNP    ',title:''},
		             {name:'BSML_TRGNPT_NM',title:'시설구분'},
		             {name:'CMPNY_NM',title:'시설명'},
		             {name:'TELNO',title:'전화번호'}],
    		rowClick:function(data){
    		}
    	});
	}
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
				trackingIdx--;
			}
		}, trackingIntervalTime); 
	}

	var playWeatherAnalysisLayer = function(){
		weatherAnalysisInterval = setInterval(function(){
			weatherAnalysisIndex++;
			
			if(weatherAnalysisTimeSeries[weatherAnalysisIndex]){
				updateLayer(weatherAnalysisLayer, weatherAnalysisTimeSeries[weatherAnalysisIndex]);
				setCurrentDate(weatherAnalysisTimeSeries[weatherAnalysisIndex], 'weatherAnalysisDate');	
			}else{
				weatherAnalysisIndex--;
				clearInterval(weatherAnalysisInterval);
				return;
			}
		}, 1000 * 5);
	};
	
	var playOdorSpreadLayer = function(){
		odorSpreadInterval = setInterval(function(){
			odorSpreadIndex++;
			
			if(odorSpreadTimeSeries[odorSpreadIndex]){
				updateLayer(odorSpreadLayer, odorSpreadTimeSeries[odorSpreadIndex]);
				setCurrentDate(odorSpreadTimeSeries[odorSpreadIndex], 'odorSpreadDate');	
			}else{
				odorSpreadIndex--;
				clearInterval(odorSpreadInterval);
				return;
			}
		}, 1000 * 5);
	};
	var updateLayer = function(layer, param){
		var source = layer.getSource();
		source.updateParams({
				LAYERS: param.layer,
				'FORMAT': 'image/png', 
				'VERSION': '1.1.0',
				tiled: true,
				STYLES:param.style,
				CQL_FILTER:'DTA_DT=\''+param.date+param.time+'\''
		});
	} 
	
	var setTimeSeries = function(sdate, edate, stime, etime, layerNm, styleNm){
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
			var timeSeries = {date : y+''+(m<10?'0'+m:m)+''+(d<10?'0'+d:d), time:(stime<10?'0'+stime:stime+''), layer:layerNm, style:styleNm};
			if(stime > 23){
				stime = 1;
				tdate.setDate(d + 1);
				continue;
			}else{
				stime++;
			}
			timeSeriesArr.push(timeSeries);
		}
		return timeSeriesArr;
	}
	var setCurrentDate = function(param, targetId){
		$('#'+targetId).val(param.date.substring(0,4)+'.'+param.date.substring(4,6)+'.'+param.date.substring(6,8)+'일  '+param.time+'시');
	}
	var bufferVectorStyle = function(){
		return new ol.style.Style({
	          stroke: new ol.style.Stroke({
	            color: 'red',
	            width: 3
	          }),
	          fill: new ol.style.Fill({
	            color: 'rgba(255, 255, 0, 0.1)'
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
	var pointStyle = function(feature){
		var label = feature.getProperties().properties.sn;
		 
		return new ol.style.Style({
	        image: new ol.style.Icon({
	        	opacity: 1.0,
	            src: '/map/resources/images/icon/c1.png'
	        })
//		, 
//	        text: trackingTextStyle(label)
		});
	}
	var trackingTextStyle = function(label) {
		var align = 'center';
		var baseline = 'top';
		var size = '14px';
		var offsetX = 0;
		var offsetY = 10;
		var weight = 'bold';
		var placement = 'point';
		var maxAngle = undefined;
		var exceedLength = undefined;
		var rotation = 0.0;
		var font = weight + ' ' + size + ' Arial';
		var fillColor = '#000000';
		var outlineColor = '#ffffff';
		var outlineWidth = 3;

		return new ol.style.Text({
			textAlign : align == '' ? undefined : align,
			textBaseline : baseline,
			font : font,
			text : label,
			fill : new ol.style.Fill({
				color : fillColor
			}),
			stroke : new ol.style.Stroke({
				color : outlineColor,
				width : outlineWidth
			}),
			offsetX : offsetX,
			offsetY : offsetY,
			placement : placement,
			maxAngle : maxAngle,
			exceedLength : exceedLength,
			rotation : rotation
		});
	};
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
        },
        getwmsSelectTestLayer: function(){
        	return wmsSelectTestLayer;
        }
    };
}();

