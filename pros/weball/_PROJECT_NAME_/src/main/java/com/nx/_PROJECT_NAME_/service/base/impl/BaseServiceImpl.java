package com.nx._PROJECT_NAME_.service.base.impl;

import java.util.List;
import java.util.Map;

import com.nx._PROJECT_NAME_.dao.base.BaseDao;
import com.nx._PROJECT_NAME_.service.base.BaseService;
import com.nx._PROJECT_NAME_.util.ComFun;
import com.nx._PROJECT_NAME_.util.PageWrap;

public abstract class BaseServiceImpl<M extends java.io.Serializable, PK extends java.io.Serializable>
		implements BaseService<M, PK> {
	protected BaseDao<M, PK> baseDao;

	public abstract void setBaseDao(BaseDao<M, PK> baseDao);

	public void save(M model) {
		baseDao.save(model);
	}

	public void saveOrUpdate(M model) {
		baseDao.saveOrUpdate(model);
	}

	public void merge(M model) {
		baseDao.merge(model);
	}

	public void update(M model) {
		baseDao.update(model);
	}

	public void delete(PK id) {
		baseDao.delete(id);
	}

	public void deleteObject(M model) {
		baseDao.deleteObject(model);
	}

	public M get(PK id) {
		return baseDao.get(id);
	}

	public int countAll() {
		return baseDao.countAll();
	}

	public List<M> listAll() {
		return baseDao.listAll();
	}

	/**
	 * 根据条件查找总数
	 */
	public int countByWhere(final String hql, final Map<String, Object> paramMap) {
		return baseDao.countByWhere(hql, paramMap);
	}

	public boolean exists(PK id) {
		return baseDao.exists(id);
	}

	public void flush() {
		baseDao.flush();
	}

	public void clear() {
		baseDao.clear();
	}

	/**
	 * 获取封装的分页数据
	 * 
	 * @param pageIndex
	 *            当前查询页数
	 * @param pageSize
	 *            每页查询条数
	 * @param paramMap
	 *            查询相关参数
	 * @param sqlFlag
	 *            可选参数，如果采用SQL语句查询，则传为true，否则传为false；默认false，采用HQL的查询方式
	 * 
	 * @return
	 */
	public Map<String, Object> getDataByPage(int pageIndex, int pageSize, Map<String, Object> paramMap,
			boolean... sqlFlag) {
		int dataCount = baseDao.getLayerCountAll(paramMap);
		int pageCount = (int) Math.ceil(Float.parseFloat(dataCount + "f") / Float.parseFloat(pageSize + "f"));
		// 页码处理，防止删除后，数据在某一页上没有一条数据，导致页面显示异常
		int start = (pageIndex - 1) * pageSize;
		if (start >= dataCount) {
			if (pageIndex > 0) {
				pageIndex = pageIndex - 1;
			} else {
				pageIndex = 0;
			}
		}
		if (ComFun.strNull(sqlFlag, true) && sqlFlag[0]) {
			PageWrap<Object[]> pageWrap = new PageWrap<Object[]>();
			List<Object[]> dataList = baseDao.getLayerPageDataBySql(pageIndex, pageSize, paramMap);
			pageWrap.setChild(dataList);
			pageWrap.setPageCount(pageCount);
			pageWrap.setDataCount(dataCount);
			pageWrap.setCurrentPage(pageIndex);
			pageWrap.setPageSize(pageSize);
			return pageWrap.getPageDataWrapMap();
		} else {
			PageWrap<M> pageWrap = new PageWrap<M>();
			List<M> dataList = baseDao.getLayerPageData(pageIndex, pageSize, paramMap);
			pageWrap.setChild(dataList);
			pageWrap.setPageCount(pageCount);
			pageWrap.setDataCount(dataCount);
			pageWrap.setCurrentPage(pageIndex);
			pageWrap.setPageSize(pageSize);
			return pageWrap.getPageDataWrapMap();
		}
	}

	/**
	 * 获取封装的分页数据
	 * 
	 * @param pageIndex
	 *            当前查询页数
	 * @param pageSize
	 *            每页查询条数
	 * @param sortName
	 *            参与排序字段
	 * @param sortOrder
	 *            参与排序方式
	 * @param paramMap
	 *            查询相关参数
	 * @param sqlFlag
	 *            可选参数，如果采用SQL语句查询，则传为true，否则传为false；默认false，采用HQL的查询方式
	 * 
	 * @return
	 */
	public Map<String, Object> getDataBySortPage(int pageIndex, int pageSize, String sortName, String sortOrder,
			Map<String, Object> paramMap, boolean... sqlFlag) {
		int dataCount = baseDao.getLayerCountAll(paramMap);
		int pageCount = (int) Math.ceil(Float.parseFloat(dataCount + "f") / Float.parseFloat(pageSize + "f"));
		// 页码处理，防止删除后，数据在某一页上没有一条数据，导致页面显示异常
		int start = (pageIndex - 1) * pageSize;
		if (start >= dataCount) {
			if (pageIndex > 0) {
				pageIndex = pageIndex - 1;
			} else {
				pageIndex = 0;
			}
		}
		if (ComFun.strNull(sqlFlag, true) && sqlFlag[0]) {
			PageWrap<Object[]> pageWrap = new PageWrap<Object[]>();
			List<Object[]> dataList = baseDao.getLayerSortPageDataBySql(pageIndex, pageSize, sortName, sortOrder, paramMap);
			pageWrap.setChild(dataList);
			pageWrap.setPageCount(pageCount);
			pageWrap.setDataCount(dataCount);
			pageWrap.setCurrentPage(pageIndex);
			pageWrap.setPageSize(pageSize);
			return pageWrap.getPageDataWrapMap();
		} else {
			PageWrap<M> pageWrap = new PageWrap<M>();
			List<M> dataList = baseDao.getLayerSortPageData(pageIndex, pageSize, sortName, sortOrder, paramMap);
			pageWrap.setChild(dataList);
			pageWrap.setPageCount(pageCount);
			pageWrap.setDataCount(dataCount);
			pageWrap.setCurrentPage(pageIndex);
			pageWrap.setPageSize(pageSize);
			return pageWrap.getPageDataWrapMap();
		}
	}
}
