var _MapBiz = function () {
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
	
	var bizLayers = {'OBS' : 'GIS_NAMIS_OBS',
			         'REVERSE' : 'NAMIS_REVERSE_ANLT',
			         'CELL9KM' : 'NAMIS_CELL_AIR_9KM_REAL',
			         'HEATMAP' : 'NAMIS_CMAQ_9KM_PT'};
	
	var stationList = [];
	
	var stationVectorLayer;
	
	var stationItemCode;
	
	var stationLabelViewFlag = false;
	
	// 특수문자 제거 정규표현식
	var regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
	
	var distributionChartDates;
	
	var distributionChartLayer;
	var distributionHeatLayer;
	var distributionChartStyle;
	var distributionChartLayerVisible = true;
	var distributionChartVisible = false;
	var distributionHeatLayerVisible = true;
	
	var distributionChartInterval;
	var distributionChartSDate;
	var distributionChartSTime;
	var distributionChartEDate;
	var distributionChartETime;
	
	var distributionChartTimeSeries;
	var distributionChartIndex = 1;
	
	var distributionChartTap = 0;
	
	var trackingFeatures;
	var trackingLayer;
	var trackingInterval;
	var trackingIntervalTime = 300;
	var trackingAltitudeCode;
	var trackingLayerVisible = true;
	var trackingLayerLabelVisible = true;
	var trackingIdx = 0;
	
	var stationVisible = false;
	
	var isDustLabelOn = false;
	var dustLayer = null;
	var dustLayerFeatures = [];
	var sdPtLayerFeatures = [];
	
	var init = function(){
		
		setMapBizComponents();
		
		setEvent();
		
		getStationList();
		
	}
	var setMapBizComponents = function(){
		
		var toDay = new Date();
		var hour = toDay.getHours()-1;
		var timeOptions = '';
		for(var i=0; i<24; i++){
			timeOptions += '<option '+(i==hour?'selected':'')+' value="'+(i<10 ? ('0'+i): i)+'">'+(i+1)+'시</option>';
		}
		
		$('#stationMeasureTime').html(timeOptions);
		$('#modelingTime').html(timeOptions);
		
		$.ajax({
            url : bizUrl+'/map/getRealHour',
            type : 'GET',
            contentType : 'application/json'
    	}).done(function(result){
    		var beforeDate = new Date();
    		beforeDate.setDate(beforeDate.getDate()-1); //하루 전

    		if(hour < parseInt(result.data)){
    			$("#stationMeasureDate").datepicker('setDate', beforeDate);
    		}
    		 
    		$('#stationMeasureTime').val(result.data);
    		
    		var startHour = hour-7;
    		if(startHour < 0){
    			startHour = 23 + startHour;
    			$("#distributionChartStartDate").datepicker('setDate', beforeDate);
    		}
    		if(startHour < 10){
    			startHour = '0'+startHour;
    		}
    		$('#distributionChartStartTime').val(startHour);
    		var endHour = hour-1;
    		if(endHour < 0){
    			endHour = 23;
    			$('#distributionChartEndDate').datepicker('setDate', beforeDate);	
    		}
    		if(endHour < 10){
    			endHour = '0'+endHour;
    		}
    		$('#distributionChartEndTime').val(endHour);
    	});
		
		$('#distributionChartStartTime').html(timeOptions);
		$('#distributionChartEndTime').html(timeOptions);
		
		$("#stationMeasureDate").datepicker(datePickerDefine); 
		
		$('#modelingDate').datepicker(datePickerDefine);
		
		$('#stationMeasureDate').datepicker('setDate', toDay);
		$('#modelingDate').datepicker('setDate', toDay);
		
		distributionChartDates = $( "#distributionChartStartDate, #distributionChartEndDate" ).datepicker($.extend(datePickerDefine,{
			  yearSuffix: '년',
			  //maxDate:'+0d',
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
		
		$('#distributionChartStartDate').datepicker('setDate', toDay);
		$('#distributionChartEndDate').datepicker('setDate', toDay);
		
	}
	var setEvent = function(){
		
		$('#dustLabel').on('click', function(){
			if(isDustLabelOn){
				isDustLabelOn = false;
				$(this).prop('src', '/map/resources/images/b2_off.png');
				
				if(dustLayer != null){
					_MapEventBus.trigger(_MapEvents.map_removeLayer, dustLayer);
					dustLayer = null;
				}
			}else{
				isDustLabelOn = true;
				$(this).prop('src', '/map/resources/images/b2_on.png');
				getDustFeature();
			}
		});
		
		_MapEventBus.on(_MapEvents.map_moveend, function(event, data){
			var cZoom = data.result.map.getView().getZoom();
			if(cZoom > 7){
				stationLabelViewFlag = true;
				
			}else{
				stationLabelViewFlag = false;
			}
			if(stationVectorLayer){
				stationVectorLayer.setStyle(stationStyleFunction);
			}
			if(cZoom == 8){
				$('#radius').val(28);
				$('#blur').val(28);
			}else if(cZoom == 7){
				$('#radius').val(14);
				$('#blur').val(28);
			}else if(cZoom == 6){
				$('#radius').val(8);
				$('#blur').val(28);
			}else if(cZoom == 5){
				$('#radius').val(4);
				$('#blur').val(28);
			}else if(cZoom == 9){
				$('#radius').val(56);
				$('#blur').val(45);
			}else if(cZoom == 10){
				$('#radius').val(93);
				$('#blur').val(50);
			}else{
				$('#radius').val(100);
				$('#blur').val(50);
			}
			
			if(distributionHeatLayer){
				distributionHeatLayer.setBlur(parseInt($('#radius').val(), 10));
		    	distributionHeatLayer.setRadius(parseInt($('#radius').val(), 10));	
			}
			
			if(distributionChartVisible && distributionChartLayerVisible && cZoom > 11){
				alert('공간분포도 켜진 상태에서 지도 확대 불가. OFF 후 사용 확대가능');
				_MapEventBus.trigger(_MapEvents.setZoom, 11);
			}
		});
		
		_MapEventBus.on(_MapEvents.map_singleclick, function(event, data){
			var featureObj = _CoreMap.getMap().forEachFeatureAtPixel(data.result.pixel, function(feature, layer) {
			    return {feature:feature, layerId:layer.get('id')};
			 }, null, function(layer) {
				if(layer.get('id') == 'stationLayer' || layer.get('id') == 'tmsLocation'){
					return true;
				}else{
					return false;
				}
			 });
			
			if(featureObj){
				var feature = featureObj.feature;
				var layerId = featureObj.layerId;
				$('#stationInfoWindow').show();
				if(layerId=='stationLayer'){
					var stationInfo = feature.getProperties().properties;
					if(stationInfo){
						var stationCode = stationInfo.CODE;
						var itemCode = $('#itemCode').val();
						var dateTime = $('#stationMeasureDate').val().replace(regExp, '')+$('#stationMeasureTime').val();
						
						//////////////// 한시간 더함 20180814//////////////////
						var year = dateTime.substring(0,4);
						var month = parseInt(dateTime.substring(4,6))-1;
						var day = dateTime.substring(6,8);
						var hour = dateTime.substring(8,10);
						var date = new Date(year,month,day,hour);
						
						dateTime = new Date(Date.parse(date) + 1000 * 60 * 120); // 한시간 더함
						
						var month2 = '' + (dateTime.getMonth()+1);
				        var day2 = '' + dateTime.getDate();
				        var year2 = dateTime.getFullYear();
				        var hour2 = dateTime.getHours();

					    if (month2.length < 2) month2 = '0' + month2;
					    if (day2.length < 2) day2 = '0' + day2;
					    if (hour2.length < 2) hour2 = '0' + hour2;
					    
					    var dateTime2 =  year2+month2+day2+hour2; // 한시간 더한값을 param으로 사용
					    /////////////////////////////////////////////////////////////////////////
					    
						$('#stationInfoIframe').show();
						$('#highChart').hide();
						$('#tmsLocation').hide();
						$('#stationInfoIframe').prop('src', window.location.origin+'/web/vicinityStation?date_time='+dateTime2+'&item_code='+itemCode+'&station_code='+stationCode);
					}
				}else if(layerId=='tmsLocation'){
					var properties = feature.getProperties();
					
					$('#stationInfoIframe').hide();
					$('#highChart').hide();
					$('#tmsLocation').show();
					var options = {
							properties:properties,
							pageNum:0
					};
					_ThemathicLayer.getTmsLocation(options);
				}
			}
		});
		
		_MapEventBus.on(_MapEvents.map_mousemove, function(event, data){
			var coreMap = _CoreMap.getMap();
			var pixel = coreMap.getEventPixel(data.result.originalEvent);
			var hit = coreMap.forEachFeatureAtPixel(pixel, function(feature, layer) {
				if(layer.get('id') == 'stationLayer' || layer.get('id') == 'tmsLocation'){
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
		});
		
		// 측정소 부분
		$('#stationOnBtn').on('click', function(){
			stationVisible = !stationVisible;
			
			if(stationVisible){
				$(this).prop('src', '/map/resources/images/b1_on.png');
			}else{
				$(this).prop('src', '/map/resources/images/b1_off.png');
			}
			
			if(stationVectorLayer){
				stationVectorLayer.setVisible(stationVisible);
			}else{
				if(stationVisible){
					setStation();
				}
			}
		});
		
		$('#setStationBtn').on('click', function(){
			setStation();
		});
		
		$('#itemCode,#stationMeasureTime,#stationMeasureDate').on('change', function(){
			setStation();
			getDustFeature();
			if(this.id == 'itemCode'){
				changeLegendLabel($(this).val());	
			}
		});
		
		$('#mode1,#mode2,#mode3,#mode4').on('click', function(){
			setStation();
		});
		
		// 여기부터 분포도
		
		$('#distributionChartOnBtn').on('click', function(){
			distributionChartLayerVisible = !distributionChartLayerVisible;
			
			if(distributionChartLayerVisible){
				$(this).prop('src', '/map/resources/images/b3_on.png');
			}else{
				$(this).prop('src', '/map/resources/images/b3_off.png');	
			}
			
			if(distributionChartLayer){
				distributionChartLayer.setVisible(distributionChartLayerVisible);
				if(!distributionChartLayerVisible && distributionChartInterval){
					clearInterval(distributionChartInterval);
					distributionChartInterval = null;	
				}
			}
			
			if(distributionChartVisible && distributionChartLayerVisible && _CoreMap.getMap().getView().getZoom() > 11){
				_MapEventBus.trigger(_MapEvents.setZoom, 11);
			}
		});
		
		$('#distributionHeatMapOnBtn').on('click', function(){
			distributionHeatLayerVisible = !distributionHeatLayerVisible;
			
			if(distributionHeatLayerVisible){
				$(this).prop('src', '/map/resources/images/b4_on.png');	
			}else{
				$(this).prop('src', '/map/resources/images/b4_off.png');
			}
			if(distributionHeatLayer){
				distributionHeatLayer.setVisible(distributionHeatLayerVisible);
			}
		});
		
		$('#latticeMapBtn').on('click', function(){
			$(this).addClass('active');
			$('#densityMapBtn').removeClass('active');
			distributionChartTap = 0;
			$('#densityWave').show();
			$('#distributionChartEndDate').show();
			$('#distributionChartEndTime').show();
			
			$('.heatMapOption').hide();
			$('.chartOption').show();
		});
		
		$('#densityMapBtn').on('click', function(){
			$(this).addClass('active');
			$('#latticeMapBtn').removeClass('active');
			distributionChartTap = 1;
			$('#densityWave').hide();
			$('#distributionChartEndDate').hide();
			$('#distributionChartEndTime').hide();
			
			$('.heatMapOption').show();
			$('.chartOption').hide();
		});
		
		$('#distributionChartPreBtn').on('click', function(){
			if(distributionChartLayer){
				clearInterval(distributionChartInterval);
				distributionChartInterval = null;
				
				distributionChartIndex--;
				
				if(distributionChartIndex < 0){
					distributionChartIndex = 0;
				}
				
				updateDistributionChartLayer({sdate:distributionChartTimeSeries[distributionChartIndex].date, stime:distributionChartTimeSeries[distributionChartIndex].time, style:distributionChartStyle});
				setDistributionCurrentDate();
			}else{
				
			}
		});
		$('#distributionChartNextBtn').on('click', function(){
			if(distributionChartLayer){
				clearInterval(distributionChartInterval);
				distributionChartInterval = null;
				
				distributionChartIndex++;
				
				if(distributionChartTimeSeries.length <= (distributionChartIndex+1)){
					distributionChartIndex = distributionChartTimeSeries.length-1;
				}
				
				updateDistributionChartLayer({sdate:distributionChartTimeSeries[distributionChartIndex].date, stime:distributionChartTimeSeries[distributionChartIndex].time, style:distributionChartStyle});
				setDistributionCurrentDate();
			}else{
				
			}
		});
		
		$('#setDistributionChartBtn').on('click', function(){
			distributionChartSDate = $('#distributionChartStartDate').val().replace(regExp, '');
			distributionChartSTime = parseInt($('#distributionChartStartTime').val())+1;
			if(distributionChartSTime < 10){
				distributionChartSTime = '0'+distributionChartSTime;
			}
			distributionChartEDate= $('#distributionChartEndDate').val().replace(regExp, '');
			distributionChartETime = parseInt($('#distributionChartEndTime').val())+1;
			
			if(distributionChartETime < 10){
				distributionChartETime = '0'+distributionChartETime;
			}
			
			distributionChartStyle = 'airkorea:'+$('#distributionChartItem').val();
			
			if(distributionChartSDate == distributionChartEDate){
				if(parseInt(distributionChartSTime) > parseInt(distributionChartETime)){
					alert('같은 날짜일때 두번째 시간이 더 빠를 수 없습니다.');
					return;
				}	
			}
			
			distributionChartTimeSeries = [];
			distributionChartIndex = 0;
			
			if(distributionChartLayer){
				_MapEventBus.trigger(_MapEvents.map_removeLayer, distributionChartLayer);
				distributionChartLayer = null;
			}
			
			clearInterval(distributionChartInterval);
			distributionChartInterval = null;
			
			setDistributionChartTimeSeries();
			
			var layerInfos = [{layerNm:bizLayers.CELL9KM,style:distributionChartStyle,isVisible:true,isTiled:true,opacity:0.7, cql:'RESULT_DT=\''+distributionChartSDate+distributionChartSTime+'\'', zIndex:4}];
			distributionChartLayer = _CoreMap.createTileLayer(layerInfos)[0];
			_MapEventBus.trigger(_MapEvents.map_addLayer, distributionChartLayer);
			
			setDistributionCurrentDate();
			playDistributionChartLayer();
			
			distributionChartVisible = true;
			
			if(_CoreMap.getMap().getView().getZoom() > 11){
				_MapEventBus.trigger(_MapEvents.setZoom, 11);	
			}
			distributionChartLayerVisible = true;
			$('#distributionChartOnBtn').prop('src', '/map/resources/images/b3_on.png');
			
		});
		
		$('#setDistributionHeatMapBtn').on('click', function(){
			distributionChartSDate = $('#distributionChartStartDate').val().replace(regExp, '');
			distributionChartSTime = $('#distributionChartStartTime').val();
			distributionChartEDate= $('#distributionChartEndDate').val().replace(regExp, '');
			distributionChartETime = $('#distributionChartEndTime').val();	
			
			distributionChartStyle = 'airkorea:'+$('#distributionChartItem').val();
			
			if(distributionHeatLayer){
				_MapEventBus.trigger(_MapEvents.map_removeLayer, distributionHeatLayer);
				distributionHeatLayer = null;
			}
			addHeatMap({sdate:distributionChartSDate, stime:distributionChartSTime, style:distributionChartStyle});
		});
		//  역궤적
		
		$('#trackingOnBtn').on('click', function(){
			trackingLayerVisible = !trackingLayerVisible;
			
			if(trackingLayerVisible){
				$(this).prop('src', '/map/resources/images/b6_on.png');
			}else{
				$(this).prop('src', '/map/resources/images/b6_off.png');
			}

			if(trackingLayer){
				trackingLayer.setVisible(trackingLayerVisible);
			}
		});
		
		$('#trackingLabelOnBtn').on('click', function(){
			trackingLayerLabelVisible = !trackingLayerLabelVisible;
			
			if(trackingLayerLabelVisible){
				$(this).prop('src', '/map/resources/images/b5_on.png');
				trackingText = function(feature, resolution){
					var prop = feature.getProperties().properties;
					
					//var text = prop.YEAR+''+prop.MT+''+prop.DE+', '+prop.HOUR+'시';
					var text = prop.MT+''+prop.DE+', '+prop.HOUR+'시';
					
					if(text == null){
						text = '';
					}
					return text;
				}
			}else{
				$(this).prop('src', '/map/resources/images/b5_off.png');
				
				trackingText = function(feature, resolution){
					return '';
				}	
			}
			
			if(trackingLayer && trackingInterval == null){
				trackingLayer.getSource().addFeature(trackingFeatures[0]);
			}
		});
		
		$('#trackingNextBtn').on('click', function(){
			clearInterval(trackingInterval);
			trackingIntervalTime = 1;
			tracking();
		});
		$('#trackingBtn').on('click', function(){
			var districtCode = $('#districtCode').val();
			var modelingDate = $('#modelingDate').val().replace(regExp, '');
			var modelingTime = $('#modelingTime').val();
			trackingAltitudeCode = $('#altitudeCode').val();
			
			if(trackingLayer){
				_MapEventBus.trigger(_MapEvents.map_removeLayer, trackingLayer);
				
			}
			var cqlFilter = '';
			if(trackingAltitudeCode != 'A'){
				cqlFilter = 'HG=\''+trackingAltitudeCode+'\' AND '; 
			}
			
			cqlFilter += ' MODEL_EXECUT_DT=\''+modelingDate+modelingTime+'\' AND EMD_CODE=\''+districtCode+'\'';
			
			_MapService.getWfs(bizLayers.REVERSE, '*',cqlFilter, 'RESULT_DT+D').then(function(result){
				if(result == null || result.features.length <= 0){
					alert('모델링 데이터가 없습니다.');
					$('#stationInfoWindow').hide();
					return;
				}
				
				trackingFeatures = [];
				var highChartObj = {
						dates:{},
						data:[],
						legend:[]
				};
					
				
				for(var i=0; i<result.features.length; i++){
					var tfeature = result.features[i];
					var coord = ol.proj.transform([
							tfeature.properties.DD_LO,
							tfeature.properties.DD_LA ], 'EPSG:4326',
							'EPSG:3857');
					
					var feature = new ol.Feature({geometry:new ol.geom.Point(coord), properties:tfeature.properties});
					
					trackingFeatures.push(feature);
					
					if(!highChartObj.dates[tfeature.properties.RESULT_DT]){
						highChartObj.dates[tfeature.properties.RESULT_DT] = {};
						highChartObj.dates[tfeature.properties.RESULT_DT].idx = highChartObj.data.length;
					}
					
					if(!highChartObj.data[highChartObj.dates[tfeature.properties.RESULT_DT].idx]){
						highChartObj.data[highChartObj.dates[tfeature.properties.RESULT_DT].idx] = {};
					}
					
					highChartObj.data[highChartObj.dates[tfeature.properties.RESULT_DT].idx][tfeature.properties.HG] = tfeature.properties.DM_HG;
					
					if(highChartObj.legend.indexOf(tfeature.properties.HG) == -1){
						highChartObj.legend.push(tfeature.properties.HG);
					}
				}
				
				writeHighChart(highChartObj);

				trackingLayer = new ol.layer.Vector({
					source : new ol.source.Vector({
						features : [trackingFeatures[0]]
					}),
					style : trackingStyleFunction,
					zIndex: 3
				});
				
				_MapEventBus.trigger(_MapEvents.map_addLayer, trackingLayer);	
				var centerCoord = trackingFeatures[0].getGeometry().getCoordinates();
				_CoreMap.centerMap(centerCoord[0], centerCoord[1]);
				
				trackingIdx = 0;
				trackingIntervalTime = 1000;
				tracking();
				if(trackingAltitudeCode == 'A'){
					_MapEventBus.trigger(_MapEvents.setZoom, 7);
				}
			});
		});
	};
	
	var changeLegendLabel = function(type){
		if(type == '10007'){
			$('#level1').html('(0~)');
			$('#level2').html('(31~)');
			$('#level3').html('(81~)');
			$('#level4').html('(151~)');
		}else if(type == '10008'){
			$('#level1').html('(0~)');
			$('#level2').html('(16~)');
			$('#level3').html('(36~)');
			$('#level4').html('(76~)');
		}else if(type == '10003'){
			$('#level1').html('(0~)');
			$('#level2').html('(0.031~)');
			$('#level3').html('(0.091~)');
			$('#level4').html('(0.151~)');
		}else if(type == '10006'){
			$('#level1').html('(0~)');
			$('#level2').html('(0.031~)');
			$('#level3').html('(0.061~)');
			$('#level4').html('(0.201~)');
		}else if(type == '10002'){
			$('#level1').html('(0~)');
			$('#level2').html('(2.01~)');
			$('#level3').html('(9.01~)');
			$('#level4').html('(15.01~)');
		}else if(type == '10001'){
			$('#level1').html('(0~)');
			$('#level2').html('(0.021~)');
			$('#level3').html('(0.051~)');
			$('#level4').html('(0.151~)');
		}
	}
	var setDistributionChartTimeSeries = function(){
		var syear = distributionChartSDate.substring(0,4);
		var smonth = distributionChartSDate.substring(4,6);
		var sday = distributionChartSDate.substring(6,8);
		
		var eyear = parseInt(distributionChartEDate.substring(0,4));
		var emonth = parseInt(distributionChartEDate.substring(4,6));
		var eday = parseInt(distributionChartEDate.substring(6,8));
		
		var tdate = new Date(syear, parseInt(smonth)-1, sday);
		
		var stime = parseInt(distributionChartSTime);
		var etime = parseInt(distributionChartETime);
		while(true){
			var y = tdate.getFullYear();
			var m = tdate.getMonth()+1;
			var d = tdate.getDate();
			
			if(y == eyear && m == emonth && d == eday && stime > etime){
				break;
			}
			var timeSeries = {date : y+''+(m<10?'0'+m:m)+''+(d<10?'0'+d:d), time:(stime<10?'0'+stime:stime+'')};
			if(stime > 23){
				stime = 0;
				tdate.setDate(d + 1);
				continue;
			}else{
				stime++;
			}
			distributionChartTimeSeries.push(timeSeries);
		}
	}
	var setDistributionCurrentDate = function(){
		var cdate = distributionChartTimeSeries[distributionChartIndex].date;
		
		$('#distributionCurrentDate').val(cdate.substring(0,4)+'.'+cdate.substring(4,6)+'.'+cdate.substring(6,8)+'일  '+distributionChartTimeSeries[distributionChartIndex].time+'시');
	}
	var tracking = function(){
		
		trackingInterval = setInterval(function(){
			
			trackingIdx++;
			if(!trackingFeatures || trackingFeatures.length-1 <= trackingIdx){
				clearInterval(trackingInterval);
				trackingInterval = null;
				return;
			}
			
			trackingLayer.getSource().addFeature(trackingFeatures[trackingIdx]);
			
			var centerCoord = trackingFeatures[trackingIdx].getGeometry().getCoordinates();
			if(trackingAltitudeCode != 'A'){
				_CoreMap.centerMap(centerCoord[0], centerCoord[1]);	
			}
			
		}, trackingIntervalTime); 
	}
	
	var playDistributionChartLayer = function(){
		
		distributionChartInterval = setInterval(function(){
			if(distributionChartTimeSeries.length <= (distributionChartIndex+1)){
				clearInterval(distributionChartInterval);
				return;
			}
			
			distributionChartIndex++;
			if(distributionChartTimeSeries[distributionChartIndex]){
				updateDistributionChartLayer({sdate:distributionChartTimeSeries[distributionChartIndex].date, stime:distributionChartTimeSeries[distributionChartIndex].time, style:distributionChartStyle});
				setDistributionCurrentDate();	
			}
		}, 1000 * 3);
	};
	
	var setStation = function(){
		if(stationVectorLayer != null){
			_MapEventBus.trigger(_MapEvents.map_removeLayer, stationVectorLayer);
		}
		var param = {};
	
		param.date = $('#stationMeasureDate').val().replace(regExp, '')+$('#stationMeasureTime').val();
		param.itemCode = $('#itemCode').val();
		
		stationItemCode = param.itemCode;
		
		var mode1 = $('#mode1').prop('checked');
		var mode2 = $('#mode2').prop('checked');
		var mode3 = $('#mode3').prop('checked');
		var mode4 = $('#mode4').prop('checked');
		
		getStationMeasureValue(param, function(result){
			var stataionFeatures = [];
			
			for (var i = 0; i <stationList.length; i++) {
				var tfeature = stationList[i];
				
				var prop = tfeature.properties;
				
				var modeFlag = false;
				
				if(mode1 && prop.MODE1 == 'Y'){
					modeFlag = true;
				}
				if(mode2 && prop.MODE2 == 'Y'){
					modeFlag = true;
				}
				if(mode3 && prop.MODE3 == 'Y'){
					modeFlag = true;
				}
				if(mode4 && prop.MODE4 == 'Y'){
					modeFlag = true;
				}
				if(!modeFlag){
					continue;
				}
				var addFlag = false;
				for(var j=0; j<result.data.length; j++){
					var sv = result.data[j];
					if(prop.CODE == sv.STATION_CODE){
						
						prop = $.extend(prop, sv);
						
						if(prop.SCREEN_FLAG01 != null && prop.SCREEN_FLAG01 != ''){
							prop.SCREEN_VALUE = '';
						}
						var feature = new ol.Feature({geometry:new ol.geom.Point(tfeature.geometry.coordinates), properties:prop});
						stataionFeatures.push(feature);
						addFlag = true;
						break;
					}
				}
				if(!addFlag){
					prop = $.extend(prop, {SCREEN_VALUE:''});
					var feature = new ol.Feature({geometry:new ol.geom.Point(tfeature.geometry.coordinates), properties:prop});
					stataionFeatures.push(feature);
				}
			}
			
			stationVectorLayer = new ol.layer.Vector({
				source : new ol.source.Vector({
					features : stataionFeatures
				}),
				style : stationStyleFunction,
				visible: stationVisible,
				zIndex: 3,
				id:'stationLayer'
			});
			
			_MapEventBus.trigger(_MapEvents.map_addLayer, stationVectorLayer);			
		});
	}
	var addHeatMap = function(param){
		distributionHeatLayer = new ol.layer.Heatmap({
						name:'airKoreaHeatmapLayer',
						source:new ol.source.Vector({
						url: _MapServiceInfo.serviceUrl +'service=WFS&version=1.0.0&request=GetFeature&typeName=airkorea:'+bizLayers.HEATMAP+'&maxFeatures=5000&outputFormat=application/json&CQL_FILTER=RESULT_DT=\''+param.sdate+param.stime+'\'',
						format: new ol.format.GeoJSON({
							featureProjection:'EPSG:3857'
							})
						}),
						blur: parseInt($('#blur').val(), 10),
						radius: parseInt($('#radius'), 10),
						zIndex: 2
	      			});

		distributionHeatLayer.getSource().on('addfeature', function(event) {
			var fieldNm = '';
			
			if(param.style.indexOf('co') > -1){
				fieldNm = 'CO';
			}else if(param.style.indexOf('so') > -1){
				fieldNm = 'SO2';
			}else if(param.style.indexOf('no') > -1){
				fieldNm = 'NO2';
			}else if(param.style.indexOf('o3') > -1){
				fieldNm = 'O3';
			}else if(param.style.indexOf('pm10') > -1){
				fieldNm = 'PM10';
			}else if(param.style.indexOf('pm25') > -1){
				fieldNm = 'PM25';
			}
			var val = event.feature.get(fieldNm);
			
			var coVal = String(event.feature.get(fieldNm)).split('.');
			var targetVal = String(event.feature.get(fieldNm)).replace('.','');
			var preFixCnt = coVal[0].length;
			var preFix = '00';
			for(var i=0; i<preFixCnt;i++){
				preFix = preFix.substring(0, preFix.length-1);
			}
			if(fieldNm.indexOf('PM') >= 0){
				
			}else{
				preFix = '';
			}
			var sum = parseFloat('0.'+preFix+targetVal);
	        event.feature.set('weight', sum);
		});
		
		_MapEventBus.trigger(_MapEvents.map_addLayer, distributionHeatLayer);
		
	    var blur = document.getElementById('blur');
	    var radius = document.getElementById('radius');
	    blur.addEventListener('input', function() {
	    	distributionHeatLayer.setBlur(parseInt(blur.value, 10));
	    });

	    radius.addEventListener('input', function() {
	    	distributionHeatLayer.setRadius(parseInt(radius.value, 10));
	    });
	}
	
	var updateDistributionChartLayer = function(param){
		var distributionChartSource = distributionChartLayer.getSource();
		distributionChartSource.updateParams({'FORMAT': 'image/png', 
				'VERSION': '1.1.0',
				tiled: true,
				STYLES:param.style,
				CQL_FILTER:'RESULT_DT=\''+param.sdate+param.stime+'\''
		});
	}
	
	var trackingStyleFunction = function(feature, resolution) {
		
		var properties = feature.getProperties().properties;
		if(properties.HG == '500'){
			return new ol.style.Style({
				image : new ol.style.Icon({
					opacity: 1.0,
					src: '/map/resources/images/icon/icon_L.png'
				}),
				text : trackingTextStyle(feature, resolution)
			});	
		}else if(properties.HG == '1000'){
			return new ol.style.Style({
				image : new ol.style.Icon({
					opacity: 1.0,
					src: '/map/resources/images/icon/icon_M.png'
				}),
				text : trackingTextStyle(feature, resolution)
			});
		}else{
			return new ol.style.Style({
				image : new ol.style.Icon({
					opacity: 1.0,
					src: '/map/resources/images/icon/icon_H.png'
				}),
				text : trackingTextStyle(feature, resolution)
			});
		}
	};
	
	var stationStyleFunction = function(feature, resolution) {
		var level1Val = 0.0;
		var level2Val = 0.0;
		var level3Val = 0.0;
		
		if(stationItemCode == '10007'){
			level1Val = 30.0;
			level2Val = 80.0;
			level3Val = 150.0;
		}else if(stationItemCode == '10008'){
			level1Val = 15.0;
			level2Val = 35.0;
			level3Val = 75.0;
		}else if(stationItemCode == '10003'){
			level1Val = 0.03;
			level2Val = 0.09;
			level3Val = 0.15;
		}else if(stationItemCode == '10006'){
			level1Val = 0.03;
			level2Val = 0.06;
			level3Val = 0.2;
		}else if(stationItemCode == '10002'){
			level1Val = 2.0;
			level2Val = 9.0;
			level3Val = 15.0;
		}else if(stationItemCode == '10001'){
			level1Val = 0.02;
			level2Val = 0.05;
			level3Val = 0.15;
		}
		
		var value = feature.get('properties').SCREEN_VALUE;
		
		var mode1 = feature.get('properties').MODE1;
		var mode2 = feature.get('properties').MODE2;
		var mode3 = feature.get('properties').MODE3;
		var mode4 = feature.get('properties').MODE4;
		
		var icon = '';
		if(value == null || value == ''){
			icon = 'c5.png';
		} else if(value <= level1Val){
			icon = 'p_#mode#_1.png';
		} else if(value <= level2Val){
			icon = 'p_#mode#_2.png';
		} else if(value <= level3Val){
			icon = 'p_#mode#_3.png';
		} else{
			icon = 'p_#mode#_4.png';
		}
		
		if(mode1 == 'Y'){
			modeNumber = '1';
		}else if(mode2 == 'Y'){
			modeNumber = '2';
		}else if(mode3 == 'Y'){
			modeNumber = '3';
		}else if(mode4 == 'Y'){
			modeNumber = '4';
		}
		icon = icon.replace('#mode#', modeNumber);
		
		return new ol.style.Style({
			image : new ol.style.Icon({
				opacity: 1.0,
				src: '/map/resources/images/obs/'+icon
			}),
			text : stationTextStyle(feature, resolution)
		});
	};
	
	var stationTextStyle = function(feature, resolution) {
		var align = 'center';
		var baseline = 'top';
		var size = '12px';
		var offsetX = 0;
		var offsetY = -10;
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
			text : stationText(feature, resolution),
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
		var prop = feature.getProperties().properties;
		
		//var text = prop.YEAR+''+prop.MT+''+prop.DE+', '+prop.HOUR+'시 ';
		var text = prop.MT+''+prop.DE+', '+prop.HOUR+'시 ';
		
		if(text == null){
			text = '';
		}
		return text;
	}
	var stationText = function(feature, resolution){
		 
		var text = feature.get('properties').SCREEN_VALUE;
		if(text == null){
			text = '';
		}
		text = stringDivider(text, 26, '\n');
		if(stationLabelViewFlag){
			return text;	
		}else{
			return '';
		}
	}
	var stringDivider = function(str, width, spaceReplacer) {
		if(str == null){
			return '';
		}
		if(typeof(str) != 'string'){
			str = String(str);
		}
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
	var getStationList = function(){
		var obsDef = _MapService.getWfs(bizLayers.OBS , '*');
		obsDef.then(function(result){
			stationList = result.features;

			if(_CoreMap.getMap()){
				$('#stationOnBtn').trigger('click');	
			}
		});
	};
	var getStationMeasureValue = function(param, callback){
		var obsValDef = $.ajax({
            url : bizUrl+'/map/getFactValues?date='+param.date+'&itemCode='+param.itemCode,
            type : 'GET',
            contentType : 'application/json'
    	});
		$.when(obsValDef).then(function(response) {
			callback.apply(this, [response]);
		});
	};
	
	var writeHighChart = function(highChartObj){
		$('#stationInfoWindow').show();
		$('#stationInfoIframe').hide();
		$('#highChart').show();
		$('#tmsLocation').hide();
		
		var dateArr = [];
		var seriesArr = [];
		var colorObj = {
				500:'#792bff',
				1000:'#e00051',
				1500:'#1d80f0'
		};
		
		var colorArr = [];
		var preDate = null;
		
		for(key in highChartObj.dates){
			for(var i = 0; i<highChartObj.legend.length; i++){

				if(!seriesArr[i]){
					seriesArr[i] = {};
				}

				if(!seriesArr[i].data){
					seriesArr[i].data = [];
				}

				if(!seriesArr[i].name){
					seriesArr[i].name = highChartObj.legend[i];
				}
				
				
				if(!highChartObj.data[highChartObj.dates[key].idx][highChartObj.legend[i]]){
					seriesArr[i].data[highChartObj.dates[key].idx] = null;
				}else{
					seriesArr[i].data[highChartObj.dates[key].idx] = highChartObj.data[highChartObj.dates[key].idx][highChartObj.legend[i]];
					if(maxValue < highChartObj.data[highChartObj.dates[key].idx][highChartObj.legend[i]]){
						maxValue = highChartObj.data[highChartObj.dates[key].idx][highChartObj.legend[i]];
					}
				}


				if(colorArr.indexOf(colorObj[highChartObj.legend[i]]) == -1){
					colorArr.push(colorObj[highChartObj.legend[i]]);
				}
			}
			
			dateArr[highChartObj.dates[key].idx] = key;

		}
		for(var i = 0; i<dateArr.length; i++){
			if(preDate != dateArr[i].substring(4,8)){
				preDate = dateArr[i].substring(4,8);
				dateArr[i] = dateArr[i].substring(4,6) + '/' + dateArr[i].substring(6,8);
			}else{
				dateArr[i] = dateArr[i].substring(8,10);
			}
		}
		var option = {
				chart: {
					renderTo: 'highChartDiv',             //div 태그와 연동되는 필수(str)
					type: 'line'
				},
				plotOptions: {
					series: {
						marker: {
							enabled: false
						}
					}
				},
				lang: {
					noData: "측정자료가 없습니다."
				},
				noData: {
					style: {
						fontWeight: 'bold',
						fontSize: '10px',
						color: '#303030'
					}
				}, 
				 colors: colorArr,
				credits : { 
					enabled: false
				},
				title: {
					text: ''                  //상단제목(str)
				},
				subtitle: {
					text: ''               //상단제목 아래 작은 소제목(str)
				},
				xAxis: {
					categories: dateArr,      //x축 범례(str)
					tickInterval: 3       //x축 범례 간격(int)
				},
				yAxis: {
					title: {
						text: ''             //y축 설명(str)
					},
					min : 0,
					max : 2000,
					plotLines: [{
						value: 0,
						width: 1,
						color: '#808080'

					}]
				},
				tooltip: {
					valueSuffix: ''          // 마우스 오버시 데이터 단위표시(str)
				},
				legend: {
					layout: 'vertical',
					align: 'right',
					verticalAlign: 'middle',
					borderWidth: 0,
					enabled: true             //리전드 히든처리 유무(true, false)
				},

				series:seriesArr                   //json형태 obj값(차트마다 상이함)
		};
		//차트 생성
		var chart = new Highcharts.Chart(option);
	};
	var getDustFeature = function(){
		var isBtnOff = $('#dustLabel')[0].src.indexOf('_on')==-1?isBtnOff=true:isBtnOff=false; 
		
		if(isBtnOff){
			return;
		}
		
		if(dustLayer != null){
			_MapEventBus.trigger(_MapEvents.map_removeLayer, dustLayer);
		}
		
		var stationMeasureDate = $('#stationMeasureDate').val();
		var stationMeasureTime = $('#stationMeasureTime').val();
		
		var dateTime = stationMeasureDate.split('.')[0] + stationMeasureDate.split('.')[1] + stationMeasureDate.split('.')[2] + stationMeasureTime;
		
		var getDustData = $.ajax({
			url : '/map/getDustData?date='+dateTime+'&itemCode='+$('#itemCode').val(),
			type : 'GET',
			contentType : 'application/json'
		});
		
		$.when(getDustData,_MapService.getWfs('GIS_SD_PT','*',undefined)).then(function(dustData,sdPtFeatures){
			
			dustLayerFeatures = dustData[0].data;
			sdPtLayerFeatures = sdPtFeatures[0].features;
			writeDustFeature(dustData,sdPtFeatures);
		});
	};
	
	var writeDustFeature = function(dustData,sdPtFeatures){
		var dustFeature = [];
		var dustObj = {};
		
		for(var i = 0; i < dustLayerFeatures.length; i++){
			if(dustLayerFeatures[i].ADM_CD){
				dustObj[dustLayerFeatures[i].ADM_CD] = dustLayerFeatures[i];
			}
		}
		
		for(var i = 0; i < sdPtLayerFeatures.length; i++){
			var dObj = dustObj[sdPtLayerFeatures[i].properties.ADM_CD];
			if(dObj){
				var feature = new ol.Feature({geometry:new ol.geom.Point(sdPtLayerFeatures[i].geometry.coordinates), properties:{VALUE:dObj.VALUE,ITEM_CODE:dObj.ITEM_CODE,DO_NM:sdPtLayerFeatures[i].properties.DO_NM}})
				dustFeature.push(feature);
			}else{
				var feature = new ol.Feature({geometry:new ol.geom.Point(sdPtLayerFeatures[i].geometry.coordinates), properties:sdPtLayerFeatures[i].properties});
			    dustFeature.push(feature);
			}
		}
		
		dustLayer = new ol.layer.Vector({
			source : new ol.source.Vector({
				features : dustFeature
			}),
			style : dustStyleFunction,
			zIndex: 2
		});
		
		_MapEventBus.trigger(_MapEvents.map_addLayer, dustLayer);	
	};
	var dustStyleFunction = function(feature, resolution){
		
		var getFeatureValue = feature.getProperties().properties;
		var addrText ={
				'서울특별시':'서울',
				'인천광역시':'인천',
				'경기도':'경기',
				'강원도':'강원',
				'충청북도':'충북',
				'충청남도':'충남',
				'경상북도':'경북',
				'대전광역시':'대전',
				'세종특별자치시':'세종',
				'경상남도':'경남',
				'대구광역시':'대구',
				'전라북도':'전북',
				'울산광역시':'울산',
				'전라남도':'전남',
				'광주광역시':'광주',
				'부산광역시':'부산',
				'제주특별자치도':'제주'
		};
		var addr = addrText[getFeatureValue.DO_NM];
		var value = '-';
		if(getFeatureValue.VALUE){
			value = parseFloat(getFeatureValue.VALUE);
		}
		var itemCode = $('#itemCode').val();
		if(getFeatureValue.ITEM_CODE){
			itemCode = getFeatureValue.ITEM_CODE;
		}
		
		var codeText = {
				'10008':{title:'<tspan x="35" y="15">PM<tspan baseline-shift = "sub" style="font-size:10px;">2.5</tspan></tspan>',dig:'㎍/㎥'},  
				'10007':{title:'<tspan x="35" y="15">PM<tspan baseline-shift = "sub" style="font-size:9px;"> 10</tspan></tspan>',dig:'㎍/㎥'},
				'10003':{title:'<tspan x="35" y="15">O<tspan baseline-shift = "sub" style="font-size:9px;">3</tspan></tspan>',dig:'ppm'},
				'10006':{title:'<tspan x="35" y="15">NO<tspan baseline-shift = "sub" style="font-size:9px;">2</tspan></tspan>',dig:'ppm'},
				'10002':{title:'CO',dig:'ppm'},
				'10001':{title:'<tspan x="35" y="15">SO<tspan baseline-shift = "sub" style="font-size:9px;">2</tspan></tspan>',dig:'ppm'}
		};
		
		var level1Val = 0.0;
		var level2Val = 0.0;
		var level3Val = 0.0;
		
		if(itemCode == '10007'){
			level1Val = 30.0;
			level2Val = 80.0;
			level3Val = 150.0;
		}else if(itemCode == '10008'){
			level1Val = 15.0;
			level2Val = 35.0;
			level3Val = 75.0;
		}else if(itemCode == '10003'){
			level1Val = 0.03;
			level2Val = 0.09;
			level3Val = 0.15;
		}else if(itemCode == '10006'){
			level1Val = 0.03;
			level2Val = 0.06;
			level3Val = 0.2;
		}else if(itemCode == '10002'){
			level1Val = 2.0;
			level2Val = 9.0;
			level3Val = 15.0;
		}else if(itemCode == '10001'){
			level1Val = 0.02;
			level2Val = 0.05;
			level3Val = 0.15;
		}
		
		var strokeColor = '';
		var strokeWidth = 4;
		if(value == null || value == '' || value == '-'){
			strokeColor = 'black';
			strokeWidth = 1;
		} else if(value <= level1Val){
			strokeColor = '#0043dd';
		} else if(value <= level2Val){
			strokeColor = '#31af42';
		} else if(value <= level3Val){
			strokeColor = '#faec9a';
		} else{
			strokeColor = '#d91117';
		}
		
		var codeObj = codeText[itemCode];
		
		var iconTemplate = '<svg width="70" height="66" version="1.1" xmlns="http://www.w3.org/2000/svg">'+
								'<defs><linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" /><stop offset="100%" style="stop-color:#ebebeb;stop-opacity:1" /></linearGradient></defs>'+
								'<rect rx="10" width="70" height="66" fill="url(#grad1)" style="stroke-width:'+strokeWidth+';stroke:'+strokeColor+';"></rect>'+
								'<rect y="44" width="70" height="22" fill="#5e5c4f"></rect>'+
								'<text x="35" y="15" fill="black" style="font-size: 12px; font-weight: bold; font-family:돋움;" text-anchor="middle" alignment-baseline="middle">' + codeObj.title + '</text>'+
								'<text x="35" y="33" fill="red" style="font-size: 12px; font-weight: bold; font-family:돋움;" text-anchor="middle" alignment-baseline="middle">' + value + codeObj.dig +'</text>'+
								'<text x="35" y="58" fill="white" style="font-size: 12px; font-weight: bold; font-family:돋움;" text-anchor="middle" alignment-baseline="middle">' + addr + '</text>'+
						   '</svg>'; 
		
		var imageSrc = 'data:image/svg+xml;charset=utf8,' + encodeURIComponent(iconTemplate);
		
		var img1 = document.createElement("IMG");
		img1.height = 66;
		img1.width = 70;
		img1.src = imageSrc;
		
		var icon = new ol.style.Icon({
			opacity: 1,
			img:img1,
			imgSize:[70,66]
		});
		
		var style =  new ol.style.Style({
			image: icon
		});
		
		feature.setStyle(style);
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
