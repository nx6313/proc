import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { IonicStorageModule } from '@ionic/storage';
import { Toast } from '@ionic-native/toast';

import { EventsService } from '../providers/events-service';
import { HttpService } from '../providers/http-service';
import { ProtocolService } from '../providers/protocol-service';
import { StorageService } from '../providers/storage-service';
import { UpdateService } from '../providers/update-service';
import { UtilService } from '../providers/util-service';

import { ComponentsModule } from '../components/components.module';

import { WelcomePage } from '../pages/welcome/welcome';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    WelcomePage,
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage
  ],
  imports: [
    IonicStorageModule.forRoot(),
    BrowserModule,
    ComponentsModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    WelcomePage,
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    EventsService,
    HttpService,
    ProtocolService,
    StorageService,
    UpdateService,
    UtilService,
    Toast,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
