package com.nx._PROJECT_NAME_.util;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

public class DateFormatUtil {

	/**
	 * 日期格式"yyyy-MM-dd"
	 */
	public static final String YYYYMMDD = "yyyy-MM-dd";

	/**
	 * 日期格式"yyyy-MM"
	 */
	public static final String YYYYMM = "yyyy-MM";
	/**
	 * 日期格式"yyyyMM"
	 */
	public static final String yyyymm = "yyyyMM";

	/**
	 * 日期格式"yyyy"
	 */
	public static final String YYYY = "yyyy";

	/**
	 * 日期格式"MM"
	 */
	public static final String MM = "MM";
	/**
	 * 日期格式"dd"
	 */
	public static final String dd = "dd";

	/**
	 * 时间格式"HH:mm:ss"
	 */
	public static final String HHMMSS = "HH:mm:ss";

	/**
	 * "yyyy-MM-dd HH:mm:ss"
	 */
	public static final String TYPE = "yyyy-MM-dd HH:mm:ss";

	/**
	 * "HH:mm"
	 */
	public static final String HHMM = "HH:mm";

	/**
	 * "MM-dd"
	 */
	public static final String MMDD = "MM-dd";

	/**
	 * yyyy年MM月dd日 HH时mm分
	 */
	public static final String TYPE1 = "yyyy年MM月dd日 HH时mm分";

	/**
	 * yyyy年MM月dd日
	 */
	public static final String TYPE1_ = "yyyy 年 MM 月 dd 日";

	/**
	 * yyyy-MM-dd HH:mm
	 */
	public static final String TYPE2 = "yyyy-MM-dd HH:mm";

	/**
	 * yyyyMMddHHmm
	 */
	public static final String TYPE3 = "yyyyMMddHHmm";
	/**
	 * yyyyMMddHHmm
	 */
	public static final String TYPE6 = "yyyyMMddHH";
	/**
	 * yyyyMMddHHmmss
	 */
	public static final String TYPE4 = "yyyyMMddHHmmss";
	/**
	 * yy-MM-dd HH:mm:ss
	 */
	public static final String TYPE5 = "yy-MM-dd HH:mm:ss";

	/**
	 * yyyyMMddHHmmssSSS
	 */
	public static final String NUM_TYPE = "yyyyMMddHHmmssSSS";
	/**
	 * yyyy/MM/dd HH:mm
	 */
	public static final String NEW_TYPE1 = "yyyy/MM/dd HH:mm";
	/**
	 * yyyy/MM/dd
	 */
	public static final String NEW_TYPE2 = "yyyy/MM/dd";
	/**
	 * yyyy/MM/dd HH:mm:ss
	 */
	public static final String NEW_TYPE3 = "yyyy/MM/dd HH:mm:ss";

