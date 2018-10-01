package com.ce.smell.biz;

import java.util.HashMap;
import java.util.List;

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
	
}
