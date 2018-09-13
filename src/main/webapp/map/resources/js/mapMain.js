var _MapMain = function() {

	// private functions & variables
	var reverseFeatures = []; 
	var reverseInterval;
	var reverseVectorLayer;
	
	var latticInterval;
	
	var setInitMap = function() {
		_AirKoreaMap.init('map');
		if (Common.shape == null) {
			Common.shape = {
				type : 'Point',
				coordinates : [ 126.978371, 37.5666091 ]
			}
		}

		_AirKoreaMap.centerMap(Common.shape.coordinates[0],
				Common.shape.coordinates[1], 7);
		
//		setMapEvent();
	}
	var setMapEvent = function() {
		
		$('#latValSel').on('change', function(){
			
			stopLattice();
			
			hideLattice();
			
			latVal  = $(this).val();
			showLattice();
		});
		_AirKoreaMap.setFeatureInfoCallback(function(feature) {
		});
		_AirKoreaMap.setMapClickCallback(function(coord, features, featureRegMode) {
		});
	}
	var createTextStyleFac = function(feature, resolution) {
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
			text : getTextFac(feature, resolution),
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
	var createTextStyle = function(feature, resolution) {
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
			text : getText(feature, resolution),
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
	var onoffFlag = false;
	var onOff = function(){
		if(onoffFlag){
			onoffFlag = false;
			getText = function(feature, resolution){
				var text = feature.get('name');
				text = stringDivider(text, 26, '\n');
				$('#currentDate').val(text);
				return text;
			}
		}else{
			onoffFlag = true;
			getText = function(feature, resolution){
				var text = feature.get('name');
				text = stringDivider(text, 26, '\n');
				$('#currentDate').val(text);
				return '';
			}
		}		
	}
	
	var facOnOffFlag = false;
	var labelOnOffFac = function(){
		if(facOnOffFlag){
			facOnOffFlag = false;
			getTextFac = function(feature, resolution){
				var text = feature.get('name');
				return stringDivider(text, 26, '\n');
			}
		}else{
			facOnOffFlag = true;
			getTextFac = function(feature, resolution){
				return '';
			}
		}		
	}
	
	var getText = function(feature, resolution) {
		var text = feature.get('name');
		text = stringDivider(text, 26, '\n');
		$('#currentDate').val(text);
		return text
	};
	var getTextFac = function(feature, resolution) {
		var text = feature.get('name');
		return stringDivider(text, 26, '\n');
	};
	var stringDivider = function(str, width, spaceReplacer) {
		if (str.length > width) {
			var p = width;
			while (p > 0 && (str[p] != ' ' && str[p] != '-')) {
				p--;
			}
			if (p > 0) {
				var left;
				if (str.substring(p, p + 1) == '-') {
					left = str.substring(0, p + 1);
				} else {
					left = str.substring(0, p);
				}
				var right = str.substring(p + 1);
				return left + spaceReplacer
						+ stringDivider(right, width, spaceReplacer);
			}
		}
		return str;
	}
	
	function pointStyleFunction(feature, resolution) {
		return new ol.style.Style({
			image : new ol.style.Circle({
				radius : 10,
				fill : new ol.style.Fill({
					color : 'rgba(255, 0, 0, 1.0)'
				}),
				stroke : new ol.style.Stroke({
					color : 'red',
					width : 5
				})
			}),
			text : createTextStyle(feature, resolution)
		});
	}
	function polygonStyleFunction(feature, resolution) {
//	    if(parseInt(feature.G.INDEXID) % 9 == 0){
//	    	return [new ol.style.Style({
//		        stroke: new ol.style.Stroke({
//		            color: 'rgba(255,64,0,0.4)',
//		            width: 1
//		        }),
//		        fill: new ol.style.Fill({
//			        color: 'rgba(255, 64, 0, 0.4)'
//			      })
//		    })];
//	    }
//	    if(parseInt(feature.G.INDEXID) % 7 == 0){
//	    	return [new ol.style.Style({
//		        stroke: new ol.style.Stroke({
//		            color: 'rgba(223,58,1,0.4)',
//		            width: 1
//		        }),
//		        fill: new ol.style.Fill({
//			        color: 'rgba(223,58,1, 0.4)'
//			      })
//		    })];
//	    }
//	    if(parseInt(feature.G.INDEXID) % 11 == 0){
//	    	return [new ol.style.Style({
//		        stroke: new ol.style.Stroke({
//		            color: 'rgba(254,154,46,0.4)',
//		            width: 1
//		        }),
//		        fill: new ol.style.Fill({
//			        color: 'rgba(254,154,46, 0.4)'
//			      })
//		    })];
//	    }
//	    else{
//	    	return [new ol.style.Style({
//		        stroke: new ol.style.Stroke({
//		            color: 'rgba(0,255,255,0.1)',
//		            width: 1
//		        }),
//		        fill: new ol.style.Fill({
//			        color: 'rgba(0, 255, 255, 0.1)'
//			      })
//		    })];
//	    }
	    return [new ol.style.Style({
	        stroke: new ol.style.Stroke({
	            color: 'rgba(0,255,255,0.1)',
	            width: 1
	        }),
	        fill: new ol.style.Fill({
		        color: 'rgba(0, 255, 255, 0.1)'
		      })
	    })];
//	    return [new ol.style.Style({
//	        stroke: new ol.style.Stroke({
//	            color: color,
//	            width: 1
//	        }),
//	        fill: new ol.style.Fill({
//		        color: 'rgba(0, 0, 255, 0.1)'
//		      })
//	    })];
	    
//		return new ol.style.Style({
//		    stroke: new ol.style.Stroke({
//		        color: 'blue',
//		        width: 0.1
//		      }),
//		      fill: new ol.style.Fill({
//		        color: 'rgba(0, 0, 255, 0.1)'
//		      })
//		    })
	}
	var startFlag = false;
	var addTestLayer = function() {
		if(startFlag){
			startFlag = false;
			clearInterval(reverseInterval);
			$('#firstAndLastDate').hide();
			$('#currentDate').show();
		}
		
		_AirKoreaMap.removeLayer(reverseVectorLayer);
		startFlag = true;
		var reverseLayer = _AirKoreaLayer.getFeatures('reverse_analy', '',
				function(features) {
					reverseFeatures = [];
			
					for (var i = 0; i <features.features.length; i++) {
						var tfeature = features.features[i];
						var coord = ol.proj.transform([
								tfeature.properties.LONG,
								tfeature.properties.LAT ], 'EPSG:4326',
								'EPSG:3857');
						var prop = tfeature.properties;
						
						var feature = new ol.Feature({geometry:new ol.geom.Point(coord), name:prop.YEAR+'-'+prop.MONTH+'-'+prop.DAY+'-'+prop.TIME+'('+prop.HIGH+')'});
						reverseFeatures.push(feature);
					}

					reverseVectorLayer = new ol.layer.Vector({
						source : new ol.source.Vector({
							features : [reverseFeatures[0]]
						}),
						style : pointStyleFunction
					});

					_AirKoreaMap.addLayer(reverseVectorLayer);
					
					var centerCoord = reverseFeatures[0].getGeometry().getCoordinates();
					_AirKoreaMap.centerMap(centerCoord[0], centerCoord[1]);
					
					var idx = 1;
					reverseInterval = setInterval(function(){
						reverseVectorLayer.getSource().addFeature(reverseFeatures[idx]);
						
						var centerCoord = reverseFeatures[idx].getGeometry().getCoordinates();
						_AirKoreaMap.centerMap(centerCoord[0], centerCoord[1]);
						idx++;
						if(reverseFeatures.length-1 <= idx){
							console.log('END')
							clearInterval(reverseInterval);
							var firstLabel = reverseFeatures[0].get('name');
							firstLabel = stringDivider(firstLabel, 26, '\n');
							
							var lastLabel = reverseFeatures[reverseFeatures.length-1].get('name');
							lastLabel = stringDivider(lastLabel, 26, '\n');
							
							$('#firstAndLastDate').val( lastLabel +' ~ '+firstLabel);
							$('#firstAndLastDate').show();
							$('#currentDate').hide();
							
						}
					}, $('#playInterval').val());
				});

	}
	
	var stop = function(){
		if(reverseInterval != null){
			startFlag = false;
			clearInterval(reverseInterval);
		}
	}
	
	
	var addLattice = function(){
		var latticeLayer = _AirKoreaLayer.getFeatures('CMAQ_9km', 'INDEXID<1500',
				function(result) {
//		var latticeFeatures = [];
		
//		for (var i = 0; i <result.features.length; i++) {
//			var tfeature = result.features[i];
//			
//			var latticeFeature = new ol.Feature({geometry:tfeature.geometry});
//			latticeFeatures.push(latticeFeature);
//		}
		var latticeFeatures = (new ol.format.GeoJSON()).readFeatures(result);
		
		latticeLayer = new ol.layer.Vector({
			source : new ol.source.Vector({
				features : latticeFeatures
			}),
			style : polygonStyleFunction
		});

		_AirKoreaMap.addLayer(latticeLayer);
		
		});
	}

	function observerPointStyleFunc(feature, resolution) {
		var iconTemplate = '<svg width="105" height="75" version="1.1" xmlns="http://www.w3.org/2000/svg">'+
								'<defs>'+
									'<filter id="rectFilter" x="0" y="0" width="200%" height="200%">'+
								    	'<feOffset result="offOut" in="SourceAlpha" dx="2" dy="2" />'+
								    	'<feGaussianBlur result="blurOut" in="offOut" stdDeviation="2" />'+
								    	'<feBlend in="SourceGraphic" in2="blurOut" mode="normal" />'+
								    '</filter>'+
								'</defs>'+
								'<rect width="95" height="65" rx="20" ry="20"  style="fill:rgb(255,255,255);stroke-width:3;stroke:rgb(0,0,0)" filter="url(#rectFilter)" ></rect>'+
					      		'<image x="10" y="5" href="data:image/png;base64,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" height="34" width="35"/>'+
					      		'<text x="10" y="55" fill="black"> 25°C </text>'+
					      		'<image x="50" y="5" href="data:image/png;base64,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" height="35" width="35"/>'+
					      		'<text x="50" y="55" fill="black"> 2m/s </text>'+
					      	'</svg>';
		
		
		return new ol.style.Style({
			image: new ol.style.Icon({
				opacity: 1,
				src: 'data:image/svg+xml;utf8,' + iconTemplate
			})
		});
	}
	
	var facStartFlag = false;
	var facInterval = null;
	
	var playFac = function() {
		var targetLayer = getLayer('observerLayer');
		
		console.log(targetLayer);
		
		var features = targetLayer.getSource().getFeatures();
		
		var facIdx = 2;
		if(facStartFlag){
			facStartFlag = false;
			clearInterval(facInterval);
		}else{
			facStartFlag = true;
			facInterval = setInterval(function(){
				if(facIdx == 24){
					facIdx = 1;
				}
				for(var i=0; i<features.length; i++){
					features[i].set('name', (Math.random() *10).toFixed(3) );
				}
				$('#currentFacDate').val('2017-11-22 '+facIdx+' 시');
				facIdx++;
			}, 3000);
		}
		
	}
	var facFeatures = null;
	
	var addFac = function(){
		var observerLayer = _AirKoreaLayer.getFeatures('observer', '',
				function(result) {
			
			for(var i=0; i<result.features.length; i++){
				result.features[i].properties.name =  (Math.random() *10).toFixed(3);
			}
			
			var observerFeatures = (new ol.format.GeoJSON()).readFeatures(result);
			
			observerLayer = new ol.layer.Vector({
				source : new ol.source.Vector({
					features : observerFeatures
				}),
				style : observerPointStyleFunc,
				name:'observerLayer'
			});
	
			_AirKoreaMap.addLayer(observerLayer);
		
			$('#currentFacDate').val('2017-11-22 1 시');
			
		});
	}
	var latVal = 'real';
	
	var playLattice = function(){
		
		var targetLayer = getLayer('airkorea_'+latVal);
		var airkoreaSource = targetLayer.getSource();
		
		var lattIdx = 6;
		latticInterval = setInterval(function(){
			if(lattIdx == 24){
				lattIdx = 6;
			}
			
			var lattIdxStr = String(lattIdx);
			if(lattIdxStr.length == 1){
				lattIdxStr = '0'+lattIdxStr;
			}
			airkoreaSource.updateParams({'FORMAT': 'image/png', 
				'VERSION': '1.1.0',
				tiled: true,
				LAYERS: 'airkorea:airkorea_'+latVal,
				CQL_FILTER:'RESULT_DATE=\'20180103\' AND RESULT_HOUR=\''+lattIdxStr+'\''
				});
			$('#latticeDate').val('2018-01-03 '+lattIdx+' 시');
			lattIdx++;
		}, 2000);
	}
	var stopLattice = function(){
		clearInterval(latticInterval);
	}
	var showLattice = function(){
		var targetLayer = getLayer('airkorea_'+latVal);
		targetLayer.setVisible(true);
	}
	var hideLattice = function(){
		var targetLayer = getLayer('airkorea_'+latVal);
		targetLayer.setVisible(false);
	}
	var getLayer = function(name){
		var layers = _AirKoreaMap.getLayers();
		for(var i=0; i<layers.length; i++){
			var layerName = layers[i].get('name');
			if(layerName == name){
				return layers[i];
			}
		}
	}
	var showGrayMap = function(){
		_AirKoreaMap.showGrayMap();
	}
	var showDefautMap = function(){
		_AirKoreaMap.showDefautMap();
	}
	var showAirMap = function(){
		_AirKoreaMap.showAirMap();
	}
	var hideBaseMap = function(){
		_AirKoreaMap.hideBaseMap();
	}
	var showDistrictLayer = function(btn, index){
		var target = $('#disMapBtn'+index);
		
		var classNm = target.attr('class');
		if(classNm.indexOf('default') > -1){
			target.removeClass('default');
			target.addClass('success');
			_AirKoreaMap.showDistrictLayer(index+6);
		}else{
			target.removeClass('success');
			target.addClass('default');
			_AirKoreaMap.hideDistrictLayer(index+6);
		}
	}
	var addHeatMap = function(){
		var targetLayer = getLayer('airKoreaHeatmapLayer');
		if(targetLayer != null){
			targetLayer.setVisible(true);
		}else{
			_AirKoreaMap.addHeatMap();	
		}
	}
	var offHeatMap = function(){
		var targetLayer = getLayer('airKoreaHeatmapLayer');
		targetLayer.setVisible(false);
	}
	var startHeatMap = function(){
		var targetLayer = getLayer('airKoreaHeatmapLayer');
		
		var lattIdx = 6;
		latticInterval = setInterval(function(){
			if(lattIdx == 24){
				lattIdx = 6;
			}
			
			var lattIdxStr = String(lattIdx);
			if(lattIdxStr.length == 1){
				lattIdxStr = '0'+lattIdxStr;
			}
			targetLayer.setSource(new ol.source.Vector({
				//url: Common.geoServerUrl+'/geoserver/airkorea/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=airkorea:cmaq_9km_pt2&maxFeatures=5000&outputFormat=application/json&CQL_FILTER=RESULT_DATE=\'20180103\' AND RESULT_HOUR=\''+lattIdxStr+'\'',
				url: _proxyUrl+'/geoserver/airkorea/ows?service=WFS&urlType=geoServer&version=1.0.0&request=GetFeature&typeName=airkorea:cmaq_9km_pt2&maxFeatures=5000&outputFormat=application/json&CQL_FILTER=RESULT_DATE=\'20180103\' AND RESULT_HOUR=\''+lattIdxStr+'\'',
				format: new ol.format.GeoJSON({
					featureProjection:'EPSG:3857'
					})
				}));
			targetLayer.getSource().on('addfeature', function(event) {
				var coVal = parseFloat(event.feature.get('CO'));
		        var sum = coVal-parseInt(coVal);
		        event.feature.set('weight', sum);
			});
			$('#heatMapDate').val('2018-01-03 '+lattIdx+' 시');
			lattIdx++;
		}, 1000*5);
	}
	// public functions
	return {

		init : function() {
			var me = this;

			setInitMap();

			return me;
		},
		play : function(){
			addTestLayer();
		},
		stop: function(){
			stop();
		},
		onOff: function(){
			onOff();
		},
		addLattice : function(){
			addLattice();
		},
		addFac: function(){
			addFac();
		},
		playFac: function(){
			playFac();
		},
		labelOnOffFac: function(){
			labelOnOffFac();
		},
		playLattice: function(){
			playLattice();
		},
		showLattice: function(){
			showLattice();
		},
		hideLattice: function(){
			hideLattice();
		},
		stopLattice: function(){
			stopLattice();	
		},
		showGrayMap:function(){
			showGrayMap();
		},
		showDefautMap:function(){
			showDefautMap();
		},
		showAirMap:function(){
			showAirMap();
		},
		hideBaseMap:function(){
			hideBaseMap();	
		},
		showDistrictLayer: function(index){
			showDistrictLayer(this, index);
		},
		addHeatMap: function(){
			addHeatMap();
		},
		offHeatMap: function(){
			offHeatMap();
		},
		startHeatMap: function(){
			startHeatMap();
		}
	};

}();
