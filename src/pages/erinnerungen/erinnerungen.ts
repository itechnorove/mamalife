import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, AlertController, Platform, LoadingController } from 'ionic-angular';

import { File } from '@ionic-native/file';
// import { LocalNotifications } from '@ionic-native/local-notifications';

import { SingletonService } from "../../services/singleton/singleton";
import { AppModule } from "../../app/app.module";

declare var cordova: any;

@Component({
  selector: 'page-erinnerungen',
  templateUrl: 'erinnerungen.html',
  providers: [File] // , LocalNotifications
})
export class ErinnerungenPage {

  @ViewChild('wrapper') wrapper: ElementRef;
  @ViewChild('eigeneErinnerungenWrapper') eigeneErinnerungenWrapper: ElementRef;
  @ViewChild('bisWrapper') bisWrapper: ElementRef;


  ////////////////////////////////////////////
  // max. Notifications
  public maximumNumberOfNotifications: number = 300; // 99
  // + planer Notifications < e.g. max 500 notifications for samsung


  public schedule_initialize: boolean = true;
  public notificationsState: boolean = false; //string = "off";
  // public switchOffNotifications: boolean = false;
  public notificationsAlreadyStarted: boolean = false;
  public erinnerung_texte: Array<{ text: string }>;
  // public erinnerung_text: string;
  // public erinnerung_timer: number;
  public erinnerung_intervall: string = "Einmal täglich";
  public erinnerung_every: number;
  public fileDir: string;
  public fileName: string;
  public configFileOptions: Array<{ option: string, value: string }>;
  // public theme: string;

  public eigene_erinnerung_texte: Array<{ text: string }>;
  public eigenerErinnerungstext: string;
  public fileContent: string;

  public minDate = new Date();
  // public minNachtruheDate = new Date();
  public minISODate: string = this.minDate.toISOString();
  // public minDate: string = this.minISODate.substring(0, 10);
  public minTime: string = this.minISODate.substring(11, 19);
  public myISOStartDate: string = this.minDate.toISOString();
  public myISOEndDate: string = this.minDate.toISOString();

  public myNightStart: string = "22:00";
  public myNightEnd: string = "06:00";

  public erinnerungspool: string = "Voreingestellt";
  public erinnerung_text_entfernen: string;

  public batteryMessage: boolean = true;

  public debugModeCounter: number = 0;

  public verwaltenOptions = {
    title: 'Eigene Erinnerungen',
    // subTitle: 'entfernen'
  };
  public verwendenOptions = {
    title: 'Welche Erinnerungen verwenden',
    // subTitle: 'auswählen'
  };
  public intervallOptions = {
    title: 'Intervall',
    // subTitle: 'auswählen'
  };

  private singleton: SingletonService;

  constructor(public navCtrl: NavController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public platform: Platform,
    // public LocalNotifications: LocalNotifications,
    public File: File) {

    this.initializeTexts();
    this.configFileOptions = [];
    this.eigene_erinnerung_texte = [];
    this.minStartingDate();

    this.singleton = AppModule.injector.get(SingletonService);

    if (typeof cordova != "undefined") {
      this.fileName = this.singleton.configFileName;
      this.fileDir = this.singleton.fileDir;
  }

  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ErinnerungenPage');
    this.readConfigFileOptions();
  }

  ionViewDidEnter() {
    this.updateDisabledItems();

    if (this.batteryMessage) {
      let alert = this.alertCtrl.create({
        title: 'Batterie Manager',
        message: 'Wenn auf Ihrem Handy ein Batterie Manager läuft, sollten Sie bei diesem eine Ausnahme für die "mammaLIFE" App hinzufügen, damit die App nicht automatisch geschlossen wird und Erinnerungen und geplante Aktivitäten nicht erscheinen.',
        buttons: [{
          text: "Nicht mehr anzeigen",
          handler: () => {
            this.batteryMessage = false;
            this.configFileOptions.push({ option: "batteryMessageErinnerungen", value: "false" });
            this.writeConfigFileOptions();
          }
        }, {
          text: "Okay",
          role: 'cancel'
        }]
      })
      alert.present();
    }

    if (typeof cordova == "undefined") return;
    this.checkRemainingNotifications();
  }

