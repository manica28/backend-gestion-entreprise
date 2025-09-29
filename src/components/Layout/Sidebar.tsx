import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  Settings,
  LogOut,
  Building
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      path: '/employes',
      label: 'Employés',
      icon: Users,
    },
    {
      path: '/cycles',
      label: 'Cycles de Paie',
      icon: FileText,
    },
    {
      path: '/bulletins',
      label: 'Bulletins',
      icon: CreditCard,
    },
    {
      path: '/entreprise',
      label: 'Entreprise',
      icon: Building,
      adminOnly: true,
    },
    {
      path: '/parametres',
      label: 'Paramètres',
      icon: Settings,
    },
  ];

  const filteredMenuItems = menuItems.filter(item => {
    if (item.adminOnly && user?.role !== 'ADMIN' && user?.role !== 'SUPER_ADMIN') {
      return false;
    }
    return true;
  });

  return (
    <div className="bg-white h-full w-64 shadow-lg">
      <div className="flex flex-col h-full">
        {/* Logo et titre */}
        <div className="flex items-center justify-center h-16 px-4 bg-primary-600">
          <h1 className="text-white text-xl font-bold">Gestion Paie</h1>
        </div>

        {/* Informations utilisateur */}
        <div className="px-4 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.prenom?.[0]}{user?.nom?.[0]}
                </span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {user?.prenom} {user?.nom}
              </p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
          </div>
          {user?.entreprise && (
            <p className="text-xs text-gray-600 mt-1">
              {user.entreprise.nom}
            </p>
          )}
        </div>

        {/* Menu de navigation */}
        <nav className="flex-1 px-4 py-4 space-y-2">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bouton de déconnexion */}
        <div className="px-4 py-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="sidebar-link w-full text-left text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;