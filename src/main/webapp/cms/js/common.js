
var ajaxCallHtmlCnt = 0;
function ajaxCallHtml(url,params,sucessFun,errorFun, async){
	ajaxCallHtmlCnt += 1;
	//console.log(ajaxCallHtmlCnt)
  if(async == undefined) async = true;
  $.ajax({
	  	cache : false,
        type: "POST",
        url: url,
        data: params,
        async: async,
        dataType: 'html',
        contentType: "application/x-www-form-urlencoded; charset=UTF-8", // AJAX contentType
        success: function(data){
        	var result = data;
        	try{
        		result = JSON.parse(data);
        	}catch(e){
        		result = data;
        	}
        	
          if(result.errorCode != undefined && result.errorCode == '401'){
                alert(result.message);
                location.href= "/web";
                if(typeof(errorFun) == 'function') errorFun(result);
                return;
            }
          if(result.message != undefined && result.message != ''){
            alert(result.message);
          }
          if(typeof(sucessFun) == 'function') sucessFun(result);
        }, 
        error : function(xhr, status, error){
            alert("시스템 오류가 발생하였습니다."+error);
            if(typeof(errorFun) == 'function') errorFun();
            return;
        },
        beforeSend : function(){
        	startBlockUi();
		},
		complete : function(){
			ajaxCallHtmlCnt -= 1;
			//console.log("ajaxCallHtmlCnt : " + ajaxCallHtmlCnt);
			if(ajaxCallHtmlCnt == 0) stopBluckUi();
			//
		}
    });
}


/**
 * 공통 Ajax호출 함수
 * @param ur : url정보
 * @param params : 파라미터 json 형태
 * @param sucessFun : 성공시 호출될 함수
 * 성공시 message가 있을경우 alert창으로 보여준다. -message경고창을 따로 설정할 필요가 없다.
 *  * 
 * 예시
  function riverIdChange(){
    var url = "/wms/siteInfoAjax";
      var params = {
              riverId : $("#pRiverId").val()
      };
      var sucessFunc = function(data) {
        var list = data.list;
          $("#pSiteId").empty();
          AddOptionSelectBox($('#pSiteId'),'', false, '--- 전체 ---');
          for(var i=0; i<list.length; i++){
              AddOptionSelectBox($('#pSiteId'), list[i].SITE_ID, false, list[i].SITE_NAME);
          }
      };
      ajaxCall(url,params,sucessFunc);
  } 
 */
function ajaxCall(url,params,sucessFun,errorFun, async){
  if(async == undefined) async = true;
  $("#viewLoading").show();
  $.ajax({
        type: "POST",
        url: url,
        data: params,
        async: async,
        dataType: 'json',
        contentType: "application/x-www-form-urlencoded; charset=UTF-8", // AJAX contentType
        success: function(data){
          //$("#viewLoading").hide();
          if(data.errorCode != undefined && data.errorCode == '401'){
                alert(data.message);
                if(typeof(errorFun) == 'function') errorFun(data);
                return;
            }
          if(data.message != undefined && data.message != ''){
            alert(data.message);
          }
          if(typeof(sucessFun) == 'function') sucessFun(data);
        }, 
        error : function(xhr, status, error){
          //$("#viewLoading").hide();
            alert("시스템 오류가 발생하였습니다."+error);
            if(typeof(errorFun) == 'function') errorFun();
            return;
        }
    });
}

function ajaxfileUpload(url,formId,sucessFun,errorFun){
	var formData = new FormData($("#"+formId)[0]);
	$.ajax({
			cache : false,
			async : true, //동기통신 false, 비동기통신 true
			processData : false,
			dataType : "json",
			url : url,
			type : 'post',
			enctype : "multipart/form-data",
			data : formData,
			contentType : false,
			//submit이후의 처리
			success : function(data) {
		          if(data.errorCode != undefined && data.errorCode == '401'){
		                alert(data.message);
		                if(typeof(errorFun) == 'function') errorFun(data);
		                return;
		            }
		          if(data.message != undefined && data.message != ''){
		            alert(data.message);
		          }
		          if(typeof(sucessFun) == 'function') sucessFun(data);
			},
			error : function(e) {
				alert("시스템 오류가 발생하였습니다.\n엑설 서식에 문제가 있습니다.");
	            if(typeof(errorFun) == 'function') errorFun();
	            return;
			},
			beforeSend : function(){
				startBlockUi("엑셀 업로드 중입니다.....<br/>잠시만 기다려 주시기 바랍니다.");
			},
			complete : function(){
				stopBluckUi();
			}
		});
}


/**
 * selectBox 생성
 * @param $element
 * @param strValue
 * @param bSelected
 * @param strText
 */
function AddOptionSelectBox($element, strValue, bSelected, strText){
  if( bSelected )
    $element.append('<option value="'+strValue+'" selected>'+strText+'</option>');
  else
    $element.append('<option value="'+strValue+'">'+strText+'</option>');
}