  ionViewWillLeave() {
    // // this.writeConfigFileOptions();
    // let loader = this.loadingCtrl.create({
    //   duration: 1000,
    //   // dismissOnPageChange: true
    // });
    // loader.present();
  }

	infoPage() {
		this.alertCtrl.create({
		  title: '<div style="width: 100% !important; zoom: 2.0 !important; margin-left: 24px !important;;">ⓘ<div>',
		  subTitle: '\
                  Neben regelmäßiger Meditation geht es auch darum, im Alltag immer wieder aus unbewussten Reaktionsmustern auszusteigen und ganz präsent zu werden. Kurze Achtsamkeits-Impulse helfen Ihnen dabei, mit Ihrer Aufmerksamkeit wieder im Moment anzukommen und einfach nur wahrzunehmen.<br><br> \
                  Sie können entscheiden, wie lange und wie oft. \
                ',
		  message: '',
		  buttons: [{ text: 'Okay', role: 'cancel' }]
		}).present();
	  }

  initializeTexts() {
    this.erinnerung_texte = [
      //text: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
      //max sichtbare breite variabel je nach breite der buchstaben :/
      { text: 'Nimm einige Augenblicke die Empfindungen in deinem Körper wahr.' },
      { text: 'Spüre hin zu der Haltung, in der sich dein Körper gerade befindet.' },
      { text: 'Was hörst du gerade? Höre wirklich hin und sei gegenwärtig und wach.' },
      { text: 'Lenke deine Aufmerksamkeit fünf Atemzüge lang auf deine Atmung.' },
      { text: 'Lass deinen Atem einfach geschehen.' },
      { text: 'Spüre den Untergrund auf dem du gerade stehst oder sitzt.' },
      { text: 'Kannst du die Raumtemperatur auf deiner Haut spüren?' },
      { text: 'Spüre einige Atemzüge lang das Heben und Senken deiner Bauchdecke.' },
      { text: 'Werde dir der Anspannungen in deinem Körper bewusst.' },
      { text: 'Was machst du gerade? Welche Absicht verfolgst du dabei?' },
      { text: 'Achte auf deine innere Haltung. Versuchst du gerade, dich zu beeilen oder setzt du dich unter Druck?' },
      { text: 'Halte für einige Momente inne.' },
      { text: 'Wie fühlst du dich gerade?' },
      { text: 'Nimm bewusst wahr, wo du dich gerade befindest.' },
      { text: 'Welche Menschen umgeben dich gerade? Und wie geht es dir dabei?' },
      { text: 'Wie fühlen sich deine Schultern gerade an?' },
      { text: 'Sind deine Zähne aufeinander gebissen?' },
      { text: 'Welche Gedanken gehen dir gerade durch den Kopf?' },
      { text: 'Was machen die Menschen um dich herum gerade?' },
      { text: 'Tue das was du gerade tust. Ganz.' }
    ];
  }

  checkRemainingNotifications() {
    let notificationsState: boolean = false;
    // clear currently shown notifications
    cordova.plugins.notification.local.clearAll();

    // check remaining notifications
			cordova.plugins.notification.local.getAll( (notifications) => {
				notifications.forEach((not) => {
						if (not.id < 100000 ) { // erinnerungen notifications only
              notificationsState = true;
              this.notificationsState = true;
						}
					});
      // }).then(() => { 
      //   this.notificationsState = notificationsState;
      });

      this.singleton.debugLog("notificationsState:"+notificationsState+", this.notificationsState:"+this.notificationsState);
      if (this.notificationsState === false) {
      this.wrapper.nativeElement.classList.remove('item-disabled');
    } else {
      this.wrapper.nativeElement.classList.add('item-disabled');
    }

  }


