var _CvplDataStatistics = function () {
	
	var init = function(){
		 
		    getData({url:'/getCvplTyCode.do', contentType: 'application/json', params: {} }).done(function(data){
				if(data.length == 0){
					return;
				}
				var selectTag = "";
				selectTag += "<option value='' >전체</option>";
				for (var i = 0; i < data.length; i++) {
					selectTag += "<option value='"+data[i].CODE+"' >"+ data[i].CODE_NM + "</option>";
				}
				$("#cvplTyCode").html(selectTag);
			});
    };
   
    var getData = function (options) {
        return $.ajax({
            url: options.url,
            data:  JSON.stringify(options.params),
            type: 'POST',
            contentType: options.contentType
        })
    };

    return {
        init: function(){
        	init();
        }
    };
}();