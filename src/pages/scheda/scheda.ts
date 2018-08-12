import { Component } from '@angular/core';
import { NavController, NavParams, Platform, ViewController } from 'ionic-angular';
import { SMS } from '@ionic-native/sms';
import { EmailComposer } from '@ionic-native/email-composer';
import { CallNumber } from '@ionic-native/call-number';

/**
 * Generated class for the SchedaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-scheda',
  templateUrl: 'scheda.html',
})
export class SchedaPage {

  structure: any;
  operatingSystem: any;

  constructor(public viewCtrl: ViewController, public platform: Platform, private callNumber: CallNumber, private emailComposer: EmailComposer, public smss: SMS, public navCtrl: NavController, public navParams: NavParams) {
    this.structure = this.navParams.get('structure')
    platform.ready().then(() => { 
      if(this.platform.is('ios')) {
        this.operatingSystem = "ios";
      } else {
        this.operatingSystem = "android";
      }
    });
  }

  ionViewDidLoad() {
    
  }

  whatsapp(phone) {

  }

  sms(phone) {
    this.smss.send(phone, 'Hello world!');
  }

  email(email) {
    let e= {
      to: email,
      subject: 'Cordova Icons',
      body: 'How are you? Nice greetings from Leipzig',
      isHtml: true
    };
    this.emailComposer.open(e);
  }

  call(phone) {
    this.callNumber.callNumber(phone, true);
  }

  close() {
    this.viewCtrl.dismiss();
  }

}
