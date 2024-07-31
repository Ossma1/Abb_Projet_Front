import { Component, Input, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { BkamService } from 'src/app/services/bkam.service';

@Component({
  selector: 'app-anomalies',
  templateUrl: './anomalies.component.html',
  styleUrls: ['./anomalies.component.scss']
})
export class AnomaliesComponent implements OnInit {
  @Input() bkamEntityId!: number;
  state!: string;
  etat!: string;
  tableData: any[] = [];
  cb1Data!: any[];
  cb2Data!: any[];
  items!: MenuItem[];
  activeItem!: MenuItem;
  cols: any[] = [];
  clientCols = [
    { field: 'controle', header: 'Control' },
    { field: 'client.numLigne', header: 'Num ligne' },
    { field: 'client.axes', header: 'Axes' },
    { field: 'client.codeAxes', header: 'Code Axes' },
    { field: 'client.libelleAxes', header: 'Lib axes' },
    { field: 'client.nombreClients', header: 'Fac vul nb cli' },
    { field: 'client.encoursDepots', header: 'Fac vul encor crd' },
    { field: 'client.fluxDebiteurs2020', header: 'Fac vul nb dos n' },
    { field: 'client.fluxCrediteurs2020', header: 'Fac vul nb encor crd n' },
    { field: 'client.nombreClientsCartes', header: 'Nb cli cart prepay' },
    { field: 'client.risqueInherent', header: 'Risque inherent' },
    { field: 'client.commentaires', header: 'Commentaire' }
  ];
  cb1Cols: any[] = [
     { field: 'controle', header: 'Control' },
    { field: 'cb1.numLigne', header: 'Num ligne' },
    { field: 'cb1.totalFluxType', header: 'Total Flux Type' },
    { field: 'cb1.pays', header: 'Pays' },
    { field: 'cb1.nombreValue', header: 'Nombre Value' },
    { field: 'cb1.volume', header: 'Volume' },
  ];
  cb2Cols: any[] = [
    { field: 'controle', header: 'Control' },
    { field: 'cb2.numLigne', header: 'Num ligne' },
    { field: 'cb2.nom', header: 'Nom' },
    { field: 'cb2.codeBIC', header: 'Code BIC' },
    { field: 'cb2.dateEntreeEnRelation', header: 'Date Entrée En Relation' },
    { field: 'cb2.maisonMereOuFiliale', header: 'Maison Mère ou Filiale' },
    { field: 'cb2.compteNostroOuVostro', header: 'Compte Nostro ou Vostro' },
    { field: 'cb2.devise', header: 'Devise' },
    { field: 'cb2.paysAgrement', header: 'Pays Agrément' },
    { field: 'cb2.niveauRisqueBCFTDuPays', header: 'Niveau Risque BCFT Du Pays' },
    { field: 'cb2.profilRisqueBeneficiairesEffectifs', header: 'Profil Risque Bénéficiaires Effectifs' },
    { field: 'cb2.utilisationCompteCorrespondanceParTiers', header: 'Utilisation Compte Correspondance Par Tiers' },
    { field: 'cb2.statutDuCompte', header: 'Statut Du Compte' },
    { field: 'cb2.nombreFluxEmis', header: 'Nombre Flux Émis' },
    { field: 'cb2.nombreFluxEmisPaysRisque', header: 'Nombre Flux Émis Pays Risque' },
    { field: 'cb2.volumeFluxEmis', header: 'Volume Flux Émis' },
    { field: 'cb2.volumeFluxEmisPaysRisque', header: 'Volume Flux Émis Pays Risque' },
    { field: 'cb2.nombreFluxRecus', header: 'Nombre Flux Reçus' },
    { field: 'cb2.nombreFluxRecusPaysRisque', header: 'Nombre Flux Reçus Pays Risque' },
    { field: 'cb2.volumeFluxRecus', header: 'Volume Flux Reçus' },
    { field: 'cb2.volumeFluxRecusPaysRisque', header: 'Volume Flux Reçus Pays Risque' },
  ];
  defaultCols: any[] = [
    { field: 'controle', header: 'Control' },
    { field: 'produit.numLigne', header: 'Num ligne' },
    { field: 'produit.axes', header: 'Axes' },
    { field: 'produit.codeAxes', header: 'Code Axes' },
    { field: 'produit.libelleAxes', header: 'Lib axes' },
    { field: 'produit.nombreClients', header: 'Fac vul nb cli' },
    { field: 'produit.encoursDepotsPlacement', header: 'Fac vul encor crd' },
    { field: 'produit.fluxDebiteurs2020', header: 'Fac vul nb dos n' },
    { field: 'produit.fluxCrediteurs2020', header: 'Fac vul nb encor crd n' },
    { field: 'produit.risqueInherent', header: 'Risque inherent' },
    { field: 'produit.commentaires', header: 'Commentaire' }
  ];
  E700Cols: any[] = [
    { field: 'controle', header: 'Control' },
    { field: 'axeE700.numLigne', header: 'Num ligne' },
    { field: 'axeE700.ligneDocument', header: 'ligne document' },
    { field: 'axeE700.traficIlliciteStupefiants.value', header: 'Trafic Illicite Stupéfiants' },
    { field: 'axeE700.traficEtresHumains.value', header: 'Trafic Êtres Humains' },
    { field: 'axeE700.traficImmigrants.value', header: 'Trafic Immigrants' },
    { field: 'axeE700.traficIlliciteArmes.value', header: 'Trafic Illicite Armes' },
    { field: 'axeE700.corruptionConcussion.value', header: 'Corruption Concussion' },
    { field: 'axeE700.contrefaconMonnaies.value', header: 'Contrefaçon Monnaies' },
    { field: 'axeE700.exploitationSexuelle.value', header: 'Exploitation Sexuelle' },
    { field: 'axeE700.abusConfiance.value', header: 'Abus Confiance' },
    { field: 'axeE700.escroquerie.value', header: 'Escroquerie' },
    { field: 'axeE700.volExtorsion.value', header: 'Vol Extorsion' },
    { field: 'axeE700.contrebande.value', header: 'Contrebande' },
    { field: 'axeE700.fraudeMarchandises.value', header: 'Fraude Marchandises' },
    { field: 'axeE700.fauxUsageFaux.value', header: 'Faux Usage Faux' },
    { field: 'axeE700.attelongeSystemesTraitement.value', header: 'Attelonge Systèmes Traitement' },
    { field: 'axeE700.financementTerrorisme.value', header: 'Financement Terrorisme' },
    { field: 'axeE700.total.value', header: 'Total' }
  ];

  constructor(
    private messageService: MessageService,
    private bkamService: BkamService
  ) {}

  ngOnInit(): void {
    this.fetchData();

    this.items = [
      {label: 'CB1 Anomalies', command: () => { this.activeItem = this.items[0]; }},
      {label: 'CB2 Anomalies', command: () => { this.activeItem = this.items[1]; }}
    ];
    this.activeItem = this.items[0];
  }

  fetchData() {
    this.bkamService.getAnomalies(this.bkamEntityId).subscribe(response => {
      if (response.success) {
        console.log(response.data);
        this.handleDifferentStates(response.data);
      }
    }, error => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: error.message,
      });
    });
  }

  handleDifferentStates(data: any): void {
    this.state = data.state;
    this.etat = data.etat;
    if(this.state === "700"){
      this.tableData = data.anomalies;
      this.cols = this.E700Cols;
    }
    else if (["701", "702"].includes(this.state)) {
      this.tableData = data.anomalies;
      this.cols = this.clientCols;
    }else if (["703", "704", "707", "708", "709", "710", "711", "712","713"].includes(this.state)) {
      this.tableData = data.anomalies;
      this.cols = this.defaultCols;
    } else if (this.state === "705") {
      this.cb1Data = data.anomaliesCb1;
      this.cb2Data = data.anomaliesCb2;
    }
  }

  resolveField(rowData: any, field: string) {
    return field.split('.').reduce((acc, part) => acc && acc[part], rowData);
  }
}
