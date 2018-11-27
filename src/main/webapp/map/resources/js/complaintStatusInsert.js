var _ComplaintStatusInsert = function () {
	var currentDate = {};
	
	var complaintStatusMode = 0; // 0 = 민원접수 선택 , 1 = 민원등록및 위치확인, 2 = 인근민원 확인, 3 = 악취분포 확인, 4 = 악취원점 분석, 5 = 악취 저감 조치
	
	var complaintStatusRegPopup , complaintStatusPopup;
	
	var init = function(){
		complaintStatusRegPopup = $('#complaintStatusRegPopup');
		complaintStatusPopup = $('#complaintStatusPopup');
		
		setEvent();
	};
	var setEvent = function(){
		Object.defineProperty(currentDate, 'date', {
			set: function(date) {
		    	this._date = date;
		    	_MapEventBus.trigger(_MapEvents.setCurrentDate, currentDate);
		    }
		});
		Object.defineProperty(currentDate, 'time', {
			set: function(time) {
		    	this._time = time;
		    	_MapEventBus.trigger(_MapEvents.setCurrentDate, currentDate);
		    }
		});
		
		$('#workStep1').on('click', function(){
			complaintStatusPopup.show();
		});
	}
	
	var changeMode = function(mode){
		
		complaintStatusMode = mode;
		
	}
	
	return {
		init: function(){
			init();
		}, 
		setCurrentDate: function(date, time){
			if(date){
				currentDate.date = date;	
			} 
			if(time){
				currentDate.time = time;	
			}
		},
		setMode: function(mode){
			if(mode){
				complaintStatus.mode = mode;	
			}
		},
		setPopupMassge: function(msg){
			
		}
    };
}();