/**
 * 상세기관 세팅
 * @param id
 * @param gu
 */
function setOrgList(id,gu) {
  var code = $("#"+id).val();
  if($("#"+id+"1").val() =='') return;
  var url = "/cms/codeUtil/orgListAjax";
  var params = {
    pInCode : '0104',
    pSehighInsttCode : $("#"+id+"1").val(),
  };
  var sucessFunc = function(data) {
    var list = data.list;
    $("#"+id+"2").empty();
    AddOptionSelectBox($("#"+id+"2"), '', false, '-선택-');
    for (var i = 0; i < list.length; i++) {
      var ck = false;
      if(list[i].CODE == code) ck = true;
      if(gu == '2'){
        AddOptionSelectBox($("#"+id+"2"), list[i].CODE_NM, ck, list[i].CODE_NM);
      }else{
        AddOptionSelectBox($("#"+id+"2"), list[i].CODE, ck, list[i].CODE_NM);  
      }
      
    }
  };
  ajaxCall(url, params, sucessFunc, "", false);
}


//우편번호 팝업
function gfn_juso(){
  window.open("/common/popup/jusoPopup.jsp","pop","width=600,height=480, scrollbars=yes, resizable=yes");
}

//업종 팝업
function goIndutyPop(){
  //popup('/cms/codeUtil/indutyPop','600','658',1, 'indutyPop');
  $.smartPop.open({title:'업종조회', width: 600, height: 658, border : 0, padding:10,url: '/cms/codeUtil/indutyPop' });
}

//사업장명 검색-둘다
function goBplcPopPop(bplcNo) {
  $.smartPop.open({title:'업체 조회 팝업', width: 800, height: 500, border : 0, padding:10,url: '/cms/codeUtil/bplcPop?bplcNo='+bplcNo });
  //popup('/cms/codeUtil/bplcPop', '720', '658', 1, 'bplcPop');
}
//사업장명 검색-처리업체 팝업
function goBplcPopPop2() {
  $.smartPop.open({title:'처리업체 조회 팝업', width: 800, height: 500, border : 0, padding:10,url: '/cms/codeUtil/bplcPop2' });
  //popup('/cms/codeUtil/bplcPop2', '720', '658', 1, 'bplcPop2');
}
//사업장명 검색-배출업체 팝업
function goBplcPopPop3(bplcNo) {
	if(bplcNo != null){
		$.smartPop.open({title:'배출업체 조회 팝업', width: 800, height: 500, border : 0, padding:10,url: '/cms/codeUtil/bplcPop3?bplcNo='+bplcNo });
	}else{
		$.smartPop.open({title:'배출업체 조회 팝업', width: 800, height: 500, border : 0, padding:10,url: '/cms/codeUtil/bplcPop3' });
	}
  //popup('/cms/codeUtil/bplcPop3', '720', '658', 1, 'bplcPop3');
}

//운반자조회 팝업
function gobplcTransposerPop( param ){
  if( param == undefined ) {
    param = "";
  }
  var url = '/cms/codeUtil/bplcTransposerPop' + param;
  //popup('/cms/codeUtil/bplcTransposerPop','600','658',1, 'indutyPop');
  $.smartPop.open({title:'운반자조회', width: 700, height: 500, border : 0, padding:10,url: url });
}

///////////////////////////////////////////////////////////
// 팝업 기능관련
// @url URL
// @w 폭
// @h 너비
// @s 스크롤바 여부 1, 'Y'이면 보여줌, 0, '', 'N'이면 숨김
function popup(url,w,h,s,target){

	var l, t, objPopup
	if(target == 'undefined' || target=='' || target==null) {
		var target='win1';
	}
	l = (screen.width-w)/2;
	t = (screen.height-h)/2;
	if(s==1 || s=="Y")
		objPopup  = window.open(url,target,'width='+w+',height='+h+',left='+l+',top='+t+',resizable=0,scrollbars=1');
	else if (s=="" || s==0 || s=="N" || !s || s=="0" )
		objPopup = window.open(url,target,'width='+w+',height='+h+',left='+l+',top='+t+',resizable=0,scrollbars=0,status=0');
	else
		objPopup = window.open(url,target,'width='+w+',height='+h+',left='+l+',top='+t+',resizable=1,menubar=1,toolbar=1,scrollbars=1,status=1');
	if (objPopup == null) {
		alert("차단된 팝업창을 허용해 주십시오.");
	}
	return objPopup;
}


