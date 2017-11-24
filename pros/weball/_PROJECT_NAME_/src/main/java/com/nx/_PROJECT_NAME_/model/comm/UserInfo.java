package com.nx._PROJECT_NAME_.model.comm;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.nx._PROJECT_NAME_.model.base.BaseClass;

@Entity
@Table
public class UserInfo extends BaseClass {
	private static final long serialVersionUID = 1L;

	@Id
	@Column
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	@Column
	private String userName;
	@Column
	private String phone;

}
