import { Component,Input, EventEmitter, Output, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { BkamService } from 'src/app/services/bkam.service';

@Component({
  selector: 'app-exel-details-700',
  templateUrl: './exel-details-700.component.html',
  styleUrl: './exel-details-700.component.scss'
})
export class ExelDetails700Component implements OnDestroy{
  @ViewChild('dt') dt!: Table;
  selectedLignes: any[] = [];
  @Input() bkamEntityId!: number;
  @Input() childVariable!: boolean ;
  @Output() childVariableChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  state!: string;
  etat!: string;
  saved: boolean=true;
  tableData: any[] = [];
  displayAddAxeDialog: boolean = false;
  defaultAxe:any  = {
    ligneDocument: '',
    traficIlliciteStupefiants:  { columnNumber: 2, value: 0 },
    traficEtresHumains:  { columnNumber: 3, value: 0 },
    traficImmigrants:  { columnNumber: 4, value: 0 },
    traficIlliciteArmes:  { columnNumber: 5, value: 0 },
    corruptionConcussion:  { columnNumber: 6, value: 0 },
    contrefaconMonnaies:  { columnNumber: 7, value: 0 },
    exploitationSexuelle:  { columnNumber: 8, value: 0 },
    abusConfiance:  { columnNumber: 9, value: 0 },
    escroquerie:  { columnNumber: 10, value: 0 },
    volExtorsion:  { columnNumber: 11, value: 0 },
    contrebande:  { columnNumber: 12, value: 0 },
    fraudeMarchandises:  { columnNumber: 13, value: 0 },
    fauxUsageFaux:  { columnNumber: 14, value: 0 },
    attelongeSystemesTraitement:  { columnNumber: 15, value: 0 },
    financementTerrorisme:  { columnNumber: 16, value: 0 },
    total: { columnNumber: 17, value: 0 }
  };;
  newAxe: any = {...this.defaultAxe};
  ligneDocumentOptions: any[] = [];
  submitted: boolean = false;
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
    }
    fetchData() {
      this.bkamService.getAxesByBkamEntityId(this.bkamEntityId).subscribe(
        (response) => {
          if (response.success) {
            this.state = response.data.state;
            this.etat = response.data.etat;
            this.tableData = response.data.axes;
            this.getLigneDocOption();
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
    getLigneDocOption(){
      this.bkamService.getCodeMappings(this.state).subscribe(
        (data) => {
          this.ligneDocumentOptions = data.map((item: { Libelle: any; }) => item.Libelle);
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
      this.newAxe = { ...this.defaultAxe };
      this.displayAddAxeDialog = true;
      this.submitted = false;
    }
    saveData() {
      console.log('Data saved', this.tableData);
      this.bkamService
        .saveData(this.bkamEntityId)
        .subscribe(
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Axes Saved avec succès',
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
    addAxe() {
      this.submitted = true;
      if (!this.newAxe.ligneDocument) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Le champ ligne document est obligatoire',
        });
        return;
      }
      var axe: any={ ...this.newAxe };
      console.log(this.bkamEntityId);

      this.bkamService
        .addAxe(this.bkamEntityId, axe)
        .subscribe(
          (response: any) => {
            if (response.success) {
              this.tableData.push({ ...axe });
        //    this.tableData = this.sortAxes(this.tableData);
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
                  this.bkamService
                      .deleteAxe(this.bkamEntityId, ligne.id)
                      .subscribe(
                          (response) => {
                              if (response.success) {
                                  successCount++;
                                      this.tableData = this.tableData.filter(
                                          (row) => row.ligneDocument !== ligne.ligneDocument
                                      );
                                  this.messageService.add({
                                      severity: 'success',
                                      summary: 'Succès',
                                      detail: response.message,
                                      life: 3000,
                                  });
                                  this.childVariableChange.emit(false);
                                  this.saved=false;
                                  selectedLignes.length = 0;
                                  this.dt.selection = [];
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
  calculateTotal() {
    this.newAxe.total.value =
      this.newAxe.traficIlliciteStupefiants.value +
      this.newAxe.traficEtresHumains.value +
      this.newAxe.traficImmigrants.value +
      this.newAxe.traficIlliciteArmes.value +
      this.newAxe.corruptionConcussion.value +
      this.newAxe.contrefaconMonnaies.value +
      this.newAxe.exploitationSexuelle.value +
      this.newAxe.abusConfiance.value +
      this.newAxe.escroquerie.value +
      this.newAxe.volExtorsion.value +
      this.newAxe.contrebande.value +
      this.newAxe.fraudeMarchandises.value +
      this.newAxe.fauxUsageFaux.value +
      this.newAxe.attelongeSystemesTraitement.value +
      this.newAxe.financementTerrorisme.value;
  }

  onValueChange() {
    this.calculateTotal();
  }
  ngOnDestroy() {
    window.onbeforeunload = null;
  }
}

