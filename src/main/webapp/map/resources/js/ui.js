var _ui = (function () {
    var init = function () {
        setEvent();
    };
    var setEvent = function () {
        $('.accordion').on('click', function () {
            var me = this;
            var isDisplay = 'block';
            for (var i = 0; i < $('.accordion').length; i++) {
                if ($($('#tab').find('.on')[0]).attr('tabType') == $($('.accordion')[i]).parent().parent()[0].id) {
                	if($($('.accordion')[i]).text() == $(me).text()){
                		if($($('.accordion')[i]).attr('class').indexOf('ov') > -1){
                			isDisplay = 'none';
                    		$($('.accordion')[i]).removeClass('ov');
                		}else{
                			isDisplay = 'block';
                			$($('.accordion')[i]).addClass('ov');
                		}
                	}else{
                		isDisplay = 'none';
                		$($('.accordion')[i]).removeClass('ov');
                	}
                    $($('.accordion')[i].nextElementSibling).css('display', isDisplay);
                }

            }
        });

        $('#tab').find('li').on('click', function () {
        	
        	if($('#tab').attr('value') == 'off'){
        		return;
        	}
        	
            var me = $(this);
            var value = me.attr('tabType');
            for (var i = 0; i < me.parent().find('li').length; i++) {
                if ($(me.parent().find('li')[i]).attr('tabType') == value) {
                    $('#' + $(me.parent().find('li')[i]).attr('tabType')).show();
                    $($(me.parent()).find('li')[i]).addClass('on');
                } else {
                    $('#' + $(me.parent().find('li')[i]).attr('tabType')).hide();
                    $($(me.parent()).find('li')[i]).removeClass('on');
                }
            }

        });

        $('#mapMenu').find('a').on('click', function () {
            var me = $(this);
            for (var i = 0; i < me.parent().find('a').length; i++) {
                me.attr('id') == me.parent().find('a')[i].id ? $(me.parent().find('a')[i]).addClass('on') : $(me.parent().find('a')[i]).removeClass('on');
            }
//            _map.getMap().eachLayer(function (layer) {
//                layer.setUrl(_map.getTileMapUrl(me.attr('id')));
//            })
        });

		$('#defaultMaps, #airMaps, #grayMaps').on('click',function(){
			$('#map_type').find('li').removeClass('on');
			$(this).addClass('on');
			_CoreMap.changeBaseMap($(this).attr('id'));
		});
		
		
		//팝업, 툴팁 닫기
		$(".pop_close").click(function () {
			$(this).parent().parent().fadeOut();
		});
		
		/*주제도2dep떠라떠라*/
		$("#around_info> li").click(function (event) {
			var eleNm = event.target.tagName.toLowerCase();
			if(eleNm == "span"){
				if($(this).attr('class') == "active"){
					$('.ar_detail').hide();
					$("#around_info> li").removeClass("active");
				}else{
					$(this).find('.ar_detail').show();
					$(this).siblings().find('.ar_detail').hide();
					$("#around_info> li").removeClass("active");
					$(this).addClass("active");
				}
			}
		});
		
		var ww = $(window).width();
		$('#gridArea').css('width', ww - 360);
    };

    return {
        init: init
    };
})();
