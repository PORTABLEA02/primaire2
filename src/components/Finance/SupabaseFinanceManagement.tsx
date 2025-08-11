import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  AlertCircle, 
  CreditCard, 
  Smartphone, 
  Building,
  Plus,
  Download,
  RefreshCw,
  Loader,
  CheckCircle,
  Clock,
  Users,
  FileText,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { paymentService } from '../../services/paymentService';
import { studentService } from '../../services/studentService';
import PaymentModal from './PaymentModal';
import PaymentDetailModal from './PaymentDetailModal';
import OutstandingPaymentsModal from './OutstandingPaymentsModal';
import FinancialReportsModal from '../Settings/FinancialReportsModal';
import type { Payment, Student } from '../../lib/supabase';

interface PaymentWithStudent extends Payment {
  students?: {
    id: string;
    first_name: string;
    last_name: string;
    classes?: {
      name: string;
      levels?: {
        name: string;
      };
    };
  };
}

interface FinancialStats {
  totalRevenue: number;
  monthlyRevenue: number;
  outstandingAmount: number;
  collectionRate: number;
  totalPayments: number;
  paymentMethods: Record<string, number>;
  paymentTypes: Record<string, number>;
}

const SupabaseFinanceManagement: React.FC = () => {
  const [payments, setPayments] = useState<PaymentWithStudent[]>([]);
  const [outstandingPayments, setOutstandingPayments] = useState<any[]>([]);
  const [stats, setStats] = useState<FinancialStats>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    outstandingAmount: 0,
    collectionRate: 0,
    totalPayments: 0,
    paymentMethods: {},
    paymentTypes: {}
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState<PaymentWithStudent | null>(null);

  // Modals state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showOutstandingModal, setShowOutstandingModal] = useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [paymentsData, outstandingData, statsData] = await Promise.all([
        paymentService.getPayments(50), // Limiter à 50 paiements récents
        paymentService.getOutstandingPayments(),
        paymentService.getFinancialStats('month')
      ]);
      
      setPayments(paymentsData || []);
      setOutstandingPayments(outstandingData || []);
      
      // Calculer les statistiques
      const totalOutstanding = outstandingData?.reduce((sum, student) => sum + (student.outstanding_amount || 0), 0) || 0;
      const totalStudents = outstandingData?.length || 0;
      const studentsUpToDate = outstandingData?.filter(s => (s.outstanding_amount || 0) === 0).length || 0;
      
      setStats({
        totalRevenue: statsData?.totalRevenue || 0,
        monthlyRevenue: statsData?.totalRevenue || 0,
        outstandingAmount: totalOutstanding,
        collectionRate: totalStudents > 0 ? (studentsUpToDate / totalStudents) * 100 : 0,
        totalPayments: statsData?.transactionCount || 0,
        paymentMethods: statsData?.paymentMethods || {},
        paymentTypes: statsData?.paymentTypes || {}
      });
    } catch (error) {
      console.error('Erreur lors du chargement des données financières:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setRefreshing(true);
      await loadData();
    } catch (error) {
      console.error('Erreur lors du rafraîchissement:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleAddPayment = async (paymentData: any) => {
    try {
      await paymentService.createPayment({
        studentId: paymentData.studentId,
        amount: paymentData.amount,
        paymentMethod: paymentData.method,
        paymentType: paymentData.type,
        paymentDate: paymentData.date,
        periodDescription: paymentData.month,
        referenceNumber: paymentData.reference,
        mobileNumber: paymentData.mobileNumber,
        bankDetails: paymentData.bankDetails,
        notes: paymentData.notes
      });
      
      await loadData(); // Recharger les données
      alert('Paiement enregistré avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du paiement:', error);
      alert('Erreur lors de l\'enregistrement du paiement. Veuillez réessayer.');
    }
  };

  const handleDeletePayment = async (paymentId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce paiement ? Cette action est irréversible.')) {
      try {
        await paymentService.deletePayment(paymentId);
        await loadData();
        alert('Paiement supprimé avec succès !');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression. Veuillez réessayer.');
      }
    }
  };

  const filteredPayments = payments.filter(payment => {
    const studentName = payment.students ? 
      `${payment.students.first_name} ${payment.students.last_name}`.toLowerCase() : '';
    const matchesSearch = studentName.includes(searchTerm.toLowerCase()) ||
                         (payment.reference_number || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMethod = methodFilter === 'all' || payment.payment_method === methodFilter;
    const matchesType = typeFilter === 'all' || payment.payment_type === typeFilter;
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    
    return matchesSearch && matchesMethod && matchesType && matchesStatus;
  });

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'Espèces': return DollarSign;
      case 'Mobile Money': return Smartphone;
      case 'Virement Bancaire': return Building;
      default: return CreditCard;
    }
  };

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'Espèces': return 'bg-green-50 text-green-600';
      case 'Mobile Money': return 'bg-blue-50 text-blue-600';
      case 'Virement Bancaire': return 'bg-purple-50 text-purple-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmé': return 'bg-green-50 text-green-700';
      case 'En attente': return 'bg-yellow-50 text-yellow-700';
      case 'Annulé': return 'bg-red-50 text-red-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  const exportPayments = async () => {
    try {
      const csvHeaders = [
        'Date', 'Élève', 'Classe', 'Type', 'Montant', 'Méthode', 'Référence', 'Statut'
      ];

      const csvData = filteredPayments.map(payment => [
        new Date(payment.payment_date).toLocaleDateString('fr-FR'),
        payment.students ? `${payment.students.first_name} ${payment.students.last_name}` : '',
        payment.students?.classes?.name || '',
        payment.payment_type,
        payment.amount.toLocaleString(),
        payment.payment_method,
        payment.reference_number || '',
        payment.status || ''
      ]);

      const csvContent = [
        csvHeaders.join(','),
        ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `paiements_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      alert('Erreur lors de l\'export. Veuillez réessayer.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex items-center space-x-3">
          <Loader className="h-6 w-6 animate-spin text-green-600" />
          <span className="text-gray-600">Chargement des données financières depuis Supabase...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion Financière</h1>
          <p className="text-gray-600">Suivi des paiements, frais scolaires et statistiques financières - Données en temps réel</p>
          <div className="flex items-center space-x-2 mt-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-green-600">Connecté à Supabase</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={refreshData}
            disabled={refreshing}
            className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Actualiser</span>
          </button>
          
          <button 
            onClick={() => setShowReportsModal(true)}
            className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <FileText className="h-4 w-4" />
            <span>Rapports</span>
          </button>
          
          <button 
            onClick={() => setShowPaymentModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
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
              <p className="text-2xl font-bold text-gray-800">
                {stats.monthlyRevenue.toLocaleString()} <span className="text-sm text-gray-500">FCFA</span>
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-xl">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600 font-medium">{stats.totalPayments} paiements</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Impayés</p>
              <p className="text-2xl font-bold text-red-600">
                {stats.outstandingAmount.toLocaleString()} <span className="text-sm text-gray-500">FCFA</span>
              </p>
            </div>
            <div className="p-3 bg-red-50 rounded-xl">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4">
            <button 
              onClick={() => setShowOutstandingModal(true)}
              className="text-sm text-red-600 font-medium hover:text-red-800"
            >
              {outstandingPayments.length} élèves concernés
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Taux de Collecte</p>
              <p className="text-2xl font-bold text-blue-600">{stats.collectionRate.toFixed(1)}%</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${stats.collectionRate}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenus Totaux</p>
              <p className="text-2xl font-bold text-purple-600">
                {stats.totalRevenue.toLocaleString()} <span className="text-sm text-gray-500">FCFA</span>
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-purple-600 font-medium">Année scolaire</span>
          </div>
        </div>
      </div>

      {/* Payment Methods Distribution */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Répartition par Méthode de Paiement</h2>
          
          <div className="space-y-4">
            {Object.entries(stats.paymentMethods).map(([method, amount]) => {
              const Icon = getPaymentMethodIcon(method);
              const percentage = stats.totalRevenue > 0 ? (amount / stats.totalRevenue) * 100 : 0;
              
              return (
                <div key={method} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getPaymentMethodColor(method)}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-gray-800">{method}</span>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">{amount.toLocaleString()} FCFA</p>
                    <p className="text-sm text-gray-500">{percentage.toFixed(1)}%</p>
                  </div>
                </div>
              );
            })}
            
            {Object.keys(stats.paymentMethods).length === 0 && (
              <div className="text-center py-4">
                <p className="text-gray-500">Aucune donnée de paiement disponible</p>
              </div>
            )}
          </div>
        </div>

        {/* Payment Types Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Répartition par Type de Frais</h2>
          
          <div className="space-y-4">
            {Object.entries(stats.paymentTypes).map(([type, amount]) => {
              const percentage = stats.totalRevenue > 0 ? (amount / stats.totalRevenue) * 100 : 0;
              
              return (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span className="font-medium text-gray-800">{type}</span>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">{amount.toLocaleString()} FCFA</p>
                    <div className="w-20 bg-gray-200 rounded-full h-1 mt-1">
                      <div 
                        className="bg-blue-500 h-1 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {Object.keys(stats.paymentTypes).length === 0 && (
              <div className="text-center py-4">
                <p className="text-gray-500">Aucune donnée de type de paiement disponible</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom d'élève ou référence..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          <select 
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">Toutes les méthodes</option>
            <option value="Espèces">Espèces</option>
            <option value="Mobile Money">Mobile Money</option>
            <option value="Virement Bancaire">Virement Bancaire</option>
          </select>
          
          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">Tous les types</option>
            <option value="Inscription">Inscription</option>
            <option value="Scolarité">Scolarité</option>
            <option value="Cantine">Cantine</option>
            <option value="Transport">Transport</option>
            <option value="Fournitures">Fournitures</option>
            <option value="Autre">Autre</option>
          </select>

          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">Tous les statuts</option>
            <option value="Confirmé">Confirmé</option>
            <option value="En attente">En attente</option>
            <option value="Annulé">Annulé</option>
          </select>
          
          <button 
            onClick={exportPayments}
            className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Exporter</span>
          </button>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              Paiements Récents ({filteredPayments.length})
            </h2>
            <div className="text-sm text-gray-500">
              {searchTerm && `Résultats pour "${searchTerm}"`}
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Élève</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Méthode</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPayments.map((payment) => {
                const MethodIcon = getPaymentMethodIcon(payment.payment_method);
                
                return (
                  <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-800">
                          {new Date(payment.payment_date).toLocaleDateString('fr-FR')}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(payment.created_at).toLocaleTimeString('fr-FR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {payment.students ? 
                              `${payment.students.first_name} ${payment.students.last_name}` : 
                              'Élève supprimé'
                            }
                          </p>
                          <p className="text-sm text-gray-500">
                            {payment.students?.classes?.name || 'Classe non définie'}
                          </p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div>
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                          {payment.payment_type}
                        </span>
                        {payment.period_description && (
                          <p className="text-xs text-gray-500 mt-1">{payment.period_description}</p>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <p className="text-lg font-bold text-gray-800">
                        {payment.amount.toLocaleString()} FCFA
                      </p>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className={`p-1.5 rounded ${getPaymentMethodColor(payment.payment_method)}`}>
                          <MethodIcon className="h-3 w-3" />
                        </div>
                        <span className="text-sm text-gray-700">{payment.payment_method}</span>
                      </div>
                      {payment.reference_number && (
                        <p className="text-xs text-gray-500 mt-1">Réf: {payment.reference_number}</p>
                      )}
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment.status)}`}>
                        {payment.status || 'Confirmé'}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => {
                            setSelectedPayment(payment);
                            setShowDetailModal(true);
                          }}
                          className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                          title="Voir détails"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeletePayment(payment.id)}
                          className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredPayments.length === 0 && !loading && (
          <div className="text-center py-12">
            <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">
              {searchTerm ? 'Aucun paiement trouvé pour cette recherche' : 'Aucun paiement enregistré'}
            </p>
            {!searchTerm && (
              <button 
                onClick={() => setShowPaymentModal(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 mx-auto"
              >
                <Plus className="h-4 w-4" />
                <span>Enregistrer le premier paiement</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button 
          onClick={() => setShowOutstandingModal(true)}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-red-50 rounded-xl">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Paiements en Retard</h3>
              <p className="text-sm text-gray-600">Gérer les impayés</p>
              <p className="text-lg font-bold text-red-600 mt-1">
                {outstandingPayments.length} élèves
              </p>
            </div>
          </div>
        </button>

        <button 
          onClick={() => setShowReportsModal(true)}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Rapports Financiers</h3>
              <p className="text-sm text-gray-600">Analyses et statistiques</p>
              <p className="text-sm text-blue-600 mt-1 font-medium">Générer rapport</p>
            </div>
          </div>
        </button>

        <button 
          onClick={() => setShowPaymentModal(true)}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-50 rounded-xl">
              <Plus className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Nouveau Paiement</h3>
              <p className="text-sm text-gray-600">Enregistrer un paiement</p>
              <p className="text-sm text-green-600 mt-1 font-medium">Ajouter maintenant</p>
            </div>
          </div>
        </button>
      </div>

      {/* Modals */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onAddPayment={handleAddPayment}
      />

      {selectedPayment && (
        <PaymentDetailModal
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedPayment(null);
          }}
          payment={selectedPayment}
        />
      )}

      <OutstandingPaymentsModal
        isOpen={showOutstandingModal}
        onClose={() => setShowOutstandingModal(false)}
        outstandingPayments={outstandingPayments}
        onPaymentAdded={loadData}
      />

      <FinancialReportsModal
        isOpen={showReportsModal}
        onClose={() => setShowReportsModal(false)}
      />
    </div>
  );
};

export default SupabaseFinanceManagement;