function popupEx(url,w,h,s,n){

	var objPopup;

	if (n == null)	{
		n = "";
	}
	if(s==1 || s=="Y")
		objPopup  = window.open(url,n,'width='+w+',height='+h+',resizable=0,scrollbars=1');
	else if (s=="" || s==0 || s=="N" || !s)
		objPopup = window.open(url,n,'width='+w+',height='+h+',resizable=0,scrollbars=0,status=0');
	else
		objPopup = window.open(url,n,'width='+w+',height='+h+',resizable=1,menubar=1,toolbar=1,scrollbars=1,status=1');
	if (objPopup == null) {
		alert("차단된 팝업창을 허용해 주십시오.");
	}
	return objPopup;

}



///////////////////////////////////////////////////////////


//jquery 달력
function addDatePicker(obj, dateformat, changeFun) {
	if(dateformat == "" || dateformat == undefined){
		dateformat = 'yy-mm-dd';
	}
    $( obj ).datepicker({
    	closeText: '닫기',
    	prevText: '이전달',
    	nextText: '다음달',
    	currentText: '오늘',
		monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월' ],
		dayNamesMin: ['일','월','화','수','목','금','토'],
		weekHeader: 'Wk',
		dateFormat: dateformat,   // 날짜형식 = 20130329
		autoSize: false,    // 자동리사이즈 (false 이면 상위 정의에 따름)
		changeMonth: true,   // 월변경 가능
		changeYear: true,   // 연변경 가능
		showMonthAterYear: true,  // 년 위에 월 표시
		showOn: 'both',    // 엘리먼트와 이미지 동시사용 (both, button)
		buttonImageOnly: true,   // 이미지 표시
		buttonText: '달력',   // 버튼 텍스트 표시
		buttonImage: '/cms/images/calendar.png',  // 이미지 주소
		showMonthAfterYear: true,
		showButtonPanel: true,
		onSelect: function(){ //날짜 선택시 호출되는 함수
		  $(this).removeClass("errInpt");
		  if(typeof(changeFun) == 'function') changeFun();
       }
		//yearRange: 'c-99:c+99',  // 1990~2020년 까지
		//maxDate: '+6Y',    // 오늘 부터 6년 후까지만.  +0d 오늘 이전 날짜만 선택
		//minDate: '-30d'
	});
    
    $(".ui-datepicker-trigger").css("vertical-align","middle");
    $(".ui-datepicker-trigger").css("padding-left","2px");
    $(".ui-datepicker").css("font-size","12px");
    $(".ui-datepicker").css("width","160px");
}


//jquery 달력
function addMonthPicker(obj, dateformat, changeFun) {
	if(dateformat == "" || dateformat == undefined){
		dateformat = 'yy-mm-dd';
	}
    $( obj ).monthpicker({
    	closeText: '닫기',
    	prevText: '이전달',
    	nextText: '다음달',
    	currentText: '오늘',
		monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월' ],
//		dayNamesMin: ['일','월','화','수','목','금','토'],
		weekHeader: 'Wk',
		dateFormat: dateformat,   // 날짜형식 = 20130329
		autoSize: false,    // 자동리사이즈 (false 이면 상위 정의에 따름)
		changeMonth: true,   // 월변경 가능
		changeYear: true,   // 연변경 가능
		showMonthAterYear: true,  // 년 위에 월 표시
		showOn: 'both',    // 엘리먼트와 이미지 동시사용 (both, button)
		buttonImageOnly: true,   // 이미지 표시
		buttonText: '달력',   // 버튼 텍스트 표시
		buttonImage: '/cms/images/calendar.png',  // 이미지 주소
		showMonthAfterYear: true,
		showButtonPanel: true,
		onSelect: function(){ //날짜 선택시 호출되는 함수
		  $(this).removeClass("errInpt");
		  if(typeof(changeFun) == 'function') changeFun();
       }
		//yearRange: 'c-99:c+99',  // 1990~2020년 까지
		//maxDate: '+6Y',    // 오늘 부터 6년 후까지만.  +0d 오늘 이전 날짜만 선택
		//minDate: '-30d'
	});
    
    $(".ui-datepicker-trigger").css("vertical-align","middle");
    $(".ui-datepicker-trigger").css("padding-left","2px");
    $(".ui-datepicker").css("font-size","12px");
    $(".ui-datepicker").css("width","160px");
}


//input 객체들 구분자로 문자열 반환
function objToString(obj){
	var len = obj.length;
	var ele = obj;
	var str="";
	if(obj.length > 1){
		for(var i=0; i < len; i++){
			if (i > 0) {
				str += "|";
			}
			str += ele[i].value;
		}
	}else{
		str = obj.value;
	}
	return str;
}



/**
멀티셀렉트 박스의 값을 String으로 변환시킨다.
A00|A01...
ex) editForm.kcd5CodeArr.value = selectToString(editForm.kcd5Code);
*/
function selectToString(sbox){
	var i=0,j=0;
	var idArray="";
	for(i=0; i<sbox.options.length; i++){
		if (i > 0) {
			idArray += "|";
		}
		idArray += sbox.options[i].value;
	}
	return idArray;
}

/**
멀티셀렉트 박스의 값을 String으로 변환시킨다.
A00|A01...
ex) editForm.kcd5CodeArr.value = selectToString(editForm.kcd5Code);
*/
function selectTextToString(sbox){
	var i=0,j=0;
	var idArray = '';
	for(i=0; i<sbox.options.length; i++){
		if (i > 0) {
			idArray += "|";
		}
		idArray += sbox.options[i].text;
	}
	return idArray;
}

/*
<select></select> 폼요소를 처리함
      tbox : 폼요소 이름
	  val : option 요소의 값
	  txt : option 요소의 이름
ex) <select name=MySel>                   ---> tbox: MySel
        <option value='A'>에이</option>   ---> val: A, txt: 에이
    </select>
*/
function ps_selbox_add(tbox, val, txt) {
	var i=0,j=0;
	//if(val != "" && txt != "") {
	//중복체크
	for(i=0; i<tbox.options.length; i++){
		if(tbox.options[i].value == val){
			return;
		}
	}
	if(txt != "") {
		var no = new Option();
		no.value = val;
		no.text = txt;
		var maxidx = tbox.options.length;
		tbox.options[maxidx] = no;
	}
}


function ps_selbox_move(fbox,tbox) {
	var i=0,j=0;
	for(var i=0; i<fbox.options.length; i++) {
		if(fbox.options[i].selected && fbox.options[i] != "") {
			for(var j=0; j<tbox.options.length; j++) {
				if(tbox.options[j].value == fbox.options[i].value) {
					window.alert('이미 값이 존재합니다.');
					return;
				}
			}
			var no = new Option();
			no.value = fbox.options[i].value;
			no.text = fbox.options[i].text;
			tbox.options[tbox.options.length] = no;
		}
	}
}


function ps_selbox_remove(box) {
	for(var i=0; i<box.options.length; i++) {
		if(box.options[i].selected && box.options[i] != "") {
			box.options[i].value = "";
			box.options[i].text = "";
		}
	}
	ps_selbox_bumpUp(box);
} 


function ps_selbox_removeAll(box) {
	for(var i=0; i<box.options.length; i++) {
		if(box.options[i] != "") {
			box.options[i].value = "";
			box.options[i].text = "";
		}
	}
	ps_selbox_bumpUp(box);
} 


function ps_selbox_bumpUp(abox) {
	for(var i = 0; i < abox.options.length; i++) {
		if(abox.options[i].value == "")  {
			for(var j = i; j < abox.options.length - 1; j++)  {
				abox.options[j].value = abox.options[j + 1].value;
				abox.options[j].text = abox.options[j + 1].text;
			}
			var ln = i;
			break;
		}
	}
	if(ln < abox.options.length)  {
		abox.options.length -= 1;
		ps_selbox_bumpUp(abox);
	}
}

function ps_selbox_moveUp(dbox) {
	for(var i = 0; i < dbox.options.length; i++) {
		if (dbox.options[i].selected && dbox.options[i] != "" && dbox.options[i] != dbox.options[0]) {
			var tmpval = dbox.options[i].value;
			var tmpval2 = dbox.options[i].text;
			dbox.options[i].value = dbox.options[i - 1].value;
			dbox.options[i].text = dbox.options[i - 1].text
			dbox.options[i-1].value = tmpval;
			dbox.options[i-1].text = tmpval2;
			dbox.options[i-1].selected = true;
			break;
		}
	}
}


function ps_selbox_moveDown(ebox) {
	for(var i = 0; i < ebox.options.length; i++) {
		if (ebox.options[i].selected && ebox.options[i] != "" && ebox.options[i+1] != ebox.options[ebox.options.length]) {
			var tmpval = ebox.options[i].value;
			var tmpval2 = ebox.options[i].text;
			ebox.options[i].value = ebox.options[i+1].value;
			ebox.options[i].text = ebox.options[i+1].text
			ebox.options[i+1].value = tmpval;
			ebox.options[i+1].text = tmpval2;
			ebox.options[i+1].selected = true;
			break;
		}
	}
}

// 기본값을 셋팅하기 위해
function ps_selbox_selected(ebox,val){
	for(var i = 0; i < ebox.options.length; i++) {
		if(ebox.options[i].value == val){
			ebox.options[i].selected = true;
			break;
		}
	}
}

function gfn_number_set(val){
	val = String(val);
	if(val.length < 2){
	val = "0"+val;	
	}
	return val
}


function leadingZeros(n, digits) {
	var zero = '';
	n = n.toString();

	if (n.length < digits) {
		for (i = 0; i < digits - n.length; i++)
			zero += '0';
	
	}
	return zero + n;
}

function GetCurYYYY(){
	var d = new Date();
	
	return leadingZeros(d.getFullYear(), 4);
}

function GetCurMM(){
	var d = new Date();
	
	return leadingZeros(d.getMonth() + 1, 2);
}

