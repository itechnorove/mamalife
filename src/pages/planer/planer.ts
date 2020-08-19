import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, Platform } from 'ionic-angular';

import { File } from '@ionic-native/file';
import { LocalNotifications } from '@ionic-native/local-notifications';

// import { MeditationPage } from '../meditation/meditation';
// import { YogaPage } from '../yoga/yoga';

import { SingletonService } from "../../services/singleton/singleton";
import { AppModule } from "../../app/app.module";

declare var cordova: any;

@Component({
	selector: 'page-planer',
	templateUrl: 'planer.html',
  providers: [ File, LocalNotifications ]
})
export class PlanerPage {

	searchQuery: string = '';
	items: string[];
	public AvailableActivities: Array<{ activity: string }>;
	public ViewList: Array<{ activity: string, am: string, notID: number }>;
	public AllActivityPlan: Array<{ activity: string, am: string, notID: number }>;
	public ActivityHistory: Array<{ activity: string, am: string, notID: number }>;
	public segmentbutton: string = "Aktiv";

	public myDate: Date = new Date();
	public myISODate: string = this.myDate.toISOString();
	public myDateDate: string = this.myISODate.substring(0, 10);
	public myDateTime: string = this.myISODate.substring(11, 19);
	public planerISODate: string;
	public planerActivity: string;
	public plannedActivityPassed: boolean = false;

	public fileDir: string;
	public fileName: string;
	public configFileOptions: Array<{ option: string, value: string }>;

	public batteryMessage: boolean = true;

	private singleton: SingletonService;

	constructor(public navCtrl: NavController, 
				public navParams: NavParams, 
				public alertCtrl: AlertController,
    			public loadingCtrl: LoadingController,
				public platform: Platform, 
				public LocalNotifications: LocalNotifications,
				public File: File) {


		this.AvailableActivities = [
			{ activity: 'Meditation' },
			{ activity: 'Yoga' },
			{ activity: 'Ausdauertraining' },
			{ activity: 'Krafttraining' },
		];


		// this.LocalNotifications.on("click", (notification, state) => {

		// 	this.platform.ready().then(() => {
		// 		// let alert = alertCtrl.create({
		// 		//   title: 'Planer',
		// 		//   subTitle: notification.text,
		// 		//   buttons: [{
		// 		//     text: "Starten",
		// 		//     handler: () => { this.navCtrl.push(YogaPage); }
		// 		//   }, {
		// 		//     text: "Abbrechen",
		// 		//     handler: () => { platform.exitApp(); }
		// 		//   }]
		// 		// });
		// 		// alert.present()
				
		// 		//this.navCtrl.push(YogaPage);
		// 	});

		// });


		// let now = this.myISODate;
		this.ViewList = [];
		this.AllActivityPlan = [];
		this.ActivityHistory = [];

		this.configFileOptions = [];

		if (typeof cordova !== "undefined") {
			this.singleton = AppModule.injector.get(SingletonService);
			this.fileName = this.singleton.configFileName;
			this.fileDir = this.singleton.fileDir;
		}

		this.readConfigFileOptions();

	}

	ionViewDidLoad() {
		// this.singleton.debugLog('ionViewDidLoad PlanerPage');
	}

	ionViewDidEnter() {
		if (this.batteryMessage) {
			let alert = this.alertCtrl.create({
				title: 'Batterie Manager',
				message: 'Wenn auf Ihrem Handy ein Batterie Manager läuft, sollten Sie bei diesem eine Ausnahme für die "mammaLIFE" App hinzufügen, damit die App nicht automatisch geschlossen wird und Erinnerungen und geplante Aktivitäten nicht erscheinen.',
				buttons: [{
					text: "Nicht mehr anzeigen",
					handler: () => {
						this.batteryMessage = false;
						this.configFileOptions.push({ option: "batteryMessagePlaner", value: "false" });
						this.writeConfigFileOptions();
					}
				}, {
					text: "Okay",
					role: 'cancel'
				}]
			})
			alert.present();
		}

		this.filterItems("Aktiv"); 
		

		////////////////////////////////////////
		// check for triggered Notifications

		// this.AllActivityPlan.forEach(
		// 	(AllActivityPlan) => {
		// 		// this.singleton.debugLog("-----> AllActivityPlan.notID:" + AllActivityPlan.notID)

		// 		// only works on android devices, iOS re-schedules triggered notifications:
		// 		if (typeof cordova == "undefined") return;
		// 		this.LocalNotifications.get(AllActivityPlan.notID).then(
		// 			(locnot) => { 
		// 				// this.singleton.debugLog('=====> locnot:' + JSON.stringify(locnot));
		// 		});

		// 	}
		// );


	}

