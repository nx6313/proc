import { StorageService } from './storage-service';

import { Injectable } from '@angular/core';
import { HttpService } from "./http-service";


@Injectable()
export class ProtocolService {
  API_URL: string = 'http://xxxx';
  constructor(
    private httpService: HttpService,
    private userData: StorageService) {
  }
  /**
   * 用户登录（验证码登录或密码登录）
   * @param phone
   * @param password
   * @param captcha
   * @return 1:成功,0:失败,msg
   */
  userLogin(phone, password?: string, captcha?: string) {
    var url = this.API_URL + "/login.do";
    var body = { 'phone': phone };
    password ? body['password'] = password : {};
    captcha ? body['captcha'] = captcha : {};
    return this.httpService.makePost(url, body);
  }

  /**
   * 获取APP最后版本信息
   * @param appType：'1：android' / :2：ios'
   * @return {note,time,appType,appUrl,versionNumber}
   */
  requestNewAppVersion(appType: string) {
    var url = this.API_URL + "/getNewAppVersion.do";
    var body = { 'appType': appType };
    return this.httpService.makePost(url, body);
  }
}