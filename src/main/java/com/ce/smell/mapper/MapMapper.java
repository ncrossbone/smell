package com.ce.smell.mapper;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.ce.smell.model.MapVO;

@Repository
public interface MapMapper {
	
	public List<MapVO> getCMAQ9KM();
}
