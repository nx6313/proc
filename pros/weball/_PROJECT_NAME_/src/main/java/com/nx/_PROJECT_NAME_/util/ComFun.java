package com.nx._PROJECT_NAME_.util;

import java.io.File;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import javax.servlet.http.HttpServletRequest;

import org.json.JSONException;
import org.json.JSONObject;

public class ComFun {

	/**
	 * 判断对象不为空
	 * 
	 * @param str
	 * @param flags
	 *            为可选参数，如果需要进一步判断List/Map/Array中的数量是否为0，可传入true；否则可不传（参数一为List/
	 *            Map/Array类型时有效）
	 * @return
	 */
	public static boolean strNull(Object str, boolean... flags) {
		if (str != null && str != "" && !str.equals("")) {
			if (flags != null && flags.length > 0 && flags[0]) {
				if (ArrayList.class.isInstance(str)) {
					if ((((List<?>) str).size() == 0)) {
						return false;
					}
				} else if (HashMap.class.isInstance(str)) {
					if ((((Map<?, ?>) str).size() == 0)) {
						return false;
					}
				} else if (str.getClass().isArray()) {
					try {
						if (JSONObject.valueToString(str).equals("[]")) {
							return false;
						}
					} catch (JSONException e) {
						return true;
					}
				}
			}
			return true;
		} else {
			return false;
		}
	}

	/**
	 * 获取用户信息
	 * 
	 * @param user
	 * @return
	 */
	// public static String getUserInfo(UserInfo user) {
	// return "访问账号:" + user.getLoginName() + "===========用户名:" + user.getUserName()
	// + "========访问时间:"
	// + DateFormatUtil.dateToStr(new Date(), DateFormatUtil.TYPE);
	// }

	/**
	 * 判断文件在物理地址存不存在
	 * 
	 * @param filePath
	 * @return
	 */
	public static boolean fileIsExists(String filePath) {
		File file = new File(filePath);
		return file.exists();
	}

	/**
	 * excel 导出时 中文名乱码设置
	 * 
	 * @param s
	 * @return
	 */
	public static String toUtf8String(String s) {
		StringBuffer sb = new StringBuffer();
		for (int i = 0; i < s.length(); i++) {
			char c = s.charAt(i);
			if (c >= 0 && c <= 255) {
				sb.append(c);
			} else {
				byte[] b;
				try {
					b = Character.toString(c).getBytes("utf-8");
				} catch (Exception ex) {
					b = new byte[0];
				}
				for (int j = 0; j < b.length; j++) {
					int k = b[j];
					if (k < 0)
						k += 256;
					sb.append("%" + Integer.toHexString(k).toUpperCase());
				}
			}
		}
		return sb.toString();
	}

	/**
	 * 判断字符串是否在字符串数组中
	 * 
	 * @param str
	 * @param StrArr
	 * @return
	 */
	public static boolean checkStrInStrArr(String str, String[] StrArr) {
		if (ComFun.strNull(StrArr) && StrArr.length > 0 && ComFun.strNull(str)) {
			for (String s : StrArr) {
				if (str.equals(s)) {
					return true;
				}
			}
		}
		return false;
	}

	/**
	 * 获取项目根目录
	 * 
	 * @param request
	 * @return
	 */
	public static String getServletPath(HttpServletRequest request) {
		return request.getServletPath().replace("/", "");
	}

	/**
	 * float类型 保留两位小数 若为整数时，去掉后面的.00
	 * 
	 * @param float
	 *            num
	 * @return String numStr
	 */
	public static String keepTwoDecimal(double num) {
		String numStr = String.valueOf(num);
		if ((num * 100) % 100 == 0) {
			int nums = (int) ((num * 100) / 100);
			numStr = String.valueOf(nums);
		} else {
			DecimalFormat funm = new DecimalFormat("##0.00");
			numStr = funm.format(num);
		}
		return numStr;
	}

	/**
	 * float类型 保留两位小数 若为整数时，去掉后面的.00
	 * 
	 * @param float
	 *            num
	 * @return String numStr
	 */
	public static String keepTwoDecimalObj(Object num) {
		String numStr = "0";
		if (ComFun.strNull(num)) {
			double number = Double.valueOf(num.toString());
			numStr = String.valueOf(num);
			if ((number * 100) % 100 == 0) {
				int nums = (int) ((number * 100) / 100);
				numStr = String.valueOf(nums);
			} else {
				DecimalFormat funm = new DecimalFormat("##0.00");
				numStr = funm.format(num);
			}
		}
		return numStr;
	}

	/**
	 * 如果数字相加(减)后的值小于定义的数字总长度时前面补零
	 * 
	 * @param i
	 *            int类型i
	 * @param j
	 *            int类型j
	 * @param digits
	 *            数字总位数 如：0001 + 1 = 0002；digits值为4 如：01 + 1 = 02；digits值为2
	 *            digits值是根据你的数字总长度来决定
	 * @return
	 */
	public static String formatNum(int i, int j, int digits) {
		return String.format("%0" + digits + "d", i + j);
	}

	/**
	 * 图片上传
	 */
	public static String upload(File file, String folder, String savePath) {
		Random r = new Random();
		SimpleDateFormat sDateFormat = new SimpleDateFormat("yyyyMMddHHmmss");
		// 附件存放文件夹
		String oldPath = savePath + "/" + Constants.FOLDER_PH + folder + "/";
		File f1 = new File(oldPath);
		if (!f1.exists()) {
			f1.mkdirs();
		}
		String nowTimeStr = sDateFormat.format(new Date());
		int rannum = (int) (r.nextDouble() * (99999 - 10000 + 1)) + 10000;
		String newFileName = nowTimeStr + rannum + ".jpg";
		String officePath = oldPath + newFileName;
		File officeFile = new File(officePath);
		file.renameTo(officeFile);

		return Constants.FOLDER_PH + folder + "/" + newFileName;
	}

}
