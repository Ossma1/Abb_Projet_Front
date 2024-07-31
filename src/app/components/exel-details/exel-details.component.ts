import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { BkamService } from '../../services/bkam.service';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-exel-details',
  templateUrl: './exel-details.component.html',
  styleUrls: ['./exel-details.component.scss'],
})
export class ExelDetailsComponent {
  @ViewChild('dt') dt!: Table;
  @ViewChild('dt1') dt1!: Table;
  @ViewChild('dt2') dt2!: Table;
  selectedLignes: any[] = [];
  @Input() bkamEntityId!: number;
  @Input() childVariable!: boolean ;
  @Output() childVariableChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  state!: string;
  etat!: string;
  saved: boolean=true;
  order!: any[];
  cb1Data!: any[];
  cb2Data!: any[];
  tableData: any[] = [];
  items!: MenuItem[];
  activeItem!: MenuItem;
  displayAddAxeDialog: boolean = false;
  newAxe: any = {};
  submitted: boolean = false;
  codeAxesOptions: any[] = [];
  intituleComplementaireOptions: any[] = [];
  codeMappings: any = {};
  newCb1Row: any = {};
  newCb2Row: any = {};
  displayAddCb1Dialog: boolean = false;
  displayAddCb2Dialog: boolean = false;
  riskLevels: any[] = [
    { label: 'Faible', value: 'Faible' },
    { label: 'Moyen', value: 'Moyen' },
    { label: 'Moyen-Élevé', value: 'Moyen-Élevé' },
    { label: 'Élevé', value: 'Élevé' },
  ];
  typeFluxOption: any[] = [
    { label: 'Emis', value: 'Emis' },
    { label: 'Reçu', value: 'Reçu' }
  ];

  constructor(
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private bkamService: BkamService
  ) {
    window.onbeforeunload = (event: BeforeUnloadEvent) => {
      if (!this.saved) {
        this.saveData();
        const message = 'Vous avez des modifications non enregistrées. Les données sont en cours de sauvegarde.';
        event.returnValue = message;
        return message;
      }
      return undefined;
    };
  }
  ngOnInit(): void {
    this.fetchData();
    this.items = [
      {
        label: 'CB1',
        command: () => {
          this.activeItem = this.items[0];
        },
      },
      {
        label: 'CB2',
        command: () => {
          this.activeItem = this.items[1];
        },
      },
    ];
    this.activeItem = this.items[0];
  }