function GetCurDD(){
	var d = new Date();
	
	return leadingZeros(d.getDate(), 2);
}

function GetCurDate(){
	var d = new Date();
	
	var date = '';
	
	date += leadingZeros(d.getFullYear(), 4) + '-';
	date += leadingZeros(d.getMonth() + 1, 2) + '-';
	date += leadingZeros(d.getDate(), 2) + ' ';
	date += leadingZeros(d.getHours(), 2) + ':';
	date += leadingZeros(d.getMinutes(), 2) + ':';
	date += leadingZeros(d.getSeconds(), 2);

	return date;
}



//////////////////////////////////////////////////////////////
//멀티 체크박스
/**
* 특정이름의 멀티체크박스를 체크 또는 체크해제한다.
* ex) <input type=checkbox name=IDS value='...'>
*     <script language='javascript'>
*		toggleMultiChk(this.checked, 'IDS')
*	   </script>
*
* @param bCheck    true|false(체크할 상태)
* @param itemName  체크대상 체크박스이름
*/
function toggleMultiChk(bCheck, itemName){
	var obj = document.getElementsByName(itemName);
	if(typeof(obj) == 'undefined'){
		return;
	}

	for(var i=0; i<obj.length; i++){
		obj[i].checked = bCheck;
	}
}
/**
* 체크된 개수
* @param itemName 체크박스명
*/
function getMultiCheckedNum(itemName){
	var obj = document.getElementsByName(itemName);
	if(typeof(obj) == 'undefined'){
		return 0;
	}
	var chkedCnt=0;

	for(var i=0; i<obj.length; i++){
		if(obj[i].checked)
			chkedCnt++;
	}
	return chkedCnt;
}
/**
* 체크된 항목들 값을 취합해서 리턴
* @param itemName 체크박스명
* @param delim    구분자
*/
function getMultiCheckedString(itemName, delim){
	var obj = document.getElementsByName(itemName);
	var div = delim;
	if(div=="")
		div="|";
	var chkCnt=0;
	if(typeof(obj) == 'undefined'){
		return "";
	}
	var s="";
	var n=0;
	for(var i=0; i<obj.length; i++){
		if(obj[i].checked){
			if(n>0)
				s += div;
			s += obj[i].value;
			n++;
		}
	}
	return s;
}

function getMultiNonCheckedString(itemName, delim){
	var obj = document.getElementsByName(itemName);
	var div = delim;
	if(div=="")
		div="|";
	var chkCnt=0;
	if(typeof(obj) == 'undefined'){
		return "";
	}
	var s="";
	var n=0;
	for(var i=0; i<obj.length; i++){
		if(obj[i].checked){
			
		}else{
			if(n>0)
				s += div;
			s += obj[i].value;
			n++;
			
		}
	}
	return s;
}

function getMultiAllCheckedString(itemName, delim){
	var obj = document.getElementsByName(itemName);
	var div = delim;
	if(div=="")
		div="|";
	var chkCnt=0;
	if(typeof(obj) == 'undefined'){
		return "";
	}
	var s="";
	var n=0;
	for(var i=0; i<obj.length; i++){
		if(n>0)
			s += div;
		s += obj[i].value;
		n++;
			
	}
	return s;
}



/**
* 체크된 항목들 값을 취합해서 리턴
* @param itemName 체크박스명
* @param delim    구분자
*/
function checkedToString(obj, delim){
	var div = delim;
	if(div=="")
		div="|";
	var chkCnt=0;
	if(typeof(obj) == 'undefined'){
		return "";
	}
	if(obj.length == undefined){
		return (obj.checked) ? obj.value : "";
	}
	var s="";
	var n=0;
	for(var i=0; i<obj.length; i++){
		if(obj[i].checked){
			if(n>0)
				s += div;
			s += obj[i].value;
			n++;
		}
	}
	return s;
}
/**
* 메인에 사용될 팝업찰을 리턴한다
*
**/

function popupTrans(url,w,h,s,target,popType){
	

	var l, t, objPopup;
	if(target == 'undefined' || target=='' || target==null) {
		var target='win1';
	}
	l = (screen.width-w)/2;
	t = (screen.height-h)/2;
	if(s==1 || s=="Y")
		objPopup  = window.open(url+"?popType="+popType,target,'width='+w+',height='+h+',left='+l+',top='+t+',resizable=0,scrollbars=1');
	else if (s=="" || s==0 || s=="N" || !s || s=="0" )
		objPopup = window.open(url+"?popType="+popType,target,'width='+w+',height='+h+',left='+l+',top='+t+',resizable=0,scrollbars=0,status=0');
	else
		objPopup = window.open(url+"?popType="+popType,target,'width='+w+',height='+h+',left='+l+',top='+t+',resizable=1,menubar=1,toolbar=1,scrollbars=1,status=1');
	if (objPopup == null) {
		alert("차단된 팝업창을 허용해 주십시오.");
	}
	return objPopup;
}

