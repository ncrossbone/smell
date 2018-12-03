package com.ce.smell.biz;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import com.ce.smell.mapper.MapMapper;
import com.ce.smell.model.MapVO;

@Service
@Repository
public class MapBiz {
	protected Log log = LogFactory.getLog(MapBiz.class);

	@Autowired
	private MapMapper mapMapper;
	
	@SuppressWarnings("unchecked")
	public List<MapVO> getCMAQ9KM() {
		return mapMapper.getCMAQ9KM();
	}
	
	@SuppressWarnings("unchecked")
	public int insertAnals(HashMap param) {
		mapMapper.updateAnals(param);
		return mapMapper.insertAnals(param);
	}
	
	@SuppressWarnings("unchecked")
	public int deleteAnals(HashMap param) {
		return mapMapper.deleteAnals(param);
	}
	
	@SuppressWarnings("unchecked")
	public int putFlag(HashMap param) {
		return mapMapper.putFlag(param);
	}
	
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getGrid(HashMap param){
		List resultList = null;
		HashMap result = new HashMap();
		
		try {
			Method method = mapMapper.getClass().getDeclaredMethod(param.get("contentsId") + "Grid",param.getClass());
			resultList = (List) method.invoke(mapMapper, param);
		} catch (Exception e) {
			e.printStackTrace();
		}

		return resultList;
	}
	
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getChart(HashMap param){
		return mapMapper.getChart(param);
	}
	
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getCity(){
		return mapMapper.getCity();
	}
	
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getTown(HashMap param){
		return mapMapper.getTown(param);
	}
	
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getClick(HashMap param){
		List resultList = null;
		HashMap result = new HashMap();
		
		try {
			Method method = mapMapper.getClass().getDeclaredMethod(param.get("contentsId") + "Click",param.getClass());
			resultList = (List) method.invoke(mapMapper, param);
		} catch (Exception e) {
			e.printStackTrace();
		}

		return resultList;
	}
	
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getPOISelect(){
		return mapMapper.getPOISelect();
	}
	
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getPOISearch(HashMap param){
		return mapMapper.getPOISearch(param);
	}
	
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getArea(HashMap param){
		return mapMapper.getArea(param);
	}
	
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getItem(HashMap param){
		List resultList = null;
		HashMap result = new HashMap();
		
		try {
			Method method = mapMapper.getClass().getDeclaredMethod(param.get("contentsId") + "Item",param.getClass());
			resultList = (List) method.invoke(mapMapper, param);
		} catch (Exception e) {
			e.printStackTrace();
		}

		return resultList;
	}
	
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getFeature(HashMap param){
		List resultList = null;
		HashMap result = new HashMap();
		
		try {
			Method method = mapMapper.getClass().getDeclaredMethod(param.get("contentsId") + "Feature",param.getClass());
			resultList = (List) method.invoke(mapMapper, param);
		} catch (Exception e) {
			e.printStackTrace();
		}

		return resultList;
	}
	
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getIntrstList(HashMap param) {
		// TODO Auto-generated method stub
		return mapMapper.getIntrstList(param);
	}
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getSensorList(HashMap param) {
		// TODO Auto-generated method stub
		return mapMapper.getSensorList(param);
	}
	
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getCoursModel(HashMap param) {
		String type = (String)param.get("type");
		if("cours_now".equals(type)){
			param.put("tableNm", "RLTM_MVMN_COURS_MODEL");
		}else if("cours_forecast".equals(type)){
			param.put("tableNm", "FRCST_MVMN_COURS_MODEL ");
		}else{
			return mapMapper.getCoursModelBySensor(param); 
		} 
		return mapMapper.getCoursModel(param);
	}
	@SuppressWarnings("unchecked")
	public int updateSensor(HashMap param) {
		return mapMapper.updateSensor(param);
	}
	
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getAnalsAreaId(HashMap param) {
		return mapMapper.getAnalsAreaId(param);
	}
	
	/**
	 * 개발팀 csw
	 * @param param
	 * @return
	 */
	//민원분류
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getCvplTyCode(HashMap param) {
		// TODO Auto-generated method stub
		return mapMapper.getCvplTyCode(param);
	}

	//청주시군구
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getSigunguCode(HashMap param) {
		// TODO Auto-generated method stub
		return mapMapper.getSigunguCode(param);
	}
	
	//민원데이터 list
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getCvplDataManageList(HashMap param) {
		// TODO Auto-generated method stub
		return mapMapper.getCvplDataManageList(param);
	}
	
	//민원등록
	@SuppressWarnings("unchecked")
	public int insertCvplData(HashMap param) {
		return mapMapper.insertCvplData(param);
	}
	
	//악취저감설비 정보
	@SuppressWarnings("unchecked")
	public Map<String, Object> getBsmlReduceqpInfo(HashMap param) {
		// TODO Auto-generated method stub
		return mapMapper.getBsmlReduceqpInfo(param);
	}
	
	//악취저감설비 제어
	@SuppressWarnings("unchecked")
	public int insertOnOff(HashMap param) {
		return mapMapper.insertOnOff(param);
	}
	
	//센서 선택 - 이동식
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getDeviceList(HashMap param) {
		// TODO Auto-generated method stub
		return mapMapper.getDeviceList(param);
	}
	
	//센서 조회 - 이동식
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getDeviceInfoList(HashMap param) {
		// TODO Auto-generated method stub
		return mapMapper.getDeviceInfoList(param);
	}
	
	//센서 차트 조회 - 이동식
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getDeviceChartList(HashMap param) {
		// TODO Auto-generated method stub
		return mapMapper.getDeviceChartList(param);
	}
	
	//악취발생예보
	@SuppressWarnings("unchecked")
	public Map<String, Object> getForeCastOccurrence(HashMap param) {
		// TODO Auto-generated method stub
		return mapMapper.getForeCastOccurrence(param);
	}
	
	//악취발생예보 - 건수선택
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getForeCastOccurrenceSel(HashMap param) {
		// TODO Auto-generated method stub
		return mapMapper.getForeCastOccurrenceSel(param);
	}
	
	//저감장치가동현황
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getReductionFacil(HashMap param) {
		// TODO Auto-generated method stub
		return mapMapper.getReductionFacil(param);
	}
	
	//관심지역 목록
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getAnalsAreaList(HashMap param) {
		// TODO Auto-generated method stub
		return mapMapper.getAnalsAreaList(param);
	}
	
	//악취 발생 예보 현황 목록
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getOccurrenceForecastList(HashMap param) {
		// TODO Auto-generated method stub
		return mapMapper.getOccurrenceForecastList(param);
	}

	public List<Map<String, Object>> getOdorForecastXY(HashMap param) {
		// TODO Auto-generated method stub
		return mapMapper.getOdorForecastXY(param);
	}
}
