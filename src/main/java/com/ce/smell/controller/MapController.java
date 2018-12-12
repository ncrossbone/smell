package com.ce.smell.controller;

import java.util.HashMap;

import com.ce.smell.model.MapVO;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ce.smell.biz.MapBiz;

@RestController
public class MapController {

	@Autowired
	private MapBiz mapBiz;
	
	@RequestMapping("/putFlag")
	public int putFlag(@RequestParam String flag,@RequestParam String indexId) {
		HashMap<String, String> param = new HashMap<String, String>();
		param.put("flag", flag);
		param.put("indexId", indexId);
		return mapBiz.putFlag(param);
	}
	
	@RequestMapping(value = "/insertAnals" , method = RequestMethod.POST)
	public int insertAnals(@RequestBody HashMap param) {
		return mapBiz.insertAnals(param);
	} 
	
	@RequestMapping("/deleteAnals")
	public int deleteAnals(@RequestParam String indexId) {
		HashMap<String, String> param = new HashMap<String, String>();
		param.put("indexId", indexId);
		return mapBiz.deleteAnals(param);
	}
	
	@RequestMapping(value = "/getGrid", method = RequestMethod.POST)
	public List<Map<String, Object>> getGrid(@RequestBody HashMap param){
		return mapBiz.getGrid(param);
	}
	
	@RequestMapping(value = "/getChart", method = RequestMethod.POST)
	public List<Map<String, Object>> getChart(@RequestBody HashMap param){
		return mapBiz.getChart(param);
	}
	
	@RequestMapping(value = "/getPlotLine", method = RequestMethod.POST)
	public List<Map<String, Object>> getPlotLine(@RequestBody HashMap param){
		return mapBiz.getPlotLine(param);
	}
	
	@RequestMapping(value = "/getCity", method = RequestMethod.POST)
	public List<Map<String, Object>> getCity(){
		return mapBiz.getCity();
	}
	
	@RequestMapping(value = "/getTown", method = RequestMethod.POST)
	public List<Map<String, Object>> getTown(@RequestBody HashMap param){
		return mapBiz.getTown(param);
	}
	
	@RequestMapping(value = "/getClick", method = RequestMethod.POST)
	public List<Map<String, Object>> getClick(@RequestBody HashMap param){
		return mapBiz.getClick(param);
	}
	
	@RequestMapping(value = "/getPOISelect", method = RequestMethod.POST)
	public List<Map<String, Object>> getPOISelect(){
		return mapBiz.getPOISelect();
	}
	
	@RequestMapping(value = "/getPOISearch", method = RequestMethod.POST)
	public List<Map<String, Object>> getPOISearch(@RequestBody HashMap param){
		return mapBiz.getPOISearch(param);
	}
	
	@RequestMapping(value = "/getArea", method = RequestMethod.POST)
	public List<Map<String, Object>> getArea(@RequestBody HashMap param){
		return mapBiz.getArea(param);
	}

	@RequestMapping(value = "/getItem", method = RequestMethod.POST)
	public List<Map<String, Object>> getItem(@RequestBody HashMap param){
		return mapBiz.getItem(param);
	}
	
	@RequestMapping(value = "/getFeature", method = RequestMethod.POST)
	public List<Map<String, Object>> getFeature(@RequestBody HashMap param){
		return mapBiz.getFeature(param);
	}
	
	@RequestMapping(value = "/getIntrstList", method = RequestMethod.POST)
	public List<Map<String, Object>> getIntrstList(){
		return mapBiz.getIntrstList(null);
	}
	@RequestMapping(value = "/getSensorList", method = RequestMethod.POST)
	public List<Map<String, Object>> getSensorList(){
		return mapBiz.getSensorList(null);
	}
	@RequestMapping(value = "/getCoursModel", method = RequestMethod.POST)
	public List<Map<String, Object>> getCoursModel(@RequestBody HashMap param) throws Exception{
		return mapBiz.getCoursModel(param);
	}
	@RequestMapping("/updateSensor")
	public int updateSensor(@RequestBody HashMap param) {
		return mapBiz.updateSensor(param);
	}
	
	@RequestMapping(value = "/getAnalsAreaId" , method = RequestMethod.POST)
	public List<Map<String, Object>> getAnalsAreaId(@RequestBody HashMap param) {
		return mapBiz.getAnalsAreaId(param);
	}
	
	/**
	 * 개발팀 csw
	 * @param param
	 * @return
	 */
	//민원분류
	@RequestMapping(value = "/getCvplTyCode", method = RequestMethod.POST)
	public List<Map<String, Object>> getCvplTyCode(@RequestBody HashMap param){
		return mapBiz.getCvplTyCode(param);
	}
	
