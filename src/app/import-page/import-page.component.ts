import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { ImportService } from '../services/import.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-import-page',
  templateUrl: './import-page.component.html',
  styleUrls: ['./import-page.component.scss'],
})
export class ImportPageComponent {
  @ViewChild('fileUpload', { static: false }) fileUpload!: ElementRef;
  bkamEntityId!: number;
  bkamEtat!: number;

  saved: boolean = true;

  constructor(
    private http: HttpClient,
    private spinnerService: NgxSpinnerService,
    private messageService: MessageService,
    private importService: ImportService
  ) {
    this.selectedExercice = new Date();
    this.formattedDate = this.formatDate(this.selectedExercice);
  }
  selectedRows: any[] = [];
  displayPopupBKAM: boolean = false;
  selectedEtat!: string;
  uploadedFiles: any[] = [];
  dateArreteOptions: any[] = [];
  selectedExercice!: Date;
  formattedDate!: string;
    displayPopup: boolean = false;
  displayHistorique: boolean = false;
  displayDiffAnomalie: boolean = false;
  displayPopup2: boolean = false;
  rowData?: any;
  bkams: any[] = [];
  ngOnInit(): void {
    document.addEventListener('DOMContentLoaded', function () {
      var buttonLabels = document.querySelectorAll('.p-button-label');
      buttonLabels.forEach(function (label) {
        if (label.textContent && label.textContent.trim() === 'Choose') {
          label.textContent = 'Add';
        }
      });
    });
    this.recupererBkamsList();
    this.generateYearOptions();

  }
  generateYearOptions() {
    const startYear = 2020;
    const currentYear = new Date().getFullYear();
    for (let year = startYear; year <= currentYear; year++) {
      this.dateArreteOptions.push({ label: year.toString(), value: year.toString() });
    }
  }
  recupererBkamsList() {
    this.spinnerService.show();
    this.importService.getBkams().subscribe(
      (data) => {
        if (data && data.response) {
          this.spinnerService.hide();
          this.bkams = data.response;
        }
      },
      (error) => {
        this.spinnerService.hide();
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error fetching bkams',
        });
      }
    );
  }

  colsAnomalies = [
    { field: 'codeAnomalie', header: 'Code Anomalie' },
    { field: 'Libelle', header: 'Libellé' },
    { field: 'interpretation', header: 'Interprétation' },
  ];

  codeEtatOptions: any[] = [
    { label: 'E700', value: '700' },
    { label: 'E701', value: '701' },
    { label: 'E702', value: '702' },
    { label: 'E703', value: '703' },
    { label: 'E704', value: '704' },
    { label: 'E705', value: '705' },
    { label: 'E707', value: '707' },
    { label: 'E708', value: '708' },
    { label: 'E709', value: '709' },
    { label: 'E710', value: '710' },
    { label: 'E711', value: '711' },
    { label: 'E712', value: '712' },
    { label: 'E713', value: '713' },
  ];

  statutOptions: any[] = [
    { label: 'OK', value: 'OK' },
    { label: 'Failed', value: 'Failed' },
  ];



  exercices = [
    { label: '12/12/2020', value: '12/12/2020' },
    { label: '12/12/2021', value: '12/12/2021' },
    { label: '12/12/2022', value: '12/12/2022' },
    { label: '12/12/2023', value: '12/12/2023' },
  ];

  etats = [
    {
      value: '700',
      label:
        "E700 - Statistiques sur le nombre des DS transmises à l'UTRF par ligne de métiers et typologie ...",
    },
    {
      value: '701',
      label:
        'E701 - Risque inhérent " Banque de détail : Banque des particuliers et des professionnels (PP)"',
    },
    {
      value: '702',
      label: 'E702 - Risque inhérent " Banque de détail : Banque Privée"',
    },
    {
      value: '703',
      label:
        'E703 - Risque inhérent " Banque de l\'entreprise et de financement"',
    },
    { value: '704', label: 'E704 - Risque inhérent " Commerce international"' },
    {
      value: '705',
      label: 'E705 - Risque inhérent " Correspondance bancaire"',
    },
    {
      value: '707',
      label: 'E707 - Risque inhérent " Financement participatif "',
    },
    {
      value: '708',
      label: 'E708 - Risque inhérent " Crédit à la consommation"',
    },
    { value: '709', label: 'E709 - Risque inhérent "Crédit Immobilier"' },
    { value: '710', label: 'E710 - Risque inhérent " Leasing"' },
    { value: '711', label: 'E711 - Risque inhérent " Affacturage"' },
    { value: '712', label: 'E712 - Risque inhérent "Transfert de fonds"' },
    { value: '713', label: 'E713 - Risque inhérent "comptes de paiement"' },
  ];


  files: any[] = [];
  onDateSelect() {
    this.formattedDate = this.formatDate(this.selectedExercice);
  }

  formatDate(date: Date): string {
    const month = date.getMonth() + 1; // getMonth() returns month from 0-11
    const year = date.getFullYear();
    return `${month < 10 ? '0' + month : month}/${year}`;
  }
  onUpload(event: any) {
    for (let file of event.files) {
      this.onDateSelect();
      this.uploadedFiles.push(file);
      if (
        this.selectedEtat &&
        this.formattedDate      ) {
        this.spinnerService.show();
        this.importService
          .uploadFile(
            file,
            this.selectedEtat,
            this.formattedDate,
            '350'
          )
          .subscribe(
            (response) => {
              console.log(response);
              this.spinnerService.hide();
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'File upload successful ' + response.message,
              });
              this.recupererBkamsList();
            },
            (error) => {
              this.spinnerService.hide();
               this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail:error.error.message,
                life: 3000,
              });
            }
          );
      } else {

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'All fields must be selected before uploading',
        });
      }
    }
  }

  consult(rowData: any) {
    this.bkamEntityId = rowData.id;
    this.bkamEtat =  parseInt(rowData.codeDocument, 10);
    console.log(rowData.codeDocument)
    this.displayPopup = true;
  }
  anomalies(id: any) {
    this.bkamEntityId = id;
    this.displayPopup2 = true;
  }

  generateCFT(rowData: any, event: MouseEvent) {
    const buttonElement = event.currentTarget as HTMLButtonElement;
    if (!buttonElement) {
      console.error('Button element not found.');
      return;
    }
    this.spinnerService.show();
    buttonElement.classList.add('disabled-button');

    this.importService.generateFile(rowData.id).subscribe(
      (response: any) => {
        this.handleFileResponse(response, buttonElement, response.message);
      },
      (error) => {
        console.error('Error generating CFT file:', error);
        this.spinnerService.hide();
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error generating CFT file'+error,
        });
        buttonElement.classList.remove('disabled-button');
      }
    );
  }
  generateSelectedFiles(event: MouseEvent) {
    const buttonElement = event.currentTarget as HTMLButtonElement;
    if (!buttonElement) {
      console.error('Button element not found.');
      return;
    }
    const failedBkams = this.selectedRows.filter(
      (row) => row.status === 'Failed'
    );
    if (failedBkams.length > 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Veuillez sélectionner uniquement les BKAMs avec le statut OK',
      });
      return;
    }
    const selectedIds = this.getSortedSelectedIds();
    console.log('Selected IDs for generating CFT:', selectedIds);
    this.spinnerService.show();
    buttonElement.classList.add('disabled-button');
    this.importService.generateFileFromExcels(selectedIds).subscribe(
      (response: any) => {
        this.handleFileResponse(response, buttonElement, response.message);
      },
      (error: any) => {
        console.log(error.message)
        this.spinnerService.hide();
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: error.error.message,
        });
        buttonElement.classList.remove('disabled-button');
      }
    );
  }
  private downloadFile(blob: Blob, fileName: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName + '.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
  private handleFileResponse(response: any, buttonElement: HTMLButtonElement, successMessage: string) {
    this.spinnerService.hide();
    const blob = this.createBlob(response.fileData);
    this.downloadFile(blob, response.fileName);
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: successMessage,
    });
    setTimeout(() => {
      buttonElement.classList.remove('disabled-button');
    }, 3000);
    }
  private getSortedSelectedIds(): string[] {
    const fileTypes = ['700', '701', '702', '703', '704', '705', '707', '708', '709', '710', '711', '712'];
    return this.selectedRows
      .filter(row => row.status === 'OK')
      .sort((a, b) => fileTypes.indexOf(a.codeDocument) - fileTypes.indexOf(b.codeDocument))
      .map(row => row.id);
  }
  private createBlob(base64Data: string): Blob {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: 'application/octet-stream' });
  }
  applyFilter(event: Event, dt: any) {
    const input = event.target as HTMLInputElement;
    if (input && input.value && dt) {
      dt.filterGlobal(input.value, 'contains');
    }
  }
}
