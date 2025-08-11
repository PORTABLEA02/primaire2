import React, { useState } from 'react';
import { X, AlertCircle, DollarSign, Phone, Mail, Search, Download, Plus, Users, TrendingDown } from 'lucide-react';

interface OutstandingPaymentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  outstandingPayments: Array<{
    id: string;
    first_name: string;
    last_name: string;
    outstanding_amount: number;
    total_fees: number;
    paid_amount?: number;
    classes?: {
      name: string;
      levels?: {
        name: string;
      };
    };
  }>;
  onPaymentAdded: () => void;
}

const OutstandingPaymentsModal: React.FC<OutstandingPaymentsModalProps> = ({
  isOpen,
  onClose,
  outstandingPayments,
  onPaymentAdded
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [amountFilter, setAmountFilter] = useState('all');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const filteredPayments = outstandingPayments.filter(student => {
    const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'all' || student.classes?.levels?.name === levelFilter;
    
    let matchesAmount = true;
    if (amountFilter === 'low') {
      matchesAmount = student.outstanding_amount < 100000;
    } else if (amountFilter === 'medium') {
      matchesAmount = student.outstanding_amount >= 100000 && student.outstanding_amount < 300000;
    } else if (amountFilter === 'high') {
      matchesAmount = student.outstanding_amount >= 300000;
    }
    
    return matchesSearch && matchesLevel && matchesAmount;
  });

  const totalOutstanding = filteredPayments.reduce((sum, student) => sum + student.outstanding_amount, 0);
  const averageOutstanding = filteredPayments.length > 0 ? totalOutstanding / filteredPayments.length : 0;

  // Grouper par niveau
  const outstandingByLevel = filteredPayments.reduce((acc, student) => {
    const level = student.classes?.levels?.name || 'Non défini';
    if (!acc[level]) {
      acc[level] = {
        students: 0,
        amount: 0
      };
    }
    acc[level].students += 1;
    acc[level].amount += student.outstanding_amount;
    return acc;
  }, {} as Record<string, { students: number; amount: number }>);

  const levels = [...new Set(outstandingPayments.map(s => s.classes?.levels?.name).filter(Boolean))];

  const handleStudentToggle = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const selectAllStudents = () => {
    setSelectedStudents(filteredPayments.map(s => s.id));
  };

  const deselectAllStudents = () => {
    setSelectedStudents([]);
  };

  const sendReminders = () => {
    if (selectedStudents.length === 0) {
      alert('Veuillez sélectionner au moins un élève');
      return;
    }
    
    alert(`Envoi de rappels à ${selectedStudents.length} famille(s) en cours...`);
    setSelectedStudents([]);
  };

  const exportOutstanding = () => {
    const csvHeaders = [
      'Élève', 'Classe', 'Niveau', 'Montant dû', 'Total frais', 'Montant payé', 'Pourcentage payé'
    ];

    const csvData = filteredPayments.map(student => [
      `${student.first_name} ${student.last_name}`,
      student.classes?.name || '',
      student.classes?.levels?.name || '',
      student.outstanding_amount.toLocaleString(),
      student.total_fees.toLocaleString(),
      (student.paid_amount || 0).toLocaleString(),
      `${Math.round(((student.paid_amount || 0) / student.total_fees) * 100)}%`
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `impayes_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Paiements en Retard</h2>
                <p className="text-gray-600">
                  {filteredPayments.length} élève(s) avec des impayés
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600">Total Impayés</p>
                  <p className="text-xl font-bold text-red-800">
                    {totalOutstanding.toLocaleString()} FCFA
                  </p>
                </div>
                <TrendingDown className="h-5 w-5 text-red-600" />
              </div>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600">Élèves Concernés</p>
                  <p className="text-xl font-bold text-orange-800">{filteredPayments.length}</p>
                </div>
                <Users className="h-5 w-5 text-orange-600" />
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-600">Moyenne par Élève</p>
                  <p className="text-xl font-bold text-yellow-800">
                    {averageOutstanding.toLocaleString()} FCFA
                  </p>
                </div>
                <DollarSign className="h-5 w-5 text-yellow-600" />
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600">Sélectionnés</p>
                  <p className="text-xl font-bold text-blue-800">{selectedStudents.length}</p>
                </div>
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Répartition par niveau */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-4">Répartition par Niveau</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(outstandingByLevel).map(([level, data]) => (
                <div key={level} className="p-3 bg-white rounded border">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-800">{level}</span>
                    <span className="text-sm text-gray-600">{data.students} élèves</span>
                  </div>
                  <p className="text-lg font-bold text-red-600 mt-1">
                    {data.amount.toLocaleString()} FCFA
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Filtres et recherche */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom d'élève..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            
            <select 
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">Tous les niveaux</option>
              {levels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
            
            <select 
              value={amountFilter}
              onChange={(e) => setAmountFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">Tous les montants</option>
              <option value="low">Moins de 100,000 FCFA</option>
              <option value="medium">100,000 - 300,000 FCFA</option>
              <option value="high">Plus de 300,000 FCFA</option>
            </select>

            <button 
              onClick={exportOutstanding}
              className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Exporter</span>
            </button>
          </div>

          {/* Actions de groupe */}
          <div className="flex items-center justify-between mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedStudents.length === filteredPayments.length && filteredPayments.length > 0}
                  onChange={() => {
                    if (selectedStudents.length === filteredPayments.length) {
                      deselectAllStudents();
                    } else {
                      selectAllStudents();
                    }
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-blue-800">
                  Sélectionner tout ({filteredPayments.length})
                </span>
              </div>
              
              {selectedStudents.length > 0 && (
                <span className="text-sm text-blue-700">
                  {selectedStudents.length} élève(s) sélectionné(s)
                </span>
              )}
            </div>
            
            {selectedStudents.length > 0 && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={sendReminders}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Mail className="h-4 w-4" />
                  <span>Envoyer Rappels</span>
                </button>
                
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>Appeler</span>
                </button>
              </div>
            )}
          </div>

          {/* Table des impayés */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      <input
                        type="checkbox"
                        checked={selectedStudents.length === filteredPayments.length && filteredPayments.length > 0}
                        onChange={() => {
                          if (selectedStudents.length === filteredPayments.length) {
                            deselectAllStudents();
                          } else {
                            selectAllStudents();
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Élève</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Classe</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant Dû</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progression</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priorité</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredPayments.map((student) => {
                    const paymentProgress = ((student.paid_amount || 0) / student.total_fees) * 100;
                    const isSelected = selectedStudents.includes(student.id);
                    
                    // Déterminer la priorité selon le montant dû
                    let priority = 'Faible';
                    let priorityColor = 'bg-green-100 text-green-700';
                    
                    if (student.outstanding_amount >= 300000) {
                      priority = 'Élevée';
                      priorityColor = 'bg-red-100 text-red-700';
                    } else if (student.outstanding_amount >= 150000) {
                      priority = 'Moyenne';
                      priorityColor = 'bg-yellow-100 text-yellow-700';
                    }
                    
                    return (
                      <tr key={student.id} className={`hover:bg-gray-50 transition-colors ${isSelected ? 'bg-blue-50' : ''}`}>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleStudentToggle(student.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                              <span className="text-red-600 font-medium">
                                {student.first_name[0]}{student.last_name[0]}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">
                                {student.first_name} {student.last_name}
                              </p>
                              <p className="text-sm text-gray-500">ID: {student.id.substring(0, 8)}</p>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div>
                            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                              {student.classes?.name || 'Non assigné'}
                            </span>
                            <p className="text-xs text-gray-500 mt-1">
                              {student.classes?.levels?.name || 'Niveau non défini'}
                            </p>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-lg font-bold text-red-600">
                              {student.outstanding_amount.toLocaleString()} FCFA
                            </p>
                            <p className="text-sm text-gray-500">
                              sur {student.total_fees.toLocaleString()} FCFA
                            </p>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Payé:</span>
                              <span className="font-medium">{Math.round(paymentProgress)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  paymentProgress >= 75 ? 'bg-green-500' :
                                  paymentProgress >= 50 ? 'bg-yellow-500' :
                                  paymentProgress >= 25 ? 'bg-orange-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${paymentProgress}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-500">
                              {(student.paid_amount || 0).toLocaleString()} FCFA payés
                            </p>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${priorityColor}`}>
                            {priority}
                          </span>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button 
                              className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
                              title="Enregistrer paiement"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                            <button 
                              className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                              title="Contacter parent"
                            >
                              <Phone className="h-4 w-4" />
                            </button>
                            <button 
                              className="p-1 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded transition-colors"
                              title="Envoyer email"
                            >
                              <Mail className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredPayments.length === 0 && (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">
                  {searchTerm ? 'Aucun impayé trouvé pour cette recherche' : 'Aucun paiement en retard'}
                </p>
                {!searchTerm && (
                  <p className="text-sm text-green-600">Félicitations ! Tous les paiements sont à jour.</p>
                )}
              </div>
            )}
          </div>

          {/* Actions rapides */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-800">Rappel Email Groupé</p>
                  <p className="text-sm text-gray-600">Envoyer à tous les parents</p>
                </div>
              </div>
            </button>

            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-gray-800">Campagne SMS</p>
                  <p className="text-sm text-gray-600">Rappels par SMS</p>
                </div>
              </div>
            </button>

            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-medium text-gray-800">Rapport Détaillé</p>
                  <p className="text-sm text-gray-600">Analyse des impayés</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {selectedStudents.length > 0 && (
                <span>{selectedStudents.length} élève(s) sélectionné(s)</span>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              {selectedStudents.length > 0 && (
                <button
                  onClick={sendReminders}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Mail className="h-4 w-4" />
                  <span>Envoyer Rappels ({selectedStudents.length})</span>
                </button>
              )}
              
              <button
                onClick={onClose}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutstandingPaymentsModal;