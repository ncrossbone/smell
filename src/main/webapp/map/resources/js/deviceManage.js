var _DeviceManage = function () {
	var bizUrl = window.location.protocol+'//'+window.location.host;
	
	var selectedDevice;
	var selectedDeviceChart;
	
	var currentDate = {};
	
	var regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
	
	var deviceManagePopup, deviceManageChartPopup, bsmlPopup, bsmlPopup2, legendDiv, smsPopup;
	
	var init = function(){
		deviceManagePopup = $('#deviceManagePopup');
		deviceManageChartPopup = $('#deviceManageChartPopup'); 
		
		deviceManagePopup.draggable({ containment: '#map' });
		deviceManageChartPopup.draggable({ containment: '#map' });
		
		var ww = $(window).width();
		var wh = $(window).height();
		
		deviceManagePopup.css('left', parseInt(ww/2)-parseInt(deviceManagePopup.width()/2));
		deviceManagePopup.css('top', (parseInt(wh/2)-parseInt(deviceManagePopup.height()/2)-100));
		
		bsmlPopup = $('#bsmlPopup'); 
		bsmlPopup2 = $('#bsmlPopup2');
		legendDiv = $('#legendDiv');
		
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
	
	var reset = function(){
		deviceManagePopup.hide();
		
		selectedObj = null; 
		clock.hide();
    	_MapEventBus.trigger(_MapEvents.hide_odorSpread_layer, {});
    	legendDiv.hide();
    	
    	_MapEventBus.trigger(_MapEvents.hide_odorMovement_layer, {});
    	//clearLayerByName('odorOrigin');
    	
    	bsmlPopup.hide(); 
    	bsmlPopup2.hide();
    	$('#smsPopupCloseBtn').trigger('click');
	};
	var setEvent = function(){
		
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
		
		_MapEventBus.on(_MapEvents.task_mode_changed, function(event, data){
			if(data.mode == 2){
				deviceManagePopup.show();
			}else{
				// 초기화
				reset();
			}
		});
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
	};
	
	var setProcMsg = function(msg){
		if(msg.type == 'deviceSelected'){
			selectedDevice = msg;
			 
			deviceManageChartPopup.show();
			$('#deviceManagePopupIframe').get(0).contentWindow.location.reload(true);
		}
		if(msg.type == 'deviceChartPopupReady'){
			try{
				if(selectedDevice == null){
					return;
				}
				$('#deviceManagePopupIframe').get(0).contentWindow.getChartData(selectedDevice);	
			}catch(e){
				console.log(e);
			}
		}
		
		
		if(msg.type == 'deviceChartSelected'){
			console.log(msg);
			var datetime =  msg.datetime.replace(regExp, '');
			currentDate.date = datetime.substring(0,6);
			currentDate.time = datetime.substring(6,8); 
			_MapEventBus.trigger(_MapEvents.setCurrentDate, currentDate);
			
			selectedDeviceChart = msg;
			
			_MapEventBus.trigger(_MapEvents.map_move, msg);	
		}
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