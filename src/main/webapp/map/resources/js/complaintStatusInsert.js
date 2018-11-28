var _ComplaintStatusInsert = function () {
	var bizUrl = window.location.protocol+'//'+window.location.host;
	var currentDate = {};
	
	var complaintStatusMode = 0; // 0 = 민원접수 선택 , 1 = 민원등록및 위치확인, 2 = 인근민원 확인, 3 = 악취분포 확인, 4 = 악취원점 분석, 5 = 악취 저감 조치
	
	var complaintStatusRegPopup , complaintStatusPopup, cvplPopupOverlay, process, bsmlPopup;
	
	var selectedObj;
	var popupOverlay;
	
	var regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
	
	var bsmlPopupHtmlTemplate = '<div class="tooltip2">'+
	 								'<p class="tt_tit2">'+
	 								'<span>#name#</span>'+
	 								'<a href="javascript:void(0);" class="btn06 pop_close"></a>'+
	 								'</p>'+
	 								'<div class="pop_conts3"></div>'+
	 							'</div>';
	
	var init = function(){
		complaintStatusRegPopup = $('#complaintStatusRegPopup');
		complaintStatusPopup = $('#complaintStatusPopup');
		bsmlPopup = $('#bsmlPopup');
		
		complaintStatusRegPopup.draggable({ containment: '#map' });
		complaintStatusPopup.draggable({ containment: '#map' });

		bsmlPopup.draggable({ containment: '#map' });
		
		
		cvplPopupOverlay = $('#cvplPopupOverlay');
		process = $('.process');
		
		setEvent();
		
		popupOverlay = new ol.Overlay({
	    	element: document.getElementById('cvplPopupOverlay')
	    });
		_CoreMap.getMap().addOverlay(popupOverlay);
	};
	var setEvent = function(){
		Object.defineProperty(currentDate, 'date', {
			get: function(){
				return this._date;
			},
			set: function(date) {
		    	this._date = date;
		    	$('#workSpace2').html(currentDate.date + currentDate.time);
		    }
		});
		Object.defineProperty(currentDate, 'time', {
			get: function(){
				return this._time;
			},
			set: function(time) {
		    	this._time = time;
		    	$('#workSpace2').html(currentDate.date + currentDate.time);
		    }
		});
		
		$('.workStep').on('click', function(){
			var mode = $(this).attr('mode');
			if(complaintStatusMode < (parseInt(mode)-1)){
				alert('못가');
				return;
			}
			if(complaintStatusMode == mode){
				return;
			}
			changeMode(mode);
		});
		
		_MapEventBus.on(_MapEvents.map_singleclick, function(event, data){
			var feature = _CoreMap.getMap().forEachFeatureAtPixel(data.result.pixel, function(feature, layer){
				return feature;
			});
			
			if(complaintStatusMode == 1){
				
			}else if(complaintStatusMode == 2){
				
			}else if(complaintStatusMode == 3){
				
			}else if(complaintStatusMode == 4){
				
			}else if(complaintStatusMode == 5){
				var featureInfo = feature.getProperties();
				
				if(featureInfo.BSML_TRGNPT_SE_CODE){
					if(featureInfo.BSML_TRGNPT_SE_CODE == 'BSL01002'){
						bsmlPopup.show();
					}else {
						var geometry = feature.getGeometry();
						var featureExtent = geometry.getExtent();
						var featureCenter = ol.extent.getCenter(featureExtent);
						if(cvplPopupOverlay){
							var bsmlHtml = bsmlPopupHtmlTemplate.replace('#name#', );
							bsmlHtml = bsmlPopupHtmlTemplate.replace('#name#', );
							
							cvplPopupOverlay.setPosition(featureCenter);
							cvplPopupOverlay.html(bsmlPopupHtmlTemplate);
						}
					}
				}
			}else if(complaintStatusMode == 6){
				
			}
		});
		
		_MapEventBus.on(_MapEvents.complaintStatusMode, function(event, data){
			complaintStatusPopup.show();
			
			cvplPopupOverlay.hide();
			process.show();
			
			if($('#tabOpeners').attr('class').indexOf('on') > -1){
				$('#tabOpeners').trigger('click');
			}
			
//			if(!$('#airMaps').attr('class')){
//				$('#airMaps').trigger('click');
//			}
			
			$(".cvpl_pop_close").off().on('click',function(){
				$(this).parent().parent().fadeOut();
			});
			
			$('.process').find('li').removeClass('on');
			for(var i = 0; i<$('.process').find('li').length; i++){
				var li = $($('.process').find('li')[i]);
				li.attr('style', 'background-image:' + 'url("../images'+li.css('background-image').split('images')[1].replace('_on','_off'));
			}
			
			changeMode(1);
		});
	}
	
	var changeMode = function(mode){
		complaintStatusMode = mode;
		
		for(var i = 0; i<mode; i++){
			var li = $($('.process').find('li')[i]);
			li.addClass('on');
			li.attr('style', 'background-image:' + 'url("../images'+li.css('background-image').split('images')[1].replace('_off','_on'));
		}
		
		if(mode == 1){
			
		}else if(mode == 3){
			setBuffer();
		}else if(mode == 4){ 
			_MapEventBus.trigger(_MapEvents.show_odorSpread_layer, {});
		}else if(mode == 5){
			
			// 1. 관심지역 등록 여부 확인 되있거나 안되있거나
			checkAnalsArea();
			// 2. 관심지역이 등록되어 있으면 이동경로 표시
			// 2-1. 관심지역으로 등록되어 있지 않으면 등록할지 물어 보고 등록  후에 3번부터  등록 안하면  끝
			// 3. 이동경로 표시 후 사업장 표시
			// 4. 저감시절 레이어 on
			// 5. 저감 시설, 시설물 클릭시 팝업 처리
//			_MapEventBus.trigger(_MapEvents.show_odorMovement_layer, {});
		}
	};
	
	var checkAnalsArea = function(){
		var coord = ol.proj.transform([selectedObj.x, selectedObj.y], 'EPSG:4326', 'EPSG:3857');
		
		var analsAreaRequest = new ol.format.WFS().writeGetFeature({
	        srsName: 'EPSG:3857',
	        featureNS: 'http://112.218.1.243:44002',
	        featurePrefix: 'CE-TECH',
	        featureTypes: ['shp_anals_area_new'],
	        outputFormat: 'application/json',
	        filter : new ol.format.filter.Contains('SHAPE', new ol.geom.Point(coord), 'EPSG:3857')
//	        filter : new ol.format.filter.and(new ol.format.filter.Contains('SHAPE', new ol.geom.Point([selectedObj.x, selectedObj.y]), 'EPSG:4326'),new ol.format.filter.EqualTo('REG', 1))
// 	        filter: new ol.format.filter.GreaterThanOrEqualTo('REG', '1')
		});
		 
		$.ajax({
			  url: _MapServiceInfo.serviceUrl+'/geoserver/CE-TECH/ows',
			  type:'POST',
			  data: new XMLSerializer().serializeToString(analsAreaRequest)
			}).done(function(result) {
				if(result.features.length <= 0){
					alert('악취확산 격자 영역 밖입니다.');
					return;
				}
				var analsAreaInfo = result.features[0].properties;
					
				if(analsAreaInfo.REG == '0'){
					var regFlag = confirm('해당지역은 관심저점 등록이 되어있지 않습니다. 등록하시겠습니까?');
					if(regFlag){
						$.ajax({
				            url : bizUrl+'/insertAnals.do',
				            data: JSON.stringify({indexId:analsAreaInfo.ANALS_AREA_ID, predictAl:'0'})
				    	}).done(function(result){
				    		_MapEventBus.trigger(_MapEvents.show_odorMovement_layer, {analsAreaId:analsAreaInfo.ANALS_AREA_ID});
				    	});
					}else{
						return;
					}
				}else{
					_MapEventBus.trigger(_MapEvents.show_odorMovement_layer, {analsAreaId:analsAreaInfo.ANALS_AREA_ID});
				}
			});
	}
	var setProcMsg = function(msg){
		if(msg.type == 'selectedCvpl'){
			selectedObj = msg;
			selectedObj.x = parseFloat(msg.x); 
			selectedObj.y = parseFloat(msg.y); 
			
			writePopup([selectedObj.x,selectedObj.y],msg.direct,msg.contents);
			
			currentDate.date = msg.date.replace(regExp, '');;
			currentDate.time = msg.time;
			
			_MapEventBus.trigger(_MapEvents.setCurrentDate, currentDate);
			_MapEventBus.trigger(_MapEvents.map_move, msg);
		}
	};
	
	var setBuffer = function(bufferMeter){
		var x = selectedObj.x;
		var y = selectedObj.y;
		
		if(!bufferMeter){
			bufferMeter = 200;
		}
		
		var layerName = ['complaintStatusBuffer','bufferTarget'];
		
		for(var i = 0; i<layerName.length; i++){
			var layerForName = _CoreMap.getMap().getLayerForName(layerName[i]);

	    	if(layerForName){
	    		_MapEventBus.trigger(_MapEvents.map_removeLayer, layerForName);
	    	}
		}
    	
		Common.getData({url: '/getFeature.do', contentType: 'application/json', params: {contentsId:'complaintStatus',flag:1} }).done(function(data){
			
			var parser = new jsts.io.OL3Parser();
			var interFeatures = [];
			
			var originCoord = _CoreMap.convertLonLatCoord([x,y],true);
			var originFeature = new ol.Feature({geometry:new ol.geom.Point(originCoord), properties:null});
			
			var jstsGeom = parser.read(originFeature.getGeometry());
			var buffered = jstsGeom.buffer(bufferMeter);
			var bufferedGeometry = parser.write(buffered);
			
			for(var i=0; i<data.length; i++){
				var coord = _CoreMap.convertLonLatCoord([data[i].POINT_X,data[i].POINT_Y],true);
				var feature = new ol.Feature({geometry:new ol.geom.Point(coord)});
				
				var target = parser.read(feature.getGeometry());
				var interFeature = buffered.intersection(target);
				
				if(interFeature.getCoordinate()){
					var parseFeature = parser.write(interFeature);
					var resultFeature = new ol.Feature();
					resultFeature.setGeometry(new ol.geom.Point(parseFeature.getCoordinates()));
					resultFeature.setProperties(data[i]);
					interFeatures.push(resultFeature);
				}
			}
			var source = new ol.source.Vector({
				features: interFeatures
			});
			
			var originLayer = new ol.layer.Vector({
				source: source,
				zIndex:1000,
				name:layerName[0],
				style:function(feature){
					return _WestCondition.createLastPoint(feature);
				}
			});
			
			_MapEventBus.trigger(_MapEvents.map_addLayer, originLayer);
			
			var bufferOriginFeature = new ol.Feature({geometry:new ol.geom.Polygon(bufferedGeometry.getCoordinates()), properties:{}});
			var source = new ol.source.Vector();
			source.addFeatures([bufferOriginFeature]);
			bufferOriginLayer = new ol.layer.Vector({ 
				source: source,
				zIndex:1001,
				name:layerName[1],
				opacity: 0.5,
				style:new ol.style.Style({
					stroke: new ol.style.Stroke({
						color: '#AFABAB',
						width: 3
					}),
					fill: new ol.style.Fill({
						color: 'yellow'
					})
				})
			});
			_MapEventBus.trigger(_MapEvents.map_addLayer, bufferOriginLayer);
		});
	};
	
	var writeBsmlPopup = function(){
		
		var centerPoint =_CoreMap.convertLonLatCoord([coord[0],coord[1]],true);
		popupOverlay.setPosition(centerPoint);

		var cvplHtml = '<div class="tooltip2">';
		cvplHtml += '<p class="tt_tit2">';
		cvplHtml += '<span>'+title+'</span>';
		cvplHtml += '<a href="javascript:void(0);" class="btn06 pop_close"></a>';
		cvplHtml += '</p>';
		cvplHtml += '<div class="pop_conts3">';
		cvplHtml += addr;
		cvplHtml += '</div>';
		cvplHtml += '</div>';
		
		cvplPopupOverlay.html(cvplHtml);

		cvplPopupOverlay.show();
	}
	var writePopup = function(coord, title, addr, isInsert){

		var centerPoint =_CoreMap.convertLonLatCoord([coord[0],coord[1]],true);
		popupOverlay.setPosition(centerPoint);

		var cvplHtml = '<div class="tooltip2">';
		cvplHtml += '<p class="tt_tit2">';
		cvplHtml += '<span>'+title+'</span>';
		//cvplHtml += '<a href="#" class="plus_btn"></a>';
		cvplHtml += '<a href="javascript:void(0);" class="btn06 pop_close"></a>';
		cvplHtml += '</p>';
		cvplHtml += '<div class="pop_conts3">';
		cvplHtml += addr;
		cvplHtml += '</div>';
		cvplHtml += '</div>';
		
		cvplPopupOverlay.html(cvplHtml);

		cvplPopupOverlay.show();
	};
	
	return {
		init: function(){
			init();
		}, 
		setCurrentDate: function(date, time){
			if(date){
				currentDate.date = date;	
			} 
			if(time){
				currentDate.time = time;	
			}
		},
		getCurrentDate: function(){
			return currentDate;
		},
		setMode: function(mode){
			if(mode){
				complaintStatus.mode = mode;	
			}
		},
		setProcMsg: function(msg){
			setProcMsg(msg);
		}
    };
}();