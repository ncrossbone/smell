package com.ce.smell.model;

import org.springframework.stereotype.Repository;



@Repository
public class MapVO {

	private int ogr_fid;
	private int indexid;
	private int flag;
	
	
	private String cityDistrict;
	private String town;
	private String branchName;
	private String startDate;
	private String endDate;
	
	public String getCityDistrict() {
		return cityDistrict;
	}
	public void setCityDistrict(String cityDistrict) {
		this.cityDistrict = cityDistrict;
	}
	public String getTown() {
		return town;
	}
	public void setTown(String town) {
		this.town = town;
	}
	public String getBranchName() {
		return branchName;
	}
	public void setBranchName(String branchName) {
		this.branchName = branchName;
	}
	public String getStartDate() {
		return startDate;
	}
	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}
	public String getEndDate() {
		return endDate;
	}
	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}
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
