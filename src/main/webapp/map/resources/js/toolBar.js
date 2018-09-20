var _ToolBar = function () {
	var sggSelect, dongSelect, dongSelect;
	
	var setParams = {
			sido : {
           		 layerNm:"GIS_SD_PT",
           		 outFiled: "ADM_CD,DO_NM"
            },
            sgg : {
            	 layerNm:"GIS_SGG_PT",
           		 outFiled: "ADM_CD,CTY_NM"
            },
            dong: {
            	 layerNm:"GIS_BDONG_PT",
           		 outFiled: "ADM_CD,DONG_NM"
            }
	}
	
	var dustSelectVal = 0;
	
	var sggData = [];
	var dongData = [];
	
	var init = function(){
		sidoSelect = $("#sidoSelect")[0];
		sggSelect = $("#sggSelect")[0];
		dongSelect = $("#dongSelect")[0];
		
//		getSido();
//		getDong();
//    	getSgg();
//    	
//    	
//    	setMapMoveEvent();
	}
	
	var setMapMoveEvent = function(){

		_MapEventBus.on(_MapEvents.map_moveend, function(mapChangeType){
			 
			 _MapService.getRealPointWfs("GIS_SGG" , "CTY_NM,geometry", _CoreMap.getMap().getView().getCenter()).then(function(response) {
				 if(response.features.length > 0){
					 var remakeAdmCd = {
								sidoAdmCd : response.features[0].properties.ADM_CD.toString().substring(0,2)+"00000000",
								sggAdmCd : response.features[0].properties.ADM_CD.toString().substring(0,5)+"00000",
								dongAdmCd : null,
								type: 'moveMap'
						};
					 
					 // 콤보 박스로 이동되지 않을때 (마우스로 작동)
					 if(_MapChangeType){
						 _ToolBar.changeSelectBox(remakeAdmCd); 
						 
						 $.when(_MapService.getWfs("SGG_WEATHER_20" , "WEATHER_CODE,TMPRT,WD,WS", "ADM_CD="+remakeAdmCd.sggAdmCd)
								 ,_MapService.getWfs("SG_DUST_TOOLBAR" , "LEGALDONG_CODE,DATA_TIME,SO2,CO,O3,PM10,PM2_5", "LEGALDONG_CODE="+remakeAdmCd.sggAdmCd)).then(function(weatherResult,dustResult){
									 
									 if(weatherResult[0].features[0].properties.WD == null || weatherResult[0].features[0].properties.WS == null || weatherResult[0].features[0].properties.WEATHER_CODE == null){
										 _MapService.getWfs("SD_WEATHER_20" , "WEATHER_CODE,TMPRT,WD,WS", "ADM_CD="+remakeAdmCd.sidoAdmCd).then(function(result) {
											 bindWeatherIcon([result]);
										 });
									 }else{
										 bindWeatherIcon(weatherResult);
									 }
									 
									 bindDustSelect(dustResult);
						 })
						 
						 
						 //맵 체인지 값 초기값으로.. ( 콤보 박스로 맵이 이동되는 경우는 다시 false로 변환되기 때문에)
						 _MapChangeType = true;
					 }else{ // 콤보 박스로 작동될때
						 
						 $.when(_MapService.getWfs("SGG_WEATHER_20" , "WEATHER_CODE,TMPRT,WD,WS", "ADM_CD="+remakeAdmCd.sggAdmCd)
								 ,_MapService.getWfs("SG_DUST_TOOLBAR" , "LEGALDONG_CODE,DATA_TIME,SO2,CO,O3,PM10,PM2_5", "LEGALDONG_CODE="+remakeAdmCd.sggAdmCd)).then(function(weatherResult,dustResult){
									 
								 bindWeatherIcon(weatherResult);
								 bindDustSelect(dustResult);
						 })
						 /*_MapService.getWfs("SD_WEATHER" , "WEATHER_CODE,TMPRT,WD,WS", "ADM_CD="+remakeAdmCd.sidoAdmCd).then(function(result) {
							 bindWeatherIcon([result]);
						 });*/
						 
						 _MapChangeType = true;
					 }
					 
				 }
			 });
		});
	}
	var bindADMSelectBox = function(respose, selectId, selectText){
		
		var selectBox = $('#'+selectId)[0];
		for(var i = 0 ; i < respose.features.length; i++ ){
			var opt = document.createElement("option");
			opt.text = respose.features[i].properties[selectText];
			opt.properties = respose.features[i].properties;
			opt.value = respose.features[i].properties.ADM_CD;
			if(selectId != "sidoSelect"){
				opt.hidden = true;
			}
			selectBox.add(opt,null);	
		}
	}
	
	var bindADMOptionBox = function(respose, selectId, selectText){
		
		var selectBox = $('#'+selectId)[0];
		for(var i = 0 ; i < respose.length; i++ ){
			var opt = document.createElement("option");
			opt.text = respose[i][selectText];
			opt.properties = respose[i];
			opt.value = respose[i].ADM_CD;
			selectBox.add(opt,null);	
		}
	}
	
	var getSido = function(){
		_MapService.getWfs(setParams.sido.layerNm , setParams.sido.outFiled).then(function(response) {
			bindADMSelectBox(response, "sidoSelect", "DO_NM")
		});
	} 
	
	var getSgg = function(){
		_MapService.getWfs(setParams.sgg.layerNm , setParams.sgg.outFiled).then(function(response) {
			//bindADMSelectBox(response, "sggSelect", "CTY_NM")
			if(response.features.length > 0){
				for(var i = 0 ; i < response.features.length ; i ++){
					sggData.push(response.features[i].properties);
				}
			}
		});
	}
	
	var getDong = function(){
		_MapService.getWfs(setParams.dong.layerNm , setParams.dong.outFiled).then(function(response) {
//			bindADMSelectBox(response, "dongSelect", "DONG_NM")
			if(response.features.length > 0){
				for(var i = 0 ; i < response.features.length ; i ++){
					dongData.push(response.features[i].properties);
				}
			}
		});
	}
	
	
	var bindSgg = function(type){
		
		var options = [];
		
		$("#sggSelect option[value!='none']").each(function() {
		    $(this).remove();
		});
		
		//removeOptions("sggSelect");
		
		if(sggData.length > 0){
			for(var i = 1 ; i < sggData.length ; i++){
				if(sggData[i].ADM_CD.substring(0,2)+"00000000" == $("#sidoSelect").val()){
					options.push(sggData[i]);
				}
			}
		}
		
		bindADMOptionBox(options, "sggSelect", "CTY_NM")
		
		
		if(type != 'moveMap'){
			//extentChange(sidoSelect.selectedOptions[0].properties.ADM_CD,"SD_PT_TEST");
			_MapChangeType = false;
			extentChange($("#sidoSelect").val(),"GIS_SD_PT");
		}
		
	}
	
	var bindDong = function(type){
		
		var options = [];
		//removeOptions("dongSelect");
		
		
		var sggSelect = document.getElementById("sggSelect");
		var dongSelect = document.getElementById("dongSelect");
		
		$("#dongSelect option[value!='none']").each(function() {
		    $(this).remove();
		});
			
		
		if(dongData.length > 0 ){
			for(var i = 0 ; i < dongData.length ; i++){
				if(dongData[i].ADM_CD.substring(0,5)+"00000" == $("#sggSelect").val()){
					options.push(dongData[i]);
				}
			}
		}
		
		bindADMOptionBox(options, "dongSelect", "DONG_NM");
		
		if(type != 'moveMap'){
			_MapChangeType = false;
			extentChange($("#sggSelect").val(),"GIS_SGG_PT");
		}
	}
	
	var bindRe = function(){
		
		var dongSelect = document.getElementById("dongSelect");
		
		extentChange($("#dongSelect").val(),"GIS_BDONG_PT");
		
	}
	
	
	var extentChange = function(ADM_CD, serviceName){
		$.ajax({
            //url : _MapServiceInfo.serviceUrl+"?"+_MapServiceInfo.params +"&typeName=airkorea:"+serviceName+"&CQL_FILTER=ADM_CD="+ADM_CD+"&urlType=geoServer",
			url : _proxyUrl + _MapServiceInfo.params +"&typeName=airkorea:"+serviceName+"&CQL_FILTER=ADM_CD="+ADM_CD+"&urlType=geoServer",
            type : 'GET',
            async : true,
            contentType : 'application/json',
            success : function(response_) {
            	if(response_.features.length > 0){
            		
            		var features = new ol.format.GeoJSON().readFeatures( response_ );
            		
            		//좌표로 이동
            		if(serviceName == "GIS_SD_PT"){
        				_CoreMap.centerMap(features[0].getGeometry().getCoordinates()[0], features[0].getGeometry().getCoordinates()[1],11,false);
        			}else if(serviceName == "GIS_SGG_PT"){
        				_CoreMap.centerMap(features[0].getGeometry().getCoordinates()[0], features[0].getGeometry().getCoordinates()[1],14);
        			}else if(serviceName == "GIS_BDONG_PT"){
        				_CoreMap.centerMap(features[0].getGeometry().getCoordinates()[0], features[0].getGeometry().getCoordinates()[1],18);
        			}
            		
            		// Extent 로 이동
            		//_CoreMap.zoomToExtent(features[0].getGeometry().getExtent());
            	}
            	
           },
           fauls: function(e){
        	   console.info(e)
           }
       });
		
	}
	
	// select option 리셋
	var initSelectOption = function(selectId){
		
		$('#'+selectId).val('none');
		
		
	}
	
	//시도 시군구 읍면동 binding
	var changeSelectBox = function(remakeAdmCd){
		
		$('#sidoSelect').val(remakeAdmCd.sidoAdmCd);
		
		bindSgg(remakeAdmCd.type);
		
		$('#sggSelect').val(remakeAdmCd.sggAdmCd);
		
		
		if(remakeAdmCd.dongAdmCd != null){
			bindDong(remakeAdmCd.type);
			$('#dongSelect').val(remakeAdmCd.dongAdmCd);
		}else{
			_ToolBar.makeDong();
			$('#dongSelect').val('none');
		}
	}
	
	var moveToAdmCd = function(admCd){
		//_ToolBar.moveToAdmCd(4725025021)
		//admCd.toString().substring(0,2)+"000000"  시도    47000000
		//admCd.toString().substring(0,5)+"000"  시군구  74250000
		//admCd.toString().substring(0,8)+"00"  읍면동  47250250
		var remakeAdmCd = {
				sidoAdmCd : admCd.toString().substring(0,2)+"00000000",
				sggAdmCd : admCd.toString().substring(0,5)+"00000",
				dongAdmCd : admCd.toString().substring(0,8)+"00"
		};
		
		
		changeSelectBox(remakeAdmCd);
		
		
		admCd = remakeAdmCd.dongAdmCd;
		extentChange(admCd,"GIS_BDONG_PT");
		
	}
	
	var jusoPopup = function(){
		window.open("/map/jusoPopup.jsp","pop","width=870,height=820, scrollbars=yes, resizable=yes");
	}
	
	var admLayerSelect = function(value){
		if(value == "sido"){
    		_CoreMap.showSidoLayer();
    	}else if(value == "sgg"){
    		_CoreMap.showSggLayer();
    	}else if(value == "dong"){
    		_CoreMap.showDongLayer();
    	}
	}
	
	var bindWeatherIcon = function(result){
		
		if(result[0].features.length > 0){
			var resultValue = result[0].features[0];
			var weathericon = _ThemathicLayer.weatherIcon(resultValue);
			$('#weatherIcon svg').remove();
			if(resultValue.properties.WD)
			$('#weatherIcon').append(weathericon);
			
			var windicon = _ThemathicLayer.windIcon(resultValue);
			$('#windIcon svg').remove();
			$('#windIcon').append(windicon);
			
		}
	}
	
	var bindDustSelect = function(result){
		if(result[0].features.length > 0){
			var resultValue = result[0].features[0];
			
			$("#dustSelect option[value!='none']").each(function() {
			    $(this).remove();
			});
			
			var selectBox = $("#dustSelect")[0];
			var dustList = ['PM2_5','PM10','CO','O3','SO2'];
			for(var i = 0 ; i < dustList.length ; i++){
				var opt = document.createElement("option");
				
				var value = resultValue.properties[dustList[i]];
				if(value == null){
					value = '-';
				}
				
				if(dustList[i] == 'PM2_5'){
					
					opt.text = 'PM2.5 : ' + value;
					
				}else{
					
					opt.text = dustList[i] + ' : ' + value;
					
				}
				opt.value = dustList[i];
				selectBox.add(opt,null);
				
			}
			
			// 초기값 PM_2 값 select
			//$('#dustSelect').val(dustList[0]);
			$('#dustSelect')[0].selectedIndex = dustSelectVal;
			
			
		}
	}
	
	var dustSelect = function(){
		dustSelectVal = $('#dustSelect')[0].selectedIndex;
	}
	
    // public functions
    return {
    	  
        init: function () {
        	var me = this;
        	init();
        	
        	return me;
        },
        
        bindSgg: function(type){
        	initSelectOption("sggSelect");
        	initSelectOption("dongSelect");
        	bindSgg(type);
        },
        
        makeDong: function(type){
        	initSelectOption("dongSelect");
        	bindDong('moveMap');
        },
        
        bindDong: function(type){
        	initSelectOption("dongSelect");
        	bindDong(type);
        },
        
        bindRe: function(){
        	bindRe();
        },
        
//        clickRe: function(){
//        	clickRe();
//        },
        
        selectChange: function(){
        	
        },
        jusoPopup: function(){
        	jusoPopup();
        },
        
        moveToAdmCd: function(admCd){
        	moveToAdmCd(admCd);
        },
        
        changeSelectBox: function(admCd){
        	changeSelectBox(admCd)
        },
        
        admLayerSelect: function(value){
        	admLayerSelect(value);
        	
        },
        
        bindWeatherIcon: function(result){
        	bindWeatherIcon(result)
        },
        
        removeOptions: function(val){
        	if(val == "sggSelect"){
        		$('#sggSelect option')
        	}else{
        		
        	}
        },
        
        dustSelect: function(){
        	dustSelect();
        }
    }; 
  
}();
