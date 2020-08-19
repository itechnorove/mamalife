import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { SingletonService } from '../../services/singleton/singleton';
import { AppModule } from "../../app/app.module";


@Component({
  selector: 'page-beweg-alltag',
  templateUrl: 'beweg-alltag.html'
})
export class BewegAlltagPage {

  private Wochen: Array<{ Schritte: number, Ziel: number }>;
  private AnzahlWochen: number = 12;

  // private SchritteWoche1: number;
  // // private ZielWoche1: number;
  // private SchritteWoche2: number;
  // private ZielWoche2: number;
  // private SchritteWoche3: number;
  // private ZielWoche3: number;

  private singleton: SingletonService;

  // public configFileOptions: Array<{ option: string, value: string }>;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    // public singleton: SingletonService,
    public alertCtrl: AlertController
  ) {
    this.singleton = AppModule.injector.get(SingletonService);
    this.initializeValues();
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad BewegAlltagPage');
  }

  ionViewDidEnter() {
    this.singleton.readConfigFileOptions().then(() => { this.loadValues(); });
  }
  // ngAfterViewInit(){
  //   this.loadValues();
  // }  

  calculateValues() {
    // setTimeout(
    //   () => {
    //     this.ZielWoche2 = this.SchritteWoche1 * 1 + 500;
    //     this.ZielWoche3 = this.SchritteWoche2 * 1 + 500;
    //   }, 1000
    // );
  }

  initializeValues() {
    this.Wochen = [];
    for (var iW = 0; iW < this.AnzahlWochen; iW++) { this.Wochen.push({ Schritte: NaN, Ziel: NaN }); }
    this.Wochen[0].Ziel = 0;
  }

  saveValues() {
    let saveString = "";
    for (var iW = 0; iW < this.AnzahlWochen; iW++) {
      saveString += this.Wochen[iW].Schritte + "," + this.Wochen[iW].Ziel + ";";
    }
    this.singleton.writeConfigFileOption("bewAlltag", saveString);
  }

  loadValues() {
    // console.log(" >>>>> load values");

    let bA = this.singleton.getOption("bewAlltag");
    // console.log(" >>>>> returned value:" + bA)

    let options = bA.split(";");
    this.Wochen = [];
    for (var iO = 0; iO <= options.length; iO++) {
      // setInterval( () => {
      // console.log(" >>>>> bewAlltag option: " + options[iO]);
      this.Wochen.push({
        Schritte: parseInt(options[iO].split(",")[0]),
        Ziel: parseInt(options[iO].split(",")[1])
      });
      //  }, iO * 1000);
    }

    // this.singleton.getOption("bewAlltag").then((aopt) => {
    //   console.log(" ######################################## return value:" + aopt);
    // });

    // this.singleton.readConfigFileOption("bewAlltag").then(
    //   (str) => {
    //     console.log(" ######################################## received value:" + str.toString());
    //     if (str.length) {
    //       let options = str.split(";");
    //       this.Wochen = [];
    //       for (var iO = 0; iO <= options.length; iO++) {
    //         console.log(" ######################################## bewAlltag value" + options[iO]);
    //         this.Wochen.push({
    //           Schritte: parseInt(options[iO].split(",")[0]),
    //           Ziel: parseInt(options[iO].split(",")[1])
    //         });
    //       }
    //     } else {
    //       console.log(" ######################################## no values");
    //       this.Wochen = [];
    //       for (var iW = 0; iW < this.AnzahlWochen; iW++) { this.Wochen.push({ Schritte: NaN, Ziel: NaN }); }
    //     }
    //   }).catch(
    //     (err) => {
    //       console.log(" ######################################## error: " + err);
    //   });

  }

  infoPage() {
    this.alertCtrl.create({
      title: '<table style="width:100%;"><tr style="width:100%;text-align:center;"><td style="width:100%;text-align:center;"><h1>ⓘ</h1></td></tr></table>', // '<p style="zoom:.0;">&nbsp;</p>',
      subTitle: 'Bringen Sie mit dem <b>mammaLIFE Schritte-Planer</b> mehr Bewegung in Ihren Alltag.<br> \
                Nehmen Sie sich jede Woche vor, <b>täglich 500 Schritte mehr als in der Vorwoche</b> zu machen.',
      message: '',
      buttons: [{ text: 'Okay', role: 'cancel' }]
    }).present().then(() => {
      // const firstInput: any = document.querySelector('p');
      // firstInput.classList.add('step');
      // firstInput.style.textAlign = "center";
      // firstInput.style.zoom = "1.5";
      // firstInput.innerHTML = "ⓘ";
      // firstInput.classList.add('show');
    });
  }

  clearAllInputs() {
    this.alertCtrl.create({
      title: 'Wirklich alle Eingaben löschen?',
      buttons: [{
        text: "Ja", handler: () => {
          this.initializeValues();
          this.saveValues();
        }
      }, { text: "Nein", role: 'cancel' }]
    }).present();
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

  erreichterWertEingabe(wNr) {
    let alert = this.alertCtrl.create({
      title: 'Erreichter Wert',
      inputs: [
        {
          name: 'answerValue',
          placeholder: 'hier eingeben',
          type: 'number'
        }
      ],
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel'
        },
        {
          text: 'Speichern',
          handler: data => {
            let ans = data.answerValue.trim();
            if (ans != "") {
              this.Wochen[wNr].Schritte = ans * 1;
              if (wNr + 1 < this.Wochen.length) this.Wochen[wNr + 1].Ziel = this.Wochen[wNr].Schritte + 500;
              this.saveValues();
              // let alert2 = this.alertCtrl.create({
              //   title: 'Erreichter Wert hinzugefügt:',
              //   message: ans,
              //   buttons: [ { text: 'Okay', role: 'cancel' } ]
              // });
              // alert2.present();
            } else {
              let alert3 = this.alertCtrl.create({
                title: 'Erreichter Wert',
                message: 'Bitte einen gültigen Wert eingeben.',
                buttons: [{ text: 'Okay', role: 'cancel' }]
              });
              alert3.present();
            }
          }
        }
      ]
    });
    alert.present().then(() => {
      const firstInput: any = document.querySelector('ion-alert input');
      firstInput.focus();
      return;
    });

  }


}
