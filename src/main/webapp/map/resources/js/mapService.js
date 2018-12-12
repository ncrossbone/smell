var _MapServiceInfo = {
	params    : "/geoserver/CE-TECH/ows?&service=WFS&version=1.0.0&request=GetFeature&outputFormat=application%2Fjson",
	type : "&typeName=CE-TECH",
	property : "&PROPERTYNAME=",
	sort : "&SORTBY=",
	serviceUrl: 'http://27.101.139.181:8088'
}
 
//test
//var _proxyUrl = 'http://112.218.1.243:44002';

//real
var _proxyUrl = 'http://27.101.139.181:8088';

var _MapService = function () {
	
	var getWfs = function(typeName, propertyName, cqlFilter, sortby){
		
		var url = _proxyUrl + _MapServiceInfo.params + _MapServiceInfo.type + typeName + _MapServiceInfo.property + propertyName + "&urlType=geoServer";
		
		if(cqlFilter != undefined){
			url += "&CQL_FILTER="+cqlFilter;
		}
		if(sortby){
			url += _MapServiceInfo.sort+sortby;
		}
		/*$.ajaxPrefilter('json', function(options, orig, jqXHR) {
		    return 'jsonp'
		});*/
		
		return $.ajax({
			            url : url,
			            type : 'GET',
			            async: true,
			            contentType : 'application/json',
			            fauls: function(e){
			            	console.info(e)
			            }
			    	});
	};
	
	var getRealPointWfs = function(typeName, propertyName, cneterPoint){
		//var url = proxyUrl + _MapServiceInfo.serviceUrl + _MapServiceInfo.params + _MapServiceInfo.type + typeName
		var url = _proxyUrl + _MapServiceInfo.params + _MapServiceInfo.type + typeName 
			+ "&bbox="+cneterPoint[0]+","+cneterPoint[1]+","+cneterPoint[0]+","+cneterPoint[1] + "&urlType=geoServer";
		
		
		return $.ajax({
			            url : url,
			            type : 'GET',
			            async: true,
			            contentType : 'application/json',
			            fauls: function(e){
			            	console.info(e)
			            }
			    	});
	};
	
	
    // public functions
    return {
    	  
        init: function () {
        	var me = this;
        	return me;
        },
		
		getWfs: function(typeName, propertyName,cqlFilter, sortBy){
			var respose = getWfs(typeName, propertyName,cqlFilter,sortBy);
			return respose;
		},
		
		getRealPointWfs: function(typeName, propertyName,cneterPoint){
			var respose = getRealPointWfs(typeName, propertyName,cneterPoint);
			return respose;
		}
    }; 
  
}();
