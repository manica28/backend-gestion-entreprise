// Types pour le frontend
export interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'CAISSIER';
  entrepriseId?: string;
  entreprise?: {
    id: string;
    nom: string;
    logo?: string;
    devise: string;
  };
}

export interface Employe {
  id: string;
  nomComplet: string;
  email?: string;
  telephone?: string;
  statutActuel: 'ACTIF' | 'INACTIF' | 'CONGE' | 'SUSPENDU' | 'DEMISSIONNE' | 'LICENCIE' | 'RETRAITE';
  entreprise?: {
    id: string;
    nom: string;
  };
  creeA: string;
  modifieA: string;
}

export interface CyclePaie {
  id: string;
  nom: string;
  dateDebut: string;
  dateFin: string;
  statut: 'BROUILLON' | 'APPROUVE' | 'CLOTURE';
  totalBrut?: number;
  totalNet?: number;
  totalEmployes?: number;
  entreprise?: {
    id: string;
    nom: string;
  };
}

export interface Bulletin {
  id: string;
  numeroBulletin: string;
  salaireBase: number;
  netAPayer: number;
  statutPaiement: 'EN_ATTENTE' | 'PAYE_PARTIEL' | 'PAYE_TOTAL';
  employe?: {
    id: string;
    nomComplet: string;
  };
  cycle?: {
    id: string;
    nom: string;
  };
}

export interface DashboardStats {
  totalEmployes: number;
  employesActifs: number;
  totalCycles: number;
  cyclesActifs: number;
  totalBulletins: number;
  bulletinsPayes: number;
  montantTotalAPayer: number;
  montantTotalPaye: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }[];
}