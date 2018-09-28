package com.ce.smell.biz;

import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import com.ce.smell.mapper.MapMapper;

@Service
@Repository
public class MapBiz {
	protected Log log = LogFactory.getLog(MapBiz.class);

	@Autowired
	private MapMapper mapMapper;
	
	@SuppressWarnings("unchecked")
	public List getCMAQ9KM() {
		return mapMapper.getCMAQ9KM();
	}
}
