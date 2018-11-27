var _ChartMode = function () {
	
	var setEvent = function(){
		
		_MapEventBus.on(_MapEvents.chartMode, function(){
			if($('#tabOpeners').attr('class').indexOf('on') > -1){
				$('#tabOpeners').trigger('click');
			}
			
			if(!$('#airMaps').attr('class')){
				$('#airMaps').trigger('click');
			}
			
			_WestCondition.checkSearchCondition('environmentCorporation',true);
		});
	};
	
	setEvent();
	
	return {
    };
}();