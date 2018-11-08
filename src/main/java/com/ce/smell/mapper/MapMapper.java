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
	
	public List<Map<String, Object>> complaintStatusGrid(HashMap param);
	public List<Map<String, Object>> portableMeasurementGrid(HashMap param);
	public List<Map<String, Object>> fixedMeasurementGrid(HashMap param);
	
	public List<Map<String, Object>> portableMeasurementClick(HashMap param);
	public List<Map<String, Object>> fixedMeasurementClick(HashMap param);
	
	public List<Map<String, Object>> getCity();
	public List<Map<String, Object>> getTown(HashMap param);
	
	public List<Map<String, Object>> getPOISelect();
	public List<Map<String, Object>> getPOISearch(HashMap param);
	
	public List<Map<String, Object>> getArea(HashMap param);
}
