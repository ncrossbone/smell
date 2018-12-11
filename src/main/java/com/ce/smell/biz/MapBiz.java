package com.ce.smell.biz;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.lang.reflect.Method;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
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
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

@Service
@Repository
public class MapBiz {
	protected Log log = LogFactory.getLog(MapBiz.class);

	private final String USER_AGENT = "Mozilla/5.0";

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
	public List<Map<String, Object>> getGrid(HashMap param) {
		List resultList = null;
		HashMap result = new HashMap();

		try {
			Method method = mapMapper.getClass().getDeclaredMethod(
					param.get("contentsId") + "Grid", param.getClass());
			resultList = (List) method.invoke(mapMapper, param);
		}catch(NullPointerException e){
			System.out.println("ERROR-1");
		}catch(Exception e) {
			System.out.println("ERROR-2");
		}

		return resultList;
	}

	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getChart(HashMap param) {
		return mapMapper.getChart(param);
	}

	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getCity() {
		return mapMapper.getCity();
	}

	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getTown(HashMap param) {
		return mapMapper.getTown(param);
	}

	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getClick(HashMap param) {
		List resultList = null;
		HashMap result = new HashMap();

		try {
			Method method = mapMapper.getClass().getDeclaredMethod(
					param.get("contentsId") + "Click", param.getClass());
			resultList = (List) method.invoke(mapMapper, param);
		}catch(NullPointerException e){
			System.out.println("ERROR-1");
		}catch(Exception e) {
			System.out.println("ERROR-2");
		}

		return resultList;
	}

	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getPOISelect() {
		return mapMapper.getPOISelect();
	}

	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getPOISearch(HashMap param) {
		return mapMapper.getPOISearch(param);
	}

	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getArea(HashMap param) {
		return mapMapper.getArea(param);
	}

	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getItem(HashMap param) {
		List resultList = null;
		HashMap result = new HashMap();

		try {
			Method method = mapMapper.getClass().getDeclaredMethod(
					param.get("contentsId") + "Item", param.getClass());
			resultList = (List) method.invoke(mapMapper, param);
		}catch(NullPointerException e){
			System.out.println("ERROR-1");
		}catch(Exception e) {
			System.out.println("ERROR-2");
		}

		return resultList;
	}

	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getFeature(HashMap param) {
		List resultList = null;
		HashMap result = new HashMap();

		try {
			Method method = mapMapper.getClass().getDeclaredMethod(
					param.get("contentsId") + "Feature", param.getClass());
			resultList = (List) method.invoke(mapMapper, param);
		}catch(NullPointerException e){
			System.out.println("ERROR-1");
		}catch(Exception e) {
			System.out.println("ERROR-2");
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
	public List<Map<String, Object>> getCoursModel(HashMap param) throws Exception {
		String type = (String)param.get("type");
		
		if("cours_sensor".equals(type)){
			return mapMapper.getCoursModelBySensor(param); 
		}else{
			URL url = new URL("http://112.217.167.123:60001/web/latticeAjax?lattice="+param.get("analsAreaId")+"&dt="+param.get("dtaDt")+"00&paramSeCode=ANL02001");
			
			HttpURLConnection con = (HttpURLConnection) url.openConnection();
			con.setRequestMethod("GET"); // optional default is GET 
			con.setRequestProperty("User-Agent", USER_AGENT); // add request header 
			int responseCode = con.getResponseCode(); 
			BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream())); 
			
			String inputLine; StringBuffer response = new StringBuffer();
			
			while ((inputLine = in.readLine()) != null) { 
				response.append(inputLine); 
			} 
			in.close();  
			
			List result = new ArrayList<Map<String, Object>>();
			
			if(responseCode == 200){
				JsonParser jsonparse = new JsonParser();
				JsonObject restResult = (JsonObject)jsonparse.parse(response.toString());
				JsonArray resultList = null;
				
				try{
					resultList = (JsonArray)restResult.get("resultList");	
				}catch(java.lang.ClassCastException e){
					return result;
				}
				
				if (resultList != null) { 
				   for (int i=0;i<resultList.size();i++){
					   JsonObject piece =  (JsonObject)resultList.get(i);
					   HashMap<String, Object> item = new HashMap<String, Object>();
					   for (Map.Entry<String, JsonElement> entry : piece.entrySet()) {
							String key = entry.getKey();
							if("latitude".equals(key)){
								key = "utmx";
							}
							if("longitude".equals(key)){
								key = "utmy";
							}
							item.put(key,String.valueOf(entry.getValue()).replaceAll("\"", ""));
						}
					   result.add(item);
				   }
				}
				
				return result;
			}else{
				return result;
			}
		}
		
//		if("cours_now".equals(type)){
//			param.put("tableNm", "RLTM_MVMN_COURS_MODEL");
//		}else if("cours_forecast".equals(type)){
//			param.put("tableNm", "FRCST_MVMN_COURS_MODEL ");
//		}else{
//			return mapMapper.getCoursModelBySensor(param); 
//		} 
//		return mapMapper.getCoursModel(param);
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
	 * 
	 * @param param
	 * @return
	 */
	// 민원분류
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getCvplTyCode(HashMap param) {
		// TODO Auto-generated method stub
		return mapMapper.getCvplTyCode(param);
	}

	// 청주시군구
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getSigunguCode(HashMap param) {
		// TODO Auto-generated method stub
		return mapMapper.getSigunguCode(param);
	}

	// 민원데이터 list
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getCvplDataManageList(HashMap param) {
		// TODO Auto-generated method stub
		return mapMapper.getCvplDataManageList(param);
	}

	// 민원등록
	@SuppressWarnings("unchecked")
	public int insertCvplData(HashMap param) {
		return mapMapper.insertCvplData(param);
	}
	
	//민원수정
	@SuppressWarnings("unchecked")
	public int updateCvplData(HashMap param) {
		return mapMapper.updateCvplData(param);
	}
	
	//민원상세
	@SuppressWarnings("unchecked")
	public Map<String, Object> getCvplDataDetail(HashMap param) {
		// TODO Auto-generated method stub
		return mapMapper.getCvplDataDetail(param);
	}

	// 악취저감설비 정보
	@SuppressWarnings("unchecked")
	public Map<String, Object> getBsmlReduceqpInfo(HashMap param) {
		// TODO Auto-generated method stub
		return mapMapper.getBsmlReduceqpInfo(param);
	}

	// 악취저감설비 제어
	@SuppressWarnings("unchecked")
	public int insertOnOff(HashMap param) {
		return mapMapper.insertOnOff(param);
	}

	// 센서 선택 - 이동식
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getDeviceList(HashMap param) {
		// TODO Auto-generated method stub
		return mapMapper.getDeviceList(param);
	}

	// 센서 조회 - 이동식
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getDeviceInfoList(HashMap param) {
		// TODO Auto-generated method stub
		return mapMapper.getDeviceInfoList(param);
	}

	// 센서 차트 조회 - 이동식
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getDeviceChartList(HashMap param) {
		// TODO Auto-generated method stub
		return mapMapper.getDeviceChartList(param);
	}

	// 악취발생예보
	@SuppressWarnings("unchecked")
	public Map<String, Object> getForeCastOccurrence(HashMap param) {
		// TODO Auto-generated method stub
		return mapMapper.getForeCastOccurrence(param);
	}

	// 악취발생예보 - 건수선택
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getForeCastOccurrenceSel(HashMap param) {
		// TODO Auto-generated method stub
		return mapMapper.getForeCastOccurrenceSel(param);
	}

	// 저감장치가동현황
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getReductionFacil(HashMap param) {
		// TODO Auto-generated method stub
		return mapMapper.getReductionFacil(param);
	}

	// 관심지역 목록
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getAnalsAreaList(HashMap param) {
		// TODO Auto-generated method stub
		return mapMapper.getAnalsAreaList(param);
	}

	// 악취 발생 예보 현황 목록
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getOccurrenceForecastList(HashMap param) {
		// TODO Auto-generated method stub
		return mapMapper.getOccurrenceForecastList(param);
	}

	public List<Map<String, Object>> getOdorForecastXY(HashMap param) {
		// TODO Auto-generated method stub
		return mapMapper.getOdorForecastXY(param);
	}

	public List<Map<String, Object>> getPlotLine(HashMap param) {
		// TODO Auto-generated method stub
		return mapMapper.getPlotLine(param);
	}
}
