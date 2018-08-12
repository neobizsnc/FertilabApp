import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { WelcomePage } from '../pages/welcome/welcome';
import { SchedaPage } from '../pages/scheda/scheda';
import { SearchPage } from '../pages/search/search';
import { SearchresultPage } from '../pages/searchresult/searchresult';
import { Keyboard } from '@ionic-native/keyboard';
import { HttpModule } from '@angular/http';
import { TruncatePipe } from '../pipes/truncate/truncate';
import { Geolocation } from '@ionic-native/geolocation';
import { SMS } from '@ionic-native/sms';
import { EmailComposer } from '@ionic-native/email-composer';
import { CallNumber } from '@ionic-native/call-number';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SearchPage,
    SearchresultPage,
    WelcomePage,
    SchedaPage,
    TruncatePipe
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
     
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SearchPage,
    SearchresultPage,
    WelcomePage,
    SchedaPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Keyboard,
    HttpModule,
    Geolocation,
    SMS,
    EmailComposer,
    CallNumber,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