function nullString(param){
	if(param == null)
		return "";
	else return param;
}

/* 쿠키 관련 */
function setCookie(cookieName, value, exdays){
  if(value == undefined) value = "on";
  if(exdays == undefined) exdays = 1;
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var cookieValue = escape(value) + ((exdays==null) ? "" : "; path=/; expires=" + exdate.toGMTString());
    document.cookie = cookieName + "=" + cookieValue;
}
function deleteCookie(cookieName){
    var expireDate = new Date();
    expireDate.setDate(expireDate.getDate() - 1);
    document.cookie = cookieName + "= " + "; path=/; expires=" + expireDate.toGMTString();
}
function getCookie(cookieName) {
    cookieName = cookieName + '=';
    var cookieData = document.cookie;
    var start = cookieData.indexOf(cookieName);
    var cookieValue = '';
    if(start != -1){
        start += cookieName.length;
        var end = cookieData.indexOf(';', start);
        if(end == -1)end = cookieData.length;
        cookieValue = cookieData.substring(start, end);
    }
    return unescape(cookieValue);
}
/* 쿠키 관련 */

//엑셀 스타일의 반올림 함수 정의
function roundXL(n, digits) {
	if (digits >= 0)
		return parseFloat(n.toFixed(digits)); // 소수부 반올림

	digits = Math.pow(10, digits); // 정수부 반올림
	var t = Math.round(n * digits) / digits;

	return parseFloat(t.toFixed(0));
}

function checkNull(data , chr){
    if(chr == null || chr == undefined) chr ='';
    if(data == null || data == undefined){
        return chr;
    }else{
        return data;
    }   
}
//기간검색 체크
function dayCkDiff($d1, $d2 , msg){
  
  if($d1.val() =="" && $d2.val() ==""){
    return true;
  }
  
  if(msg == null || msg == undefined) msg = "기간이 잘못되었습니다.";
  var d1 = Number($d1.val().replace(/-/g,''));
  var d2 = Number($d2.val().replace(/-/g,''));
  if(d2-d1 < 0 ){
    alert(msg);
    $d1.focus();
    return false;
  }
  
  return true;
}


function closeWin(pId){
  setCookie(pId);
  self.close();
}

function closeLayer(pId){
  setCookie(pId);
  $("#"+pId).hide();
  return false;
}
function golink(link){
  if(link != undefined && link !=""){
      var openNewWindow = window.open("about:blank");
      openNewWindow.location.href=link;
  }
  return false;
}

function jsGetValueCommaDel(value) {
    return value.replace(/,/g,"");
} 

function jfComma(obj1) { 
    var sOrg = jsGetValueCommaDel(eval(obj1).value); 

    if(isNaN(sOrg) || sOrg.length==0) return "";
      
    var sRetVal     = "";
    var sTmpVal     = "";
    var sFractionVal  = "";
      
    sOrg = sOrg.toString();
    sOrg = sOrg.replace(/,/g,"");
    
    var lLengh = sOrg.search(/\./);
     
    if (lLengh<0) {
        lLengh = sOrg.length;
    }
    else
        sFractionVal = sOrg.substr(lLengh);
      
    lLengh    = lLengh;
    var lRemainder  = lLengh % 3;

    if (lRemainder == 0 && lLengh > 0)
        lRemainder  = 3;

    sRetVal = sOrg.substr(0,lRemainder);

    while(lRemainder < lLengh) {
        sTmpVal = sTmpVal + "," + sOrg.substr(lRemainder,3);
        lRemainder  += 3;
    }

    sRetVal = sRetVal + sTmpVal + sFractionVal;  
    eval(obj1).value = sRetVal ;     
}

/*======================================================
input_limit_string(ta,limit,poin);
지정된 input 객체에 입력값을 제한하도록 한다.
ta : 적용한 input(textarea 등) 대상
limit : 제한 정규식을 생성 인자
point : 구분자(기본값 : , )

추천 limit
'/kor,/symbol,/s':한글+특수기호+빈칸
'/eng,/d' : 영어+숫자 : 아이디용
'/number' : 숫자와 -,+,. 만
'/d' : 숫자만
ex>
<input type="text" name="textfield" onfocus="input_limit_string(this,'/eng,/n,/s');"/>
========================================================*/
function jsInputLimitString(ta,limit,point){
   var fn = function(){
      var t = ta.value.limit_string(limit,point);
      if(t != ta.value){
         ta.value=t;
      }
   }
   ta.onclick = fn;
   ta.onblur = fn;
   ta.onkeydown = fn;
   ta.onkeyup = fn;
   ta.onchange = fn;
   ta.onmouseover = fn;
   ta.onmousemove = fn;
   ta.onfocus = null;
   ta.onfocus = fn;
}

