var _WestCondition = function () {
    var initTownCode = '43111';
    var dateMappingObj = {};
    var cityMappingObj = {};
    var noDataContent = '데이터가 없습니다.';
    var currentResolution;
    var maxFeatureCount;
    var clusterDistance = 100;
    var cityTownObj = {};
    var POIConditionObj = {};
    var westLayerObj = {
    		CVPL_POINT : ':CVPL_POINT',
    		SHP_BDONG : ':SHP_BDONG',
    		SHP_POI : ':shp_poi',
    		SHP_SGG_PT : ':shp_sgg_pt',
    		SHP_BDONG_PT:':shp_bdong_pt'
    };
    var contentsConfig = {
    	'complaintStatus':{cqlForMappingObj:{'cityDistrict':'LEGALDONG_CODE',
    										'town':'LEGALDONG_CODE',
    										'startDate':'CVPL_DT',
    										'endDate':'CVPL_DT',
    										'branchName':'CVPL_CN'},
    					  layerName:westLayerObj.CVPL_POINT,
    					  layerType:'cluster',
    					  title:'민원현황',
    					  keyColumn:['CVPL_NO'],
    					  isVisible:true,
    					  isUseGeoserver:true,
    					  isLabelLayer:false,
    					  columnArr:[{name:'CVPL_NO',title:'민원 번호'},
    					             {name:'CVPL_DT',title:'민원 일시'},
    					             {name:'CPTTR',title:'민원인'},
    					             {name:'CPTTR_CTTPC',title:'민원인 연락처'},
    					             {name:'CVPL_LC',title:'민원 위치'},
    					             {name:'CVPL_CN',title:'민원 내용'},
    					             {name:'REGIST_DT',title:'등록 일시'},
    					             {name:'REGISTER_ID',title:'등록자 ID'},
    					             {name:'CHANGE_DT',title:'변경 일시'},
    					             {name:'CHANGER_ID',title:'변경자 ID'}]
    	},
    	'portableMeasurement':{
						layerType:'base',
						title:'이동식 측정 데이터',
						keyColumn:['CODE','DATE'],
						isVisible:true,
						isUseGeoserver:false,
						isLabelLayer:true,
						columnArr:[{name:'CODE',title:'센서ID'},
						     {name:'OPR_STTUS_CODE',title:'센서명'},
						     {name:'VOCS',title:'휘발성유기물'},
						     {name:'CCNT',title:'접점센서'},
						     {name:'NH3',title:'암모니아'},
						     {name:'ERCRT',title:'전류센서'},
						     {name:'H2S',title:'황화수소'},
						     {name:'ARCSR',title:'기압'},
						     {name:'OU',title:'복합 악취'},
						     {name:'SOLRAD',title:'일사'},
						     {name:'HD',title:'습도'},
						     {name:'TMPRT',title:'기온'},
						     {name:'WD',title:'풍향'},
						     {name:'WS',title:'풍속'},
						     {name:'NO2',title:'이산화질소'},
						     {name:'SO2',title:'이산화황'},
						     {name:'PM10',title:'미세먼지10'},
						     {name:'PM2_5',title:'미세먼지2.5'},
						     {name:'CFC',title:'염소'},
						     {name:'CH3SH',title:'메틸메르캅탄'},
						     {name:'TMA',title:'트리메틸아민'},
						     {name:'ETHANOL',title:'에탄올'},
						     {name:'DATE',title:'날짜',visible:false}]
    	},
    	'fixedMeasurement':{
			layerType:'base',
			title:'고정식 측정 데이터',
			keyColumn:['CODE','DATE'],
			isVisible:true,
			isUseGeoserver:false,
			isLabelLayer:false,
			columnArr:[{name:'CODE',title:'센서ID'},
			     {name:'OPR_STTUS_CODE',title:'센서명'},
			     {name:'VOCS',title:'휘발성유기물'},
			     {name:'CCNT',title:'접점센서'},
			     {name:'NH3',title:'암모니아'},
			     {name:'ERCRT',title:'전류센서'},
			     {name:'H2S',title:'황화수소'},
			     {name:'ARCSR',title:'기압'},
			     {name:'OU',title:'복합 악취'},
			     {name:'SOLRAD',title:'일사'},
			     {name:'HD',title:'습도'},
			     {name:'TMPRT',title:'기온'},
			     {name:'WD',title:'풍향'},
			     {name:'WS',title:'풍속'},
			     {name:'NO2',title:'이산화질소'},
			     {name:'SO2',title:'이산화황'},
			     {name:'PM10',title:'미세먼지10'},
			     {name:'PM2_5',title:'미세먼지2.5'},
			     {name:'CFC',title:'염소'},
			     {name:'CH3SH',title:'메틸메르캅탄'},
			     {name:'TMA',title:'트리메틸아민'},
			     {name:'ETHANOL',title:'에탄올'},
			     {name:'DATE',title:'날짜',visible:false}]
    	}
    };
    
    /*var tabConfigObj = {
	'complaintStatus':{title:'민원현황',columnArr:[{name:'CVPL_NO',title:'민원 번호'},
	                                           {name:'CVPL_DT',title:'민원 일시'},
	                                           {name:'CPTTR',title:'민원인'},
	                                           {name:'CPTTR_CTTPC',title:'민원인 연락처'},
	                                           {name:'CVPL_LC',title:'민원 위치'},
	                                           {name:'CVPL_CN',title:'민원 내용'},
	                                           {name:'REGIST_DT',title:'등록 일시'},
	                                           {name:'REGISTER_ID',title:'등록자 ID'},
	                                           {name:'CHANGE_DT',title:'변경 일시'},
	                                           {name:'CHANGER_ID',title:'변경자 ID'}]},
	'sensoryEvaluation':{title:'관능 평가 데이터',columnArr:[{name:'SENSE_EVL_NO',title:'관능 평가 번호'},
			                                           {name:'MESURE_DATE',title:'측정 날짜'},
			                                           {name:'MESURE_TIME',title:'측정 시간'},
			                                           {name:'SENSE_BSML_DGREE',title:'관능 악취 도'},
			                                           {name:'CMPND_BSML',title:'복합 악취'}]},
	'portableMeasurement':'이동식 측정 데이터',
	'fixedMeasurement':'고정식 측정 데이터',
	'odorReduction':'악취저감설비 관리',
	'odorOrigin':'악취원점 관리',
	'observatory':'기상청측정망',
	'environmentCorporation':'환경공단 측정망',
	'unmannedOdor':'청주시 무인악취 측정망',
	'airMap':'KT 에어맵 코리아 측정망',
	'odorMovement':'악취 원점'
};*/
    
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
    	var cityArr = setCommonCombo({
			type:'select',
			parentTypeId:'CityDistrict',
			childTypeId:'Town',
			flag:'city',
		});
    	
    	_MapService.getWfs(westLayerObj.SHP_BDONG,'*',undefined,'cty_nm, dong_nm').done(function(data){
    		if(data.features.length == 0){
    			return;
    		}
    		for(var i = 0; i < data.features.length; i++){
    			var properties = data.features[i].properties;
    			if(!cityTownObj[properties.adm_cd.substr(0,5)]){
    				cityTownObj[properties.adm_cd.substr(0,5)] = {};
    				cityTownObj[properties.adm_cd.substr(0,5)].text = properties.cty_nm;
    				cityTownObj[properties.adm_cd.substr(0,5)].child = {};
    			}
    			
    			if(!cityTownObj[properties.adm_cd.substr(0,5)].child[properties.adm_cd]){
    				cityTownObj[properties.adm_cd.substr(0,5)].child[properties.adm_cd] = {};
    				cityTownObj[properties.adm_cd.substr(0,5)].child[properties.adm_cd].text = properties.dong_nm;
    			}
    		}
    		
    		for(var i = 0; i < cityArr.length; i++){
    			var data = cityArr[i].indexOf('CityDistrict') > -1 ? cityTownObj : cityTownObj[initTownCode].child;
        		writeCity(data, cityArr[i]);
    		}
    		
    		writeCity(cityTownObj,'cityDistrictToolbar');
    		setToolbarCity({adm_cd:'4311425300'});
    	});

        
        var dateArr = setCommonCombo({
        	type:'input',
        	parentTypeId:'StartDate',
        	childTypeId:'EndDate',
        	flag:'date',
        });
        
        var toDay = new Date();
		var hour = toDay.getHours()+1;
		var timeOptions = '';
		for(var i=1; i<25; i++){
			timeOptions += '<option '+(i==hour?'selected':'')+' value="'+(i<10 ? ('0'+i): i)+'">'+i+'시</option>';
		}
		
		$('#portableMeasurementStartTime, #portableMeasurementEndTime, #fixedMeasurementStartTime').html(timeOptions);
		
		var timeOptionMinute = '';
		
		for(var i=0; i<60; i++){
			timeOptionMinute += '<option value="'+(i<10 ? ('0'+i): i)+'">'+i+'분</option>';
		}
		$('#fixedMeasurementStartMinute').html(timeOptionMinute);
		
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
        
        for(var i=2; i<contentsConfig['portableMeasurement'].columnArr.length - 1; i++){
        	portableMeasurementItemHtml += '<option value=\''+contentsConfig['portableMeasurement'].columnArr[i].name+'\'>'+contentsConfig['portableMeasurement'].columnArr[i].title+'</option>';
        }
        
        $('#portableMeasurementItem, #fixedMeasurementItem').html(portableMeasurementItemHtml);
        
        setEvent();
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
    		getData({url:'/getPOISelect.do', contentType: 'application/json', params: {} }).done(function(data){
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
            			x:-1,
            			y:-1,
            			z:-1
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
            	writePOI(POIConditionObj[0].child,'poiSelect02');
            	writePOI(POIConditionObj[0].child[0].child,'poiSelect03');
            	
            	$('#poiSelect01, #poiSelect02').off('change').on('change',function(){
            		var mappingId = '';
            		if($(this).attr('id')=='poiSelect01'){
            			writePOI(POIConditionObj[$(this).val()].child,'poiSelect02');
            			writePOI(POIConditionObj[$(this).val()].child[$('#poiSelect02').val()].child,'poiSelect03');
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
            		
            		getData({url:'/getPOISearch.do', contentType: 'application/json', params: paramObj }).done(function(data){
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
            	    				
            	    				deferredForSetCenter(data.features[0].geometry.coordinates,_CoreMap.getMap().getView().getMaxZoom());
            	    				
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
            	    		    				radius: 7,
            	    		    				stroke: new ol.style.Stroke({
            	    		    					color: '#595959',
            	    		    					width: 2
            	    		    				}),
            	    		    				fill: new ol.style.Fill({
            	    		        		        color: '#f56ee9'
            	    		        		    }),
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

    var setEvent = function(){
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
    	
    	$('.lnb').find('em').off('click').on('click',function(){
    		var contentsId = $(this).parent().parent().find('.lnb_conts').attr('id');
    		var layerForName = _CoreMap.getMap().getLayerForName(contentsId);
    		if(contentsConfig[contentsId]){
    			if($(this)[0].style.background.indexOf('on') > -1 || !$(this)[0].style.background){
        			$(this).css('background','url(../images/btn_off.png)');
        			contentsConfig[contentsId].isVisible = false;
        		}else{
        			$(this).css('background','url(../images/btn_on.png)');
        			contentsConfig[contentsId].isVisible = true;
        		}
        		
        		if(layerForName){
        			layerForName.setVisible(contentsConfig[contentsId].isVisible);
        		}
        		
        		if(contentsConfig[contentsId].isLabelLayer){
        			var labelLayerForName = _CoreMap.getMap().getLayerForName('text');
        			if(labelLayerForName){
        				labelLayerForName.setVisible(contentsConfig[contentsId].isVisible);
            		}
        		}
    		}else{
    			alert('레이어 정의 필요');
    		}
    		
    	});
    };
    
    var checkSearchCondition = function(placeId){
		if(!contentsConfig[placeId]){
			return alert('레이어 정의 필요');
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
						paramObj[replaceName] = $('input[name="' + searchPlaceName + '"]:checked').val();
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
			$.when(getData({url: '/getGrid.do', contentType: 'application/json', params: paramObj }),
					_MapService.getWfs(contentsConfig[placeId].layerName,'*',encodeURIComponent(cqlString.substr(0,cqlString.length-5)), '')).then(function (gridData, pointData) {
						writeGrid(placeId,gridData[0]);
						writeLayer(placeId,pointData[0].features,contentsConfig[placeId].isUseGeoserver);
					});
		}else{
			getData({url: '/getGrid.do', contentType: 'application/json', params: paramObj }).done(function(data){
				writeGrid(placeId,data);
				writeLayer(placeId,data,contentsConfig[placeId].isUseGeoserver);
				
				if(contentsConfig[placeId].isLabelLayer){
					writeLayer('text',data,contentsConfig[placeId].isUseGeoserver,placeId);
				}
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
    
    var writeLayer = function(id, data, isUseGeoserver, labelParentId){
    	
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
				feature.setGeometry(new ol.geom.Point(data[i].geometry.coordinates));
				feature.setProperties(data[i].properties);
			}else{
				feature.setGeometry(new ol.geom.Point(_CoreMap.convertLonLatCoord([data[i].LO,data[i].LA],true)));
				data[i].itemType = $('#' + id + 'Item').val();
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
	        visible:contentsConfig[id]?contentsConfig[id].isVisible:contentsConfig[labelParentId].isVisible
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
		case 'fixedMeasurement':
			styleFunction = portableMeasurementStyleFunction;
			break;
		case 'text':
			styleFunction = labelStyleFunction;
			break;
		default:
			break;
		}
    	
    	return styleFunction;
    };
    
    var labelStyleFunction = function(feature){
    	var style = new ol.style.Style({
    		geometry: feature.getGeometry(),
    		image: new ol.style.Circle({
    			radius: 0
    		}),
			text: new ol.style.Text({
				text: feature.getProperties().LABEL,
				fill: new ol.style.Fill({
					color: '#000'
				}),
				offsetY: 30,
				font: '13px bold, Verdana'
			})
  		});
    	
    	return style;
    };
    
    var portableMeasurementStyleFunction = function(feature){
    	var style = new ol.style.Style({
    		geometry: feature.getGeometry(),
    		image: new ol.style.Circle({
    			radius: 20,
    			fill: new ol.style.Fill({
    		        color: '#548235'
    		    }),
    		    stroke: new ol.style.Stroke({
    		    	color: '#AFABAB',
    		    	width: 3
    		    })
    		}),
			text: new ol.style.Text({
				text: feature.getProperties()[feature.getProperties().itemType] + '',
				fill: new ol.style.Fill({
					color: '#fff'
				}),
				font: '11px bold, Verdana'
			})
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
    	clickSyncGridNVector(name,paramObj);
    };
    
    var clusterStyleFunction = function(feature, resolution) {
    	var style;
    	var size = feature.get('features').length;
    	
    	if (size > 1) {
    		style = new ol.style.Style({
    			image: new ol.style.Icon(({
		          src: '/images/maker.png'
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
    	return new ol.style.Style({
    		geometry: feature.getGeometry(),
    		image: new ol.style.Circle({
    			radius: 5,
    			fill: new ol.style.Fill({
    		        color: '#f00'
    		    })
    		})
    	});
    };
    
    var writeGrid = function(id, data){
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
    		
    		var id = $(this).parent().find('a').attr('id').split('tabs-')[1];
    		var layerForName = _CoreMap.getMap().getLayerForName(id);
    		
    		if(layerForName){
    			if(layerForName){
        			_MapEventBus.trigger(_MapEvents.map_removeLayer, layerForName);
        		}
    		}
    		clearFocusLayer();
    		
    		if(contentsConfig[id].isLabelLayer){
    			var labelLayerForName = _CoreMap.getMap().getLayerForName('text');
    			if(labelLayerForName){
        			_MapEventBus.trigger(_MapEvents.map_removeLayer, labelLayerForName);
        		}
    		}
    	});
    	
    	var tabTitle = contentsConfig[id].title;
    	var tabId = 'tabs-' + id;
    	var li = $(tabTemplate.replace(/#\{id\}/g,tabId).replace(/#\{href\}/g, '#grid'+id).replace(/#\{label\}/g,tabTitle));
    	
    	if($('#'+tabId).length == 0){
    		tabs.find('.ui-tabs-nav').append( li );
        	tabs.append('<div id="grid' + id + '" style="padding: 10px 3px !important;"></div>');
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
    		width: '1300px',
    		height: '170px',

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
    			
    			writeFocusLayer(result.features[0],contentsConfig[id].isUseGeoserver,contentsConfig[id].title);
    		});
    	}else{
    		getData({
    			url: '/getClick.do',
    			contentType: 'application/json',
    			params: paramObj
    		}).done(function(data){
    			if(data.length == 0){
    				return;
    			}
    			writeFocusLayer([data[0].LO,data[0].LA],contentsConfig[id].isUseGeoserver,contentsConfig[id].title);
    		});
    	}
			
    };
    
    var writeFocusLayer = function(data, isUseGeoserver,title){
    	var result;
    	var popupHtml = '';
    	
    	if(isUseGeoserver){
    		result = data.geometry.coordinates;
    		popupHtml += '<div>'+result+'</div>';
    	}else{
    		result = _CoreMap.convertLonLatCoord(data,true);
    		popupHtml += '<div>'+result+'</div>';
    	}
    	
    	deferredForSetCenter(result,_CoreMap.getMap().getView().getMaxZoom()).then(function(){
			clearFocusLayer();
			var newFocusLayer = new ol.layer.Vector({
				source : new ol.source.Vector({
					features : [new ol.Feature(new ol.geom.Point(result))]
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
		});
    	
    	$('#popup').show();
    	$('#popup').find('.pop_tit_text').text(title);
    	$('#popup').find('.pop_conts').html(popupHtml);
    };
    
    var deferredForSetCenter = function(coord,zoom){
    	var duration = 500;
    	var deferred = $.Deferred();
    	_CoreMap.getMap().getView().animate({
    		duration: duration,
    		zoom:_CoreMap.getMap().getView().getMaxZoom(),
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
        for (var key in data) {
        	/*if(comboId.toLowerCase().indexOf('town') > -1){
        		allHtml = '<option value=\'' + key.substr(0,5) + '\'>전체</option>';
        	}*/
        	html += '<option value=\'' + key + '\'>' + data[key].text + '</option>';
        }
        
        $('#' + comboId).html(html);
    };
    
    var writeCity = function (data, comboId) {
        var html = '';
        var allHtml = '';
        for (var key in data) {
        	if(comboId.toLowerCase().indexOf('town') > -1){
        		allHtml = '<option value=\'' + key.substr(0,5) + '\'>전체</option>';
        	}
        	html += '<option value=\'' + key + '\'>' + data[key].text + '</option>';
        }
        
        $('#' + comboId).html(allHtml+html);
    };

    var getData = function (options) {
        return $.ajax({
            url: options.url,
            data:  JSON.stringify(options.params),
            type: 'POST',
            contentType: options.contentType
        })
    };
    
    var onClickLayer = function(feature, name){
    	switch (contentsConfig[name].layerType) {
		case 'cluster':
			clickCluster(feature,name);
			break;
		case 'base':
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
        }
    };
}();