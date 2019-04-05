var _ComplaintStatusInsert = function () {
	var bizUrl = window.location.protocol+'//'+window.location.host;
	var currentDate = {};
	
	var complaintStatusMode = 0; // 0 = 민원접수 선택 , 1 = 민원등록및 위치확인, 2 = 인근민원 확인, 3 = 악취분포 확인, 4 = 악취원점 분석, 5 = 악취 저감 조치
	
	var complaintStatusRegPopup , complaintStatusPopup, cvplPopupOverlay, process, bsmlPopup, bsmlPopup2, bufferRadius, clock, gridArea, legendDiv, smsPopup;
	
	var selectedObj = {};
	var popupOverlay;
	var smsText = '[악취발생 예보 알림]\n#date#\n악취확산이 예상되오니\n설비가동을 해주시면\n감사하겠습니다.';
	
	var layerName = ['cvplOnePoint','complaintStatusBuffer','bufferTarget'];
	var fixedMeasurement = 'fixedMeasurement';
	
	var regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
	
	var instFeature;
	
	var mapClickFlag = false;
	
	var init = function(){
		complaintStatusRegPopup = $('#complaintStatusRegPopup');
		complaintStatusPopup = $('#complaintStatusPopup');
		
		var ww = $(window).width();
		var wh = $(window).height();
		complaintStatusPopup.css('left', parseInt(ww/2)-parseInt(complaintStatusPopup.width()/2));
		complaintStatusPopup.css('top', (parseInt(wh/2)-parseInt(complaintStatusPopup.height()/2)-100));
		
		bsmlPopup = $('#bsmlPopup');
		bsmlPopup2 = $('#bsmlPopup2');
		bufferRadius = $('#bufferRadius');
		gridArea = $('#gridArea');
		legendDiv = $('#legendDiv');
		
		clock = $('#clock');
		
		smsPopup = $('#smsPopup');
		
		complaintStatusRegPopup.draggable({ containment: '#map' });
		complaintStatusPopup.draggable({ containment: '#map' });
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
		
		cvplPopupOverlay = $('#cvplPopupOverlay');
		process = $('#cvplProcess');
		
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
		    	clock.find('.day').text(currentDate.date.substring(0,4)+'-'+currentDate.date.substring(4,6)+'-'+currentDate.date.substring(6,8));
		    	
		    	if(currentDate.time){
		    		
		    		var timeStrArr = [0,0,0,0];
		    		
		    		if(parseInt(currentDate.time) > 9){
			    		timeStrArr[0] = currentDate.time.substr(0,1); 
			    		timeStrArr[1] = currentDate.time.substr(1,1); 
			    	}else{
			    		timeStrArr[1] = currentDate.time.substr(1,1);
			    	}
			    	
			    	for(var i = 0; i<timeStrArr.length; i++){
			    		$(clock.find('.time').find('em')[i]).text(timeStrArr[i]);
			    	}
		    	}
		    }
		});
		Object.defineProperty(currentDate, 'time', {
			get: function(){
				return this._time;
			},
			set: function(time) {
		    	this._time = time;
		    	clock.find('.day').text(currentDate.date.substring(0,4)+'-'+currentDate.date.substring(4,6)+'-'+currentDate.date.substring(6,8));
		    	var timeStrArr = [0,0,0,0];
		    	
		    	if(parseInt(currentDate.time) > 9){
		    		timeStrArr[0] = currentDate.time.substr(0,1); 
		    		timeStrArr[1] = currentDate.time.substr(1,1); 
		    	}else{
		    		timeStrArr[1] = currentDate.time.substr(1,1);
		    	}
		    	
		    	for(var i = 0; i<timeStrArr.length; i++){
		    		$(clock.find('.time').find('em')[i]).text(timeStrArr[i]);
		    	}
		    }
		});
		
		$('.workStep').on('click', function(event, obj){
			var mode = $(this).attr('mode');
			if(!obj){
				if(_SmellMapBiz.taskMode != 1){
					return;
				}
				
				if(complaintStatusMode < (parseInt(mode)-1)){
					return;
				}
				
				if(selectedObj){
					if(selectedObj.type == 'putCvpl' || selectedObj.type == 'updateCvpl'){
						_MapEventBus.trigger(_MapEvents.alertShow, {text:'등록을 하셔야 합니다.'});
						return;
					}
				}
				
				if(complaintStatusMode == mode){
					return;
				}
				if(mode > 1 && !selectedObj){
					return;
				}
			}
			changeMode(mode, obj);
		});
		
		$('#bufferRadiusSelect').off().on('change',function(){
			setBuffer($(this).val());
		});
		
		$('#cvplClose').off('click').on('click',function(){
			$(this).parent().parent().hide();
			changeMode(complaintStatusMode - 1);
    	});
		
		_MapEventBus.on(_MapEvents.map_singleclick, function(event, data){
			if(_SmellMapBiz.taskMode != 1){
				return;
			}
			 
			if(complaintStatusMode == 5){
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
			
			if(complaintStatusMode == 1){
				
			}else if(complaintStatusMode == 2){
				if(selectedObj.type=="putCvpl" || selectedObj.type=="updateCvpl"){
					var trans = new ol.proj.transform(data.result.coordinate, 'EPSG:3857','EPSG:4326');
					selectedObj.x = trans[0];
					selectedObj.y = trans[1];
					writePopup(true);
				}
			}else if(complaintStatusMode == 3){
				
			}else if(complaintStatusMode == 4){
				
			}else if(complaintStatusMode == 5){
				
			}else if(complaintStatusMode == 6 && feature){
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
						url:'/map/getBsmlReduceqpInfo.do', 
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
								$("#bsmlImg").attr("src","/map/images/"+data.BPLC_ID+".png");	
							}else{
								$("#bsmlImg").attr("src","/map/images/"+featureInfo.BPLC_ID+".png");
							}
							
							if(data.OPR_STTUS_NM != "ON"){
								$("#operate").html("<img src='/map/images/operate_off.png' alt='비가동' />비가동");
							}else{
								$("#operate").html("<img src='/map/images/operate_on.png' alt='가동' />가동");
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
				$('.bsmlPopupClose').off('click').on('click', function(){
					if(_SmellMapBiz.taskMode != 1){
						return;
					}
					changeMode(5);
					$('#smsPopupCloseBtn').trigger('click');
				}); 

				$('.sms_btn').off('click').on('click', function(){
					if(_SmellMapBiz.taskMode != 1){
						return;
					} 
					smsPopup.show();
					$('#smsContent').val(smsText.replace('#date#',currentDate.date.substr(0,4) + '년 ' + currentDate.date.substr(4,2) + '월 ' + currentDate.date.substr(6,2) + '일 ' + currentDate.time + '시'));
				});
				$('#smsPopupCloseBtn').off('click').on('click', function(){
					if(_SmellMapBiz.taskMode != 1){
						return;
					}
					smsPopup.hide();
				});
			}else if(complaintStatusMode == 0){
				var trans = new ol.proj.transform(data.result.coordinate, 'EPSG:3857','EPSG:4326');
				selectedObj = {};
				selectedObj.x = trans[0];
				selectedObj.y = trans[1];
				
				var resultFeature = new ol.Feature();

				resultFeature.setGeometry(new ol.geom.Point(data.result.coordinate));
				instFeature = resultFeature;
				
				process.find('li[mode="3"]').trigger('click',{mapClickFlag : true});
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
				
				$('#step3Li').show();
				$('#step1Name').html('접수민원 선택');
				
				$('#step4Title').html('STEP.4');
				$('#step5Title').html('STEP.5');
				$('#step6Title').html('STEP.6');
				
				process.find('li').removeClass('on');
				
				var flagProcess = 'cvplProcess';
				
				for(var i = 0; i<process.find('li').length; i++){
					var lc = '';
					var li = $(process.find('li')[i]);
					
					if(li.attr('class').indexOf('p_a') > -1){
						lc = '_mid';
					}else if(li.attr('class').indexOf('p_l') > -1){
						lc = '_last';
					}
					
					li.css('background-image','url("/map/images/' + flagProcess + lc + '_off.png")');
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
				process.hide();
				setProcessBtn(1);
				resetPreMode(1);
				complaintStatusPopup.hide();
				$('#complaintStatusRegPopup2').hide();
				smsPopup.hide();
				clearLayerByName(fixedMeasurement);
				$('#bufferRadiusSelect').val(200);
//				clearLayer();
			}
		});
	}
	
	var changeMode = function(mode, obj){
		if(mapClickFlag && mode < 4){
			mode = 0;
		}
		
		setProcessBtn(mode);
		
		var preFlag = true;
		
		if(complaintStatusMode > parseInt(mode)){
			resetPreMode(parseInt(mode));
			preFlag = false;
		}
		complaintStatusMode = parseInt(mode);
		
		if(mode != 3){
			$('#clock').css('bottom','120px');
		}
		
		if(mode == 1){
			complaintStatusPopup.show();
		}else if(mode == 2){
			writePopup();
		}else if(mode == 3){
			if(preFlag){
				setBuffer();	
			}else{
				if(_CoreMap.getMap().getLayerForName(layerName[1])){
					gridArea.show();
				}
				bufferRadius.show();
			}
		}else if(mode == 4 && preFlag){ 
			_MapEventBus.trigger(_MapEvents.show_odorSpread_layer, {});
			gridArea.hide();
			bufferRadius.hide();
			_MapEventBus.trigger(_MapEvents.hide_cvplPopup, {});
		}else if(mode == 5 && preFlag){
			
			// 1. 관심지역 등록 여부 확인 되있거나 안되있거나
			checkAnalsArea();
			
			// 2. 관심지역이 등록되어 있으면 이동경로 표시
			// 2-1. 관심지역으로 등록되어 있지 않으면 등록할지 물어 보고 등록  후에 3번부터  등록 안하면  끝
			// 3. 이동경로 표시 후 사업장 표시
			// 4. 저감시절 레이어 on
			// 5. 저감 시설, 시설물 클릭시 팝업 처리
//			_MapEventBus.trigger(_MapEvents.show_odorMovement_layer, {});
		}else if(mode == 0){
			_MapEventBus.trigger(_MapEvents.alertShow, {text:'화면을 클릭 하세요.'});
		}
		
		if(obj){
			mapClickFlag = true;
		}
	};
	var resetPreMode = function(mode){
		switch(mode) {
		
			case 0:
				mapClickFlag = false;
		    case 1:
//		    	complaintStatusPopup.show();
		    	clearLayerByName('cvplOnePoint');
				cvplPopupOverlay.hide();
				clock.hide();
				selectedObj = null; 
		    case 2:
		    	clearLayerByName(layerName[2]);
		    	clearLayerByName(layerName[1]);
		    	clearLayerByName('focusForCvpl');
		    	bufferRadius.hide();
		    	gridArea.hide();
		    	$('#bufferRadiusSelect').val(200);
		    	_MapEventBus.trigger(_MapEvents.hide_cvplPopup, {});
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
			$('.workStep[mode='+mode+']').css('background-image', 'url("/map/images'+$('.workStep[mode='+mode+']').css('background-image').split('images')[1].replace('_off','_on'));
			
			if(complaintStatusMode < mode){
				for(var i = 1; i<=mode; i++){
					$('.workStep[mode='+i+']').addClass('on');
					$('.workStep[mode='+i+']').css('background-image', 'url("/map/images'+$('.workStep[mode='+i+']').css('background-image').split('images')[1].replace('_off','_on'));
				}
			}else{
				for(var i = 6; i>mode; i--){
					$('.workStep[mode='+i+']').removeClass('on');
					$('.workStep[mode='+i+']').css('background-image', 'url("/map/images'+$('.workStep[mode='+i+']').css('background-image').split('images')[1].replace('_on','_off'));
				}  
			}
		}else{
			for(var i = 0; i < $('.workStep').length; i++){
				$($('.workStep')[i]).removeClass('on');
				$($('.workStep')[i]).css('background-image', 'url("/map/images'+$($('.workStep')[i]).css('background-image').split('images')[1].replace('_on','_off'));
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
		}else if(msg.type == 'updateCvpl'){
			selectedObj = msg;
			
			if(msg.lo!='' && msg.la != ''){
				selectedObj.x = parseFloat(msg.lo); 
				selectedObj.y = parseFloat(msg.la);
				
				_MapEventBus.trigger(_MapEvents.map_move, msg);
				
				writePopup(true);
			}
			
			_MapEventBus.trigger(_MapEvents.alertShow, {text:'지점을 클릭 하세요.'});
		}
	};
	
	var clearLayer = function(){
		for(var i = 0; i<layerName.length; i++){
			_MapEventBus.trigger(_MapEvents.map_removeLayerByName, layerName[i]);
		}
	}
	
	var clearLayerByName = function(layerNm){
		_MapEventBus.trigger(_MapEvents.map_removeLayerByName, layerNm);
	}
	
	var setBuffer = function(bufferMeter){
		bufferRadius.show();
		
		var x = selectedObj.x;
		var y = selectedObj.y;
		_CoreMap.getMap().getView().setZoom(17);
		_MapEventBus.trigger(_MapEvents.map_move, {x:x,y:y});
		
		if(!bufferMeter){
			bufferMeter = 250;
		}
    	
		clearLayer();
		cvplPopupOverlay.hide();
		
		Common.getData({url: '/map/getFeature.do', contentType: 'application/json', params: {contentsId:'complaintStatus',flag:1} }).done(function(data){
			
			var parser = new jsts.io.OL3Parser();
			var interFeatures = [];
			
			var originCoord = _CoreMap.convertLonLatCoord([x,y],true);
			var originFeature = new ol.Feature({geometry:new ol.geom.Point(originCoord), properties:null});
			
			var newFocusLayer = new ol.layer.Vector({
				source : new ol.source.Vector({
					features : [originFeature]
				}),
				style : new ol.style.Style({
					image: new ol.style.Circle({
						radius: 35,
						stroke: new ol.style.Stroke({
							color: '#f00',
							width: 6
						})
					})
				}),
				visible: true,
				zIndex:1,
				name:'focusForCvpl'
			});
			
			clearLayerByName('focusForCvpl');
			_MapEventBus.trigger(_MapEvents.map_addLayer, newFocusLayer);
			
			
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
			
			Common.getData({url:'/map/getGrid.do', contentType: 'application/json', params: {contentsId:'complaintStatus',flag:1, code:cvplNo.substr(0,cvplNo.length-1)} }).done(function(data){
				
				if($('#gridArea').height()==40){
					$('#clock').css('bottom','165px');
				}else{
					$('#clock').css('bottom','120px');
				}
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
		resultFeature.setProperties({CVPL_TY_CODE:selectedObj.flag.indexOf('CVP')>-1?selectedObj.flag:typeConfig[selectedObj.flag],CVPL_LC:title});

		var source = new ol.source.Vector({
			features: [resultFeature]
		});
		
		instFeature = resultFeature;

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
		if(selectedObj.type=='putCvpl'){
			cvplHtml += '<a href="javascript:void(0)" class="plus_btn" id="putCvpl"></a>';
		}else if(selectedObj.type=='updateCvpl'){
			cvplHtml += '<a href="javascript:void(0)" class="plus_btn" id="updateCvpl"></a>';
		}
		cvplHtml += '<a href="javascript:void(0)" class="btn06 pop_close" id="popClose"></a>';
		cvplHtml += '</p>';
		cvplHtml += '<div class="pop_conts3">';
		cvplHtml += addr;
		cvplHtml += '</div>';
		cvplHtml += '</div>';

		cvplPopupOverlay.html(cvplHtml);

		cvplPopupOverlay.show();
		
		if(!selectedObj.date.split(' ')[1]){
			selectedObj.date = selectedObj.date + ' ' + selectedObj.time;
		}
		
		$('#popClose').off('click').on('click',function(){
			$(this).parent().parent().parent().hide();
			changeMode(complaintStatusMode - 1);
		});
		
		$('#putCvpl').off().on('click',function(){
			$.ajax({
		        url : '/map/insertCvplData.do',
		        data: JSON.stringify(selectedObj),
		        type:'POST',
		        contentType: 'application/json'
			}).done(function(result){
				  selectedObj.type = 'selectedCvpl';
				  process.find('li[mode="3"]').trigger('click');
				  _MapEventBus.trigger(_MapEvents.alertShow, {text:'지점이 등록 되었습니다.'});
			});
		})
		
		$('#updateCvpl').off().on('click',function(){
			$.ajax({
		        url : '/map/updateCvplData.do',
		        data: JSON.stringify(selectedObj),
		        type:'POST',
		        contentType: 'application/json'
			}).done(function(result){
				  selectedObj.type = 'selectedCvpl';
				  process.find('li[mode="3"]').trigger('click');
				  _MapEventBus.trigger(_MapEvents.alertShow, {text:'수정이 되었습니다.'});
			});
		})
	};
	var clickCloseBtn = function(){
		clearLayerByName('focusForCvpl');
		clearLayerByName(layerName[1]);
		clearLayerByName(layerName[0]);
		
		if(!instFeature){
			return
		}
		
		var source = new ol.source.Vector({
			features: [instFeature]
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
		},
		clickCloseBtn:function(){
			clickCloseBtn();
		},
		getInstFeature:function(){
			return instFeature;
		}
    };
}();