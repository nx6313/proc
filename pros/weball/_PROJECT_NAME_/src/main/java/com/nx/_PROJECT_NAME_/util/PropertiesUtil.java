package com.nx._PROJECT_NAME_.util;

import java.io.BufferedInputStream;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Properties;
import java.util.logging.Logger;

/**
 * 读取properties文件工具类
 */
public class PropertiesUtil {
	static Properties prop = new Properties();
	private static Logger logger = Logger.getLogger(PropertiesUtil.class.getName());

	/**
	 * 根据properties路径得到Properties
	 * 
	 * @param filePath
	 *            properties的路径
	 * 
	 * @return 返回Properties
	 */
	public static Properties getPropertiesByFilePath(String filePath) {
		Properties properties = new Properties();
		try {
			InputStream is = new BufferedInputStream(new FileInputStream(filePath));
			properties.load(is);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return properties;
	}

	/**
	 * @param filePath
	 *            properties文件路径
	 * @param key
	 *            properties中key
	 * @return 返回key对应的值
	 */
	public static String getPropertiesVlaueByKey(String filePath, String key) {
		Properties properties = new Properties();
		String value = "";
		try {
			InputStream is = PropertiesUtil.class.getClassLoader().getResourceAsStream(filePath);
			properties.load(is);
			value = properties.getProperty(key);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return value;
	}

	/**
	 * 写配置文件
	 * 
	 * @param name
	 *            文件名
	 * @param key
	 *            properties中key
	 * @param value
	 *            properties中value
	 */
	public static void writeData(String name, String key, String value) {
		try {
			String url = PropertiesUtil.class.getClassLoader().getResource(name).toString();
			url = url.replace("%20", " ");
			InputStream in = new FileInputStream(url.substring(6, url.length()));
			prop.load(in);
			prop.setProperty(key, value);
			OutputStream fos = new FileOutputStream(url.substring(6, url.length()));
			prop.store(fos, null);
			fos.flush();
		} catch (Exception e) {
			e.printStackTrace();
			logger.info("[Hqx] " + "属性文件更新错误");
		}
	}

	/**
	 * 更改配置文件
	 * 
	 * @param name
	 *            文件名
	 * @param key
	 *            properties中key
	 * @param value
	 *            properties中value
	 */
	public static void updateData(String name, String key, String value) {
		if (readData(name, key) != null) {
			writeData(name, key, value);
		} else {
			writeData(name, key, value);
		}
	}

	/**
	 * 通过文件名，和键值读取配置文件
	 */
	public static String readData(String name, String key) {
		String value = null;
		String url = null;
		try {
			url = PropertiesUtil.class.getClassLoader().getResource(name).toString();
			url = url.replace("%20", " ");
			InputStream in = new FileInputStream(url.substring(6, url.length()));
			prop.load(in);
			in.close();
			value = prop.getProperty(key);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return value;
	}
}
