// *** juso.go.kr response 결과 (참고자료)***
//출력변수명	타입	필수여부	설명
//common	totalCount	String	Y	총 검색 데이터수
//currentPage	Integer	Y	페이지 번호
//countPerPage	Integer	Y	페이지당 출력할 결과 Row 수
//errorCode	String	Y	에러 코드
//errorMessage	String	Y	에러 메시지
//juso	roadAddr	String	Y	전체 도로명주소
//roadAddrPart1	String	Y	도로명주소(참고항목 제외)
//roadAddrPart2	String	N	도로명주소 참고항목
//jibunAddr	String	Y	지번주소
//engAddr	String	Y	도로명주소(영문)
//zipNo	String	Y	우편번호
//admCd	String	Y	행정구역코드
//rnMgtSn	String	Y	도로명코드
//bdMgtSn	String	Y	건물관리번호
//detBdNmList	String	N	상세건물명
//bdNm	String	N	건물명
//bdKdcd	String	Y	공동주택여부(1 : 공동주택, 0 : 비공동주택)
//siNm	String	Y	시도명
//sggNm	String	Y	시군구명
//emdNm	String	Y	읍면동명
//liNm	String	N	법정리명
//rn	String	Y	도로명
//udrtYn	String	Y	지하여부(0 : 지상, 1 : 지하)
//buldMnnm	Number	Y	건물본번
//buldSlno	Number	Y	건물부번
//mtYn	String	Y	산여부(0 : 대지, 1 : 산)
//lnbrMnnm	Number	Y	지번본번(번지)
//lnbrSlno	Number	Y	지번부번(호)
//emdNo	String	Y	읍면동일련번호

var _JusoPopup = function () {
    // private functions & variables
	var confmKey  = 'U01TX0FVVEgyMDE4MDUxNzEwMzMzNzEwNzg4MjE=';
	
	var defaultOption = {
						 resultType : 'json',
						 currentPage:1,
						 currentPerPage:10,
						 keywordFormId:'inputSearchAddr',
						 keyword: ''
				      };
	
	var paramOption = {
			 resultType : 'json',
			 currentPage:1,
			 currentPerPage:10,
			 keywordFormId:'inputSearchAddr',
			 keyword: ''
	      };
	
	var searchJuso = function(option, callback){
		
		var option = $.extend(option);
		
		var keyword = $('#'+option.keywordFormId).val();
		
		return $.ajax({
		       url :_proxyUrl + '&confmKey='+confmKey+ '&currentPage='+option.currentPage+'&currentPerPage='+option.currentPerPage+'&keyword='+keyword+'&resultType='+option.resultType+'&urlType=juso'  //인터넷망
		      ,type:"get"
		      ,dataType:"json"
		      ,crossDomain:true
		      ,success:function(jsonStr){
		         if(callback && typeof(callback) == 'function'){
		        	 callback.call(jsonStr);
		         }
		      },
		      error: function(xhr,status, error){
		          alert("에러발생");
		    }
		});
	},
	
	bindJuso = function(response){
		var jp_list = $("#jp_list");
		for(var i = 0 ; i < response.responseJSON.results.juso.length; i++){
			jp_list.append('<a href=\"#\" onclick=\"_JusoPopup.parentMoveToAdmCd('+response.responseJSON.results.juso[i].admCd+')\"><p class=\"num\">'+response.responseJSON.results.juso[i].zipNo+'</p><ul class=\"juso_info\">'+
            '<li class=\"j1\" addr='+response.responseJSON.results.juso[i].admCd+'><span>도로명</span>'+response.responseJSON.results.juso[i].roadAddr+'</li>'+
            '<li class=\"j2\" addr='+response.responseJSON.results.juso[i].admCd+'><span>지&nbsp;&nbsp;번</span>'+response.responseJSON.results.juso[i].jibunAddr+'</li></ul></a>');
			paramOption.currentPage = parseInt(response.responseJSON.results.common.currentPage)+1;
		}
		
	}
	
    // public functions
    return {
    	  
        init: function () {
        	var me = this;
        	return me;
        },
		
        makeOption: function(firstSearch){
        	var option;
        	if(firstSearch){
        		option = defaultOption;
        		$('#jp_list a').remove();
        	}else{
        		option = paramOption;
        	}
        	
        	_JusoPopup.searchJuso(option);
        },
        
		searchJuso: function(option){
			
			var response = searchJuso(option, function(){
				bindJuso(response);	
			});
			
		},
		
		parentMoveToAdmCd: function(admCd){

			_ToolBar.moveToAdmCd(admCd);
			
		}
    };
}();
