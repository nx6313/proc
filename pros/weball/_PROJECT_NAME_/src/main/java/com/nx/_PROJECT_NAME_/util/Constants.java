package com.nx._PROJECT_NAME_.util;

/**
 * 常量类
 */
public class Constants {
	/**
	 * 新添加状态（正常数据状态）
	 */
	public static final int STATE_ADD = 1;
	/**
	 * 删除状态（数据被删除）
	 */
	public static final int STATE_DELETE = 0;
	/**
	 * AJAX请求无返回值
	 */
	public static final String AJAX_NONE = "ajaxNone";
	/**
	 * AJAX请求成功返回值
	 */
	public static final String AJAX_SUCCESS = "ajaxSuccess";
	/**
	 * AJAX请求失败返回值
	 */
	public static final String AJAX_FAIL = "ajaxfailure";

	/**
	 * 附件上传地址 存放改过名称后的源文件
	 */
	public static final String FOLDER_PH = "append/";

	/**
	 * 默认分页显示条数
	 */
	public static final int DEFAULT_PAGE_SIZE = 20;

	/**
	 * 项目主要配置文件名称
	 */
	public static final String _PROJECT_NAME_ = "_project_name_.properties";
}