	ionViewWillLeave() {
		// let loader = this.loadingCtrl.create({
		// 	duration: 1000,
		// 	// dismissOnPageChange: true
		// });
		// loader.present();
	}


	////////////////////////////////////////////////////////////////////////////
	// filterItems
	////////////////////////////////////////////////////////////////////////////
	
	filterItems(filterString: string) {


		////////////////////////////////
		// plan activity button
		// var planActivityToolbar = document.querySelector(".planActivityToolbar");
		var planActivityToolbar = <HTMLDivElement>document.getElementById("planActivityToolbar");
		if (filterString === "Verlauf"){
			planActivityToolbar.classList.add('button-disabled');
		}
		if (filterString === "Aktiv"){
			planActivityToolbar.classList.remove('button-disabled');
		}


		/////////////////////////////////////////////////////
		// if no items, clear remaining notification zombies
		// if ( typeof this.ViewList == "undefined" )
		if ( this.AllActivityPlan.length <= 0 ) {
			if (typeof cordova == "undefined") return;
			cordova.plugins.notification.local.getAll(function (notifications) {
				notifications.forEach((not) => {
						if (not.id > 100000 ) { // planned activity notifications only
							cordova.plugins.notification.local.cancel(not.id);
						}
					});
			});
			return;
		}


		///////////////////////////////////////////////////////////////////////
		// if items available, decativate segmentButtonContainer, start Loader
		var segmentButtonContainer = <HTMLDivElement>document.getElementById("segmentButtonContainer");
		let loader = this.loadingCtrl.create({
			duration: 999,
			// dismissOnPageChange: true
		});
		if ( this.AllActivityPlan.length > 0 && typeof cordova != "undefined" ) {
			loader.present();
			segmentButtonContainer.classList.add('item-disabled');
		}

		////////////////////////////////
		// populate ViewList
		this.ViewList = [];

		// sort by date
		let tmpList: Array<{ activity: string, am: string, notID: number }> = [];
		this.AllActivityPlan.forEach((AllActivityPlan) => {
			tmpList.push({ activity: AllActivityPlan.activity, am: AllActivityPlan.am, notID: AllActivityPlan.notID });
		});
		this.AllActivityPlan.sort((a, b) => {
			let fromValues = tmpList.map(f => f.am);
			return fromValues.indexOf(a.am) < fromValues.indexOf(b.am) ? -1 : 1;
		});


		////////////////////////////////
		// prepare date(now) for check
		let now = new Date();
		// now.setHours(now.getHours() - 1); 										// correct timezone
		// if (this.checkSommerzeit(now)) now.setHours(now.getHours() - 1 );	    // Sommerzeit
		// now.setHours(now.getHours() + 1); 									// correct Timezone
		// if (this.checkSommerzeit(now)) now.setHours(now.getHours() + 1 );	// Sommerzeit			
		// now.setMinutes(now.getMinutes() - 1); 								// next Minute, if triggered late
		this.singleton.debugLog("now:" + now);

		////////////////////////////////
		// filter ViewList: active
		if ( filterString === "Aktiv" ) {
			this.AllActivityPlan.forEach((AllActivityPlan) => {
				// this.singleton.debugLog("##### AllActivityPlan.notID: " + AllActivityPlan.notID);
				
				// // only works on android devices, iOS re-schedules triggered notifications:
				// if (typeof cordova == "undefined") return;
				// this.LocalNotifications.getScheduledIds().then(
				// 	(scheduledIDs) => {
				// 		scheduledIDs.forEach(
				// 			(sID) => {
				// 				// this.singleton.debugLog("##### sID: " + sID);
				// 				if (sID === AllActivityPlan.notID) {
				// 					this.ViewList.push({ activity: AllActivityPlan.activity, am: AllActivityPlan.am, notID: AllActivityPlan.notID })
				// 				}
				// 		});
				// 	segmentButtonContainer.classList.remove('item-disabled');
				// 	loader.dismiss().then(()=>{}).catch(()=>{});
				// });

				let am = this.parseISOString(AllActivityPlan.am);
				if (this.checkSommerzeit(am)) am.setHours(am.getHours() - 1 );	    // Sommerzeit
				this.singleton.debugLog("am:" + am);
				if ( am > now ) {
				// this.plannedActivityHasPassed(AllActivityPlan.notID); {
				// if (this.plannedActivityPassed)
					this.ViewList.push({ activity: AllActivityPlan.activity, am: AllActivityPlan.am, notID: AllActivityPlan.notID });
				}
				segmentButtonContainer.classList.remove('item-disabled');
				loader.dismiss().then(()=>{}).catch(()=>{});

			});
		}

		////////////////////////////////
		// filter ViewList: history
		if ( filterString === "Verlauf" ) {
			var ViewListContainer = <HTMLDivElement>document.getElementById("ViewListContainer");
			ViewListContainer.classList.add('item-hidden');

			// // only works on android devices, iOS re-schedules triggered notifications:			
			// this.AllActivityPlan.forEach((AllActivityPlan) => {
			// 	this.ViewList.push({ activity: AllActivityPlan.activity, am: AllActivityPlan.am, notID: AllActivityPlan.notID });
			// });
			// if (typeof cordova == "undefined") return;
			// this.LocalNotifications.getScheduledIds().then(
			// 	(scheduledIDs) => {
			// 		scheduledIDs.forEach(
			// 			(sID) => {
			// 				// this.singleton.debugLog("##### sID: " + sID);
			// 				let position = this.getIndexOfMultidimensionalArray(this.ViewList, sID);
			// 				if (position > -1) {
			// 					this.ViewList.splice(position, 1);
			// 				}
			// 		});
			// 		ViewListContainer.classList.remove('item-hidden');
			// 		segmentButtonContainer.classList.remove('item-disabled');
			// 		loader.dismiss();
			// });

			this.AllActivityPlan.forEach((AllActivityPlan) => {
				let am = this.parseISOString(AllActivityPlan.am);
				if (this.checkSommerzeit(am)) am.setHours(am.getHours() - 1 );	    // Sommerzeit
				this.singleton.debugLog("am:" + am);
				if ( am < now ) {
				// this.plannedActivityHasPassed(AllActivityPlan.notID);
				// if (this.plannedActivityPassed)
					this.ViewList.push({ activity: AllActivityPlan.activity, am: AllActivityPlan.am, notID: AllActivityPlan.notID });
				}
			});
			
			ViewListContainer.classList.remove('item-hidden');
			segmentButtonContainer.classList.remove('item-disabled');
			loader.dismiss();
		}

	}

