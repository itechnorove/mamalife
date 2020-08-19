import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { SingletonService } from "../../services/singleton/singleton";
import { AppModule } from "../../app/app.module";
import { Content } from 'ionic-angular';


@Component({
  selector: 'page-beweg-profil',
  templateUrl: 'beweg-profil.html',
})
export class BewegProfilPage {

  @ViewChild(Content) content: Content;

  private ruheHerzfrequenz: number;
  private maxHerzfrequenz: number;
  private Herzfrequenzreserve: number;
  private TrainingsbereichUntereGrenze: number;
  private TrainingsbereichObereGrenze: number;

  private textareaPlaceholder: string = ""; // = "Bitte eingeben…\n1. 10000 Schritte am Tag bis November\n2. 3x pro Woche 30 Min. Ausdauertraining\n3. ...";

  private singleton: SingletonService;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController
  ) {
    this.singleton = AppModule.injector.get(SingletonService);
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad BewegProfilPage');
  }

  ionViewDidEnter() {
    this.singleton.readConfigFileOptions().then(() => {
      this.loadValues();
    });
  }

  scollToTextbox(){
    // this.content.scrollTo(0, document.getElementById("bewZiele").offsetTop - 1000, 1000);
    this.content.scrollTo(0, this.content.getContentDimensions().contentHeight, 700);    
    this.saveValues();
  }

  loadValues() {
    // console.log(" >>>>> load values");
    let bP = this.singleton.getOption("bewProfil");
    // console.log(" >>>>> returned value:" + bP)
    let options = bP.split(";");
    // for (var iO = 0; iO <= options.length; iO++) {
    //   console.log(" >>>>> bewProfil option: " + options[iO]);
    // }
    this.ruheHerzfrequenz = parseInt(options[0]);
    this.maxHerzfrequenz = parseInt(options[1]);
    this.calculateValues();
    // (<HTMLInputElement>document.getElementById("bewZiele_textarea")).value = options[2];
    this.textareaPlaceholder = options[2].split('<br>').join('\n');
  }

  saveValues() {
    this.singleton.writeConfigFileOption("bewProfil",
      this.ruheHerzfrequenz + ";" +
      this.maxHerzfrequenz + ";" +
      // (<HTMLInputElement>document.getElementById("bewZiele_textarea")).value
      this.textareaPlaceholder.split('\n').join('<br>')
    );
  }

  initializeValues(){
    this.ruheHerzfrequenz = NaN;
    this.maxHerzfrequenz = NaN;
    this.textareaPlaceholder = "";
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

  calculateValues() {
    this.Herzfrequenzreserve = this.maxHerzfrequenz - this.ruheHerzfrequenz;
    this.TrainingsbereichUntereGrenze = Math.floor((this.Herzfrequenzreserve * 0.6) + this.ruheHerzfrequenz * 1); // * 1 sonst concat
    this.TrainingsbereichObereGrenze = Math.floor((this.Herzfrequenzreserve * 0.8) + this.ruheHerzfrequenz * 1); // * 1 sonst concat
  }

  inputValue(option) {
    let title = "";
    if (option === "ruheHerzfrequenz") {
      title = "Ruhe-Herzfrequenz";
    } else if (option === "maxHerzfrequenz") {
      title = "Max.-Herzfrequenz";
    }
    let alert = this.alertCtrl.create({
      title: title,
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
              if (option === "ruheHerzfrequenz") {
                this.ruheHerzfrequenz = ans;
              } else if (option === "maxHerzfrequenz") {
                this.maxHerzfrequenz = ans;
              }
              this.calculateValues();
              this.saveValues();
              // let alert2 = this.alertCtrl.create({
              //   title: 'Erreichter Wert hinzugefügt:',
              //   message: ans,
              //   buttons: [ { text: 'Okay', role: 'cancel' } ]
              // });
              // alert2.present();
            } else {
              let alert3 = this.alertCtrl.create({
                title: title,
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


  infoPage() {
    this.alertCtrl.create({
      title: '<div style="width: 100% !important; zoom: 2.0 !important; margin-left: 24px !important;">ⓘ<div>',
      subTitle: '\
                  Es gibt viele Möglichkeiten, wie Sie die Intensität Ihres Trainings steuern können (→siehe Ausdauertraining). Generell sollte die Belastung bei etwa <b>60 – 80% Ihrer maximalen Leistungsfähigkeit</b> liegen.<br><br> \
                  Die exakteste Methode ist die Bestimmung Ihrer <b>Trainingsherzfrequenzen</b>. Wenn Sie diese ganz genau kennen möchten, sollten Sie eine <b>sportmedizinische Leistungsdiagnostik</b> in einem entsprechenden Fachzentrum machen lassen. Eine Bestimmung mit Hilfe von <b>Pulsmessern</b> ist auch möglich, aber weniger verlässlich. \
                ',
      message: '',
      buttons: [{
          text: "Weiter",
          handler: () => {
            this.alertCtrl.create({
              title: '<div style="width: 100% !important; zoom: 2.0 !important; margin-left: 24px !important;">ⓘ<div>',
              subTitle: '\
                          Am einfachsten, aber auch am ungenauesten ist die Bestimmung mit Hilfe einer <b>Faustformel</b>. Geben Sie dazu hier Ihre <b>Ruheherzfrequenz</b> (in Ruhe liegend 60 Sekunden die Anzahl Ihrer Pulsschläge am Hals oder Handgelenk zählen) und Ihre <b>Maximale Herzfrequenz</b> (220 – Lebensalter) ein und lassen so Ihren persönlichen Trainingsbereich berechnen.<br><br> \
                          <b>Hinweis:</b><br>Die Trainingsherzfrequenz ändert sich ständig und sollte in regelmäßigen Abständen neu bestimmt werden. \
                        ',
              message: '',
              buttons: [{
                text: "Weiter",
                handler: () => {
                  this.alertCtrl.create({
                    title: '<div style="width: 100% !important; zoom: 2.0 !important; margin-left: 24px !important;">ⓘ<div>',
                    subTitle: '\
                                <b>Achtung: kein Training bei:</b><br> \
                                • Kreislaufbeschwerden, <br> &nbsp; Schwindel <br> \
                                • Starken Schmerzen <br> \
                                • Akuten Blutungen <br> \
                                • Fieber oder Infekten <br> \
                                • Übelkeit und Erbrechen <br> \
                                • wenn Sie am gleichen Tag <br> &nbsp; z.B. eine Chemotherapie mit <br> &nbsp; kardiotoxischen Substanzen <br> &nbsp; erhalten haben <br> \
                                • bei sehr schlechten Blutwerten<br> &nbsp; (zu niedriges Hämoglobin <br> &nbsp; bzw. Thrombozyten; <br> &nbsp; Absprache mit Arzt <br> &nbsp; erforderlich!) \
                              ',
                    message: '',
                    buttons: [{ text: 'Okay', role: 'cancel' }]
                  }).present();        
                }
              }]
            }).present();        
          }
        }]
    }).present();
  }

  
}
