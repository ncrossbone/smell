var _WestCondition = function () {
    var initTownCode = '';
    var dateMappingObj = {};
    var cityMappingObj = {};
    var tabCounter = 0;
    
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
	    		'BranchName':'지점명을 입력하세요.',
	    		'StartDate':'시작날짜를 선택하세요.',
	    		'EndDate':'끝날짜를 선택하세요.',
	    		'StartOU':'OU 시작범위를 선택하세요.',
	    		'EndOU':'OU 끝범위를 선택하세요.',
	    		'Item':'측정항목을 선택하세요.'
	    };
		
		for(var i = 0; i < searchPlace.length; i++){
			var searchPlaceId = $(searchPlace[i]).attr('id');
			var searchPlaceName = $(searchPlace[i]).attr('name');
			
			if($(searchPlace[i]).is('input') || $(searchPlace[i]).is('select')){
				if(searchPlaceName){
					var splitName = searchPlaceName.split(placeId)[1];
					if(!paramObj[splitName]){
						paramObj[splitName] = $('input[name="' + searchPlaceName + '"]:checked').val();
					}
				}else if(searchPlaceId){
					var splitId = searchPlaceId.split(placeId)[1];
					if($(searchPlace[i]).val()){
						paramObj[splitId] = $(searchPlace[i]).val(); 
					}else{
						return alert(requireAlertObj[splitId]);
					}
				}
			}
		}
		
		/*getData({
			url: '',
			contentType: 'application/json',
			params: paramObj
		}).done(function(data){
			writeGrid(data);
		});*/
		
		writeGrid();
    };
    
    var writeGrid = function(){
    	$('#gridArea').show();
    	var tabTitle = $('#tab_title');
    	var tabContent = $('#tab_content');
    	var tabTemplate = '<li><a id=#{id} href="#{href}">#{label}</a> <span class="ui-icon ui-icon-close" role="presentation">Remove Tab</span></li>';
    	var tabs = $('#tabs').tabs();
    	
    	tabs.on('click','span.ui-icon-close', function() {
    		var panelId = $( this ).closest('li').remove().attr('aria-controls');
    		$('#' + panelId ).remove();
    		tabs.tabs('refresh');
    	});

    	tabs.on('keyup', function( event ) {
    		if ( event.altKey && event.keyCode === $.ui.keyCode.BACKSPACE ) {
    			var panelId = tabs.find('.ui-tabs-active').remove().attr('aria-controls');
    			$('#' + panelId ).remove();
    			tabs.tabs('refresh');
    		}
    	});
    	var labelObj = ['민원현황','관능성평가데이터','이동식측정데이터','고정식측정데이터'];
    	var label = labelObj[tabCounter]?labelObj[tabCounter]:labelObj[0];
    	var id = 'tabs-' + tabCounter + 1;
    	var randomNum = parseInt(Math.random() * 100);
    	var li = $( tabTemplate.replace( /#\{id\}/g, 'tabs-' + tabCounter ).replace( /#\{href\}/g, '#' + id ).replace( /#\{label\}/g, label  + '(' + randomNum + ')') );
    	var tabContentHtml = tabContent.val() || 'Tab ' + tabCounter + ' content.';

    	tabs.find('.ui-tabs-nav').append( li );
    	tabs.append('<div id="' + id + '"><p>' + tabContentHtml + '</p></div>');
    	tabs.tabs('refresh');

    	$('#tabs-' + tabCounter).trigger('click');

    	var clients = [];

    	for(var i = 1; i <= randomNum; i++){
    		clients.push({Name:i,Age:i,Country:i,Address:i,Married:true});
    	}

    	var countries = [
    	                 { Name: '', Id: 0 },
    	                 { Name: 'United States', Id: 1 },
    	                 { Name: 'Canada', Id: 2 },
    	                 { Name: 'United Kingdom', Id: 3 }
    	                 ];

    	$('#'+id).jsGrid({
    		width: '1000px',
    		height: '170px',

    		inserting: false,
    		editing: false,
    		sorting: true,
    		paging: false,	
    		noDataContent: '데이터가 없습니다.',
    		data: clients,

    		fields: [
    		         { name: 'Name', title:'이름', type: 'text', validate: 'required' },
    		         { name: 'Age', type: 'number'},
    		         { name: 'Address', type: 'text'},
    		         { name: 'Country', type: 'select', items: countries, valueField: 'Id', textField: 'Name' },
    		         { name: 'Married', type: 'checkbox', title: 'Is Married', sorting: false },
    		         { type: 'control' }
    		         ]
    	});
    	tabCounter++;
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