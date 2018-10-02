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
	
	var bizLayers = {'CELL9KM' : 'CELL_AIR_9KM',
					 'ALL9KM' : 'ALL_CMAQ_9KM',
			         'LINE' : 'line_test_wgs84',
			         'POINT' : 'CELL_AIR_9KM_PT'};
	
	// 특수문자 제거 정규표현식
	var regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
	
	var wmsSelectTestLayer;
	var highlightVectorLayer;
	var popupOverlay;
	
	var bufferVectorLayer;
	var bufferFeatureLayer;
	
	var noCacheCount = 0;
	
	var pointTestFeatures;
	var selectFeatureLayer;
	var pointBufferVectorLayer;
	var pointBufferFeatureLayer;
	
	var init = function(){
		
		setEvent();
		
//		drawCell();
		
		setPopupOverlay();
//		drawBufferLayer();
		
		getPoints();
	}
	
	var getPoints = function(){
		_MapService.getWfs();
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
		var layerInfos = [{layerNm:'CE-TECH:'+bizLayers.CELL9KM,style:'',isVisible:true,isTiled:true,opacity:0.7, cql:'RESULT_DT=\'2018062501\' AND FLAG=0', zIndex:10}];
		wmsSelectTestLayer = _CoreMap.createTileLayer(layerInfos)[0];
		
		_MapEventBus.trigger(_MapEvents.map_addLayer, wmsSelectTestLayer);
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
		
		_MapEventBus.on(_MapEvents.map_singleclick, function(event, data){
			
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
	};
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
