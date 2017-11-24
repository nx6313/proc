package com.nx._PROJECT_NAME_.dao.base.impl;

import java.lang.reflect.ParameterizedType;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.logging.Logger;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

import com.nx._PROJECT_NAME_.dao.base.BaseDao;
import com.nx._PROJECT_NAME_.util.ComFun;

public abstract class BaseDaoImpl<M extends java.io.Serializable, PK extends java.io.Serializable>
		implements BaseDao<M, PK> {
	protected static final Logger LOGGER = (Logger) LoggerFactory.getLogger(BaseDaoImpl.class);

	private final Class<M> entityClass;
	public static String HQL_LIST_ALL;
	public static String HQL_COUNT_ALL;

	@SuppressWarnings("unchecked")
	public BaseDaoImpl() {
		this.entityClass = (Class<M>) ((ParameterizedType) getClass().getGenericSuperclass())
				.getActualTypeArguments()[0];

		HQL_LIST_ALL = "from " + this.entityClass.getSimpleName() + " where state != 0 ";
		HQL_COUNT_ALL = " select count(*) from " + this.entityClass.getSimpleName() + " where state != 0";
	}

	@Autowired
	@Qualifier("sessionFactory")
	private SessionFactory sessionFactory;

	public Session getSession() {
		// 事务必须是开启的(Required)，否则获取不到
		return sessionFactory.getCurrentSession();
	}

	public void save(M model) {
		getSession().save(model);
	}

	public void saveOrUpdate(M model) {
		getSession().saveOrUpdate(model);
	}

	public void update(M model) {
		getSession().update(model);
	}

	public void merge(M model) {
		getSession().merge(model);
	}

	public void delete(PK id) {
		getSession().delete(this.get(id));
	}

	public void deleteObject(M model) {
		getSession().delete(model);
	}

	public boolean exists(PK id) {
		return get(id) != null;
	}

	public M get(PK id) {
		return (M) getSession().get(this.entityClass, id);
	}

	public M getModelByWhere(String hql, Map<String, Object> paramMap) {
		return aggregate(hql, paramMap);
	}

	public List<M> listAll() {
		StringBuilder hql = new StringBuilder(HQL_LIST_ALL);
		hql.append("order by createDate ");
		return list(hql.toString(), null);
	}

	/**
	 * 多条件查询
	 * 
	 * @param hql
	 * @param paramlist
	 * @return
	 */
	public List<M> listByWhere(final String hql) {
		return this.<M>list(hql, null);
	}

	/**
	 * 多条件查询
	 * 
	 * @param hql
	 * @param paramlist
	 * @return
	 */
	public List<M> listByWhere(final String hql, final Map<String, Object> paramMap) {
		return this.<M>list(hql, paramMap);
	}

	/**
	 * 多条件查询，可自定义排序
	 * 
	 * @param hql
	 * @param paramlist参数
	 * @return
	 */
	public List<M> listByWhereSort(final String hql, final String sortName, final String sortOrder) {
		StringBuilder shql = new StringBuilder(hql);
		if (sortName.isEmpty()) {
			shql.append(" order by createDate ");
		} else {
			shql.append(" order by ");
			shql.append(sortName);
		}
		if (sortOrder.isEmpty()) {
			shql.append(" desc");
		} else {
			shql.append(" ");
			shql.append(sortOrder);
		}
		return this.<M>list(shql.toString(), null);
	}

	/**
	 * 多条件查询，可自定义排序
	 * 
	 * @param hql
	 * @param paramlist参数
	 * @return
	 */
	public List<M> listByWhereSort(final String hql, final String sortName, final String sortOrder,
			final Map<String, Object> paramMap) {
		StringBuilder shql = new StringBuilder(hql);
		if (sortName.isEmpty()) {
			shql.append(" order by createDate ");
		} else {
			shql.append(" order by ");
			shql.append(sortName);
		}
		if (sortOrder.isEmpty()) {
			shql.append(" desc");
		} else {
			shql.append(" ");
			shql.append(sortOrder);
		}
		return this.<M>list(shql.toString(), paramMap);
	}

	/**
	 * 根据条件查找总数
	 * 
	 * @param paramlist
	 * @return
	 */
	public int countAll() {
		return count(HQL_COUNT_ALL, null);
	}

	/**
	 * 根据条件查找总数
	 * 
	 * @param paramlist
	 * @return
	 */
	public int countByWhere(final String hql) {
		return count(hql, null);
	}

	/**
	 * 根据条件查找总数
	 * 
	 * @param paramlist
	 * @return
	 */
	public int countByWhere(final String hql, final Map<String, Object> paramMap) {
		return count(hql, paramMap);
	}

	/**
	 * 根据条件查找总数
	 * 
	 * @param paramlist
	 * @return
	 */
	protected int count(final String hql) {
		Query query = getSession().createQuery(hql);
		return ((Long) query.uniqueResult()).intValue();
	}

	/**
	 * 根据条件查找总数
	 * 
	 * @param paramlist
	 * @return
	 */
	protected int count(final String hql, final Map<String, Object> paramMap) {
		Query query = getSession().createQuery(hql);
		setParameters(query, paramMap);
		return ((Long) query.uniqueResult()).intValue();
	}

	/**
	 * 如果有多条记录，根据查询条件只返回唯一一条记录
	 */
	@SuppressWarnings("unchecked")
	protected <T> T unique(final String hql) {
		Query query = getSession().createQuery(hql);
		setParameters(query, null);
		return (T) query.setMaxResults(1).uniqueResult();
	}

	/**
	 * 如果有多条记录，根据查询条件只返回唯一一条记录
	 */
	@SuppressWarnings("unchecked")
	protected <T> T unique(final String hql, final Map<String, Object> paramMap) {
		Query query = getSession().createQuery(hql);
		setParameters(query, paramMap);
		return (T) query.setMaxResults(1).uniqueResult();
	}

	/**
	 * 
	 * for in map参数为in括号中的参数
	 */
	@SuppressWarnings("unchecked")
	protected <T> T aggregate(final String hql, final Map<String, Collection<?>> map,
			final Map<String, Object> paramMap) {
		Query query = getSession().createQuery(hql);
		if (ComFun.strNull(paramMap, true)) {
			setParameters(query, paramMap);
			for (Entry<String, Collection<?>> e : map.entrySet()) {
				query.setParameterList(e.getKey(), e.getValue());
			}
		}

		return (T) query.uniqueResult();
	}

	/**
	 * 根据查询条件返回一条记录
	 * 
	 * @param <T>
	 * @param hql
	 * @param paramlist
	 * @return
	 */
	@SuppressWarnings("unchecked")
	protected <T> T aggregate(final String hql, final Map<String, Object> paramMap) {
		Query query = getSession().createQuery(hql);
		setParameters(query, paramMap);
		return (T) query.uniqueResult();

	}

	@SuppressWarnings("unchecked")
	protected <T> List<T> list(final String hql) {
		Query query = getSession().createQuery(hql);
		query.setFirstResult(0);
		List<T> results = query.list();
		return results;
	}

	@SuppressWarnings("unchecked")
	protected <T> List<T> list(final String hql, final Map<String, Object> paramMap) {
		Query query = getSession().createQuery(hql);
		setParameters(query, paramMap);
		query.setFirstResult(0);
		List<T> results = query.list();
		return results;
	}

	public void flush() {
		getSession().flush();
	}

	public void clear() {
		getSession().clear();
	}

	/*
	 * 根据查询语句查找ID
	 */
	protected String getIdResult(String hql, Map<String, Object> paramMap) {
		String result = "";
		List<?> list = list(hql, paramMap);
		if (list != null && list.size() > 0) {
			return list.get(0).toString();
		}
		return result;
	}

	protected void setParameters(Query query, Map<String, Object> paramMap) {
		if (ComFun.strNull(paramMap, true)) {
			int paramIndex = 0;
			for (Map.Entry<String, Object> entry : paramMap.entrySet()) {
				if (entry.getValue() instanceof Date) {
					query.setTimestamp(paramIndex, (Date) entry.getValue());
				} else {
					query.setParameter(paramIndex, entry.getValue());
				}
				paramIndex++;
			}
		}
	}

	public int getLayerCountAll(Map<String, Object> paramMap) {
		new Exception("请在子类 >> " + this.entityClass.getSimpleName() + "的Dao实现类中 << 重写 getLayerCountAll 方法")
				.printStackTrace();
		return 0;
	}

	public List<M> getLayerPageData(int pageIndex, int pageSize, Map<String, Object> paramMap) {
		new Exception("请在子类 >> " + this.entityClass.getSimpleName() + "的Dao实现类中 << 重写 getLayerPageData 方法")
				.printStackTrace();
		return null;
	}

	public List<M> getLayerSortPageData(int pageIndex, int pageSize, String sortName, String sortOrder,
			Map<String, Object> paramMap) {
		new Exception("请在子类 >> " + this.entityClass.getSimpleName() + "的Dao实现类中 << 重写 getLayerSortPageData 方法")
				.printStackTrace();
		return null;
	}

	public List<Object[]> getLayerPageDataBySql(int pageIndex, int pageSize, Map<String, Object> paramMap) {
		new Exception("请在子类 >> " + this.entityClass.getSimpleName() + "的Dao实现类中 << 重写 getLayerPageDataBySql 方法")
				.printStackTrace();
		return null;
	}

	public List<Object[]> getLayerSortPageDataBySql(int pageIndex, int pageSize, String sortName, String sortOrder,
			Map<String, Object> paramMap) {
		new Exception("请在子类 >> " + this.entityClass.getSimpleName() + "的Dao实现类中 << 重写 getLayerSortPageDataBySql 方法")
				.printStackTrace();
		return null;
	}
}
