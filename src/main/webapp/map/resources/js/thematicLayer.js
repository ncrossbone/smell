var _ThemathicLayer = function() {
	var layerObj = {};
	var instLevel = 0;
	layerObj['layer1'] = {title:'날씨',layerArr:['SD_WEATHER_20','SGG_WEATHER_20'],isVisible:false,isTiled:false,btnVisible:true,groupId:'weather',styleId:'weather',toggleId:['layer30'],valueText:'TMPRT'};
	
	layerObj['layer2'] = {title:'시도 차량대수',unit:'대',circleColor:'#7ddc1e',circleSize:40,layerArr:['VHC_RGS_SI','VHC_RGS_SG'],isVisible:false,valueText:'TOTAL',isTiled:false,toggleId:['layer3'],btnVisible:true,groupId:'car',styleId:'circle'};
	layerObj['layer3'] = {title:'면적당 차량대수',unit:'대',circleColor:'#f1d306',circleSize:40,layerArr:['VHC_RGS_POP_SI','VHC_RGS_POP_SG'],isVisible:false,valueText:'DENSITY',isTiled:false,toggleId:['layer2'],btnVisible:true,groupId:'car',styleId:'circle'};
	
//	layerObj['layer4'] = {title:'어린이집',layerNm:'DYCR_FCLT_NAMIS',isVisible:false,isTiled:true,cql:null,opacity:1,btnVisible:true,groupId:'study'};
//	layerObj['layer5'] = {title:'유치원',layerNm:'KNDR_FCLT',isVisible:false,isTiled:true,cql:null,opacity:1,btnVisible:true,groupId:'study'};
	layerObj['layer6'] = {title:'초등학교',layerNm:'GIS_ELMN_SCHL_FCLT',isVisible:false,isTiled:true,cql:null,opacity:1,btnVisible:true,groupId:'study'};
	layerObj['layer7'] = {title:'중학교',layerNm:'GIS_MDL_SCHL_FCLT',isVisible:false,isTiled:true,cql:null,opacity:1,btnVisible:true,groupId:'study'};
	layerObj['layer8'] = {title:'고등학교',layerNm:'GIS_HIGH_SCHL_FCLT',isVisible:false,isTiled:true,cql:null,opacity:1,btnVisible:true,groupId:'study'};
	
	//layerObj['layer9'] = {title:'대기측정소',layerNm:'GIS_NAMIS_OBS',isVisible:false,isTiled:true,cql:null,opacity:1,btnVisible:true,groupId:'obs',searchWfS:true};
	
	layerObj['layer12'] = {title:'사업장(TMS) 배출량',layerArr:['GIS_TMS_FCLT'],isVisible:false,isTiled:false,cql:null,opacity:1,btnVisible:true,groupId:'tms',styleId:'tmsLocation'};
	
	layerObj['layer13_1'] = {title:'전체',unit:'명',circleColor:'#2499fd',circleSize:40,layerArr:['GIS_POP_RGS_SI','GIS_POP_RGS_SG'],isVisible:false,isTiled:false,valueText:'TOTAL',btnVisible:false,groupId:'rgs',styleId:'circle',layerIdx:0,toggleId:['layer13_2','layer13_3','layer13_4','layer13_5','layer13_6','layer13_7','layer13_8']};
	layerObj['layer13_2'] = {title:'10대 이하',unit:'명',circleColor:'#2499fd',circleSize:40,layerArr:['GIS_POP_RGS_SI','GIS_POP_RGS_SG'],isVisible:false,isTiled:false,valueText:'U10',btnVisible:false,groupId:'rgs',styleId:'circle',layerIdx:0,toggleId:['layer13_1','layer13_3','layer13_4','layer13_5','layer13_6','layer13_7','layer13_8']};
	layerObj['layer13_3'] = {title:'10대',unit:'명',circleColor:'#2499fd',circleSize:40,layerArr:['GIS_POP_RGS_SI','GIS_POP_RGS_SG'],isVisible:false,isTiled:false,valueText:'F10',btnVisible:false,groupId:'rgs',styleId:'circle',layerIdx:0,toggleId:['layer13_1','layer13_2','layer13_4','layer13_5','layer13_6','layer13_7','layer13_8']};
	layerObj['layer13_4'] = {title:'20대',unit:'명',circleColor:'#2499fd',circleSize:40,layerArr:['GIS_POP_RGS_SI','GIS_POP_RGS_SG'],isVisible:false,isTiled:false,valueText:'F20',btnVisible:false,groupId:'rgs',styleId:'circle',layerIdx:0,toggleId:['layer13_1','layer13_2','layer13_3','layer13_5','layer13_6','layer13_7','layer13_8']};
	layerObj['layer13_5'] = {title:'30대',unit:'명',circleColor:'#2499fd',circleSize:40,layerArr:['GIS_POP_RGS_SI','GIS_POP_RGS_SG'],isVisible:false,isTiled:false,valueText:'F30',btnVisible:false,groupId:'rgs',styleId:'circle',layerIdx:0,toggleId:['layer13_1','layer13_2','layer13_3','layer13_4','layer13_6','layer13_7','layer13_8']};
	layerObj['layer13_6'] = {title:'40대',unit:'명',circleColor:'#2499fd',circleSize:40,layerArr:['GIS_POP_RGS_SI','GIS_POP_RGS_SG'],isVisible:false,isTiled:false,valueText:'F40',btnVisible:false,groupId:'rgs',styleId:'circle',layerIdx:0,toggleId:['layer13_1','layer13_2','layer13_3','layer13_4','layer13_5','layer13_7','layer13_8']};
	layerObj['layer13_7'] = {title:'50대',unit:'명',circleColor:'#2499fd',circleSize:40,layerArr:['GIS_POP_RGS_SI','GIS_POP_RGS_SG'],isVisible:false,isTiled:false,valueText:'F50',btnVisible:false,groupId:'rgs',styleId:'circle',layerIdx:0,toggleId:['layer13_1','layer13_2','layer13_3','layer13_4','layer13_5','layer13_6','layer13_8']};
	layerObj['layer13_8'] = {title:'60대',unit:'명',circleColor:'#2499fd',circleSize:40,layerArr:['GIS_POP_RGS_SI','GIS_POP_RGS_SG'],isVisible:false,isTiled:false,valueText:'F60',btnVisible:false,groupId:'rgs',styleId:'circle',layerIdx:0,toggleId:['layer13_1','layer13_2','layer13_3','layer13_4','layer13_5','layer13_6','layer13_7']};

//	layerObj['layer19'] = {title:'에너지산업 연소',layerArr:['GIS_ENR_IND'],isVisible:false,isTiled:false,btnVisible:false,groupId:'tms',styleId:'tms',toggleId:['layer20','layer21','layer22','layer23','layer24','layer25','layer26','layer27','layer28','layer29']};
//	layerObj['layer20'] = {title:'비산업 연소',layerArr:['GIS_NOT_IND'],isVisible:false,isTiled:false,btnVisible:false,groupId:'tms',styleId:'tms',toggleId:['layer19','layer21','layer22','layer23','layer24','layer25','layer26','layer27','layer28','layer29']};
//	layerObj['layer21'] = {title:'제조업 연소',layerArr:['GIS_MNF_IND'],isVisible:false,isTiled:false,btnVisible:false,groupId:'tms',styleId:'tms',toggleId:['layer19','layer20','layer22','layer23','layer24','layer25','layer26','layer27','layer28','layer29']};
//	layerObj['layer22'] = {title:'생산공정',layerArr:['GIS_PRD_IND'],isVisible:false,isTiled:false,btnVisible:false,groupId:'tms',styleId:'tms',toggleId:['layer19','layer20','layer21','layer23','layer24','layer25','layer26','layer27','layer28','layer29']};
//	layerObj['layer23'] = {title:'에너지수송 및 저장',layerArr:['GIS_ENR_TRN'],isVisible:false,isTiled:false,btnVisible:false,groupId:'tms',styleId:'tms',toggleId:['layer19','layer20','layer21','layer22','layer24','layer25','layer26','layer27','layer28','layer29']};
//	layerObj['layer24'] = {title:'유기용제 사용',layerArr:['GIS_MTR_PRD'],isVisible:false,isTiled:false,btnVisible:false,groupId:'tms',styleId:'tms',toggleId:['layer19','layer20','layer21','layer22','layer23','layer25','layer26','layer27','layer28','layer29']};
//	layerObj['layer25'] = {title:'도로이동오염원',layerArr:['GIS_RD_TRN'],isVisible:false,isTiled:false,btnVisible:false,groupId:'tms',styleId:'tms',toggleId:['layer19','layer20','layer21','layer22','layer23','layer24','layer26','layer27','layer28','layer29']};
//	layerObj['layer26'] = {title:'비도로이동오염원',layerArr:['GIS_DRD_TRN'],isVisible:false,isTiled:false,btnVisible:false,groupId:'tms',styleId:'tms',toggleId:['layer19','layer20','layer21','layer22','layer23','layer24','layer25','layer27','layer28','layer29']};
//	layerObj['layer27'] = {title:'폐기물처리',layerArr:['GIS_WST_IND'],isVisible:false,isTiled:false,btnVisible:false,groupId:'tms',styleId:'tms',toggleId:['layer19','layer20','layer21','layer22','layer23','layer24','layer25','layer26','layer28','layer29']};
//	layerObj['layer28'] = {title:'농업',layerArr:['GIS_FRM_IND'],isVisible:false,isTiled:false,btnVisible:false,groupId:'tms',styleId:'tms',toggleId:['layer19','layer20','layer21','layer22','layer23','layer24','layer25','layer26','layer27','layer29']};
//	layerObj['layer29'] = {title:'기타 면오염원',layerArr:['GIS_ETC_IND'],isVisible:false,isTiled:false,btnVisible:false,groupId:'tms',styleId:'tms',toggleId:['layer19','layer20','layer21','layer22','layer23','layer24','layer25','layer26','layer27','layer28']};
	
	layerObj['layer30'] = {title:'풍향',layerArr:['SD_WEATHER_20','SGG_WEATHER_20'],isVisible:false,isTiled:false,btnVisible:true,groupId:'weather',styleId:'weather',toggleId:['layer1'],valueText:'WS'};
	
	layerObj['layer31_1'] = {title:'전체',unit:'명',circleColor:'#f92927',circleSize:40,layerArr:['GIS_POP_RGS_AREA_SI','GIS_POP_RGS_AREA_SG'],isVisible:false,isTiled:false,valueText:'DENSITY',btnVisible:false,groupId:'rgs',styleId:'circle',layerIdx:1,toggleId:['layer31_2','layer31_3','layer31_4','layer31_5','layer31_6','layer31_7','layer31_8']};
	layerObj['layer31_2'] = {title:'10대 이하',unit:'명',circleColor:'#f92927',circleSize:40,layerArr:['GIS_POP_RGS_AREA_SI','GIS_POP_RGS_AREA_SG'],isVisible:false,isTiled:false,valueText:'DENSITY_U1',btnVisible:false,groupId:'rgs',styleId:'circle',layerIdx:1,toggleId:['layer31_1','layer31_3','layer31_4','layer31_5','layer31_6','layer31_7','layer31_8']};
	layerObj['layer31_3'] = {title:'10대',unit:'명',circleColor:'#f92927',circleSize:40,layerArr:['GIS_POP_RGS_AREA_SI','GIS_POP_RGS_AREA_SG'],isVisible:false,isTiled:false,valueText:'DENSITY_F1',btnVisible:false,groupId:'rgs',styleId:'circle',layerIdx:1,toggleId:['layer31_1','layer31_2','layer31_4','layer31_5','layer31_6','layer31_7','layer31_8']};
	layerObj['layer31_4'] = {title:'20대',unit:'명',circleColor:'#f92927',circleSize:40,layerArr:['GIS_POP_RGS_AREA_SI','GIS_POP_RGS_AREA_SG'],isVisible:false,isTiled:false,valueText:'DENSITY_F2',btnVisible:false,groupId:'rgs',styleId:'circle',layerIdx:1,toggleId:['layer31_1','layer31_2','layer31_3','layer31_5','layer31_6','layer31_7','layer31_8']};
	layerObj['layer31_5'] = {title:'30대',unit:'명',circleColor:'#f92927',circleSize:40,layerArr:['GIS_POP_RGS_AREA_SI','GIS_POP_RGS_AREA_SG'],isVisible:false,isTiled:false,valueText:'DENSITY_F3',btnVisible:false,groupId:'rgs',styleId:'circle',layerIdx:1,toggleId:['layer31_1','layer31_2','layer31_3','layer31_4','layer31_6','layer31_7','layer31_8']};
	layerObj['layer31_6'] = {title:'40대',unit:'명',circleColor:'#f92927',circleSize:40,layerArr:['GIS_POP_RGS_AREA_SI','GIS_POP_RGS_AREA_SG'],isVisible:false,isTiled:false,valueText:'DENSITY_F4',btnVisible:false,groupId:'rgs',styleId:'circle',layerIdx:1,toggleId:['layer31_1','layer31_2','layer31_3','layer31_4','layer31_5','layer31_7','layer31_8']};
	layerObj['layer31_7'] = {title:'50대',unit:'명',circleColor:'#f92927',circleSize:40,layerArr:['GIS_POP_RGS_AREA_SI','GIS_POP_RGS_AREA_SG'],isVisible:false,isTiled:false,valueText:'DENSITY_F5',btnVisible:false,groupId:'rgs',styleId:'circle',layerIdx:1,toggleId:['layer31_1','layer31_2','layer31_3','layer31_4','layer31_5','layer31_6','layer31_8']};
	layerObj['layer31_8'] = {title:'60대',unit:'명',circleColor:'#f92927',circleSize:40,layerArr:['GIS_POP_RGS_AREA_SI','GIS_POP_RGS_AREA_SG'],isVisible:false,isTiled:false,valueText:'DENSITY_F6',btnVisible:false,groupId:'rgs',styleId:'circle',layerIdx:1,toggleId:['layer31_1','layer31_2','layer31_3','layer31_4','layer31_5','layer31_6','layer31_7']};
	
	layerObj['layer37'] = {title:'노인복지시설',layerNm:'LT_P_MGPRTFB',isVisible:false,isTiled:true,cql:null,opacity:1,btnVisible:true,groupId:'study',layerType:'vworld'};
	
	layerObj['layer38'] = {title:'광화학<br/>오염물질<br/>측정망',layerNm:'GIS_CHM_PLT_OBS',isVisible:false,isTiled:true,cql:null,opacity:1,btnVisible:true,groupId:'obs'};
	layerObj['layer39'] = {title:'대기오염<br/>집중<br/>측정소',layerNm:'GIS_AIR_PLT_OBS',isVisible:false,isTiled:true,cql:null,opacity:1,btnVisible:true,groupId:'obs'};
	layerObj['layer40'] = {title:'대기<br/>중금속<br/>측정망',layerNm:'GIS_HVY_MTL_OBS',isVisible:false,isTiled:true,cql:null,opacity:1,btnVisible:true,groupId:'obs'};
	layerObj['layer41'] = {title:'산성<br/>강하물<br/>측정망',layerNm:'GIS_PH_OBS',isVisible:false,isTiled:true,cql:null,opacity:1,btnVisible:true,groupId:'obs'};
	layerObj['layer42'] = {title:'유해<br/>대기물질<br/>측정망',layerNm:'GIS_HZR_SBS_OBS',isVisible:false,isTiled:true,cql:null,opacity:1,btnVisible:true,groupId:'obs'};
	layerObj['layer43'] = {title:'종합대기<br/>측정소',layerNm:'GIS_CMP_WTN_OBS',isVisible:false,isTiled:true,cql:null,opacity:1,btnVisible:true,groupId:'obs'};
	layerObj['layer44'] = {title:'PM<sub>2.5</sub>성분<br/>측정소',layerNm:'GIS_PM25_OBS',isVisible:false,isTiled:true,cql:null,opacity:1,btnVisible:true,groupId:'obs'};
	layerObj['layer10'] = {title:'황사측정소',layerNm:'GIS_YLW_OBS',isVisible:false,isTiled:true,cql:null,opacity:1,btnVisible:true,groupId:'obs'};
	layerObj['layer11'] = {title:'AWS 측정소',layerNm:'GIS_AWS_OBS',isVisible:false,isTiled:true,cql:null,opacity:1,btnVisible:true,groupId:'obs'};
	
	layerObj['layer1'].legend = {
			'01':{title:'맑음',base64:'iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJ bWFnZVJlYWR5ccllPAAABaJJREFUeNrkV0uIHFUUvffVvz8zPZ2ZzBgGiRNNRETIwg9m4SLBaBBX Ci7cmIUiZCUIQQnEhIDxQxDJyk0gflAQERHBICgEIbgQg0gCMYv8xvxnerqrq+vzrudV9fxr2uyy sJlHV3W9uveee8+57w6LCN2Nj6K79LHnL/T3TSJmhOLgbkkWTEbcKkkwRqysYk/aJerO7DevUdA4 QHaA381dRtS5TpR0cF+OSe2cHoDYGM+XMmsjfrlvSSRMbAXkDe0mH4vtSh7cYrBb8c6D2FPYyF3w 2ogX0BkDbp0oS4EsIrK87WS5L+PZITy7DCPPaTewmYINhVXeB6Tncf0Nk96F/Xuw9wjp5AwhpjwA kwHJBjgu4OLPI6k18K2Jk2waLz8pjnuUguFzWLvYq0VAWkDJ4r0St1OJWk+raG4He0MJOcH5PO2W CwC9wnGeER7k2NQqJak0SKrDxK1bwsq5yo3Jzap2z2by6sik6xdpzDeTJF1bopkX9NwVota1s6y1 iHKJDReS8I5YPYTIJkx0bFKT9rZRZXg/jT80oUY2IREIxASeAkXcLVYSIwaHVGWMrHUPEI1OTaIU byPV95ugYKuKtQWrvpS0i4jFbOIRpPUAKbtJcXySKiPPqvrkY8obQcpiOOmurQ9kgFFPqzpezUSe l9nLbY6is6SsHVDKLyTq3fJUI4X4XMOms6jNIbG8ncprWqwCQg2piJ7X8CpL+KHAryHKquGLkkQW W36XVPghpWkHgEocI1X4dIH8A3H8Sa41X1eWj3SGy3W94IiXEzJfhSpACmKn6mR+nVTSO8jBuu9A RqL25RLHIEP+os6myPEnyIbTNO6XoIz5Vl8ieEeSYh9qXTQOC2lnJM/XZHubKLXG8T1dLqfWBei3 RuQPKzi+F8xEEGVoVcH67DYCm4E/aF3SxSzAOdtDxO56IycljreFk9Cjzi3wJClxrBODdr0w7xTL brK5z2SFY4ajFmoO2WThkkfLg5MYTnpXUb4p04LRyeggIj2OJ6fweHaFnNQryM8fWO+h82zMJWN0 aLpXfp2QRNMknXOo+1xfKfOLVyyF7IdYxoeRkXoJ+77GzWtlDeQEEI3C4Ku5Yx3bRqMLPTsDs2M0 sdyj6rOcBrDc8AVEs/gGbr7Ci8dg6HSZ40tw8j4M/yw6Oy6SoTZAqzjv4ZJcN53jDpxSn3RFvbH3 ErT8MVnOmXJyGY15+eHQ4CxJYT9Dqq2cvbpXrByJ/u/DFuQzRBWrmnKMNOnUpQDHbtRao2WaWur4 BGR0WNiKBP1R4g4AoMlnQGGAGMINXDqPTVxzyDgd7rU/AYDTFHeWBW0v6wHhDSOBx3EovEVuUNXB EKnoEvaDZEpWK2vlGW6OVSOZoEE6mCAV94YhtY+oe7sD5z+B4dlqxOYlBotEHgbymxx1vmWndlFX m8XZnPQK1Lm+SxZYb/aIE5BuTGkcHL9yNPc5VAHtyVMoZVBeY1nQxZe4+BSR97jb2SPB6D5YGVOt K0y9sEgXL5kqpF93jEVSaZKMwKlVPcfh7Dt4+COEj/NV0PAlGTQImFS0c6Nm9tLZZ6oXjuhg7A3t 1huMUrAhSI4+LhhveSBSUDitjOId1eLOrWMg5SkBYXFmzcDmzODRZ75WpmtFN00lbgPdaZV0ffHr qdQ2XKDq+JSYFmlqqVQeIGPSABlPchQ+wnHbR6n+ghxnc81rXTra2auav2FQBv0m/f6rnM1g+kXW 6RG2/Qtku9vF9kK27L3mpMBcfpi7YYjB4QtkYhslc29i3BlnHRf28qNw9ZHK8wO9/mH9igAWir8V M5RLfvOUqSMsVVACo7O/se0qKe8J5DsD+jSfs7rXH8XA0EXm/lzWyfqKUM/8U0ausqYvvy/Gko+9 Yd6Zeu2juD5Pvt0rUC0E+1t/mhnYY/h/9y/MXXP8rwADAAKBrKV9mru1AAAAAElFTkSuQmCC'},
			'02':{title:'맑음(밤)',base64:'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'},
			'03':{title:'구름조금',base64:'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'},
			'04':{title:'구름조금(밤)',base64:'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 QmCC'},
			'05':{title:'구름많음',base64:'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 m0zpAAAAAElFTkSuQmCC'},
			'06':{title:'구름많음(밤)',base64:'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 0qB3GUdNuwAAAABJRU5ErkJggg=='},
			'07':{title:'흐림',base64:'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 +wb8lwADAL6c/9V/2d6gAAAAAElFTkSuQmCC'},
			'08':{title:'소나기',base64:'iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJ bWFnZVJlYWR5ccllPAAABARJREFUeNrkV8+LHEUU/qq7OjMTsrMrJhhCQBRhBMOCBPbqiooHQRGD iqB/gSBR8Ophr4omIXpQlxyWgCGCHtyLIgjJQRIieIg/wE12Y7Lj7mSnZ3qmf/e0X3X1ZrKbTE8b Anuw4DVFV/V89b33vfdqRJqm2IlhYIfG/w9YfvRLJ5u89+TknauXzgzn6QCwqiZq9ZdgWkcR9Bvo rgKtK3+gvfwx7OvfIuwnEObwm6PnRgO7cYG4xLZJiqdg7f4Ae/ZOw+uCQMCu2j6C1ZGmNoT4cfjN GMZFuLD/zgG5ScpHUT84h+rkNOr7GSQJOP/wfRUw5TSScA7O+lUMkqUy4NLp+aNXk2jTz2QXzyLq z8CzeSBKI3A04zighdwbziAJZrl3Cel4ZFmtWKNXnfUhY8No0JUShqmZJgTsrgH9mzxE5naJJG6U drWUBcJuXyWgpRkLw0XsARHNrBA4Brw2MoF1moDvqAO63FcOeGJXwUZJ0PYKUJ2gO6PzcNs2ehtT sCwNrNztrGnmg9CmV86XTqd4UKCuxvPAnz8AS/w9azdzI11AZ/VtWGQ8iDX7sKdjLIwFfnEu804J f0s3KgA2yezQi8D+Q8Dyzz5+/WaOv0k041VUJh5mzNUBliErZ2CaHxLcL1uT5M22k08fuHNVKXbP PmDmTbJ/GnjihTW+ex9Bbx6XvjpAJQMPPX4DvfXf0WsxzhTZIEF2oHHA3aJ0gniOjCroNmNMHQT2 Psa49mP0NzzUJt1MVLH3IL3wbKZqFXPtaiY5eGp8PxI4dJICV8vX6e5XGN8UsqbfhfS0uwGWzhQ+ 4+u2BJLb4yo2H18XAn/52iMF/qjMM25HqNZJHmJrGVUuVaZiKtLtNZY+x3xhd6oxnWqjUkqIi6xe n2ax663rgqJYblarQZSbOsRANxKNfZJ2sTDGRdnEQhEgCr4g4MsI/Ub2LiKwKptBLy+Zqqj4upIp YOAy7fM8xvfYj1UjEOZfZPwJ7JUYXTaNblMXDRVn1aH8vj6AyulUJbc4wS+vjFV14arT1CKNvLOI 3COcPZO5VrH12MfdtjZ1gEgRFD/xcbZUHhuGwVCOyLvOah5r2SLwSQT2YZbKKcR0refoWq2ahN9R bFU/VrFtlWwSBaTtlaFak3ARobtIUb2RxTXoa9YKVLVPIRa5cbF0rS5cVSK6FW8zINAxMpxF4h9A 4Gp1Z0oWN7jj2DhBlQdu/rb1HpQmFyik02T4LgFzYQol5dO0C/fvlqnS5JZ5qiGkzNnjBL2sE1Zs ps/xvFbi/jDePnSeXqN9lrsW+fzaln1z10sB11Xi3PXEqtfe9eopTvHxVv7i1D3dq2nvqBs07buC ++32QWVh4bb5fx5ip/60/SvAAJ3L2iOTyazCAAAAAElFTkSuQmCC'},
			'09':{title:'비',base64:'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'},
			'10':{title:'가끔비',base64:'iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJ bWFnZVJlYWR5ccllPAAAB2dJREFUeNrEV2toHNcVPvfOnZmdWe1qdyVZsh6OaymOHrEl2bGaQNqQ kODiUGiLRMGkpM2PltJCWmjUQFtiKMVNk5b2T6HQtKXuG2ICxS0yoX7WGKoY1z/iVFZsSbasxz6k fczzzr23Z1a2aCB4ZVroZc/u7Oy9853Hdx5LlFLw/1jsw25OnlndvNY0Ck0JBjolEEoFCY3EMoHq DuDX7+IWRQmBqhfC8roHmbQFzbjfwP2RAqJT9SncdwH3rbw4ktl8Lt2qhrFjEHM3gh5jlPyp5IvF gi8UfkLBi2Cl4sNd36kN2ZNg5C+hhJfWQlUthx/07JaA8UgaDf92ztQu2Iw853BZ4RLOkPhHtLbm BiCEjC8BXzYq9n1TI3/Hh3+iyuXZSCo3EKqxq//TSnzQ/rRO30DA4fgeAgICX0WQuTgMvs8higSC knh/ytLgD0kGh9DTUEVz8adzMWTKoI2By1UvBgRCSa6jOfEbg8h+qSho+DQfA4fg06ZBo5W8Cxcv LUP3dgtacyYoqSZkkh2KEIRoGtS4KqOe0ymdQNbcAvBQdzPU/AhmFtcPK1vrDwMKTNdAoYVVrvCa Tq2UQjj/zirwIIL35x3gPATTIMO3iaq7PaQMQiBTukZXLI3FhrTgo4v3jHHWNsBktAstHy2Ufagh Yx2Pw0o1BDeICtWic/Pc9Ep3xKMOnco0mgr5Ygh+wN+az1cr0wsVuFV0LgshXkqZVDM08qVQqDcb WowMHUYNf8BDfnqx6EAF42glDDAwTbqzlnU1ME86dlvaTCmXi3CJBt5lz3PezhfFH5uSMPaouTRU idpOZZpyvU0G+Tmm4jOrnvh9Q+C5fLVXhMJxXPUaY/x5jOlDBqfguEkIhUhe8zNJldMhImAiBbNK ykEa+oehmv8G1ApH97StdtywshlMv+9h+nXEjMbMm2oIvFryj8/drJxyQvNoaLe1EZIEDBpwosO1 dWQwU0ApB4lkIzRmLEB7kwGt27sGqZs69rditM6k/Edn2utw8ExVUMwodakh8Huz1T2CJo65Rsdw BDYoJFecHpSKuEwBkXKDHWiSkdAASQsCy5OLxGtOYsjNvZkby4tPlxcKWMmSYNqJX9mWcbUhMKUw Jgk9YUWFN2kkOjm1D7layw5BtbqFmGZ1hrO4LGJ6rWGq+VIDB9nsoltzBoMg8wCZWboRtFXK33lw l/4j7AliKwXkjbhe4eNBVz4Ywu2hkv+uQjseV1goKFqq4SbBY+vRC+h6R1KMP4UALY/QI+WIQTW5 g0Ur19L5d1ZEusm8v5IZw0ugN01VfVnjjhJYcxVaKZFxMhAgsTrJUNQlxOtyAHDbRwXQcpqwNJ7p eNnzohGD0fuv1XHhpES9T6KwJDhAhOARxlNwsSEIeFdCX4JJ5cYxtFwks0ww84W9fZmtAVMVAVPB nV5TX7ZBAstGJ1qqLDTu1RUQdRF1cV0BfWkOH9/BsaySeqhA00HZ6ceQDl9sDMwSQBmWOY3Vra0r r6hI6rXnbL2y06bF/hRZ+kpKrVwBLJUR6ue5EgZaBYw/LOqAPNrQOYwkdPe0jnS3WD9uSC6S/9fG Kay3KtcbsyjGn48UnWdYi0fTa7C/uTSL0X/0ZL5bnl/vG/no7gRMPAJYagHyNTyCNRxf0GwqOLib McsirCGw9vYrmy6W+54HOfRpJE8ASbEO4z156LMrIBR9NVR0Tmjky08P+P88uC/ZyzQJOBNgw8DY xsRDZ+1qCWEbgtc42UI/ZuZmQ6aXf4t+XIPQ8+CJh3R4sPkAOD77HLqzl1P98MDenq4dLXYzQU4I TKe43wt8i4HjtKtVXZhfDaAm9K0PAhsjBQP67ltAfR9I/wTOUTQeCF5gSnxhTu8Iy756xvd4qx4r GbdNBK06GgJjEjIC11cxXF7Bz6Xoz7YOfHfpNhChIWvdLkrp69hjjzgqOfeun8UJpGbekjq0pSyI cwB7sCoX/duUp7ok3i8HBiwG9JSli69tNY/j4nQQxaprqLOdMzMz52dnZ0+7Tu1MCaeUootdx/Uv zq/WalcWSujSGk4vwU8hWB/L0uWTcYqxyIvT8vjcEv+gMz9srt43Mor1mn4VL4+ifAQFeQpnpJTb sLmPcd/Ls9YHYPvnfwg4FsU0POhz+TjR6M22bPKX1xdcXq1Fj60FHRdM5t9KaKXRbU1G4ezkaANW 47wUhuGzuq6fxa8FlF9wzvd7njfW29ebf3hwEFi6FZbSOlzPOzEVpg70NE9lsR4PtWlg7yLwrZPr VysIL6T/+ieHrMKLT26H7skGMX7lyBH45uTkcd/zX9OYdhGtHO7s7Hx2fGL80vjEBLS3t9f3FWoB LFU3XDjYnoyHwaxXK6cwxvbXD5D+X1+pTH92kJ5/Yneqr9liIW5buKer8d6rJ06cSM5em/0MWp7C NvjeU08+9deBwcGEZSX+jFvOxecoJZuVbaM0y0fK5fLHisVS11qp0FSp1HhLpkmkMi1eNpdbbmlp +ck9gf9HawTlbmfYeUfu/y/Mf7nmUE7f+ayvfwswAPBbypj6aj4VAAAAAElFTkSuQmCC'},
			'11':{title:'눈',base64:'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'},
			'12':{title:'소낙눈',base64:'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 YII='},
			'13':{title:'비 또는 눈',base64:'iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJ bWFnZVJlYWR5ccllPAAAAQtJREFUeNpi/P//P8NAACaGAQKjFo9aTDPAgk/yr6cWJXntAhA7Mm+/ 9oGePgZbyrLj+geyfIwEQIYcwCbxx0NTAEj1A3ECVGgDECfis5QUixnwWLofiA2gQguAFibSNHFR YinZFgMtBVl2HsnSRFIsJSuooZaCfCqAZOkCeuRjBST2ByimfQEC9B0o1TpCLQT5ej0wFBLoUnIB Lb8AtfwBVGg+0PICtCg5D8JUT9VQyw2hhQUI9AMtmg+11AGa8AxoUlZDCwmQz2GFSwLUcgGaVxIg y4EYZDksZYPiez7daidoPp4A5QpQPR/jyNsNQKqemgXIB6TaBh/gJ9WxjKPN21GLRy2mFgAIMAAs 71mjIly/LQAAAABJRU5ErkJggg=='},
			'14':{title:'가끔 비 또는 눈',base64:'iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJ bWFnZVJlYWR5ccllPAAAALRJREFUeNpi/P//P8NAACaGAQKjFo9aTDPAgsw5VCm+B0gZ0ciuc3bt L12wWgwE4kAsSCOLxXH6GAhqgFgKiP/QIGSf4bN448hKXEDAB8RsQPyPBh78BcSfcFk8H4gNgfgv lS1mBuLzQByMy2IDIFakUej+xxfUFejJnorgJT6LV4+W1fTKTqCSS41GJdctIG7BZXEiECvRyJP3 8Fm8F71MpSK4jsxhHG1ljlo8avGQtxggwAAMcx99f11SUQAAAABJRU5ErkJggg=='},
			'15':{title:'눈 또는 비',base64:'iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJ bWFnZVJlYWR5ccllPAAAAgJJREFUeNrs1j1IVWEcx/Hry61bg4RJghVqOWRKi6CI4ahBDYpdEspB 0IJyVrACW8LNRQctSAg1qCjEBhcdmqI75Faii6mgaFh2KSs7fR/4gYeHc45vxSU4D3w45z4+z/N/ 3o9pjuNEUpHSIylKYeAw8D9Lme4fT69nL/E4tk2ddYziNdZwBIWoxDn99krL8YFPuX4jXg4IaA78 CKrQgZ+oRbn+fgf1+OAX2HfEpPvIwy8rP4qveIKD6MVlrKqsGckJtOIuTuG7FWcxKPDIDpanX0Ef qQObKNHzm1mxXa/xDlIWzuu9G9N6n9rX5iJdxXFrqtM0vZN4g3mcxS1N6xcc0iwUIOkTZwFDfoHb ccajogkeRwseokyBa/AYL7UHmtVxR3Xc6b07sL2rY8jwYMqVYkBH6BKeKcg9jKtcE+Y0ILuNWNBU dyInYGkO65lAIyrQpvcuNOCa8jesuitBgZ/vco+YNX+nzl5ANR4o/69emWbdjlr1Yq4zm9zrrs5U o45HwB8aWQ8+68p0NNI6TOCVykatNkzeb/dpsQObjXJahdyVjD68RbaO3U1XmTGtdbHyD1htmMHM 4rZf4BuaSq9kPgLDGMQL5Ct/Rtdhq/h9ZFaDAptLoki9dawPhLm1LuKkdnVCU2em/4o6Zhr/6LFM 6ergVmb4X2YYOAz83wf+I8AAxW9u8zHhZdQAAAAASUVORK5CYII='},
			'16':{title:'가끔 눈 또는 비',base64:'iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJ bWFnZVJlYWR5ccllPAAAAHhJREFUeNpi/P//P8NAACaGAQKjFo9aPGrx0LeYBZlzqFL8Eg3tumrX /jISq8VAoEtDi3lx+hgIOoH4P42i9DE+iytGU/Xwzk5AoE/DxPUViG/jsvgEjTzICMRngdgal8Uc NAxdYRSXjLa5Ri0etXjU4iFnMUCAAQBKDxNO59hyBQAAAABJRU5ErkJggg=='},
			'17':{title:'뇌우',base64:'iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQtJREFUeNpi/P//P8NAACaGAQKjFo9aTDPAgk/yr6cWJXntAhA7Mm+/9oGePgZbyrLj+geyfIwEQIYcwCbxx0NTAEj1A3ECVGgDECfis5QUixnwWLofiA2gQguAFibSNHFRYinZFgMtBVl2HsnSRFIsJSuooZaCfCqAZOkCeuRjBST2ByimfQEC9B0o1TpCLQT5ej0wFBLoUnIBLb8AtfwBVGg+0PICtCg5D8JUT9VQyw2hhQUI9AMtmg+11AGa8AxoUlZDCwmQz2GFSwLUcgGaVxIgy4EYZDksZYPiez7daidoPp4A5QpQPR/jyNsNQKqemgXIB6TaBh/gJ9WxjKPN21GLRy2mFgAIMAAs71mjIly/LQAAAABJRU5ErkJggg=='},
			'18':{title:'연무',base64:'iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAK TWlDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVN3WJP3Fj7f92UPVkLY8LGXbIEAIiOsCMgQ WaIQkgBhhBASQMWFiApWFBURnEhVxILVCkidiOKgKLhnQYqIWotVXDjuH9yntX167+3t+9f7vOec 5/zOec8PgBESJpHmomoAOVKFPDrYH49PSMTJvYACFUjgBCAQ5svCZwXFAADwA3l4fnSwP/wBr28A AgBw1S4kEsfh/4O6UCZXACCRAOAiEucLAZBSAMguVMgUAMgYALBTs2QKAJQAAGx5fEIiAKoNAOz0 ST4FANipk9wXANiiHKkIAI0BAJkoRyQCQLsAYFWBUiwCwMIAoKxAIi4EwK4BgFm2MkcCgL0FAHaO WJAPQGAAgJlCLMwAIDgCAEMeE80DIEwDoDDSv+CpX3CFuEgBAMDLlc2XS9IzFLiV0Bp38vDg4iHi wmyxQmEXKRBmCeQinJebIxNI5wNMzgwAABr50cH+OD+Q5+bk4eZm52zv9MWi/mvwbyI+IfHf/ryM AgQAEE7P79pf5eXWA3DHAbB1v2upWwDaVgBo3/ldM9sJoFoK0Hr5i3k4/EAenqFQyDwdHAoLC+0l YqG9MOOLPv8z4W/gi372/EAe/tt68ABxmkCZrcCjg/1xYW52rlKO58sEQjFu9+cj/seFf/2OKdHi NLFcLBWK8ViJuFAiTcd5uVKRRCHJleIS6X8y8R+W/QmTdw0ArIZPwE62B7XLbMB+7gECiw5Y0nYA QH7zLYwaC5EAEGc0Mnn3AACTv/mPQCsBAM2XpOMAALzoGFyolBdMxggAAESggSqwQQcMwRSswA6c wR28wBcCYQZEQAwkwDwQQgbkgBwKoRiWQRlUwDrYBLWwAxqgEZrhELTBMTgN5+ASXIHrcBcGYBie whi8hgkEQcgIE2EhOogRYo7YIs4IF5mOBCJhSDSSgKQg6YgUUSLFyHKkAqlCapFdSCPyLXIUOY1c QPqQ28ggMor8irxHMZSBslED1AJ1QLmoHxqKxqBz0XQ0D12AlqJr0Rq0Hj2AtqKn0UvodXQAfYqO Y4DRMQ5mjNlhXIyHRWCJWBomxxZj5Vg1Vo81Yx1YN3YVG8CeYe8IJAKLgBPsCF6EEMJsgpCQR1hM WEOoJewjtBK6CFcJg4Qxwicik6hPtCV6EvnEeGI6sZBYRqwm7iEeIZ4lXicOE1+TSCQOyZLkTgoh JZAySQtJa0jbSC2kU6Q+0hBpnEwm65Btyd7kCLKArCCXkbeQD5BPkvvJw+S3FDrFiOJMCaIkUqSU Eko1ZT/lBKWfMkKZoKpRzame1AiqiDqfWkltoHZQL1OHqRM0dZolzZsWQ8ukLaPV0JppZ2n3aC/p dLoJ3YMeRZfQl9Jr6Afp5+mD9HcMDYYNg8dIYigZaxl7GacYtxkvmUymBdOXmchUMNcyG5lnmA+Y b1VYKvYqfBWRyhKVOpVWlX6V56pUVXNVP9V5qgtUq1UPq15WfaZGVbNQ46kJ1Bar1akdVbupNq7O UndSj1DPUV+jvl/9gvpjDbKGhUaghkijVGO3xhmNIRbGMmXxWELWclYD6yxrmE1iW7L57Ex2Bfsb di97TFNDc6pmrGaRZp3mcc0BDsax4PA52ZxKziHODc57LQMtPy2x1mqtZq1+rTfaetq+2mLtcu0W 7eva73VwnUCdLJ31Om0693UJuja6UbqFutt1z+o+02PreekJ9cr1Dund0Uf1bfSj9Rfq79bv0R83 MDQINpAZbDE4Y/DMkGPoa5hpuNHwhOGoEctoupHEaKPRSaMnuCbuh2fjNXgXPmasbxxirDTeZdxr PGFiaTLbpMSkxeS+Kc2Ua5pmutG003TMzMgs3KzYrMnsjjnVnGueYb7ZvNv8jYWlRZzFSos2i8eW 2pZ8ywWWTZb3rJhWPlZ5VvVW16xJ1lzrLOtt1ldsUBtXmwybOpvLtqitm63Edptt3xTiFI8p0in1 U27aMez87ArsmuwG7Tn2YfYl9m32zx3MHBId1jt0O3xydHXMdmxwvOuk4TTDqcSpw+lXZxtnoXOd 8zUXpkuQyxKXdpcXU22niqdun3rLleUa7rrStdP1o5u7m9yt2W3U3cw9xX2r+00umxvJXcM970H0 8PdY4nHM452nm6fC85DnL152Xlle+70eT7OcJp7WMG3I28Rb4L3Le2A6Pj1l+s7pAz7GPgKfep+H vqa+It89viN+1n6Zfgf8nvs7+sv9j/i/4XnyFvFOBWABwQHlAb2BGoGzA2sDHwSZBKUHNQWNBbsG Lww+FUIMCQ1ZH3KTb8AX8hv5YzPcZyya0RXKCJ0VWhv6MMwmTB7WEY6GzwjfEH5vpvlM6cy2CIjg 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 AAAASUVORK5CYII='},
			'19':{title:'안개',base64:'iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAK TWlDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVN3WJP3Fj7f92UPVkLY8LGXbIEAIiOsCMgQ WaIQkgBhhBASQMWFiApWFBURnEhVxILVCkidiOKgKLhnQYqIWotVXDjuH9yntX167+3t+9f7vOec 5/zOec8PgBESJpHmomoAOVKFPDrYH49PSMTJvYACFUjgBCAQ5svCZwXFAADwA3l4fnSwP/wBr28A AgBw1S4kEsfh/4O6UCZXACCRAOAiEucLAZBSAMguVMgUAMgYALBTs2QKAJQAAGx5fEIiAKoNAOz0 ST4FANipk9wXANiiHKkIAI0BAJkoRyQCQLsAYFWBUiwCwMIAoKxAIi4EwK4BgFm2MkcCgL0FAHaO WJAPQGAAgJlCLMwAIDgCAEMeE80DIEwDoDDSv+CpX3CFuEgBAMDLlc2XS9IzFLiV0Bp38vDg4iHi wmyxQmEXKRBmCeQinJebIxNI5wNMzgwAABr50cH+OD+Q5+bk4eZm52zv9MWi/mvwbyI+IfHf/ryM AgQAEE7P79pf5eXWA3DHAbB1v2upWwDaVgBo3/ldM9sJoFoK0Hr5i3k4/EAenqFQyDwdHAoLC+0l YqG9MOOLPv8z4W/gi372/EAe/tt68ABxmkCZrcCjg/1xYW52rlKO58sEQjFu9+cj/seFf/2OKdHi NLFcLBWK8ViJuFAiTcd5uVKRRCHJleIS6X8y8R+W/QmTdw0ArIZPwE62B7XLbMB+7gECiw5Y0nYA QH7zLYwaC5EAEGc0Mnn3AACTv/mPQCsBAM2XpOMAALzoGFyolBdMxggAAESggSqwQQcMwRSswA6c wR28wBcCYQZEQAwkwDwQQgbkgBwKoRiWQRlUwDrYBLWwAxqgEZrhELTBMTgN5+ASXIHrcBcGYBie whi8hgkEQcgIE2EhOogRYo7YIs4IF5mOBCJhSDSSgKQg6YgUUSLFyHKkAqlCapFdSCPyLXIUOY1c QPqQ28ggMor8irxHMZSBslED1AJ1QLmoHxqKxqBz0XQ0D12AlqJr0Rq0Hj2AtqKn0UvodXQAfYqO Y4DRMQ5mjNlhXIyHRWCJWBomxxZj5Vg1Vo81Yx1YN3YVG8CeYe8IJAKLgBPsCF6EEMJsgpCQR1hM WEOoJewjtBK6CFcJg4Qxwicik6hPtCV6EvnEeGI6sZBYRqwm7iEeIZ4lXicOE1+TSCQOyZLkTgoh JZAySQtJa0jbSC2kU6Q+0hBpnEwm65Btyd7kCLKArCCXkbeQD5BPkvvJw+S3FDrFiOJMCaIkUqSU Eko1ZT/lBKWfMkKZoKpRzame1AiqiDqfWkltoHZQL1OHqRM0dZolzZsWQ8ukLaPV0JppZ2n3aC/p dLoJ3YMeRZfQl9Jr6Afp5+mD9HcMDYYNg8dIYigZaxl7GacYtxkvmUymBdOXmchUMNcyG5lnmA+Y b1VYKvYqfBWRyhKVOpVWlX6V56pUVXNVP9V5qgtUq1UPq15WfaZGVbNQ46kJ1Bar1akdVbupNq7O UndSj1DPUV+jvl/9gvpjDbKGhUaghkijVGO3xhmNIRbGMmXxWELWclYD6yxrmE1iW7L57Ex2Bfsb di97TFNDc6pmrGaRZp3mcc0BDsax4PA52ZxKziHODc57LQMtPy2x1mqtZq1+rTfaetq+2mLtcu0W 7eva73VwnUCdLJ31Om0693UJuja6UbqFutt1z+o+02PreekJ9cr1Dund0Uf1bfSj9Rfq79bv0R83 MDQINpAZbDE4Y/DMkGPoa5hpuNHwhOGoEctoupHEaKPRSaMnuCbuh2fjNXgXPmasbxxirDTeZdxr PGFiaTLbpMSkxeS+Kc2Ua5pmutG003TMzMgs3KzYrMnsjjnVnGueYb7ZvNv8jYWlRZzFSos2i8eW 2pZ8ywWWTZb3rJhWPlZ5VvVW16xJ1lzrLOtt1ldsUBtXmwybOpvLtqitm63Edptt3xTiFI8p0in1 U27aMez87ArsmuwG7Tn2YfYl9m32zx3MHBId1jt0O3xydHXMdmxwvOuk4TTDqcSpw+lXZxtnoXOd 8zUXpkuQyxKXdpcXU22niqdun3rLleUa7rrStdP1o5u7m9yt2W3U3cw9xX2r+00umxvJXcM970H0 8PdY4nHM452nm6fC85DnL152Xlle+70eT7OcJp7WMG3I28Rb4L3Le2A6Pj1l+s7pAz7GPgKfep+H vqa+It89viN+1n6Zfgf8nvs7+sv9j/i/4XnyFvFOBWABwQHlAb2BGoGzA2sDHwSZBKUHNQWNBbsG Lww+FUIMCQ1ZH3KTb8AX8hv5YzPcZyya0RXKCJ0VWhv6MMwmTB7WEY6GzwjfEH5vpvlM6cy2CIjg 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 w+ykAAAAAElFTkSuQmCC'},
			'20':{title:'박무',base64:'iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAK TWlDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVN3WJP3Fj7f92UPVkLY8LGXbIEAIiOsCMgQ WaIQkgBhhBASQMWFiApWFBURnEhVxILVCkidiOKgKLhnQYqIWotVXDjuH9yntX167+3t+9f7vOec 5/zOec8PgBESJpHmomoAOVKFPDrYH49PSMTJvYACFUjgBCAQ5svCZwXFAADwA3l4fnSwP/wBr28A AgBw1S4kEsfh/4O6UCZXACCRAOAiEucLAZBSAMguVMgUAMgYALBTs2QKAJQAAGx5fEIiAKoNAOz0 ST4FANipk9wXANiiHKkIAI0BAJkoRyQCQLsAYFWBUiwCwMIAoKxAIi4EwK4BgFm2MkcCgL0FAHaO WJAPQGAAgJlCLMwAIDgCAEMeE80DIEwDoDDSv+CpX3CFuEgBAMDLlc2XS9IzFLiV0Bp38vDg4iHi wmyxQmEXKRBmCeQinJebIxNI5wNMzgwAABr50cH+OD+Q5+bk4eZm52zv9MWi/mvwbyI+IfHf/ryM AgQAEE7P79pf5eXWA3DHAbB1v2upWwDaVgBo3/ldM9sJoFoK0Hr5i3k4/EAenqFQyDwdHAoLC+0l YqG9MOOLPv8z4W/gi372/EAe/tt68ABxmkCZrcCjg/1xYW52rlKO58sEQjFu9+cj/seFf/2OKdHi NLFcLBWK8ViJuFAiTcd5uVKRRCHJleIS6X8y8R+W/QmTdw0ArIZPwE62B7XLbMB+7gECiw5Y0nYA QH7zLYwaC5EAEGc0Mnn3AACTv/mPQCsBAM2XpOMAALzoGFyolBdMxggAAESggSqwQQcMwRSswA6c wR28wBcCYQZEQAwkwDwQQgbkgBwKoRiWQRlUwDrYBLWwAxqgEZrhELTBMTgN5+ASXIHrcBcGYBie whi8hgkEQcgIE2EhOogRYo7YIs4IF5mOBCJhSDSSgKQg6YgUUSLFyHKkAqlCapFdSCPyLXIUOY1c QPqQ28ggMor8irxHMZSBslED1AJ1QLmoHxqKxqBz0XQ0D12AlqJr0Rq0Hj2AtqKn0UvodXQAfYqO Y4DRMQ5mjNlhXIyHRWCJWBomxxZj5Vg1Vo81Yx1YN3YVG8CeYe8IJAKLgBPsCF6EEMJsgpCQR1hM WEOoJewjtBK6CFcJg4Qxwicik6hPtCV6EvnEeGI6sZBYRqwm7iEeIZ4lXicOE1+TSCQOyZLkTgoh JZAySQtJa0jbSC2kU6Q+0hBpnEwm65Btyd7kCLKArCCXkbeQD5BPkvvJw+S3FDrFiOJMCaIkUqSU Eko1ZT/lBKWfMkKZoKpRzame1AiqiDqfWkltoHZQL1OHqRM0dZolzZsWQ8ukLaPV0JppZ2n3aC/p dLoJ3YMeRZfQl9Jr6Afp5+mD9HcMDYYNg8dIYigZaxl7GacYtxkvmUymBdOXmchUMNcyG5lnmA+Y b1VYKvYqfBWRyhKVOpVWlX6V56pUVXNVP9V5qgtUq1UPq15WfaZGVbNQ46kJ1Bar1akdVbupNq7O UndSj1DPUV+jvl/9gvpjDbKGhUaghkijVGO3xhmNIRbGMmXxWELWclYD6yxrmE1iW7L57Ex2Bfsb di97TFNDc6pmrGaRZp3mcc0BDsax4PA52ZxKziHODc57LQMtPy2x1mqtZq1+rTfaetq+2mLtcu0W 7eva73VwnUCdLJ31Om0693UJuja6UbqFutt1z+o+02PreekJ9cr1Dund0Uf1bfSj9Rfq79bv0R83 MDQINpAZbDE4Y/DMkGPoa5hpuNHwhOGoEctoupHEaKPRSaMnuCbuh2fjNXgXPmasbxxirDTeZdxr PGFiaTLbpMSkxeS+Kc2Ua5pmutG003TMzMgs3KzYrMnsjjnVnGueYb7ZvNv8jYWlRZzFSos2i8eW 2pZ8ywWWTZb3rJhWPlZ5VvVW16xJ1lzrLOtt1ldsUBtXmwybOpvLtqitm63Edptt3xTiFI8p0in1 U27aMez87ArsmuwG7Tn2YfYl9m32zx3MHBId1jt0O3xydHXMdmxwvOuk4TTDqcSpw+lXZxtnoXOd 8zUXpkuQyxKXdpcXU22niqdun3rLleUa7rrStdP1o5u7m9yt2W3U3cw9xX2r+00umxvJXcM970H0 8PdY4nHM452nm6fC85DnL152Xlle+70eT7OcJp7WMG3I28Rb4L3Le2A6Pj1l+s7pAz7GPgKfep+H vqa+It89viN+1n6Zfgf8nvs7+sv9j/i/4XnyFvFOBWABwQHlAb2BGoGzA2sDHwSZBKUHNQWNBbsG Lww+FUIMCQ1ZH3KTb8AX8hv5YzPcZyya0RXKCJ0VWhv6MMwmTB7WEY6GzwjfEH5vpvlM6cy2CIjg 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'},
			'21':{title:'황사',base64:'iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAK TWlDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVN3WJP3Fj7f92UPVkLY8LGXbIEAIiOsCMgQ WaIQkgBhhBASQMWFiApWFBURnEhVxILVCkidiOKgKLhnQYqIWotVXDjuH9yntX167+3t+9f7vOec 5/zOec8PgBESJpHmomoAOVKFPDrYH49PSMTJvYACFUjgBCAQ5svCZwXFAADwA3l4fnSwP/wBr28A AgBw1S4kEsfh/4O6UCZXACCRAOAiEucLAZBSAMguVMgUAMgYALBTs2QKAJQAAGx5fEIiAKoNAOz0 ST4FANipk9wXANiiHKkIAI0BAJkoRyQCQLsAYFWBUiwCwMIAoKxAIi4EwK4BgFm2MkcCgL0FAHaO WJAPQGAAgJlCLMwAIDgCAEMeE80DIEwDoDDSv+CpX3CFuEgBAMDLlc2XS9IzFLiV0Bp38vDg4iHi wmyxQmEXKRBmCeQinJebIxNI5wNMzgwAABr50cH+OD+Q5+bk4eZm52zv9MWi/mvwbyI+IfHf/ryM AgQAEE7P79pf5eXWA3DHAbB1v2upWwDaVgBo3/ldM9sJoFoK0Hr5i3k4/EAenqFQyDwdHAoLC+0l YqG9MOOLPv8z4W/gi372/EAe/tt68ABxmkCZrcCjg/1xYW52rlKO58sEQjFu9+cj/seFf/2OKdHi NLFcLBWK8ViJuFAiTcd5uVKRRCHJleIS6X8y8R+W/QmTdw0ArIZPwE62B7XLbMB+7gECiw5Y0nYA QH7zLYwaC5EAEGc0Mnn3AACTv/mPQCsBAM2XpOMAALzoGFyolBdMxggAAESggSqwQQcMwRSswA6c wR28wBcCYQZEQAwkwDwQQgbkgBwKoRiWQRlUwDrYBLWwAxqgEZrhELTBMTgN5+ASXIHrcBcGYBie whi8hgkEQcgIE2EhOogRYo7YIs4IF5mOBCJhSDSSgKQg6YgUUSLFyHKkAqlCapFdSCPyLXIUOY1c QPqQ28ggMor8irxHMZSBslED1AJ1QLmoHxqKxqBz0XQ0D12AlqJr0Rq0Hj2AtqKn0UvodXQAfYqO Y4DRMQ5mjNlhXIyHRWCJWBomxxZj5Vg1Vo81Yx1YN3YVG8CeYe8IJAKLgBPsCF6EEMJsgpCQR1hM WEOoJewjtBK6CFcJg4Qxwicik6hPtCV6EvnEeGI6sZBYRqwm7iEeIZ4lXicOE1+TSCQOyZLkTgoh JZAySQtJa0jbSC2kU6Q+0hBpnEwm65Btyd7kCLKArCCXkbeQD5BPkvvJw+S3FDrFiOJMCaIkUqSU Eko1ZT/lBKWfMkKZoKpRzame1AiqiDqfWkltoHZQL1OHqRM0dZolzZsWQ8ukLaPV0JppZ2n3aC/p dLoJ3YMeRZfQl9Jr6Afp5+mD9HcMDYYNg8dIYigZaxl7GacYtxkvmUymBdOXmchUMNcyG5lnmA+Y b1VYKvYqfBWRyhKVOpVWlX6V56pUVXNVP9V5qgtUq1UPq15WfaZGVbNQ46kJ1Bar1akdVbupNq7O UndSj1DPUV+jvl/9gvpjDbKGhUaghkijVGO3xhmNIRbGMmXxWELWclYD6yxrmE1iW7L57Ex2Bfsb di97TFNDc6pmrGaRZp3mcc0BDsax4PA52ZxKziHODc57LQMtPy2x1mqtZq1+rTfaetq+2mLtcu0W 7eva73VwnUCdLJ31Om0693UJuja6UbqFutt1z+o+02PreekJ9cr1Dund0Uf1bfSj9Rfq79bv0R83 MDQINpAZbDE4Y/DMkGPoa5hpuNHwhOGoEctoupHEaKPRSaMnuCbuh2fjNXgXPmasbxxirDTeZdxr PGFiaTLbpMSkxeS+Kc2Ua5pmutG003TMzMgs3KzYrMnsjjnVnGueYb7ZvNv8jYWlRZzFSos2i8eW 2pZ8ywWWTZb3rJhWPlZ5VvVW16xJ1lzrLOtt1ldsUBtXmwybOpvLtqitm63Edptt3xTiFI8p0in1 U27aMez87ArsmuwG7Tn2YfYl9m32zx3MHBId1jt0O3xydHXMdmxwvOuk4TTDqcSpw+lXZxtnoXOd 8zUXpkuQyxKXdpcXU22niqdun3rLleUa7rrStdP1o5u7m9yt2W3U3cw9xX2r+00umxvJXcM970H0 8PdY4nHM452nm6fC85DnL152Xlle+70eT7OcJp7WMG3I28Rb4L3Le2A6Pj1l+s7pAz7GPgKfep+H vqa+It89viN+1n6Zfgf8nvs7+sv9j/i/4XnyFvFOBWABwQHlAb2BGoGzA2sDHwSZBKUHNQWNBbsG Lww+FUIMCQ1ZH3KTb8AX8hv5YzPcZyya0RXKCJ0VWhv6MMwmTB7WEY6GzwjfEH5vpvlM6cy2CIjg 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'},
			'22':{title:'기타',base64:'iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAIAAAC0Ujn1AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAA1SURBVEhL7cwhDgAgEMTA+/+nF4OAygsgSMe3lWtcg2twDa7h7bpaZrz4Zn2Ka3ANrsH1Jhml1uCef9AaDgAAAABJRU5ErkJggg=='}
	};
	
	var layerGroupObj = {
			'obs':{text:'측정망 위치',layerArrs:[],cls:'fstLabel_4',zIndex:2},
			'weather':{text:'기상',layerArrs:[],cls:'fstLabel_1',zIndex:2},
			'car':{text:'차량',layerArrs:[],cls:'fstLabel_2',zIndex:2},
			'rgs':{text:'인구',layerArrs:[],cls:'fstLabel_6',isThreeDepth:true,zIndex:2},
			'study':{text:'관심시설',layerArrs:[],cls:'fstLabel_3',zIndex:2},
			'tms':{text:'배출량',layerArrs:[],cls:'fstLabel_5',zIndex:2}
	};
	
	layerGroupObj['rgs'].layerArrs[0] = {title:'인구수',layerArrs:[]};
	layerGroupObj['rgs'].layerArrs[1] = {title:'면적비율',layerArrs:[]};
	
	var addrText ={
			'서울특별시':'서울',
			'인천광역시':'인천',
			'경기도':'경기',
			'강원도':'강원',
			'충청북도':'충북',
			'충청남도':'충남',
			'경상북도':'경북',
			'대전광역시':'대전',
			'세종특별자치시':'세종',
			'경상남도':'경남',
			'대구광역시':'대구',
			'전라북도':'전북',
			'울산광역시':'울산',
			'전라남도':'전남',
			'광주광역시':'광주',
			'부산광역시':'부산',
			'제주특별자치도':'제주'
	};
	
	var tmsCoordX = 0;
	var tmsCoordY = 0;
	
	var init = function(){
		initLayers();
		var instLevel = _CoreMap.getMap().getView().getZoom();
		_MapEventBus.on(_MapEvents.map_moveend, function(mapChangeType){
			var level = _CoreMap.getMap().getView().getZoom();
			if(level != instLevel){
				_ThemathicLayer.setZoomToLayer();
				instLevel = level;
			}
		});
		
		$('#dustLyrBtn').on('mouseover',function(){
			var target = this;
			$(target).find('.f_list_wrap').toggle();
		});
		
		$('#dustLyrBtn').on('mouseout',function(){
			var target = this;
			$(target).find('.f_list_wrap').toggle();
		});
	};
	
	var initLayers = function(){
		for(key in layerObj){
			var obj = layerObj[key];
			obj.layerName = key;
			if(layerGroupObj[obj.groupId].isThreeDepth){
				layerGroupObj[obj.groupId].layerArrs[obj.layerIdx].layerArrs.push(obj);
			}else{
				layerGroupObj[obj.groupId].layerArrs.push(obj);
			}	
		}
		setButton();
		
		$("#legend").menu();
		
		$('#layerResetBtn').on('click',function(){
			var mapLayerArr = _CoreMap.getMap().getLayers().getArray();
			for(var i = 0; i<mapLayerArr.length; i++){
				if(i > 7){
					if(mapLayerArr[i].getVisible()){
						var lyName = mapLayerArr[i].getProperties().name;
						if(lyName){
							if(lyName.split('@')[1]){
								setLayerOnOff({
									isFirst:true,
									layerName:lyName.split('@')[0],
									isBtnOn:false,
								});
							}
						}
					}
				}
			}
			$('.mapBtn.on').removeClass('on');
			$('#legendArea').children().remove();
		});
		
		$('.mapBtn').on('click', function(){
			this.className.indexOf('on') > -1?setSyncLegend($(this).attr('layerName'),false):setSyncLegend($(this).attr('layerName'),true);
		});
	};
	
	var setSyncLegend = function(layerName, isBtnOn){
		var legendtarget = $('#legend').find('[layerName="'+layerName+'"]');
		var lObj = layerObj[layerName];
		var legendArea = $('#legendArea');
		var legendAreaTarget = $('#legendArea').find('[id="'+layerName+'"]');
		
		if(isBtnOn){
			legendtarget.addClass('on');
			var legendAreaText = '';
			if(lObj.groupId=='rgs'){
				legendAreaText = $(legendtarget.parent().parent().parent()[0]).find('a')[0].text + '(' + legendtarget[0].text + ')';
			}else{
				legendAreaText = legendtarget[0].text;
			}
			legendArea.append('<span onclick="_ThemathicLayer.legendAreaSpan(\''+layerName+'\')" class="legendAreaSpan" id='+layerName+'><span class="z_name">'+legendAreaText+'</span></span>');
			if(lObj.toggleId){
				for(var i = 0; i<lObj.toggleId.length; i++){
					var toggleTarget = $('[layername=' + lObj.toggleId[i] + ']');
					if(toggleTarget[0].className.indexOf('on') > -1){
						$($('#legendArea').find('[id="'+lObj.toggleId[i]+'"]')[0]).remove();
						toggleTarget.removeClass('on');
						setLayerOnOff({
							isFirst:true,
							layerName:lObj.toggleId[i],
							isBtnOn:false,
						});
					}
				}
			}

			if(lObj.isTiled){
				getLayersTiledMap(layerName);
			}else{
				getLayers(layerName);
			}
		}else{
			legendtarget.removeClass('on');
			$(legendAreaTarget[0]).remove();
			setLayerOnOff({
				isFirst:true,
				layerName:layerName,
				isBtnOn:isBtnOn,
			});
		}
	};
	
	var levelToIndex = function(){
		var level = _CoreMap.getMap().getView().getZoom();
		return level < 11 ? 0 : 1;
	};
	
	var getLayersTiledMap = function(layerName){
		var isLayer = _CoreMap.getMap().getLayerForName(layerObj[layerName].layerNm);
		
		if(!isLayer){
			var layerArr = [];
			layerArr.push(layerObj[layerName]);
			layerArr[0].isVisible = true;
			layerArr[0].layerId = layerName + '@' + layerArr[0].layerNm;
			var lArr;
			if(layerArr[0].layerType=='vworld'){
				lArr = _VWorldLayer.createVWroldWMSTileMapLayer({
					isVisible : layerArr[0].isVisible,
					opacity : layerArr[0].opacity,
					isTiled : layerArr[0].isTiled,
					layers : layerArr[0].layerNm,
					layerId : layerName + '@' + layerArr[0].layerNm 
				});
				
				_MapEventBus.trigger(_MapEvents.map_addLayer,lArr);
			}else{
				lArr = _CoreMap.createTileLayer(layerArr);
				_MapEventBus.trigger(_MapEvents.map_addLayer,lArr[0]);
			}
			
		}else{
			setLayerOnOff({
				isFirst:true,
				layerName:layerName,
				isBtnOn:true,
			});
		}
	};
	
	var getLayers = function(layerName){
		var lObj = layerObj[layerName];
		var layerArr = lObj.layerArr;
		var arrIndex = levelToIndex();
		var isFirst = true;
		
		for(var i = 0; i < layerArr.length; i++){
			var layer = layerArr[i];
			var mapLayers = _CoreMap.getMap().getLayerForName(layerName + '@' + layer);
			if(!mapLayers){
				var bboxFeatures = getFeaturesWfsBbox(layer,'EPSG:3857');
				writeFeatures(layerName,layer,bboxFeatures,lObj.styleId);
				if(i != arrIndex){
					var offLayer = _CoreMap.getMap().getLayerForName(layerName + '@' + layer);
					if(offLayer.getVisible()){
						offLayer.setVisible(false);
					}
				}
				lObj.isVisible = true;
			}else{
				setLayerOnOff({
					isFirst:isFirst,
					layerName:layerName,
					isBtnOn:true,
				});
			}
			
			isFirst = false; 
		}
	};
	
	var setLayerOnOff = function(options){
		if(!options.isFirst){
			return;
		}
		
		var lObj = layerObj[options.layerName];
		lObj.isVisible = options.isBtnOn;
		
		var arrIndex = levelToIndex();
		
		var layerArr = [];
		
		if(lObj.isTiled){
			layerArr.push(lObj.layerNm);
		}else{
			layerArr = lObj.layerArr;
		}
		
		if(!layerArr[arrIndex]){
			arrIndex = 0;
		}
		
		for(var i = 0; i < layerArr.length; i++){
			var mapLayers = _CoreMap.getMap().getLayerForName(options.layerName+'@'+layerArr[i]);
			if(i != arrIndex){
				mapLayers.setVisible(false);
			}else{
				mapLayers.setVisible(options.isBtnOn);
			}
		}
	};
	
	var setButton = function(){
		var box = '<div id="layerResetBtn" style="background: url(/map/resources/images/ui/reset.png) no-repeat 42px 2px; letter-spacing: -1px; font-weight: bold; padding-left: 6px; border-bottom: 1px solid #d1d3d0; font-size: 11px; font-family: 돋움;">초기화</div>';
		for(key in layerGroupObj){
			var lgObj = layerGroupObj[key];
			var layerArrs = lgObj.layerArrs;

			box += '<li><a class=' + lgObj.cls + '>' + lgObj.text + '</a>';
			box += '<ul class="fstLabel f_left">';

			for(var i = 0; i<layerArrs.length; i++){
				box += '<li>';
				if(lgObj.isThreeDepth){
					box += '<a class="' + lgObj.cls + '_' + (i + 1) + '">' + layerArrs[i].title + '</a>';
					box += '<ul class="f_list_wrap f2_list">';
					for(var j = 0; j < layerArrs[i].layerArrs.length; j++){
						box +='<li><a class="mapBtn" layerName="' + layerArrs[i].layerArrs[j].layerName + '">' + layerArrs[i].layerArrs[j].title + '</a></li>';
					}	
					box += '</ul>';
				}else{
					box += '<a class="' + lgObj.cls + '_' + (i + 1) + ' mapBtn" layerName="' + layerArrs[i].layerName + '"><div>' + layerArrs[i].title + '</div></a>';
				}
				box += '</li>';
			}
			box += '</ul></li>';

		}
		box += '<div class="layer_source" id="layer_source" style="padding-left: 17px; letter-spacing: -1px; font-weight: bold; border-bottom: 1px solid #d1d3d0; font-size: 11px; font-family: 돋움;">출처</div>';
		$('#legend').html(box);
		
	};
	
	var getFeaturesWfsBbox = function(layerName,projection){
		//var wfsUrl = _MapServiceInfo.serviceUrl.replace('ows','wfs');
		
		var layerGroup = 'airkorea:';
		
		var baseUrl = '/geoserver/airkorea/wfs?service=WFS&urlType=geoServer&version=1.0.0&request=GetFeature&typeName='+layerGroup+'#layerName#&outputFormat=application%2Fjson&srsname=#projection#';
		
		//var setUrl = wfsUrl + baseUrl.replace('#layerName#',layerName).replace('#projection#',projection);
		var setUrl = _proxyUrl + baseUrl.replace('#layerName#',layerName).replace('#projection#',projection);
		var vectorSource = new ol.source.Vector({
			format: new ol.format.GeoJSON(),
			url: function (extent) {
				var strUrl = setUrl;
				if(layerName == 'SD_WEATHER_20'){
					strUrl += '&cql_filter=1=1';
				}else{
					strUrl += '&bbox=' + extent.join(',') + ',' + projection;	
				}
				return strUrl;
			},
			strategy: ol.loadingstrategy.bbox
		});
		return vectorSource;
	};
	
	var writeFeatures = function(layerName,layer,bboxFeatures,styleId){
		var styleFunction;
		
		switch (styleId) {
		case 'weather':
			styleFunction = weatherStyleFunction;
			break;
		case 'circle':
			styleFunction = circleStyleFunction;
			break;
		case 'tms':
			styleFunction = tmsStyleFunction;
			break;
		case 'tmsLocation':
			styleFunction = tmsLocationStyleFunction;
			break;
		default:
			break;
		}
		
		var zIndex = layerGroupObj[layerObj[layerName].groupId].zIndex;
		var vectorLayer = new ol.layer.Vector({
			source : bboxFeatures,
			style : styleFunction,
			name : layerName+'@'+layer,
			zIndex: zIndex,
			id:styleId
		});
		
		_MapEventBus.trigger(_MapEvents.map_addLayer,vectorLayer);
		
		var center = _CoreMap.getMap().getView().getCenter();
		var centerX = center[0];
		var centerY = center[1];
		
		setTimeout(function(){ _CoreMap.getMap().getView().setCenter([(centerX + 1),centerY]); }, 1000*2);
	};
	
	var tmsLocationStyleFunction = function(feature, resolution){
		return new ol.style.Style({
			image : new ol.style.Icon({
				opacity: 1.0,
				src: '/map/resources/images/icon/chimney.png'
			})
		});
	};
	
	var getLayerObjId = function(feature){
		var layer = feature.getLayer(_CoreMap.getMap());
		return {
			layerName : layer.get('name').split('@')[0],
			layerId : layer.get('name').split('@')[1]
		};
	};
	var getDustData = function(param){
		return $.ajax({
            url : '/map/getDustData?date='+param.date+'&itemCode='+param.itemCode,
            type : 'GET',
            contentType : 'application/json'
    	})
	};
	
	var tmsStyleFunction = function(feature, resolution){
		var lObj = layerObj[getLayerObjId(feature).layerName];
		
		var properties = feature.getProperties();
		var prop = feature.getProperties();
		var doNm = prop.DO_NM;
		
		var tmsCo = prop.CO;
		var tmsNox = prop.NOX;
		var tmsSox = prop.SOX;
		var tmsTsp = prop.TSP;
		var tmsPm10 = prop.PM10;
		var tmsPm25 = prop.PM2_5;
		var tmsVoc = prop.VOC;
		var tmsNh3 = prop.NH3;
		
		var year = prop.YEAR;
		
		var iconTemplate = '<svg width="130" height="202" version="1.1" xmlns="http://www.w3.org/2000/svg">'+
								'<defs><linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" /><stop offset="100%" style="stop-color:#ebebeb;stop-opacity:1" /></linearGradient></defs>'+
								'<rect rx="10" width="130" height="202" fill="url(#grad1)" style="stroke-width:1;stroke:#777777"></rect>'+
								'<rect y="180" width="130" height="22" fill="#381245" style="stroke-width:1;stroke:#777777"></rect>'+
								'<text x="65" y="15" style="font-size: 12px; font-weight: bold; font-family:돋움;" text-anchor="middle" alignment-baseline="middle">' + year + '년 통계</text>'+
					      		'<text x="5" y="35" style="font-size: 12px; font-weight: bold; font-family:돋움;">CO : ' + tmsCo + ' kg</text>'+
					      		'<text x="5" y="55" style="font-size: 12px; font-weight: bold; font-family:돋움;">NOx : ' + tmsNox + ' kg</text>'+
					      		'<text x="5" y="75" style="font-size: 12px; font-weight: bold; font-family:돋움;">SOx : ' + tmsSox + ' kg</text>'+
					      		'<text x="5" y="95" style="font-size: 12px; font-weight: bold; font-family:돋움;">TSP : ' + tmsTsp + ' kg</text>'+
					      		'<text x="5" y="115" style="font-size: 12px; font-weight: bold; font-family:돋움;">PM10 : ' + tmsPm10 + ' kg</text>'+
					      		'<text x="5" y="135" style="font-size: 12px; font-weight: bold; font-family:돋움;">PM2.5 : ' + tmsPm25 + ' kg</text>'+
					      		'<text x="5" y="155" style="font-size: 12px; font-weight: bold; font-family:돋움;">VOC : ' + tmsVoc + ' kg</text>'+
					      		'<text x="5" y="175" style="font-size: 12px; font-weight: bold; font-family:돋움;">NH3 : ' + tmsNh3 + ' kg</text>'+
					      		'<text x="65" y="194" fill="white" style="font-size: 12px; font-weight: bold; font-family:돋움;" text-anchor="middle" alignment-baseline="middle">' + doNm + '</text>'+
					      	'</svg>';
		var imageSrc = 'data:image/svg+xml;charset=utf8,' + encodeURIComponent(iconTemplate);
		
		var img1 = document.createElement("IMG");
		img1.height = 202;
		img1.width = 130;
		img1.src = imageSrc;
		var style =  new ol.style.Style({
			image: new ol.style.Icon({
				opacity: 1,
				img:img1,
				imgSize:[130,202]
			})
		});
		
		feature.setStyle(style);
	};
	
	var circleStyleFunction = function(feature, resolution){
		var lObj = layerObj[getLayerObjId(feature).layerName];
		
		var getFeatureValue = feature.getProperties();
		
		var featureValue = Math.round(getFeatureValue[lObj.valueText]);
		
		var size = lObj.circleSize;
		var fillColor = lObj.circleColor;
		
		var fetureText = '';
		
		if(getFeatureValue.CTY_NM){
			fetureText = getFeatureValue.CTY_NM + '\n' + numberWithCommas(featureValue) + lObj.unit;
		}else{
			fetureText = addrText[getFeatureValue.DO_NM] + '\n' + numberWithCommas(featureValue) + lObj.unit;
		}
		
		return new ol.style.Style({
			image : new ol.style.Circle({
				radius : size,
				fill : new ol.style.Fill({
					color : fillColor
				}),
				stroke : new ol.style.Stroke({
					color : fillColor,
					width : 5
				})
			}),
			text : createCircleTextStyle(feature, resolution, fetureText)
		});
	};
	var numberWithCommas = function (x) {
	    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	};
	
	
	var layerNmToLayerId = function(layerNm){
		if(instLayerObj[layerNm]){
			return instLayerObj[layerNm];
		}else{
			for(key in layerObj){
				var layerArr = layerObj[key].layerArr; 
				if(layerArr){
					for(var i = 0; i<layerArr.length; i++){
						if(layerNm == layerArr[i]){
							instLayerObj[layerNm] = key;
							return instLayerObj[layerNm];
						}
					}
				}else{
					if(layerObj[key].layerNm == layerNm){
						return instLayerObj[layerNm] = key;
					}
				}
			}
		}
	};
	var weatherStyleFunction = function(feature, resolution) {
		var layerObjId  =getLayerObjId(feature);
		var lObj = layerObj[layerObjId.layerName];
		var splitLayerNm = layerObjId.layerId;
		
		var properties = feature.getProperties();
		
		var featureValue = properties[lObj.valueText];
		
		var donm = properties.DO_NM;
		var addr = '';
		
		if(properties.CTY_NM){
			addr = properties.CTY_NM;
		}else{
			addr = properties.DO_NM;
		}
		
		var iconTemplate = '<svg width="57" height="#height#" version="1.1" xmlns="http://www.w3.org/2000/svg">'+
								'<defs><linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" /><stop offset="100%" style="stop-color:#ebebeb;stop-opacity:1" /></linearGradient></defs>'+
								'<rect rx="10" width="57" height="#height#" fill="url(#grad1)" style="stroke-width:1;stroke:#777777"></rect>'+
								'<rect y="#y#" width="57" height="22" fill="#001d51" style="stroke-width:1;stroke:#777777"></rect>';
		var yValue = 47;
		var zIndex = 1;
		var rectHeight = 75;
		var rectY = 53;
		var textY = 25;
		
		if(layerObjId.layerName=='layer1'){
			var weatherCode = properties.WEATHER_CODE;
			var weatherText = lObj.legend[weatherCode].title;
			var weatherBase64 = lObj.legend[weatherCode].base64;
			if(splitLayerNm=='SD_WEATHER_20' || properties.FLAG == 'SIDO'){
				iconTemplate += '<image x="13" y="5" href="data:image/png;base64,' + weatherBase64 + '" height="30" width="30"/>';
				zIndex = 2;
			}else{
				yValue = 14;
				rectHeight = 44;
				rectY = 22;
				textY = 10;
			}
			featureValue += '℃';
		}else{
			if(splitLayerNm=='SD_WEATHER_20' || properties.FLAG == 'SIDO'){
				zIndex = 2;
			}
			var wd = properties.WD;
			var wdObj = {'1':['0','15','15'],
						'2':['50','15','15'],
						'3':['50','15','15'],
						'4':['50','15','15'],
						'5':['50','15','15'],
						'6':['50','15','15'],
						'7':['50','15','15'],
						'8':['90','25','20'],
						'9':['90','25','20'],
						'10':['90','25','20'],
						'11':['130','25','20'],
						'12':['130','25','20'],
						'13':['130','25','20'],
						'14':['130','25','20'],
						'15':['130','25','20'],
						'16':['130','25','20'],
						'17':['180','28','20'],
						'18':['180','28','20'],
						'19':['180','28','20'],
						'20':['230','30','20'],
						'21':['230','30','20'],
						'22':['230','30','20'],
						'23':['230','30','20'],
						'24':['230','30','20'],
						'25':['230','30','20'],
						'26':['270','30','20'],
						'27':['270','30','20'],
						'28':['270','30','20'],
						'29':['310','30','20'],
						'30':['310','30','20'],
						'31':['310','30','20'],
						'32':['310','30','20'],
						'33':['310','30','20'],
						'34':['310','30','20'],
						'35':['0','15','15'],
						'36':['0','15','15']
						};
			if(wd==' ' || wd=='0'){
				iconTemplate += '<image x="13" y="5" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAIAAAC0Ujn1AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAA1SURBVEhL7cwhDgAgEMTA+/+nF4OAygsgSMe3lWtcg2twDa7h7bpaZrz4Zn2Ka3ANrsH1Jhml1uCef9AaDgAAAABJRU5ErkJggg==" height="30" width="30" />';
			}else{
				iconTemplate += '<image transform="rotate('+wdObj[wd][0]+' '+wdObj[wd][1]+' '+wdObj[wd][2]+')" x="13" y="5" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJ bWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdp bj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6 eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0 NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJo dHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlw dGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEu MC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVz b3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1N OkRvY3VtZW50SUQ9InhtcC5kaWQ6MEY5OUREMTE2N0I5MTFFODlEN0ZBMTA1ODBBODVCQkMiIHht cE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MEY5OUREMTA2N0I5MTFFODlEN0ZBMTA1ODBBODVCQkMi IHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiPiA8eG1wTU06 RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmRpZDo4QjRFNDdGQkFGNjdFODExODEw RENFRkM3MUUxNDU1QyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4QjRFNDdGQkFGNjdFODEx ODEwRENFRkM3MUUxNDU1QyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1w bWV0YT4gPD94cGFja2V0IGVuZD0iciI/PvUFyMEAAAGqSURBVHjaYvz//z/DQAAmhgECI89iFmIV ylTsIyoxPOlwYqSqxSCQFeqAV37a6gPU9zEI/P37j/5BDQJ/Bsri33//DpDFfwbK4t8jzce/fv8Z aRZTMagZkatFYLFYCqQ6QeLoCsWF+BgUpITxGvbg2VuGl+8+YZMCWVIBLE67sFoMtTwRSM1WkhFl 5uPmoMhXn77+YLj35DUomFKBls7H6WMky/2A1AoZMUFOPh5O8iz98p3hyav3P4DMcKClm/AGNZrl 9kBqg5ggrwCploMsffX+8wcgMwBo6UGCcYzFcgMgtV2Al0uC2GAHBe+Hz99eAJmeQEsvEJW4cFiu BKR283JxKPFwseNV++XbT4bP337cAzLdgJbeJTpV47FcAkjt4ORg0+fmYMOq5uuPXwzff/y6BGS6 Ay19QVJ2ImC5AJDayM7KYsfBzooi9+Pnb4afv/8cAjL9gZZ+IDkfE2E5KJWtYGFm9mNjZYaWZn+B 9fRfUKqNAFr6nawChEjLQTbOYWJiSgDx//37twCaT/+QXXKRYDmoZIOVQmVAS/9TVGSONuiHpcUA AQYA/PLCsylmU1cAAAAASUVORK5CYII=" height="30" width="30" />';
			}
			
			featureValue += 'm/s';
		}
		iconTemplate = iconTemplate.replace('#height#',rectHeight).replace('#height#',rectHeight).replace('#y#',rectY);
		iconTemplate += '<text x="30" y="' + yValue + '" fill="red" style="font-size: 12px; font-weight: bold; font-family:돋움" text-anchor="middle" alignment-baseline="middle">' + featureValue + '</text>';
		iconTemplate += '<text x="28" y="' + (yValue + 20) + '" fill="white" style="font-size: 12px; font-weight: bold; font-family:돋움" text-anchor="middle" alignment-baseline="middle">' + addr + '</text>';
		iconTemplate +='</svg>';
		
		var img1 = document.createElement("IMG");
		img1.height = rectHeight;
		img1.width = 57;
		img1.src = 'data:image/svg+xml;charset=utf8,' + encodeURIComponent(iconTemplate);
		
		var style =  new ol.style.Style({
			image: new ol.style.Icon({
				opacity: 1,
				img:img1,
				imgSize:[57,rectHeight]
			}),
	        zIndex:zIndex
		});
		
		
		feature.setStyle(style);
	}
	
	var weatherIcon = function(feature){
		/*var iconTemplate = '<svg width="195" height="45" version="1.1" xmlns="http://www.w3.org/2000/svg">'
				+ '<defs>'
				+ '<filter id="rectFilter" x="0" y="0" width="200%" height="200%">'
				+ '<feOffset result="offOut" in="SourceAlpha" dx="2" dy="2" />'
				+ '<feGaussianBlur result="blurOut" in="offOut" stdDeviation="2" />'
				+ '<feBlend in="SourceGraphic" in2="blurOut" mode="normal" />'
				+ '</filter>'
				+ '</defs>'
				+ '<rect width="195" height="45" rx="20" ry="20"  style="fill:rgb(255,255,255);stroke-width:3;stroke:rgb(0,0,0)" filter="url(#rectFilter)" ></rect>'
				+ '<image x="10" y="5" href="data:image/png;base64,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" height="34" width="35"/>'
				+ '<text x="50" y="28" fill="black"> '
				+ feature.properties.TMPRT+ '℃</text>'
				+ '<image x="90" y="7" href="data:image/png;base64,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" height="35" width="35" transform="rotate('
				+ feature.properties.WD
				+ ' 110 23)"/>'
				+ '<text x="140" y="28" fill="black"> '
				+ feature.properties.WS
				+ 'm/s </text>'
				+ '</svg>';*/
		var iconTemplate = '';
		if(feature.properties.TMPRT == " "){
			iconTemplate = '<svg width="90" height="45" version="1.1" xmlns="http://www.w3.org/2000/svg">'
				+ '<image x="10" y="5"  height="34" width="35"/>'
				+ '<text x="50" y="28" fill="black"> '
				+ '- ℃</text>'
				+ '</svg>';
		}else{
			iconTemplate = '<svg width="90" height="45" version="1.1" xmlns="http://www.w3.org/2000/svg">'
				//+ '<image x="10" y="5" href="data:image/png;base64,'+_ThemathicLayer.getWeatherLegend()[feature.properties.WEATHER_CODE].base64+'" height="34" width="35"/>'
				+ '<image x="10" y="5"  height="34" width="35"/>'
				+ '<text x="50" y="28" fill="black"> '
				+ feature.properties.TMPRT+'℃</text>'
				+ '</svg>';
		}
		
		/*var iconTemplate = '<svg width="90" height="45" version="1.1" xmlns="http://www.w3.org/2000/svg">'
			+ '<image x="10" y="5" href="data:image/png;base64,'+_ThemathicLayer.getWeatherLegend()[feature.properties.WEATHER_CODE].base64+'" height="34" width="35"/>'
			+ '<text x="50" y="28" fill="black"> '
			+ feature.properties.TMPRT+ '℃</text>'
			+ '</svg>';*/
		return iconTemplate;
	}
	
	var windIcon = function(feature){ 
		
		var iconTemplate = '';
		
		if(feature.properties.WD == " " || feature.properties.WS == " "){
			iconTemplate = '<svg width="110" height="45" version="1.1" xmlns="http://www.w3.org/2000/svg">'
				+ '<image x="11" y="7" height="30" width="30" transform="rotate(0 30 20)"/>'
				+ '<text x="50" y="28" fill="black"> '
				+ '- m/s </text>'
				+ '</svg>';
		}else{
			iconTemplate = '<svg width="110" height="45" version="1.1" xmlns="http://www.w3.org/2000/svg">'
				+ '<text x="30" y="28" fill="black"> '
				+ feature.properties.WS
				+ 'm/s </text>'
				+ '<image x="88" y="9" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAOCAYAAAAWo42rAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzU2MkI0QkM3MzYyMTFFODhBQUY5MjVBNEQyMzQxOTEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzU2MkI0QkQ3MzYyMTFFODhBQUY5MjVBNEQyMzQxOTEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDNTYyQjRCQTczNjIxMUU4OEFBRjkyNUE0RDIzNDE5MSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDNTYyQjRCQjczNjIxMUU4OEFBRjkyNUE0RDIzNDE5MSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pv65pxAAAADYSURBVHjaYvz//z8DDMhU7ENwgOBJhxMjjM3EgAYygu3BGB2woAv8+vOHARvAUPjzF5EKf/z8TZzC78Qq/PbjF1aFjNLle5cC6SgQR1yIj0FBShgs8eDZW4aX7z7B1C0DBU8mSFxWXJBBTIgXbCIIg9ggMZAcEGcxggIcGNBWQM4hoGnMzEyQoP377x/I1L9Aph0w4I8xQWPgGJBqef3+C9gzIAxig8Sgciieaf76/acb0AZLqKeOg8TgnkGLawUgdRHK1Qea9gCrQqhiUAgwAhUtRRYHCDAAGR5kb86xIDsAAAAASUVORK5CYII=" height="21" width="18" transform="rotate('
				+ feature.properties.WD
				+ ' 92 17)"/>'
				+ '</svg>';
		}
		
/*		var iconTemplate = '<svg width="110" height="45" version="1.1" xmlns="http://www.w3.org/2000/svg">'
				+ '<image x="11" y="7" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJ bWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdp bj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6 eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0 NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJo dHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlw dGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEu MC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVz b3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1N OkRvY3VtZW50SUQ9InhtcC5kaWQ6MEY5OUREMTE2N0I5MTFFODlEN0ZBMTA1ODBBODVCQkMiIHht cE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MEY5OUREMTA2N0I5MTFFODlEN0ZBMTA1ODBBODVCQkMi IHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiPiA8eG1wTU06 RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmRpZDo4QjRFNDdGQkFGNjdFODExODEw RENFRkM3MUUxNDU1QyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4QjRFNDdGQkFGNjdFODEx ODEwRENFRkM3MUUxNDU1QyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1w bWV0YT4gPD94cGFja2V0IGVuZD0iciI/PvUFyMEAAAGqSURBVHjaYvz//z/DQAAmhgECI89iFmIV ylTsIyoxPOlwYqSqxSCQFeqAV37a6gPU9zEI/P37j/5BDQJ/Bsri33//DpDFfwbK4t8jzce/fv8Z aRZTMagZkatFYLFYCqQ6QeLoCsWF+BgUpITxGvbg2VuGl+8+YZMCWVIBLE67sFoMtTwRSM1WkhFl 5uPmoMhXn77+YLj35DUomFKBls7H6WMky/2A1AoZMUFOPh5O8iz98p3hyav3P4DMcKClm/AGNZrl 9kBqg5ggrwCploMsffX+8wcgMwBo6UGCcYzFcgMgtV2Al0uC2GAHBe+Hz99eAJmeQEsvEJW4cFiu BKR283JxKPFwseNV++XbT4bP337cAzLdgJbeJTpV47FcAkjt4ORg0+fmYMOq5uuPXwzff/y6BGS6 Ay19QVJ2ImC5AJDayM7KYsfBzooi9+Pnb4afv/8cAjL9gZZ+IDkfE2E5KJWtYGFm9mNjZYaWZn+B 9fRfUKqNAFr6nawChEjLQTbOYWJiSgDx//37twCaT/+QXXKRYDmoZIOVQmVAS/9TVGSONuiHpcUA AQYA/PLCsylmU1cAAAAASUVORK5CYII=" height="30" width="30" transform="rotate('
				+ feature.properties.WD
				+ ' 30 20)"/>'
				+ '<text x="50" y="28" fill="black"> '
				+ feature.properties.WS
				+ 'm/s </text>'
				+ '</svg>';*/
		return iconTemplate;
	}
	
	var createCircleTextStyle = function(feature, resolution, fetureText) {
		var fillColor = '#ffffff';
		var size = '13px';
		var align = 'center';
		var baseline = 'top';
		
		var offsetX = 0;
		var offsetY = -5;
		var weight = 'bold';
		var placement = 'point';
		var maxAngle = undefined;
		var exceedLength = undefined;
		var rotation = 0.0;
		var font = weight + ' ' + size + ' Arial';
		
		return new ol.style.Text({
			textAlign : align == '' ? undefined : align,
			textBaseline : baseline,
			font : font,
			text : fetureText,
			fill : new ol.style.Fill({
				color : fillColor
			}),
			offsetX : offsetX,
			offsetY : offsetY,
			placement : placement,
			maxAngle : maxAngle,
			exceedLength : exceedLength,
			rotation : rotation
		});
	};
		
	var setZoomToLayer = function(){
		for(key in layerObj){
			if(layerObj[key].isVisible){
				setLayerOnOff({
					isFirst:true,
					layerName:key,
					isBtnOn:true,
				});
			}
		}
	};
	
	var getTmsLocation = function(options){
		var properties = options.properties;
		var coordX = 0;
		var coordY = 0;

		if(properties){
			coordX = properties.X;
			coordY = properties.Y;
		}

		var pageNum = options.pageNum;

		coordX!=0?tmsCoordX = coordX:coordX = tmsCoordX;
		coordY!=0?tmsCoordY = coordY:coordY = tmsCoordY;

		var cqlFilter = 'X >=' + (parseFloat(coordX) - 0.0005);
		cqlFilter += 'AND X <=' + (parseFloat(coordX) + 0.0005);
		cqlFilter += 'AND Y >=' + (parseFloat(coordY) - 0.0005);
		cqlFilter += 'AND Y <=' + (parseFloat(coordY) + 0.0005);

		_MapService.getWfs('GIS_TMS_FCLT','*',encodeURIComponent(cqlFilter)).then(function(response){
			var prop = response.features[pageNum].properties;
			var html = '';

			if(response.features.length > 1){
				html+='<div style="margin: 10px;">';
				for(var i = 0; i < response.features.length; i++){
					if(pageNum == i){
						html += '<a pageNum="'+i+'" style="background:url(/map/resources/images/icon/c8.png) no-repeat; padding: 0px 5px; cursor:pointer; font-size: 11px; color: white; margin-right: 5px; font-family: sans-serif;">'+(i+1)+'</a>';
					}else{
						html += '<a pageNum="'+i+'" style="background:url(/map/resources/images/icon/c11.png) no-repeat; padding: 0px 5px; cursor:pointer; font-size: 11px; color: white; margin-right: 5px; font-family: sans-serif;">'+(i+1)+'</a>';
					}
				}
				html+='</div>';
			}

			html += '<table class="map_info_table">' +
			'<caption></caption>' +
			'<colgroup>'+
			'<col style="width:108px;">'+
			'<col style="width:80px;">'+
			'<col style="width:108px;">'+
			'<col style="width:80px;">'+
			'</colgroup>'+
			'<tbody>'+
			'<tr>'+
			'<th scope="row">사업장명</th>'+
			'<td colspan="3">'+prop.FACT_MANAG+'</td>'+
			'</tr>'+
			'<tr>'+
			'<th scope="row">주소</th>'+
			'<td colspan="3">'+prop.FACT_ADRES+'</td>'+
			'</tr>'+
			'<tr>'+
			'<th scope="row">먼지 (TSP)</th>'+
			'<td>'+prop.TSP+'</td>'+
			'<th scope="row">황산화물 (SO<sub>X</sub>)</th>'+
			'<td>'+prop.SOX+'</td>'+
			'</tr>'+
			'<tr>'+
			'<th scope="row">질소산화물 (NO<sub>X</sub>)</th>'+
			'<td>'+prop.NOX+'</td>'+
			'<th scope="row">염화수소 (HCL)</th>'+
			'<td>'+prop.HCL+'</td>'+
			'</tr>'+
			'<tr>'+
			'<th scope="row">불화수소 (HF)</th>'+
			'<td>'+prop.HF+'</td>'+
			'<th scope="row">암모니아 (NH<sub>3</sub>)</th>'+
			'<td>'+prop.NH3+'</td>'+
			'</tr>'+
			'<tr>'+
			'<th scope="row">일산화탄소 (CO)</th>'+
			'<td colspan="3">'+prop.CO+'</td>'+
			'</tr>'+
			'</tbody>'+
			'</table>';

			$('#tmsLocationDiv').html(html);
			$('#tmsLocationDiv').find('a').on('click',function(){
				var pageNum = $(this).attr('pageNum');
				_ThemathicLayer.getTmsLocation({pageNum:pageNum});
			});
		});
	};
	
	return {
		init: function(){
			init();
		},
		getFeaturesWfsBbox: function(layerName,projection){
			return getFeaturesWfsBbox(layerName,projection);
		},
		setZoomToLayer: function(){
			setZoomToLayer();
		},
		getWeatherLegend: function(){
			return layerObj.layer1.legend;
		},
		weatherIcon: function(result){
			return weatherIcon(result)
		},
		windIcon: function(result){
			return windIcon(result)
		},
		getTmsLocation: function(options){
			getTmsLocation(options);
		},
		legendAreaSpan: function(layerName){
			setSyncLegend(layerName,false);
		}
	};
}();