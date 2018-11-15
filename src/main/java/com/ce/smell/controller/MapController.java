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
	
	@RequestMapping("/getFlag")
	public List<MapVO> getFlag() {
		return mapBiz.getCMAQ9KM();
	}
	
	@RequestMapping("/putFlag")
	public int putFlag(@RequestParam String flag,@RequestParam String indexId) {
		HashMap<String, String> param = new HashMap<String, String>();
		param.put("flag", flag);
		param.put("indexId", indexId);
		return mapBiz.putFlag(param);
	}
	
	@RequestMapping("/insertAnals")
	public int insertAnals(@RequestParam String indexId) {
		HashMap<String, String> param = new HashMap<String, String>();
		param.put("indexId", indexId);
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
	public List<Map<String, Object>> getCoursModel(@RequestBody HashMap param){
		return mapBiz.getCoursModel(param);
	}
	
}
