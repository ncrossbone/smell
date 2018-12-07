var _WestCondition = function () {
    var dateMappingObj = {};
    var cityMappingObj = {};
    var noDataContent = '데이터가 없습니다.';
    var currentResolution;
    var maxFeatureCount;
    var clusterDistance = 100;
    var cityTownObj = {};
    var POIConditionObj = {};
    
    var reW = 0,reH = 0;
    var maxHeight = 0;
	var defaultHeight = 0;
	var labelViewLevel = 16;
	
	var cityArr = [];
	var dateArr = [];
	var sensoryInitTownCode ='43114';
	var initTownCode = '4311';
	
    var westLayerObj = {
    		CVPL_POINT : ':CVPL_POINT',
    		SHP_BDONG : ':SHP_BDONG',
    		SHP_POI : ':shp_poi',
    		SHP_SGG_PT : ':shp_sgg_pt',
    		SHP_BDONG_PT:':shp_bdong_pt',
    		SHP_BPLC_FOR_WESTCONDITION:':shp_bplc_for_westcondition',
    		ODORREDUCTION:':odorReduction'
    };
    var contentsConfig = {
    	'complaintStatus':{layerType:'cluster',
    					  title:'민원현황',
    					  keyColumn:['CVPL_NO'],
    					  isVisible:true,
    					  isUseGeoserver:false,
    					  isWriteGrid:true,
    					  isPopupShow:true,
    					  popupColumnArr:[{text:'민원 일시',id:'CVPL_DT'},{text:'민원 위치',id:'CVPL_LC'},{text:'민원 내용',id:'CVPL_CN'}],
    					  columnArr:[{name:'CVPL_NO',title:'민원 번호',width:40},
    					             {name:'CVPL_DT',title:'민원 일시',width:70},
    					             {name:'CPTTR',title:'민원인',width:40},
    					             {name:'CPTTR_CTTPC',title:'민원인 연락처',width:70},
    					             {name:'CVPL_LC',title:'민원 위치'},
    					             {name:'CVPL_CN',title:'민원 내용'},
    					             {name:'REGIST_DT',title:'등록 일시',width:70},
    					             {name:'REGISTER_ID',title:'등록자 ID',width:40},
    					             {name:'CHANGE_DT',title:'변경 일시',width:70},
    					             {name:'CHANGER_ID',title:'변경자 ID',width:40}]
    	},
    	'portableMeasurement':{
						layerType:'base',
						title:'이동식 측정 데이터',
						keyColumn:['CODE','MESURE_DT'],
						isVisible:true,
						isUseGeoserver:false,
						isWriteGrid:true,
						isPopupShow:false,
						popupColumnArr:[{text:'검측 일시',id:'MESURE_DT'},{text:'센서 ID',id:'SENSOR_ID'},{text:'센서명',id:'OPR_STTUS_CODE'}],
						columnArr:[{name:'CODE',title:'센서 ID'},
						     {name:'MESURE_DT',title:'검측 일시',width:170},
						     {name:'OPR_STTUS_CODE',title:'가동 상태 코드'},
						     {name:'OU',title:'복합 악취'},
						     {name:'H2S',title:'황화수소'},
						     {name:'NH3',title:'암모니아'},
						     {name:'VOCS',title:'휘발성유기물'},
						     {name:'ETHANOL',title:'에탄올'},
						     {name:'TMA',title:'트리메틸아민'},
						     {name:'CH3SH',title:'메틸메르캅탄'},
						     {name:'CFC',title:'염소'},
						     {name:'PM2_5',title:'미세먼지2.5'},
						     {name:'PM10',title:'미세먼지10'},
						     {name:'SO2',title:'이산화황'},
						     {name:'NO2',title:'이산화질소'}]
    	},
    	'fixedMeasurement':{
			layerType:'base',
			title:'고정식 측정 데이터',
			keyColumn:['CODE'],
			isVisible:true,
			isUseGeoserver:false,
			isWriteGrid:true,
			isPopupShow:true,
			popupColumnArr:[{text:'센서 ID',id:'CODE'},{text:'센서 명',id:'SENSOR_NM'},{text:'주소',id:'ADDR'}],
			columnArr:[{name:'CODE',title:'센서 ID'},
			           {name:'SENSOR_NM',title:'센서 명'},
			     {name:'MESURE_DT',title:'검측 일시',width:170},
			     {name:'OPR_STTUS_CODE',title:'가동 상태 코드'},
			     {name:'OU',title:'복합 악취'},
			     {name:'H2S',title:'황화수소'},
			     {name:'NH3',title:'암모니아'},
			     {name:'VOCS',title:'휘발성유기물'},
			     {name:'ETHANOL',title:'에탄올'},
			     {name:'TMA',title:'트리메틸아민'},
			     {name:'CH3SH',title:'메틸메르캅탄'},
			     {name:'CFC',title:'염소'},
			     {name:'PM2_5',title:'미세먼지2.5'},
			     {name:'PM10',title:'미세먼지10'},
			     {name:'SO2',title:'이산화황'},
			     {name:'NO2',title:'이산화질소'},
			     {name:'DATE',title:'날짜',visible:false}]
    	},
    	'sensoryEvaluation':{
			layerType:'base',
			title:'관능 평가 데이터',
			keyColumn:['SENSE_EVL_NO'], 
			isVisible:true,
			isUseGeoserver:false,
			isPopupShow:true,
			isWriteGrid:true,
			popupColumnArr:[{text:'관능 평가 번호',id:'SENSE_EVL_NO'},{text:'주소',id:'ADD_TEXT'},{text:'복합악취 ou',id:'BSML_FQ'}],
			columnArr:[{name:'SENSE_EVL_NO',title:'관능 평가 번호'},
					     {name:'MESURE_DATE',title:'측정일시'},
					     {name:'ADD_TEXT',title:'주소'},
						 {name:'BSML_FQ',title:'복합악취 OU'}]
    	},
    	'environmentCorporation':{
    		layerType:'base',
			title:'환경공단 측정망',
			keyColumn:['CODE'],
			isVisible:true,
			isPopupShow:true,
			isUseGeoserver:false,
			isWriteGrid:true,
			popupColumnArr:[{text:'측정소 코드',id:'CODE'},{text:'측정소 명',id:'NAME'},{text:'주소',id:'ADDR'}],
			columnArr:[{name:'NAME',title:'측정소명',width:170},
		     {name:'MESURE_DT',title:'검측 일시',width:170},
			 {name:'SO2_DNSTY',title:'아황산가스 농도'},
			 {name:'CMO_DNSTY',title:'일산화탄소 농도'},
			 {name:'OZ_DNSTY',title:'오존 농도'},
			 {name:'NO2_DNSTY',title:'이산화질소 농도'},
			 {name:'PM10_DNSTY',title:'PM10 농도'},
			 {name:'PM10_HOUR24_PREDICT_MVMN_DNSTY',title:'PM10_24시간 예측 이동 농도'},
			 {name:'PM25_DNSTY',title:'PM2.5 농도'},
			 {name:'PM25_HOUR24_PREDICT_MVMN_DNSTY',title:'PM2.5 24시간 예측 이동 농도'},
			 {name:'UNITY_AIR_ENVRN_NCL',title:'통합 대기 환경 수치'},
			 {name:'UNITY_AIR_ENVRN_IDEX',title:'통합 대기 환경 지수'},
			 {name:'SO2_IDEX',title:'아황산가스 지수'},
			 {name:'CMO_IDEX',title:'일산화탄소 지수'},
			 {name:'OZ_IDEX',title:'오존 지수'},
			 {name:'NO2_IDEX',title:'이산화질소 지수'},
			 {name:'PM10_HOUR24_GRAD',title:'PM10 24시간 등급'},
			 {name:'PM25_HOUR24_GRAD',title:'PM2.5 24시간 등급'},
			 {name:'PM10_HOUR1_GRAD',title:'PM10 1시간 등급'},
			 {name:'PM25_HOUR1_GRAD',title:'PM2.5 1시간 등급'},
			 {name:'CODE',title:'코드',visible:false}]
    	},
    	'unmannedOdor':{
    		layerType:'base',
			title:'청주시 무인악취 측정망',
			keyColumn:['CODE'],
			isVisible:true,
			isUseGeoserver:false,
			isPopupShow:true,
			isWriteGrid:true,
			popupColumnArr:[{text:'센서 ID',id:'CODE'},{text:'센서 명',id:'SENSOR_NM'},{text:'주소',id:'ADDR'}],
			columnArr:[{name:'CODE',title:'센서 ID'},
			           {name:'SENSOR_NM',title:'센서 명'},
			     {name:'MESURE_DT',title:'검측 일시',width:170},
			     {name:'OPR_STTUS_CODE',title:'센서명'},
			     {name:'OU',title:'복합 악취'},
			     {name:'H2S',title:'황화수소'},
			     {name:'NH3',title:'암모니아'},
			     {name:'VOCS',title:'휘발성유기물'},
			     {name:'ETHANOL',title:'에탄올'},
			     {name:'TMA',title:'트리메틸아민'},
			     {name:'CH3SH',title:'메틸메르캅탄'},
			     {name:'CFC',title:'염소'},
			     {name:'PM2_5',title:'미세먼지2.5'},
			     {name:'PM10',title:'미세먼지10'},
			     {name:'SO2',title:'이산화황'},
			     {name:'NO2',title:'이산화질소'},
			     {name:'DATE',title:'날짜',visible:false}]
    	},
    	'odorOrigin':{
    		cqlForMappingObj:{'cityDistrict':'LEGALDONG_CODE',
    			'town':'LEGALDONG_CODE',
    			'branchName':'CMPNY_NM'
    				},
    			layerName:westLayerObj.SHP_BPLC_FOR_WESTCONDITION,
    			layerType:'polygon',
    			title:'악취원점 관리',
    			keyColumn:['BPLC_ID'],
    			isVisible:true,
    			isUseGeoserver:true,
    			isPopupShow:true,
    			isWriteGrid:true,
    			popupColumnArr:[{text:'회사명',id:'CMPNY_NM'},{text:'주소',id:'LEGALDONG_ETC'},{text:'전화번호',id:'TELNO'}],
    			columnArr:[{name:'BPLC_ID',title:'사업장 ID',visible:false},
    			           {name:'BSML_TRGNPT_SE_CODE',title:'악취 원점 구분'},
    			           {name:'CMPNY_NM',title:'회사 명'},
    			           {name:'LEGALDONG_ETC',title:'주소'},
    			           {name:'TELNO',title:'전화번호'},
    			           {name:'INDUTY',title:'업종'},
    			           {name:'ERTHSF_AL',title:'지표 고도'},
    			           {name:'EXHST_QY',title:'배출량'}]
    	},
    	'odorReduction':{
    		cqlForMappingObj:{'cityDistrict':'LEGALDONG_CODE',
    			'town':'LEGALDONG_CODE',
    			'branchName':'CMPNY_NM'
    				},
    			layerName:westLayerObj.ODORREDUCTION,
    			layerType:'polygon',
    			title:'악취저감설비 관리',
    			keyColumn:['BPLC_ID'],
    			isVisible:true,
    			isUseGeoserver:true,
    			isPopupShow:true,
    			isWriteGrid:true,
    			popupColumnArr:[{text:'회사명',id:'CMPNY_NM'},{text:'주소',id:'LEGALDONG_ETC'},{text:'전화번호',id:'TELNO'}],
    			columnArr:[{name:'BPLC_ID',title:'사업장 ID',visible:false},
    			           {name:'REDUC_EQP_NM',title:'저감 설비 명'},
    			           {name:'REGISTER_ID',title:'등록자'},
    			           {name:'CMPNY_NM',title:'회사 명'},
    			           {name:'LEGALDONG_ETC',title:'주소'},
    			           {name:'TELNO',title:'전화번호'}]
    	},
    	'observatory':{
    		layerType:'base',
			title:'기상청 측정망',
			keyColumn:['STATION_ID'],
			isVisible:true,
			isUseGeoserver:false,
			isPopupShow:true,
			isWriteGrid:true,
			popupColumnArr:[{text:'측정소 코드',id:'STATION_ID'},{text:'측정소 명',id:'NAME'},{text:'주소',id:'POS'}],
			columnArr:[{name:'STATION_ID',title:'측정소 코드',visible:false},
			           {name:'NAME',title:'측정소 명'},
			     {name:'OBSR_TIME',title:'측정 일시'},
			     {name:'MIN60_ACCMLT_RAINFL',title:'60분 누적 강수량'},
			     {name:'DE_RAINFL',title:'일 강수량'},
			     {name:'TMPRT',title:'기온'},
			     {name:'MXMM_MONT_WD',title:'최대 순간 풍향'},
			     {name:'MXMM_MONT_WS',title:'최대 순간 풍속'},
			     {name:'MIN10_AVRG_WD',title:'10분 평균 풍향'},
			     {name:'MIN10_AVRG_WS',title:'10분 평균 풍속'},
			     {name:'HD',title:'습도'}]
    	},
    	'iotSensorInfo':{
    		layerType:'base',
			title:'IOT 센서 정보',
			keyColumn:['STATION_ID'],
			isVisible:true,
			isPopupShow:false,
			isUseGeoserver:false,
			isWriteGrid:false
    	},
    	'reductionMonitoring':{
			layerType:'base',
			title:'저감 모니터링',
			keyColumn:['CODE'],
			isVisible:true,
			isUseGeoserver:false,
			isWriteGrid:true,
			isPopupShow:true,
			popupColumnArr:[{text:'센서 ID',id:'CODE'},{text:'센서 명',id:'SENSOR_NM'},{text:'주소',id:'ADDR'}],
			columnArr:[{name:'CODE',title:'센서 ID'},
			           {name:'SENSOR_NM',title:'센서 명'},
			     {name:'MESURE_DT',title:'검측 일시',width:170},
			     {name:'OPR_STTUS_CODE',title:'센서명'},
			     {name:'OU',title:'복합 악취'},
			     {name:'H2S',title:'황화수소'},
			     {name:'NH3',title:'암모니아'},
			     {name:'VOCS',title:'휘발성유기물'},
			     {name:'ETHANOL',title:'에탄올'},
			     {name:'TMA',title:'트리메틸아민'},
			     {name:'CH3SH',title:'메틸메르캅탄'},
			     {name:'CFC',title:'염소'},
			     {name:'PM2_5',title:'미세먼지2.5'},
			     {name:'PM10',title:'미세먼지10'},
			     {name:'SO2',title:'이산화황'},
			     {name:'NO2',title:'이산화질소'},
			     {name:'DATE',title:'날짜',visible:false}]
    	}
    };
    
    var legendLayerList = [
    	{title:'어린이집',layerNm:'SHP_DYCR_FCLT',layerId:'SHP_DYCR_FCLT',isVisible:false,isTiled:true,cql:null,opacity:1},
    	{title:'유치원',layerNm:'SHP_KNDR_FCLT',layerId:'SHP_KNDR_FCLT',isVisible:false,isTiled:true,cql:null,opacity:1},
    	{title:'초등학교',layerNm:'SHP_ELMN_SCHL_FCLT',layerId:'SHP_ELMN_SCHL_FCLT',isVisible:false,isTiled:true,cql:null,opacity:1},
    	{title:'중학교',layerNm:'SHP_MDL_SCHL_FCLT',layerId:'SHP_MDL_SCHL_FCLT',isVisible:false,isTiled:true,cql:null,opacity:1},
    	{title:'고등학교',layerNm:'SHP_HIGH_SCHL_FCLT',layerId:'SHP_HIGH_SCHL_FCLT',isVisible:false,isTiled:true,cql:null,opacity:1}
    ]
    
    var legendLayer = function(){
    	var layer = _CoreMap.createTileLayer(legendLayerList);
    	//_MapEventBus.trigger(_MapEvents.map_addLayer, layer);
    	if(layer.length > 0 ){
    		for(var i = 0 ; i < layer.length ; i++){
            	_MapEventBus.trigger(_MapEvents.map_addLayer, layer[i]);
        	}
    	}
    }
    
    var legendLayerOnOff = function(value){
    	var layer = _CoreMap.getMap().getLayerForName(value.getAttribute('layerName'));
		if(value.checked == true){
			layer.setVisible(true);
		}else{
			layer.setVisible(false);
		}
    }
    
    
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
    };
    
    var init = function () {
    	cityArr = setCommonCombo({
			type:'select',
			parentTypeId:'CityDistrict',
			childTypeId:'Town',
			flag:'city',
		});
    	
    	_MapEventBus.on(_MapEvents.addWriteLayerForUseGeoserver, addWriteLayerForUseGeoserver);
    	
    	_MapEventBus.on(_MapEvents.addWriteLayerForBiz, addWriteLayerForBiz);
    	
    	_MapService.getWfs(westLayerObj.SHP_BDONG,'*',undefined,'cty_nm, dong_nm').done(function(data){
    		if(data.features.length == 0){
    			return;
    		}
    		
    		for(var i = 0; i < data.features.length; i++){
    			var properties = data.features[i].properties;
        		
    			if(!cityTownObj[properties.adm_cd.substr(0,5)]){
    				if(!cityTownObj[initTownCode]){
    					cityTownObj[initTownCode] = {};
        				cityTownObj[initTownCode].text = '전체';
        				cityTownObj[initTownCode].child = {};
    				}
    				
    				cityTownObj[properties.adm_cd.substr(0,5)] = {};
    				cityTownObj[properties.adm_cd.substr(0,5)].text = properties.cty_nm;
    				cityTownObj[properties.adm_cd.substr(0,5)].child = {};
    			}
    			
    			if(!cityTownObj[properties.adm_cd.substr(0,5)].child[properties.adm_cd]){
    				if(!cityTownObj[initTownCode].child[initTownCode]){
    					cityTownObj[initTownCode].child[initTownCode] = {};
        				cityTownObj[initTownCode].child[initTownCode].text = '전체';
    				}
    				
    				if(!cityTownObj[properties.adm_cd.substr(0,5)].child[properties.adm_cd.substr(0,5)]){
    					cityTownObj[properties.adm_cd.substr(0,5)].child[properties.adm_cd.substr(0,5)] = {};
    					cityTownObj[properties.adm_cd.substr(0,5)].child[properties.adm_cd.substr(0,5)].text = '전체';
    				}
    				
    				cityTownObj[properties.adm_cd.substr(0,5)].child[properties.adm_cd] = {};
    				cityTownObj[properties.adm_cd.substr(0,5)].child[properties.adm_cd].text = properties.dong_nm;
    			}
    		}
    		
    		
    		for(var i = 0; i < cityArr.length; i++){
    			var data = cityArr[i].indexOf('CityDistrict') > -1 ? cityTownObj : cityArr[i] =='sensoryEvaluationTown'?cityTownObj[sensoryInitTownCode].child:cityTownObj[initTownCode].child;
        		writeCity(data, cityArr[i]);
    		}
    		
    		writeCity(cityTownObj,'cityDistrictToolbar');
    		setToolbarCity({adm_cd:'4311425300'});
    		$('#sensoryEvaluationCityDistrict').val(sensoryInitTownCode);
    	});
    	
    	Common.getData({url:'/map/getItem.do', contentType: 'application/json', params: {contentsId:'environmentCorporation'} }).done(function(data){
    		if(data.length == 0){
    			return;
    		}
    		writeItem('environmentCorporation',data);
    	});
        
        dateArr = setCommonCombo({
        	type:'input',
        	parentTypeId:'StartDate',
        	childTypeId:'EndDate',
        	flag:'date',
        });
        
        var toDay = new Date();
		var hour = toDay.getHours()+1;
		var timeOptions = '';
		for(var i=0; i<25; i++){
			timeOptions += '<option '+(i==hour?'selected':'')+' value="'+(i<10 ? ('0'+i): i)+'">'+i+'시</option>';
		}
		
		$('#iotSensorInfoStartTime, #reductionMonitoringStartTime, #observatoryStartTime, #observatoryEndTime, #portableMeasurementStartTime, #portableMeasurementEndTime, #fixedMeasurementStartTime, #environmentCorporationStartTime, #environmentCorporationEndTime, #unmannedOdorStartTime, #unmannedOdorEndTime').html(timeOptions);
		
		var timeOptionMinute = '';
		
		for(var i=0; i<60; i++){
			timeOptionMinute += '<option value="'+(i<10 ? ('0'+i): i)+'">'+i+'분</option>';
		}
		$('#iotSensorInfoStartMinute, #reductionMonitoringStartMinute ,#fixedMeasurementStartMinute, #unmannedOdorStartMinute, #unmannedOdorEndMinute').html(timeOptionMinute);
		
        for(var i = 0; i < dateArr.length; i++){
        	$('#' + dateArr[i]).datepicker($.extend(datePickerDefine,{
        		yearSuffix: '년',
        		onSelect: function( selectedDate ) {
        				instance = $( this ).data( "datepicker" ),
        				date = $.datepicker.parseDate(
        						instance.settings.dateFormat ||
        						$.datepicker._defaults.dateFormat,
        						selectedDate, instance.settings );
        				$('#'+dateMappingObj[$( this ).attr('id')]).datepicker( "option", "minDate", date );
        		}
        	}));
        	
        	$('#' + dateArr[i]).datepicker('setDate', toDay);
        }
        
        var portableMeasurementItemHtml = '';
        var iotItemHtml = '';
        for(var i=3; i<contentsConfig['portableMeasurement'].columnArr.length; i++){
        	portableMeasurementItemHtml += '<option value=\''+contentsConfig['portableMeasurement'].columnArr[i].name+'\'>'+contentsConfig['portableMeasurement'].columnArr[i].title+'</option>';
           	var checked = i==3?'checked="checked"':'';
        	iotItemHtml += '<li><input type="checkbox" value="'+contentsConfig['portableMeasurement'].columnArr[i].name+'" id="iotSensorInfoCheckBox'+(i-2)+'" name="iotSensorInfoCheckBox" ' + checked + ' />';
        	iotItemHtml += '<label for="iotSensorInfoCheckBox'+(i-2)+'" class="contents">'+contentsConfig['portableMeasurement'].columnArr[i].title+'</label>';
        }
        
        $('#portableMeasurementItem, #fixedMeasurementItem, #reductionMonitoringItem').html(portableMeasurementItemHtml);
        
        $('.iotGrid').html(iotItemHtml);
        
        setEvent();
        
        setDefaultHeight();
        setMaxHeight();
    };
    
    var setMaxHeight = function(){
    	maxHeight = $(window).height() - $('#top').height() - $('#nav').height() - 22;
    };
    
    var setDefaultHeight = function(){
    	defaultHeight = $('#gridArea').height(); 
    };
    
    var addWriteLayerForBiz = function(event, options){
    	var layerId = options.layerId;
    	
		var paramObj = {
				contentsId:'fixedBasic'
		};
		
		Common.getData({url: '/map/getFeature.do', contentType: 'application/json', params: paramObj }).done(function(featureData){
			writeLayer(layerId,featureData,contentsConfig[layerId].isUseGeoserver);
		});
    };
    
    var addWriteLayerForUseGeoserver = function(event, options){
    	var geoserverLayerId = westLayerObj.SHP_BPLC_FOR_WESTCONDITION;
		var layerId = 'odorOrigin';
		var zindex = 999;
		
    	if(options.type == 1){
    		geoserverLayerId = westLayerObj.ODORREDUCTION;
    		layerId = 'odorReductionForPoint';
    		zindex = 9999;
    	}else if(options.type == 2){
    		geoserverLayerId = westLayerObj.ODORREDUCTION;
    		layerId = 'odorReductionForSvg';
    		zindex = 9999;
    	}
        	
    	var getLayerForName = _CoreMap.getMap().getLayerForName(layerId);
		if(getLayerForName){
			return;
		}
		
    	_MapService.getWfs(geoserverLayerId,'*',encodeURIComponent('1=1'), '').done(function (d) {
        	var featureArray = [];
        	var data = d.features;
        	
    		for(var i=0; i<data.length; i++){
    			var feature = new ol.Feature();

    			//point, line...
    			if(options.type == 1 || options.type == 2){
    				feature.setGeometry(new ol.geom.Polygon(data[i].geometry.coordinates));
    				var coord = ol.extent.getCenter(feature.getGeometry().getExtent());
    				feature.setGeometry(new ol.geom.Point(coord));
    			}else{
    				feature.setGeometry(new ol.geom.Polygon(data[i].geometry.coordinates));
    			}
    			feature.setProperties(data[i].properties);

    			featureArray.push(feature);
    		}
    		
    		var styleFunction = selectStyleFunction(layerId);
    		
    		var source = new ol.source.Vector({
				features: featureArray
			});
    		
    		var vectorLayer = new ol.layer.Vector({
    	        source: source,
    	        id:layerId,
    	        name:layerId,
    	        style:styleFunction,
    	        zIndex:zindex,
    	        visible:true
    		});
    		
    		_MapEventBus.trigger(_MapEvents.map_addLayer, vectorLayer);
		});
    };
    
    var writeItem = function(id, data){
    	var html = '';
    	for(var i = 0; i<data.length; i++){
    		var value = data[i].CODE?data[i].CODE:data[i].NAME;
    		html += '<option value="'+value+'">'+data[i].NAME+'</option>';
    	}
    	$('#'+id+'Item').html(html);
    };
    
    var initPOI = function(){
    	$('#poiPopup').draggable({ containment: '#map' });
    	var poiField = [{name:'POIID',title:'poi id',visible:false},
   		             {name:'LCLASDC',title:'대분류',width:'80px'},
		             {name:'MLSFCDC',title:'중분류',width:'80px'},
		             {name:'SCLASDC',title:'소분류',width:'80px'},
		             {name:'FMYNM',title:'지점명',width:'80px'},
		             {name:'ETCADRES',title:'주소'}];
    	
    	if(POIConditionObj['0']){
    		if($('#poiPopup').css('display')=='none'){
    			$('#poiPopup').show();
        		$('#poiSelect01').val(0);
        		writePOI(POIConditionObj[0].child,'poiSelect02');
        		writePOI(POIConditionObj[0].child[0].child,'poiSelect03');
        		$('#poiText').val('');
        		
        		$('#poiGrid').jsGrid({
            		width: '565px',
            		height: '220px',
            		inserting: false,
            		editing: false,
            		sorting: true,
            		paging: false,	
            		noDataContent: noDataContent,
            		data: [],
            		fields: poiField
            	});
    		}
    	}else{
    		Common.getData({url:'/map/getPOISelect.do', contentType: 'application/json', params: {} }).done(function(data){
            	$('#poiPopup').show();
            	$('#poiGrid').jsGrid({
            		width: '565px',
            		height: '220px',
            		inserting: false,
            		editing: false,
            		sorting: true,
            		paging: false,	
            		noDataContent: noDataContent,
            		data: [],
            		fields: poiField
            	});
            	
            	if(data.length == 0){
        			return;
        		}
            	var korObj = {};
            	var countObj = {
            			x:0,
            			y:0,
            			z:0
            	};
            	
            	for(var i = 0; i < data.length; i++){
            		if(!korObj[data[i].LCLASDC]){
            			korObj[data[i].LCLASDC] = {};
            			
            			countObj.x++;
            			POIConditionObj[countObj.x] = {};
            			POIConditionObj[countObj.x].child = {};
            			POIConditionObj[countObj.x].text = data[i].LCLASDC; 
            		}
            		
            		if(!korObj[data[i].LCLASDC][data[i].MLSFCDC]){
            			korObj[data[i].LCLASDC][data[i].MLSFCDC] = {};
            			
            			countObj.y++;
            			POIConditionObj[countObj.x].child[countObj.y] = {};
            			POIConditionObj[countObj.x].child[countObj.y].child = {};
            			POIConditionObj[countObj.x].child[countObj.y].text = data[i].MLSFCDC;
            		}
            		
            		if(!korObj[data[i].LCLASDC][data[i].MLSFCDC][data[i].SCLASDC]){
            			korObj[data[i].LCLASDC][data[i].MLSFCDC][data[i].SCLASDC] = '';
            			
            			countObj.z++;
            			POIConditionObj[countObj.x].child[countObj.y].child[countObj.z] = {};
            			POIConditionObj[countObj.x].child[countObj.y].child[countObj.z].text = data[i].SCLASDC;
            		}
            	}
            	
            	writePOI(POIConditionObj,'poiSelect01');
            	writePOI(POIConditionObj[1].child,'poiSelect02');
            	writePOI(POIConditionObj[1].child[1].child,'poiSelect03');

            	$('#poiSelect01, #poiSelect02').off('change').on('change',function(){
            		var mappingId = '';
            		if($(this).attr('id')=='poiSelect01'){
            			if(POIConditionObj[$(this).val()] == undefined){
            				writePOI([],'poiSelect02');
            			}else{
            				writePOI(POIConditionObj[$(this).val()].child,'poiSelect02');
            			}
            			
            			writePOI([],'poiSelect03');
            			//writePOI(POIConditionObj[$(this).val()].child[$('#poiSelect02').val()].child,'poiSelect03');
            		}else{
            			writePOI(POIConditionObj[$('#poiSelect01').val()].child[$(this).val()].child,'poiSelect03');
            		}
            	});
            	
            	$('#poiSearch').off('click').on('click',function(){
            		var poiSearchArr = ['poiSelect01','poiSelect02','poiSelect03'];
            		var paramObj = {poiText:$('#poiText').val()};
            		for(var i = 0; i < poiSearchArr.length; i++){
            			paramObj[poiSearchArr[i]] = $('#'+poiSearchArr[i]).find('option:selected').text();
            		}
            		
            		if(paramObj[poiSearchArr[0]] == "전체"){
            			_MapEventBus.trigger(_MapEvents.alertShow, {text:'대분류를 선택하세요.'});
            			return;
            		}
            		
            		if(paramObj.poiText == ""){
            			_MapEventBus.trigger(_MapEvents.alertShow, {text:'명칭을 입력하세요.'});
            			return;
            		}
            		
            		Common.getData({url:'/map/getPOISearch.do', contentType: 'application/json', params: paramObj }).done(function(data){
            			$('#poiGrid').jsGrid({
            	    		width: '565px',
            	    		height: '220px',
            	    		inserting: false,
            	    		editing: false,
            	    		sorting: true,
            	    		paging: false,	
            	    		noDataContent: noDataContent,
            	    		data: data,
            	    		fields: poiField,
            	    		rowClick:function(data){
            	    			
            	    			_MapService.getWfs(westLayerObj.SHP_POI,'*','POIID=\'' + data.item.POIID + '\'', '').done(function (data) {
            	    				if(data.features.length == 0){
            	    					return;
            	    				}
            	    				
            	    				deferredForSetCenter(data.features[0].geometry.coordinates);
            	    				
            	    				var getPOILayer = _CoreMap.getMap().getLayerForName('poi');
            	    	    		if(getPOILayer){
            	    	    			_MapEventBus.trigger(_MapEvents.map_removeLayer, getPOILayer);
            	    	    		}
            	    	    		
            	    				var poiLayer = new ol.layer.Vector({
            	    					source : new ol.source.Vector({
            	    						features : [new ol.Feature(new ol.geom.Point(data.features[0].geometry.coordinates))]
            	    					}),
            	    					style : new ol.style.Style({
            	    		    			image: new ol.style.Circle({
            	    		    				radius: 15,
            	    		    				stroke: new ol.style.Stroke({
            	    		    			    	color: '#313942',
            	    		    			    	width: 5
            	    		    			    }),
            	    		    				fill: new ol.style.Fill({
            	    		        		        color: '#f56ee9'
            	    		        		    })
            	    		    			})
            	    		    		}),
            	    					visible: true,
            	    					zIndex:1,
            	    					name:'poi'
            	    				});
            	    				
            	    		    	_MapEventBus.trigger(_MapEvents.map_addLayer, poiLayer);
            					});
            	    		}
            	    	});
            		})
            	});
            });
    	}
    };
    var initAll = function(){
    	var toDay = new Date();
		var hour = toDay.getHours()+1;
		
		for(var i = 0; i < cityArr.length; i++){
			var data = cityArr[i].indexOf('CityDistrict') > -1 ? cityTownObj : cityArr[i] =='sensoryEvaluationTown'?cityTownObj[sensoryInitTownCode].child:cityTownObj[initTownCode].child;
    		writeCity(data, cityArr[i]);
		}
		
		for(var i = 0; i < dateArr.length; i++){
			$('#' + dateArr[i]).datepicker('setDate', toDay);
		}
		
		$('#sensoryEvaluationCityDistrict').val(sensoryInitTownCode);
		
		
		$('#iotSensorInfoStartTime, #reductionMonitoringStartTime, #observatoryStartTime, #observatoryEndTime, #portableMeasurementStartTime, #portableMeasurementEndTime, #fixedMeasurementStartTime, #environmentCorporationStartTime, #environmentCorporationEndTime, #unmannedOdorStartTime, #unmannedOdorEndTime').val((hour<10 ? ('0'+hour): hour)+'');
		$('#iotSensorInfoStartMinute, #reductionMonitoringStartMinute ,#fixedMeasurementStartMinute, #unmannedOdorStartMinute, #unmannedOdorEndMinute').val('00');
		
		$('#complaintStatusCheckBox01').attr('checked',true);
		$('#complaintStatusCheckBox02').attr('checked',false);
		$('#complaintStatusCheckBox03').attr('checked',false);
		$('#portableMeasurementRadio1').attr('checked',true);
		$('#iotSensorInfoRadio01').attr('checked',true);
		$('#sensoryEvaluationStartOU').val(0);
		$('#sensoryEvaluationEndOU').val(100);
		
		for(var i = 0; i<$('input[id$=BranchName]').length; i++){
			$($('input[id$=BranchName]')[i]).val('');
		}
		
		$('#portableMeasurementItem, #fixedMeasurementItem, #reductionMonitoringItem').val('VOCS');
		$('#environmentCorporationItem').val('대기중금속');
		
		for(var i = 0; i < $('.iotGrid').find('input').length; i++){
			i==0?$($('.iotGrid').find('input')[i]).attr('checked',true):$($('.iotGrid').find('input')[i]).attr('checked',false);
		}
		
		_CoreMap.getMap().getView().setCenter([14189913.25028815, 4401138.987746553]);
		_CoreMap.getMap().getView().setZoom(13);
		
		for(key in contentsConfig){
			clearTab('place'+key);
		}
		
		$('#popup').hide();
		$('#poiPopup').hide();
		var getPOILayer = _CoreMap.getMap().getLayerForName('poi');
		if(getPOILayer){
			_MapEventBus.trigger(_MapEvents.map_removeLayer, getPOILayer);
		}
    };
    
    var setEvent = function(){
    	/*$('input[name$="CheckBox"]').off('change').on('change',function(){
    		var id = $(this).attr('id');
    		if(id.indexOf('iotSensorInfo')>-1){
    			checkSearchCondition(id.split('CheckBox')[0]);
    		}
    	});*/
    	
    	_MapEventBus.on(_MapEvents.write_bottom_grid_tab, function(event, data){
    		writeGrid(data.placeId, data.gridData);
		});
    	_MapEventBus.on(_MapEvents.clear_bottom_grid_tab, function(event, data){
    		clearOnlyTab('place'+data.placeId);
		});
    	
    	_MapEventBus.on(_MapEvents.task_mode_changed, function(event, data){
			// GIS 모드
			$('.topmenu').find('li').removeClass('on');
    		$('a[mode="' + data.mode + '"]').parent().addClass('on');
    		if(data.mode == 0){
    			$('.gisTaskMenu').show();
    			$('#tabOpeners').addClass('off');
    			$('#tabOpeners').removeClass('on');
    			tabCloseOpen($('#tabOpeners'));
    			$('#around_info').show();
    		}else{
    			$('.gisTaskMenu').hide();
    			$('#tabOpeners').addClass('on');
    			$('#tabOpeners').removeClass('off');
    			tabCloseOpen($('#tabOpeners'));
    			$('#around_info').hide();
    		}
		});
    	_MapEventBus.on(_MapEvents.hide_cvplPopup, function(event, data){
    		$('#popup').hide();
		});
    	
    	_MapEventBus.on(_MapEvents.show_cvplPopup, function(event, data){
    		$('#popup').show();
		});
    	
    	$('#tabOpeners').on('click', function(){
			tabCloseOpen($(this));
		});
    	
    	$('#gridMinimize, #gridMaximize, #gridRestore, #gridClose').off('click').on('click',function(){
    		gridBtnClickEvent($(this).attr('id'));
    	});
    	
    	$('#poiView').off('click').on('click',function(){
    		initPOI();
    	});
    	
    	$('#cityDistrictToolbar, #townToolbar').off('change').on('change',function(){
    		var shapeName = $(this).attr('id')=='cityDistrictToolbar'?westLayerObj.SHP_SGG_PT:westLayerObj.SHP_BDONG_PT;
    		_MapService.getWfs(shapeName, '*',encodeURIComponent('ADM_CD LIKE \''+$(this).val()+'%\''), '').then(function(result){
    			if(result.features.length == 0){
    				return;
    			}
    			_CoreMap.centerMap(result.features[0].geometry.coordinates[0], result.features[0].geometry.coordinates[1],13);
    		});
    	});
    	
    	$('a[id$="Views"]').off('click').on('click',function(){
    		$('#popup').hide();
    		checkSearchCondition($(this).attr('id').split('Views')[0]);
    	});
    	
    	$('.pop_close, .btn04').off('click').on('click',function(){
    		$(this).parent().parent().hide();
    		
    		if($(this).parent().parent().attr('id')=='poiPopup'){
    			var getPOILayer = _CoreMap.getMap().getLayerForName('poi');
        		if(getPOILayer){
        			_MapEventBus.trigger(_MapEvents.map_removeLayer, getPOILayer);
        		}
    		}
    	});
    	
    	$('.layerOnOff').off('click').on('click',function(){
    		var contentsId = $(this).parent().find('.lnb_conts').attr('id');
    		var isShow = false;
    		clearFocusLayer();
    		try{
    			if($(this)[0].style.background.indexOf('on') > -1 || !$(this)[0].style.background){
        			$(this).css('background','url(/map/images/btn_off.png)');
        			contentsConfig[contentsId].isVisible = false;
        		}else{
        			isShow = true;
        			$(this).css('background','url(/map/images/btn_on.png)');
        			contentsConfig[contentsId].isVisible = true;
        		}
    		}catch(e){}
    		
    		var reportCheck = $(this).parent().parent().attr('id');
    		// 분석쪽은 별도
    		if(reportCheck == 'smellReport'){
    			_MapEventBus.trigger(_MapEvents.clickLayerOnOff, {target:contentsId, isShow:isShow});
    		}else{
    			var layerForName = _CoreMap.getMap().getLayerForName(contentsId);
        		if(layerForName){
        			layerForName.setVisible(contentsConfig[contentsId].isVisible);
        		}
    		}
    	});
    	
    	_MapEventBus.on(_MapEvents.init, initAll);
    };
    
    var gridBtnClickEvent = function(id){
    	$('#clock').css('bottom','120px');
    	switch (id) {
		case 'gridMinimize':
			$('#gridArea').css('height', '40px');
			$('#gridMinimize').hide();
			$('#gridMaximize').hide();
			$('#gridRestore').show();
			$('#clock').css('bottom','165px');
			break;
		case 'gridMaximize':
			$('#gridArea').css('height', maxHeight);
			$('#' + id).hide();
			$('#gridRestore').show();
			
			for(key in contentsConfig){
				if($('#grid' + key).jsGrid()[0]){
					$('#grid' + key).jsGrid({height:(maxHeight-100) + 'px'})
				}
			}
			
			break;
		case 'gridRestore':
			$('#gridArea').css('height', defaultHeight);
			$('#' + id).hide();
			$('#gridMaximize').show();
			$('#gridMinimize').show();
			
			for(key in contentsConfig){
				if($('#grid' + key).jsGrid()[0]){
					$('#grid' + key).jsGrid({height:(defaultHeight-100) + 'px'})
				}
			}
			break;
		case 'gridClose':
			$('#popup').hide();
			for(key in contentsConfig){
				if($('#grid' + key).jsGrid()[0]){
					clearTab('place'+key);
				}else{
					var getLayerForName = _CoreMap.getMap().getLayerForName(key);
					if(getLayerForName){
						_MapEventBus.trigger(_MapEvents.map_removeLayer, getLayerForName);
					}
					clearFocusLayer();
				}
			}
			break;

		default:
			break;
		}
    };
    
    var checkSearchCondition = function(placeId, chartMode){
    	if(!contentsConfig[placeId]){
    		_MapEventBus.trigger(_MapEvents.alertShow, {text:'레이어 정의 필요.'});
    		return;
    	}

    	var searchPlace = $('#' + placeId).find('*');
    	var paramObj = {contentsId:placeId};

    	var cqlString = '';

    	for(var i = 0; i < searchPlace.length; i++){
    		var searchPlaceId = $(searchPlace[i]).attr('id');
    		var searchPlaceName = $(searchPlace[i]).attr('name');

    		if($(searchPlace[i]).is('input') || $(searchPlace[i]).is('select')){
    			if(searchPlaceName){
    				var splitName = searchPlaceName.split(placeId)[1];
    				var replaceName = splitName.replace(splitName.substr(0,1),splitName.substr(0,1).toLowerCase());

    				if(!paramObj[replaceName]){
    					if($($('input[name="' + searchPlaceName + '"]')[0]).attr('type')=='checkbox'){
    						if(typeof(paramObj[replaceName])!='Array'){
    							paramObj[replaceName] = [];
    						}
    						var checkboxArr = $('input[name="' + searchPlaceName + '"]:checked');

    						if(checkboxArr.length == 0){
    							_MapEventBus.trigger(_MapEvents.alertShow, {text:'항목을 선택하세요.'});
    							return;
    						}else if(checkboxArr.length > 4){
    							_MapEventBus.trigger(_MapEvents.alertShow, {text:'항목이 5개 이상 선택되었습니다.'});
    							return;
    						}
    						//var checkBoxCqlString = contentsConfig[placeId].cqlForMappingObj[replaceName] +' IN (';
    						for(var k=0; k<checkboxArr.length; k++){
    							paramObj[replaceName].push($(checkboxArr[k]).val());
    							//checkBoxCqlString += '\'' + $(checkboxArr[k]).val() + '\',';
    						}

    						//cqlString += checkBoxCqlString.substr(0,checkBoxCqlString.length-1) + ') AND ';
    					}else{
    						paramObj[replaceName] = $('input[name="' + searchPlaceName + '"]:checked').val();
    					}
    				}
    			}else if(searchPlaceId){
    				var splitId = searchPlaceId.split(placeId)[1];
    				var replaceId = splitId.replace(splitId.substr(0,1),splitId.substr(0,1).toLowerCase());

    				if(replaceId=='startDate' || replaceId=='endDate'){
    					var oper = replaceId=='startDate'?'>=':'<=';
    					var dateValue = $(searchPlace[i]).val().replace('.','').replace('.','');
    					paramObj[replaceId] = dateValue;

    					if(contentsConfig[placeId].cqlForMappingObj){
    						cqlString += contentsConfig[placeId].cqlForMappingObj[replaceId] + oper + '\'' + dateValue + '\' AND ';
    					}
    				}else{
    					paramObj[replaceId] = $(searchPlace[i]).val();
    					if(replaceId != 'cityDistrict'){
    						if(contentsConfig[placeId].cqlForMappingObj){
    							cqlString += contentsConfig[placeId].cqlForMappingObj[replaceId] + ' LIKE \'%' + $(searchPlace[i]).val() + '%\' AND ';
    						}
    					}
    				}
    			}
    		}
    	}


    	if(contentsConfig[placeId].isUseGeoserver){
    		$.when(Common.getData({url: '/map/getGrid.do', contentType: 'application/json', params: paramObj }),
    				_MapService.getWfs(contentsConfig[placeId].layerName,'*',encodeURIComponent(cqlString.substr(0,cqlString.length-5)), '')).then(function (gridData, pointData) {
    					writeGrid(placeId,gridData[0]);
    					writeLayer(placeId,pointData[0].features,contentsConfig[placeId].isUseGeoserver);
    				});
    	}else{
    		Common.getData({url: '/map/getFeature.do', contentType: 'application/json', params: paramObj }).done(function(featureData){
    			if(contentsConfig[placeId].isWriteGrid && !chartMode){
    				Common.getData({url: '/map/getGrid.do', contentType: 'application/json', params: paramObj }).done(function(gridData){
    					writeGrid(placeId,gridData);
    				})
    			}

    			writeLayer(placeId,featureData,contentsConfig[placeId].isUseGeoserver);
    		});
    	}

    };
    
    var clearFocusLayer = function(){
    	if(_CoreMap.getMap()){
    		var focusLayer = _CoreMap.getMap().getLayerForName('focus');
    		if(focusLayer){
    			_MapEventBus.trigger(_MapEvents.map_removeLayer, focusLayer);
    		}
    	}
    };
    
    var writeLayer = function(id, data, isUseGeoserver){
    	var getLayerForName = _CoreMap.getMap().getLayerForName(id);
		if(getLayerForName){
			_MapEventBus.trigger(_MapEvents.map_removeLayer, getLayerForName);
		}
		
    	if(data < 1){
			return;
		}
    	
    	clearFocusLayer();
    	
    	var pointArray = [];
		var source;
		
		for(var i=0; i<data.length; i++){
			var feature = new ol.Feature();
			
			if(isUseGeoserver){
				if(contentsConfig[id].layerType=='polygon'){
					feature.setGeometry(new ol.geom.Polygon(data[i].geometry.coordinates));
				}else{
					feature.setGeometry(new ol.geom.Point(data[i].geometry.coordinates));
				}
				feature.setProperties(data[i].properties);
			}else{
				if(100 < data[i].POINT_X && data[i].POINT_X < 200){
					feature.setGeometry(new ol.geom.Point(_CoreMap.convertLonLatCoord([data[i].POINT_X,data[i].POINT_Y],true)));
				}else{
					feature.setGeometry(new ol.geom.Point([data[i].POINT_X,data[i].POINT_Y]));
				}
				
				if($('#' + id + 'Item')[0]){
					data[i].itemType = $('#' + id + 'Item').val();
				}else if($('input[name='+id+'CheckBox]:checked')[0]){
					data[i].checkBox = $('input[name='+id+'CheckBox]:checked');
				}
				
				feature.setProperties(data[i]);
			}
			
			pointArray.push(feature);
		}
		
		if(contentsConfig[id]){
			if(contentsConfig[id].layerType=='cluster'){
				source = new ol.source.Cluster({
					distance: _CoreMap.getMap().getView().getZoom()==_CoreMap.getMap().getView().getMaxZoom()?1:clusterDistance,
					source: new ol.source.Vector({
						features: pointArray
					})
				});
			}else{
				source = new ol.source.Vector({
					features: pointArray
				});
				if(!isNaN(source.getExtent()[0])){
					_CoreMap.getMap().getView().fit(source.getExtent(),_CoreMap.getMap().getSize());
				}
			}
		}else{
			source = new ol.source.Vector({
				features: pointArray
			});
		}
		
		var styleFunction = selectStyleFunction(id);
		
		var vectorLayer = new ol.layer.Vector({
	        source: source,
	        id:id,
	        name:id,
	        style:styleFunction,
	        zIndex:2,
	        visible:contentsConfig[id].isVisible
		});
		
		_MapEventBus.trigger(_MapEvents.map_addLayer, vectorLayer);
    };
    
    
    var checkPointMarker = function(id, event){
    	
    	var getLayerForName = _CoreMap.getMap().getLayerForName(id);
		if(getLayerForName){
			_MapEventBus.trigger(_MapEvents.map_removeLayer, getLayerForName);
		}
    	
    	clearFocusLayer();
    	
    	var pointArray = [];
		var source;
		source = new ol.source.Vector({
			features: [new ol.Feature(new ol.geom.Point(event.coordinate))]
		});
		
		
		var styleFunction = selectStyleFunction(id);
		
		var vectorLayer = new ol.layer.Vector({
	        source: source,
	        id:id,
	        name:id,
	        style:styleFunction,
	        zIndex:2,
	        visible: true
		});
		
		_MapEventBus.trigger(_MapEvents.map_addLayer, vectorLayer);
    };
    
    var selectStyleFunction = function(id){
    	
    	var styleFunction;
    	switch (id) {
		case 'complaintStatus':
			styleFunction = clusterStyleFunction;
			break;
		case 'portableMeasurement':
			styleFunction = portableMeasurementStyleFunction;
			break;
		case 'fixedMeasurement':
			styleFunction = fixedMeasurementStyleFunction;
			break;
		case 'checkPoint':
			styleFunction = checkPointStyleFunction;
			break;
		case 'sensoryEvaluation':
			styleFunction = sensoryEvaluationStyleFunction;
			break;
		case 'environmentCorporation':
			styleFunction = environmentCorporationStyleFunction;
			break;
		case 'unmannedOdor':
			styleFunction = unmannedOdorStyleFunction;
			break;
		case 'odorOrigin':
		case 'odorReduction':
			styleFunction = odorOriginFunction;
			break;
		case 'odorReductionForPoint':
			styleFunction = odorReductionForPointFunction;
			break;
		case 'odorReductionForSvg':
			styleFunction = odorReductionForSvgFunction;
			break;
		case 'observatory':
			styleFunction = observatoryFunction;
			break;
		case 'iotSensorInfo':
			styleFunction = iotSensorInfoFunction;
			break;
		case 'reductionMonitoring':
			styleFunction = reductionMonitoringStyleFunction;
			break;
		default:
			break;
		}
    	
    	return styleFunction;
    };
    var odorReductionForSvgFunction = function(feature){
    	var prop = feature.getProperties();
    	//sttus_nm 1 : 가동중, 4 : 중지 x : 통신장애
    	var imageConfig = {
    			'4':'chart_feature_off',
    			'1':'chart_feature_on',
    			'X':'chart_feature_x',
    	};
    	
    	var style = new ol.style.Style({
    		geometry: feature.getGeometry(),
    		image: new ol.style.Icon(({
    			src: '/map/images/' + imageConfig[prop.STTUS_NM] + '.png'
    		})),
    		text: new ol.style.Text({
    			text: prop.BPLC_ID,
    			fill: new ol.style.Fill({
    				color: '#000'
    			}),
    			offsetX: -11,
    			font: 'bold 13px Arial'
    		})
    	});
    	
    	return style;
    };
    var reductionMonitoringStyleFunction = function(feature){
    	var text = feature.getProperties()[feature.getProperties().itemType]?feature.getProperties()[feature.getProperties().itemType].toFixed(2) + '':'-';
    	var offsetY = 0;
    	if(_CoreMap.getMap().getView().getZoom() >= labelViewLevel){
    		text += "\n\n" + feature.getProperties().SENSOR_NM;
    		offsetY = 15;
    	}
    	
    	var style = new ol.style.Style({
    		geometry: feature.getGeometry(),
    		image: new ol.style.Circle({
    			radius: 20,
    			fill: new ol.style.Fill({
    				color: '#792BFF'
    			}),
    			stroke: new ol.style.Stroke({
    				color: '#AFABAB',
    				width: 3
    			})
    		}),
			text: new ol.style.Text({
				text: text,
				fill: new ol.style.Fill({
					color: '#000'
				}),
				stroke : new ol.style.Stroke({
					color : '#fff',
					width : 3
				}),
				font: 'bold 12px Arial',
				offsetY: offsetY
			})
  		});
    	
    	return style;
    };
    
    var iotSensorInfoFunction= function(feature){
    	var checkBox = feature.getProperties().checkBox;
    	var width = 140;
    	var basicHeight = 25;
    	var height = basicHeight * (checkBox.length+1);
    	var itemArr = [];
    	
    	var img = document.createElement("IMG");
		img.height = height * checkBox.length;
		img.width = width;
		
		var svgString = '<svg width="' + width + '" height="' + height + '" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="columnGroup">';
		var title = feature.getProperties().SENSOR_NM;
		var x = 5;
		var dataX = 98;
		var y = 4;
		
		svgString += '<rect x="0" y="0" width="' + width + '" height="' + basicHeight + '" fill="#0070c0"/>';
		svgString += '<rect x="0" y="' + basicHeight + '" width="' + (width/3)*2 + '" height="' + height + '" fill="#f2f2f2"/>';
		svgString += '<rect x="' + (width/3)*2 + '" y="' + basicHeight + '" width="' + (width/3) + '" height="' + height + '" fill="#ffffff"/>';
		
		svgString += '<text x="'+x+'" y="'+y+'" font-size="13px" font-weight="bold" fill="#fff"><tspan dy="1em">' + title + '</tspan></text>';
		
		for(var i = 0; i < checkBox.length; i++){
			var resultValue = feature.getProperties()[$(checkBox[i]).val()]?feature.getProperties()[$(checkBox[i]).val()].toFixed(2):'-';
			svgString += '<text x="'+x+'" y="'+(y+(basicHeight*(i+1)))+'" font-size="13px" font-weight="bold" fill="#000">';
			svgString += '<tspan dy="1em">'+$(checkBox[i]).parent().find('label').text()+'</tspan>';
			svgString += '</text>';
			svgString += '<text x="'+dataX+'" y="'+(y+(basicHeight*(i+1)))+'" font-size="13px" fill="#000">';
			svgString += '<tspan dy="1em">' + resultValue + '</tspan>';
			svgString += '</text>';
    	}
		
		svgString += '</g></svg>';
		
		img.src = 'data:image/svg+xml;charset=utf8,'+encodeURIComponent(svgString);
		
		var style =  new ol.style.Style({
			image: new ol.style.Icon({
				opacity: 1,
				img:img,
				imgSize:[width,height]
			}),
	        zIndex:1
		});
    	
    	return style;
    };
    
    var observatoryFunction= function(feature){
    	var style = new ol.style.Style({
    		geometry: feature.getGeometry(),
    		image: new ol.style.Icon(({
    			src: '/map/images/obsrIcon.png'
    		})),
    		text: new ol.style.Text({
    			text: feature.getProperties().NAME,
    			fill: new ol.style.Fill({
    				color: '#000'
    			}),
    			stroke : new ol.style.Stroke({
    				color : '#fff',
    				width : 3
    			}),
    			offsetY: 30,
    			font: 'bold 12px Arial'
    		})
  		});
    	
    	return style;
    }
    
    var odorOriginFunction = function(feature){
    	//ed145b ffa800
    	var colorObj = {'BSL01001':'#ffde00',
    			'BSL01002':'#0072bc',
    			'BSL01003':'#ed145b',
    			'BSL01004':'#ffa800'};
    	var style = new ol.style.Style({
    		geometry: feature.getGeometry(),
    		fill: new ol.style.Fill({
		        color: colorObj[feature.getProperties().BSML_TRGNPT_SE_CODE]
		    }),
		    stroke: new ol.style.Stroke({
		    	color: '#313942',
		    	width: 7
		    }),
		    text: new ol.style.Text({
		    	text: feature.getProperties().CMPNY_NM,
		    	fill: new ol.style.Fill({
		    		color: '#000'
		    	}),
		    	stroke : new ol.style.Stroke({
		    		color : '#fff',
		    		width : 3
		    	}),
		    	font: 'bold 12px Arial',
		    	overflow:true
		    })
  		});
    	
    	return style;
    };
    var odorReductionForPointFunction = function(feature){
    	var style = new ol.style.Style({
    		geometry: feature.getGeometry(),
    		image: new ol.style.Circle({
    			radius: 10,
    			fill: new ol.style.Fill({
    		        color: '#ED7D31'
    		    }),
    		    stroke: new ol.style.Stroke({
    		    	color: '#AFABAB',
    		    	width: 3
    		    })
    		})
  		});
    	
    	return style;
    };
    var unmannedOdorStyleFunction = function(feature){
    	
    	var style = new ol.style.Style({
    		geometry: feature.getGeometry(),
    		image: new ol.style.Icon(({
    			src: '/map/images/unmanIcon.png'
    		})),
    		text: new ol.style.Text({
    			text: feature.getProperties().SENSOR_NM,
    			fill: new ol.style.Fill({
    				color: '#000'
    			}),
    			stroke : new ol.style.Stroke({
    				color : '#fff',
    				width : 3
    			}),
    			offsetY: 30,
    			font: 'bold 12px Arial'
    		})
  		});
    	
    	return style;
    };
    var environmentCorporationStyleFunction = function(feature){
    	
    	var style = new ol.style.Style({
    		geometry: feature.getGeometry(),
    		image: new ol.style.Icon(({
    			src: '/map/images/environIcon.png'
    		})),
    		text: new ol.style.Text({
    			text: feature.getProperties().NAME,
    			fill: new ol.style.Fill({
    				color: '#000'
    			}),
    			stroke : new ol.style.Stroke({
    				color : '#fff',
    				width : 3
    			}),
    			offsetY: 30,
    			font: 'bold 12px Arial'
    		})
  		});
    	
    	return style;
    };
    
    var sensoryEvaluationStyleFunction = function(feature){
    	var style = new ol.style.Style({
    		geometry: feature.getGeometry(),
    		image: new ol.style.Circle({
    			radius: 20,
    			fill: new ol.style.Fill({
    		        color: '#4472C4'
    		    }),
    		    stroke: new ol.style.Stroke({
    		    	color: '#AFABAB',
    		    	width: 3
    		    })
    		}),
    		text: new ol.style.Text({
    			text: feature.getProperties().BSML_FQ.toFixed(1),
    			fill: new ol.style.Fill({
    				color: '#000'
    			}),
    			stroke : new ol.style.Stroke({
    				color : '#fff',
    				width : 3
    			}),
    			font: 'bold 9px Arial'
    		})
  		});
    	
    	return style;
    };
    
    var portableMeasurementStyleFunction = function(feature){
    	var text = feature.getProperties()[feature.getProperties().itemType]?feature.getProperties()[feature.getProperties().itemType].toFixed(2) + '':'-';
    	var offsetY = 0;
    	if(_CoreMap.getMap().getView().getZoom() >= labelViewLevel){
    		text += "\n\n" + feature.getProperties().LABEL;
    		offsetY = 13;
    	}
    	
    	var style = new ol.style.Style({
    		geometry: feature.getGeometry(),
    		image: new ol.style.Icon(({
    			src: '/map/images/portable.png'
    		})),
			text: new ol.style.Text({
				text: text,
				fill: new ol.style.Fill({
					color: '#000'
				}),
				stroke : new ol.style.Stroke({
					color : '#fff',
					width : 3
				}),
				font: 'bold 12px Arial',
				offsetY: offsetY
			})
  		});
    	
    	return style;
    };
    
    var fixedMeasurementStyleFunction = function(feature){
    	var text = feature.getProperties()[feature.getProperties().itemType]?feature.getProperties()[feature.getProperties().itemType].toFixed(2) + '':'';
    	
    	var offsetY = 0;
    	if(_CoreMap.getMap().getView().getZoom() >= labelViewLevel){
    		text += "\n\n" + feature.getProperties().SENSOR_NM;
    		offsetY = 15;
    	}
    	var style = new ol.style.Style({
    		geometry: feature.getGeometry(),
    		image: new ol.style.Icon(({
    			src: '/map/images/fixed.png'
    		})),
			text: new ol.style.Text({
				text: text,
				fill: new ol.style.Fill({
					color: '#000'
				}),
				stroke : new ol.style.Stroke({
					color : '#fff',
					width : 3
				}),
				font: 'bold 12px Arial',
				offsetY: offsetY
			})
  		});
    	
    	return style;
    };
    
    var checkPointStyleFunction = function(feature){
    	var style = new ol.style.Style({
			image: new ol.style.Icon(({
		          src: '/map/images/pin.png',
		          anchor: [0.5,1]
		        }))
  		});
    	
    	return style;
    };
    
    var clickCluster = function(feature,name){
    	var coord = feature.getGeometry().getCoordinates();
    	var size = feature.get('features').length;
    	
    	if(size > 1){
    		_CoreMap.getMap().getView().animate({
        		center: coord,
                duration: 500,
                zoom: _CoreMap.getMap().getView().getZoom() + 1
        	});
    	}else{
    		var paramObj = {contentsId:name};
			for(var i = 0; i < contentsConfig[name].keyColumn.length; i++){
				paramObj[contentsConfig[name].keyColumn[i]] = feature.get('features')[0].getProperties()[contentsConfig[name].keyColumn[i]];
			}
    		clickSyncGridNVector(name,paramObj);
    	}
    };
    
    var clickBase = function(feature,name){
    	var paramObj = {contentsId:name};
    	for(var i = 0; i < contentsConfig[name].keyColumn.length; i++){
    		paramObj[contentsConfig[name].keyColumn[i]] = feature.getProperties()[contentsConfig[name].keyColumn[i]];
    	}
    	
    	if(feature.getProperties().CHART_MODE){
    		_MapEventBus.trigger(_MapEvents.getChartData, paramObj);
    	}
    	
    	clickSyncGridNVector(name,paramObj);
    };
    
    var clusterStyleFunction = function(feature, resolution) {
    	var style;
    	var size = feature.get('features').length;
    	
    	if (size > 1) {
    		style = new ol.style.Style({
    			image: new ol.style.Icon(({
		          src: '/map/images/maker.png'
		        })),
    			text: new ol.style.Text({
    				text: size.toString(),
    				fill: new ol.style.Fill({
    					color: '#fff'
    				}),
    				font: '20px bold, Verdana'
    			})
    		});
    	} else {
    		var originalFeature = feature.get('features')[0];
    		style = createLastPoint(originalFeature);
    	}
    	return style;
    };
    
    var createLastPoint = function(feature) {
    	
    	var tyCode = {'CVP02001':'chung','CVP02002':'naver','CVP02003':'five'};
    	return new ol.style.Style({
    		geometry: feature.getGeometry(),
    		image: new ol.style.Icon(({
    			src: '/map/images/' + tyCode[feature.getProperties().CVPL_TY_CODE] + '.png',
    			scale:1.5
    		})),
    		text: new ol.style.Text({
				text: feature.getProperties().CVPL_LC,
				fill: new ol.style.Fill({
					color: '#000'
				}),
				stroke : new ol.style.Stroke({
					color : '#fff',
					width : 3
				}),
				offsetY: 30,
				font: 'bold 13px Arial'
			})
    	});
    };
    
    var clearTab = function(tabId){
    	$('li[aria-controls="'+tabId+'"]').remove();
    	$('#' + tabId ).remove();
    	try {
    		$('#tabs').tabs('refresh');
		} catch (e) {
			// TODO: handle exception
		}
    	

    	if($('ul[role="tablist"]').find('li').length==0){
    		$('#gridArea').hide();
    	}

    	var id = tabId.split('place')[1];
    	var layerForName = _CoreMap.getMap().getLayerForName(id);

    	if(layerForName){
    		_MapEventBus.trigger(_MapEvents.map_removeLayer, layerForName);
    	}
    	clearFocusLayer();
    };
    
    var clearOnlyTab = function(tabId){
    	$('li[aria-controls="'+tabId+'"]').remove();
    	$('#' + tabId ).remove();
    	try {
    		$('#tabs').tabs('refresh');
		} catch (e) {
			// TODO: handle exception
		}
    	
    	if($('ul[role="tablist"]').find('li').length==0){
    		$('#gridArea').hide();
    	}
    };
    
    var writeGrid = function(id, data){
    	$('#gridArea').show();
    	var tabTitle = $('#tab_title');
    	var tabContent = $('#tab_content');
    	var tabTemplate = '<li><a id=#{id} href="#{href}" style="cursor: pointer;">#{label}</a> <span class="ui-icon ui-icon-close" role="presentation" style="cursor: pointer; background: url(/map/images/btn_close2.png) 2px 4px no-repeat; background-size: 8px;">Remove Tab</span></li>';
    	var tabs = $('#tabs').tabs();
    		
    	tabs.off('click').on('click','span.ui-icon-close', function() {
    		$('#popup').hide();
    		clearTab($(this).closest('li').attr('aria-controls'));
    	});

    	var tabTitle = contentsConfig[id].title;
    	var tabId = 'tabs-' + id;
    	var li = $(tabTemplate.replace(/#\{id\}/g,tabId).replace(/#\{href\}/g, '#place'+id).replace(/#\{label\}/g,tabTitle));
    	
    	if($('#'+tabId).length == 0){
    		tabs.find('.ui-tabs-nav').append( li );
    		/*if(tabs.find('#excelDown').length == 0){
    			tabs.append('<button id="excelDown" onclick="_WestCondition.excelDwonLoad()">엑셀다운</button>');
    		}*/
        	tabs.append('<span id="place'+id+'" style="padding: 0px 0px !important;"><span class="dataLength" style="font-size: 12px; color: #4a4a4a; letter-spacing: -1px; font-family: \'Verdana\'; position: absolute; z-index: 10; top: 15px; right: 85px;">[전체 : <span style="color:#2eaf3b;">'+data.length+'</span>건]</span>' +
        			'<a href="javascript:void(0)" style="padding: 4px 8px; font-family: \'Dotum\'; font-size: 11px; letter-spacing: -1px;background: #595959; color: #fff; position: absolute; z-index: 1000; right: 20px; top: 13px;"id="excelDown" onclick="_WestCondition.excelDwonLoad()">엑셀다운</a>'+
        			'<div id="grid' + id + '" style="padding: 5px 5px !important;"></div></span>');
    	}else{
    		$('#place'+id).find('.dataLength').html('[전체 : <span style="color:#2eaf3b;">'+data.length+'</span>건]');
    	}
    	
    	tabs.tabs('refresh');

    	tabs.tabs({
    		active:$('ul[role="tablist"]').find('li').index($('#' + tabId).parent())
    	});
    	

    	var clients = [];
    	
    	for(var i = 0; i < data.length; i++){
    		clients.push(data[i]);
    	}
    	
    	$('#grid' + id).jsGrid({
    		width: '90%',
    		height: ($('#gridArea').height()-100),
    		inserting: false,
    		editing: false,
    		sorting: true,
    		paging: false,	
    		noDataContent: noDataContent,
    		data: clients,
    		fields: contentsConfig[id].columnArr,
    		rowClick:function(data){
    			var paramObj = {contentsId:id};
    			for(var i = 0; i < contentsConfig[id].keyColumn.length; i++){
    				paramObj[contentsConfig[id].keyColumn[i]] = data.item[contentsConfig[id].keyColumn[i]];
    			}
    			clickSyncGridNVector(id,paramObj);
    		}
    	});
    };
    
    var clickSyncGridNVector = function(id, paramObj){
    	
    	if(contentsConfig[id].isUseGeoserver){
    		var cqlString = '';
    		for(var key in paramObj){
    			if(key!='contentsId'){
    				cqlString += key + '=\'' + paramObj[key] + '\' AND ';	
    			}
    		}
    		_MapService.getWfs(contentsConfig[id].layerName, '*',encodeURIComponent(cqlString.substr(0,cqlString.length-5)), '').then(function(result){
    			if(result.features.length == 0){
    				return;
    			}
    			writeFocusLayer(result.features[0],contentsConfig[id],contentsConfig[id].title);
    		});
    	}else{
    		Common.getData({
    			url: '/map/getClick.do',
    			contentType: 'application/json',
    			params: paramObj
    		}).done(function(data){
    			if(data.length == 0){
    				_MapEventBus.trigger(_MapEvents.alertShow, {text:'위치정보가 없습니다.'});
    				return;
    			}
    			
    			writeFocusLayer(data[0],contentsConfig[id],contentsConfig[id].title);
    		});
    	}
    };
    
    var getCenterOfExtent = function(Extent){
    	var X = Extent[0] + (Extent[2]-Extent[0])/2;
    	var Y = Extent[1] + (Extent[3]-Extent[1])/2;
    	return [X, Y];
    };
    
    var writeFocusLayer = function(data, config, title){
    	var attr;
    	var geo;
    	var popupHtml = '<table class="map_info_table"><caption></caption>';
		popupHtml += '<colgroup><col style="width:100px;"><col></colgroup>';
		popupHtml += '<tbody>';

    	if(config.isUseGeoserver){
    		if(config.layerType=='polygon'){
    			var extent = new ol.geom.Polygon(data.geometry.coordinates).getExtent();
    			geo = getCenterOfExtent(extent);
    		}else{
    			geo = data.geometry.coordinates;
    		}
    		
    		attr = data.properties;
    	}else{
    		if(100 < data.POINT_X && data.POINT_X < 200){
    			geo = _CoreMap.convertLonLatCoord([data.POINT_X,data.POINT_Y],true);
			}else{
				geo = [data.POINT_X,data.POINT_Y];
			}
    		attr = data;
    	}
    	
    	for(var i=0; i < config.popupColumnArr.length; i++){
			popupHtml +=   '<tr>';
			popupHtml +=      '<th scope="row">'+config.popupColumnArr[i].text+'</th>';
			popupHtml += 	  '<td>'+attr[config.popupColumnArr[i].id]+'</td>';
			popupHtml +=   '</tr>';
		}
    	
    	popupHtml +=	'</tbody></table>';
    	
    	deferredForSetCenter(geo).then(function(){
    		if(config.layerType!='polygon'){
    			clearFocusLayer();
    			var newFocusLayer = new ol.layer.Vector({
    				source : new ol.source.Vector({
    					features : [new ol.Feature(new ol.geom.Point(geo))]
    				}),
    				style : new ol.style.Style({
    					image: new ol.style.Circle({
    						radius: 21,
    						stroke: new ol.style.Stroke({
    							color: '#f00',
    							width: 5
    						})
    					})
    				}),
    				visible: true,
    				zIndex:1,
    				name:'focus'
    			});
    			_MapEventBus.trigger(_MapEvents.map_addLayer, newFocusLayer);
    		}
    	});
    	
    	if(config.isPopupShow){
    		$('#popup').show();
        	$('#popup').find('.pop_tit_text').text(title);
        	$('#popup').find('.pop_conts').html(popupHtml);
    	}
    };
    
    var deferredForSetCenter = function(coord){
    	var duration = 500;
    	var deferred = $.Deferred();
    	_CoreMap.getMap().getView().animate({
    		duration: duration,
    		zoom:_CoreMap.getMap().getView().getMaxZoom() - 2,
    		center: coord,
    	});
    	
    	setTimeout(function() {
    		deferred.resolve();
        }, duration + 100);
    	
    	return deferred.promise();
    };
    
    var setCommonCombo = function(options){
    	var arr = [];
        var parnetObj = $(options.type + '[id$="' + options.parentTypeId + '"]');
        
        for (var i = 0; i < parnetObj.length; i++) {
        	var parentId = $(parnetObj[i]).attr('id');
        	var splitId = parentId.split(options.parentTypeId)[0];
        	
        	if($('#' + splitId + options.childTypeId).length > 0){
        		var childId = splitId + options.childTypeId;
        		if(options.flag=='city'){
        			setEventCityDistrict(parentId);
        			cityMappingObj[parentId] = childId;
        		}else{
        			dateMappingObj[parentId] = childId;
        		}
        		
        		arr.push(childId);
        	}
        	
        	arr.push(parentId);
        }
        
        return arr;
    };
    
    var setEventCityDistrict = function(id){
    	$('#' + id).off('change').on('change',function(){
    		writeCity(cityTownObj[$(this).val()].child,cityMappingObj[$(this).attr('id')]);
    	});
    };
    
    var writePOI = function (data, comboId) {
        var html = '';
        //var allHtml = '';
        if(data[0] == undefined){
        	data[0] = {};
            data[0].text = "전체";
        }
        
        for (var key in data) {
        	/*if(comboId.toLowerCase().indexOf('town') > -1){
        		allHtml = '<option value=\'' + key.substr(0,5) + '\'>전체</option>';
        	}*/
        	html += '<option value=\'' + key + '\'>' + data[key].text + '</option>';
        }
        
        delete data[0];
        
        $('#' + comboId).html(html);
    };
    
    var writeCity = function (data, comboId) {
        var html = '';
        
        for (var key in data) {
        	if(comboId!='cityDistrictToolbar' && comboId!='townToolbar'){
        		html += '<option value=\'' + key + '\'>' + data[key].text + '</option>';
        	}else{
        		if(data[key].text!='전체'){
        			html += '<option value=\'' + key + '\'>' + data[key].text + '</option>';
        		}
        	}
        }
        
        $('#' + comboId).html(html);
    };

    
    var onClickLayer = function(feature, name){
    	switch (contentsConfig[name].layerType) {
		case 'cluster':
			clickCluster(feature,name);
			break;
		case 'base':
		case 'polygon':
			clickBase(feature,name);
			break;
		default:
			break;
		}
    };
    
    var setToolbarCity = function(prop){
    	
    	if(cityTownObj[prop.adm_cd.substr(0,5)]){
    		if($('#cityDistrictToolbar').val() != prop.adm_cd.substr(0,5)){
            	$('#cityDistrictToolbar').val(prop.adm_cd.substr(0,5));
    		}
    		
    		if($('#townToolbar').val() != prop.adm_cd){
    			writeCity(cityTownObj[prop.adm_cd.substr(0,5)].child,'townToolbar');
            	$('#townToolbar').val(prop.adm_cd);
    		}
    	}
    };
    
    var excelDwonLoad = function(){
    	
    	var gridId = "";
    	var grid = "";
    	
    	for(var i = 0 ; i < $('ul[role="tablist"]').children().length; i++){
    		if($($('ul[role="tablist"]').children()[i]).attr('tabindex') == "0"){
    			gridId = $($('ul[role="tablist"]').children()[i]).attr('aria-controls');
    		}
    	}
    	
    	gridId = gridId.split('place')[1];
    	if(gridId != undefined){
    		//grid = ;
    		//_WestCondition.getContentsConfig().complaintStatus.title
    		var tabName = contentsConfig[gridId].title;
    		// contentsConfig
    		
    		var csv = $('#grid'+gridId).jsGrid("exportData", {
        	    type: "csv", //Only CSV supported
        	    subset: "all" | "visible", //Visible will only output the currently displayed page
        	    delimiter: ",", //If using csv, the character to seperate fields
        	    includeHeaders: true, //Include header row in output
        	    encapsulate: true, //Surround each field with qoutation marks; needed for some systems
        	    newline: "\r\n", //Newline character to use
        	    
        	    //Takes each item and returns true if it should be included in output.
        	    //Executed only on the records within the given subset above.
        	    filter: function(item){return true},
        	    
        	});

        	if(navigator.msSaveBlob){ 
        		navigator.msSaveBlob(new Blob(['\uFEFF'+csv], { type: 'text/csv;charset=utf-8;' }), tabName+".csv"); 
        	}else{
        		var uri = 'data:text/csv;charset=utf-8,\uFEFF' + encodeURI(csv);
        		var downloadLink = document.createElement("a");
            	downloadLink.href = uri;
            	downloadLink.download = tabName+".csv";
            	
            	document.body.appendChild(downloadLink);
            	downloadLink.click();
            	document.body.removeChild(downloadLink);
        	}
        	
    	}
    }	

	var tabCloseOpen = function(value){
		
		var ww = $(window).width();
		if(value.attr('class') == "on"){
			//$('.instanceArea').hide();
			$('.lnb').css('display', 'none');
			$('#tab').css('left',0);
			$('#tabOpener').css('left',0);
			$('#map').css('left',0);
			value.removeClass('on');
			
			$('#tab').attr('value','off') ;
			
			reW = 0;
						
			$('#gridArea').css('left','0');
			$('#gridArea').css('width', ww );
		}else{
			//$('.instanceArea').show();
			//$('#tab').find('.on')
			for(var i = 0 ; i  < $('.lnb').length; i++){
				if($('#tab').find('.on').attr('tabtype') == $($('.lnb')[i]).attr('id')){
					$($('.lnb')[i]).css('display', 'block');
				}else{
					$($('.lnb')[i]).css('display', 'none');
				}
			}
			
			$('#tab').css('left',360);
			$('#tabOpener').css('left',360);
			$('#map').css('left',351);
			value.addClass('on');
			
			$('#tab').attr('value','on');
			
			reW = 340;
			
			$('#gridArea').css('left','361px');
			$('#gridArea').css('width', ww - 360 );
			
		}
		reSizeMap(reW,reH);
	}
	
	var reSizeMap = function(width,height){
		
		var ww = $(window).width();
		var wh = $(window).height();
		
		var map = _CoreMap.getMap();

		$('#map').width(ww - reW);
		$('#map').height(wh - reH);
		//$('#westContainer').height(wh-50); 
		if (map) {
			map.setSize([ ww - width, wh - height]);
		}
		
	};
	

    return {
        init: init,
        getContentsConfig: function(){
        	return contentsConfig;
        },
        getDefaultClusterDistance: function(){
        	return clusterDistance;
        },
        clearFocusLayer:function(){
        	clearFocusLayer();
        },
        onClickLayer:function(f,nm){
        	onClickLayer(f,nm);
        },
        setToolbarCity:function(p){
        	setToolbarCity(p);
        },
        
        checkPointMarker:function(id,event){
        	checkPointMarker(id,event);
        },
        legendLayer: function(){
        	legendLayer();
        },
        legendLayerOnOff: function(value){
        	legendLayerOnOff(value);
        },
        
        popupOverlayData: function(areaId, reg){
        	popupOverlayData(areaId, reg);
        },
        excelDwonLoad: function(){
        	excelDwonLoad();
        },
        tabCloseOpen: function(value){
        	tabCloseOpen(value);
        },
        getWestLayerName : function(){
        	return westLayerObj;
        },
        setMaxHeight: function(){
        	setMaxHeight();
        },
        writeLayer: function(id, data, isUseGeoserver){
        	writeLayer(id, data, isUseGeoserver);
        },
        createLastPoint:function(feature){
        	return createLastPoint(feature);
        },
        writeGrid:function(id, data){
        	writeGrid(id, data);
        }
    };
}();