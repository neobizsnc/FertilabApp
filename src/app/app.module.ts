import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { MapsPage } from '../pages/maps/maps';
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
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { SocialSharing } from '@ionic-native/social-sharing';
import { IonicStorageModule } from '@ionic/storage';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Diagnostic } from '@ionic-native/diagnostic';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SearchPage,
    SearchresultPage,
    WelcomePage,
    SchedaPage,
    MapsPage,
    TruncatePipe,
    TutorialPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      platforms : {
        ios : {
          // These options are available in ionic-angular@2.0.0-beta.2 and up.
          scrollAssist: false,    // Valid options appear to be [true, false]
          autoFocusAssist: false  // Valid options appear to be ['instant', 'delay', false]
        }
        // http://ionicframework.com/docs/v2/api/config/Config/)
      }
    }),
    IonicStorageModule.forRoot()
     
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SearchPage,
    SearchresultPage,
    WelcomePage,
    MapsPage,
    SchedaPage,
    TutorialPage
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
    LaunchNavigator,
    SocialSharing,
    LocationAccuracy,
    Diagnostic,
    BackgroundGeolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
