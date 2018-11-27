var _ChartMode = function () {
	var init = function(){
		if($('#tabOpeners').attr('class').indexOf('on') > -1){
			$('#tabOpeners').trigger('click');
		}
		
		if(!$('#airMaps').attr('class')){
			$('#airMaps').trigger('click');
		}
		
		_WestCondition.checkSearchCondition('environmentCorporation',true);
	};
	
	return {
        init: init
    };
}