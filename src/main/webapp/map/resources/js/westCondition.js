var _WestCondition = function () {
    var initTownCode = '';
    var dateMappingObj = {};
    var cityMappingObj = {};
    
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
//        $.when(getData({
//            url: '',
//            contentType: 'application/json',
//            params: {code:'1111',flag='CityDistrict'}
//        }), getData({
//            url: '',
//            contentType: 'application/json',
//            params: {code:initTownCode,flag='town'}
//        })).then(function (cityDistrictData, townData) {
//            var cityArr = getCityArr();
//            for (var i = 0; i < cityArr.length; i++) {
//                var data = cityArr[i].indexOf('CityDistrict') > -1 ? cityDistrictData : townData;
//                writeCity(data, cityArr[i]);
//            }
//        });
    	
        var cityDistrictData = [{name:'서원구'},{name:'청원구'},{name:'흥덕구'},{name:'상당구'}];
        var townData = [{name:'1동'},{name:'2동'},{name:'3동'}];
        
        var dateArr = setCommonCombo({
        	type:'input',
        	parentTypeId:'StartDate',
        	childTypeId:'EndDate',
        	flag:'date',
        });
        
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
        }
    	
        var cityArr = setCommonCombo({
        	type:'select',
        	parentTypeId:'CityDistrict',
        	childTypeId:'Town',
        	flag:'city',
        });
        
        for (var i = 0; i < cityArr.length; i++) {
            var data = cityArr[i].indexOf('CityDistrict') > -1 ? cityDistrictData : townData;
            writeCity(data, cityArr[i]);
        }
        
        setEvent();
    };
    
    var setEvent = function(){
    	$('a[id$="Views"]').off('click').on('click',function(){
    		checkSearchCondition($(this).attr('id').split('Views')[0]);
    	});
    };
    
    var checkSearchCondition = function(placeId){
    	var searchPlace = $('#' + placeId).find('*');
    	var paramObj = {};
		var requireAlertObj = {
	    		'branchName':'지점명을 입력하세요.',
	    		'startDate':'시작날짜를 선택하세요.',
	    		'endDate':'끝날짜를 선택하세요.',
	    		'startOU':'OU 시작범위를 선택하세요.',
	    		'endOU':'OU 끝범위를 선택하세요.',
	    		'item':'측정항목을 선택하세요.'
	    };
		
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
					
					if($(searchPlace[i]).val()){
						if(replaceId=='startDate' || replaceId=='endDate'){
							paramObj[replaceId] = $(searchPlace[i]).val().replace('.','').replace('.','');
						}else{
							paramObj[replaceId] = $(searchPlace[i]).val();
						}
					}else{
						return alert(requireAlertObj[replaceId]);
					}
				}
			}
		}
		
		getData({
			url: '/getGrid.do',
			contentType: 'application/json',
			params: paramObj
		}).done(function(data){
			writeGrid(placeId,data);
		});
    };
    
    var writeGrid = function(id, data){
    	$('#gridArea').show();
    	var tabTitle = $('#tab_title');
    	var tabContent = $('#tab_content');
    	var tabTemplate = '<li><a id=#{id} href="#{href}">#{label}</a> <span class="ui-icon ui-icon-close" role="presentation">Remove Tab</span></li>';
    	var tabs = $('#tabs').tabs();
    	
    	tabs.off('click').on('click','span.ui-icon-close', function() {
    		var panelId = $( this ).closest('li').remove().attr('aria-controls');
    		$('#' + panelId ).remove();
    		tabs.tabs('refresh');
    		
    		if($('ul[role="tablist"]').find('li').length==0){
    			$('#gridArea').hide();
    		}
    	});
    	
    	var tabConfigObj = {
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
    	};
    	
    	var tabTitle = tabConfigObj[id].title;
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
    		noDataContent: '데이터가 없습니다.',
    		data: clients,

    		fields: tabConfigObj[id].columnArr
    	});
    	
    	
    	//dynamicSvgTest();
    };
    
    var dynamicSvgTest = function(point){
    	var features = new ol.Feature({geometry:new ol.geom.Point(point), properties:{}});
    	
    	var vectorLayer = new ol.layer.Vector({
			source : new ol.source.Vector({
				features : features
			}),
			style : new ol.style.Style({
    			image: new ol.style.Circle({
    				radius: 10,
    				stroke: new ol.style.Stroke({
    					color: '#fff'
    				}),
    				fill: new ol.style.Fill({
    					color: '#3399CC'
    				})
    			})
    		}),
			visible: true,
			zIndex: 1001,
			id:'dynamicSvgTest'
		});
    	
    	_MapEventBus.trigger(_MapEvents.map_addLayer, vectorLayer);
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
    		var comboId = $(this).attr('id');
//    		getData({
//    			url: '',
//    			contentType: 'application/json',
//    			params: {code:comboId,flag:'town'}
//    		}).done(function(data){
//    			writeCity(data,comboId)
//    		});
    		var data = [{name:'1동'},{name:'2동'},{name:'3동'}];
    		writeCity(data,cityMappingObj[comboId]);
    	});
    };

    var writeCity = function (data, comboId) {
        var html = '';
        for (var i = 0; i < data.length; i++) {
            html += '<option>' + data[i].name + '</option>';
        }
        $('#' + comboId).html(html);
    };

    var getData = function (options) {
        return $.ajax({
            url: options.url + '?' + $.param(options.params),
            type: 'GET',
            contentType: options.contentType
        })
    };

    return {
        init: init
    };
}();