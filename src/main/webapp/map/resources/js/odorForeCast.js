var _OdorForeCast = function () {
	
	var forecastProcess;
	var deviceManagePopup;
	var init = function(){
		forecastProcess = $('#forecastProcess');
		deviceManagePopup = $('#deviceManagePopup');
		
		setEvent();
	};
	var setEvent = function(){
		
		_MapEventBus.on(_MapEvents.task_mode_changed, function(event, data){
			if(data.mode == 3){
				forecastProcess.show();
				deviceManagePopup.show();
			}else{
				reset();
			}
		});
	};
	
	var reset = function(){
		forecastProcess.hide();
	};
	
	
	var setProcMsg = function(msg){
	};
	
	return {
		init: function(){
			init();
		},
		setProcMsg: function(msg){
			setProcMsg(msg);
		}
    };
}();