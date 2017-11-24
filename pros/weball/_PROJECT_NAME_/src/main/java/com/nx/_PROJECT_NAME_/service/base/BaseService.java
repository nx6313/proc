package com.nx._PROJECT_NAME_.service.base;

import java.util.List;
import java.util.Map;

public interface BaseService<M extends java.io.Serializable, PK extends java.io.Serializable> {

	public void save(M model);

	public void saveOrUpdate(M model);

	public void merge(M model);

	public void update(M model);

	public void delete(PK id);

	public void deleteObject(M model);

	public M get(PK id);

	public int countAll();

	public List<M> listAll();

	/**
	 * 根据条件查找总数
	 * 
	 * @param hql
	 * @param paramlist
	 * @return
	 */
	public int countByWhere(final String hql, final Map<String, Object> paramMap);
	
	public boolean exists(PK id);

	public void flush();

	public void clear();

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
			boolean... sqlFlag);

	/**
	 * 获取封装的分页数据，自定义排序
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
			Map<String, Object> paramMap, boolean... sqlFlag);

}
