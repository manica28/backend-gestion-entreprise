import { Employe, CyclePaie, Bulletin, DashboardStats } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

// Fonction utilitaire pour les requêtes HTTP
const apiRequest = async (url: string, options: RequestInit = {}): Promise<any> => {
  const token = localStorage.getItem('token');

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  const config: RequestInit = {
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config);

    // Gérer les erreurs d'authentification
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error('Token expiré ou invalide');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Erreur réseau');
  }
};

export const authService = {
  login: async (email: string, motDePasse: string) => {
    return await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, motDePasse }),
    });
  },

  register: async (data: {
    email: string;
    motDePasse: string;
    nom: string;
    prenom: string;
    role: string;
    entrepriseId?: string;
  }) => {
    return await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getProfile: async () => {
    return await apiRequest('/auth/profile');
  },

  refreshToken: async (refreshToken: string) => {
    return await apiRequest('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  },

  logout: async () => {
    return await apiRequest('/auth/logout', {
      method: 'POST',
    });
  },
};

// Fonction helper pour construire les URLs avec paramètres
const buildUrl = (baseUrl: string, params?: Record<string, any>): string => {
  if (!params) return baseUrl;

  const url = new URL(baseUrl, 'http://dummy.com');
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });

  return `${baseUrl}${url.search}`;
};

export const employesService = {
  getAll: async (params?: {
    search?: string;
    statut?: string;
    page?: number;
    limit?: number;
  }) => {
    const url = buildUrl('/employes', params);
    return await apiRequest(url);
  },

  getById: async (id: string) => {
    return await apiRequest(`/employes/${id}`);
  },

  create: async (data: Partial<Employe>) => {
    return await apiRequest('/employes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<Employe>) => {
    return await apiRequest(`/employes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  toggleStatus: async (id: string) => {
    return await apiRequest(`/employes/${id}/toggle-status`, {
      method: 'PATCH',
    });
  },

  getContrats: async (id: string) => {
    return await apiRequest(`/employes/${id}/contrats`);
  },
};

export const cyclesService = {
  getAll: async (params?: {
    statut?: string;
    annee?: number;
  }) => {
    const url = buildUrl('/cycles', params);
    return await apiRequest(url);
  },

  getById: async (id: string) => {
    return await apiRequest(`/cycles/${id}`);
  },

  create: async (data: {
    nom: string;
    description?: string;
    dateDebut: string;
    dateFin: string;
  }) => {
    return await apiRequest('/cycles', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<CyclePaie>) => {
    return await apiRequest(`/cycles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  genererBulletins: async (id: string) => {
    return await apiRequest(`/cycles/${id}/generer-bulletins`, {
      method: 'POST',
    });
  },

  cloturer: async (id: string) => {
    return await apiRequest(`/cycles/${id}/cloturer`, {
      method: 'POST',
    });
  },

  supprimer: async (id: string) => {
    return await apiRequest(`/cycles/${id}`, {
      method: 'DELETE',
    });
  },
};

export const bulletinsService = {
  getByCycle: async (cycleId: string, params?: {
    statutPaiement?: string;
    employeId?: string;
  }) => {
    const url = buildUrl(`/bulletins/cycle/${cycleId}`, params);
    return await apiRequest(url);
  },

  getByEmploye: async (employeId: string, params?: {
    limit?: number;
  }) => {
    const url = buildUrl(`/bulletins/employe/${employeId}`, params);
    return await apiRequest(url);
  },

  getById: async (id: string) => {
    return await apiRequest(`/bulletins/${id}`);
  },

  getStats: async (cycleId: string) => {
    return await apiRequest(`/bulletins/stats/${cycleId}`);
  },
};

export const dashboardService = {
  getStats: async (): Promise<{ data: DashboardStats }> => {
    // Cette fonction agrège les données de différentes APIs
    const [employesRes, cyclesRes, bulletinsRes] = await Promise.all([
      apiRequest('/employes'),
      apiRequest('/cycles'),
      apiRequest('/bulletins/cycle/all') // On suppose qu'il y a un endpoint pour tous les bulletins
    ]);

    const employes = employesRes.data || [];
    const cycles = cyclesRes.data || [];
    const bulletins = bulletinsRes.data || [];

    const stats: DashboardStats = {
      totalEmployes: employes.length,
      employesActifs: employes.filter((e: Employe) => e.statutActuel === 'ACTIF').length,
      totalCycles: cycles.length,
      cyclesActifs: cycles.filter((c: CyclePaie) => c.statut === 'BROUILLON' || c.statut === 'APPROUVE').length,
      totalBulletins: bulletins.length,
      bulletinsPayes: bulletins.filter((b: Bulletin) => b.statutPaiement === 'PAYE_TOTAL').length,
      montantTotalAPayer: bulletins.reduce((sum: number, b: Bulletin) => sum + b.netAPayer, 0),
      montantTotalPaye: bulletins
        .filter((b: Bulletin) => b.statutPaiement === 'PAYE_TOTAL')
        .reduce((sum: number, b: Bulletin) => sum + b.netAPayer, 0),
    };

    return { data: stats };
  },
};