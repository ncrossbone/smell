var _MapEvents = {};

_MapEvents.map_loaded = 'map_loaded';   // 지도가 로딩된 후 호출됨
_MapEvents.map_moveend = 'map_moveend';   // 지도 이동후
_MapEvents.map_singleclick = 'map_singleclick';   // 지도 클릭
_MapEvents.change_layerGroup = 'change_layerGroup';
_MapEvents.change_size = 'change_size';
_MapEvents.change_target = 'change_target';
_MapEvents.change_view = 'change_view';
_MapEvents.map_clicked = 'map_clicked';
_MapEvents.map_dblclick = 'map_dblclick';

_MapEvents.map_addLayer = 'map_addLayer';
_MapEvents.map_removeLayer = 'map_removeLayer';

_MapEvents.map_pointermove = 'map_pointermove';
_MapEvents.map_mousemove = 'map_mousemove';


_MapEvents.onresizeall_end = 'onresizeall_end';

_MapEvents.setZoom = 'setzoom';

_MapEvents.clickLayerOnOff = 'clickLayerOnOff';

_MapEvents.addWriteLayerForUseGeoserver = 'addWriteLayerForUseGeoserver';

_MapEvents.init = 'init';

_MapEvents.complaintStatusMode = 'complaintStatusMode';
_MapEvents.chartMode = 'chartMode';
_MapEvents.getChartData = 'getChartData';
_MapEvents.getChartFeature = 'getChartFeature';
_MapEvents.writeChart = 'writeChart';

_MapEvents.setCurrentDate = 'setCurrentDate';

var _MapEventBus = $({});

// sample 
/*
_MapEventBus.on(_MapEvents.map_loaded, function(event, data){
	console.log('map_loaded', event, data);
});

_MapEventBus.trigger(_MapEvents.map_loaded, {result:'sampleData'});

*/