  minStartingDate() {

    setTimeout(() => {

      // min start date 
      if (this.notificationsState === true) return;
      let minDate = new Date();
      minDate.setHours(minDate.getHours() + 1);                  									  // correct timezone
      if (this.checkSommerzeit(minDate)) minDate.setHours(minDate.getHours() + 1 ); // Sommerzeit
      minDate.setMinutes(minDate.getMinutes() + 1); // default start date + 1 min
      this.minISODate = minDate.toISOString();
      if (new Date(this.myISOStartDate) < minDate) {
        this.myISOStartDate = minDate.toISOString();
      }

      // min end date
      minDate = new Date(this.myISOStartDate);
      minDate.setMinutes(minDate.getMinutes() + 30); // default end date + 30 min
      if (new Date(this.myISOEndDate) < minDate) {
        this.myISOEndDate = minDate.toISOString();
      }

      // min Nachtruhe
      if (this.myNightEnd.split(':')[0] === this.myNightStart.split(':')[0]) {
        let newHour = parseInt(this.myNightEnd.split(':')[0]) + 1;
        let newNightEnd = newHour.toString() + ":" + this.myNightEnd.split(':')[1];
        if (newHour.toString().length < 2) {
          newNightEnd = "0" + newHour.toString() + ":" + this.myNightEnd.split(':')[1];
        }
        if (newHour === 24) {
          newNightEnd = "00:" + this.myNightEnd.split(':')[1];
        }
        this.myNightEnd = newNightEnd;
      }

    }, 200);

    // let minNachtruheDate = this.parseISOString(this.myNightStart);
    // minNachtruheDate.setHours(minNachtruheDate.getHours() + 2); // correct timezone
    // minNachtruheDate.setHours(minNachtruheDate.getHours() + 1); // standard end date + 1h
    // if (parseInt(this.myNightEnd.split(':')[0]) < minNachtruheDate.getHours()) {
    //   this.myNightEnd = minNachtruheDate.getHours() + ":" + minNachtruheDate.getMinutes();
    // }
    // this.minNachtruheDate = minNachtruheDate;

  }

  updateDisabledItems() {
    if (this.erinnerungspool === 'Voreingestellt')
    { this.eigeneErinnerungenWrapper.nativeElement.classList.add('item-disabled'); }
    else { this.eigeneErinnerungenWrapper.nativeElement.classList.remove('item-disabled'); }
  }


  toggleNotifications() {
    let notificationLoader = this.loadingCtrl.create({
      duration: 999,
      // dismissOnPageChange: true
    });
    notificationLoader.present().then(() => this.doToggleNotifications());

  }


  doToggleNotifications() {
    if (typeof cordova == "undefined") return;
    // console.log("this.notificationsState" + this.notificationsState);

    if (this.notificationsState === false) {
      // switch off

      // cordova.plugins.notification.local.clearAll().then(
      //   () => cordova.plugins.notification.local.cancelAll().then(
      //     () => {
      //       this.File.removeRecursively(this.fileDir + "cache/", "localnotification")
      //         .catch((error) => {
      //           // console.log('removeDir error: ' + JSON.stringify(error))
      //         }).then(
      //         () => {
      //         }
      //         );
      //     }
      //   )
      // );

			cordova.plugins.notification.local.getAll(function (notifications) {
				notifications.forEach((not) => {
						if (not.id < 100000 ) { // erinnerungen notifications only
							cordova.plugins.notification.local.cancel(not.id);
						}
					});
			});

      this.minStartingDate();
      this.notificationsAlreadyStarted = false;
      this.notificationsState = false;
      this.wrapper.nativeElement.classList.remove('item-disabled');
    } else {
      // switch on
      if (this.notificationsAlreadyStarted === true) { // prevent double activation
        this.notificationsAlreadyStarted = false;
      } else {
        this.schedule();
      }
      this.notificationsState = true;
      this.wrapper.nativeElement.classList.add('item-disabled');
    }

    this.writeConfigFileOptions();

  }


  parseISOString(s): Date {
    var b = s.split(/\D+/);
    return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
  }
	checkSommerzeit( checkDate: Date ) : boolean {
		// check DST (Daylight Saving Time) (Sommer-/Winterzeit)
		var jan = new Date(checkDate.getFullYear(), 0, 1);
		var jul = new Date(checkDate.getFullYear(), 6, 1);
		var stdTimezoneOffset = Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
		var unterschied =  checkDate.getTimezoneOffset() - stdTimezoneOffset;
		// console.log("Datum: " + checkDate + " Unterschied:" + unterschied);
		if ( unterschied === 0 ) {
			return false;
		} else {
			return true;			
		}
	}