  fetchData() {
    this.bkamService.getAxesByBkamEntityId(this.bkamEntityId).subscribe(
      (response) => {
        if (response.success) {
          this.handleDifferentStates(response.data);
          if (this.state != '705')
          this.updateCodeAxesOptions();
        }
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
        });
      }
    );
  }

  handleDifferentStates(data: any): void {
    this.state = data.state;
    this.etat = data.etat;
    if (
      [
        '701',
        '702',
        '703',
        '704',
        '707',
        '708',
        '709',
        '710',
        '711',
        '712',
        '713',
      ].includes(this.state)
    ) {
      console.log("dataaaaaaaaaaaaaa:"+JSON.stringify(data.axes));
      this.tableData = data.axes;
    } else if (this.state === '705') {
      this.cb1Data = data.cb1;
      this.cb2Data = data.cb2;
    }
  }
  private sortAxes(axes: any[]): any[] {
    return axes.sort((a, b) => {
      const cleanCodeA = a.codeAxes.replace(/\s+/g, '');
      const cleanCodeB = b.codeAxes.replace(/\s+/g, '');

      const indexA = this.order.indexOf(cleanCodeA);
      const indexB = this.order.indexOf(cleanCodeB);
      if (indexA === -1) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Error: codeAxes '${cleanCodeA}' not found in the Bkam Notice list.`,
        });
      }
      if (indexA === -1 || indexB === -1) {
        return 0;
      }
      return indexA - indexB;
    });
  }
  updateCodeAxesOptions(): void {
    this.bkamService.getCodeMappings(this.state).subscribe(
      (data) => {
        this.codeMappings = data;
        this.order = Object.values(data).map((item: any) => item.intitule);
        this.tableData = this.sortAxes(this.tableData);
        this.codeAxesOptions = Object.keys(data).map((key) => ({
          label: data[key].intitule,
          value: data[key].intitule,
        }));
        this.intituleComplementaireOptions = Object.keys(data).map((key) => ({
          label: data[key].intituleComplementaire,
          value: data[key].intituleComplementaire,
        }));
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les mappings de code',
        });
      }
    );
  }

  showAddAxeDialog() {
    this.newAxe = {};
    this.displayAddAxeDialog = true;
    this.submitted = false;
  }
  showAddCb1Dialog() {
    this.newCb1Row = {};
    this.displayAddCb1Dialog = true;
  }

  showAddCb2Dialog() {
    this.newCb2Row = {};
    this.displayAddCb2Dialog = true;
  }


  onCodeAxesChange(event: any): void {
    const selectedCode = event.value;
    this.newAxe.libelleAxes = this.getLibellComplemByCode(
      this.getCodeByLibell(selectedCode)
    );
  }

  onLibelleAxesChange(event: any): void {
    const selectedLibell = event.value;
    this.newAxe.codeAxes = this.getLibellByCode(
      this.getCodeByLibellComplem(selectedLibell)
    );
  }

  getLibellByCode(code: string): string {
    return this.codeMappings[code]?.intitule || '';
  }

  getCodeByLibell(libell: string): string {
    return (
      Object.keys(this.codeMappings).find(
        (key) => this.codeMappings[key].intitule === libell
      ) || ''
    );
  }
  getLibellComplemByCode(code: string): string {
    return this.codeMappings[code]?.intituleComplementaire || '';
  }

  getCodeByLibellComplem(libell: string): string {
    return (
      Object.keys(this.codeMappings).find(
        (key) => this.codeMappings[key].intituleComplementaire === libell
      ) || ''
    );
  }
  saveData() {
    console.log('Data saved', this.tableData);
    this.bkamService
      .saveData(this.bkamEntityId, this.activeItem.label)
      .subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Axe save avec succès',
            life: 3000,
          });
          this.childVariableChange.emit(true);
          this.saved=true;
          this.router
          .navigateByUrl('/', { skipLocationChange: true })
          .then(() => {
            this.router.navigate(['/import']);
          });
        },
        (error) => {
          console.error('Error deleting axe:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: error.message,
          });
        }
      );
  }
  addCbAxe(){
    this.submitted = true;
    this.bkamService
    .addAxe(this.bkamEntityId, this.activeItem.label ==='CB1'?this.newCb1Row:this.newCb2Row, this.activeItem.label)
    .subscribe(
      (response: any) => {
        if (response.success) {
          if(this.activeItem.label ==='CB1'){
            this.cb1Data.push({ ...this.newCb1Row });
            this.displayAddCb1Dialog = false;
          }else if (this.activeItem.label ==='CB2'){
            this.cb2Data.push({ ...this.newCb2Row });
            this.displayAddCb2Dialog = false;
          }
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: response.message,
          });
          this.messageService.add({
            severity: 'info',
            summary: 'Information',
            detail: 'Vous devez enregistrer avant de sortir',
            life: 3000,
          });
          this.childVariableChange.emit(false);
          this.saved=false;

     //     this.saveData();

        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: response.error,
          });
        }
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: "Impossible d'ajouter l'axe :" + error.message,
        });
      }
    );
  }
  addAxe() {
    this.submitted = true;
    if (!this.newAxe.codeAxes) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Le champ Code Axes est obligatoire',
      });
      return;
    }
    let regex = /^(CL|PDT|TR|CD|GEO|Autres)-|^(CL)[1-3]$/;
    let match = regex.exec(this.newAxe.codeAxes);
    var axe: any;

    if (match) {
      axe = { ...this.newAxe, axes: match[1] ? match[1] : match[2] };
    } else {
      axe = { ...this.newAxe };
    }
    if (axe.commentaires && axe.commentaires.length > 2000) {
      this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Le champ Commentaire ne doit pas dépasser 2000 caractères',
      });
      return;
  }

    this.bkamService
      .addAxe(this.bkamEntityId, axe, this.activeItem.label)
      .subscribe(
        (response: any) => {
          if (response.success) {
            this.tableData.push({ ...axe });
            this.tableData = this.sortAxes(this.tableData);
            this.displayAddAxeDialog = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: response.message,
            });
            this.messageService.add({
              severity: 'info',
              summary: 'Information',
              detail: 'Vous devez enregistrer avant de sortir',
              life: 3000,
            });
            this.childVariableChange.emit(false);
            this.saved=false;

        //    this.saveData();
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: response.error,
            });
          }
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: "Impossible d'ajouter l'axe :" + error.message,
          });
        }
      );

    this.displayAddAxeDialog = false;
  }
  deleteRow(selectedLignes: any[]) {
    this.confirmationService.confirm({
        message: 'Êtes-vous sûr de vouloir supprimer les lignes sélectionnées ?',
        header: 'Confirmer',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            let successCount = 0;
            let totalLignes = selectedLignes.length;

            selectedLignes.forEach((ligne) => {
                console.log(this.activeItem.label);
                this.bkamService
                    .deleteAxe(this.bkamEntityId, ligne.id, this.activeItem.label)
                    .subscribe(
                        (response) => {
                            if (response.success) {
                                successCount++;
                                if (this.state !== '705') {
                                    this.tableData = this.tableData.filter(
                                        (row) => row.codeAxes !== ligne.codeAxes
                                    );
                                } else if (this.activeItem.label === 'CB1') {
                                    this.cb1Data = this.cb1Data.filter((row) => {
                                        return row.id !== ligne.id;
                                    });
                                } else if (this.activeItem.label === 'CB2') {
                                    this.cb2Data = this.cb2Data.filter((row) => row !== ligne);
                                }
                                this.messageService.add({
                                    severity: 'success',
                                    summary: 'Succès',
                                    detail: response.message,
                                    life: 3000,
                                });
                                this.childVariableChange.emit(false);
                                this.saved=false;
                                selectedLignes.length = 0;
                                if (this.state !== '705') {
                                    this.dt.selection = [];
                                } else if (this.activeItem.label === 'CB1') {
                                    this.dt1.selection = [];
                                } else if (this.activeItem.label === 'CB2') {
                                    this.dt2.selection = [];
                                }
                            } else {
                                this.messageService.add({
                                    severity: 'error',
                                    summary: 'Erreur',
                                    detail: response.error,
                                    life: 3000,
                                });
                            }

                            if (successCount === totalLignes) {
                                this.messageService.add({
                                    severity: 'info',
                                    summary: 'Information',
                                    detail: 'Vous devez enregistrer avant de sortir',
                                    life: 3000,
                                });
                            }

                          },
                        (error) => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Erreur',
                                detail: error.message,
                            });
                        }
                    );
            });
          //  this.saveData();
        },
    });
}
ngOnDestroy() {
  window.onbeforeunload = null;
}
}