	plannedActivityHasPassed(notificationID) : any {
	// 	this.plannedActivityExists(notID, function(notification) {
	// 		if (notification){
	// 			console.log(">>>>>>>>>>>>>>>>>true")
	// 			return true;
	// 		} else {
	// 			console.log(">>>>>>>>>>>>>>>>>false")
	// 			return false;
	// 		}
	// 	});
	// }
	// plannedActivityExists(notificationID, fn) {
		this.plannedActivityPassed = false;
		cordova.plugins.notification.local.get(notificationID, function (notifications) {
		console.log("\n"+notifications+"\n");
		if (notifications == "OK"){
			this.plannedActivityPassed = false;
			console.log(">>>>>>>>>>>>>>>>>false");
			return false;
		} else {
			this.plannedActivityPassed = true;
			console.log(">>>>>>>>>>>>>>>>>true");
			return true;
		}
		});
		

		// cordova.plugins.notification.local.getAll(function (notifications) {
		// 	notifications.forEach((not) => {
		// 			if (not.id === notificationID ) { 
		// 				exists = true;
		// 				console.log(">>>>>>>>>>>>>>>>>true")
		// 				return true;
		// 						}
		// 		});
		// }, () => { // All done
		// 	console.log(">>>>>>>>>>>>>>>>>false")
		// 	return false;
		// });


		// if (exists) {
		// 	console.log(">>>>>>>>>>>>>>>>>true")
		// 	return true;
		// } else {
		// 	console.log(">>>>>>>>>>>>>>>>>false")
		// 	return false;
		// }
	}



	////////////////////////////////////////////////////////////////////////////
	// activity functions: plan, add, schedule, remove
	////////////////////////////////////////////////////////////////////////////

