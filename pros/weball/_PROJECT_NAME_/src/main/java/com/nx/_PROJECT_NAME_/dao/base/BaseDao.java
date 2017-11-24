package com.nx._PROJECT_NAME_.dao.base;

import java.util.List;
import java.util.Map;

public interface BaseDao<M extends java.io.Serializable, PK extends java.io.Serializable> {

	public void save(M model);

	public void saveOrUpdate(M model);

	public void merge(M model);

	public void update(M model);

	public void delete(PK id);

	public void deleteObject(M model);

	public M get(PK id);

	public M getModelByWhere(final String hql, final Map<String, Object> paramMap);

	public int countAll();

	public List<M> listAll();

	public List<M> listByWhere(final String hql);

	public List<M> listByWhere(final String hql, final Map<String, Object> paramMap);

	public List<M> listByWhereSort(final String hql, final String sortName, final String sortOrder);

	public List<M> listByWhereSort(final String hql, final String sortName, final String sortOrder,
			final Map<String, Object> paramMap);

	public boolean exists(PK id);

	public void flush();

	public void clear();

	public int countByWhere(final String hql);

	public int countByWhere(final String hql, final Map<String, Object> paramMap);

	public int getLayerCountAll(Map<String, Object> paramMap);

	public List<M> getLayerPageData(int pageIndex, int pageSize, Map<String, Object> paramMap);
	
	public List<M> getLayerSortPageData(int pageIndex, int pageSize, String sortName, String sortOrder, Map<String, Object> paramMap);

	public List<Object[]> getLayerPageDataBySql(int pageIndex, int pageSize, Map<String, Object> paramMap);
	
	public List<Object[]> getLayerSortPageDataBySql(int pageIndex, int pageSize, String sortName, String sortOrder, Map<String, Object> paramMap);

}
