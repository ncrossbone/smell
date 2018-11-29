var _ComplaintStatusInsert = function () {
	var bizUrl = window.location.protocol+'//'+window.location.host;
	var currentDate = {};
	
	var complaintStatusMode = 0; // 0 = 민원접수 선택 , 1 = 민원등록및 위치확인, 2 = 인근민원 확인, 3 = 악취분포 확인, 4 = 악취원점 분석, 5 = 악취 저감 조치
	
	var complaintStatusRegPopup , complaintStatusPopup, cvplPopupOverlay, process, bsmlPopup, bufferRadius, clock;
	
	var selectedObj;
	var popupOverlay;
	
	var layerName = ['cvplOnePoint','complaintStatusBuffer','bufferTarget'];
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
		
		var ww = $(window).width();
		var wh = $(window).height();
		complaintStatusPopup.css('left', parseInt(ww/2)-parseInt(complaintStatusPopup.width()/2));
		complaintStatusPopup.css('top', (parseInt(wh/2)-parseInt(complaintStatusPopup.height()/2)-100));
		
		bsmlPopup = $('#bsmlPopup');
		bufferRadius = $('#bufferRadius');
		clock = $('#clock');
		
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
		    	clock.find('.day').text(currentDate.date);
		    	clock.find('.time').text(currentDate.time + '시');
		    }
		});
		Object.defineProperty(currentDate, 'time', {
			get: function(){
				return this._time;
			},
			set: function(time) {
		    	this._time = time;
		    	clock.find('.day').text(currentDate.date);
		    	clock.find('.time').text(currentDate.time + '시');
		    }
		});
		
		$('.workStep').on('click', function(){
			var mode = $(this).attr('mode');
			if(complaintStatusMode < (parseInt(mode)-1)){
				return;
			}
			if(mode == 3  && selectedObj.type == 'putCvpl'){
				alert('등록을 하셔야 합니다.');
				return;
			}
			
			if(complaintStatusMode == mode){
				return;
			}
			if(mode > 1 && !selectedObj){
				return;
			} 
			changeMode(mode);
		});
		
		$('#bufferRadiusSelect').off().on('change',function(){
			setBuffer($(this).val());
		});
		
		_MapEventBus.on(_MapEvents.map_singleclick, function(event, data){
			if(complaintStatusMode == 5){
				changeMode(6);
			}
			
			var feature = _CoreMap.getMap().forEachFeatureAtPixel(data.result.pixel, function(feature, layer){
				return feature;
			});
			
			if(complaintStatusMode == 1){
				
			}else if(complaintStatusMode == 2){
				if(selectedObj.type=="putCvpl"){
					var trans = new ol.proj.transform(data.result.coordinate, 'EPSG:3857','EPSG:4326');
					selectedObj.x = trans[0];
					selectedObj.y = trans[1];
					writePopup(true);
				}
			}else if(complaintStatusMode == 3){
				
			}else if(complaintStatusMode == 4){
				
			}else if(complaintStatusMode == 5){
				
			}else if(complaintStatusMode == 6){
				var featureInfo = feature.getProperties();
				if(featureInfo.properties){
					featureInfo = featureInfo.properties;
				}
				
				if(featureInfo.BSML_TRGNPT_SE_CODE == 'BSL01002'){
					bsmlPopup.show();
				}else {
					var geometry = feature.getGeometry();
					var featureExtent = geometry.getExtent();
					var featureCenter = ol.extent.getCenter(featureExtent);
					if(popupOverlay){
						
						var bsmlHtml = bsmlPopupHtmlTemplate.replace('#name#',featureInfo.CMPNY_NM);
						popupOverlay.setPosition(featureCenter);
						 
						cvplPopupOverlay.html(bsmlHtml);
						cvplPopupOverlay.show();
					}
				}
			}
		});
		
		_MapEventBus.on(_MapEvents.task_mode_changed, function(event, data){
			if(data.mode == 1){
				complaintStatusPopup.show();
				cvplPopupOverlay.hide();
				process.show();
				
				$(".cvpl_pop_close").off().on('click',function(){
					$(this).parent().parent().fadeOut();
				});
				
				process.find('li').removeClass('on');
				
				for(var i = 0; i<process.find('li').length; i++){
					var li = $(process.find('li')[i]);
					li.css('background-image', 'url("../images'+li.css('background-image').split('images')[1].replace('_on','_off'));
				}
				changeMode(1);
			}else{
				// 초기화
				process.hide();
				setProcessBtn(1);
				resetPreMode(1);
				complaintStatusPopup.hide();
			}
		});
	}
	
	var changeMode = function(mode){
		setProcessBtn(mode);
		
		var preFlag = true;
		
		if(complaintStatusMode > parseInt(mode)){
			resetPreMode(parseInt(mode));
			preFlag = false;
		}
		complaintStatusMode = parseInt(mode);
		
		if(mode == 1){
			complaintStatusPopup.show();
		}else if(mode == 2){
			writePopup();
		}else if(mode == 3){
			setBuffer();
		}else if(mode == 4 && preFlag){ 
			_MapEventBus.trigger(_MapEvents.show_odorSpread_layer, {});
		}else if(mode == 5 && preFlag){
			
			// 1. 관심지역 등록 여부 확인 되있거나 안되있거나
			checkAnalsArea();
			_MapEventBus.trigger(_MapEvents.addWriteLayerForUseGeoserver, {type:1});
			
			// 2. 관심지역이 등록되어 있으면 이동경로 표시
			// 2-1. 관심지역으로 등록되어 있지 않으면 등록할지 물어 보고 등록  후에 3번부터  등록 안하면  끝
			// 3. 이동경로 표시 후 사업장 표시
			// 4. 저감시절 레이어 on
			// 5. 저감 시설, 시설물 클릭시 팝업 처리
//			_MapEventBus.trigger(_MapEvents.show_odorMovement_layer, {});
		}
	};
	var resetPreMode = function(mode){
		switch(mode) {
		    case 1:
//		    	complaintStatusPopup.show();
				cvplPopupOverlay.hide();
				selectedObj = null; 
		    case 2:
		    	clearLayerByName(layerName[2]);
		    	clearLayerByName(layerName[1]);
		    	bufferRadius.hide();
		    case 3: // 악취 확산 격자
		    	_MapEventBus.trigger(_MapEvents.hide_odorSpread_layer, {});
		    case 4: // 악취원점 저감시설, 이동경로 닫기
		    	_MapEventBus.trigger(_MapEvents.hide_odorMovement_layer, {});
		    case 5:  // 저감시설 및 악취원점 팝업 닫기
		    	cvplPopupOverlay.hide();
		    	bsmlPopup.hide();
		    case 6: 
		}
	}
	var setProcessBtn = function(mode){
		$('.workStep[mode='+mode+']').addClass('on');
		$('.workStep[mode='+mode+']').css('background-image', 'url("../images'+$('.workStep[mode='+mode+']').css('background-image').split('images')[1].replace('_off','_on'));
		
		if(complaintStatusMode < mode){
			for(var i = 1; i<=mode; i++){
				$('.workStep[mode='+i+']').addClass('on');
				$('.workStep[mode='+i+']').css('background-image', 'url("../images'+$('.workStep[mode='+i+']').css('background-image').split('images')[1].replace('_off','_on'));
			}
		}else{
			for(var i = 6; i>mode; i--){
				$('.workStep[mode='+i+']').removeClass('on');
				$('.workStep[mode='+i+']').css('background-image', 'url("../images'+$('.workStep[mode='+i+']').css('background-image').split('images')[1].replace('_on','_off'));
			}  
		}
	}
	var checkAnalsArea = function(){
		var coord = ol.proj.transform([selectedObj.x, selectedObj.y], 'EPSG:4326', 'EPSG:3857');
		
		var analsAreaRequest = new ol.format.WFS().writeGetFeature({
	        srsName: 'EPSG:3857',
	        featureNS: _MapServiceInfo.serviceUrl,
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
		setProcessBtn(2);
		complaintStatusMode = 2;
		
		currentDate.date = msg.date.replace(regExp, '');
		currentDate.time = msg.time;
		_MapEventBus.trigger(_MapEvents.setCurrentDate, currentDate);
		
		if(msg.type == 'selectedCvpl'){
			selectedObj = msg;
			selectedObj.x = parseFloat(msg.x); 
			selectedObj.y = parseFloat(msg.y); 
			
			writePopup();
			_MapEventBus.trigger(_MapEvents.map_move, msg);
		}else if(msg.type == 'putCvpl'){
			selectedObj = msg;
			_MapEventBus.trigger(_MapEvents.alertShow, {text:'지점을 클릭 하세요.'});
		}
	};
	
	var clearLayer = function(){
		for(var i = 0; i<layerName.length; i++){
			var layerForName = _CoreMap.getMap().getLayerForName(layerName[i]);

	    	if(layerForName){
	    		_MapEventBus.trigger(_MapEvents.map_removeLayer, layerForName);
	    	}
		}
	}
	
	var clearLayerByName = function(layerNm){
		var layer = _CoreMap.getMap().getLayerForName(layerNm);

    	if(layer){
    		_MapEventBus.trigger(_MapEvents.map_removeLayer, layer);
    	}
	}
	
	var setBuffer = function(bufferMeter){
		bufferRadius.show();
		
		var x = selectedObj.x;
		var y = selectedObj.y;
		_CoreMap.getMap().getView().setZoom(17);
		_MapEventBus.trigger(_MapEvents.map_move, {x:x,y:y});
		
		if(!bufferMeter){
			bufferMeter = 200;
		}
    	
		clearLayer();
		cvplPopupOverlay.hide();
		
		Common.getData({url: '/getFeature.do', contentType: 'application/json', params: {contentsId:'complaintStatus',flag:1} }).done(function(data){
			
			var parser = new jsts.io.OL3Parser();
			var interFeatures = [];
			
			var originCoord = _CoreMap.convertLonLatCoord([x,y],true);
			var originFeature = new ol.Feature({geometry:new ol.geom.Point(originCoord), properties:null});
			
			var jstsGeom = parser.read(originFeature.getGeometry());
			var buffered = jstsGeom.buffer(bufferMeter);
			var bufferedGeometry = parser.write(buffered);
			
			var bufferOriginFeature = new ol.Feature({geometry:new ol.geom.Polygon(bufferedGeometry.getCoordinates()), properties:{}});
			var source = new ol.source.Vector();
			source.addFeatures([bufferOriginFeature]);
			bufferOriginLayer = new ol.layer.Vector({ 
				source: source,
				zIndex:1001,
				name:layerName[2],
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
			var cvplNo = '';
			
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
					
					cvplNo += '\''+data[i].CVPL_NO + '\',';
				}
			}
			
			Common.getData({url:'/getGrid.do', contentType: 'application/json', params: {contentsId:'complaintStatus',flag:1, code:cvplNo.substr(0,cvplNo.length-1)} }).done(function(data){
				_WestCondition.writeGrid('complaintStatus',data);
	    	});
			
			var source = new ol.source.Vector({
				features: interFeatures
			});
			
			var originLayer = new ol.layer.Vector({
				source: source,
				zIndex:1000,
				name:layerName[1],
				style:function(feature){
					return _WestCondition.createLastPoint(feature);
				}
			});
			
			_MapEventBus.trigger(_MapEvents.map_addLayer, originLayer);
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
	
	var writePopup = function(isInsert){
		var x = selectedObj.x;
		var y = selectedObj.y;
		var title = selectedObj.direct;
		var addr = selectedObj.contents;
		clock.show();
		
		var centerPoint =_CoreMap.convertLonLatCoord([x,y],true);
		popupOverlay.setPosition(centerPoint);

		var typeConfig = {
				'네이버앱':'CVP02002',
				'오창지킴이':'CVP02003',
				'시도':'CVP02001'
		}

		clearLayer();

		var resultFeature = new ol.Feature();

		resultFeature.setGeometry(new ol.geom.Point(centerPoint));
		resultFeature.setProperties({CVPL_TY_CODE:isInsert?selectedObj.flag:typeConfig[selectedObj.flag],CVPL_LC:title});

		var source = new ol.source.Vector({
			features: [resultFeature]
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
		var cvplHtml = '<div class="tooltip2">';
		cvplHtml += '<p class="tt_tit2">';
		cvplHtml += '<span>'+title+'</span>';
		if(isInsert){
			cvplHtml += '<a href="javascript:void(0)" class="plus_btn" id="putCvpl"></a>';
		}
		cvplHtml += '<a href="javascript:void(0)" class="btn06 pop_close"></a>';
		cvplHtml += '</p>';
		cvplHtml += '<div class="pop_conts3">';
		cvplHtml += addr;
		cvplHtml += '</div>';
		cvplHtml += '</div>';

		cvplPopupOverlay.html(cvplHtml);

		cvplPopupOverlay.show();
		selectedObj.date = selectedObj.date + ' ' + selectedObj.time;
		
		$('#putCvpl').off().on('click',function(){
			$.ajax({
		        url : '/insertCvplData.do',
		        data: JSON.stringify(selectedObj),
		        type:'POST',
		        contentType: 'application/json'
			}).done(function(result){
				  selectedObj.type = 'selectedCvpl';
				  process.find('li[mode="3"]').trigger('click');
				  _MapEventBus.trigger(_MapEvents.alertShow, {text:'지점이 등록 되었습니다.'});
			});
		})
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
		},
		
		getMode: function(){
			return complaintStatusMode;
		}
    };
}();