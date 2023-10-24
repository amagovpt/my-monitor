import { ChangeDetectorRef, Component, ElementRef, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JsonDataService } from './services/json-data.service';
import { take } from 'rxjs/operators';
import { WebsiteDTO } from 'src/app/pages/accessibility-declaration/dto/website.dto';
import { ChecklistService } from './services/checklist.service';
import { WebsiteService } from 'src/app/services/website/website.service';

import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
registerLocaleData(localePt);

export interface conformity {
  id: number,
  subCriteriaId: number,
  websiteId: number,
  checklistId: number,
  conformity: number,
  note: string
}

const round = (value: number): number => {
  return Math.round(100 * value) / 100;
};

let checklists = new Map<string, {id:number,name:string}>([
  ["Aspeto Crítico", {id:1, name:"CHECKLIST_CRITICAL_ASPECTS"}],
  ["Conteúdo", {id:2, name:"CHECKLIST_CONTENT"}],
  ["Transação", {id:3, name:"CHECKLIST_TRANSACTION"}]
]);

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss']
})
export class ChecklistComponent implements OnInit {
  checklistName!: string;
  websiteName!: string;
  jsonData: any = {};
  jsonLoaded: boolean = false;
  hashMapLoaded: boolean = false;

  criterias: any[] = [];
  conformCriteria: number = 0;
  criteriaSize: number = 0;
  hashMap = new Map<number, conformity>();
  progressCriteria: number = 0;
  conformityPercentage: number = 0;

  isPreview: boolean = false;

  currentIndexItem: number = 0;

  wsDto: WebsiteDTO = new WebsiteDTO();
  percentageConfig = {
    '70': { color: 'green' },
    '40': { color: 'orange' },
    '0': { color: 'red' }
  };

  constructor(private activatedRoute: ActivatedRoute,
    private jsonDataService: JsonDataService,
    private cdr: ChangeDetectorRef,
    public element: ElementRef,
    private checklistService: ChecklistService,
    private websiteService: WebsiteService) { }

  ngOnInit(): void {
    this.checklistName = this.activatedRoute.snapshot.paramMap.get('checklistName');
    this.websiteName = this.activatedRoute.snapshot.paramMap.get('websiteName');
    this.getJsonData();
    this.getWebsiteInfoByName();
  }
  getJsonData() {
    this.jsonDataService.getJsonData('../../../assets/i18n/Portuguese.json').pipe(take(1)).subscribe((data) => {
      this.jsonData = data[checklists.get(this.checklistName).name];
      this.criterias = this.jsonData.main.content;
      this.criteriaSize = this.jsonData.top.total;
      this.jsonLoaded = true;
      this.cdr.detectChanges();
    });
  }

  getBdData(websiteId: number) {
    this.checklistService.getAllNotes(checklists.get(this.checklistName).id, websiteId)
      .pipe(take(1))
      .subscribe(data => {
        this.fillHashMap(data.body.result);
        this.fillConformity();
        this.cdr.detectChanges();
      });
  }

  getWebsiteInfoByName() {
    this.websiteService.getInfoByWebsiteName(this.websiteName)
      .pipe(take(1))
      .subscribe(data => {
        this.wsDto = data.body.result;
        this.getBdData(data.body.result.WebsiteId)
      });
  }

  fillHashMap(conformity: conformity[]) {
    for (let index = 0; index < conformity.length; index++) {
      this.hashMap.set(conformity[index].subCriteriaId, conformity[index]);
    }
    this.hashMapLoaded = true;
    this.cdr.detectChanges();
  }

  getSelectedValue(subId: number) {
    return this.hashMap.get(subId) != null ? this.hashMap.get(subId).conformity.toString() : null;
  }

  getNote(subId: number) {
    return this.hashMap.get(subId) != null ? this.hashMap.get(subId).note : "";
  }

  saveDataInBd() {
    const data = JSON.stringify(Object.fromEntries(this.hashMap));
    this.checklistService.saveNotes(data)
      .pipe(take(1))
      .subscribe(data => {
        alert("data saved")
      });
  }

  scrollToSection(id: string) {
    const element = this.element.nativeElement.querySelector(`#${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  fillConformity() {
    this.conformCriteria = 0;
    this.hashMap.forEach(i => {
      if (i.conformity === 1 || i.conformity === 2) {
        this.conformCriteria = this.conformCriteria + 1;
      }
    });
    this.progressCriteria = this.hashMap.size;
    if (this.criteriaSize >= 0) {
      this.conformityPercentage = round(round(this.conformCriteria / this.criteriaSize) * 100);
    }
    this.cdr.detectChanges();
  }

  changeConformity(item: conformity) {
    item.checklistId = checklists.get(this.checklistName).id;
    item.websiteId = this.wsDto.WebsiteId;
    if (this.hashMap.has(item.subCriteriaId)) {
      item.id = this.hashMap.get(item.subCriteriaId).id
    }
    this.hashMap.set(item.subCriteriaId, item);
    this.fillConformity();
  }

  saveAccordion() {
    this.saveDataInBd();
  }

  saveAndExit() {
    this.saveDataInBd();
  }

  clean() {
    this.hashMap.clear();
    this.fillConformity();
  }

  selectCurrentIndexItem(index: number) {
    this.currentIndexItem = index;
  }

}
