import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { WelcomePage } from '../welcome/welcome';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public platform: Platform, public navCtrl: NavController) {
    platform.ready().then((readySource) => { 
      document.getElementById("grid").style.height = platform.height() + "px";
    });
  }

  register() {
    this.navCtrl.push(WelcomePage);
  }

}
