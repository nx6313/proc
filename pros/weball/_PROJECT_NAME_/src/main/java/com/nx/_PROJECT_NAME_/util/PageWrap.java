package com.nx._PROJECT_NAME_.util;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * layer分页使用
 * 
 * @author song
 *
 * @param <T>
 */
public class PageWrap<T> {
	// 该页数据
	private List<T> child;
	// 总页数
	private int pageCount;
	// 总条数
	private int dataCount;
	// 当前页数
	private int currentPage;
	// 每页显示条数
	private int pageSize;

	public List<T> getChild() {
		return child;
	}

	public void setChild(List<T> child) {
		this.child = child;
	}

	public int getPageCount() {
		return pageCount;
	}

	public void setPageCount(int pageCount) {
		this.pageCount = pageCount;
	}

	public int getDataCount() {
		return dataCount;
	}

	public void setDataCount(int dataCount) {
		this.dataCount = dataCount;
	}

	public int getCurrentPage() {
		return currentPage;
	}

	public void setCurrentPage(int currentPage) {
		this.currentPage = currentPage;
	}

	public int getPageSize() {
		return pageSize;
	}

	public void setPageSize(int pageSize) {
		this.pageSize = pageSize;
	}

	public Map<String, Object> getPageDataWrapMap() {
		Map<String, Object> pageDataMap = new HashMap<String, Object>();
		pageDataMap.put("child", getChild());
		pageDataMap.put("pageCount", getPageCount());
		pageDataMap.put("dataCount", getDataCount());
		pageDataMap.put("currentPage", getCurrentPage());
		pageDataMap.put("pageSize", getPageSize());
		return pageDataMap;
	}
}