	//청주시군구
	@RequestMapping(value = "/getSigunguCode", method = RequestMethod.POST)
	public List<Map<String, Object>> getSigunguCode(@RequestBody HashMap param){
		return mapBiz.getSigunguCode(param);
	}
	
	//민원데이터 조회
	@RequestMapping(value = "/getCvplDataManageList", method = RequestMethod.POST)
	public List<Map<String, Object>> getCvplDataManageList(@RequestBody HashMap param){
		return mapBiz.getCvplDataManageList(param);
	}
	
	//민원등록
	@RequestMapping(value = "/insertCvplData" , method = RequestMethod.POST)
	public int insertCvplData(@RequestBody HashMap param) {
		return mapBiz.insertCvplData(param);
	}
	
	//민원수정
	@RequestMapping(value = "/updateCvplData" , method = RequestMethod.POST)
	public int updateCvplData(@RequestBody HashMap param) {
		return mapBiz.updateCvplData(param);
	}
	
	//민원상세
	@RequestMapping(value = "/getCvplDataDetail", method = RequestMethod.POST)
	public Map<String, Object> getCvplDataDetail(@RequestBody HashMap param){
		return mapBiz.getCvplDataDetail(param);
	}

	//악취저감설비 정보
	@RequestMapping(value = "/getBsmlReduceqpInfo", method = RequestMethod.POST)
	public Map<String, Object> getBsmlReduceqpInfo(@RequestBody HashMap param){
		return mapBiz.getBsmlReduceqpInfo(param);
	}
	
	//악취저감설비 제어
	@RequestMapping(value = "/insertOnOff" , method = RequestMethod.POST)
	public int insertOnOff(@RequestBody HashMap param) {
		return mapBiz.insertOnOff(param);
	} 
	
	//센서 선택 - 이동식
	@RequestMapping(value = "/getDeviceList", method = RequestMethod.POST)
	public List<Map<String, Object>> getDeviceList(@RequestBody HashMap param){
		return mapBiz.getDeviceList(param);
	}
	
	//센서 조회 - 이동식
	@RequestMapping(value = "/getDeviceInfoList", method = RequestMethod.POST)
	public List<Map<String, Object>> getDeviceInfoList(@RequestBody HashMap param){
		return mapBiz.getDeviceInfoList(param);
	}
	
	//센서 차트 조회 - 이동식
	@RequestMapping(value = "/getDeviceChartList", method = RequestMethod.POST)
	public List<Map<String, Object>> getDeviceChartList(@RequestBody HashMap param){
		return mapBiz.getDeviceChartList(param);
	}
	
	//악취발생예보
	@RequestMapping(value = "/getForeCastOccurrence", method = RequestMethod.POST)
	public Map<String, Object> getForeCastOccurrence(@RequestBody HashMap param){
		return mapBiz.getForeCastOccurrence(param);
	}
	
	//악취발생예보 - 건수선택
	@RequestMapping(value = "/getForeCastOccurrenceSel", method = RequestMethod.POST)
	public List<Map<String, Object>> getForeCastOccurrenceSel(@RequestBody HashMap param){
		return mapBiz.getForeCastOccurrenceSel(param);
	}
	
	//저감장치가동현황
	@RequestMapping(value = "/getReductionFacil", method = RequestMethod.POST)
	public List<Map<String, Object>> getReductionFacil(@RequestBody HashMap param){
		return mapBiz.getReductionFacil(param);
	}
	
	//관심지역 목록
	@RequestMapping(value = "/getAnalsAreaList", method = RequestMethod.POST)
	public List<Map<String, Object>> getAnalsAreaList(@RequestBody HashMap param){
		return mapBiz.getAnalsAreaList(param);
	}
	
	//악취 발생 예보 현황 목록
	@RequestMapping(value = "/getOccurrenceForecastList", method = RequestMethod.POST)
	public List<Map<String, Object>> getOccurrenceForecastList(@RequestBody HashMap param){
		return mapBiz.getOccurrenceForecastList(param);
	}
	@RequestMapping(value = "/getOdorForecastXY", method = RequestMethod.POST)
	public List<Map<String, Object>> getOdorForecastXY(@RequestBody HashMap param){
		return mapBiz.getOdorForecastXY(param);
	}
	
	@RequestMapping(value = "/sendMsg", method = RequestMethod.POST)
	public int sendMsg(@RequestBody HashMap param){
		return mapBiz.sendMsg(param);
	}
	
}
