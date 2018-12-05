var _OdorForeCast = function () {
	
	var bizUrl = window.location.protocol+'//'+window.location.host;
	
	var selectedObj;
	
	var odorForeCastStepMode = 0;
	
	var currentDate = {};
	
	var regExp = /[\{\}\[\]\/?.,;:|\)*~ `!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
	
	var smsText = '[악취발생 예보 알림]\n#date#\n악취확산이 예상되오니\n설비가동을 해주시면\n감사하겠습니다.';
	
	var odorForeCastPopup, bsmlPopup, bsmlPopup2, legendDiv, smsPopup, process, odorForeCastPopupTime;

	var locationLayer;
	
	var fixedMeasurement = 'fixedMeasurement';
	
	var init = function(){
		odorForeCastPopup = $('#odorForeCastPopup');
		process = $('.process');
		
		
		odorForeCastPopup.draggable({ containment: '#map' });
		
		var ww = $(window).width();
		var wh = $(window).height();
		
		odorForeCastPopup.css('left', parseInt(ww/2)-parseInt(odorForeCastPopup.width()/2));
		odorForeCastPopup.css('top', (parseInt(wh/2)-parseInt(odorForeCastPopup.height()/2)-100));
		
		bsmlPopup = $('#bsmlPopup');
		bsmlPopup2 = $('#bsmlPopup2');
		legendDiv = $('#legendDiv');
		odorForeCastPopupTime = $('#odorForeCastPopupTime');
		
		clock = $('#clock');
		
		smsPopup = $('#smsPopup');
		
		smsPopup.draggable({ containment: '#map' });

		bsmlPopup.draggable({ containment: '#map'  ,stop: function() {
			bsmlPopup2.css('left', bsmlPopup.css('left'));
			bsmlPopup2.css('top', bsmlPopup.css('top')); 
			smsPopup.css('left', (parseInt(bsmlPopup.css('left'))+210)+'px');
			smsPopup.css('top', bsmlPopup.css('top')); 
		}});
		bsmlPopup2.draggable({ containment: '#map' ,stop: function() {
			bsmlPopup.css('left', bsmlPopup2.css('left'));
			bsmlPopup.css('top', bsmlPopup2.css('top')); 
			
			smsPopup.css('left', (parseInt(bsmlPopup2.css('left'))+210)+'px');
			smsPopup.css('top', bsmlPopup2.css('top'));
		}});
		
		setEvent();
	};
	var setEvent = function(){
		$('#odorClose').off('click').on('click',function(){
			$(this).parent().parent().hide();
			changeMode(odorForeCastStepMode - 1);
    	});
		
		Object.defineProperty(currentDate, 'date', {
			get: function(){
				return this._date;
			},
			set: function(date) {
		    	this._date = date;
		    	clock.find('.day').text(currentDate.date.substring(0,4)+'년 '+parseInt(currentDate.date.substring(4,6))+'월 '+parseInt(currentDate.date.substring(6,8))+'일');
		    	clock.find('.time').text(parseInt(currentDate.time) + '시');
		    }
		});
		Object.defineProperty(currentDate, 'time', {
			get: function(){
				return this._time;
			},
			set: function(time) {
		    	this._time = time;
		    	clock.find('.day').text(currentDate.date.substring(0,4)+'년 '+parseInt(currentDate.date.substring(4,6))+'월 '+parseInt(currentDate.date.substring(6,8))+'일');
		    	clock.find('.time').text(parseInt(currentDate.time) + '시');
		    }
		});
		
		_MapEventBus.on(_MapEvents.map_singleclick, function(event, data){
			if(_SmellMapBiz.taskMode != 3){
				return;
			}
			if(odorForeCastStepMode == 5){
				changeMode(6);
			}
			
			var features = [];
			_CoreMap.getMap().forEachFeatureAtPixel(data.result.pixel, function(feature, layer){
				features.push(feature);
				
				var lyrNm = layer.get('name');
				if(lyrNm == fixedMeasurement){
					_WestCondition.onClickLayer(feature,lyrNm);
				}
			});
			
			var feature;
			
			if(features != null){
				for(var i=0; i<features.length; i++){
					if(features[i].getProperties().properties && features[i].getProperties().properties.type && features[i].getProperties().properties.type == 'buffer'){
						continue;
					}
					feature = features[i];
				}	
			}
			
			if(odorForeCastStepMode == 1){
			}else if(odorForeCastStepMode == 2){
			}else if(odorForeCastStepMode == 3){
				
			}else if(odorForeCastStepMode == 4){
				
			}else if(odorForeCastStepMode == 5){
				
			}else if(odorForeCastStepMode == 6 && feature){
				var featureInfo = feature.getProperties();
				if(featureInfo.properties){
					featureInfo = featureInfo.properties;
				}
				if(featureInfo.BSML_TRGNP){
					featureInfo.BSML_TRGNPT_SE_CODE = featureInfo.BSML_TRGNP;
				}
				
				if(featureInfo.BSML_TRGNPT_SE_CODE == 'BSL01002'){
					bsmlPopup.show(); 
					bsmlPopup2.hide();
					$.ajax({
						url:'/getBsmlReduceqpInfo.do', 
						data: JSON.stringify({
							bplcId:featureInfo.BPLC_ID
						})}).done(function(data){
							var bplcInfo = {};
							bplcInfo.bplcId = data.BPLC_ID; 
							bplcInfo.reducEqpNo = data.REDUC_EQP_NO;
							bplcInfo.ctrlCnCode = data.CTRL_CN_CODE;
							
							$("#bsmlName").html(data.BSML_TRGNPT_NM);
							var reduc = data.REDUC_EQP_NM?data.REDUC_EQP_NM:'분무식';
							$("#reducEqpNm").html(reduc);
							if(data.BPLC_ID){
								$("#bsmlImg").attr("src","/images/"+data.BPLC_ID+".png");	
							}else{
								$("#bsmlImg").attr("src","/images/"+featureInfo.BPLC_ID+".png");
							}
							
							if(data.OPR_STTUS_NM != "ON"){
								$("#operate").html("<img src='/images/operate_off.png' alt='비가동' />비가동");
							}else{
								$("#operate").html("<img src='/images/operate_on.png' alt='가동' />가동");
							} 
							
							$('#bsmlCtrlBtn').off('click').on('click', function(){
								if(confirm('원격제어를 하시겠습니까?')){
									_MapEventBus.trigger(_MapEvents.alertShow, {text:'저감시설원격제어가 완료되었습니다.'});
								} 
							});	
							/*if(bplcInfo.bplcId){
								$('#bsmlCtrlBtn').off('click').on('click', function(){
									if(confirm('원격제어를 하시겠습니까?')){
										$.ajax({
									        url : '/insertOnOff.do',
									        data: JSON.stringify(bplcInfo)
										}).done(function(result){
											  _MapEventBus.trigger(_MapEvents.alertShow, {text:'저감시설원격제어가 완료되었습니다.'});
										});
									}
								});	
							}*/
						});
				} else if(featureInfo.BSML_TRGNPT_SE_CODE == 'BSL01001' || featureInfo.BSML_TRGNPT_SE_CODE == 'BSL01003' || featureInfo.BSML_TRGNPT_SE_CODE == 'BSL01004') {
					bsmlPopup.hide();
					bsmlPopup2.show(); 
					$('#bsmlName2').html(featureInfo.CMPNY_NM);
				} else{
					return;
				}
				
				$('.bsmlPopupClose').on('click', function(){
					if(_SmellMapBiz.taskMode != 3){
						return;
					}
					changeMode(5);
					$('#smsPopupCloseBtn').trigger('click');
				}); 
				

				$('.sms_btn').on('click', function(){
					if(_SmellMapBiz.taskMode != 3){
						return;
					}
					smsPopup.show();
					$('#smsContent').val(smsText.replace('#date#',currentDate.date.substr(0,4) + '년 ' + currentDate.date.substr(4,2) + '월 ' + currentDate.date.substr(6,2) + '일 ' + currentDate.time + '시'));
				});
				$('#smsPopupCloseBtn').on('click', function(){
					if(_SmellMapBiz.taskMode != 3){
						return;
					}
					smsPopup.hide(); 
				});
			}
		});
		
		_MapEventBus.on(_MapEvents.task_mode_changed, function(event, data){
			if(data.mode == 3){
				odorForeCastPopup.show();
				
				$('#step3Li').hide();
				$('#step1Name').html('악취예보처리 선택');
				
				$('#step4Title').html('STEP.3'); 
				$('#step5Title').html('STEP.4');
				$('#step6Title').html('STEP.5');
				
				process.show();
				
				process.find('li').removeClass('on');
				
				for(var i = 0; i<process.find('li').length; i++){
					var li = $(process.find('li')[i]);
					li.css('background-image', 'url("../images'+li.css('background-image').split('images')[1].replace('_on','_off'));
				}
				changeMode(1); 
				
				setTimeout(function(){
					process.show();
				}, 100);
				
				_MapEventBus.trigger(_MapEvents.addWriteLayerForBiz, {
					layerId:fixedMeasurement
				});
			}else{
				// 초기화
				resetPreMode(1);
				process.hide();
				setProcessBtn(1);
				resetPreMode(1);
				odorForeCastPopup.hide();
				odorForeCastPopupTime.hide();
				smsPopup.hide();
				clearLayerByName(fixedMeasurement);
			}
		});
		
		$('.workStep').on('click', function(){
			if(_SmellMapBiz.taskMode != 3){
				return;
			}
			
			var mode = $(this).attr('mode');
			if(odorForeCastStepMode == 2 && mode == 4){
				changeMode(mode);
				return;
			}
			
			if(odorForeCastStepMode < (parseInt(mode)-1)){
				return;
			}
			if(odorForeCastStepMode == mode){
				return;
			}
			if(mode > 1 && !selectedObj){
				return;
			} 
			
			changeMode(mode);
		});
	};
	
	var changeMode = function(mode){
		setProcessBtn(mode);
		
		var preFlag = true;
		
		if(odorForeCastStepMode > parseInt(mode)){
			resetPreMode(parseInt(mode));
			preFlag = false;
		}
		odorForeCastStepMode = parseInt(mode);
		
		if(mode == 1){
			odorForeCastPopup.show();
		}else if(mode == 2){
			odorForeCastPopup.hide();
			odorForeCastPopupTime.hide();
			
			_MapEventBus.trigger(_MapEvents.map_move, selectedObj);	
			writePopup();
			 
		}else if(mode == 3){
		}else if(mode == 4 && preFlag){ 
			_MapEventBus.trigger(_MapEvents.show_odorSpread_layer, {});
		}else if(mode == 5 && preFlag){
			
			// 1. 관심지역 등록 여부 확인 되있거나 안되있거나
			checkAnalsArea();
		}
	};
	
	var resetPreMode = function(mode){
		switch(mode) {
		    case 1:
		    	odorForeCastPopup.show();
		    	clearLayerByName('locationLayer');
				clock.hide();
				selectedObj = null;
		    case 2:
		    case 3: // 악취 확산 격자
		    	_MapEventBus.trigger(_MapEvents.hide_odorSpread_layer, {});
		    	legendDiv.hide();
		    case 4: // 악취원점 저감시설, 이동경로 닫기
		    	_MapEventBus.trigger(_MapEvents.hide_odorMovement_layer, {});
		    	clearLayerByName('odorOrigin');
		    case 5:  // 저감시설 및 악취원점 팝업 닫기
		    	bsmlPopup.hide(); 
		    	bsmlPopup2.hide();
		    	$('#smsPopupCloseBtn').trigger('click');
		    case 6: 
		}
	}
	var setProcessBtn = function(mode){
		if(mode != 0){
			$('.workStep[mode='+mode+']').addClass('on');
			$('.workStep[mode='+mode+']').css('background-image', 'url("../images'+$('.workStep[mode='+mode+']').css('background-image').split('images')[1].replace('_off','_on'));
			
			if(odorForeCastStepMode < mode){
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
		}else{
			$('.workStep[mode="1"]').removeClass('on');
			$('.workStep[mode="1"]').css('background-image', 'url("../images'+$('.workStep[mode="1"]').css('background-image').split('images')[1].replace('_on','_off'));
		}
	}
	
	var checkAnalsArea = function(){
		var coord = [selectedObj.x, selectedObj.y];
		
		var analsAreaRequest = new ol.format.WFS().writeGetFeature({
	        srsName: 'EPSG:3857',
	        featureNS: _MapServiceInfo.serviceUrl,
	        featurePrefix: 'CE-TECH',
	        featureTypes: ['shp_anals_area_new'],
	        outputFormat: 'application/json',
	        filter : new ol.format.filter.Contains('SHAPE', new ol.geom.Point(coord), 'EPSG:3857')
		});
		 
		$.ajax({
			  url: _MapServiceInfo.serviceUrl+'/geoserver/CE-TECH/ows',
			  type:'POST',
			  data: new XMLSerializer().serializeToString(analsAreaRequest)
			}).done(function(result) {
				if(result == null || result.features == null || result.features.length <= 0){
					_MapEventBus.trigger(_MapEvents.alertShow, {text:'악취확산 격자 영역 밖입니다.'});
					return;
				}
				var analsAreaInfo = result.features[0].properties;
					
//				if(analsAreaInfo.REG == '0'){
//					var regFlag = confirm('해당지역은 관심저점 등록이 되어있지 않습니다. 등록하시겠습니까?');
//					if(regFlag){
//						$.ajax({
//				            url : bizUrl+'/insertAnals.do',
//				            data: JSON.stringify({indexId:analsAreaInfo.ANALS_AREA_ID, predictAl:'0'})
//				    	}).done(function(result){
//				    		_MapEventBus.trigger(_MapEvents.show_odorMovement_layer, {analsAreaId:analsAreaInfo.ANALS_AREA_ID});
//				    	});
//					}else{
//						return;
//					}
//				}else{
				_MapEventBus.trigger(_MapEvents.show_odorMovement_layer, {analsAreaId:analsAreaInfo.ANALS_AREA_ID});
//				}
			});
	};
	
	var setProcMsg = function(msg){
		if(msg.type == 'odorSelected'){
			currentDate.date = msg.date.replace(regExp, '');
			currentDate.time = msg.time;
			
			$.ajax({
				url:'/getOdorForecastXY.do', 
				data: JSON.stringify({
					gridId:msg.gridId
				})}).done(function(data){
					if(data == null || data.length <= 0){
						_MapEventBus.trigger(_MapEvents.alertShow, {text:'관심지역 정보가 없습니다.'});
						return;
						
					}
					
					var xy = data[0].shape;
					selectedObj = {};
					
					selectedObj.x  = xy.split(' ')[0].substr(xy.indexOf('(')+1);
					selectedObj.y  = xy.split(' ')[1].substring(0, xy.split(' ')[1].indexOf(')'));
					 
					var coord = ol.proj.transform([parseFloat(selectedObj.x), parseFloat(selectedObj.y)], 'EPSG:4326', 'EPSG:3857');
					selectedObj.x  = coord[0];
					selectedObj.y  = coord[1];
					
					_MapEventBus.trigger(_MapEvents.setCurrentDate, currentDate);
					
					_MapEventBus.trigger(_MapEvents.map_move, selectedObj);
					
					changeMode(2);
				});
		}
	};
	
	var clearLayerByName = function(layerNm){
		_MapEventBus.trigger(_MapEvents.map_removeLayerByName, layerNm);
	}; 
	
	var writePopup = function(){
		var x = parseFloat(selectedObj.x);
		var y = parseFloat(selectedObj.y);
		 
		var centerPoint =_CoreMap.convertLonLatCoord([x,y],true);
		
		clock.show();

		clearLayerByName('locationLayer');

		var resultFeature = new ol.Feature();

		resultFeature.setGeometry(new ol.geom.Point(centerPoint));
		resultFeature.setProperties({});
 
		var source = new ol.source.Vector({
			features: [resultFeature]
		});

		locationLayer = new ol.layer.Vector({
			source: source,
			zIndex:10000,
			name:'locationLayer',
			style:function(feature){
				return new ol.style.Style({
		    		image: new ol.style.Icon(({
		    			src: '../images/pin2.png',
		    			scale:1.0
		    		})) 
		    	}); 
			}
		}); 
 
		_MapEventBus.trigger(_MapEvents.map_addLayer, locationLayer);
	};
	
	return {
		init: function(){
			init();
		},
		setProcMsg: function(msg){
			setProcMsg(msg);
		}
    };
}();