	planActivity(removeActivityID: number) {

		////////////////////////////////
		// set activity type
		let activityAlert = this.alertCtrl.create();
		activityAlert.setTitle('Welche Aktivität?');

		for (let entry of this.AvailableActivities) {
			activityAlert.addInput({
				type: 'radio',
				label: entry.activity,
				value: entry.activity.toString()
			});
		}

		activityAlert.addButton({
			text: 'Abbrechen',
			role: 'cancel'
		});
		activityAlert.addButton({
			text: 'Auswählen',
			handler: data => {
				if (data) {
					this.planerActivity = data;
					timeAlert.present();
				} else {
					noActivityAlert.present();
				}
			}
		});
		activityAlert.present();


		////////////////////////////////
		// no activity selected alert
		let noActivityAlert = this.alertCtrl.create();
		noActivityAlert.setTitle('Keine Aktivität ausgewählt!');
		noActivityAlert.setMessage('Bitte eine Aktivität aus der Liste auswählen.');
		noActivityAlert.addButton({
			text: 'Okay',
			handler: data => {
				this.planActivity(removeActivityID);
			}
		});


		////////////////////////////////
		// set activity time
		let timeAlert = this.alertCtrl.create();
		timeAlert.setTitle('Für wann soll die Aktivität geplant werden?');
		timeAlert.setMessage('Zeit und Datum einstellen');
		let minDate = new Date();
		minDate.setHours(minDate.getHours() + 1); 									  // correct timezone
		if (this.checkSommerzeit(minDate)) minDate.setHours(minDate.getHours() + 1 ); // Sommerzeit
		minDate.setMinutes(minDate.getMinutes() + 1);
		minDate.setSeconds(0);
		this.myISODate = minDate.toISOString();
		this.myDateTime = this.myISODate.substring(11, 19);
		this.myDateDate = this.myISODate.substring(0, 10);

		timeAlert.addInput({
			type: 'time',
			label: 'Zeit',
			value: this.myDateTime
		});
		timeAlert.addInput({
			type: 'date',
			label: 'Datum',
			value: this.myDateDate
		});

		timeAlert.addButton({
			text: 'Abbrechen',
			role: 'cancel'
		});
		timeAlert.addButton({
			text: 'Auswählen',
			handler: data => {
				this.planerISODate = data[1] + "T" + data[0] + ":00.000Z";
				// this.singleton.debugLog('>>>>>>>>>> timeAlert TIME:' +  data[0]);
				// this.singleton.debugLog('>>>>>>>>>> timeAlert DATE:' + data[1]);
				// this.singleton.debugLog('>>>>>>>>>> timeAlert planerISODate:' + this.planerISODate);
				// this.singleton.debugLog('>>>>>>>>>> timeAlert myISODate:' + this.myISODate);
				// this.singleton.debugLog('TIME:' + data[0] + '\n' + 'DATE:' + data[1] + '\n' + 'planerISODate:' + this.planerISODate);
				this.addActivity();
				if (removeActivityID > 0) {
						this.removeActivity(removeActivityID);
				}
				// this.singleton.debugLog("-----> removeActivityID:"+removeActivityID);
			}
		});

	}

	addActivity() {
		// let notID = 1000 + this.AllActivityPlan.length; // + Math.round(Math.random() * 1000);
		// let notID = 1000000 + this.parseISOString(this.planerISODate).getDay();

		// notification ID: second of creation - seconds of 47 years => this year's second of creation 
		// let notID = Math.round(new Date().getTime() / 1000) - 1482192000; 
		let notID = Math.round(new Date().getTime() / 1000); 

		this.AllActivityPlan.push({ activity: this.planerActivity, am: this.planerISODate, notID: notID });
		if ( this.segmentbutton === "Aktiv" ) {
			this.ViewList.push({ activity: this.planerActivity, am: this.planerISODate, notID: notID });
		}

		if (typeof cordova == "undefined") return;
		this.writeConfigFileOptions();
		this.scheduleActivity(notID);

	}

