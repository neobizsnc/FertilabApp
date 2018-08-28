import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { WelcomePage } from '../welcome/welcome';
import { Http } from '@angular/http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  code: string = "";

  constructor(public platform: Platform, public navCtrl: NavController, public http: Http) {
    platform.ready().then((readySource) => { 
      document.getElementById("grid").style.height = platform.height() + "px";
    });
  }

  register() {
    /*this.http.get('http://fertilab.azurewebsites.net/api/UsersApi/GetByCode/' + this.code).map(res => res.json()).subscribe(data => {
      if(data == true) {
        this.navCtrl.push(WelcomePage);
      }
    });*/
    if(this.code == "AMH") {
      this.navCtrl.push(WelcomePage);
    }
  }

}
