import { StorageService } from './storage-service';
import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController, Platform, Loading } from 'ionic-angular';
import { Toast } from '@ionic-native/toast';


@Injectable()
export class UtilService {
  loading: Loading;

  constructor(public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private platform: Platform,
    private toast: Toast,
    private userData: StorageService) { }

  isDevice() {
    return this.platform.is('android') && this.platform.is('mobile');
  }

  /**
   * 是否真机环境
   * @return {boolean}
   */
  isMobile(): boolean {
    return this.platform.is('mobile') && !this.platform.is('mobileweb');
  }

  /**
   * 是否android真机环境
   * @return {boolean}
   */
  isAndroid(): boolean {
    return this.isMobile() && this.platform.is('android');
  }

  /**
   * 是否ios真机环境
   * @return {boolean}
   */
  isIos(): boolean {
    return this.isMobile() && (this.platform.is('ios') || this.platform.is('ipad') || this.platform.is('iphone'));
  }

  isWeb() {
    return this.platform.is('mobileweb');
  }

  showAlert(title, message, buttonText) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: [buttonText]
    });
    alert.present();
  }

  showLoading(content) {
    this.loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
      content: content
    });
    this.loading.present();
  }

  closeLoading() {
    if (this.loading != undefined) {
      this.loading.dismiss();
    }
  }

  // 'top' 'middle' 'bottom'
  private showToast(message, dur?: number, pos?: string) {
    let duration = dur ? dur : 2000;
    let position = pos ? (pos == 'center' ? 'middle' : pos) : 'bottom';
    let toast = this.toastCtrl.create({
      message: message,
      position: position,
      duration: duration
    });
    toast.present();
  }

  // 'top' 'center' 'bottom'
  showToasts(msg, dur?: number, pos?: string) {
    let duration = dur ? dur : 2000;
    let position = pos ? pos : 'bottom';
    if (!this.isWeb()) {
      let addPixelsY = position == 'bottom' ? -100 : 0;
      this.toast.showWithOptions({
        message: msg,
        duration: duration,
        position: position,
        addPixelsY: addPixelsY,
        styling: {
          opacity: 0.8,
          backgroundColor: '#333333',
          textColor: '#F8F8F8',
          cornerRadius: 6,
          horizontalPadding: 8,
          verticalPadding: 6
        }
      }).subscribe(toast => {
        console.log(toast);
      });
    } else {
      console.log('该Toast仅支持真机显示，将以默认Toast方式显示');
      this.showToast(msg, duration);
    }
  }

  getRandomNum(min, max) {
    let Range = max - min;
    let Rand = Math.random();
    return (min + Math.round(Rand * Range));
  }

  /**
   * 获取日期字符串(返回ISO 8601格式)
   * @param date 
   * @param dateFormat 
   * @param diff 
   */
  getDateStr(date: Date, dateFormat?: string, diff?: number) {
    if (diff) {
      if (!dateFormat || dateFormat == 'ymd') {
        date.setDate(date.getDate() + diff);
      } else if (dateFormat == 'ymdhm') {
        date.setMinutes(date.getMinutes() + diff);
        if (date.getMinutes() > 50) {
          date.setMinutes(60);
        }
      }
    }
    let year = date.getFullYear() + '';
    let month = (date.getMonth() + 1) + '';
    let date1 = date.getDate() + '';
    let hour = date.getHours() + '';
    let minute = date.getMinutes() + '';
    Number(month) < 10 ? month = '0' + month : {};
    Number(date1) < 10 ? date1 = '0' + date1 : {};
    Number(hour) < 10 ? hour = '0' + hour : {};
    Number(minute) < 10 ? minute = '0' + minute : {};
    if (!dateFormat || dateFormat == 'ymd') {
      return year + '-' + month + '-' + date1;
    } else if (dateFormat == 'ymdhm') {
      return year + '-' + month + '-' + date1 + 'T' + hour + ':' + minute;
    }
  }

}
