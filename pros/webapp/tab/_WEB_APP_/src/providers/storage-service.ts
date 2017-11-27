

import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { EventsService } from './events-service';

import { UserInfo } from '../model/user';

@Injectable()
export class StorageService {
  constructor(private events: EventsService,
    private storage: Storage) { }

  /**
   * 加载数据库数据到内存
   */
  init() {
    
  }

  /**
   * 通知登录事件
   * @param userInfo 
   */
  triggerLogin(userInfo: UserInfo) {
    this.setUserInfo(userInfo);
    this.events.getEvent().publish('user:login', userInfo);
  }

  /**
   * 通知退出登录事件
   */
  logout() {
    this.storage.clear();
    this.events.getEvent().publish('user:logout');
  }

  /**
   * 设置登录用户的信息到本地数据库
   */
  setUserInfo(userInfo: UserInfo) {
    this.storage.set('userInfo', userInfo);
  }

  /**
   * 从本地数据库获取登录用户的信息
   */
  getUserInfo() {
    return this.storage.get('userInfo').then((value) => {
      return value;
    });
  }

}
