<%@page contentType="text/html; charset=utf-8" %>
<html lang="ko">
<head>

<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1" />

<title>AirKorea 지리정보 서비스</title>

<link href="/map/resources/css2/BasicSet.css" rel="stylesheet" type="text/css" />
<link href="/map/resources/css2/sub.css" rel="stylesheet" type="text/css" />
<link href="/map/resources/css2/common.css" rel="stylesheet" type="text/css" />

<script type="text/javascript" src="/map/resources/js/lib/jquery-1.11.2.min.js" ></script>
<script type="text/javascript" src="/map/resources/js/lib/jquery.layout-latest.js" ></script>
<script type="text/javascript" src="/map/resources/js/lib/common.js" ></script>
<script type="text/javascript" src="/map/resources/js/lib/mapEventBus.js" ></script>

<link href="/map/resources/css/BasicSet.css" rel="stylesheet" type="text/css" />
<link href="/map/resources/css/common.css" rel="stylesheet" type="text/css" />

<link rel="stylesheet" href="/map/resources/css/gis.css">
<link rel="stylesheet" href="/map/resources/css/jquery-ui.css">
<link rel="stylesheet" href="/map/resources/css/multiselect.css">

<script type="text/javascript" src="/map/resources/js/lib/jquery-ui.min.js"></script>
<script type="text/javascript" src="/map/resources/js/lib/jquery-ui-multiselect.js"></script>
<script type="text/javascript" src="/map/resources/js/lib/common.js"></script>
<script type="text/javascript" src="/map/resources/js/lib/ol.js"></script>

<script type="text/javascript" src="https://cdn.rawgit.com/bjornharrtell/jsts/gh-pages/1.2.0/jsts.min.js"></script>

<!-- <script type="text/javascript" src="/map/resources/js/lib/airKoreaLayer.js"></script> -->
<script type="text/javascript" src="/map/resources/js/mapService.js"></script>
<script type="text/javascript" src="/map/resources/js/lib/vworldLayer.js"></script>
<!-- <script type="text/javascript" src="/map/resources/js/lib/airKoreaMap.js"></script> -->
<script type="text/javascript" src="/map/resources/js/lib/coreMap.js"></script>

<script type="text/javascript" src="/map/resources/js/thematicLayer.js"></script>
<script type="text/javascript" src="/map/resources/js/toolBar.js"></script>

<script type="text/javascript" src="/map/resources/js/lib/jquery-ui.js"></script>
<script type="text/javascript" src="/map/resources/js/lib/zoomSlider.js"></script>
<script type="text/javascript" src="/map/resources/js/jusoPopup.js"></script>
<script type="text/javascript" src="/map/resources/js/smellMapBiz.js"></script>

<style type="text/css">

select::-ms-expand {
    display: none;
}

</style>

<style type="text/css">
      .ol-popup {
        display: none;
        position: absolute;
        background-color: white;
        -moz-box-shadow: 0 1px 4px rgba(0,0,0,0.2);
        -webkit-filter: drop-shadow(0 1px 4px rgba(0,0,0,0.2));
        filter: drop-shadow(0 1px 4px rgba(0,0,0,0.2));
        padding: 15px;
        border-radius: 10px;
        border: 1px solid #cccccc;
        bottom: 12px;
        left: -50px;
      }
      .ol-popup:after, .ol-popup:before {
        top: 100%;
        border: solid transparent;
        content: " ";
        height: 0;
        width: 0;
        position: absolute;
        pointer-events: none;
      }
      .ol-popup:after {
        border-top-color: white;
        border-width: 10px;
        left: 48px;
        margin-left: -10px;
      }
      .ol-popup:before {
        border-top-color: #cccccc;
        border-width: 11px;
        left: 48px;
        margin-left: -11px;
      }
      .ol-popup-closer {
        text-decoration: none;
        position: absolute;
        top: 2px;
        right: 8px;
      }
      .ol-popup-closer:after {
        content: "✖";
      }
    </style>
    
<script>