  schedule() {

    // skip initial call, obsolete -> notificationsAlreadyStarted
    // if (this.schedule_initialize) {
    //   this.schedule_initialize = false;
    //   console.log("skipping initial call");
    //   return;
    // }

    // set notification title
    let erinnerungTitel = "Innehalten";

    let maxErinnerungen = this.maximumNumberOfNotifications;
    switch (this.erinnerung_intervall) {
      case "Einmalig":
        this.erinnerung_every = 0;
        maxErinnerungen = 1;
        break;
      case "Alle 30 Minuten":
        this.erinnerung_every = 30;
        break;
      case "Jede Stunde":
        this.erinnerung_every = 60;
        break;
      case "Alle 2 Stunden":
        this.erinnerung_every = 120;
        break;
      case "Alle 4 Stunden":
        this.erinnerung_every = 240;
        break;
      case "Alle 6 Stunden":
        this.erinnerung_every = 360;
        break;
      case "Alle 12 Stunden":
        this.erinnerung_every = 720;
        break;
      case "Einmal täglich":
        this.erinnerung_every = 1440;
        break;
      case "Test: 1 Minute":
        this.erinnerung_every = 1;
        break;
      default:
        this.erinnerung_every = 0;
        maxErinnerungen = 1;
        break;
    }




    // // calculate no. of notifications
    // var intervallMilliseconds = (new Date(this.myISOEndDate).getTime()
    //   - new Date(this.myISOStartDate).getTime());
    // // let intervallMinutes = Math.round(((intervallMilliseconds % 86400000) % 3600000) / 60000);
    // let intervallMinutes = Math.round(intervallMilliseconds / 60000);
    // if (this.erinnerung_every !== 0) {
    //   maxErinnerungen = Math.floor(intervallMinutes / this.erinnerung_every);
    // } else {
    //   maxErinnerungen = 1;
    // }
    // if (maxErinnerungen === 0) maxErinnerungen = 1; // reason: daily doesnt fit into one hour intervall

    // // samsung max 500 notifications
    // if (maxErinnerungen > 99) maxErinnerungen = this.maximumNumberOfNotifications;




    ////////////////////////////////////////////
    // create bulk of notifications (reliable)
    // try {


    let myNightStartHours: number = parseInt(this.myNightStart.split(':')[0]);
    let myNightStartMinutes: number = parseInt(this.myNightStart.split(':')[1]);;
    let myNightEndHours: number = parseInt(this.myNightEnd.split(':')[0]);;
    let myNightEndMinutes: number = parseInt(this.myNightEnd.split(':')[1]);;

    let notificationID = 1;

    let endDate = this.parseISOString(this.myISOEndDate)
    // endDate.setHours(endDate.getHours() - 2);                     // re-correct timezone
    endDate.setHours(endDate.getHours() - 1);                  									  // re-correct timezone
    if (this.checkSommerzeit(endDate)) endDate.setHours(endDate.getHours() - 1 ); // Sommerzeit
    endDate.setSeconds(0);                                        // sharp time
    endDate.setMilliseconds(0);

    let notCounter = 0;
    while (notificationID <= maxErinnerungen) {

      let zeitpunkt = this.parseISOString(this.myISOStartDate);
      // zeitpunkt.setHours(zeitpunkt.getHours() - 2);             // re-correct timezone
      zeitpunkt.setHours(zeitpunkt.getHours() - 1);                  									  // re-correct timezone
      if (this.checkSommerzeit(zeitpunkt)) zeitpunkt.setHours(zeitpunkt.getHours() - 1 ); // Sommerzeit
      zeitpunkt.setSeconds(0);                                  // sharp time
      zeitpunkt.setMilliseconds(0);                             // sharp time
      let next_time = notCounter * this.erinnerung_every;
      zeitpunkt.setMinutes(zeitpunkt.getMinutes() + next_time); // add intervall for next notification
      notCounter++;

      if (zeitpunkt > endDate) { break; }                       // quit if zeitpunkt is after end date

      ////////////////////////////////////////////
      // check if zeitpunkt is not in Nachtruhe

      let zeitpunkt_not_in_Nachtruhe: boolean = true;

      if (myNightStartHours < myNightEndHours
        || (myNightStartHours === myNightEndHours && myNightStartMinutes <= myNightEndMinutes)) {
        // nachtruhe start before nachtruhe end ( 14:00 - 20:00 )
        if (zeitpunkt.getHours() > myNightStartHours
          || (zeitpunkt.getHours() === myNightStartHours && zeitpunkt.getMinutes() >= myNightStartMinutes)) {
          // zeitpunkt after nachtruhe start ( > 14:00 )
          if (zeitpunkt.getHours() < myNightEndHours
            || (zeitpunkt.getHours() === myNightEndHours && zeitpunkt.getMinutes() <= myNightEndMinutes)) {
            // (and) zeitpunkt before nachtruhe end ( < 20:00 )
            zeitpunkt_not_in_Nachtruhe = false;
          }
        }
      } else {
        // nachtruhe start after nachtruhe end ( 22:00 - 06:00 )
        if (zeitpunkt.getHours() > myNightStartHours
          || (zeitpunkt.getHours() === myNightStartHours && zeitpunkt.getMinutes() >= myNightStartMinutes)) {
          // zeitpunkt after nachtruhe start ( > 22:00 )
          zeitpunkt_not_in_Nachtruhe = false;
        }
        if (zeitpunkt.getHours() < myNightEndHours
          || (zeitpunkt.getHours() === myNightEndHours && zeitpunkt.getMinutes() <= myNightEndMinutes)) {
          // (or) zeitpunkt before nachtruhe end ( < 06:00 )
          zeitpunkt_not_in_Nachtruhe = false;
        }
      }


      // console.log("############### " + zeitpunkt.getHours() + ":" + zeitpunkt.getMinutes() +
      //             " >>> zeitpunkt_not_in_Nachtruhe=" + zeitpunkt_not_in_Nachtruhe);


      if (zeitpunkt_not_in_Nachtruhe) {

        let erinnerungText = "";
        let rn = 0;
        try {
          if (this.erinnerungspool === "Voreingestellt") {
            rn = Math.round(Math.random() * (this.erinnerung_texte.length - 1) + 0);
            erinnerungText = this.erinnerung_texte[rn].text;
          } else {
            rn = Math.round(Math.random() * (this.eigene_erinnerung_texte.length - 1) + 0);
            erinnerungText = this.eigene_erinnerung_texte[rn].text;
          }
        } catch (err) {
          // console.log("############# error: " + err);
          // console.log("############# rn: " + rn);
          // console.log("############# erinnerungText: " + erinnerungText);
          // console.log("############# this.erinnerung_texte.length: " + this.erinnerung_texte.length);
          // console.log("############# this.eigene_erinnerung_texte.length: " + this.eigene_erinnerung_texte.length);
          // console.log("############# zeitpunkt: " + zeitpunkt);
          // console.log("############# zeitpunkt: " + zeitpunkt);
          // console.log("############# next_time: " + next_time);
          // console.log("############# zeitpunkt: " + zeitpunkt);
        }

        cordova.plugins.notification.local.schedule({
          id: notificationID,
          title: erinnerungTitel,
          text: erinnerungText,
          trigger: { at: zeitpunkt },
          // every: "0", // this.erinnerung_every.toString(), // "minute", "hour", "day", "week", "month", "year" // every: 30 // every 30 minutes
          // data: { headline: "Innehalten" },
          // sound: "file://assets/sounds/chimes_sc.mp3",     // app crashes
          // icon: "file://assets/images/icon.png",
          icon: "res://icon",
          // smallIcon: "res://icon",
          // led: 00FF00,
          // badge: 1,
        });
        notificationID++;
        // } else {
        // if zeitpunkt in nachtruhe
        // maxErinnerungen++;  // <-- creates notifications after(!) the desired intervall
      }

      // prevent app/handy crashes
      if (notCounter > 10000) {
        let notAlert = this.alertCtrl.create({
          title: "Es ist ein Fehler aufgetreten!",
          subTitle: "Bitte die Einstellungen für Erinnerungen überprüfen.",
          buttons: [{
            text: "Okay",
            handler: () => { }
          }]
        });
        notAlert.present().then(() => { });
        break;
      };

    }

    // } catch (e) { console.log("error:" + JSON.stringify(e)); }

  }