	/**
	 * 将字符串转化为日期
	 * 
	 * @param dateStr
	 *            字符串的值
	 * @param dateType
	 *            要转化的类型
	 * @return
	 */
	public static Date strToDate(String dateStr, String dateType) {
		SimpleDateFormat sdf = new SimpleDateFormat(dateType);
		Date date = null;
		try {
			date = sdf.parse(dateStr);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return date;
	}

	/**
	 * 日期转换为字符串格式
	 * 
	 * @param date
	 *            日期
	 * @param dateType
	 *            要转化的格式
	 * @return
	 */
	public static String dateToStr(Date date, String dateType) {
		SimpleDateFormat sdf = new SimpleDateFormat(dateType);
		return sdf.format(date);
	}

	/**
	 * 获取昨日日期
	 * 
	 * @param date
	 * @param dateType
	 * @return
	 */
	public static String getYesterday(Date date, String dateType) {
		Calendar calendar = new GregorianCalendar();
		calendar.setTime(date);
		calendar.add(Calendar.DATE, -1);
		date = calendar.getTime();
		SimpleDateFormat sdf = new SimpleDateFormat(dateType);
		return sdf.format(date);
	}
	
	/**
	 * 获取本周一
	 * 
	 * @param date
	 * @param dateType
	 * @return
	 */
	public static String getThisWeekFirst(Date date, String dateType) {
		Calendar calendar = new GregorianCalendar();
		calendar.setTime(date);
		calendar.add(Calendar.DAY_OF_MONTH, - 1);
		calendar.set(Calendar.DAY_OF_WEEK, Calendar.MONDAY);
		date = calendar.getTime();
		SimpleDateFormat sdf = new SimpleDateFormat(dateType);
		return sdf.format(date);
	}
	
	/**
	 * 获取本周日
	 * 
	 * @param date
	 * @param dateType
	 * @return
	 */
	public static String getThisWeekLast(Date date, String dateType) {
		Calendar calendar = new GregorianCalendar();
		calendar.setTime(date);
		int day_of_week = calendar.get(Calendar.DAY_OF_WEEK) - 1;
		if (day_of_week == 0) day_of_week = 7;
		calendar.add(Calendar.DATE, 7 - day_of_week);
		date = calendar.getTime();
		SimpleDateFormat sdf = new SimpleDateFormat(dateType);
		return sdf.format(date);
	}
	/**
	 * 获取上周一
	 * 
	 * @param date
	 * @param dateType
	 * @return
	 */
	public static String getLastWeekFirst(Date date, String dateType) {
		Calendar calendar = new GregorianCalendar();
		calendar.setTime(date);
		calendar.add(Calendar.DAY_OF_MONTH, - 2);
		calendar.set(Calendar.DAY_OF_WEEK, Calendar.MONDAY);
		date = calendar.getTime();
		SimpleDateFormat sdf = new SimpleDateFormat(dateType);
		return sdf.format(date);
	}
	
	/**
	 * 获取上周日
	 * 
	 * @param date
	 * @param dateType
	 * @return
	 */
	public static String getLastWeekLast(Date date, String dateType) {
		Calendar calendar = new GregorianCalendar();
		calendar.setTime(date);
		int day_of_week = calendar.get(Calendar.DAY_OF_WEEK) - 2;
		if (day_of_week == 0) day_of_week = 7;
		calendar.add(Calendar.DATE, 6 - day_of_week);
		date = calendar.getTime();
		SimpleDateFormat sdf = new SimpleDateFormat(dateType);
		return sdf.format(date);
	}

	/**
	 * 获取年份
	 * 
	 * @param date
	 *            2016-06-22
	 * @return
	 */
	public static int getYear(Date date) {
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		return cal.get(Calendar.YEAR);
	}

	/**
	 * 获取月份
	 * 
	 * @param date
	 *            2016-06-22
	 * @return
	 */
	public static int getMonth(Date date) {
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		return cal.get(Calendar.MONTH) + 1;
	}

	/**
	 * 并0
	 * 
	 * @param s
	 * @return
	 */
	public static String andZero(String s) {
		if (Integer.parseInt(s) < 10) {
			return "0" + s;
		} else {
			return s;
		}
	}

	/**
	 * 判断当前时间是否在指定时间段内，只判断到年月日
	 * 
	 * @param startDate
	 * @param endDate
	 * @return <0:之前 =0:之内 >0:之后
	 */
	public static int checkCurrentDateInOutDatePart(Date startDate, Date endDate) {
		Date current = strToDate(dateToStr(new Date(), YYYYMMDD), YYYYMMDD);
		if (current.compareTo(startDate) < 0) {
			return -1;
		} else if (current.compareTo(endDate) > 0) {
			return 1;
		}
		return 0;
	}
	/**
	 * 得到上个月的日期
	 * 
	 * @param date
	 *            这个月的时间
	 * @return 返回上个月的时间
	 */
	public static Date getLastMonth(Date date) {
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		cal.add(Calendar.MONTH, -1);
		Date month = cal.getTime();
		return month;
	}
	public static void main(String[] args) {
		System.out.println(getLastWeekFirst(new Date(), "yyyy-MM-dd"));
		System.out.println(getLastWeekLast(new Date(), "yyyy-MM-dd"));
	}
	
	/**
	 * 下周一
	 * @author Administrator
	 * @param string 
	 * @param date 
	 *
	 */
	public static String getNextWeekFirstDay(Date date, String dateType) {
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		cal.add(Calendar.WEEK_OF_MONTH, 1);
		cal.set(Calendar.DAY_OF_WEEK, Calendar.MONDAY);
		date = cal.getTime();
		SimpleDateFormat sdf = new SimpleDateFormat(dateType);
		return sdf.format(date);
	}
	
		/**
		 * 下周日
		 * @param string 
		 * @param date 
		 * @return
		 */
	public static String getNextWeekLastDay(Date date, String dateType) {
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		cal.setFirstDayOfWeek(Calendar.MONDAY);
		cal.add(Calendar.WEEK_OF_MONTH, 1);
		cal.set(Calendar.DAY_OF_WEEK, Calendar.SUNDAY);
		date = cal.getTime();
		SimpleDateFormat sdf = new SimpleDateFormat(dateType);
		return sdf.format(date);
	}
	
	/**
	 * 下月第一天
	 * @param string 
	 * @param date 
	 * @return
	 */
	public static String getPerFirstDayOfMonth(Date date, String string) {
        SimpleDateFormat dft = new SimpleDateFormat("yyyy-MM-dd");
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.MONTH, 1);
        calendar.set(Calendar.DAY_OF_MONTH, calendar.getActualMinimum(Calendar.DAY_OF_MONTH));
        return dft.format(calendar.getTime());
    }

	/**
	 * 下月最后一天
	 * @param date
	 * @param string 
	 * @return
	 */
	public static String getLastDayOfMonth(Date date, String string) { 
		Calendar calendar = Calendar.getInstance();
		calendar.add(Calendar.MONTH, 1);
        calendar.set(Calendar.DATE, calendar.getActualMaximum(Calendar.DATE));
        DateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		return format.format(calendar.getTime());
    }
	
	/**
	 * 本月第一天
	 * @param string 
	 * @param date 
	 * @return
	 */
	public static String getFirstDayMonth(Date date, String string){
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");  
		Calendar calendar = Calendar.getInstance();
		calendar.add(Calendar.MONTH, 0);  
		calendar.set(Calendar.DAY_OF_MONTH, 1);  
		return format.format(calendar.getTime());  
	}

	/**
	 * 本月最后一天
	 * @param date
	 * @param string
	 * @return
	 */
	public static String getLastDayMonth(Date date, String string){
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		Calendar calendar = Calendar.getInstance(); 
		calendar.add(Calendar.MONTH, 1);  
		calendar.set(Calendar.DAY_OF_MONTH, 0);  
		return format.format(calendar.getTime());
	}
	
	/**
	 * 获取当前时间
	 * @return
	 */
	public static String getNowDate(Date date, String string){     
	    String temp_str="";     
	    Date dt = new Date();     
	    //最后的aa表示“上午”或“下午”    HH表示24小时制    如果换成hh表示12小时制     
	    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");     
	    temp_str=sdf.format(dt);     
	    return temp_str;     
	}   
	/**
	 * 
	 * 获取指定时间是周几
	 */
	public static String getWeekByDate(Date date){
		String week="";
		if(ComFun.strNull(date)){
			 SimpleDateFormat dateFm = new SimpleDateFormat("EEEE");
			 week=dateFm.format(date);
		}
		return week;
	}
}
