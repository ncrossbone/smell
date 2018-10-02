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
//            params: 'code=1111&flag=CityDistrict'
//        }), getData({
//            url: '',
//            contentType: 'application/json',
//            params: 'code=' + initTownCode + '&flag=town'
//        })).then(function (cityDistrictData, townData) {
//            var cityArr = getCityArr();
//            for (var i = 0; i < cityArr.length; i++) {
//                var data = cityArr[i].indexOf('CityDistrict') > -1 ? cityDistrictData : townData;
//                writeCity(data, cityArr[i]);
//            }
//        });
    	
        var cityDistrictData = [{name:'남구'},{name:'동구'},{name:'서구'}];
        var townData = [{name:'논현동'},{name:'검암동'},{name:'구월동'}];
        
        var dateArr = setCommonCombo({
        	type:'input',
        	parentTypeId:'StartDate',
        	childTypeId:'EndDate',
        	flag:'date',
        });
        
        for(var i = 0; i < dateArr.length; i++){
        	$('#' + dateArr[i]).datepicker($.extend(datePickerDefine,{
        		yearSuffix: '년'
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
    	$('input[id$="Views"]').off('click').on('click',function(){
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
				if(searchPlaceId){
					var splitId = searchPlaceId.split(placeId)[1];
					if($(searchPlace[i]).val()){
						paramObj[splitId] = $(searchPlace[i]).val(); 
					}else{
						return alert(requireAlertObj[splitId]);
					}
				}else if(searchPlaceName){
					var splitName = searchPlaceName.split(placeId)[1];
					if(!paramObj[splitName]){
						paramObj[splitName] = $('input[name="' + searchPlaceName + '"]:checked').val();
					}
				}
			}
		}
    }
    
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
        			setEventDate(parentId);
        			dateMappingObj[parentId] = childId;
        		}
        		
        		arr.push(childId);
        	}
        	
        	arr.push(parentId);
        }
        
        return arr;
    };
    
    var setEventDate = function(id){
    	
    };
    
    var setEventCityDistrict = function(id){
    	$('#' + id).off('change').on('change',function(){
    		var comboId = $(this).attr('id');
//    		getData({
//    			url: '',
//    			contentType: 'application/json',
//    			params: 'code=' + comboId + '&flag=town'
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
            url: options.url + '?' + params,
            type: 'GET',
            contentType: options.contentType
        })
    };

    return {
        init: init
    };
}();