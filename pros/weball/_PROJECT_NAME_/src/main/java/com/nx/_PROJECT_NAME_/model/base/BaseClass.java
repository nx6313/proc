package com.nx._PROJECT_NAME_.model.base;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;

import com.nx._PROJECT_NAME_.util.Constants;

/**
 * 实体公共属性类
 */
@MappedSuperclass
public class BaseClass implements java.io.Serializable {
	private static final long serialVersionUID = 1L;
	@Column
	private String createId;
	@Column
	private Date createDate;
	@Column
	private String updateId;
	@Column
	private Date updateDate;
	@Column
	private String deleteId;
	@Column
	private Date deleteDate;
	@Column
	private int state;

	public String getCreateId() {
		return createId;
	}

	public void setCreateId(String createId) {
		this.createId = createId;
	}

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public String getUpdateId() {
		return updateId;
	}

	public void setUpdateId(String updateId) {
		this.updateId = updateId;
	}

	public Date getUpdateDate() {
		return updateDate;
	}

	public void setUpdateDate(Date updateDate) {
		this.updateDate = updateDate;
	}

	public String getDeleteId() {
		return deleteId;
	}

	public void setDeleteId(String deleteId) {
		this.deleteId = deleteId;
	}

	public Date getDeleteDate() {
		return deleteDate;
	}

	public void setDeleteDate(Date deleteDate) {
		this.deleteDate = deleteDate;
	}

	public int getState() {
		return state;
	}

	public void setState(int state) {
		this.state = state;
	}

	public void setCreateInfo(String userId) {
		this.setCreateDate(new Date());
		this.setCreateId(userId);
		this.setState(Constants.STATE_ADD);
	}

	public void setUpdateInfo(String userId) {
		this.setUpdateDate(new Date());
		this.setUpdateId(userId);
	}

	public void setDeleteInfo(String userId) {
		this.setDeleteDate(new Date());
		this.setDeleteId(userId);
		this.setState(Constants.STATE_DELETE);
	}

}
