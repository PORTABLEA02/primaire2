import React from 'react';
import { Plus, UserPlus, FileText, Calendar } from 'lucide-react';

const quickActions = [
  {
    title: 'Nouvel Élève',
    description: 'Inscrire un nouvel élève',
    icon: UserPlus,
    color: 'blue'
  },
  {
    title: 'Nouveau Paiement',
    description: 'Enregistrer un paiement',
    icon: Plus,
    color: 'green'
  },
  {
    title: 'Générer Bulletin',
    description: 'Créer des bulletins scolaires',
    icon: FileText,
    color: 'purple'
  },
  {
    title: 'Emploi du Temps',
    description: 'Gérer les horaires',
    icon: Calendar,
    color: 'orange'
  }
];

const QuickActions: React.FC = () => {
  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
      green: 'bg-green-50 text-green-600 hover:bg-green-100',
      purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
      orange: 'bg-orange-50 text-orange-600 hover:bg-orange-100'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Actions Rapides</h2>
      
      <div className="space-y-3">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          
          return (
            <button
              key={index}
              className={`w-full p-4 rounded-lg transition-colors text-left ${getColorClasses(action.color)}`}
            >
              <div className="flex items-center space-x-3">
                <Icon className="h-5 w-5" />
                <div>
                  <p className="font-medium">{action.title}</p>
                  <p className="text-sm opacity-75">{action.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100">
        <button className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
          Voir toutes les actions
        </button>
      </div>
    </div>
  );
};

export default QuickActions;