</script>
</head>
<body style="overflow:hidden;"> 
<div class="wrap" style="overflow:hidden;">
	<h1><img src="/map/resources/images/ui/logo.jpg" alt="airkorea 지리정보 서비스"/></h1>
    <div class="container" style="overflow:hidden;">
    	<div class="left" id="leftMenuDiv">
        	<div class="left_menu">
            	<a href="javascript:void(0)" class="left_tit accordion">측정소
            		<span class="open"><img src="/map/resources/images/ui/left_menu_close.png"/></span>
            	</a>
                <div class="left_cont">
                	<p class="left_cont_tit MgT0">측정 날짜</p>
                	<div class="on_off AR" style="position: relative; top: -30px;">
	                	<a href="javascript:void(0);" class="MgR5"><img id="stationOnBtn" src="/map/resources/images/b1_on.png" /></a>
	                	<a href="javascript:void(0);"><img src="/map/resources/images/b2_off.png" id="dustLabel"/></a>
                    </div>
                    <input style="margin-top:-30px" type="text" title="text" class="c" id="stationMeasureDate"/>
                    <select style="margin-top:-30px" id="stationMeasureTime">
                    </select>
                	<p class="left_cont_tit">측정항목</p>
                    <select style="width:100%;" id="itemCode" >
                    	<option value="10008">PM2.5</option>  
				        <option value="10007">PM10</option>
				        <option value="10003">오존 </option>
				        <option value="10006">이산화질소</option>
				        <option value="10002">일산화탄소</option>  
				        <option value="10001">아황산가스</option>				        
