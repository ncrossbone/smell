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
	
	@RequestMapping(value = "/getGrid", method = RequestMethod.POST)
	public List<Map<String, Object>> getGrid(@RequestBody HashMap param){
		return mapBiz.getGrid(param);
	}
}
