import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';

import { SingletonService } from "../../services/singleton/singleton";
import { AppModule } from "../../app/app.module";

import { TransferPage } from '../transfer/transfer';

@Component({
  selector: 'page-impressum',
  templateUrl: 'impressum.html'
})
export class ImpressumPage {

  public last_page: number = 1;
  private logOutput: string;
  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController) { 
    this.singleton = AppModule.injector.get(SingletonService);
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ImpressumPage');
  }

  ionViewWillLeave() {
		// let loader = this.loadingCtrl.create({
		// 	duration: 1000,
		// 	// dismissOnPageChange: true
		// });
		// loader.present();
  }


  private singleton: SingletonService;
  private debugCounter: number = 0;
  debug() {
    this.debugCounter++;
    if (this.debugCounter >= this.singleton.debugCounterActivate) this.singleton.debugLevel = 1;
    // if (this.singleton.debugON) this.singleton.debugMenu();
    // this.logOutput = this.singleton.debugLogs.split('\n').join('<br>');
  }
  debugButton(){
    // this.navCtrl.push(TransferPage);
    this.singleton.debugMenu();
  }


  toggleStyle (nr){
    this.toggleStyleOnlyOneVisible(nr);
  }
  toggleStyleOnlyOneVisible(nr) {
    document.getElementById("div1").classList.add("hiddenelement");
    document.getElementById("arrow-up1").classList.add("hiddenelement");
    document.getElementById("arrow-down1").classList.remove("hiddenelement");
    document.getElementById("div2").classList.add("hiddenelement");
    document.getElementById("arrow-up2").classList.add("hiddenelement");
    document.getElementById("arrow-down2").classList.remove("hiddenelement");
    document.getElementById("div3").classList.add("hiddenelement");
    document.getElementById("arrow-up3").classList.add("hiddenelement");
    document.getElementById("arrow-down3").classList.remove("hiddenelement");
    if (this.last_page == nr) {
      this.last_page = 0;
    } else {
      this.last_page = nr;
      this.toggleStyleIndividually(nr);
    }
  }
  toggleStyleIndividually(nr) {
    var x;
    x = document.getElementById("div" + nr);
    x.classList.toggle("hiddenelement");
    x = document.getElementById("arrow-up" + nr);
    x.classList.toggle("hiddenelement");
    x = document.getElementById("arrow-down" + nr);
    x.classList.toggle("hiddenelement");
  }



}