<!-- 				        <option value="10010">NCH₄</option>   -->
			        </select>  
			       <p class="left_cont_tit">측정망 구분</p>
                    <ul class="cb cb3">
                        <li> 
                        	<span>
                        		<a href="javascript:void(0)"><input type="checkbox" id="mode3" checked /><label for="mode3">도시대기</label><img src='/map/resources/images/obs/p_3_1.png' style='cursor:auto; margin: -3px 5px; width: 13px;'/></a>	
                        	</span>
                        	<span>
                        		<a href="javascript:void(0)"><input type="checkbox" id="mode4" checked /><label for="mode4">도로변대기</label><img src='/map/resources/images/obs/p_4_1.png' style='cursor:auto; margin: -3px 5px; width: 20px;'/></a>
                        	</span>
                        </li>
                        <li>
                        	<span>
                        		<a href="javascript:void(0)"><input type="checkbox" id="mode2" /><label for="mode2">교외대기</label><img src='/map/resources/images/obs/p_2_1.png' style='cursor:auto; margin: -3px 5px; width: 13px;'/></a>
                        	</span>
                        	<span>
                        		<a href="javascript:void(0)"><input type="checkbox" id="mode1" /><label for="mode1">국가배경</label><img src='/map/resources/images/obs/p_1_1.png' style='cursor:auto; margin: -3px 5px; width: 15px;'/></a>
                        	</span>
                        </li>
                	</ul>
                	<p class="left_cont_tit">농도범위<span class="L0">(㎍/㎥)</span></p>
                    <ul class="cb cb2">
                        <li>
                        	<img src="/map/resources/images/ui/c1.png" />
                            <span class="txt">좋음</span>
                            <span class="L0" id="level1">(0~)</span>
                        </li>
                        <li>
                        	<img src="/map/resources/images/ui/c2.png" />
                            <span class="txt">보통</span>
                            <span class="L0" id="level2">(16~)</span>
                        </li>
                        <li>
                        	<img src="/map/resources/images/ui/c3.png" />
                            <span class="txt">나쁨</span>
                            <span class="L0" id="level3">(36~)</span>
                        </li>
                        <li>
                        	<img src="/map/resources/images/ui/c4.png" />
                            <span class="txt">매우나쁨</span>
                            <span class="L0" id="level4">(76~)</span>
                        </li>
                        <li>
                        	<img src="/map/resources/images/ui/c5.png" />
                            <span class="txt">데이터<br />없음</span>
                        </li>
                	</ul>
                </div><!--left_cont-->
            </div><!--left_menu-->
            <div class="left_menu">
            	<a href="javascript:void(0)" class="left_tit accordion">대기오염 공간분포<span class="open"><img src="/map/resources/images/ui/left_menu_open.png"/></span></a>
                <div class="left_cont" style="display:none;">
                    <div id="tab_wrap">
                        <!-- <ul class="tab"> 
                            <li class="active"  id="latticeMapBtn">격자분포</li>
                        </ul> -->
                            <div  class="tab_cont" style="display:block;">
                                <p class="left_cont_tit" style="margin-top: 0px;">측정항목</p>
                                <div class="on_off AR" style="position: relative; top: -30px;">
                                	<a href="javascript:void(0)" class="MgR5 chartOption"><img src="/map/resources/images/b3_on.png" id="distributionChartOnBtn"/></a>
                                	<a href="javascript:void(0)" class="MgR5 heatMapOption" style="display:none;"><img src="/map/resources/images/b4_on.png" id="distributionHeatMapOnBtn"/></a>
                            	</div>
                                <select style="width:100%; margin-top:-30px;" id="distributionChartItem" >
                                	<option value="dustNew_pm25">PM2.5</option>
							        <option value="dustNew_pm10">PM10</option>
							        <option value="dustNew_o3">오존</option>  
							        <option value="dustNew_no2">이산화질소</option>
							        <option value="dustNew_co">일산화탄소</option>
							        <option value="dustNew_so2">아황산가스</option>  
						        </select>  
                                <p class="left_cont_tit">측정 날짜</p>
                                <input type="text" title="text" class="c" id="distributionChartStartDate"/>
                                <select id="distributionChartStartTime">
                                </select>
                                <span id="densityWave">~</span><br />
                                <input type="text" title="text" class="c" id="distributionChartEndDate"/>
                                <select id="distributionChartEndTime">
                                </select>
                                <p class="left_cont_tit chartOption">지도에 표현된 시간</p>
                                <input type="text" title="text" class="chartOption" id="distributionCurrentDate"/>
                    			<p class="left_cont_tit heatMapOption" style="display:none;" >radius</p>
								<input class="heatMapOption" style="display:none;" id="radius" type="range" min="1" max="100" step="1" value="5"/><br>
								<p class="left_cont_tit heatMapOption" style="display:none;">blur</p>
								<input class="heatMapOption" style="display:none;" id="blur" type="range" min="1" max="50" step="1" value="15"/>
                                <div class="btn">
                                	<a href="javascript:void(0)" class="chartOption"><img src="/map/resources/images/icon/btn1.png" id="distributionChartPreBtn"/></a>
                                    <a href="javascript:void(0)" class="chartOption"><img src="/map/resources/images/icon/play.png" id="setDistributionChartBtn"/></a>
                                    <a href="javascript:void(0)" class="heatMapOption" style="display:none;"><img src="/map/resources/images/icon/play.png" id="setDistributionHeatMapBtn"/></a>
                                    
                                    <a href="javascript:void(0)" class="chartOption"><img src="/map/resources/images/icon/btn2.png" id="distributionChartNextBtn"/></a>
                            	</div>
                                <img src="/map/resources/images/ui/value_1.gif" />
                                <b>※ 측정자료를 기반으로 재분석한 자료로 </br> 측정소의 측정값과는 차이가 있을수 있습니다.</b>
                            </div>
                    </div>
                </div>
            </div>
        </div>
        <p class="left_co"><img src="/map/resources/images/ui/left_close.png" id="leftCollapseBtn"/></p>
        <div class="mapbox" id="mapBoxDiv" >
        	<div class="map_top">
            	<img src="/map/resources/images/ui/position.png" class="pt"/>
            	<!-- 시도 선택 -->
            	<div class="province" style="display:inline;"> 
					<select  id="sidoSelect" onchange="_ToolBar.bindSgg()" style="width: 120px;">
					<option value="none">시도 선택</option>
					</select>
					
				</div>
                <div class="province">
                    <select id = "sggSelect" onchange="_ToolBar.bindDong()" style="width: 120px;">
						<option value="none">시군구 선택</option>
					</select>
            	</div>
                <div class="province BgNone PdR0">
					<select id = "dongSelect" onchange="_ToolBar.bindRe()" style="width: 115px;">
						<option value="none">읍면동 선택</option>
					</select>
            	</div>
            	<!-- 도로명주소 -->
				<a href="javascript:;" class="juso"><img src="/map/resources/images/ui/juso.png" /></a>
				<div class="juso_pop" style="z-index:99999 !important">
		        	<p class="jp_tit">도로명주소<a href="javascript:;" class="close"><img src="/map/resources/images/ui//close.png" /></a></p>
		            <div class="juso_search">
		                <input type="text" id="inputSearchAddr" title="주소입력" style="width:90%;" />
		                <a href="javascript:;" class="search_icon"><img src="/map/resources/images/ui/d_bg.png"  /></a>
		                <p>아래 주소를 클릭해 주세요.</p>
		            </div>   
		            <div class="jp_list_wrap" id="jp_list_wrap">
		            	<div class="jp_list" id="jp_list">
		                	<!-- <a href="javascript:;">
		                        <p class="num">21389</p>
		                        <ul class="juso_info">
		                        	<li class="j1"><span>도로명</span>인천광역시 부평구 부평대로3 (부평동)</li>
		                            <li class="j2"><span>지&nbsp;&nbsp;번</span>인천광역시 부평구 부평동 549-39</li>
		                        </ul>
		                	</a> -->
		                </div>
		            </div>     
		        </div><!--ㅡjuso_pop-->
		        
				
		        
				<div class="province">
                    <select id = "dustSelect" onchange="_ToolBar.dustSelect()" style="width: 123px;">
					</select>
            	</div>
				
				<!-- 날씨 레이어 -->
				<div class="weather" id="weatherIcon">   
				</div>
				
				<div class="wind" id="windIcon">  
				</div>
                
                
                <div class="top_right">
                
               	 	<!-- 지도레이어 -->
	              	<ul class="map_btn">
	                	<li id="defaultMap" class="btn1" value="1"> <a href="javascript:void(0)" onclick="_CoreMap.showDefautMap()">기본지도</a></li>
	                	<li id="airMap" 	class="btn2" value="0"><a href="javascript:void(0)" onclick="_CoreMap.showAirMap()">위성지도</a></li>
	                	<li id="grayMap" 	class="btn2" value="0"><a href="javascript:void(0)" onclick="_CoreMap.showGrayMap()">백지도</a></li>
	                </ul>
	                
	                <!-- 행정구역도 -->
	                <div class="right_check">
	                    <select id="multiSelect" title="Basic example" multiple="multiple" name="example-basic" size="5">
							<option value="sido" title="시도">시도</option>
							<option value="sgg" title="시군구">시군구</option> 
							<option value="dong" title="법정동">법정동</option> 
						</select>
	            	</div>
            	</div>
            	
            	 
            	
            </div><!--map_top-->
            <div class="map" id="map" style="position: absolute; z-index: 99;">
            	<ul class="fstLabel f_left" id="legend"></ul>
            	<div id="mapNavBar"></div>
            	<div id="popupOverlay" class="ol-popup">
			      <a href="javascript:;" id="popup-closer" class="ol-popup-closer"></a>
			      <div id="popup-content"><input type="button" value="격자 해체" id="cellRemeveBtn" style="height:40px;"></div>
			    </div>
                <ul class="fstLabel f_right" id="dustLyrBtn" style="cursor:pointer; display: none;">
				</ul>
				<div id="legendArea" style="width: 950px; height: 63px; position: absolute; bottom: 5px; left: 5px; z-index: 100; padding: 10px;"></div>
				
            </div>
        </div><!--map-->
        <div id="stationInfoWindow" style="border: 1px solid #595959; overflow: hidden; display:none; background-color: #ffffff; position: absolute; width: 570px; height: 422px; z-index: 1000; right: 10px; bottom: 10px;">
				<div style="position: absolute; top:10px; right:10px; z-index: 1001; cursor:pointer;"><img src="/map/resources/images/close2.png"  style="width:20px; height:20px;" onclick="$('#stationInfoWindow').hide();"/></div>
				<span style='position: absolute; width:100%; height:10%; background:transparent; z-index:1000;'></span>
				<iframe id="stationInfoIframe" style="border: none; width:100%; height:100%; overflow:hidden; position: absolute; display: none;" src=""></iframe>
				<div id="highChart" style="display: none;">
					<div id="highChartHeader" style='width: 100%; height: 40px; background: #2a384a; z-index: 10; position: absolute;'><a style='color: #fff;font-size: 17px;font-family: notokr-bold;letter-spacing: -1px;position: absolute;top: 7px; left: 10px;'>역궤적 고도</a></div>
					<div id="highChartDiv" style=' height: 350px; padding: 40px 5px;'></div>
				</div>
				<div id="tmsLocation" style="display: none;">
					<div id="tmsLocationHeader" style='width: 100%; height: 40px; background: #2a384a; z-index: 10; position: absolute;'><a style='color: #fff;font-size: 17px;font-family: notokr-bold;letter-spacing: -1px;position: absolute;top: 7px; left: 10px;'>사업장(TMS) 배출량</a></div>
					<div id="tmsLocationDiv" style=' height: 350px; padding: 40px 5px;'></div>
				</div>
		</div>
		<div class="source_pop" style="z-index:99999 !important; right: 10px; bottom: 10px; " >
        	<p class="ls_tit">레이어 출처<a href="#" class="close"><img  style="margin-bottom: 6px;"  src="/map/resources/images/ui//close.png" /></a></p>   
            <div class="ls_list_wrap" id="ls_list_wrap">
            	<div class="ls_list" id="ls_list">
                	<iframe class="lsListIframe" id="lsListIframe" style="border: none; width:100%; height:100%; overflow:hidden; position: absolute; " src=""></iframe>
                </div>
            </div>     
        </div>
			
    </div><!--container-->