String.prototype.limit_string = function(limit,point){
   if(point==null){point=',';}
   var inv = limit.split(point);
   var inc = inv.length;
   var regexp=null
   var reg_str = '';
   for(var i = 0;i<inc;i++){
      switch(inv[i]){
         case '':;
         case null:;
         case false:;
         case undefined:break;
         //----------- 알파벳처리
         case '/H':reg_str+='1-3';break;
         case '/e':reg_str+='a-z';break; //알파벳 소문자
         case '/E':reg_str+='A-Z';break; //알파벳 대문자
         case '/eE':reg_str+='a-zA-Z';break; //모든 알파벳
         //----------- 숫자처리
         case '/d':reg_str+='\\d';break; //숫자인것
         case '/!d':reg_str+='\\D';break; //숫자가 아닌 것
         //----------- 숫자형 처리(정확하게 구분하는 것이 아닌, 숫자와 -,+,. 만 구분함)
         case '/number':reg_str+='\\-\\+\\,\\d';break; //숫자가 아닌 것
         case '/phone_num':reg_str+='-';break; //숫자가 아닌 것
         case '/float':reg_str+='\\.\\d';break; //소수점 숫자인 것
         //----------- 공백처리
         case '/s':reg_str+='\\s';break; //빈칸인것
         case '/!s':reg_str+='\\S';break;   //빈칸이 아닌것
         //----------- 아스키코드(특수문자 허용)
         case '/ascii':reg_str+='!-~';break;
         //-----------기호만처리
         case '/symbol':reg_str+='!-\\/\\:-@\\{-~';break;
         case '/symbol2':reg_str+='&()\\-_';break;
            case '/symbol3':reg_str+='~';break;
            case '/symbol4':reg_str+=':';break;
         //----------- 영어글자처리
         case '/eng':reg_str+='a-zA-Z';break;
         //----------- 한글글자처리
         case '/kor':reg_str+=
         String.fromCharCode(0x1100)+'-'+String.fromCharCode(0x11FF)
         +String.fromCharCode(0x3130)+'-'+String.fromCharCode(0x318F)
         +String.fromCharCode(0xAC00)+'-'+String.fromCharCode(0xD7AF);break; //모든 한글(반각,전각 자모는 제외)
         case '/kor_jamo':reg_str+=String.fromCharCode(0x1100)+'-'+String.fromCharCode(0x11FF)
         default :
               reg_str+=inv[i];
            break;
      }
   }
   regexp=new RegExp('[^'+reg_str+']','g');
   return this.toString().replace(regexp,'');
}


function fnCommaData(objVal){
    var num02 = objVal.replace(/\D/g,""); 
    //alert(" num02 :"+num02)
	return setComma(num02); //콤마 찍기
}

function getNumber(obj){
    
    var num01;
    var num02;
    num01 = obj.value;
    num02 = num01.replace(/\D/g,""); //숫자가 아닌것을 제거, 
                                     //즉 [0-9]를 제외한 문자 제거; /[^0-9]/g 와 같은 표현
    num01 = setComma(num02); //콤마 찍기
    obj.value =  num01;

}
function setComma(n) {
    var reg = /(^[+-]?\d+)(\d{3})/;   // 정규식
    n += '';                          // 숫자를 문자열로 변환         
    while (reg.test(n)) {
       n = n.replace(reg, '$1' + ',' + '$2');
    }         
    return n;
}


//날짜 차이 계산
function getDiffDay (startDay, endDay)
{
	var dateArray1 = startDay.split("-");  
	var dateObj1 = new Date(dateArray1[0], Number(dateArray1[1])-1, dateArray1[2]);  
	var dateArray2 = endDay.split("-");  
	var dateObj2 = new Date(dateArray2[0], Number(dateArray2[1])-1, dateArray2[2]);  
	var betweenDay = (dateObj2.getTime() - dateObj1.getTime())/1000/60/60/24;
	return betweenDay;
	
}

/**
 * 함수 설명 : 엑셀 다운로드 시 사용 - 다운로드 시간이 오래걸리는 경우 사용 (화면에 다운로드 중이라고 표시해줌)
 * @param formId  :  form id
 */
function excelDownLoad(url ,formId){
  startDownBlockUi();
  var formObj = $("#"+formId);
  $.fileDownload(url,{
        httpMethod:'POST', 
        data: formObj.serialize()
       })
       .done(function (url) {
         stopBluckUi();
       })
       .fail(function (responseHtml, url) {
         stopBluckUi();
         alert("시스템 오류가 발생하였습니다.\n잠시후에 사용하시기 바랍니다.")
       });
}

/**
 * 함수 설명 : blockUi - 엑셀 다운로드용
 */
function startDownBlockUi(){
  startBlockUi("엑셀 다운로드 중입니다.....<br/>잠시만 기다려 주시기 바랍니다.");
}

