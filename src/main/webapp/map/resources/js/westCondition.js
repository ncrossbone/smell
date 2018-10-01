var _WestCondition = function () {
    var initTownCode = '';
    var cityTownMappingObj = {};
    
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
        
        var toDay = new Date();
    	$('#complaintStatusStartDate').datepicker($.extend(datePickerDefine,{
			  yearSuffix: '년'
		}));
    	
        var cityArr = getCityArr();
        for (var i = 0; i < cityArr.length; i++) {
            var data = cityArr[i].indexOf('CityDistrict') > -1 ? cityDistrictData : townData;
            writeCity(data, cityArr[i]);
        }
    };
    
    var getCityArr = function () {
        var arr = [];
        for (var i = 0; i < $('select[id$="CityDistrict"]').length; i++) {
        	var cityDistrictId = $($('select[id$="CityDistrict"]')[i]).attr('id'); 
            arr.push(cityDistrictId);
            setCityTownMappingObj(cityDistrictId);
            setEventCityDistrict(cityDistrictId);
        }

        for (var i = 0; i < $('select[id$="Town"]').length; i++) {
            arr.push($($('select[id$="Town"]')[i]).attr('id'));
        }
        return arr;
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
    		writeCity(data,cityTownMappingObj[comboId]);
    	});
    };
    
    var setCityTownMappingObj = function(id){
    	if($('#' + id.split('CityDistrict')[0] + 'Town').length > 0){
        	cityTownMappingObj[id] = id.split('CityDistrict')[0] + 'Town';
        }
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