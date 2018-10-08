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
                		isDisplay = 'block';
                		$($('.accordion')[i]).addClass('ov');
                	}else{
                		isDisplay = 'none';
                		$($('.accordion')[i]).removeClass('ov');
                	}
                    $($('.accordion')[i].nextElementSibling).css('display', isDisplay);
                }

            }
        });

        $('#smellMenu').find('a').on('click', function () {
            var me = $(this);
            var value = me.attr('value');
            for (var i = 0; i < me.parent().find('a').length; i++) {
                if ($(me.parent().find('a')[i]).attr('value') == value) {
                    $('#' + $(me.parent().find('a')[i]).attr('value')).show();
                    $($(me.parent()).find('a')[i]).addClass('on');
                } else {
                    $('#' + $(me.parent().find('a')[i]).attr('value')).hide();
                    $($(me.parent()).find('a')[i]).removeClass('on');
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
    };

    return {
        init: init
    };
})();
