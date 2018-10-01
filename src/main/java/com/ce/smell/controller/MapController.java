package com.ce.smell.controller;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ce.smell.biz.MapBiz;
import com.ce.smell.model.MapVO;

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
}
