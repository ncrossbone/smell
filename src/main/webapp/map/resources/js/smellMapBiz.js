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
			         'LINE' : 'line_test_wgs84',
			         'POINT' : 'CELL_AIR_9KM_PT'};
	
	// 특수문자 제거 정규표현식
	var regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
	
	var wmsSelectTestLayer;
	var highlightVectorLayer;
	var popupOverlay;
	
	var bufferVectorLayer;
	
	var init = function(){
		
		setEvent();
		
		drawCell();
		
		setPopupOverlay();
		drawBufferLayer();
	}
	
	var drawCell = function(){
		var layerInfos = [{layerNm:'CE-TECH:'+bizLayers.CELL9KM,style:'',isVisible:true,isTiled:true,opacity:0.7, cql:'RESULT_DT=\'2018062501\'', zIndex:10}];
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
			
			var source = new ol.source.Vector();
			var format = new ol.format.GeoJSON();
			var parser = new jsts.io.OL3Parser();
			for (var i = 0; i < bufferFeatures.length; i++) {
				var feature = bufferFeatures[i];
				var jstsGeom = parser.read(feature.getGeometry());
				var buffered = jstsGeom.buffer(1000);
				feature.setGeometry(parser.write(buffered));
			}
			source.addFeatures(bufferFeatures);
			var vectorLayer = new ol.layer.Vector({
				source: source,
				zIndex:1000
			});
		        
			_MapEventBus.trigger(_MapEvents.map_addLayer, bufferVectorLayer);
			_MapEventBus.trigger(_MapEvents.map_addLayer, vectorLayer);
				
		});
	}
	
	var setPopupOverlay = function(){
		popupOverlay = new ol.Overlay({
	    	element: document.getElementById('popupOverlay')
	    });
		_CoreMap.getMap().addOverlay(popupOverlay);
	}
	
	var setEvent = function(){
		$('#cellRemeveBtn').on('click', function(){
			alert('격자해제');	
			if(highlightVectorLayer){
				
				console.log(highlightVectorLayer);
				debugger;
				
				var formatWFS = new ol.format.WFS();
	
				var formatGML = new ol.format.GML({
				    featureNS: 'http://112.218.1.243:44002/geoserver',
				    featureType: 'wfs_geom',
				    srsName: 'EPSG:3857'
				});
	
				var source = highlightVectorLayer.getSource();
				var feature = source.getFeatures()[0];
				
				var prop = feature.getProperties();
				
				var xs = new XMLSerializer();
				
				var dirty = {};
			    var node = formatWFS.writeTransaction(null, [feature], null, formatGML);
		    
//		    switch (mode) {
//		        case 'insert':
//		            node = formatWFS.writeTransaction([f], null, null, formatGML);
//		            break;
//		        case 'update':
//		        	node = formatWFS.writeTransaction(null, [f], null, formatGML);
//		            break;
//		        case 'delete':
//		            node = formatWFS.writeTransaction(null, null, [f], formatGML);
//		            break;
//		    }
			    var payload = xs.serializeToString(node);
			    $.ajax('http://112.218.1.243:44002/geoserver/ows', {
			        type: 'POST',
			        dataType: 'xml',
			        processData: false,
			        contentType: 'text/xml',
			        data: payload
			    }).done(function() {
			    	console.log(arguments);
			   
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
			var wmsSource = wmsSelectTestLayer.getSource();
			var view = _CoreMap.getMap().getView();
			
			  var viewResolution = /** @type {number} */ (view.getResolution());
			  var viewProjection = view.getProjection();
			  
			  var url = wmsSource.getGetFeatureInfoUrl( data.result.coordinate, viewResolution, viewProjection, {'INFO_FORMAT': 'application/json'});
			  if (url) {
				  $.getJSON(url, function(result){
					  if(highlightVectorLayer){
						  _MapEventBus.trigger(_MapEvents.map_removeLayer, highlightVectorLayer);
						  highlightVectorLayer = null;
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
					  }
				  });
			  }
		});
	};
	var highlightVectorStyle = function(){
		return new ol.style.Style({
	          stroke: new ol.style.Stroke({
	            color: 'red',
	            width: 2
	          }),
	          fill: new ol.style.Fill({
	            color: 'rgba(255, 255, 0, 0.8)'
	          })
	        })
	}
	var highlightVectorStyle = function(){
		return new ol.style.Style({
	          stroke: new ol.style.Stroke({
	            color: 'red',
	            width: 2
	          }),
	          fill: new ol.style.Fill({
	            color: 'rgba(255, 255, 0, 0.8)'
	          })
	        })
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
