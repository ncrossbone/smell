package com.ce.smell.biz;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
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
	
}
