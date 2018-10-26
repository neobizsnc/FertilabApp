import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { Keyboard } from '@ionic-native/keyboard';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { Storage } from '@ionic/storage';
import { WelcomePage } from '../pages/welcome/welcome';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {

  rootPage:any;

  constructor(private storage: Storage, public keyboard: Keyboard, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      
      this.storage.get('introShown').then((result) => {
 
        if(result){
          storage.get('registered').then((val) => {
            if(val) {
              this.rootPage = WelcomePage;
            } else {
              this.rootPage = HomePage;
            }
          });       
        } else {
          this.rootPage = TutorialPage;
          this.storage.set('introShown', true);
        }


      });

      statusBar.styleDefault();
      splashScreen.hide();

      this.keyboard.disableScroll(true);
      this.keyboard.hideKeyboardAccessoryBar(false);
 
    });
  }
}