	scheduleActivity(notID: number) {

		let zeitpunkt = this.parseISOString(this.planerISODate);
		// zeitpunkt.setHours(zeitpunkt.getHours() - 1); 										// correct timezone
		if (this.checkSommerzeit(zeitpunkt)) zeitpunkt.setHours(zeitpunkt.getHours() - 1 );	// Sommerzeit
		zeitpunkt.setSeconds(0);                                  // sharp time
		zeitpunkt.setMilliseconds(0);                             // sharp time

		// // check DST (Daylight Saving Time) (Sommer-/Sommerzeit)
		// var jan = new Date(zeitpunkt.getFullYear(), 0, 1);
		// var jul = new Date(zeitpunkt.getFullYear(), 6, 1);
		// var stdTimezoneOffset = Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
		// var unterschied =  zeitpunkt.getTimezoneOffset() - stdTimezoneOffset;
		// if ( zeitpunkt.getTimezoneOffset() < stdTimezoneOffset ) {
		// 	alert("Sommerzeit?\nUnterschied:" + unterschied);
		// }
		
		this.singleton.debugLog("planerISODate:\n" + this.planerISODate + 
								"\nzeitpunkt:\n" + zeitpunkt);

		cordova.plugins.notification.local.schedule({
			id: notID,
			title: "Geplante Aktivität",
			text: this.planerActivity + 
					"\nam " + this.planerISODate.substr(8,2) + "." + this.planerISODate.substr(5,2) + "." + this.planerISODate.substr(0,4) + 
					"\num " + this.planerISODate.substr(11,5), 
			trigger: { at: zeitpunkt },
			// every: "0", // this.erinnerung_every.toString(), // "minute", "hour", "day", "week", "month", "year" // every: 30 // every 30 minutes
			// data: { headline: "Geplante Aktivität" },
			// sound: "file://assets/sounds/chimes_sc.mp3",
            icon: "res://icon",
            // smallIcon: "res://icon",
			// led: 00FF00,
			// badge: 1,
		});

	}
	parseISOString(s): Date {
		var b = s.split(/\D+/);
		this.singleton.debugLog("parseISOString:\n" + s + " -> " +
		"\n" + b[0] +','+ b[1] +','+ b[2] +','+ b[3] +','+ b[4] +','+ b[5] +','+ b[6]);
		
		// return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
		//						 2018	 10     11    13	  53		00		  00
		//                      (year, month, day?, hours, minutes, seconds, ms?)
		return new Date(Date.UTC(b[0], --b[1], b[2], --b[3], b[4], b[5]));
	}

	removeActivity(removeActivityID) {

		// this.singleton.debugLog("=====> removing activity:" + removeActivityID);

		let aPos = this.getIndexOfMultidimensionalArray(this.AllActivityPlan, removeActivityID);
		// this.singleton.debugLog("=====> aPos:" + aPos);
		if (aPos > -1) {
			this.AllActivityPlan.splice(aPos, 1);
		}
		let vPos = this.getIndexOfMultidimensionalArray(this.ViewList, removeActivityID);
		// this.singleton.debugLog("=====> vPos:" + vPos);
		if (vPos > -1) {
			this.ViewList.splice(vPos, 1);
		}

		if (typeof cordova == "undefined") return;

		cordova.plugins.notification.local.cancel(removeActivityID);
		// .then(
		// 	() => {
		// 		// this.singleton.debugLog("=====> activity removed:" + removeActivityID);
		// }).catch(
		// 	(err) => {
		// 		// this.singleton.debugLog("=====> activity " + removeActivityID + " remove error:" + err);
		// });
		
		this.writeConfigFileOptions();
	}
	getIndexOfMultidimensionalArray(a, v) {
		var l = a.length;
		for ( var k = 0; k < l; k++ ) {
			// dim.: notID
			if ( a[k].notID === v ){
				return k;
			}
		}
		return -1;
	}
	checkSommerzeit( checkDate: Date ) : boolean {
		// check DST (Daylight Saving Time) (Sommer-/Winterzeit)
		var jan = new Date(checkDate.getFullYear(), 0, 1);
		var jul = new Date(checkDate.getFullYear(), 6, 1);
		var stdTimezoneOffset = Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
		var unterschied =  checkDate.getTimezoneOffset() - stdTimezoneOffset;
		// this.singleton.debugLog("Datum: " + checkDate + " Unterschied:" + unterschied);
		if ( unterschied === 0 ) {
			return false;
		} else {
			return true;			
		}
	}

