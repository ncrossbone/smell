package com.ce.smell.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ce.smell.biz.MapBiz;

@RestController
public class MapController {

	@Autowired
	private MapBiz mapBiz;
	
	@RequestMapping("/getFlag")
	public List getFlag() {
		return mapBiz.getCMAQ9KM();
	}
}
