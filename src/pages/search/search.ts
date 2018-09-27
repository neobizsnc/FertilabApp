import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { SearchresultPage } from '../searchresult/searchresult';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import { Keyboard } from '@ionic-native/keyboard';
/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  autocomplete: any;
  autocompleteItems: any = [];

  constructor(private keyboard: Keyboard, public http: Http, public platform: Platform, public navCtrl: NavController, public navParams: NavParams) {
    this.autocomplete = {
      input: ''
    };
  }

  ionViewDidLoad() {
    this.platform.ready().then((readySource) => { 
      document.getElementById("gridSearch").style.height = this.platform.height() + "px";
    });
  }

  updateSearchResults(){
    this.http.get('http://vascernapi.azurewebsites.net/Home/GetEventVenuesListFertilab?SearchText=' + this.autocomplete.input + '&ApiKey=AIzaSyBZW73ZAn-6PqKKAVuDOzYzMOB_m2dDLIo').map(res => res.json()).subscribe(data => {
      this.autocompleteItems = [];
      this.autocompleteItems.push(data); 
    });
  }

  selectSearchResult(item){
    this.autocompleteItems = [];   
    this.navCtrl.push(SearchresultPage, {
      city: item
    });
  } 
 
}