</div><!--wrap-->
</body>
<script>
//행정경계구역 jqueyr ui multiSelect 
	$(function(){
	   $("#multiSelect").multiselect({
		   click: function(event,ui){
			   _CoreMap.admLayerOnOff(ui);
		   },
		   noneSelectedText: '행정경계',
		   selectedText: function (numChecked, numTotal, checkedItems) {
				//return numChecked + ' of ' + numTotal + ' checked – '+selectedText;
			}
	   });  
	});


	$(document).ready(function() {
	    var acc = $('.accordion'); 
	    
		for (var i = 0; i < acc.length; i++) {
		    $(acc[i]).on('click', function() {
		    	
		        var panel = this.nextElementSibling;
		        var isDisplay = $(panel).css('display');
		        
		        $(panel).css('display', isDisplay == 'block' ? 'none':'block');
		        
		        if(isDisplay == 'block'){
		        	$(this).find('img').prop('src', '/map/resources/images/ui/left_menu_open.png');
		        }else{
		        	$(this).find('img').prop('src', '/map/resources/images/ui/left_menu_close.png');
		        }
		    });
		}
		
		$("#stationInfoWindow").draggable({ containment: ".container",handle: "span" });
		
		_CoreMap.init('map');
		
		_ToolBar.init();
		_ThemathicLayer.init();
		
		_SmellMapBiz.init();
		
		//도로명 클릭 이벤트
		$('.juso').click(function(){
			wrapWindowByMask()
	    });
		
		$('.search_icon').click(function(){
			_JusoPopup.makeOption(true);
		})
		
		$("#jp_list").scroll( function() { 
			var elem = $("#jp_list");
			if ( Math.floor(elem[0].scrollHeight - elem.scrollTop()) == Math.floor(elem.outerHeight())) { 
				_JusoPopup.makeOption(false);
			} 
		});
		
		$('.jp_tit .close').click(function(){
			$('.juso_pop').hide();  
		}) 
		
		// 레이어 출처 팝업
		$('.layer_source').click(function(){
			$('.lsListIframe').prop('src', window.location.origin+'/map/layerSource');
			layerSoureWindow();
	    });
		
		$('.ls_tit .close').click(function(){
			$('.source_pop').hide();  
		}) 
		
		
		
		//$('#sggSelect').find('option:contains(중구)').hide();
		
		//$('#dusuToolbar');
		var leftCollapseFlag = true;
		
		$('#leftCollapseBtn').on('click', function(){
			var mapWidth = $('#mapBoxDiv').width();
			
			if(leftCollapseFlag){
				$('#leftMenuDiv').css('width', '0px');
				$('#mapBoxDiv').css('left', '0px');
				leftCollapseFlag = false;
				$(this).prop('/map/resources/images/ui/left_close.png');
			}else{
				$('#leftMenuDiv').css('width', '340px');
				$('#mapBoxDiv').css('left', '340px')
				leftCollapseFlag = true;
				$(this).prop('/map/resources/images/ui/left_close.png');
			}
			
			$(this).parent().toggleClass('leftClose');
			
			$(window).trigger('resize');
			
		});
		
		$(window).on('resize', function(){
			var ww = $(window).width();
			var wh = $(window).height();
			
			var map = _CoreMap.getMap();
			
			if(!leftCollapseFlag){
				$('#map').width(ww);
				$('#map').height(wh-92);
				$('#leftMenuDiv').height(wh-50);
				if(map){
					map.setSize([ww, wh-92]);	
				}
			}else{
				$('#map').width(ww-340);
				$('#map').height(wh-92);
				$('#leftMenuDiv').height(wh-50); 
				if(map){
					map.setSize([ww-340, wh-92]);
				}
			}
		});
		$(window).trigger('resize');
	});
	
	function wrapWindowByMask(){
        // 화면의 높이와 너비를 변수로 만듭니다.
        /* var maskHeight = $(document).height();
        var maskWidth = $(window).width();
 
        // 레이어 팝업을 가운데로 띄우기 위해 화면의 높이와 너비의 가운데 값과 스크롤 값을 더하여 변수로 만듭니다.
        var left = ( $(window).scrollLeft() + ( $(window).width() - $('.juso_pop').width()) / 2 - 300 );
        var top = ( $(window).scrollTop() + ( $(window).height() - $('.juso_pop').height()) / 2 - 300 );
 
        // css 스타일을 변경합니다.
        $('.juso_pop').css({'left':left,'top':top, 'position':'absolute'}); */
 
        // 레이어 팝업을 띄웁니다.
        $('.juso_pop').show();
    }
	
	//출처 팝업
	function layerSoureWindow(){
		$('.source_pop').show();
	}
    </script>