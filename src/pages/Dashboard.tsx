import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import {
  Users,
  FileText,
  DollarSign,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { dashboardService } from '../services/api';
import { DashboardStats } from '../types';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await dashboardService.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Erreur de chargement</h3>
        <p className="mt-1 text-sm text-gray-500">
          Impossible de charger les données du dashboard.
        </p>
      </div>
    );
  }

  // Données pour les graphiques
  const employeStatusData = [
    { name: 'Actifs', value: stats.employesActifs, color: '#10B981' },
    { name: 'Inactifs', value: stats.totalEmployes - stats.employesActifs, color: '#EF4444' },
  ];

  const cycleStatusData = [
    { name: 'Actifs', value: stats.cyclesActifs, color: '#3B82F6' },
    { name: 'Clôturés', value: stats.totalCycles - stats.cyclesActifs, color: '#6B7280' },
  ];

  const paiementData = [
    { name: 'Payés', value: stats.bulletinsPayes, color: '#10B981' },
    { name: 'En attente', value: stats.totalBulletins - stats.bulletinsPayes, color: '#F59E0B' },
  ];

  const monthlyData = [
    { month: 'Jan', employes: 45, salaires: 25000000 },
    { month: 'Fév', employes: 48, salaires: 26500000 },
    { month: 'Mar', employes: 52, salaires: 28000000 },
    { month: 'Avr', employes: 50, salaires: 27500000 },
    { month: 'Mai', employes: 55, salaires: 29000000 },
    { month: 'Jun', employes: 58, salaires: 30500000 },
  ];

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
    subtitle?: string;
  }> = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="card">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <button
          onClick={loadDashboardData}
          className="btn-primary"
        >
          Actualiser
        </button>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Employés"
          value={stats.totalEmployes}
          icon={Users}
          color="bg-blue-500"
          subtitle={`${stats.employesActifs} actifs`}
        />
        <StatCard
          title="Cycles de Paie"
          value={stats.totalCycles}
          icon={Calendar}
          color="bg-green-500"
          subtitle={`${stats.cyclesActifs} actifs`}
        />
        <StatCard
          title="Bulletins"
          value={stats.totalBulletins}
          icon={FileText}
          color="bg-purple-500"
          subtitle={`${stats.bulletinsPayes} payés`}
        />
        <StatCard
          title="Montant Total"
          value={`${(stats.montantTotalAPayer / 1000000).toFixed(1)}M FCFA`}
          icon={DollarSign}
          color="bg-yellow-500"
          subtitle={`${((stats.montantTotalPaye / stats.montantTotalAPayer) * 100).toFixed(1)}% payé`}
        />
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* État des employés */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition des Employés</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={employeStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {employeStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* État des cycles */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cycles de Paie</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cycleStatusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* État des paiements */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Statut des Paiements</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paiementData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {paiementData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Évolution mensuelle */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution Mensuelle</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="employes" fill="#3B82F6" name="Employés" />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="salaires"
                stroke="#10B981"
                strokeWidth={3}
                name="Salaires (FCFA)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alertes et notifications */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertes et Notifications</h3>
        <div className="space-y-3">
          {stats.totalBulletins > 0 && stats.bulletinsPayes < stats.totalBulletins && (
            <div className="flex items-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  {stats.totalBulletins - stats.bulletinsPayes} bulletins en attente de paiement
                </p>
                <p className="text-xs text-yellow-700">
                  Montant restant: {((stats.montantTotalAPayer - stats.montantTotalPaye) / 1000000).toFixed(1)}M FCFA
                </p>
              </div>
            </div>
          )}

          {stats.cyclesActifs > 0 && (
            <div className="flex items-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-blue-800">
                  {stats.cyclesActifs} cycles de paie actifs
                </p>
                <p className="text-xs text-blue-700">
                  N'oubliez pas de générer les bulletins et effectuer les paiements
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;