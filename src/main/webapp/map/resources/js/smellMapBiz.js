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
	
	var bizLayers = {'CELL9KM' : 'shp_anals_area_new',//'cell_200m_utmk',
					 'ALL9KM' : 'ALL_CMAQ_9KM',
			         'LINE' : 'line_test_wgs84',
			         'POINT' : 'CELL_AIR_9KM_PT',
			         'WEATHER_FORECAST':'weather_forecast',
			         'WEATHER_NOW':'weather_now',
			         'ANALS_AREA':'shp_anals_area',
			         'COURS':'COURS',
			         'ANALS_POINT_NOW': 'anals_point_now',
			         'ANALS_POINT_FORECAST': 'anals_point_forecast'};
	
	// 특수문자 제거 정규표현식
	var regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
	
	var highlightVectorLayer;
	var popupOverlay;
	
	var noCacheCount = 0;
	
	// 기상장 분석 부분
	var weatherAnalysisLayer;
	var weatherAnalysisStartDates;
	var weatherAnalysisTimeSeries = [];
	var weatherAnalysisIndex = 0;
	var weatherAnalysisInterval = null;
	var weatherAnalysisPlayType = 0; // 0 = 정지  1 = 재생  2 = 일시정지
	var weatherAnalysisIntervalTime = 3;
	
	// 악취확산분석
	var odorSpreadStartDates;
	var odorSpreadLayer;
	var odorSpreadHeatMapLayer;
	var odorSpreadTimeSeries = [];
	var odorSpreadIndex = 0;
	var odorSpreadInterval = null;
	var odorSpreadPlayType = 0; // 0 = 정지  1 = 재생  2 = 일시정지
	var odorSpreadIntervalTime = 3;
	var odorSpreadMapType = 'cell';
	
	var odorSpreadZoomLevel = 0;
	var odorSpreadHeatMapBlur = 30;
	var odorSpreadHeatMapRadius = 18;
	
	// 악취 이동경로 
	var odorMovementLayer = null;
	var trackingFeatures;
	var trackingIdx = 0;
	var trackingInterval = null;
	var trackingPlayType = 0; // 0 = 정지  1 = 재생  2 = 일시정지
	var trackingIntervalTime = 1000;
	
	var originLayer  = null; 
	
	var bufferOriginLayer = null;
	var bufferOriginFeature = null;
	var bufferMeter = 200;
	
	var init = function(){
		proj4.defs('EPSG:32652','+proj=utm +zone=52 +ellps=WGS84 +datum=WGS84 +units=m +no_defs ');
		proj4.defs('EPSG:5179','+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs');
		
		ol.proj.proj4.register(proj4);
			
		setEvent();
		
		setComponents();
		
		setPopupOverlay();
		
	}
	var setComponents = function(){
		var toDay = new Date();
		var hour = toDay.getHours()-1;
		if(hour < 0 ){
			hour = 0;
		}
		var timeOptions = '';
		for(var i=0; i<24; i++){
			timeOptions += '<option '+(i==hour?'selected':'')+' value="'+(i<10 ? ('0'+i): i) +'">'+i+'시</option>';
		}
		
		//기상장
		$('#weatherAnalysisStartTime').html(timeOptions);
		$('#weatherAnalysisEndTime').html(timeOptions);
		
		weatherAnalysisStartDates = $( "#weatherAnalysisStartDate, #weatherAnalysisEndDate" ).datepicker($.extend(datePickerDefine,{
			  yearSuffix: '년',
			  onSelect: function( selectedDate ) {
				  if(this.id == "distributionChartStartDate"){
				      instance = $( this ).data( "datepicker" ),
				      date = $.datepicker.parseDate(
				        instance.settings.dateFormat ||
				        $.datepicker._defaults.dateFormat,
				        selectedDate, instance.settings );
					  distributionChartDates.not( this ).datepicker( "option", "minDate", date );
				  }
			  }
		}));
		
		$('#weatherAnalysisStartDate').datepicker('setDate', toDay);
		$('#weatherAnalysisEndDate').datepicker('setDate', toDay);
		$('#weatherAnalysisStartDate').datepicker( "option", "maxDate", toDay );
		$('#weatherAnalysisEndDate').datepicker( "option", "maxDate", toDay );
		
		//악취 확산 분석
		$('#odorSpreadStartTime').html(timeOptions);
		$('#odorSpreadEndTime').html(timeOptions);
		
		odorSpreadStartDates = $( "#odorSpreadStartDate, #odorSpreadEndDate" ).datepicker($.extend(datePickerDefine,{
			  yearSuffix: '년',
			  onSelect: function( selectedDate ) {
				  if(this.id == "distributionChartStartDate"){
				      instance = $( this ).data( "datepicker" ),
				      date = $.datepicker.parseDate(
				        instance.settings.dateFormat ||
				        $.datepicker._defaults.dateFormat,
				        selectedDate, instance.settings );
				      odorSpreadStartDates.not( this ).datepicker( "option", "minDate", date );
				  }
			  }
		}));
		
		$('#odorSpreadStartDate').datepicker('setDate', toDay);
		$('#odorSpreadEndDate').datepicker('setDate', toDay);
		$('#odorSpreadStartDate').datepicker( "option", "maxDate", toDay );
		$('#odorSpreadEndDate').datepicker( "option", "maxDate", toDay );

		// 악취 경로
		$('#odorMovementStartDate').datepicker('setDate', toDay);
		
		$('#odorMovementStartDate').datepicker( "option", "maxDate", toDay );
		
		$('#odorMovementStartTime').html(timeOptions);
		
		setIntrstCombo();
	}
	
	var setIntrstCombo = function(){
		$.ajax({
            url: '/getIntrstList.do',
        }).done(function(result){
        	var intrstOptions = '';
        	for(var i=0; i<result.length; i++){
        		intrstOptions += '<option  value="'+result[i].analsAreaId+'">'+result[i].intrstAreaNm+'('+result[i].analsAreaId+')</option>';
    		}
        	$('#odorMovementItem').html(intrstOptions); 
        });	
	}
	var setSensorCombo = function(){
		$.ajax({
            url: '/getSensorList.do',
        }).done(function(result){
        	var intrstOptions = '';
        	for(var i=0; i<result.length; i++){
        		intrstOptions += '<option  value="'+result[i].spotCode+'">'+result[i].sensorNm+'('+result[i].spotCode+')</option>';
    		}
        	$('#odorMovementItem').html(intrstOptions); 
        });	
	}
	
	var setPopupOverlay = function(){
		popupOverlay = new ol.Overlay({
	    	element: document.getElementById('popupOverlay')
	    });
		_CoreMap.getMap().addOverlay(popupOverlay);
	}
	
	var setCurrentDateTime = function(dateObj){
		
		var date = new Date(dateObj.date.substring(0,4),parseInt(dateObj.date.substring(4,6))-1, dateObj.date.substring(6,8));
		
		// 기상장
		if(dateObj.time){
			$('#weatherAnalysisStartTime').val(dateObj.time);
			$('#weatherAnalysisEndTime').val(dateObj.time);
			$('#odorSpreadStartTime').val(dateObj.time);
			$('#odorSpreadEndTime').val(dateObj.time);
			$('#odorMovementStartTime').val(dateObj.time)
		}
		
		$('#weatherAnalysisStartDate').datepicker('setDate', date);
		$('#weatherAnalysisEndDate').datepicker('setDate', date);
		// 확산
		$('#odorSpreadStartDate').datepicker('setDate', date);
		$('#odorSpreadEndDate').datepicker('setDate', date);
		// 이동경로
		$('#odorMovementStartDate').datepicker('setDate', date);
		
	}
	
	var setEvent = function(){
		$('#popup-closer').on('click', function(){
			 $('#popupOverlay').hide();
			 $('#popup-content').hide();
			 if(highlightVectorLayer){
				 _MapEventBus.trigger(_MapEvents.map_removeLayer, highlightVectorLayer);
				 highlightVectorLayer = null;
			 }
		});
		_MapEventBus.on(_MapEvents.task_mode_changed, function(event, data){
			// GIS 모드
			_SmellMapBiz.taskMode = data.mode;
			layerCloseAll();
			$('#legendDiv').hide();
		});
		
		_MapEventBus.on(_MapEvents.setCurrentDate, function(event, data){
			setCurrentDateTime(data);
		});
		
		_MapEventBus.on(_MapEvents.hide_odorSpread_layer, function(event, data){
			if(odorSpreadLayer){
				_MapEventBus.trigger(_MapEvents.map_removeLayer, odorSpreadLayer);
				odorSpreadLayer = null;
				
				if(odorSpreadInterval){
					clearInterval(odorSpreadInterval);
					odorSpreadInterval = null;	
				}
			}
		});
		_MapEventBus.on(_MapEvents.show_odorSpread_layer, function(event, data){
			$('#odorSpreadStop').trigger('click');
			$('#odorSpreadPlay').trigger('click');
		});		
		
		_MapEventBus.on(_MapEvents.hide_odorMovement_layer, function(event, data){
			if(odorMovementLayer){
				_MapEventBus.trigger(_MapEvents.map_removeLayer, odorMovementLayer);
				if(originLayer){
					_MapEventBus.trigger(_MapEvents.map_removeLayer, originLayer);	
				}
				if(bufferOriginLayer){
					_MapEventBus.trigger(_MapEvents.map_removeLayer, bufferOriginLayer);	
				}
				odorMovementLayer = null;
				originLayer = null;
				bufferOriginLayer = null;
				 
				if(trackingInterval){
					clearInterval(trackingInterval);	
					trackingInterval = null;
				}
			}
		});
		_MapEventBus.on(_MapEvents.show_odorMovement_layer, function(event, data){
			var analsAreaId = data.analsAreaId;
			$.ajax({
	            url: '/getAnalsAreaId.do',
	            data:JSON.stringify({analsAreaId:analsAreaId})
	        }).done(function(result){
	        	if(result==null || result.length <= 0){
	        		_MapEventBus.trigger(_MapEvents.alertShow, {text:'관심지역 등록정보가 없습니다.'});
	        		return;
	        	}
	        	var analsId = result[0].analsAreaId;
	        	var gridAreaId = result[0].gridAreaId;
	        	analsId = '2930'
	        	startTracking(analsId);
	        });
		});
		
		_MapEventBus.on(_MapEvents.clickLayerOnOff, function(event, data){
			if(data.target == 'weatherAnalysis'){
				if(weatherAnalysisLayer){
					weatherAnalysisLayer.setVisible(data.isShow);
				}
			}else if(data.target == 'odorSpread'){
				if(odorSpreadMapType == 'cell'){
					if(odorSpreadLayer){
						odorSpreadLayer.setVisible(data.isShow);
					}	
				}else{
					if(odorSpreadHeatMapLayer){
						odorSpreadHeatMapLayer.setVisible(data.isShow);
					}	
				}
			}else if(data.target == 'odorMovement'){
				if(odorMovementLayer){
					odorMovementLayer.setVisible(data.isShow);
					if(originLayer){
						originLayer.setVisible(data.isShow);	
					}
					
					if(bufferOriginLayer){
						originLayer.setVisible(data.isShow);
					}
				}
			}
		});
		
		_MapEventBus.on(_MapEvents.map_singleclick, function(event, data){
			if(_SmellMapBiz.taskMode > 0){
				return;
			}
			
			var feature = _CoreMap.getMap().forEachFeatureAtPixel(data.result.pixel,function(feature, layer){
				var lyrNm = layer.get('name');
				
				if(_WestCondition.getContentsConfig()[layer.get('name')] && layer.get('name') != 'iotSensorInfo'){
					if(_CoreMap.getMap().getLayerForName(lyrNm)){
						_WestCondition.onClickLayer(feature,lyrNm);
					}
				}
			});
		});
		
		_MapEventBus.on(_MapEvents.map_mousemove, function(event, data){
			var coreMap = _CoreMap.getMap();
			var pixel = coreMap.getEventPixel(data.result.originalEvent);
			var hit = coreMap.forEachFeatureAtPixel(pixel, function(feature, layer) {
				if(_WestCondition.getContentsConfig()[layer.get('name')] && layer.get('name') != 'iotSensorInfo'){
					return true;
				}else if(layer.get('name')=='chartModeLayer'){
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
			
			var zoom = _CoreMap.getMap().getView().getZoom();
			
			
			if(odorSpreadZoomLevel != zoom){
				if(odorSpreadMapType == 'heat'){
					if(odorSpreadHeatMapLayer){
						if(zoom < 13){
							odorSpreadHeatMapBlur = 100;
							odorSpreadHeatMapRadius = 10;
						}else {
							if(zoom == 13){
								odorSpreadHeatMapBlur = 30;
								odorSpreadHeatMapRadius = 18;
							}else if(zoom == 14){
								odorSpreadHeatMapBlur = 30;
								odorSpreadHeatMapRadius = 28;
							}else if(zoom == 15){
								odorSpreadHeatMapBlur = 50;
								odorSpreadHeatMapRadius = 50;
							}else if(zoom == 16){
								odorSpreadHeatMapBlur = 90;
								odorSpreadHeatMapRadius = 80;
							}else if(zoom == 17){
								odorSpreadHeatMapBlur = 100;
								odorSpreadHeatMapRadius = 70;
							}else{
								odorSpreadHeatMapBlur = 0;
								odorSpreadHeatMapRadius = 0;
							}
						}
						odorSpreadHeatMapLayer.setBlur(odorSpreadHeatMapBlur);
						odorSpreadHeatMapLayer.setRadius(odorSpreadHeatMapRadius);
					}
				}	
			}
			odorSpreadZoomLevel = zoom;
		});
		
		$('a[name="weatherType"]').on('click', function(){
			$('a[name="weatherType"]').removeClass('on');
			$(this).addClass('on');
			var layerNm = $('a[name="weatherType"][class="on"]').attr('value');
			var toDay = new Date();
			
			// 실시간 
			if(layerNm == 'weather_now'){
				$('#weatherAnalysisStartDate').datepicker('setDate', toDay);
				$('#weatherAnalysisEndDate').datepicker('setDate', toDay);
				
				$('#weatherAnalysisStartDate').datepicker( "option", "minDate", null );
				$('#weatherAnalysisEndDate').datepicker( "option", "minDate", null );
				
				$('#weatherAnalysisStartDate').datepicker( "option", "maxDate", toDay );
				$('#weatherAnalysisEndDate').datepicker( "option", "maxDate", toDay );
			}else{ // 예보
				
				$('#weatherAnalysisStartDate').datepicker('setDate', toDay);
				$('#weatherAnalysisEndDate').datepicker('setDate', toDay);
				
				$('#weatherAnalysisStartDate').datepicker( "option", "maxDate", null );
				$('#weatherAnalysisEndDate').datepicker( "option", "maxDate", null );
				
				$('#weatherAnalysisEndDate').datepicker( "option", "minDate", toDay );
				$('#weatherAnalysisStartDate').datepicker( "option", "minDate", toDay );
			}
			if(weatherAnalysisLayer){
				
				_MapEventBus.trigger(_MapEvents.map_removeLayer, weatherAnalysisLayer);
				weatherAnalysisLayer = null;
				clearInterval(weatherAnalysisInterval);
				
				weatherAnalysisInterval = null;
				weatherAnalysisPlayType = 0;
				setControlButton('weatherAnalysisPlay', weatherAnalysisPlayType);
			}
		})
		$('#weatherWsBtn').on('click', function(){
			updateWeatherStyle();
		})
		$('#weatherMeasurement').on('change', function(){
			updateWeatherStyle();
		})
		
		var updateWeatherStyle = function(){
			if(weatherAnalysisLayer){
				var weatherOnOff = $('#weatherWsBtn').attr('value');
				var weatherMeasurement = $('#weatherMeasurement').val();
				var styleNm = weatherMeasurement+weatherOnOff;
				
				if(styleNm == ''){
					weatherAnalysisLayer.setVisible(false);
					return;
				}
				weatherAnalysisLayer.setVisible(true);
				
				for(var i=0; i<weatherAnalysisTimeSeries.length; i++){
					weatherAnalysisTimeSeries[i].style = styleNm;
				}
				updateLayer(weatherAnalysisLayer, weatherAnalysisTimeSeries[weatherAnalysisIndex]);
			}
		}
		
		// 기상장 분석
		$('#weatherAnalysisPlay').on('click', function(){
			if(weatherAnalysisPlayType == 0){
				var layerNm = $('a[name="weatherType"][class="on"]').attr('value');
				
				var weatherOnOff = $('#weatherWsBtn').attr('value');
				var weatherMeasurement = $('#weatherMeasurement').val();
				
				if((weatherOnOff == null || weatherOnOff == '') && weatherMeasurement == ''){
					if(weatherAnalysisLayer){
						_MapEventBus.trigger(_MapEvents.map_removeLayer, weatherAnalysisLayer);
						weatherAnalysisLayer = null;
						
						clearInterval(weatherAnalysisInterval);
						weatherAnalysisInterval = null;
					}
					return;
				}
				
				var styleNm = weatherMeasurement+weatherOnOff;
				
				var weatherAnalysisStartDate = $('#weatherAnalysisStartDate').val().replace(regExp, '');
				var weatherAnalysisStartTime = parseInt($('#weatherAnalysisStartTime').val());
				if(weatherAnalysisStartTime < 10){
					weatherAnalysisStartTime = '0'+weatherAnalysisStartTime;
				}
				var weatherAnalysisEndDate= $('#weatherAnalysisEndDate').val().replace(regExp, '');
				var weatherAnalysisEndTime = $('#weatherAnalysisEndTime').val();	
				if(weatherAnalysisEndTime < 10){
					weatherAnalysisEndTime = '0'+weatherAnalysisEndTime;
				}
				
				if(weatherAnalysisStartDate == weatherAnalysisEndDate){
					if(parseInt(weatherAnalysisStartTime) > parseInt(weatherAnalysisEndTime)){
						_MapEventBus.trigger(_MapEvents.alertShow, {text:'같은 날짜일때 두번째 시간이 더 빠를 수 없습니다.'});
						return;
					}	
				}
				
				if(weatherAnalysisLayer){
					_MapEventBus.trigger(_MapEvents.map_removeLayer, weatherAnalysisLayer);
					weatherAnalysisLayer = null;
					
					clearInterval(weatherAnalysisInterval);
					weatherAnalysisInterval = null;
				}
				
				weatherAnalysisTimeSeries = setTimeSeries(weatherAnalysisStartDate, weatherAnalysisEndDate, weatherAnalysisStartTime, weatherAnalysisEndTime, layerNm, styleNm);
				weatherAnalysisIndex = 0;
				
				var layerInfos = [{layerNm:layerNm,style:styleNm,isVisible:true,isTiled:true,cql:null,opacity:0.7, cql:'DTA_DT=\''+weatherAnalysisStartDate+weatherAnalysisStartTime+'\'', zIndex:4}];
				weatherAnalysisLayer = _CoreMap.createTileLayer(layerInfos)[0];
				_MapEventBus.trigger(_MapEvents.map_addLayer, weatherAnalysisLayer);
				
				setCurrentDate({date:weatherAnalysisStartDate, time:weatherAnalysisStartTime}, 'weatherAnalysisDate');
				playWeatherAnalysisLayer();
				weatherAnalysisPlayType = 1;
				setControlButton('weatherAnalysisPlay', weatherAnalysisPlayType);
			}else if(weatherAnalysisPlayType == 1){
				
				clearInterval(weatherAnalysisInterval);
				weatherAnalysisInterval = null;
				weatherAnalysisPlayType = 2;
				
				setControlButton('weatherAnalysisPlay', weatherAnalysisPlayType);
			}else if(weatherAnalysisPlayType == 2){
				
				playWeatherAnalysisLayer();
				weatherAnalysisPlayType = 1;
				setControlButton('weatherAnalysisPlay', weatherAnalysisPlayType);
			}
		});
		$('#weatherAnalysisStop').on('click', function(){
			clearInterval(weatherAnalysisInterval);
			weatherAnalysisInterval = null;
			weatherAnalysisPlayType = 0;
			setControlButton('weatherAnalysisPlay', weatherAnalysisPlayType);
		});
		$('#weatherAnalysisPrevious').on('click', function(){
			if(weatherAnalysisLayer){
				clearInterval(weatherAnalysisInterval);
				weatherAnalysisInterval = null;
				if(weatherAnalysisPlayType == 1){
					weatherAnalysisPlayType = 2;	
				}
				weatherAnalysisIndex--;
				
				if(weatherAnalysisIndex < 0){
					weatherAnalysisIndex = 0;
//					return;
				}
				setControlButton('weatherAnalysisPlay', weatherAnalysisPlayType);
				updateLayer(weatherAnalysisLayer, weatherAnalysisTimeSeries[weatherAnalysisIndex]);
				setCurrentDate(weatherAnalysisTimeSeries[weatherAnalysisIndex], 'weatherAnalysisDate');
			}
		});
		$('#weatherAnalysisNext').on('click', function(){
			if(weatherAnalysisLayer){
				clearInterval(weatherAnalysisInterval);
				weatherAnalysisInterval = null;
				if(weatherAnalysisPlayType == 1){
					weatherAnalysisPlayType = 2;	
				}
				weatherAnalysisIndex++;
				if(weatherAnalysisTimeSeries.length <= (weatherAnalysisIndex+1)){
					weatherAnalysisIndex = weatherAnalysisTimeSeries.length-1;
//					return;
					weatherAnalysisPlayType = 0;
				}
				
				setControlButton('weatherAnalysisPlay', weatherAnalysisPlayType);
				updateLayer(weatherAnalysisLayer, weatherAnalysisTimeSeries[weatherAnalysisIndex]);
				setCurrentDate(weatherAnalysisTimeSeries[weatherAnalysisIndex], 'weatherAnalysisDate');
			}
		}); 
		
		// 악취 확산 분석
		$('#odorSpreadPlay').on('click', function(){
			if(odorSpreadPlayType == 0){
				var layerNm =  $('a[name="odorSpreadLayerType"][class="on"]').attr('value');
				var mapType = $('input[name="odorSpreadMapType"]:checked').val();
				
				odorSpreadMapType = mapType;
				
				var odorSpreadStartDate = $('#odorSpreadStartDate').val().replace(regExp, '');
				var odorSpreadStartTime = parseInt($('#odorSpreadStartTime').val());
				if(odorSpreadStartTime < 10){
					odorSpreadStartTime = '0'+odorSpreadStartTime;
				}
				var odorSpreadEndDate= $('#odorSpreadEndDate').val().replace(regExp, '');
				var odorSpreadEndTime = $('#odorSpreadEndTime').val();	
				if(odorSpreadEndTime < 10){
					odorSpreadEndTime = '0'+odorSpreadEndTime;
				}
				
				if(odorSpreadStartDate == odorSpreadEndDate){
					if(parseInt(odorSpreadStartTime) > parseInt(odorSpreadEndTime)){
						_MapEventBus.trigger(_MapEvents.alertShow, {text:'같은 날짜일때 두번째 시간이 더 빠를 수 없습니다.'});
						return;
					}	
				}
				
				if(odorSpreadLayer){
					_MapEventBus.trigger(_MapEvents.map_removeLayer, odorSpreadLayer);
					odorSpreadLayer = null;
					
					clearInterval(odorSpreadInterval);
					odorSpreadInterval = null;
				}
				if(odorSpreadHeatMapLayer){
					_MapEventBus.trigger(_MapEvents.map_removeLayer, odorSpreadHeatMapLayer);
					odorSpreadHeatMapLayer = null;
				}
				
				odorSpreadTimeSeries = setTimeSeries(odorSpreadStartDate, odorSpreadEndDate, odorSpreadStartTime, odorSpreadEndTime, layerNm, null);
				odorSpreadIndex = 0;
				
				if(mapType == 'cell'){
					var layerInfos = [{layerNm:layerNm,style:null,isVisible:true,isTiled:true,cql:null,opacity:0.7, cql:'DTA_DT=\''+odorSpreadStartDate+odorSpreadStartTime+'\'', zIndex:4}];
					odorSpreadLayer = _CoreMap.createTileLayer(layerInfos)[0];
					_MapEventBus.trigger(_MapEvents.map_addLayer, odorSpreadLayer);
					
					setCurrentDate({date:odorSpreadStartDate, time:odorSpreadStartTime}, 'odorSpreadDate');
					playOdorSpreadLayer();
					
					odorSpreadPlayType = 1;
					setControlButton('odorSpreadPlay', odorSpreadPlayType);
					
					$('#legendDiv').show();
					
				}else{
					if(layerNm.indexOf('now') >= 0){
						layerNm = bizLayers.ANALS_POINT_NOW;
					}else{
						layerNm = bizLayers.ANALS_POINT_FORECAST
					}
					drawHeatMapLayer(layerNm);
				}
			}else if(odorSpreadPlayType == 1){
				clearInterval(odorSpreadInterval);
				odorSpreadInterval = null;
				odorSpreadPlayType = 2;
				setControlButton('odorSpreadPlay', odorSpreadPlayType);
			}else if(odorSpreadPlayType == 2){
				odorSpreadPlayType = 1;
				playOdorSpreadLayer();
				setControlButton('odorSpreadPlay', odorSpreadPlayType);
			}
		});
		$('#odorSpreadStop').on('click', function(){
			clearInterval(odorSpreadInterval);
			odorSpreadInterval = null;
			odorSpreadPlayType = 0;
			setControlButton('odorSpreadPlay', odorSpreadPlayType);
		});
		$('#odorSpreadPrevious').on('click', function(){
			var mapType = $('input[name="odorSpreadMapType"]:checked').val();
			if(odorSpreadInterval){
				clearInterval(odorSpreadInterval);
				odorSpreadInterval = null;
			}
			if(odorSpreadPlayType == 1){
				odorSpreadPlayType = 2;	
			}
			odorSpreadIndex--;
			if(odorSpreadIndex < 0){
				odorSpreadIndex = 0;
			}
			setControlButton('odorSpreadPlay', odorSpreadPlayType);
			
			if(mapType == 'cell'){
				if(odorSpreadLayer){
					updateLayer(odorSpreadLayer, odorSpreadTimeSeries[odorSpreadIndex]);
					setCurrentDate(odorSpreadTimeSeries[odorSpreadIndex], 'odorSpreadDate');
				}
			}else{
				var layerNm = $('a[name="odorSpreadLayerType"][class="on"]').attr('value');
				if(layerNm.indexOf('now') >= 0){
					layerNm = bizLayers.ANALS_POINT_NOW;
				}else{
					layerNm = bizLayers.ANALS_POINT_FORECAST
				}
				
				if(odorSpreadHeatMapLayer){
					_MapEventBus.trigger(_MapEvents.map_removeLayer, odorSpreadHeatMapLayer);
					odorSpreadHeatMapLayer = null;
				}
				drawHeatMapLayer(layerNm);
			}
		});
		$('#odorSpreadNext').on('click', function(){
			
			var mapType = $('input[name="odorSpreadMapType"]:checked').val();
			
			if(odorSpreadInterval){
				clearInterval(odorSpreadInterval);
				odorSpreadInterval = null;
			}
			
			if(odorSpreadPlayType == 1){
				odorSpreadPlayType = 2;	
			}
			
			setControlButton('odorSpreadPlay', odorSpreadPlayType);
			
			odorSpreadIndex++;
			
			if(odorSpreadTimeSeries.length <= (odorSpreadIndex+1)){
				odorSpreadIndex = odorSpreadTimeSeries.length-1;
				odorSpreadPlayType = 0;
			}
			
			if(mapType == 'cell'){
				if(odorSpreadLayer){
					updateLayer(odorSpreadLayer, odorSpreadTimeSeries[odorSpreadIndex]);
					setCurrentDate(odorSpreadTimeSeries[odorSpreadIndex], 'odorSpreadDate');
				}
			}else{
				var layerNm = $('a[name="odorSpreadLayerType"][class="on"]').attr('value');
				if(layerNm.indexOf('now') >= 0){
					layerNm = bizLayers.ANALS_POINT_NOW;
				}else{
					layerNm = bizLayers.ANALS_POINT_FORECAST
				}
				
				if(odorSpreadHeatMapLayer){
					_MapEventBus.trigger(_MapEvents.map_removeLayer, odorSpreadHeatMapLayer);
					odorSpreadHeatMapLayer = null;
				}
				
				drawHeatMapLayer(layerNm);
			}
		}); 
		$('a[name="odorSpreadLayerType"]').on('click', function(){
			$('a[name="odorSpreadLayerType"]').removeClass('on');
			$(this).addClass('on');
			var layerNm = $('a[name="odorSpreadLayerType"][class="on"]').attr('value');
			
			var toDay  = new Date();
			// 실시간
			if(layerNm == 'anals_area_now'){
				$('#odorSpreadStartDate').datepicker('setDate', toDay);
				$('#odorSpreadEndDate').datepicker('setDate', toDay);
				
				$('#odorSpreadStartDate').datepicker( "option", "minDate", null );
				$('#odorSpreadEndDate').datepicker( "option", "minDate", null );
				
				$('#odorSpreadStartDate').datepicker( "option", "maxDate", toDay );
				$('#odorSpreadEndDate').datepicker( "option", "maxDate", toDay );
			}else{ // 예보
				
				$('#odorSpreadStartDate').datepicker('setDate', toDay);
				$('#odorSpreadEndDate').datepicker('setDate', toDay);
				
				$('#odorSpreadStartDate').datepicker( "option", "maxDate", null );
				$('#odorSpreadEndDate').datepicker( "option", "maxDate", null );
			
				$('#odorSpreadStartDate').datepicker( "option", "minDate", toDay );
				$('#odorSpreadEndDate').datepicker( "option", "minDate", toDay );
			}
			
			if(odorSpreadLayer){
				_MapEventBus.trigger(_MapEvents.map_removeLayer, odorSpreadLayer);
				odorSpreadLayer = null;
				
				clearInterval(odorSpreadInterval);
				odorSpreadInterval = null;
			}
			if(odorSpreadHeatMapLayer){
				_MapEventBus.trigger(_MapEvents.map_removeLayer, odorSpreadHeatMapLayer);
				odorSpreadHeatMapLayer = null;
			}
			
			odorSpreadPlayType = 0;
			setControlButton('odorSpreadPlay', odorSpreadPlayType);
		})
		$('input[name="odorSpreadMapType"]').on('click', function(){
			var mapType = $('input[name="odorSpreadMapType"]:checked').val();
			var layerNm = $('a[name="odorSpreadLayerType"][class="on"]').attr('value');
			
			odorSpreadMapType = mapType;
			
			odorSpreadPlayType = 0;
			setControlButton('odorSpreadPlay', odorSpreadPlayType);
			if(odorSpreadTimeSeries == null || odorSpreadTimeSeries.length <= 0){
				return;
			}
			// 격자
			if(mapType == 'cell'){
				if(odorSpreadHeatMapLayer){
					_MapEventBus.trigger(_MapEvents.map_removeLayer, odorSpreadHeatMapLayer);
					odorSpreadHeatMapLayer = null;
				}
				if(odorSpreadLayer){
					odorSpreadLayer.setVisible(true);
					updateLayer(odorSpreadLayer, odorSpreadTimeSeries[odorSpreadIndex]);
				}else{
					var layerInfos = [{layerNm:layerNm,style:null,isVisible:true,isTiled:true,cql:null,opacity:0.7, cql:'DTA_DT=\''+odorSpreadTimeSeries[odorSpreadIndex].date+odorSpreadTimeSeries[odorSpreadIndex].time+'\'', zIndex:4}];
					odorSpreadLayer = _CoreMap.createTileLayer(layerInfos)[0];
					_MapEventBus.trigger(_MapEvents.map_addLayer, odorSpreadLayer);
				}
			}else{ // 밀도
				if(odorSpreadLayer){
					odorSpreadLayer.setVisible(false);
					clearInterval(odorSpreadInterval);
					odorSpreadInterval = null;
				}
				if(layerNm.indexOf('now') >= 0){
					layerNm = bizLayers.ANALS_POINT_NOW;
				}else{
					layerNm = bizLayers.ANALS_POINT_FORECAST
				}
				
				if(odorSpreadHeatMapLayer){
					_MapEventBus.trigger(_MapEvents.map_removeLayer, odorSpreadHeatMapLayer);
					odorSpreadHeatMapLayer = null;
					
					drawHeatMapLayer(layerNm);
				}else{
					drawHeatMapLayer(layerNm);
				}
			}
		});
		// 악취 이동경로
		$('#odorMovementPlay').on('click', function(){
			
			if(trackingPlayType == 0){
				startTracking();
			}else if(trackingPlayType == 1){
				clearInterval(trackingInterval);
				trackingInterval = null; 
				
				trackingPlayType = 2;
				setControlButton('odorMovementPlay', trackingPlayType);
			}else if(trackingPlayType == 2){
				
				tracking();
				trackingPlayType = 1; 
				setControlButton('odorMovementPlay', trackingPlayType);
			}
		});
		
		$('#odorMovementStop').on('click', function(){
			clearInterval(trackingInterval);
			trackingInterval = null; 
			trackingPlayType = 0;
			setControlButton('odorMovementPlay', trackingPlayType);
		});
		var preOdorType = 'cours_now';
		
		$('a[name="odorMovementType"]').on('click', function(){
			$('a[name="odorMovementType"]').removeClass('on');
			$(this).addClass('on');
			
			var layerNm = $('a[name="odorMovementType"][class="on"]').attr('value');
			var toDay = new Date();
			
			if(layerNm == 'cours_now' || layerNm == 'cours_sensor'){
				$('#odorMovementStartDate').datepicker( "option", "maxDate", toDay );
				$('#odorMovementStartDate').datepicker( "option", "minDate", null );
			}else{
				$('#odorMovementStartDate').datepicker( "option", "minDate", toDay );
				$('#odorMovementStartDate').datepicker( "option", "maxDate", null );
			}
			if(preOdorType == layerNm ){
				return;
			}
			
			if(layerNm == 'cours_sensor'){
				setSensorCombo();
			}else{
				setIntrstCombo();
			}
			preOdorType = layerNm;
		}); 
		
		$('#odorMovementNext').on('click', function(){
			if(odorMovementLayer){
				clearInterval(trackingInterval);
				trackingInterval = null;
				trackingIntervalTime = 100;
				tracking();
			}
		});
		
		$('#odorMovementBufferBtn').on('click', function(){
			if(originLayer){
				_MapEventBus.trigger(_MapEvents.map_removeLayer, originLayer);
				originLayer = null;
			}
			
			bufferMeter = parseInt($('#bufferMeter').val());
			
			$('#bufferBtn').show();
			
			$('#bufferOnOffBtn').off('click').on('click', function(){
				if($(this).attr('value')=='on'){
					$(this).attr('value','off');
					$(this).prop('src','../images/wd_btn_off.png');
					if(bufferOriginLayer){
						_MapEventBus.trigger(_MapEvents.map_removeLayer, bufferOriginLayer);
					}
				}else{
					$(this).attr('value', 'on'); 
					$(this).prop('src','../images/wd_btn_on.png');
					if(bufferOriginLayer){
						_MapEventBus.trigger(_MapEvents.map_removeLayer, bufferOriginLayer);
					}
					
					if(bufferOriginFeature){
						var source = new ol.source.Vector();
						source.addFeatures([bufferOriginFeature]);
						bufferOriginLayer = new ol.layer.Vector({ 
							source: source,
							zIndex:1001,
							name:'bufferOriginLayer',
							style: bufferAreaStyle
						});
						_MapEventBus.trigger(_MapEvents.map_addLayer, bufferOriginLayer);
					}
				}
			});
			
//			_MapEventBus.trigger(_MapEvents.addWriteLayerForUseGeoserver, {type:_SmellMapBiz.taskMode});	

			_MapEventBus.trigger(_MapEvents.addWriteLayerForUseGeoserver, {type:0});	
			$('#bufferOnOffBtn').attr('value', 'on');
			$('#bufferOnOffBtn').trigger('click');
			
			if(trackingFeatures == null || trackingFeatures.length <= 0){
				return;
			}
			_MapService.getWfs(':BPLC', '*','1=1', null).then(function(result){
				
				var parser = new jsts.io.OL3Parser();
				
				var linePathCoord = []
				var bufferFeatures = [];
				
				for(var i=0; i<trackingFeatures.length; i++){
					var bufferFeature = trackingFeatures[i].clone();
					linePathCoord.push(bufferFeature.getGeometry().getCoordinates());
				}
				
				var lineFeature = new ol.Feature({geometry:new ol.geom.LineString(linePathCoord), properties:null});
				var jstsGeom = parser.read(lineFeature.getGeometry());
				var buffered = jstsGeom.buffer(bufferMeter);
				var bufferedGeometry = parser.write(buffered);

				var interFeatures = [];
				var gridData = [];
				
				for(var i=0; i<result.features.length; i++){
					var bplcFeature = new ol.Feature({geometry:new ol.geom.Polygon(result.features[i].geometry.coordinates), properties:result.features[i].properties});
					var target = parser.read(bplcFeature.getGeometry())
					var interFeature = buffered.intersection(target);
					var interGeometry = parser.write(interFeature);
					if(interGeometry.getCoordinates()[0].length > 0){
						interFeatures.push(bplcFeature);
						gridData.push(result.features[i].properties);
					}
				}
				
				bufferOriginFeature = new ol.Feature({geometry:new ol.geom.Polygon(bufferedGeometry.getCoordinates()), properties:{}});
				
				if(interFeatures.length <= 0){
					_MapEventBus.trigger(_MapEvents.alertShow, {text:'오염원점이 없습니다.'});
					return;
				}
				
				var source = new ol.source.Vector();
				source.addFeatures(interFeatures);
				originLayer = new ol.layer.Vector({
					source: source,
					zIndex:1000,
					name:'originLayer',
					style: bufferVectorStyle
				});
				_MapEventBus.trigger(_MapEvents.map_addLayer, originLayer);
			});
		});
		
		
		$('.legendButton').click(function(){
			_WestCondition.legendLayerOnOff(this);
		});
		
	};
	
	var startTracking = function(analsId){
		
		var layerNm = $('a[name="odorMovementType"][class="on"]').attr('value');
		
		var odorMovementStartDate = $('#odorMovementStartDate').val().replace(regExp, '');
		var odorMovementStartTime = $('#odorMovementStartTime').val();
		
		var odorMovementItem = $('#odorMovementItem').val();
		
		if(analsId){
			odorMovementItem = analsId;
		}
		if(trackingInterval){
			clearInterval(trackingInterval);
			trackingInterval = null;
		}
		if(odorMovementLayer){
			_MapEventBus.trigger(_MapEvents.map_removeLayer, odorMovementLayer);
			if(originLayer){
				_MapEventBus.trigger(_MapEvents.map_removeLayer, originLayer);	
			}
			if(bufferOriginLayer){
				_MapEventBus.trigger(_MapEvents.map_removeLayer, bufferOriginLayer);	
			}
			odorMovementLayer = null;
			originLayer = null;
			bufferOriginLayer = null;
			$('#bufferBtn').hide();
		}
		
		var params = {"type":layerNm, "analsAreaId":odorMovementItem, "dtaDt":odorMovementStartDate+odorMovementStartTime};
		$.ajax({
            url: '/getCoursModel.do',
            data:JSON.stringify(params)
        }).done(function(result){
        	if(result == null || result.length <= 0){
				_MapEventBus.trigger(_MapEvents.alertShow, {text:'모델링 데이터가 없습니다.'});
				return;
			}
        	trackingFeatures = [];
			
			for(var i=0; i<result.length; i++){
				var coord = ol.proj.transform([parseInt(result[i].utmx), parseInt(result[i].utmy)], 'EPSG:32652', 'EPSG:3857');
				if(i>0){
					if(parseInt(result[i].utmx) ==parseInt(result[i-1].utmx) && parseInt(result[i].utmy) == parseInt(result[i-1].utmy)){
						continue;
					}
				}
				var feature = new ol.Feature({geometry:new ol.geom.Point(coord), properties:result[i]});
//				feature.setId(result.features[i].id);
				trackingFeatures.push(feature);
			}
			
			odorMovementLayer = new ol.layer.Vector({
				source : new ol.source.Vector({
					features : [trackingFeatures[0]]
				}),
				style : odorMovementStyleFunction,
				zIndex: 3000,
				id:'odorMovementLayer'
			});
			
			_MapEventBus.trigger(_MapEvents.map_addLayer, odorMovementLayer);
			
			var centerCoord = trackingFeatures[0].getGeometry().getCoordinates();
			_CoreMap.centerMap(centerCoord[0], centerCoord[1]);
			
			trackingIdx = 0;
			trackingIntervalTime = 1000;
			tracking();
			trackingPlayType = 1;
			setControlButton('odorMovementPlay', trackingPlayType);
			
			// 민원 업무일때
			if(analsId){
				$('#odorMovementBufferBtn').trigger('click');
			}
        });
	}
	
	var layerCloseAll = function(){
		if(weatherAnalysisLayer){
			_MapEventBus.trigger(_MapEvents.map_removeLayer, weatherAnalysisLayer);
			weatherAnalysisLayer = null;	
		}
		
		if(odorSpreadLayer){
			_MapEventBus.trigger(_MapEvents.map_removeLayer, odorSpreadLayer);
			odorSpreadLayer = null;	
		}
		
		if(odorSpreadHeatMapLayer){
			_MapEventBus.trigger(_MapEvents.map_removeLayer, odorSpreadHeatMapLayer);
			odorSpreadHeatMapLayer = null;	
		}
		if(odorMovementLayer){
			_MapEventBus.trigger(_MapEvents.map_removeLayer, odorMovementLayer);
			odorMovementLayer = null;
			if(originLayer){
				_MapEventBus.trigger(_MapEvents.map_removeLayer, originLayer);
				originLayer = null;	
			}
			if(bufferOriginLayer){
				_MapEventBus.trigger(_MapEvents.map_removeLayer, bufferOriginLayer);
				bufferOriginLayer = null;	
			}
			if(trackingInterval){
				clearInterval(trackingInterval);	
				trackingInterval = null;
			}
		}
	}
	var setControlButton = function(targetId, type){
		$('#'+targetId).removeClass('ctrl_play');
		$('#'+targetId).removeClass('ctrl_pause');
		$('#'+targetId).removeClass('ctrl_pause_play');
		
		if(type == 0){
			$('#'+targetId).addClass('ctrl_play')
		}else if(type == 1){
			$('#'+targetId).addClass('ctrl_pause');
		}else if(type == 2){
			$('#'+targetId).addClass('ctrl_pause_play');
		}
	}
	
	var drawHeatMapLayer = function(layerNm){
		odorSpreadHeatMapLayer = new ol.layer.Heatmap({
			name:'odorSpreadHeatMapLayer',
			source:new ol.source.Vector({
			url: _MapServiceInfo.serviceUrl +'/geoserver/CE-TECH/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=CE-TECH:'+layerNm+'&maxFeatures=5000&outputFormat=application/json&CQL_FILTER=DTA_DT=\''+odorSpreadTimeSeries[odorSpreadIndex].date+odorSpreadTimeSeries[odorSpreadIndex].time+'\'',
			format: new ol.format.GeoJSON({
				featureProjection:'EPSG:3857'
				})
			}),
			blur: odorSpreadHeatMapBlur ,
			radius: odorSpreadHeatMapRadius,
			zIndex: 3000
		});
 
		odorSpreadHeatMapLayer.getSource().on('addfeature', function(event) {
			var val = event.feature.get('BSML_DNSTY');
			
			var coVal = String(event.feature.get('BSML_DNSTY')).split('.');
			var targetVal = String(event.feature.get('BSML_DNSTY')).replace('.','');
			var preFixCnt = coVal[0].length;
			var preFix = '00';
			
			for(var i=0; i<preFixCnt;i++){
				preFix = preFix.substring(0, preFix.length-1);
			}
			
			var sum = parseFloat('0.'+preFix+targetVal);
	        event.feature.set('weight', sum);
		});

		_MapEventBus.trigger(_MapEvents.map_addLayer, odorSpreadHeatMapLayer);
	}
	var writeGrid = function(id, gridData){
		$('#gridArea').show();
    	var tabTitle = $('#tab_title');
    	var tabContent = $('#tab_content');
    	var tabTemplate = '<li><a id=#{id} href="#{href}" style="cursor: pointer;">#{label}</a> <span class="ui-icon ui-icon-close" role="presentation" style="cursor: pointer; background: url(../images/btn_close2.png) 2px 4px no-repeat; background-size: 8px;">Remove Tab</span></li>';
    	var tabs = $('#tabs').tabs();
    	
    	tabs.off('click').on('click','span.ui-icon-close', function() {
    		var panelId = $( this ).closest('li').remove().attr('aria-controls');
    		$('#' + panelId ).remove();
    		tabs.tabs('refresh');
    		
    		if($('ul[role="tablist"]').find('li').length==0){
    			$('#gridArea').hide();
    		}
    	});
    	var tabId = 'tabs-' + id;
    	var li = $(tabTemplate.replace(/#\{id\}/g,tabId).replace(/#\{href\}/g, '#grid'+id).replace(/#\{label\}/g,'악취원점'));
    	
    	if($('#'+tabId).length == 0){
    		tabs.find('.ui-tabs-nav').append( li );
        	tabs.append('<div id="grid' + id + '" style="padding: 10px 3px !important;"></div>');
    	}
    	
    	tabs.tabs('refresh');

    	tabs.tabs({
    		active:$('ul[role="tablist"]').find('li').index($('#' + tabId).parent())
    	});
    	
    	$('#grid' + id).jsGrid({
    		width: '1300px',
    		height: '170px',

    		inserting: false,
    		editing: false,
    		sorting: true,
    		paging: false,	
    		noDataContent: '데이터가 없습니다.',
    		data: gridData,
    		fields: [{name:'BPLC_ID',title:'악취원점ID'},
//		             {name:'BSML_TRGNP    ',title:''},
		             {name:'BSML_TRGNPT_NM',title:'시설구분'},
		             {name:'CMPNY_NM',title:'시설명'},
		             {name:'TELNO',title:'전화번호'}],
    		rowClick:function(data){
    		}
    	});
	}
	var tracking = function(){
		
		trackingInterval = setInterval(function(){
			trackingIdx++;
			if(trackingFeatures[trackingIdx]){
				odorMovementLayer.getSource().addFeature(trackingFeatures[trackingIdx]);
				
//				var centerCoord = trackingFeatures[trackingIdx].getGeometry().getCoordinates();
//				_CoreMap.centerMap(centerCoord[0], centerCoord[1]);	
			}else{
				clearInterval(trackingInterval);
				trackingInterval = null;
				trackingIdx--;
				
				trackingPlayType = 0;
				setControlButton('odorMovementPlay', trackingPlayType);
			}
		}, trackingIntervalTime); 
	}

	var playWeatherAnalysisLayer = function(){
		weatherAnalysisInterval = setInterval(function(){
			weatherAnalysisIndex++;
			
			if(weatherAnalysisTimeSeries[weatherAnalysisIndex]){
				updateLayer(weatherAnalysisLayer, weatherAnalysisTimeSeries[weatherAnalysisIndex]);
				setCurrentDate(weatherAnalysisTimeSeries[weatherAnalysisIndex], 'weatherAnalysisDate');	
			}else{
				weatherAnalysisIndex--;
				clearInterval(weatherAnalysisInterval);
				
				weatherAnalysisPlayType = 0;
				setControlButton('weatherAnalysisPlay', weatherAnalysisPlayType);
				return;
			}
		}, 1000 * weatherAnalysisIntervalTime);
	};
	
	var playOdorSpreadLayer = function(){
		odorSpreadInterval = setInterval(function(){
			odorSpreadIndex++;
			
			if(odorSpreadTimeSeries[odorSpreadIndex]){
				updateLayer(odorSpreadLayer, odorSpreadTimeSeries[odorSpreadIndex]);
				setCurrentDate(odorSpreadTimeSeries[odorSpreadIndex], 'odorSpreadDate');	
			}else{
				odorSpreadIndex--;
				clearInterval(odorSpreadInterval);
				return;
			}
		}, 1000 * odorSpreadIntervalTime);
	};
	var updateLayer = function(layer, param){
		var source = layer.getSource();
		source.updateParams({
				LAYERS: param.layer,
				'FORMAT': 'image/png', 
				'VERSION': '1.1.0',
				tiled: true,
				STYLES:param.style,
				CQL_FILTER:'DTA_DT=\''+param.date+param.time+'\''
		});
	} 
	
	var setTimeSeries = function(sdate, edate, stime, etime, layerNm, styleNm){
		var timeSeriesArr = [];
		var syear = sdate.substring(0,4);
		var smonth = sdate.substring(4,6);
		var sday = sdate.substring(6,8);
		
		var eyear = parseInt(edate.substring(0,4));
		var emonth = parseInt(edate.substring(4,6));
		var eday = parseInt(edate.substring(6,8));
		
		var tdate = new Date(syear, parseInt(smonth)-1, sday);
		
		var stime = parseInt(stime);
		var etime = parseInt(etime);
		while(true){
			var y = tdate.getFullYear();
			var m = tdate.getMonth()+1;
			var d = tdate.getDate();
			
			if(y == eyear && m == emonth && d == eday && stime > etime){
				break;
			}
			var timeSeries = {date : y+''+(m<10?'0'+m:m)+''+(d<10?'0'+d:d), time:(stime<10?'0'+stime:stime+''), layer:layerNm, style:styleNm};
			if(stime > 23){
				stime = 1;
				tdate.setDate(d + 1);
				continue;
			}else{
				stime++;
			}
			timeSeriesArr.push(timeSeries);
		}
		return timeSeriesArr;
	}
	var setCurrentDate = function(param, targetId){
		$('#'+targetId).val(param.date.substring(0,4)+'.'+param.date.substring(4,6)+'.'+param.date.substring(6,8)+'일  '+param.time+'시');
	}
	var bufferVectorStyle = function(){
		return new ol.style.Style({
	          stroke: new ol.style.Stroke({
	            color: 'red',
	            width: 3
	          }),
	          fill: new ol.style.Fill({
	            color: 'rgba(255, 255, 0, 0.1)'
	          })
	        });
	};
	var bufferAreaStyle = function(){
		return new ol.style.Style({
	          stroke: new ol.style.Stroke({
	            color: 'blue',
	            width: 3
	          }),
	          fill: new ol.style.Fill({
	            color: 'rgba(0, 0, 255, 0.3)'
	          })
	        });
	}
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
	
	var odorMovementStyleFunction= function(feature){
		var label = feature.getProperties().properties.sn;
    	var style = new ol.style.Style({
    		geometry: feature.getGeometry(),
    		image: new ol.style.Circle({
    			radius: 8,
    			fill: new ol.style.Fill({
    				color: '#ff0000'
    			}), 
    			stroke: new ol.style.Stroke({
    				color: '#ffffff',
    				width: 1
    			})
    		})
  		});
    	return style;
    }
	
	var pointStyle = function(feature){
		 
		return new ol.style.Style({
	        image: new ol.style.Icon({
	        	opacity: 1.0,
	            src: '/map/resources/images/icon/c1.png'
	        })
		});
	}
	var trackingTextStyle = function(label) {
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
			text : label,
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
	var pointBufferStyle = function(){
		return new ol.style.Style({
	        image: new ol.style.Icon(/** @type {module:ol/style/Icon~Options} */ ({
	            src: '/map/resources/images/icon/c2.png'
	        }))
		});
	}
    // public functions
    return {
    	taskMode : 0,
        init: function () {
        	var me = this;
        	init();
        	return me;
        }
    };
}();

