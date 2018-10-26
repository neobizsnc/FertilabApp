import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { WelcomePage } from '../welcome/welcome';
import { Http } from '@angular/http';
import { Keyboard } from '@ionic-native/keyboard';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  code: string = "";

  constructor(private storage: Storage, private keyboard: Keyboard, public platform: Platform, public navCtrl: NavController, public http: Http) {
    platform.ready().then((readySource) => { 
      this.keyboard.onKeyboardHide().subscribe(data => {
        //document.getElementById("grid").style.height = this.platform.height() + 30 + "px";
     });
    });
  }

  ionViewDidEnter() {
    this.platform.ready().then((readySource) => { 
      document.getElementById("grid").style.height = this.platform.height() + "px";
    });
  }

  closeKeyboard() {
    this.keyboard.close();
  }


  

  register() {
    /*this.http.get('http://fertilab.azurewebsites.net/api/UsersApi/GetByCode/' + this.code).map(res => res.json()).subscribe(data => {
      if(data == true) {
        this.navCtrl.push(WelcomePage);
      }
    });*/
    if(this.code == "AMH") {
      this.storage.set('registered', true);
      this.navCtrl.push(WelcomePage);
    }
    //this.navCtrl.push(WelcomePage);
  }

}
