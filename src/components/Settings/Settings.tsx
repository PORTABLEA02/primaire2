import React from 'react';
import { Settings as SettingsIcon, Users, Calendar, DollarSign, BookOpen, Shield, Database } from 'lucide-react';

const Settings: React.FC = () => {
  const settingsSections = [
    {
      title: 'Configuration Générale',
      icon: SettingsIcon,
      color: 'blue',
      settings: [
        'Informations de l\'école',
        'Année scolaire active', 
        'Périodes et trimestres',
        'Seuil de promotion'
      ]
    },
    {
      title: 'Gestion des Utilisateurs',
      icon: Users,
      color: 'green',
      settings: [
        'Comptes utilisateurs',
        'Rôles et permissions',
        'Sécurité des accès',
        'Historique des connexions'
      ]
    },
    {
      title: 'Configuration Académique',
      icon: BookOpen,
      color: 'purple',
      settings: [
        'Niveaux et classes',
        'Matières enseignées',
        'Emplois du temps',
        'Modèles de bulletins'
      ]
    },
    {
      title: 'Paramètres Financiers',
      icon: DollarSign,
      color: 'yellow',
      settings: [
        'Types de frais',
        'Méthodes de paiement',
        'Mobile Money',
        'Rapports financiers'
      ]
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200',
      yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Paramètres</h1>
          <p className="text-gray-600">Configuration et administration du système</p>
        </div>
      </div>

      {/* Current School Year */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Année Scolaire Active</h2>
              <p className="text-gray-600">2024-2025 • Du 1er Octobre 2024 au 30 Juin 2025</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Modifier
          </button>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {settingsSections.map((section, index) => {
          const Icon = section.icon;
          
          return (
            <div key={index} className={`bg-white p-6 rounded-xl shadow-sm border ${getColorClasses(section.color).includes('border') ? getColorClasses(section.color).split(' ')[2] : 'border-gray-100'}`}>
              <div className="flex items-center space-x-3 mb-4">
                <div className={`p-2 rounded-lg ${getColorClasses(section.color).split(' ')[0]} ${getColorClasses(section.color).split(' ')[1]}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">{section.title}</h3>
              </div>
              
              <div className="space-y-3">
                {section.settings.map((setting, settingIndex) => (
                  <div key={settingIndex} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <span className="text-gray-700">{setting}</span>
                    <span className="text-gray-400">→</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* System Information */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-gray-50 rounded-lg">
            <Database className="h-5 w-5 text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Informations Système</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 border border-gray-100 rounded-lg">
            <p className="text-2xl font-bold text-gray-800">1,247</p>
            <p className="text-sm text-gray-600">Élèves inscrits</p>
          </div>
          
          <div className="text-center p-4 border border-gray-100 rounded-lg">
            <p className="text-2xl font-bold text-gray-800">24</p>
            <p className="text-sm text-gray-600">Enseignants actifs</p>
          </div>
          
          <div className="text-center p-4 border border-gray-100 rounded-lg">
            <p className="text-2xl font-bold text-gray-800">42</p>
            <p className="text-sm text-gray-600">Classes configurées</p>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-red-50 rounded-lg">
            <Shield className="h-5 w-5 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Sécurité et Sauvegarde</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-100 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">Dernière Sauvegarde</h4>
            <p className="text-sm text-gray-600 mb-3">15 Octobre 2024 à 23:30</p>
            <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Créer une Sauvegarde
            </button>
          </div>
          
          <div className="p-4 border border-gray-100 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">Journal d'Activité</h4>
            <p className="text-sm text-gray-600 mb-3">Dernière connexion: Aujourd'hui 14:25</p>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Voir les Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;