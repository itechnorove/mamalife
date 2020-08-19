import { Component, ViewChild } from '@angular/core';

import { NavController, NavParams, MenuController, AlertController, LoadingController } from 'ionic-angular';
import { Slides } from 'ionic-angular';
import { PlanerPage } from '../planer/planer';

import { SingletonService } from "../../services/singleton/singleton";
import { AppModule } from "../../app/app.module";

// declare var cordova: any;

@Component({
  selector: 'page-yoga-play',
  templateUrl: 'yoga-play.html'
})
export class YogaPlayPage {

  @ViewChild(Slides) slides: Slides;

  public filesPath: any;
  public audioTitle: any;
  public audioFilename: any;

  public curTime: number;
  public maxTime: number;
  public intervallFunction: any;

  public video: any;
  public timeBar: any;
  public timeDrag: boolean = false;	/* check for drag event */

  public volumeDrag: boolean = false;

  private Block1: Array<{ timestamp: number, filename: String }> = [];
  private Block2: Array<{ timestamp: number, filename: String }> = [];
  private Block3: Array<{ timestamp: number, filename: String }> = [];
  private Block4: Array<{ timestamp: number, filename: String }> = [];
  private Block5: Array<{ timestamp: number, filename: String }> = [];

  private singleton: SingletonService;

