import React from 'react';
import { DollarSign, TrendingUp, AlertCircle, CreditCard, Smartphone, Building } from 'lucide-react';

const FinanceManagement: React.FC = () => {
  const paymentMethods = [
    { name: 'Espèces', amount: '1,250,000', percentage: 45, color: 'green', icon: DollarSign },
    { name: 'Mobile Money', amount: '980,000', percentage: 35, color: 'blue', icon: Smartphone },
    { name: 'Virement Bancaire', amount: '560,000', percentage: 20, color: 'purple', icon: Building }
  ];

  const recentPayments = [
    {
      student: 'Kofi Mensah',
      class: 'CM2A',
      amount: '45,000',
      method: 'Mobile Money',
      date: 'Aujourd\'hui 14:30',
      status: 'Confirmé'
    },
    {
      student: 'Fatima Diallo', 
      class: 'CE1B',
      amount: '40,000',
      method: 'Espèces',
      date: 'Aujourd\'hui 11:15',
      status: 'Confirmé'
    },
    {
      student: 'Amadou Kone',
      class: 'CP2',
      amount: '35,000', 
      method: 'Virement',
      date: 'Hier 16:45',
      status: 'En attente'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion Financière</h1>
          <p className="text-gray-600">Suivi des paiements, frais scolaires et statistiques financières</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            Générer Rapport
          </button>
          
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
            <DollarSign className="h-4 w-4" />
            <span>Nouveau Paiement</span>
          </button>
        </div>
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenus ce Mois</p>
              <p className="text-2xl font-bold text-gray-800">2,450,000 <span className="text-sm text-gray-500">FCFA</span></p>
            </div>
            <div className="p-3 bg-green-50 rounded-xl">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600 font-medium">+8.5%</span>
            <span className="text-sm text-gray-500 ml-1">vs mois dernier</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Paiements en Attente</p>
              <p className="text-2xl font-bold text-gray-800">183</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-xl">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-yellow-600 font-medium">892,000 FCFA</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Taux de Collecte</p>
              <p className="text-2xl font-bold text-gray-800">89%</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '89%' }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Bourses Accordées</p>
              <p className="text-2xl font-bold text-gray-800">24</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl">
              <span className="text-2xl">🎓</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-purple-600 font-medium">320,000 FCFA</span>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Répartition par Méthode de Paiement</h2>
          
          <div className="space-y-4">
            {paymentMethods.map((method, index) => {
              const Icon = method.icon;
              const colorClasses = {
                green: 'bg-green-50 text-green-600',
                blue: 'bg-blue-50 text-blue-600', 
                purple: 'bg-purple-50 text-purple-600'
              };
              
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${colorClasses[method.color as keyof typeof colorClasses]}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-gray-800">{method.name}</span>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">{method.amount} FCFA</p>
                    <p className="text-sm text-gray-500">{method.percentage}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Paiements Récents</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Voir tout
            </button>
          </div>
          
          <div className="space-y-4">
            {recentPayments.map((payment, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{payment.student}</p>
                  <p className="text-sm text-gray-500">{payment.class} • {payment.method}</p>
                  <p className="text-xs text-gray-400">{payment.date}</p>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold text-gray-800">{payment.amount} FCFA</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    payment.status === 'Confirmé' 
                      ? 'bg-green-50 text-green-700'
                      : 'bg-yellow-50 text-yellow-700'
                  }`}>
                    {payment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Outstanding Payments */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Paiements en Retard</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Élève</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Classe</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant Dû</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Échéance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Retard</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 text-sm font-medium">AD</span>
                    </div>
                    <span className="font-medium text-gray-800">Aminata Doumbia</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm">CE2A</span>
                </td>
                <td className="px-6 py-4 font-semibold text-gray-800">45,000 FCFA</td>
                <td className="px-6 py-4 text-gray-600">15 Sept 2024</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-red-50 text-red-700 rounded text-sm">21 jours</span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Relancer
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FinanceManagement;