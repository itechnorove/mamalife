import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';


@Component({
  selector: 'page-ernae-bei-brustkrebs',
  templateUrl: 'ernae-bei-brustkrebs.html',
})
export class ErnaeBeiBrustkrebsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController ) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ErnaeBeiBrustkrebsPage');
  }

  infoPage() {
    this.alertCtrl.create({
      title: '<div style="width: 100% !important; zoom: 2.0 !important; margin-left: 24px !important;">ⓘ<div>',
      subTitle:  'Eine heilende Krebs-Ernährung gibt es nicht.<br> \
                  Wohl aber kann eine gesunde und genussvolle Ernährung das Risiko an Krebs zu erkranken vermindern bzw. nach einer Erkrankung das Risiko eines Rückfalls reduzieren.<br> \
                  Zudem können die Selbstheilungskräfte im Körper aktiviert und das Immunsystem unterstützt werden.<br> \
                  <br> \
                  <b>Hinweis:</b><br> \
                  Während oder unmittelbar nach einer Chemotherapie können Wechselwirkungen mit bestimmten Lebensmitteln auftreten. Bitte sprechen Sie Ihre Ernährung mit Ihrem behandelnden Arzt ab. \
              ',
      message: '',
      buttons: [{ text: 'Okay', role: 'cancel' }]
    }).present();
  }

}
