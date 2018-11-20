var _AreaMapBiz = function () {
	
	var bizUrl = window.location.protocol+'//'+window.location.host;
	var bizLayers = {'CELL9KM' : 'shp_anals_area_new'};
	
	// 특수문자 제거 정규표현식
	var regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
	
	var cellLayer;
	var highlightVectorLayer;
	
	var sensorLayer;
	
	var popupOverlay;
	
	var editMode = false;
	
	var sensorEditMode = false;
	
	var selectedSpotCode;
	
	var init = function(){
		proj4.defs('EPSG:32652','+proj=utm +zone=52 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ');
		proj4.defs('EPSG:5179','+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs');
		
		ol.proj.proj4.register(proj4);
			
		setEvent();
		
		setPopupOverlay();
		
		drawSensorLayer();
		
	}
	var drawSensorLayer = function(){
		if(sensorLayer){
			_MapEventBus.trigger(_MapEvents.map_removeLayer, sensorLayer);
			sensorLayer = null;
		}
		$.ajax({
            url: '/getSensorList.do'
        }).done(function(result){
        	var sensorFeatures = [];
        	
        	for(var i=0; i<result.length; i++){
				var coord = ol.proj.transform([parseFloat(result[i].longitude), parseFloat(result[i].latitude)], 'EPSG:4326', 'EPSG:3857');
				var feature = new ol.Feature({geometry:new ol.geom.Point(coord), properties:result[i]});
				sensorFeatures.push(feature);
			}
			
        	sensorLayer = new ol.layer.Vector({
				source : new ol.source.Vector({
					features : sensorFeatures
				}),
				style : sensorPointStyle,
				zIndex: 3000,
				id:'sensorLayer'
			});
			
			_MapEventBus.trigger(_MapEvents.map_addLayer, sensorLayer);
        });	
	}
	
	var drawCell = function(){
		var layerInfos = [{layerNm:'CE-TECH:'+bizLayers.CELL9KM,style:'',isVisible:true,isTiled:true,opacity:0.7, cql:'1=1', zIndex:10}];
		cellLayer = _CoreMap.createTileLayer(layerInfos)[0];
		
		_MapEventBus.trigger(_MapEvents.map_addLayer, cellLayer);
	}
	
	
	var setPopupOverlay = function(){
		popupOverlay = new ol.Overlay({
	    	element: document.getElementById('popupOverlay')
	    });
		_CoreMap.getMap().addOverlay(popupOverlay);
	}
	
	var setEvent = function(){
		
		$('#editMoveBtn').on('click', function(){
			if(editMode){
				$(this).css('background-color', '#494949');
				$('#cellRemeveBtn').hide();
				$('#sensorMoveBtn').hide();
			}else{
				$(this).css('background-color', '#4286f4');
				$('#cellRemeveBtn').show();
				$('#sensorMoveBtn').show();
			}
			editMode = !editMode;
		});
		$('input[name="mapType"]').on('click', function(){
			
			var mapType = $('input[name="mapType"]:checked').val();
			
			$('#popup-closer').trigger('click');
			 
			if(mapType == 'sensor'){
				if(cellLayer){
					_MapEventBus.trigger(_MapEvents.map_removeLayer, cellLayer);
					cellLayer = null;
					
					if(highlightVectorLayer){
						_MapEventBus.trigger(_MapEvents.map_removeLayer, highlightVectorLayer);
						highlightVectorLayer = null;
					}
				}
				
				if(sensorLayer){
					_MapEventBus.trigger(_MapEvents.map_removeLayer, sensorLayer);
					sensorLayer = null;
				}
				
				drawSensorLayer();
			}else{
				if(sensorLayer){
					_MapEventBus.trigger(_MapEvents.map_removeLayer, sensorLayer);
					sensorLayer = null;
				}
				
				if(cellLayer){
					_MapEventBus.trigger(_MapEvents.map_removeLayer, cellLayer);
					cellLayer = null;
					
					if(highlightVectorLayer){
						_MapEventBus.trigger(_MapEvents.map_removeLayer, highlightVectorLayer);
						highlightVectorLayer = null;
					}
				}	
				
				drawCell();
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
			    		
			    		var wmsSource = cellLayer.getSource();
			    		wmsSource.updateParams({"time":Date.now()});
			    		
			    		$('#popup-closer').trigger('click');
			    	});
				}else{
					$.ajax({
			            url : bizUrl+'/deleteAnals.do?indexId='+indexId,
			            type : 'GET',
			            contentType : 'application/json'
			    	}).done(function(result){
			    		
			    		var wmsSource = cellLayer.getSource();
			    		wmsSource.updateParams({"time":Date.now()});
			    		
			    		$('#popup-closer').trigger('click');
			    	});
				}
			}
		});
		
		$('#sensorMoveBtn').on('click', function(){
			selectedSpotCode = $(this).attr('spotCode');
			alert('변경 할 위치를 지도에 클릭하세요.');
			$('#popupOverlay').hide();
			$('#popup-content').hide();
			sensorEditMode = true;
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
			
			var feature = _CoreMap.getMap().forEachFeatureAtPixel(data.result.pixel,function(feature, layer){
				return feature;
			});
			
			if(!feature && sensorEditMode){
				sensorEditMode = false;
				if(selectedSpotCode == null){
					return; 
				}
				var coord = ol.proj.transform([data.result.coordinate[0], data.result.coordinate[1]], 'EPSG:3857', 'EPSG:4326');
				$.ajax({
		            url : bizUrl+'/updateSensor.do',
		            data:JSON.stringify({spotCode:selectedSpotCode, la:coord[1], lo:coord[0]})
		    	}).done(function(result){
		    		selectedSpotCode = null;
		    		drawSensorLayer();
		    	});
				
				return;
			}
			if(cellLayer){
				cellLayer.setOpacity(0.0);
				
				var wmsSource = cellLayer.getSource();
				var view = _CoreMap.getMap().getView();
				var viewResolution = /** @type {number} */ (view.getResolution());
				var viewProjection = view.getProjection();
				  
				var url = wmsSource.getGetFeatureInfoUrl( data.result.coordinate, viewResolution, viewProjection, {'INFO_FORMAT': 'application/json'});
				if (url) {
					$.getJSON(url, function(result){
						setTimeout(function(){cellLayer.setOpacity(0.7);}, 10);
						
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
							$.ajax({url: '/getArea.do', data: JSON.stringify({"analsAreaId": result.features[0].properties.ANALS_AREA_ID }) }).done(function(data){
								
								if(data.length > 0){
									$('#popupOverlay').show();
									$('#popup-content').show();
//									$('#popupOverlay').css('width', '300px');
									$('#popupOverlay').css('height', '160px');
									$('#cellReg').show();
									$('#sensorMove').hide();
									
									$('#cellRemeveBtn').attr('indexId', data[0].ANALS_AREA_ID);
									$('#cellRemeveBtn').attr('reg', result.features[0].properties.REG);
									if(result.features[0].properties.REG == "1"){
										$('#cellRemeveBtn').html('해제');
									}else{
										$('#cellRemeveBtn').html('추가');
									}
									if(editMode){
										$('#cellRemeveBtn').show();
									}else{
										$('#cellRemeveBtn').hide();
									}
									
									$('#intrstAreaNm').val(data[0].INTRST_AREA_NM);
									$('#tpgrphAl').val(data[0].TPGRPH_AL);
									$('#predictAl').val(data[0].PREDICT_AL);
								}
							});
						}
					});
				}
			}
			
			if(sensorLayer && feature){
				var geometry = feature.getGeometry();
				var featureExtent = geometry.getExtent();
				var featureCenter = ol.extent.getCenter(featureExtent);
				
				if(popupOverlay){
					popupOverlay.setPosition(featureCenter);
					$('#popupOverlay').show();
					$('#popup-content').show();
					$('#cellReg').hide();
					$('#sensorMove').show();
					
					$('#sensorNm').html(feature.getProperties().properties.sensorNm);
//					$('#popupOverlay').css('width', '180px');
					$('#popupOverlay').css('height', '90px');
					$('#sensorMoveBtn').attr('spotCode',feature.getProperties().properties.spotCode);
					
					if(editMode){
						$('#sensorMoveBtn').show();
					}else{
						$('#sensorMoveBtn').hide();
					}
				}
			} 
		});
		_MapEventBus.on(_MapEvents.map_mousemove, function(event, data){
			var coreMap = _CoreMap.getMap();
			var pixel = coreMap.getEventPixel(data.result.originalEvent);
			var hit = coreMap.forEachFeatureAtPixel(pixel, function(feature, layer) {
				if(feature){
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
			
			var mapType = $('input[name="mapType"]:checked').val();
			if(mapType == 'cell'){
				coreMap.getViewport().style.cursor = 'pointer';
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
	            color: 'rgba(255, 255, 0, 0.0)'
	          })
	        })
	};
	var sensorPointStyle = function(feature){
    	var style = new ol.style.Style({
			image: new ol.style.Icon(({
		          src: '/images/sensor.png',
		          anchor: [0.5,0.5] 
		        }))
  		});
    	
    	return style;
    };
	
    // public functions
    return {
    	  
        init: function () {
        	var me = this;
        	init();
        	return me;
        }
    };
}();