  eigeneErinnerungErstellen() {
    // this.erinnerung_text = "";
    let alert = this.alertCtrl.create({
      title: 'Eigener Erinnerungstext',
      inputs: [
        {
          name: 'erinnerungstext',
          placeholder: 'Text eingeben'
        }
      ],
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
          // handler: data => {
          //   console.log('Cancel clicked');
          // }
        },
        {
          text: 'Speichern',
          handler: data => {
            let erinnerungstext = data.erinnerungstext.trim();
            if (erinnerungstext != "") {
              // console.log(data.erinnerungstext);
              // this.erinnerung_texte.reverse();
              this.eigene_erinnerung_texte.push({ text: erinnerungstext });
              // this.erinnerung_texte.reverse();
              // this.erinnerung_text = data.erinnerungstext;
              this.erinnerung_text_entfernen = "Verwalten";
              this.writeConfigFileOptions();
              let alert2 = this.alertCtrl.create({
                title: 'Eigener Erinnerungstext hinzugefügt',
                message: erinnerungstext,
                buttons: [
                  {
                    text: 'Okay',
                    role: 'cancel',
                    // handler: data => {
                    //   console.log('Cancel clicked');
                    // }
                  }
                ]
              });
              alert2.present();
            } else {
              let alert3 = this.alertCtrl.create({
                title: 'Eigener Erinnerungstext',
                message: 'Bitte einen Text für die eigenen Erinnerung eingeben.',
                buttons: [
                  {
                    text: 'Okay',
                    role: 'cancel',
                    // handler: data => {
                    //   console.log('Cancel clicked');
                    // }
                  }
                ]
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

  eigeneErinnerungEntfernen() {

    if (typeof this.erinnerung_text_entfernen == "undefined") {
      let alert = this.alertCtrl.create({
        title: 'Es ist ein Fehler aufgetreten!',
        message: "Kein Erinnerungstext ausgewählt.",
        buttons: [
          {
            text: 'Okay',
            role: 'cancel'
          }
        ]
      });
      alert.present();
      this.erinnerung_text_entfernen = "Verwalten";
      return;
    }


    let iEle;
    // do {
    // find
    iEle = this.getIndexOfMultidimensionalArray(this.eigene_erinnerung_texte, this.erinnerung_text_entfernen);
    // if exists, remove
    if (iEle > -1) this.eigene_erinnerung_texte.splice(iEle, 1);
    // } while (iEle > -1);

    // if no more custom notifications, set to standard notifications
    //if (this.eigene_erinnerung_texte.length === 0) this.erinnerungspool = "Voreingestellt";

    // user feedback
    let alert = this.alertCtrl.create({
      title: 'Eigener Erinnerungstext entfernt',
      message: this.erinnerung_text_entfernen,
      buttons: [
        {
          text: 'Okay',
          role: 'cancel'
        }
      ]
    });
    alert.present();

    this.erinnerung_text_entfernen = "Verwalten";

    this.writeConfigFileOptions();

  }

  getIndexOfMultidimensionalArray(a, v) {
    var l = a.length;
    for (var k = 0; k < l; k++) {
      // dim.: text
      if (a[k].text === v.trim()) {
        return k;
      }
    }
    return -1;
  }



  readConfigFileOptions(): Promise<any> {
    if (typeof cordova == "undefined") return;

    this.File.readAsText(this.fileDir + "files/", this.fileName)
      .then(content => {
        this.configFileOptions = [];
        // let plainFileContent = atob(content.toString());
        let plainFileContent = content.toString();
        // console.log("##########" + plainFileContent);
        var options = plainFileContent.split("\n");
        for (var iO = 0; iO <= options.length; iO++) {
          let optionDelimiter = options[iO].indexOf("=");
          if (optionDelimiter > -1) {
            let currentOption = options[iO].substring(0, optionDelimiter);
            let currentValue = options[iO].substring(optionDelimiter + 1, options[iO].length);
            try {
              this.configFileOptions.push({
                option: currentOption,
                value: currentValue
              });
              if (currentOption === "batteryMessageErinnerungen") { // batteryMessageErinnerungen
                this.batteryMessage = false;
              }
              if (currentOption === "eet") { // eigene Erinerungstexte
                this.eigene_erinnerung_texte.push({ text: currentValue });
              }
              if (currentOption === "notificationsState") { // notificationsState
                if (currentValue === "on" || currentValue === "true") {
                  this.notificationsState = true;
                  this.notificationsAlreadyStarted = true;
                } else {
                  this.notificationsState = false;
                }
              }
              if (currentOption === "notISOStartDate") { // myISOStartDate
                this.myISOStartDate = currentValue;
              }
              if (currentOption === "notISOEndDate") { // myISOEndDate
                this.myISOEndDate = currentValue;
              }
              if (currentOption === "notIntervall") { // erinnerung_intervall
                this.erinnerung_intervall = currentValue;
              }
              if (currentOption === "notNightStart") { // myNightStart
                this.myNightStart = currentValue;
              }
              if (currentOption === "notNightEnd") { // myNightEnd
                this.myNightEnd = currentValue;
              }
              if (currentOption === "notPool") { // erinnerungspool
                this.erinnerungspool = currentValue;
                this.updateDisabledItems();
              }
            } catch (err) {
              // console.log(err);
            }
            this.minStartingDate();
          }
        }
      })
      .catch(err => {
        // console.log(JSON.stringify(err));
      });

      if (this.notificationsState === false) {
        this.wrapper.nativeElement.classList.remove('item-disabled');
      } else {
        this.wrapper.nativeElement.classList.add('item-disabled');
      }
  
    return new Promise(function (resolve, reject) {
      return resolve();
    });
  }

  writeConfigFileOptions() {

    this.minStartingDate();
    this.updateDisabledItems();

    let fileContent = "";
    // all config file options but eet's and not's
    this.configFileOptions.forEach(element => {
      if (element.option.substr(0, 3) != "eet" && element.option.substr(0, 3) != "not") {
        fileContent = fileContent + element.option + '=' + element.value + '\n';
      }
    });

    fileContent = fileContent + "notificationsState" + '=' + this.notificationsState + '\n';
    fileContent = fileContent + "notISOStartDate" + '=' + this.myISOStartDate + '\n';
    fileContent = fileContent + "notISOEndDate" + '=' + this.myISOEndDate + '\n';
    fileContent = fileContent + "notIntervall" + '=' + this.erinnerung_intervall + '\n';
    fileContent = fileContent + "notNightStart" + '=' + this.myNightStart + '\n';
    fileContent = fileContent + "notNightEnd" + '=' + this.myNightEnd + '\n';
    fileContent = fileContent + "notPool" + '=' + this.erinnerungspool + '\n';

    // eets
    this.eigene_erinnerung_texte.forEach(element => {
      fileContent = fileContent + "eet" + '=' + element.text + '\n';
    });

    // console.log("##########" + fileContent);

    // this.writeFile(this.fileName, btoa(fileContent));
    this.writeFile(this.fileName, fileContent);

  }

  writeFile(filename, filecontent) {
    this.File.removeFile(this.fileDir + "files/", filename)
      .then(() => this.File.writeFile(this.fileDir + "files/", filename, filecontent).then(
        (response) => {
          // console.log('config file updated: ' + JSON.stringify(response));
        }, (err) => {
          // console.log('config file error: ' + JSON.stringify(err));
        }));
  }



  //////////////////////////////////////
  // test functions

  debugMode() {
    this.debugModeCounter++;
    if (this.debugModeCounter === 7) alert("debug mode enabled");
  }

  resetConfigFile() {
    let alert = this.alertCtrl.create({
      title: 'Really resetConfigFile?',
      buttons: [{
        text: "Okay",
        handler: () => {
          // this.writeFile(this.fileName, btoa('status=2\n'));
          this.writeFile(this.fileName, 'status=2\n');
        }
      }, {
        text: "Abbrechen",
        role: 'cancel'
      }]
    })
    alert.present();
  }



  // readConfigFileOption(option: string) {
  //   let retpara = "";
  //   this.File.readAsText(this.fileDir + "files/", this.fileName)
  //     .then(content => {
  //       this.fileContent = atob(content.toString());
  //       let iOptionStart = this.fileContent.indexOf(option);
  //       if (iOptionStart > -1) {
  //         let iValStart = iOptionStart + option.length + 1;
  //         let iValEnd = iValStart + this.fileContent.substring(iValStart, this.fileContent.length).indexOf("\n");
  //         if (iValEnd < iValStart) iValEnd = this.fileContent.length;
  //         retpara = this.fileContent.substring(iValStart, iValEnd);
  //         alert("'" + option + "' = '" + retpara + "'");
  //         // console.log("==========> " + option + ": " + retpara);
  //         return retpara;
  //       } else {
  //         retpara = "not found";
  //         alert("'" + option + "' = '" + retpara + "'");
  //         // console.log("==========> " + option + ": " + retpara);
  //         return retpara;
  //       }
  //     })
  //     .catch(err => {
  //       // console.log(JSON.stringify(err));
  //     });
  //   // alert(retpara);
  //   // return retpara;
  // }




  // getItems(ev: any) {
  //   // Reset items back to all of the items
  //   this.initializeTexts();

  //   // set val to the value of the searchbar
  //   let val = ev.target.value;

  //   // if the value is an empty string don't filter the items
  //   if (val && val.trim() != '') {
  //     this.erinnerung_texte = this.erinnerung_texte.filter((item) => {
  //       return (item.text.toLowerCase().indexOf(val.toLowerCase()) > -1);
  //     })
  //   }
  // }


  // changeConfigFileOption(option: string, newvalue: string) {
  //   this.File.readAsText(this.fileDir + "files/", this.fileName)
  //     .then(content => {
  //       this.fileContent = atob(content.toString());
  //       let iOptionStart = this.fileContent.indexOf(option);
  //       alert(iOptionStart);
  //       if (iOptionStart === -1) {
  //         //add option
  //         this.writeFile(this.fileName, btoa(this.fileContent + option + "=" + newvalue + "\n"));
  //       }
  //       let iValStart = iOptionStart + option.length + 1;
  //       let iValEnd = iValStart + this.fileContent.substring(iValStart, this.fileContent.length).indexOf("\n");

  //       //change value
  //       let sContentBeforeValue = this.fileContent.substring(0, iValStart);
  //       let sContentAfterValue = this.fileContent.substring(iValEnd + 1, this.fileContent.length);
  //       let newContent = sContentBeforeValue + newvalue + sContentAfterValue;
  //       this.writeFile(this.fileName, btoa(newContent));
  //     })
  //     .catch(err => {
  //       // console.log(JSON.stringify(err));
  //     });
  // }

  // removeConfigFileOption(option: string) {
  //   this.File.readAsText(this.fileDir + "files/", this.fileName)
  //     .then(content => {
  //       this.fileContent = atob(content.toString());
  //       let iOptionStart = this.fileContent.indexOf(option);
  //       alert(iOptionStart);
  //       if (iOptionStart > -1) {
  //         let iStart = iOptionStart;
  //         let iEnd = this.fileContent.substring(iStart, this.fileContent.length).indexOf("\n");

  //         //change value
  //         let sContentBeforeValue = this.fileContent.substring(0, iStart);
  //         let sContentAfterValue = this.fileContent.substring(iEnd + 1, this.fileContent.length);

  //         this.writeFile(this.fileName, btoa(sContentBeforeValue + sContentAfterValue));
  //       }
  //     })
  //     .catch(err => {
  //       // console.log(JSON.stringify(err));
  //     });
  // }




}