/**
 * 함수 설명 : blockUi - Ajax 조회용
 * @param msg  :  보여지는 메시지 글
 */
function startBlockUi(msg){
  if(msg == undefined) msg = '데이터 로딩중입니다.....<br/>잠시만 기다려 주시기 바랍니다.';
  $.blockUI({ message: msg,css: { 
        border: 'none', 
        padding: '15px', 
        backgroundColor: '#000', 
        '-webkit-border-radius': '10px', 
        '-moz-border-radius': '10px', 
        opacity: .5, 
        color: '#fff'
    } });
  /*$.blockUI({ message: null, overlayCSS: { backgroundColor: '#f5f5f5' ,opacity : 0.6}});*/
}

/**
 * 함수 설명 : blockUi 종료
 */
function stopBluckUi(){
  $.unblockUI();
}

/**
 * 조회년도 box 세팅하기
 * 2018년 부터 현재 년도 +1 까지 출력한다
 * @param selBoxId
 */
function setSearchYear( selBoxId ) {
  var startYear = "2018";
  var endYear = new Date().getFullYear() + 2;
  var selectTag = "";
  for (var i = startYear; i < endYear; i++) {
    selectTag += "<option value='"+i+"' >"+ i + "년</option>";
  }
  $("#"+selBoxId).html(selectTag);
}
// /////////////////////////////////////////////////////////



/**
* 팝업 오픈
* @param url URL 
* @param w 폭 
* @param h 너비
* @param s 스크롤바 여부 1, 'Y'이면 보여줌, 0, '', 'N'이면 숨김 
*/
function gfnPopup(url,w,h,s,target){

	var l, t, objPopup
	if(target == 'undefined' || target=='' || target==null) {
		var target='win1';
	}
	l = (screen.width-w)/2;
	t = (screen.height-h)/2;
	if(s==1 || s=="Y")
		objPopup  = window.open(url,target,'width='+w+',height='+h+',left='+l+',top='+t+',resizable=0,scrollbars=1');
	else if (s=="" || s==0 || s=="N" || !s || s=="0" )
		objPopup = window.open(url,target,'width='+w+',height='+h+',left='+l+',top='+t+',resizable=0,scrollbars=0,status=0');
	else
		objPopup = window.open(url,target,'width='+w+',height='+h+',left='+l+',top='+t+',resizable=1,menubar=1,toolbar=1,scrollbars=1,status=1');
	if (objPopup == null) {
		alert("차단된 팝업창을 허용해 주십시오.");
	}
	return objPopup;
}
/**
 * 함수 설명 : null값을 다른 문자열로 대체, 대체문자열이 없을 경우 공백으로 리턴
 * @param data :  검사 데이터값(필수)
 * @param chr  :  대체문자 
 */
function gfnCheckNull(data , chr){
    if(chr == null || chr == undefined) chr ='';
    
    if(data == null || data == undefined || data== 'null'|| data === ''){
        return chr;
    }else{
        return data;
    }   
}

var prev="";
/*소수 1자리 까지 입력*/
function imsi1(obj){
	var regexp = /^\d*(\.\d{0,1})?$/;
	if(obj.value.search(regexp)==-1){
		obj.value=prev;
	}else{
		prev=obj.value;
	}
}

var prev0="";
/*소수 3자리 까지 입력*/
function imsi3(obj){
	var regexp = /^\d*(\.\d{0,3})?$/;
	if(obj.value.search(regexp)==-1){
		obj.value=prev0;
	}else{
		prev0=obj.value;
	}
}

var prev1="";
function imsi4(obj){
	var regexp = /^\d*(\d{0,3})?$/;
	if(obj.value.search(regexp)==-1){
		obj.value=prev1;
	}else{
		prev1=obj.value;
	}
}

function gfnIsDateCheck(str) {
	if  ( !/([0-9]{4})([0-9]{2})([0-9]{2})/.test(str) )  {
		//alert("날짜의 형식이 잘못 입력되었습니다.\n예) 1996-04-05");
		return false;
	}
	// 현재 날짜
	var toDay = new Date();
	
	var arrDate0 = str.substr(0,4);
	var arrDate1 = str.substr(4,2);
	var arrDate2 = str.substr(6,2);
	
	var maxDay = new Date(new Date(arrDate0, arrDate1, 1) - 86400000).getDate();
	
	if  ( arrDate0 == 0000 || arrDate0 > toDay.getFullYear() )  {
		//alert("잘못된 년도를 입력하였습니다.");
		return false;
	}
	if  ( arrDate1 == 00 || arrDate1 > 12  )  {
		//alert("잘못된 월을 입력하였습니다.");
		return false;
	}
	if  ( arrDate2 == 00 || arrDate2 > maxDay )  {
		//alert("잘못된 일을 입력하였습니다.");
		return false;
	}
	return true;
}