	clickOnPlannedActivity(item) {
		// try {
				let itemAlert = this.alertCtrl.create();
				itemAlert.setTitle(item.activity);
				let amString = "am " + item.am.substr(8,2) + "." + item.am.substr(5,2) + "." + item.am.substr(0,4) + " um " + item.am.substr(11,5);
				itemAlert.setMessage(amString);

				// itemAlert.addButton({
				// text: 'Bearbeiten',
				// handler: data => {
				// 	this.planActivity(item.notID);
				// }
				// });
				itemAlert.addButton({
					text: 'Entfernen',
					handler: data => {
						this.removeActivity(item.notID);
					}
				});
				itemAlert.addButton({
					text: 'Abbrechen',
					role: 'cancel'
				});

				itemAlert.present();

		// } catch(err) { JSON.stringify(err); }

	}



	////////////////////////////////////////////////////////////////////////////
	// config file functions
	////////////////////////////////////////////////////////////////////////////

	readConfigFileOptions(): Promise<any> {
		if (typeof cordova == "undefined") return

		this.File.readAsText(this.fileDir + "files/", this.fileName)
			.then(content => {
				this.configFileOptions = [];
				// let plainFileContent = atob(content.toString());
				let plainFileContent = content.toString();
				var options = plainFileContent.split("\n");
				for (var iO = 0; iO <= options.length; iO++) {
					let optionDelimiter = options[iO].indexOf("=");
					if (optionDelimiter > -1) {
						let currentOption = options[iO].substring(0, optionDelimiter);
						let currentValue = options[iO].substring(optionDelimiter + 1, options[iO].length);
						try {
							// this.configFileOptions[iO].option = currentOption;
							// this.configFileOptions[iO].value = currentValue;
							this.configFileOptions.push({
								option: currentOption,
								value: currentValue
							});
							if (currentOption === "batteryMessagePlaner") { // batteryMessagePlaner
								this.batteryMessage = false;
							}
							if (currentOption === "pa") { // Planer Aktivität Erinnerung
								var activityAndTime = currentValue.split("|");
								// if (parseInt(activityAndTime[2]) < new Date().getTime()){
								//   this.ActivityHistory.push({ activity: activityAndTime[0], am: activityAndTime[1], notID: parseInt(activityAndTime[2]) });
								// }else{
									this.AllActivityPlan.push({ activity: activityAndTime[0], am: activityAndTime[1], notID: parseInt(activityAndTime[2]) });
								// }
							}
						} catch (err) {
							// this.singleton.debugLog(err);
						}
					}
				}
			})
			.catch(err => {
				// this.singleton.debugLog(JSON.stringify(err));
			});
		return new Promise(function (resolve, reject) {
			return resolve();
		});
	}

	writeConfigFileOptions() {

		let fileContent = "";
		// all config file options but pas
		this.configFileOptions.forEach(element => {
			if (element.option.substr(0, 2) !== "pa") {
				fileContent = fileContent + element.option + '=' + element.value + '\n';
			}
		});

		// pas
		this.AllActivityPlan.forEach(element => {
			fileContent = fileContent + "pa" + '=' + element.activity + "|" + element.am + "|" + element.notID + '\n';
		});

		// this.writeFile(this.fileName, btoa(fileContent));
		this.writeFile(this.fileName, fileContent);

	}
	writeFile(filename, filecontent) {
		this.File.removeFile(this.fileDir + "files/", filename)
			.then(() => this.File.writeFile(this.fileDir + "files/", filename, filecontent).then(
				(response) => {
					// this.singleton.debugLog('config file updated: ' + JSON.stringify(response));
				}, (err) => {
					// this.singleton.debugLog('config file error: ' + JSON.stringify(err));
				}).catch( (err) => {
					// this.singleton.debugLog('config file error: ' + JSON.stringify(err));
				}
				)).catch( (err) => {
					// this.singleton.debugLog('config file error: ' + JSON.stringify(err));
				});
	}

	infoPage() {
		this.alertCtrl.create({
		  title: '<div style="width: 100% !important; zoom: 2.0 !important; margin-left: 24px !important;">ⓘ<div>',
		  subTitle: '\
					  Für manche Menschen ist es nützlich, sich feste Zeiten für ihre Gesundheitsaktivitäten einzuplanen - sonst ist alles andere wieder wichtiger. Hier können Sie Ihr persönliches Wohlfühltraining planen. \
				  	',
		  message: '',
		  buttons: [{ text: 'Okay', role: 'cancel' }]
		}).present();
	  }
	

}
