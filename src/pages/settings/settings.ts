import { Component } from '@angular/core';
import { NavController, PopoverController, AlertController, LoadingController } from 'ionic-angular';

import { TransferPage } from '../transfer/transfer';
// import { MyApp } from '../../app/app.component';

// declare var cordova: any;

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {


  constructor(public navCtrl: NavController,
    public popoverCtrl: PopoverController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController) {


  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad SettingsPage');
  }
  ionViewWillLeave() {
		// let loader = this.loadingCtrl.create({
		// 	duration: 1000,
		// 	// dismissOnPageChange: true
		// });
		// loader.present();
  }


  go2TransferPage() {
    let alert = this.alertCtrl.create({
      title: 'Zusätzliche Dateien',
      message: 'Wirklich alle zusätzlichen Dateien erneut herunterladen?',
      buttons: [{
        text: "Ja",
        handler: () => { this.navCtrl.push(TransferPage); }
      }, {
        text: "Nein",
        role: 'cancel'
      }]
    })
    alert.present();
  }

  // go2ImpressumPage(page) {
  //   // let popover = this.popoverCtrl.create(ImpressumPage);
  //   // popover.present();
  //   this.navCtrl.push(ImpressumPage);
  // }

  // go2PlanerPage() {
  //   this.navCtrl.push(PlanerPage);
  // }

  // go2ErinnerungenPage() {
  //   this.navCtrl.push(ErinnerungenPage);
  // }


  // changeTheme() {
  //   if (typeof this.theme !== "undefined") {
  //     console.log(this.theme) //md, ios, wp
  //     IonicModule.forRoot(MyApp, { mode: this.theme })
  //   }
  // }

}
