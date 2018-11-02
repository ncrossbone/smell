var _ETRI = function () {
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
	// 특수문자 제거 정규표현식
	var regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
	
	var wmsGridLayer;
	var wmsChloroLayer;
	var wmsSatelliteLayer;
	
	// 경로용
	var pointTestFeatures;
	var wfsPointLayer;
	var pointInterval;
	
	var init = function(){
		
		setEvent();
		
//		drawTifLayer();
//		drawChloroLayer();
//		drawGridLayer();
//		drawPointLayer();
		
		getPoints();
		
		setPopupOverlay();
	}
	
	var getPoints = function(){
		_MapService.getWfs(':Point', '*','1=1', 'date').then(function(result){
			if(result == null || result.features.length <= 0){
				return;
			}
			pointTestFeatures = [];
			for(var i=0; i<result.features.length; i++){
				
				var feature = new ol.Feature({geometry:new ol.geom.Point(result.features[i].geometry.coordinates), properties:result.features[i].properties});
				feature.setId(result.features[i].id);
				pointTestFeatures.push(feature);
			}
		});
	}
	
	
	var drawGridLayer = function(){
		var layerInfos = [{layerNm:'CE-TECH:ceo',style:'',isVisible:true,isTiled:true,opacity:0.5, cql:'1=1', zIndex:10}];
		wmsGridLayer = _CoreMap.createTileLayer(layerInfos)[0];
		
		_MapEventBus.trigger(_MapEvents.map_addLayer, wmsGridLayer);
	}
//	var drawPointLayer = function(){
//		var layerInfos = [{layerNm:'CE-TECH:Point',style:'',isVisible:true,isTiled:true,opacity:1.0, cql:'1=1', zIndex:14}];
//		wmsSelectTestLayer = _CoreMap.createTileLayer(layerInfos)[0];
//		
//		_MapEventBus.trigger(_MapEvents.map_addLayer, wmsSelectTestLayer);
//	}
	var drawSatelliteLayer = function(){
		var layerInfos = [{layerNm:'CE-TECH:geotiff_coverage',style:'',isVisible:true,isTiled:true,opacity:0.7, cql:'1=1', zIndex:9}];
		wmsSatelliteLayer = _CoreMap.createTileLayer(layerInfos)[0];
		
		_MapEventBus.trigger(_MapEvents.map_addLayer, wmsSatelliteLayer);
	}
	var drawChloroLayer = function(){
		var layerInfos = [{layerNm:'CE-TECH:chloro',style:'',isVisible:true,isTiled:true,opacity:0.5, cql:'1=1', zIndex:11}];
		wmsChloroLayer = _CoreMap.createTileLayer(layerInfos)[0];
		
		_MapEventBus.trigger(_MapEvents.map_addLayer, wmsChloroLayer);
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
			if(!wmsSatelliteLayer){
				drawSatelliteLayer();
				$(this).addClass('on');
			}else{
				_MapEventBus.trigger(_MapEvents.map_removeLayer, wmsSatelliteLayer);
				wmsSatelliteLayer = null;
				$(this).removeClass('on');
			}
		});
		
		$('#testBtn2').on('click', function(){
			if(!wmsChloroLayer){
				drawChloroLayer();
				$(this).addClass('on');
			}else{
				_MapEventBus.trigger(_MapEvents.map_removeLayer, wmsChloroLayer);
				wmsChloroLayer = null;
				$(this).removeClass('on');
			}
		});
		$('#testBtn3').on('click', function(){
			if(!wmsGridLayer){
				drawGridLayer();
				$(this).addClass('on');
			}else{
				_MapEventBus.trigger(_MapEvents.map_removeLayer, wmsGridLayer);
				wmsGridLayer = null;
				$(this).removeClass('on');
			}
		});
		$('#testBtn4').on('click', function(){
			var idx = 0;
			
			if(!wfsPointLayer){
				$(this).addClass('on');
				
				pointInterval = setInterval(function(){
					
					var feature = pointTestFeatures[idx];
					
					idx++;
					
					if(feature == null){
						clearInterval(pointInterval);
						return;
					}
					
					var source;
					
					if(wfsPointLayer){
						source = wfsPointLayer.getSource();
						source.addFeatures([feature]);
					}else{
						var source = new ol.source.Vector();
						source.addFeatures([feature]);
						wfsPointLayer = new ol.layer.Vector({
							source: source,
							zIndex:1000,
							name:'wfsPointLayer',
							style: trackingStyleFunction
						});
						_MapEventBus.trigger(_MapEvents.map_addLayer, wfsPointLayer);
					}
					
				}, 1000);
			}else{
				_MapEventBus.trigger(_MapEvents.map_removeLayer, wfsPointLayer);
				wfsPointLayer = null;
				$(this).removeClass('on');
				if(pointInterval){
					clearInterval(pointInterval);
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
	var trackingStyleFunction = function(feature, resolution) {
		
		var properties = feature.getProperties().properties;
		if(parseInt(properties.value) >= 40){
			return new ol.style.Style({
				image : new ol.style.Icon({
					opacity: 1.0,
					 src: '/map/resources/images/icon/c1.png'
				}),
				text : trackingTextStyle(feature, resolution)
			});	
		}else if(parseInt(properties.value) >= 30){
			return new ol.style.Style({
				image : new ol.style.Icon({
					opacity: 1.0,
					src: '/map/resources/images/icon/c13.png'
				}),
				text : trackingTextStyle(feature, resolution)
			});
		}else if(parseInt(properties.value) >= 20){
			return new ol.style.Style({
				image : new ol.style.Icon({
					opacity: 1.0,
					src: '/map/resources/images/icon/c12.png'
				}),
				text : trackingTextStyle(feature, resolution)
			});
		}else if(parseInt(properties.value) >= 10){
			return new ol.style.Style({
				image : new ol.style.Icon({
					opacity: 1.0,
					src: '/map/resources/images/icon/c11.png'
				}),
				text : trackingTextStyle(feature, resolution)
			});
		}else{
			return new ol.style.Style({ 
				image : new ol.style.Icon({
					opacity: 1.0,
					src: '/map/resources/images/icon/c5.png'
				}),
				text : trackingTextStyle(feature, resolution)
			});
		}
	};
	var trackingTextStyle = function(feature, resolution) {
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
			text : trackingText(feature, resolution),
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
	var trackingText = function(feature, resolution){
		var date = feature.getProperties().properties.date;
		var value = feature.getProperties().properties.value;
//		/date.substring(0,4) +'.'+
		var text = date.substring(4,6)+'.'+date.substring(6,8);
		text += '('+parseInt(value)+')';
		
		if(text == null){
			text = '';
		}
		return text;
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
