import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { SearchPage } from '../search/search';

/**
 * Generated class for the WelcomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({ 
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams) {
    
  }

  ionViewDidLoad() {
    this.platform.ready().then((readySource) => { 
      document.getElementById("gridWelcome").style.height = this.platform.height() + "px";
    });
  }

  start() {
    this.navCtrl.push(SearchPage);
  }

}
