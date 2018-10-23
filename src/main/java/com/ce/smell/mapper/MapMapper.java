package com.ce.smell.mapper;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.ce.smell.model.MapVO;

@Repository
public interface MapMapper {
	
	public List<MapVO> getCMAQ9KM();
	
	public int putFlag(HashMap param);
	
	public List<Map<String, Object>> getGrid(MapVO param);
}
