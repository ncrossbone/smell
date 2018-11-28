var _ComplaintStatusInsert = function () {
	var currentDate = {};
	
	var complaintStatusMode = 0; // 0 = 민원접수 선택 , 1 = 민원등록및 위치확인, 2 = 인근민원 확인, 3 = 악취분포 확인, 4 = 악취원점 분석, 5 = 악취 저감 조치
	
	var complaintStatusRegPopup , complaintStatusPopup;
	
	var selectedObj = {};
	var popupOverlay;
	
	var init = function(){
		complaintStatusRegPopup = $('#complaintStatusRegPopup');
		complaintStatusPopup = $('#complaintStatusPopup');
		
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
		    	_MapEventBus.trigger(_MapEvents.setCurrentDate, currentDate);
		    }
		});
		Object.defineProperty(currentDate, 'time', {
			get: function(){
				return this._time;
			},
			set: function(time) {
		    	this._time = time;
		    	$('#workSpace2').html(currentDate.date + currentDate.time);
		    	_MapEventBus.trigger(_MapEvents.setCurrentDate, currentDate);
		    }
		});
		
		$('.workStep').on('click', function(){
			var mode = $(this).attr('mode');
			if(complaintStatusMode == mode){
				return;
			}
			changeMode(mode);
		});
	}
	
	var changeMode = function(mode){
		complaintStatusMode = mode;
		if(mode == 4){ 
			_MapEventBus.trigger(_MapEvents.show_odorSpread_layer, {});
		}else if(mode == 5){
			_MapEventBus.trigger(_MapEvents.show_odorMovement_layer, {});
		}
	};
	
	var setProcMsg = function(msg){
		if(msg.type == 'selectedCvpl'){
			if(!msg.x){
				msg.x = 127.417229;
				msg.y = 36.7002829999999;
				msg.title = '테스트';
				msg.addr = '청주시 청원구 오창읍';
				msg.date = '20181108';
				msg.time = '02'
			}
			
			selectedObj = msg;
			
			writePopup([msg.x,msg.y],msg.title,msg.addr);
			setBuffer(msg.x,msg.y);
			
			currentDate.date = msg.date;
			currentDate.time = msg.time;
			_MapEventBus.trigger(_MapEvents.setCurrentDate, currentDate);
			_MapEventBus.trigger(_MapEvents.map_move, msg);
		}
	};
	
	var setBuffer = function(x,y,bufferMeter){
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
	
	var writePopup = function(coord, title, addr, isInsert){

		var centerPoint =_CoreMap.convertLonLatCoord(coord,true);
		popupOverlay.setPosition(centerPoint);

		var cvplHtml = '<div class="tooltip2">';
		cvplHtml += '<p class="tt_tit2">';
		cvplHtml += '<span>'+title+'</span>';
		//cvplHtml += '<a href="#" class="plus_btn"></a>';
		cvplHtml += '<a href="#" class="btn06 pop_close"></a>';
		cvplHtml += '</p>';
		cvplHtml += '<div class="pop_conts3">';
		cvplHtml += addr;
		cvplHtml += '</div>';
		cvplHtml += '</div>';
		
		$('#cvplPopupOverlay').html(cvplHtml);

		$('#cvplPopupOverlay').show();
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