  private planActivityDialog: boolean = true;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public menuCrtl: MenuController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController) {

      this.audioTitle = navParams.get("audioTitle");
      this.audioFilename = navParams.get("audioFilename");


    this.singleton = AppModule.injector.get(SingletonService);

    // if (typeof cordova == "undefined")
    //   this.filesPath = "http://localhost/files/";
    // else 
      this.filesPath = this.singleton.fileDir + "files";


  }

  ionViewDidLoad() {

    // this.intervallFunction = setInterval(function (slides) {

    //   // console.log(document.getElementById('tracktime').innerHTML);
    //   // if (document.getElementById('tracktime').innerHTML === null) {}
    //   // let nextSliderIndex = slides.getActiveIndex() + 1;

    //   // let time = document.getElementById('tracktime').innerHTML;
    //   // if (parseInt(time) >=   0 && parseInt(time) <  60) { slides.lockSwipes(false); slides.slideTo(0, 2000); slides.lockSwipes(true); }
    //   // if (parseInt(time) >=  60 && parseInt(time) < 120) { slides.lockSwipes(false); slides.slideTo(1, 2000); slides.lockSwipes(true); }
    //   // if (parseInt(time) >= 120 && parseInt(time) < 180) { slides.lockSwipes(false); slides.slideTo(2, 2000); slides.lockSwipes(true); }
    //   // if (parseInt(time) >= 180 && parseInt(time) < 240) { slides.lockSwipes(false); slides.slideTo(3, 2000); slides.lockSwipes(true); }
    //   // if (parseInt(time) >= 240 && parseInt(time) < 300) { slides.lockSwipes(false); slides.slideTo(4, 2000); slides.lockSwipes(true); }
    //   // if (parseInt(time) >= 300 && parseInt(time) < 360) { slides.lockSwipes(false); slides.slideTo(5, 2000); slides.lockSwipes(true); }

    // }, 100, this.slides);

    this.Block1 = [
      { timestamp: 20, filename: "Tranquility" },
      { timestamp: 33, filename: "Jnana Mudra in Tranquility & Tranquility" },
      { timestamp: 53, filename: "Partial Recline" },
      { timestamp: 59, filename: "Reclined Butterfly" },
      { timestamp: 71, filename: "Reclined Butterfly Blöcke unter Knie" },
      { timestamp: 76, filename: "Reclined Butterfly Kissen unter Füße" },
      { timestamp: 390, filename: "Partial Recline" },
      { timestamp: 394, filename: "Knees to Chest" },
      { timestamp: 427, filename: "Sampurna Mudra in Knees to Chest" },
      { timestamp: 442, filename: "Prana Mudra in Knees to Chest" },
      { timestamp: 463, filename: "Nahaufnahme Knees to Chest mit jeweils einer Hand am Knie" },
      { timestamp: 459, filename: "Knees to Chest zusammen mit Händen an Knien" },
      { timestamp: 470, filename: "Knees to Chest geöffnet in Armbeugen" },
      { timestamp: 496, filename: "Knees to Chest zusammen im Prana Mudra" },
      { timestamp: 500, filename: "Partial Recline" },
      { timestamp: 516, filename: "Extended Partial Recline re" },
      { timestamp: 527, filename: "Leg Lift auf Weg nach oben re" },
      { timestamp: 535, filename: "Leg Lift Fuß geflext re" },
      { timestamp: 539, filename: "Leg Lift auf Weg nach unten re" },
      { timestamp: 541, filename: "Leg Lift auf Weg nach unten kurz vor Boden re" },
      { timestamp: 544, filename: "Leg Lift auf Weg nach oben re" },
      { timestamp: 555, filename: "Extended Partial Recline re" },
      { timestamp: 566, filename: "Leg Lift Fuß gestreckt & Extended Partial Recline re" },
      { timestamp: 617, filename: "Ankle Rotations Oberschenkel gehalten re" },
      { timestamp: 659, filename: "Gurt einsteigen re" },
      { timestamp: 673, filename: "Leg Stretch mit Gurt gehalten re nah" },
      { timestamp: 684, filename: "Leg Stretch mit Gurt Brustkorb re" },
      { timestamp: 687, filename: "Leg Stretch mit Gurt Kopf re" },
      { timestamp: 692, filename: "Leg Stretch mit Gurt gehalten re" },
      { timestamp: 776, filename: "Leg Stretch re mit li Bein lang" },
      { timestamp: 787, filename: "Leg Stretch mit Gurt gehalten re" },
      { timestamp: 953, filename: "Leg Stretch re mit Armen am Boden" },
      { timestamp: 961, filename: "Extended Partial Recline re" },
      { timestamp: 972, filename: "Tranquility" },
      { timestamp: 977, filename: "Leg Stretch mit Gurt Brustkorb re" },
      { timestamp: 989, filename: "Leg Stretch mit Gurt Brustkorb und li Bein lang" },
      { timestamp: 993, filename: "Leg Stretch re mit Armen am Boden li Bein lang" },
      { timestamp: 997, filename: "Tranquility" },
      { timestamp: 1002, filename: "Leg Stretch mit Gurt Brustkorb und li Bein lang" },
      { timestamp: 1005, filename: "Leg Stretch re mit Armen am Boden li Bein lang" },
      { timestamp: 1010, filename: "Tranquility" },
      { timestamp: 1036, filename: "Partial Recline" },
      { timestamp: 1056, filename: "Knees to Chest" },
      { timestamp: 1093, filename: "Partial Recline" },
      { timestamp: 1109, filename: "Extended Partial Recline li" },
      { timestamp: 1115, filename: "Leg Lift auf Weg nach oben li" },
      { timestamp: 1130, filename: "Leg Lift auf Weg nach unten kurz vor Boden li" },
      { timestamp: 1140, filename: "Leg Lift Fuß gestreckt & Extended Partial Recline li" },
      { timestamp: 1175, filename: "Ankle Rotations Oberschenkel gehalten li" },
      { timestamp: 1185, filename: "Leg Stretch mit Gurt gehalten li" },
      { timestamp: 1488, filename: "Tranquility" },
      { timestamp: 1519, filename: "Partial Recline" },
      { timestamp: 1535, filename: "Knees to Chest" },
      { timestamp: 1502, filename: "Partial Recline" },
      { timestamp: 1579, filename: "Bridge Roll 1" },
      { timestamp: 1589, filename: "Partial Recline" },
      { timestamp: 1600, filename: "Bridge Roll 1 & Partial Recline" },
      { timestamp: 1658, filename: "Bridge Roll 2" },
      { timestamp: 1670, filename: "Partial Recline" },
      { timestamp: 1682, filename: "Bridge Roll 2 & Partial Recline" },
      { timestamp: 1700, filename: "Bridge Roll 2 mit Block Knie" },
      { timestamp: 1713, filename: "Bridge Roll 2 & Partial Recline" },
      { timestamp: 1742, filename: "Bridge Roll 3" },
      { timestamp: 1757, filename: "Partial Recline" },
      { timestamp: 1764, filename: "Bridge Roll 3 & Partial Recline" },
      { timestamp: 1822, filename: "Bridge mit Blöcken unter Becken" },
      { timestamp: 1883, filename: "Bridge mit Händen verschränkt" },
      { timestamp: 1960, filename: "Knees to Chest" },
      { timestamp: 1983, filename: "Prep Hip Side Stretch re" },
      { timestamp: 2003, filename: "Hüfte versetzen re" },
      { timestamp: 2013, filename: "Hip Side Stretch re Kopf mittig" },
      { timestamp: 2021, filename: "Hip Side Stretch re Kopf gedreht" },
      { timestamp: 2028, filename: "Hip Side Stretch Block unter Knie Nahaufnahme" },
      { timestamp: 2039, filename: "Hip Side Stretch nah Hand an Hüfte" },
      { timestamp: 2046, filename: "Hip Side Stretch nah Hand an Knie" },
      { timestamp: 2057, filename: "Hip Side Stretch nah Fuß auf Knie" },
      { timestamp: 2059, filename: "Hip Side Stretch nah Fuß vor Knie" },
      { timestamp: 2061, filename: "Hip Side Stretch nah Fuß hinter Knie" },
      { timestamp: 2068, filename: "Hip Side Stretch re Kopf gedreht" },
      { timestamp: 2092, filename: "Prep Hip Side Stretch re" },
      { timestamp: 2088, filename: "Partial Recline mit Armen Seite" },
      { timestamp: 2095, filename: "Knees to Chest" },
      { timestamp: 2183, filename: "Prep Hip Side Stretch li" },
      { timestamp: 2195, filename: "Hüfte versetzen li" },
      { timestamp: 2201, filename: "Hip Side Stretch li Kopf gedreht" },
      { timestamp: 2257, filename: "Prep Hip Side Stretch li" },
      { timestamp: 2277, filename: "Partial Recline mit Armen Seite" },
      { timestamp: 2281, filename: "Knees to Chest" },
      { timestamp: 2313, filename: "Reclined Butterfly & Tranquility" },
      { timestamp: 2382, filename: "Kissen unter Kopf" },
      { timestamp: 2385, filename: "Tranquility Bolster" },
      { timestamp: 2420, filename: "Arme entlang des Körpers" },
      { timestamp: 2426, filename: "Arme auf Oberkörper in Mudra" },
      { timestamp: 2436, filename: "Tranquility Decke" },
      { timestamp: 2473, filename: "OM" },
      { timestamp: 2944, filename: "Jaya Guru Devi" },
      { timestamp: 2950, filename: "Danksagung" },
      { timestamp: 2978, filename: "Danksagung" }, // = maxduration, needed for last video.poster
    ]
    this.Block2 = [
      { timestamp: 22, filename: "Natural Seat Hände auf Oberschenkel" },
      { timestamp: 76, filename: "Nahaufnahme Jnana Mudra in Natural Seat Handfläche oben & unten" },
      { timestamp: 90, filename: "Natural Seat Hände auf Oberschenkel" },
      { timestamp: 245, filename: "Flow in Cat" },
      { timestamp: 252, filename: "Cat" },
      { timestamp: 261, filename: "Cat Tuck" },
      { timestamp: 273, filename: "Cat" },
      { timestamp: 283, filename: "Cat Tuck" },
      { timestamp: 290, filename: "Cat & Cat Tuck" },
      { timestamp: 330, filename: "Nahaufnahme Bhu Mudra" },
      { timestamp: 334, filename: "Nahaufnahme Adi Mudra" },
      { timestamp: 343, filename: "Cat & Cat Tuck" },
      { timestamp: 413, filename: "Cat" },
      { timestamp: 416, filename: "Weg in Child" },
      { timestamp: 431, filename: "Child 2" },
      { timestamp: 486, filename: "Hochrollen in Natural Seat" },
      { timestamp: 498, filename: "Natural Seat Hände in Anjali Mudra" },
      { timestamp: 505, filename: "Prep Cat Bow 1" },
      { timestamp: 522, filename: "Cat Bow 1" },
      { timestamp: 530, filename: "Prep Cat Bow 1" },
      { timestamp: 535, filename: "Cat Bow 1 & Prep Cat Bow 1" },
      { timestamp: 560, filename: "Cat Bow 1" },
      { timestamp: 567, filename: "Nahaufnahme Hände Cat Bow 1" },
      { timestamp: 580, filename: "Cat" },
      { timestamp: 584, filename: "Weg in Child" },
      { timestamp: 593, filename: "Child 2" },
      { timestamp: 610, filename: "Natural Seat Hände in Anjali Mudra" },
      { timestamp: 620, filename: "Cat" },
      { timestamp: 627, filename: "Cat Bow 2" },
      { timestamp: 643, filename: "Cat" },
      { timestamp: 645, filename: "Cat & Cat Bow 2" },
      { timestamp: 707, filename: "Cat" },
      { timestamp: 712, filename: "Child 2" },
      { timestamp: 725, filename: "Natural Seat Hände in Anjali Mudra" },
      { timestamp: 733, filename: "Auf eine Seite setzen neben Füße" },
      { timestamp: 738, filename: "Weg in L-Seat" },
      { timestamp: 740, filename: "L-Seat" },
      { timestamp: 747, filename: "Prep to Lower" },
      { timestamp: 768, filename: "Abrollen in Knees to Chest" },
      { timestamp: 784, filename: "Knees to Chest" },
      { timestamp: 796, filename: "Partial Recline" },
      { timestamp: 811, filename: "Reclined Butterfly" },
      { timestamp: 816, filename: "Reclined Butterfly & Tranquility" },
      { timestamp: 913, filename: "OM" },
      { timestamp: 1385, filename: "Jaya Guru Devi" },
      { timestamp: 1388, filename: "Danksagung" },
      { timestamp: 1391, filename: "Danksagung" }, // = maxduration, needed for last video.poster
    ]
    this.Block3 = [
      { timestamp: 22, filename: "Tranquility" },
      { timestamp: 37, filename: "Knees to Chest" },
      { timestamp: 184, filename: "Partial Recline" },
      { timestamp: 198, filename: "Reclined Tree re" },
      { timestamp: 216, filename: "Jnana Mudra in Tranquility" },
      { timestamp: 230, filename: "Reclined Tree Block re" },
      { timestamp: 235, filename: "Reclined Tree Kissen unter Hüfte re" },
      { timestamp: 245, filename: "Reclined Tree re" },
      { timestamp: 294, filename: "Sampurna Mudra vor Becken" },
      { timestamp: 304, filename: "Prana Mudra über Kopf" },
      { timestamp: 330, filename: "Kissen unter Hände" },
      { timestamp: 334, filename: "Kissen unter Ellenbogen" },
      { timestamp: 337, filename: "Reclined Extended Tree re" },
      { timestamp: 412, filename: "Partial Recline mit Händen über Kopf" },
      { timestamp: 431, filename: "Flow in Knees to Chest mit Armen nach vorne" },
      { timestamp: 439, filename: "Knees to Chest" },
      { timestamp: 447, filename: "Knees to Chest geöffnet in Armbeugen" },
      { timestamp: 481, filename: "Partial Recline" },
      { timestamp: 488, filename: "Reclined Tree li" },
      { timestamp: 553, filename: "Reclined Extended Tree li" },
      { timestamp: 611, filename: "Partial Recline mit Händen über Kopf" },
      { timestamp: 622, filename: "Flow in Knees to Chest mit Armen nach vorne" },
      { timestamp: 626, filename: "Knees to Chest" },
      { timestamp: 660, filename: "Spider Hände an Füßen" },
      { timestamp: 678, filename: "Spider Gurt" },
      { timestamp: 680, filename: "Gurt in Spider" },
      { timestamp: 699, filename: "Spider Rocks li & Spider Rocks re" },
      { timestamp: 735, filename: "Spider Hände an Füßen" },
      { timestamp: 746, filename: "Partial Recline" },
      { timestamp: 760, filename: "Half Spider re" },
      { timestamp: 832, filename: "Partial Recline" },
      { timestamp: 841, filename: "Knees to Chest" },
      { timestamp: 868, filename: "Partial Recline" },
      { timestamp: 877, filename: "Half Spider li" },
      { timestamp: 916, filename: "Partial Recline" },
      { timestamp: 925, filename: "Knees to Chest" },
      { timestamp: 961, filename: "Spider Hände an Füßen" },
      { timestamp: 1025, filename: "Knees to Chest" },
      { timestamp: 1051, filename: "Prep Hip Side Stretch re" },
      { timestamp: 1071, filename: "Hüfte versetzen re" },
      { timestamp: 1082, filename: "Hip Side Stretch re Kopf mittig" },
      { timestamp: 1090, filename: "Hip Side Stretch re Kopf gedreht" },
      { timestamp: 1096, filename: "Hip Side Stretch Block unter Knie Nahaufnahme" },
      { timestamp: 1108, filename: "Hip Side Stretch nah Hand an Hüfte" },
      { timestamp: 1114, filename: "Hip Side Stretch nah Hand an Knie" },
      { timestamp: 1125, filename: "Hip Side Stretch nah Fuß auf Knie" },
      { timestamp: 1128, filename: "Hip Side Stretch nah Fuß vor Knie" },
      { timestamp: 1131, filename: "Hip Side Stretch nah Fuß hinter Knie" },
      { timestamp: 1138, filename: "Hip Side Stretch re Kopf gedreht" },
      { timestamp: 1206, filename: "Prep Hip Side Stretch re" },
      { timestamp: 1222, filename: "Partial Recline mit Armen Seite" },
      { timestamp: 1229, filename: "Knees to Chest" },
      { timestamp: 1256, filename: "Prep Hip Side Stretch li" },
      { timestamp: 1269, filename: "Hüfte versetzen li" },
      { timestamp: 1277, filename: "Hip Side Stretch li Kopf gedreht" },
      { timestamp: 1337, filename: "Prep Hip Side Stretch li" },
      { timestamp: 1345, filename: "Partial Recline mit Armen Seite" },
      { timestamp: 1350, filename: "Knees to Chest" },
      { timestamp: 1384, filename: "Reclined Butterfly & Tranquility" },
      { timestamp: 1450, filename: "Kissen unter Kopf" },
      { timestamp: 1455, filename: "Tranquility Bolster" },
      { timestamp: 1489, filename: "Arme entlang des Körpers" },
      { timestamp: 1494, filename: "Arme auf Oberkörper in Mudra" },
      { timestamp: 1504, filename: "Tranquility Decke" },
      { timestamp: 1541, filename: "OM" },
      { timestamp: 2004, filename: "Jaya Guru Devi" },
      { timestamp: 2008, filename: "Danksagung" },
      { timestamp: 2010, filename: "Danksagung" }, // maxduration, needed for last video.poster
    ]
    this.Block4 = [
      { timestamp: 25, filename: "Natural Seat Hände auf Oberschenkel" },
      { timestamp: 79, filename: "Nahaufnahme Jnana Mudra in Natural Seat Handfläche oben & unten" },
      { timestamp: 100, filename: "Natural Seat Hände auf Oberschenkel" },
      { timestamp: 251, filename: "Flow in Cat" },
      { timestamp: 258, filename: "Cat" },
      { timestamp: 265, filename: "Cat Tuck" },
      { timestamp: 278, filename: "Cat" },
      { timestamp: 287, filename: "Cat Tuck" },
      { timestamp: 293, filename: "Cat & Cat Tuck" },
      { timestamp: 332, filename: "Nahaufnahme Bhu Mudra" },
      { timestamp: 337, filename: "Nahaufnahme Adi Mudra" },
      { timestamp: 348, filename: "Cat & Cat Tuck" },
      { timestamp: 416, filename: "Cat" },
      { timestamp: 422, filename: "Weg in Child" },
      { timestamp: 433, filename: "Child 2" },
      { timestamp: 464, filename: "Hochrollen in Natural Seat" },
      { timestamp: 470, filename: "Natural Seat Hände in Anjali Mudra" },
      { timestamp: 476, filename: "Cat" },
      { timestamp: 482, filename: "Cat Bow 2" },
      { timestamp: 495, filename: "Cat" },
      { timestamp: 500, filename: "Cat Bow 2" },
      { timestamp: 507, filename: "Cat" },
      { timestamp: 511, filename: "Cat & Cat Bow 2" },
      { timestamp: 560, filename: "Cat" },
      { timestamp: 564, filename: "Child 2" },
      { timestamp: 594, filename: "Natural Seat Hände in Anjali Mudra" },
      { timestamp: 602, filename: "Cat" },
      { timestamp: 607, filename: "Cat mit Kissen unter Becken" },
      { timestamp: 616, filename: "Basic Slant" },
      { timestamp: 626, filename: "Weg Face Down Oberschenkel" },
      { timestamp: 627, filename: "Weg Face Down Becken" },
      { timestamp: 628, filename: "Weg Face Down Bauch" },
      { timestamp: 630, filename: "Face Down" },
      { timestamp: 638, filename: "Cobra 1" },
      { timestamp: 650, filename: "Face Down" },
      { timestamp: 659, filename: "Cobra 1" },
      { timestamp: 664, filename: "Face Down & Cobra 1" },
      { timestamp: 722, filename: "Cobra 1" },
      { timestamp: 743, filename: "Face Down 2" },
      { timestamp: 754, filename: "Face Down Rest re" },
      { timestamp: 786, filename: "Face Down" },
      { timestamp: 799, filename: "Cobra Boat" },
      { timestamp: 815, filename: "Cobra Boat & Face Down" },
      { timestamp: 882, filename: "Cobra Boat" },
      { timestamp: 895, filename: "Face Down 2" },
      { timestamp: 904, filename: "Face Down Rest li" },
      { timestamp: 930, filename: "Face Down" },
      { timestamp: 935, filename: "Cobra 1" },
      { timestamp: 940, filename: "Cobra 2 Lift" },
      { timestamp: 948, filename: "Face Down" },
      { timestamp: 956, filename: "Cobra 1" },
      { timestamp: 964, filename: "Cobra 2 Lift" },
      { timestamp: 969, filename: "Face Down" },
      { timestamp: 978, filename: "Cobra 1 & Cobra 2 Lift & Face Down" },
      { timestamp: 1008, filename: "Cobra 2 Lift" },
      { timestamp: 1013, filename: "Weg in Child" },
      { timestamp: 1021, filename: "Child 2" },
      { timestamp: 1049, filename: "Natural Seat Hände in Anjali Mudra" },
      { timestamp: 1057, filename: "Auf eine Seite setzen neben Füße" },
      { timestamp: 1061, filename: "Weg in L-Seat" },
      { timestamp: 1063, filename: "L-Seat" },
      { timestamp: 1066, filename: "Prep to Lower" },
      { timestamp: 1091, filename: "Abrollen in Knees to Chest" },
      { timestamp: 1107, filename: "Knees to Chest" },
      { timestamp: 1123, filename: "Spider Hände an Füßen" },
      { timestamp: 1142, filename: "Spider Gurt" },
      { timestamp: 1148, filename: "Gurt in Spider" },
      { timestamp: 1160, filename: "Spider Rocks li & Spider Rocks re" },
      { timestamp: 1195, filename: "Spider Hände an Füßen" },
      { timestamp: 1206, filename: "Partial Recline" },
      { timestamp: 1221, filename: "Half Spider re" },
      { timestamp: 1289, filename: "Partial Recline" },
      { timestamp: 1298, filename: "Knees to Chest" },
      { timestamp: 1325, filename: "Partial Recline" },
      { timestamp: 1332, filename: "Half Spider li" },
      { timestamp: 1372, filename: "Partial Recline" },
      { timestamp: 1382, filename: "Knees to Chest" },
      { timestamp: 1419, filename: "Spider Hände an Füßen" },
      { timestamp: 1473, filename: "Knees to Chest" },
      { timestamp: 1493, filename: "Prep Hip Side Stretch re" },
      { timestamp: 1514, filename: "Hüfte versetzen re" },
      { timestamp: 1524, filename: "Hip Side Stretch re Kopf mittig" },
      { timestamp: 1532, filename: "Hip Side Stretch re Kopf gedreht" },
      { timestamp: 1539, filename: "Hip Side Stretch Block unter Knie Nahaufnahme" },
      { timestamp: 1551, filename: "Hip Side Stretch nah Hand an Hüfte" },
      { timestamp: 1557, filename: "Hip Side Stretch nah Hand an Knie" },
      { timestamp: 1568, filename: "Hip Side Stretch nah Fuß auf Knie" },
      { timestamp: 1570, filename: "Hip Side Stretch nah Fuß vor Knie" },
      { timestamp: 1573, filename: "Hip Side Stretch nah Fuß hinter Knie" },
      { timestamp: 1580, filename: "Hip Side Stretch re Kopf gedreht" },
      { timestamp: 1650, filename: "Prep Hip Side Stretch re" },
      { timestamp: 1664, filename: "Partial Recline mit Armen Seite" },
      { timestamp: 1671, filename: "Knees to Chest" },
      { timestamp: 1699, filename: "Prep Hip Side Stretch li" },
      { timestamp: 1709, filename: "Hüfte versetzen li" },
      { timestamp: 1718, filename: "Hip Side Stretch li Kopf gedreht" },
      { timestamp: 1779, filename: "Prep Hip Side Stretch li" },
      { timestamp: 1788, filename: "Partial Recline mit Armen Seite" },
      { timestamp: 1792, filename: "Knees to Chest" },
      { timestamp: 1824, filename: "Partial Recline" },
      { timestamp: 1832, filename: "Reclined Butterfly" },
      { timestamp: 1902, filename: "Reclined Butterfly & Tranquility" },
      { timestamp: 1925, filename: "Kissen unter Kopf" },
      { timestamp: 1930, filename: "Tranquility Bolster" },
      { timestamp: 1964, filename: "Arme entlang des Körpers" },
      { timestamp: 1970, filename: "Arme auf Oberkörper in Mudra" },
      { timestamp: 1984, filename: "Tranquility Decke" },
      { timestamp: 2025, filename: "OM" },
      { timestamp: 2484, filename: "Jaya Guru Devi" },
      { timestamp: 2495, filename: "Danksagung" },
      { timestamp: 2520, filename: "Danksagung" }, // = maxduration, needed for last video.poster
    ]
    this.Block5 = [
      { timestamp: 20, filename: "Tranquility" },
      { timestamp: 32, filename: "Knees to Chest" },
      { timestamp: 185, filename: "Partial Recline" },
      { timestamp: 203, filename: "Bridge Roll 1" },
      { timestamp: 212, filename: "Partial Recline" },
      { timestamp: 223, filename: "Bridge Roll 1 & Partial Recline" },
      { timestamp: 282, filename: "Bridge Roll 2" },
      { timestamp: 292, filename: "Partial Recline" },
      { timestamp: 306, filename: "Bridge Roll 2 & Partial Recline" },
      { timestamp: 323, filename: "Bridge Roll 2" },
      { timestamp: 337, filename: "Bridge Roll 2 & Partial Recline" },
      { timestamp: 365, filename: "Bridge Roll 3" },
      { timestamp: 378, filename: "Partial Recline" },
      { timestamp: 387, filename: "Bridge Roll 3 & Partial Recline" },
      { timestamp: 453, filename: "Bridge mit Blöcken unter Becken" },
      { timestamp: 510, filename: "Bridge mit Händen verschränkt" },
      { timestamp: 584, filename: "Knees to Chest" },
      { timestamp: 605, filename: "Prep Hip Side Stretch re" },
      { timestamp: 626, filename: "Hüfte versetzen re" },
      { timestamp: 636, filename: "Hip Side Stretch re Kopf mittig" },
      { timestamp: 644, filename: "Hip Side Stretch re Kopf gedreht" },
      { timestamp: 650, filename: "Hip Side Stretch Block unter Knie Nahaufnahme" },
      { timestamp: 663, filename: "Hip Side Stretch nah Hand an Hüfte" },
      { timestamp: 669, filename: "Hip Side Stretch nah Hand an Knie" },
      { timestamp: 680, filename: "Hip Side Stretch nah Fuß auf Knie" },
      { timestamp: 682, filename: "Hip Side Stretch nah Fuß vor Knie" },
      { timestamp: 685, filename: "Hip Side Stretch nah Fuß hinter Knie" },
      { timestamp: 690, filename: "Hip Side Stretch re Kopf gedreht" },
      { timestamp: 755, filename: "Prep Hip Side Stretch re" },
      { timestamp: 772, filename: "Partial Recline mit Armen Seite" },
      { timestamp: 778, filename: "Knees to Chest" },
      { timestamp: 806, filename: "Prep Hip Side Stretch li" },
      { timestamp: 816, filename: "Hüfte versetzen li" },
      { timestamp: 825, filename: "Hip Side Stretch li Kopf gedreht" },
      { timestamp: 891, filename: "Prep Hip Side Stretch li" },
      { timestamp: 900, filename: "Partial Recline mit Armen Seite" },
      { timestamp: 905, filename: "Knees to Chest" },
      { timestamp: 935, filename: "Partial Recline" },
      { timestamp: 943, filename: "Reclined Butterfly" },
      { timestamp: 957, filename: "Reclined Butterfly Kissen unter Füße" },
      { timestamp: 1011, filename: "Reclined Butterfly & Tranquility" },
      { timestamp: 1041, filename: "Kissen unter Kopf" },
      { timestamp: 1047, filename: "Tranquility Bolster" },
      { timestamp: 1077, filename: "Arme entlang des Körpers" },
      { timestamp: 1087, filename: "Arme auf Oberkörper in Mudra" },
      { timestamp: 1097, filename: "Tranquility Decke" },
      { timestamp: 1142, filename: "OM" },
      { timestamp: 1606, filename: "Jaya Guru Devi" },
      { timestamp: 1620, filename: "Danksagung" },
      { timestamp: 1656, filename: "Danksagung" }, // = maxduration, needed for last video.poster
    ]

  }

  ionViewDidEnter() {
    // this.slides.lockSwipes(true);
    // this.videoInitialize();

    // im iOS Home Menu kann man ca. 2 Sekunden nachdem man zurück auf die Seite ist nicht auswählen
    if (this.singleton.OS === "ios") {
      let loader = this.loadingCtrl.create({
        duration: this.singleton.iOS_page_change_delay,
        // dismissOnPageChange: true
      });
      loader.present();
    }
  }

  ionViewWillLeave() {
    clearInterval(this.intervallFunction);
    // let loader = this.loadingCtrl.create({
    //   duration: 1000,
    //   // dismissOnPageChange: true
    // });
    // loader.present();
  }

  // timeUpdate() {
  //   console.log(document.getElementById('tracktime').innerHTML);
  //   let time = document.getElementById('tracktime').innerHTML;
  //   // let nextSliderIndex;// = slides.getActiveIndex() + 1;
  //   if (parseInt(time) >= 5) this.slides.slideTo(2, 500);
  //   if (parseInt(time) >= 10) this.slides.slideTo(3, 500);
  // }







  videoInitialize() {
    //INITIALIZE not working :(
    this.video = <HTMLVideoElement>document.getElementById("myVideo");
    this.timeBar = <HTMLDivElement>document.getElementsByClassName('timeBar')[0];


    // //before everything get started
    // video.on('loadedmetadata', function () {

    //   //set video properties
    //   $('.current').text(timeFormat(0));
    //   $('.duration').text(timeFormat(video.duration));
    //   updateVolume(0, 0.7);

    //   //start to get video buffering data
    //   setTimeout(startBuffer, 150);    var timeBar = <HTMLDivElement>document.getElementsByClassName('timeBar')[0];


    // //display video buffering bar
    // var startBuffer = function () {
    //   var currentBuffer = video.buffered.end(0);
    //   var maxduration = video.duration;
    //   var perc = 100 * currentBuffer / maxduration;
    //   var bufferBar = <HTMLDivElement>document.getElementsByClassName("bufferBar")[0]; bufferBar.style.width = perc + '%';

    //   if (currentBuffer < maxduration) {
    //     setTimeout(startBuffer, 500);
    //   }
    // };

  }

  updateTime() {
    var video = <HTMLVideoElement>document.getElementById("myVideo");
    var timeBar = <HTMLDivElement>document.getElementsByClassName('timeBar')[0];
    var maxduration = video.duration;
    var currentPos = video.currentTime; // * 0.99; // max duration fix;
    //wrong mp3 max duration fix:
    // if (currentPos>maxduration) currentPos=maxduration;

    var perc = 100 * currentPos / maxduration;
    // console.log(">>>>>>>>>> " + currentPos + " - " + video.duration + " : " + perc);
    timeBar.style.width = perc + '%';

    var tracktime = <HTMLDivElement>document.getElementsByClassName('tracktime')[0];
    tracktime.style.display = "block";
    tracktime.innerHTML = this.timeFormat(currentPos); // + " / " + this.timeFormat(maxduration);

    // var trackduration = <HTMLDivElement>document.getElementsByClassName('trackduration')[0];
    // trackduration.style.display = "block";
    // trackduration.innerHTML = "&nbsp;/&nbsp;" + this.timeFormat(maxduration);



    if (this.audioTitle === "Yoga 1") {
      let sw = "before";
      for (let iB = 1; iB < this.Block1.length; iB++) {
        if (currentPos >= this.Block1[iB - 1].timestamp)
          if (currentPos < this.Block1[iB].timestamp && sw === "before") {
            sw = "after";
            video.poster = this.filesPath + "/yoga/images/" + this.Block1[iB - 1].filename + ".jpg"; // .split("&")[0].trim()
            this.singleton.debugLog("currentPos:" + currentPos + ", maxduration:" + maxduration + ", video.poster:" +  video.poster);
            break;
          }
      }
    }

    if (this.audioTitle === "Yoga 2") {
      let sw = "before";
      for (let iB = 1; iB < this.Block2.length; iB++) {
        if (currentPos >= this.Block2[iB - 1].timestamp)
          if (currentPos < this.Block2[iB].timestamp && sw === "before") {
            sw = "after";
            video.poster = this.filesPath + "/yoga/images/" + this.Block2[iB - 1].filename + ".jpg";
            break;
          }
      }
    }

    if (this.audioTitle === "Yoga 3") {
      let sw = "before";
      for (let iB = 1; iB < this.Block3.length; iB++) {
        if (currentPos >= this.Block3[iB - 1].timestamp)
          if (currentPos < this.Block3[iB].timestamp && sw === "before") {
            sw = "after";
            video.poster = this.filesPath + "/yoga/images/" + this.Block3[iB - 1].filename + ".jpg";
            break;
          }
      }
    }

    if (this.audioTitle === "Yoga 4") {
      let sw = "before";
      for (let iB = 1; iB < this.Block4.length; iB++) {
        if (currentPos >= this.Block4[iB - 1].timestamp)
          if (currentPos < this.Block4[iB].timestamp && sw === "before") {
            sw = "after";
            video.poster = this.filesPath + "/yoga/images/" + this.Block4[iB - 1].filename + ".jpg";
            break;
          }
      }
    }

    if (this.audioTitle === "Yoga 5") {
      let sw = "before";
      for (let iB = 1; iB < this.Block5.length; iB++) {
        if (currentPos >= this.Block5[iB - 1].timestamp)
          if (currentPos < this.Block5[iB].timestamp && sw === "before") {
            sw = "after";
            video.poster = this.filesPath + "/yoga/images/" + this.Block5[iB - 1].filename + ".jpg";
            break;
          }
      }
    }


  }
  timeFormat(seconds) {
    var m = Math.floor(seconds / 60) < 10 ? "0" + Math.floor(seconds / 60) : Math.floor(seconds / 60);
    var s = Math.floor(seconds - (parseInt(m.toString()) * 60)) < 10 ? "0" + Math.floor(seconds - (parseInt(m.toString()) * 60)) : Math.floor(seconds - (parseInt(m.toString()) * 60));
    return m + ":" + s;
  };

  videoPlayPause() {
    var video = <HTMLVideoElement>document.getElementById("myVideo");
    var playButton = <HTMLDivElement>document.getElementsByClassName("btnPlay")[0];
    var iconplay = <HTMLDivElement>document.getElementById("playicon");

    if (video.paused || video.ended) {
      playButton.classList.add('paused');
      if (iconplay.classList.contains('icon-play')) {
        iconplay.classList.add('icon-pause');
        iconplay.classList.remove('icon-play');
      }
      video.play();
    }
    else {
      playButton.classList.remove('paused');
      if (iconplay.classList.contains('icon-pause')) {
        iconplay.classList.remove('icon-pause');
        iconplay.classList.add('icon-play');
      }
      video.pause();
    }
  }

  videoRewind() {
    var video = <HTMLVideoElement>document.getElementById("myVideo");
    video.currentTime -= 10;
  }

  videoFastForward() {
    var video = <HTMLVideoElement>document.getElementById("myVideo");
    video.currentTime += 10;
  }

  videoFullscreen() {
    var video = <HTMLVideoElement>document.getElementById("myVideo");
    // if (video.webkitEnterFullscreen != null) {
    //   video.webkitEnterFullscreen();
    // }
    // else 
    if (video.webkitRequestFullScreen != null) {
      video.webkitRequestFullScreen();
    }
    else {
      this.singleton.debugLog('Your browsers doesn\'t support fullscreen');
    }
  }

  videoEnd() {
    var video = <HTMLVideoElement>document.getElementById("myVideo");
    var playButton = <HTMLDivElement>document.getElementsByClassName("btnPlay")[0];
    var iconplay = <HTMLDivElement>document.getElementById("playicon");
    playButton.classList.remove('paused');
    if (iconplay.classList.contains('icon-pause')) {
      iconplay.classList.remove('icon-pause');
      iconplay.classList.add('icon-play');
    }
    video.pause();
    this.planActivity();
  }

  videoEnded() {
    var video = <HTMLVideoElement>document.getElementById("myVideo");
    // go to Planer on end of video
    if (video.ended) {
      var iconplay = <HTMLDivElement>document.getElementById("playicon");
      if (iconplay.classList.contains('icon-pause')) {
        iconplay.classList.remove('icon-pause');
        iconplay.classList.add('icon-play');
      }
      this.planActivity();
    }
  }

  planActivity(){
    if (this.planActivityDialog)  {
      this.planActivityDialog = false;
      let alert = this.alertCtrl.create({
        title: 'Neue Aktivität planen?',
        message: 'Wollen Sie gleich eine neue Aktivität planen?',
        buttons: [{
          text: "Ja",
          handler: () => { this.navCtrl.push(PlanerPage); }
        }, {
          text: "Nein",
          role: 'cancel'
        }]
      })
      alert.present();
      }
  }

  //VIDEO PROGRESS BAR
  //when video timebar clicked
  // var timeDrag = false;	/* check for drag event */

  progressbarMousedown(e) {
    this.timeDrag = true;
    this.updatebar(e.pageX);
  }
  // $(document).on('mouseup', function(e) {
  //   if (this.timeDrag) {
  //     this.timeDrag = false;
  //     this.updatebar(e.pageX);
  // 	}
  // }
  // $(document).on('mousemove', function(e) {
  //   if (this.timeDrag) {
  //     this.updatebar(e.pageX);
  // 	}
  // }

  updatebar(x) {
    var video = <HTMLVideoElement>document.getElementById("myVideo");
    var progress = <HTMLDivElement>document.getElementsByClassName('progress')[0];

    //calculate drag position
    //and update video currenttime
    //as well as progress bar
    var maxduration = video.duration;
    var position = x - progress.offsetLeft;
    var percentage = 100 * position / progress.clientWidth;
    if (percentage > 100) {
      percentage = 100;
    }
    if (percentage < 0) {
      percentage = 0;
    }
    // $('.timeBar').css('width',percentage+'%');
    // video.currentTime = maxduration * percentage / 100;
    // video.currentTime = parseInt(maxduration * percentage / 100);
    video.currentTime = Math.floor(maxduration * percentage / 100);
  };


  // }



  deleteItem() {
    this.alertCtrl.create({
      title: 'Audio Datei löschen',
      message: '"' + this.audioTitle + '"',
      buttons: [{
        text: "Löschen", handler: () => {
          this.singleton.deleteAudioFile("files/yoga",this.audioFilename+".mp3").then(
            (ans) => {
              this.singleton.debugLog('File removed:' + this.audioFilename + '.mp3\n' + JSON.stringify(ans))
              this.singleton.deleteAudioFile("files/yoga",this.audioFilename+".zip.complete")
              .then( () => {this.singleton.checkAudioFiles();});
              this.navCtrl.pop();
            }
          ).catch(
            (err) => {
              this.singleton.debugLog('File remove error:' + this.audioFilename + '.mp3\n' + JSON.stringify(err))
              // falls keine mp3 Datei vorhanden, trotzdem weiter machen:
              this.singleton.deleteAudioFile("files/yoga",this.audioFilename+".zip.complete")
              .then( () => {this.singleton.checkAudioFiles();});
              this.navCtrl.pop();
            }
          );
        }
      }, { text: "Abbrechen", role: 'cancel' }]
    }).present();
  }




}
