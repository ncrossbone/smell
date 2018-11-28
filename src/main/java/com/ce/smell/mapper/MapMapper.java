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
	public int insertAnals(HashMap param);
	public int deleteAnals(HashMap param);
	public int updateAnals(HashMap param);
	
	public List<Map<String, Object>> complaintStatusGrid(HashMap param);
	public List<Map<String, Object>> portableMeasurementGrid(HashMap param);
	public List<Map<String, Object>> fixedMeasurementGrid(HashMap param);
	public List<Map<String, Object>> odorOriginGrid(HashMap param);
	public List<Map<String, Object>> environmentCorporationGrid(HashMap param);
	public List<Map<String, Object>> unmannedOdorGrid(HashMap param);
	public List<Map<String, Object>> observatoryGrid(HashMap param);
	public List<Map<String, Object>> odorReductionGrid(HashMap param);
	public List<Map<String, Object>> reductionMonitoringGrid(HashMap param);
	public List<Map<String, Object>> sensoryEvaluationGrid(HashMap param);
	
	public List<Map<String, Object>> portableMeasurementClick(HashMap param);
	public List<Map<String, Object>> fixedMeasurementClick(HashMap param);
	public List<Map<String, Object>> sensoryEvaluationClick(HashMap param);
	public List<Map<String, Object>> environmentCorporationClick(HashMap param);
	public List<Map<String, Object>> unmannedOdorClick(HashMap param);
	public List<Map<String, Object>> observatoryClick(HashMap param);
	public List<Map<String, Object>> complaintStatusClick(HashMap param);
	public List<Map<String, Object>> reductionMonitoringClick(HashMap param);
	
	public List<Map<String, Object>> getCity();
	public List<Map<String, Object>> getTown(HashMap param);
	
	public List<Map<String, Object>> getPOISelect();
	public List<Map<String, Object>> getPOISearch(HashMap param);
	
	public List<Map<String, Object>> getArea(HashMap param);
	public List<Map<String, Object>> environmentCorporationItem(HashMap param);
	
	public List<Map<String, Object>> fixedMeasurementFeature(HashMap param);
	public List<Map<String, Object>> portableMeasurementFeature(HashMap param);
	public List<Map<String, Object>> sensoryEvaluationFeature(HashMap param);
	public List<Map<String, Object>> environmentCorporationFeature(HashMap param);
	public List<Map<String, Object>> unmannedOdorFeature(HashMap param);
	public List<Map<String, Object>> observatoryFeature(HashMap param);
	public List<Map<String, Object>> iotSensorInfoFeature(HashMap param);
	public List<Map<String, Object>> complaintStatusFeature(HashMap param);
	public List<Map<String, Object>> reductionMonitoringFeature(HashMap param);
	
	public List<Map<String, Object>> getIntrstList(HashMap param);
	public List<Map<String, Object>> getSensorList(HashMap param);
	
	public List<Map<String, Object>> getCoursModel(HashMap param);
	public List<Map<String, Object>> getCoursModelBySensor(HashMap param);
	
	public int updateSensor(HashMap param);
	
	public List<Map<String, Object>> getCvplTyCode(HashMap param);
	
	public List<Map<String, Object>> chartFeature(HashMap param);
	public List<Map<String, Object>> getChart(HashMap param);
}
