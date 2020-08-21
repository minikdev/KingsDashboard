import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'model-page',
  templateUrl: './model-page.component.html',
  styleUrls: ['./model-page.component.scss'],
})
export class ModelPageComponent implements OnInit {
  @Input() squad: any;
  @Input() allTypes: any;
  @Input() king: string;
  constructor(public modalCtrl: ModalController) {}

  ngOnInit() {}

  dismiss() {
    this.modalCtrl.dismiss({
      squad: this.squad,
      vampires: this.allTypes[0],
      wizards: this.allTypes[1],
      vigilantes: this.allTypes[2],
      draftsSquad: this.allTypes[3],
      king: this.king,
    });
  }

  remove(item: string) {
    this.squad = this.squad.filter((value) => value !== item);
    for (let i = 0; i < this.allTypes.length; i++) {
      this.allTypes[i] = this.allTypes[i].filter((value) => value !== item);
    }
    if (this.king === item) {
      this.king = undefined;
    }
  }
}
