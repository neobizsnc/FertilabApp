import { Component } from '@angular/core';
import { NavController, NavParams, Platform, ViewController, AlertController } from 'ionic-angular';
import { SMS } from '@ionic-native/sms';
import { EmailComposer } from '@ionic-native/email-composer';
import { CallNumber } from '@ionic-native/call-number';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { SocialSharing } from '@ionic-native/social-sharing';

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

  constructor(private alertCtrl: AlertController, private socialSharing: SocialSharing, private launchNavigator: LaunchNavigator, public viewCtrl: ViewController, public platform: Platform, private callNumber: CallNumber, private emailComposer: EmailComposer, public smss: SMS, public navCtrl: NavController, public navParams: NavParams) {
    this.structure = this.navParams.get('structure')
    console.log(this.structure.phone == null);
    platform.ready().then(() => { 
      if(this.platform.is('ios')) {
        this.operatingSystem = "ios";
      } else {
        this.operatingSystem = "android";
      }
    });
  }

  maps(address, city, province) {
    this.launchNavigator.navigate(address + " " + city + " " + province)
      .then(
        success => console.log('Launched navigator'),
        error => console.log('Error launching navigator', error)
      );
  }

  shareEmail() {

    var phone = "";
    if(this.structure.phone)  {
      phone = ", Tel: " + this.structure.phone;
    }

    var email = "";
    if(this.structure.mail)  {
      email = ", Email: " + this.structure.mail;
    }

    this.socialSharing.shareViaEmail("Ecco il centro diagnostico più comodo per te: " + this.structure.structure + " ," + this.structure.address + phone + email, 'Ecco il centro diagnostico più comodo per te', ['recipient@example.org']).then(() => {
      // Success!
    }).catch(() => {
      let alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: 'Share Email not possible',
        buttons: ['Ok']
      });
      alert.present();
    });
  }

  shareSms() {

    var phone = "";
    if(this.structure.phone)  {
      phone = ", Tel: " + this.structure.phone;
    }

    var email = "";
    if(this.structure.mail)  {
      email = ", Email: " + this.structure.mail;
    }

    this.socialSharing.shareViaSMS("Ecco il centro diagnostico più comodo per te: " + this.structure.structure + " ," + this.structure.address + phone + email, null).then(() => {
      // Success!
    }).catch(() => {
      let alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: 'Share Sms not possible',
        buttons: ['Ok']
      });
      alert.present();
    });
   
  }

  shareWh() {

    var phone = "";
    if(this.structure.phone)  {
      phone = ", Tel: " + this.structure.phone;
    }

    var email = "";
    if(this.structure.mail)  {
      email = ", Email: " + this.structure.mail;
    }

    this.socialSharing.shareViaWhatsApp("Ecco il centro diagnostico più comodo per te: " + this.structure.structure + " ," + this.structure.address + phone + email, null, null).then(() => {
      // Success!
    }).catch(() => {
      let alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: 'Share WhatsApp not possible',
        buttons: ['Ok']
      });
      alert.present();
    });
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
