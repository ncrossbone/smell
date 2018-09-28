package com.ce.smell.model;

import org.springframework.stereotype.Repository;


@Repository
public class MapVO {

	private int ogr_fid;
	private int indexid;
	private int flag;
	public int getOgr_fid() {
		return ogr_fid;
	}
	public void setOgr_fid(int ogr_fid) {
		this.ogr_fid = ogr_fid;
	}
	public int getIndexid() {
		return indexid;
	}
	public void setIndexid(int indexid) {
		this.indexid = indexid;
	}
	public int getFlag() {
		return flag;
	}
	public void setFlag(int flag) {
		this.flag = flag;
	}
	
}
