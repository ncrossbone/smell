var _MapChangeType = true;

var _AdmLayerArray = [];

var _AdmLayerNumber = {
		sido : 5,
		sgg : 6,
		dong : 7
}
var _CoreMap = function() {
	'use strict'
	// private functions & variables
	
	var TAG = '[Air Korea MAP]';
	var vworldAddrUrl = 'http://apis.vworld.kr/coord2jibun.do?x=#X#&y=#Y#&apiKey=7A0635A7-67B9-39CD-96BC-65D901E709B3&domain=http://www.eburin.net&output=json&epsg=EPSG:4326&callback=?';
	var nhnAddrUrl = 'http://openapi.map.naver.com/api/reversegeocode?key=ed361f09f893f6489eed72ec266fa190&encoding=utf-8&coord=latlng&output=json&callback=?&query=#X#,#Y#';

	var DRAG_MODE_NONE = 'NONE';
	
	var coreMap;
	var mapLayers = [];

	var mapDiv;
	
	var format = 'image/png';
	var wmsBaseUrl = '/geoserver/CE-TECH/wms?';
	
	var highlightFeature;

	var mapClickCallback;

	var mapHandleEndCallback

	var completeCallback;

	var featureInfoCallback;

	var featureDragTag = DRAG_MODE_NONE;

	var initParam = {
		worldProjection : 'EPSG:4326',
		targetProjection : 'EPSG:3857',
		layerBbox : [ 50119.84, 967246.47, 2176674.68, 12765761.31 ],
		resoutions : [ 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5 ],
		center : {
			lon : 127.0396037,
			lat : 37.5010226,
			zoom : 13
		}
	};

	var projection = new ol.proj.Projection({
		code : 'EPSG:4326',
		units : 'degrees',
		axisOrientation : 'neu'
	});

	var init = function(){
		
		if (ol.Map.prototype.getLayerForName === undefined) {
			ol.Map.prototype.getLayerForName = function(name) {
				var layer;
				this.getLayers().forEach(function(lyr) {
					if (name == lyr.get('name')) {
						layer = lyr;
					}
				});
				return layer;
			}
		};
		if(ol.Feature.prototype.getLayer === undefined) {
			ol.Feature.prototype.getLayer = function(map) {
			    var this_ = this, layer_, layersToLookFor = [];
			    /**
			     * Populates array layersToLookFor with only
			     * layers that have features
			     */
			    var check = function(layer){
			    	
			        var source = layer.getSource();
			        if(source instanceof ol.source.Vector){
			            var features = source.getFeatures();
			            if(features.length > 0){
			            	layersToLookFor.push({
			                	layer: layer,
			                    features: features
			                });
			            }
			        }
			    };
			    //loop through map layers
			    map.getLayers().forEach(function(layer){
			        if (layer instanceof ol.layer.Group) {
			            layer.getLayers().forEach(check);
			        } else {
						check(layer);
			        }
			    });
			    layersToLookFor.forEach(function(obj){
			    	var found = obj.features.some(function(feature){
			            return this_ === feature;
			        });
			        if(found){
			            //this is the layer we want
			            layer_ = obj.layer;
			        }
			    });
			    return layer_;
			};
		}
	}
	
	var createMap = function(mapDivId) {
		mapDiv = mapDivId;
		var centerPoint = [14189913.25028815, 4401138.987746553];
//		
//		var centerPoint = ol.proj.transform([ initParam.center.lon,
//				initParam.center.lat ], initParam.worldProjection,
//				initParam.targetProjection);
		var zoom = initParam.center.zoom;

		var layerInfos = [];
		mapLayers = [];
		//layerInfos.push({layerNm:'ri_shp',isVisible:false,isTiled:true,cql:null,opacity:0.7});
		
//		mapLayers[0] = new ol.layer.Tile({
//        	source: new ol.source.OSM({
//    			url:'http://tile.openstreetmap.org/{z}/{x}/{y}.png'}),        	
//        	projection: "EPSG:4626",
//            displayProjection: "EPSG:3857",
//            name:'osm'});
		 
		//기본지도 1
		mapLayers[0] = (_VWorldLayer.createVWorldBaseMapLayer({
			isVisible : true
		}));
		//위성맵 2 3
		mapLayers[1] = _VWorldLayer.createVWorldSatelliteMapLayer({
			isVisible : false
		});
		mapLayers[2] = _VWorldLayer.createVWorldHybridMapLayer({
			isVisible : false
		});
		//백지도
		mapLayers[3] = _VWorldLayer.createVWorldGrayMapLayer({
			isVisible : false
		}); 

		// 행정구역
//		layerInfos.push({layerNm:'GIS_SDO',isVisible:false,isTiled:true,cql:null,opacity:1});
//		layerInfos.push({layerNm:'GIS_SGG',isVisible:false,isTiled:true,cql:null,opacity:1});
//		layerInfos.push({layerNm:'GIS_BDONG',isVisible:false,isTiled:true,cql:null,opacity:0.2});
//		
		
		var admnsDstrcLayers = createTileLayer(layerInfos);
		
		mapLayers = mapLayers.concat(admnsDstrcLayers);
		
		coreMap = new ol.Map({
			controls : ol.control.defaults({
				attribution : false,
				rotate : false,
				zoom : false,
				forEachLayerAtPixel:true
			}).extend([ new ol.interaction.DragRotate({
				condition : function(e) {
					return false;
				}
			}) ]),
			target : mapDiv,
			layers : mapLayers,
			view : new ol.View({
				enableRotation : false, // 모바일에서 투터치로 지도가 회전되는 것 막음
				rotation : 0,
				center : centerPoint,
				minZoom : 5,
				maxZoom : 19,
				zoom : zoom
			})
		});

		// map.getView().fit(bounds, map.getSize());

		// map.addInteraction(draghandler);

		//
		setMapEvent();
		
		setEventListener();
		
		// feature 클릭시 팝업을 띄우기 위한 초기화
	    setPopupOverlay();
		
		_ZoomSlider.init({
			top : 70,
			right : 100,
			maxGrade: 19,
			minGrade : 5,
			preLevel : _CoreMap.getMap().getView().getZoom(),
			id : 'mapNavBar'
		});
		// VWORLD wms layer on/off check box 생성
		// setVworldWmsLayerCheckbox();
	}
	
	
	var popupOverlay = "";
	
	var setPopupOverlay = function(){

		popupOverlay = new ol.Overlay({
		  element: document.getElementById('popupOverlay')
		});
		coreMap.addOverlay(popupOverlay);
	    		
		
	}

	var setEventListener = function(){
		_MapEventBus.on(_MapEvents.map_addLayer, addLayer);
		
		
		_MapEventBus.on(_MapEvents.map_removeLayer, removeLayer);
		
		_MapEventBus.on(_MapEvents.setZoom , setZoom);
		
	};
	var setMapEvent = function() {

		//change:layerGroup (ol.ObjectEvent)
		coreMap.on('change:layerGroup', function(event) {
			event.preventDefault();

			_MapEventBus.trigger(_MapEvents.change_layerGroup, {
				result : event
			});
		});
		//change:size (ol.ObjectEvent)
		coreMap.on('change:size', function(event) {
			event.preventDefault();

			_MapEventBus.trigger(_MapEvents.change_size, {
				result : event
			});
		});
		//change:target (ol.ObjectEvent)
		coreMap.on('change:target', function(event) {
			event.preventDefault();

			_MapEventBus.trigger(_MapEvents.change_target, {
				result : event
			});
		});
		//change:view (ol.ObjectEvent)
		coreMap.on('change:view', function(event) {
			event.preventDefault();

			_MapEventBus.trigger(_MapEvents.change_view, {
				result : event
			});
		});
		//click (ol.MapBrowserEvent) - A click with no dragging. A double click will fire two of this.
		
		coreMap.on('click', function(event) {
			event.preventDefault();
			
			
			_MapEventBus.trigger(_MapEvents.map_clicked, {
				result : event
			});
		});
		
		//dblclick (ol.MapBrowserEvent) - A true double click, with no dragging.
		coreMap.on('dblclick', function(event) {
			event.preventDefault();

			_MapEventBus.trigger(_MapEvents.map_dblclick, {
				result : event
			});
		});
		//moveend (ol.MapEvent) - Triggered after the map is moved.
		coreMap.on('moveend', function(event) {
			event.preventDefault();

			_MapEventBus.trigger(_MapEvents.map_moveend, {
				result : event
			});
		});
		
		coreMap.on('loaded', function(event) {
			event.preventDefault();

			_MapEventBus.trigger(_MapEvents.map_loaded, {
				result : event
			});
		});
		// 벡터레이어로 올렸을때 feature select
		coreMap.on('singleclick', function(evt) {
			evt.preventDefault();
			
			_MapEventBus.trigger(_MapEvents.map_singleclick, {
				result : evt
			});
			
			/*
			popupOverlay.setPosition(undefined);
			
			var getLayer = coreMap.forEachLayerAtPixel( evt.coordinate, function ( _layer ) {

				  // you will get the vector layer here

				}, this, function ( _layer ) {
					
				    if ( _layer instanceof ol.layer.Tile ) {
				    	
				        if(_layer.getProperties().searchWfS){
				        	
				        	var resolution = coreMap.getView().getResolution();
				        	
				        	 var url = _layer.getSource().getGetFeatureInfoUrl(
						                        evt.coordinate,
						                        resolution,
						                        'EPSG:3857',
						                        {
						                            'INFO_FORMAT': 'application/json',
						                            'propertyName': 'CODE'
						                        }
						                    );
				        	
				        	$.getJSON( url, function( features ) {
				        		features = new ol.format.GeoJSON().readFeatures(features);
				        		if(features.length > 0){
				        			var properties = features[0].getProperties();
				        			popupOverlay.setPosition(evt.coordinate);
				        			
				        			$('#popupOverlay div').remove();
				        			$('#popupOverlay').append('<div id=\"popup-content\">'+properties.CODE+'</div>');
				        		}
				        		
				        	});
				        }
				        
				    }
				});
			
			_MapEventBus.trigger(_MapEvents.map_singleclick, {
				result : evt
			});
			*/
		});
		
		//
		coreMap.on('pointermove', function(evt) {
			evt.preventDefault();

			_MapEventBus.trigger(_MapEvents.map_pointermove, {
				result : event
			});
		});
		
		$(coreMap.getViewport()).on('mousemove', function(event) {
			_MapEventBus.trigger(_MapEvents.map_mousemove, {
				result : event
			});
		  
		});
	}
	var createTileLayer = function(layerInfos) {
		
		var layers = [];
		
		for(var i=0; i<layerInfos.length; i++){
			var layer = new ol.layer.Tile({
      			visible: layerInfos[i].isVisible,
      			opacity : layerInfos[i].opacity,
      			source: new ol.source.TileWMS({
      				url: _proxyUrl+wmsBaseUrl,
      				params: {'FORMAT': format, 
	      				'VERSION': '1.3.0',
	      				tiled: layerInfos[i].isTiled,
	      				LAYERS: layerInfos[i].layerNm,
	      				STYLES: layerInfos[i].style,
	      				CQL_FILTER:layerInfos[i].cql,
	      				urlType: 'geoServer'
	      				},
      				serverType:'geoserver'
      			}),
  				name: layerInfos[i].layerId,
  				zIndex: (layerInfos.zIndex ? layerInfos.zIndex: 1)
			});
			if(layer != null){
				layer.set('layerNm', layerInfos[i].layerNm);//,searchWfS:true
				layer.set('searchWfS', layerInfos[i].searchWfS);//,searchWfS:true
				layers.push(layer);
			}
		}
		return layers;
	};
	var centerMap = function(long, lat, zoomLavel , type) {
		var centerPoint;

		if (typeof (long) == 'string')
			long = parseFloat(long);

		if (typeof (lat) == 'string')
			lat = parseFloat(lat);

		if (long > 1000000 && lat > 400000)
			centerPoint = [ long, lat ];
		else {
			if (long < 110 && lat > 40) {
				var tmp = lat;
				lat = long;
				long = tmp;
			}
			centerPoint = ol.proj.transform([ long, lat ],
					initParam.worldProjection, initParam.targetProjection);
		}

		coreMap.getView().setCenter(centerPoint);
		if (zoomLavel != null){
			coreMap.getView().setZoom(zoomLavel);
		}
		
		if(type == false){
			_MapChangeType = false;
		}
			
	}

	var addLayer = function(event, layer) {
		if (layer == null)
			return;
		if (coreMap == null)
			return;
		
		if(layer.name && coreMap.getLayerForName(layer.name) != null){
			return;
		}
		
		coreMap.addLayer(layer);
		mapLayers.push(layer);
	}
	var addVectorLayer = function(features) {

		if (features == null || features.length <= 0)
			return;
		if (coreMap == null)
			return;

		var vectorLayer = new ol.layer.Vector({
			source : new ol.source.Vector({
				features : features
			})
		});

		coreMap.addLayer(vectorLayer);
		mapLayers.push(vectorLayer);

		return vectorLayer;
	}
	var removeLayer = function(event, layer) {
		if (coreMap == null)
			return;
		coreMap.removeLayer(layer);
	}


	// 배경맵 지우기
	var hideBaseMap = function() {
		for (var i = 1; i < 5; i++) {
			mapLayers[i].setVisible(false);
		}
	}
	
	// button value on/off 설정 클릭한 버튼 이외에 value = false로
	var buttonOnOff = function(check,id,falseId){
		//맵을 다 껏을떄
		if(check){
			mapLayers[0].setVisible(false); // osm 맵 끄기 
			$('#'+id)[0].setAttribute('value', '0');
			$('#'+id).attr('class', 'btn2');
		}else{//지도가 선택 되었을때 
			mapLayers[0].setVisible(true); // osm 맵 켜기
			$('#'+id)[0].setAttribute('value','1');
			$('#'+id).attr('class', 'btn1');
		}
		
		for(var i = 0 ; i < falseId.length ; i ++){
			$('#'+falseId[i])[0].setAttribute('value','0');
			$('#'+falseId[i]).attr('class', 'btn2');
		}
	}
	
	// 기본지도
	var showDefautMap = function() {
		//if($('#defaultMap')[0].value == "1"){
		
		if($('#defaultMap')[0].getAttribute('value') == "1"){
			for (var i = 1 ; i < 5 ; i++) {
				mapLayers[i].setVisible(false);
			}
			buttonOnOff(true,"defaultMap",["airMap","grayMap"]);
		}else{
			for (var i = 1 ; i < 5 ; i++) {
				mapLayers[i].setVisible(i == 1 ? true : false);
			}
			buttonOnOff(false,"defaultMap",["airMap","grayMap"]);
		}
		
	}
	// 항공지도
	var showAirMap = function() {
		if($('#airMap')[0].getAttribute('value') == "1"){
			for (var i = 1; i < 5; i++) {
				mapLayers[i].setVisible(false);
			}
			buttonOnOff(true,"airMap",["defaultMap","grayMap"]);
		}else{
			for (var i = 1; i < 5; i++) {
				mapLayers[i].setVisible((i == 2 || i == 3) ? true : false);
			}
			buttonOnOff(false,"airMap",["defaultMap","grayMap"]);
		}
		
	}
	// 백지도
	var showGrayMap = function() {
		if($('#grayMap')[0].getAttribute('value') == "1"){
			for (var i = 1; i < 5; i++) {
				mapLayers[i].setVisible(false);
			}
			buttonOnOff(true,"grayMap",["airMap","defaultMap"]);
		}else{
			for (var i = 1; i < 5; i++) {
				mapLayers[i].setVisible(i == 4 ? true : false);
			}
			buttonOnOff(false,"grayMap",["airMap","defaultMap"]);
		}
	}
	
	// 행정경계 시도
	var showSidoLayer = function() {
		for (var i = 5; i < 8; i++) {
			mapLayers[i].setVisible(i == 5 ? true : false);
		}
	}
	
	// 행정경계 시군구
	var showSggLayer = function() {
		for (var i = 5; i < 8; i++) {
			mapLayers[i].setVisible(i == 6 ? true : false);
		}
	}
	
	// 행정경계 법정동
	var showDongLayer = function() {
		for (var i = 5; i < 8; i++) {
			mapLayers[i].setVisible(i == 7 ? true : false);
		}
	}
	
	
	var mapLayerVisible = function(visibleLayers){
		if(visibleLayers.length > 0){
			//mapLayers
			for(var i = 0 ; i < visibleLayers.length ; i++){
				mapLayers[visibleLayers[i]].setVisible(mapLayers[visibleLayers[i]].getVisible() == true ? false: true);
			}
		}else{
			mapLayers[visibleLayers].setVisible(mapLayers[visibleLayers].getVisible() == true ? false: true);
		}
		
	}
	
	var admLayerOnOff = function(result){
		var findArray = _AdmLayerArray.indexOf(_AdmLayerNumber[result.value]);
		if(findArray == -1){
			_AdmLayerArray.push(_AdmLayerNumber[result.value])
		}else{
			_AdmLayerArray.splice(findArray , 1);
		}
		
		if(_AdmLayerArray.length > 0){
			for(var i = 0 ; i < _AdmLayerArray.length ; i++ ){
				for(var j = 5; j < 8; j++) {
					if(j == _AdmLayerArray[i]){
						mapLayers[j].setVisible(true); 
					}else{
						mapLayers[j].setVisible(false);
					}
				}
			}
		}else{
			for(var j = 5; j < 8; j++) {
				mapLayers[j].setVisible(false);
			}
		}
		
	}
	
	// 좌표 -> 주소 변환
	var convertCoordToAddress = function(parameter) {
		// var url = vworldAddrUrl.replace('#X#', parameter.x).replace('#Y#',
		// parameter.y);

		var url = nhnAddrUrl.replace('#X#', parameter.x).replace('#Y#',
				parameter.y);
		//		
		$.getJSON(url, parameter.callback);
	}

	var getMapBounds = function(wkt) {
		var extent = coreMap.getView().calculateExtent(
				coreMap.getSize());
		return ol.proj.transformExtent(extent, 'EPSG:3857', wkt);
	}
	var convertLonLatCoord = function(coord, flag) {
		if (flag) {
			if (coord[0] > 1000000 && coord[1] > 400000)
				return coord;

			return ol.proj.transform(coord, initParam.worldProjection,
					initParam.targetProjection);
		} else
			return ol.proj.transform(coord, initParam.targetProjection,
					initParam.worldProjection);
	}
	
	var zoomToExtent = function(extent){
		
		coreMap.getView().fit(extent,coreMap.getSize());
		
	}
	
	var setZoom = function(event, level){
		coreMap.getView().setZoom(level);
	}
	
	var changeBaseMap = function(mapType){
		var mapTypeObj = {
			'Base':'defaultMaps',
			'Satellite':'airMaps',
			'Gray':'grayMaps'
		};
		
		for(var i = 0; i<mapLayers.length; i++){
			var baseMapType = mapTypeObj[mapLayers[i].getProperties().name]; 
			if(baseMapType){
				mapLayers[i].setVisible(baseMapType==mapType?true:false);
			}
		}
	};
	
	// public functions
	return {

		init : function(mapDivId) {
			var me = this;
			init();
			createMap(mapDivId);
			return me;
		},
		centerMap : function(long, lat, zoomLavel, type) {
			centerMap(long, lat, zoomLavel, type);
		},
		getMap : function() {
			return coreMap;
		},
		getZoom : function() {
			return map.getView().getZoom();
		},
		addLayer : function(layer) {
			addLayer(null, layer);
		},
		addVectorLayer : function(features) {
			return addVectorLayer(features);
		},
		hideBaseMap : function() {
			hideBaseMap();
		},
		showDefautMap : function() {
			showDefautMap();
		},
		showAirMap : function() {
			showAirMap();
		},
		showGrayMap : function() {
			showGrayMap();
		},
		zoomToExtent : function(extent){
			zoomToExtent(extent);
		},
		showSidoLayer: function(){
			showSidoLayer();
		},
		showSggLayer: function(){
			showSggLayer();
		},
		showDongLayer: function(){
			showDongLayer();
		},
		createTileLayer: function(layerName){
			return createTileLayer(layerName);
		},
		
		mapLayerVisible: function(visibleLayers){
			mapLayerVisible(visibleLayers);
		},
		admLayerOnOff: function(result){
			admLayerOnOff(result);
		},
		changeBaseMap: function(mapType){
			changeBaseMap(mapType);
		}
	};
}();
