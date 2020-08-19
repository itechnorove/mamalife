import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { SingletonService } from '../../services/singleton/singleton';
import { AppModule } from "../../app/app.module";


@Component({
  selector: 'page-beweg-kraft',
  templateUrl: 'beweg-kraft.html',
})
export class BewegKraftPage {

  private singleton: SingletonService;
  private freeLicence: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
    this.singleton = AppModule.injector.get(SingletonService);
    this.singleton.readConfigFileOptions().then(() => {
      if ( this.singleton.configFileOptions.find( function(element) {return element.option == "licence"} ).value == "full") this.freeLicence = false;
    });
  }

  ionViewDidLoad() {
    this.singleton.debugLog('ionViewDidLoad BewegKraftPage');
  }

  // infoPage() {
  //   this.alertCtrl.create({
  //     title: '<table style="width:100%;"><tr style="width:100%;text-align:center;"><td style="width:100%;text-align:center;"><h1>ⓘ</h1></td></tr></table>', // '<p style="zoom:.0;">&nbsp;</p>',
  //     subTitle: 'Bringen Sie mit dem <b>mammaLIFE Schritte-Planer</b> mehr Bewegung in Ihren Alltag.<br> \
  //               Nehmen Sie sich jede Woche vor, <b>täglich 500 Schritte mehr als in der Vorwoche</b> zu machen.',
  //     message: '',
  //     buttons: [{ text: 'Okay', role: 'cancel' }]
  //   }).present();
  // }

  openPDF(fileName){
    if (this.freeLicence){
      let alert = this.alertCtrl.create({
        title: 'PDF Dateien',
        message: 'Die PDF Dateien sind nur in der Vollversion verfügbar!',
        buttons: [{
        //   text: "Nicht mehr anzeigen",
        //   handler: () => {
        //   }
        // }, {
          text: "Okay",
          role: 'cancel'
        }]
      })
      alert.present();
    } else {
      this.singleton.openPDFfile(fileName);    
    }
  }

  
}
