import React from 'react';
import { X, DollarSign, User, Calendar, CreditCard, FileText, Phone, Mail } from 'lucide-react';
import type { Payment } from '../../lib/supabase';

interface PaymentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: Payment & {
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
  };
}

const PaymentDetailModal: React.FC<PaymentDetailModalProps> = ({
  isOpen,
  onClose,
  payment
}) => {
  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'Espèces': return DollarSign;
      case 'Mobile Money': return Phone;
      case 'Virement Bancaire': return CreditCard;
      default: return DollarSign;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmé': return 'bg-green-50 text-green-700 border-green-200';
      case 'En attente': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Annulé': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Inscription': return 'bg-blue-50 text-blue-700';
      case 'Scolarité': return 'bg-green-50 text-green-700';
      case 'Cantine': return 'bg-orange-50 text-orange-700';
      case 'Transport': return 'bg-purple-50 text-purple-700';
      case 'Fournitures': return 'bg-yellow-50 text-yellow-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  if (!isOpen) return null;

  const MethodIcon = getPaymentMethodIcon(payment.payment_method);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Détails du Paiement</h2>
                <p className="text-gray-600">
                  Paiement du {new Date(payment.payment_date).toLocaleDateString('fr-FR')}
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

        <div className="p-6 space-y-6">
          {/* Informations principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations du Paiement</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Montant:</span>
                    <span className="text-2xl font-bold text-green-600">
                      {payment.amount.toLocaleString()} FCFA
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(payment.payment_type)}`}>
                      {payment.payment_type}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Statut:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(payment.status)}`}>
                      {payment.status || 'Confirmé'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium text-gray-800">
                      {new Date(payment.payment_date).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  
                  {payment.period_description && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Période:</span>
                      <span className="font-medium text-gray-800">{payment.period_description}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations de l'Élève</h3>
                {payment.students ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {payment.students.first_name} {payment.students.last_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {payment.students.classes?.name} • {payment.students.classes?.levels?.name}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-red-50 rounded-lg">
                    <p className="text-red-700">Informations de l'élève non disponibles</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Méthode de paiement */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Méthode de Paiement</h3>
            
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <MethodIcon className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">{payment.payment_method}</p>
                <p className="text-sm text-gray-600">Mode de paiement utilisé</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {payment.reference_number && (
                <div>
                  <span className="text-gray-600">Référence:</span>
                  <p className="font-medium text-gray-800">{payment.reference_number}</p>
                </div>
              )}
              
              {payment.mobile_number && (
                <div>
                  <span className="text-gray-600">Numéro Mobile:</span>
                  <p className="font-medium text-gray-800">{payment.mobile_number}</p>
                </div>
              )}
              
              {payment.bank_details && (
                <div>
                  <span className="text-gray-600">Détails Bancaires:</span>
                  <p className="font-medium text-gray-800">{payment.bank_details}</p>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {payment.notes && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Notes</h3>
              <p className="text-blue-700">{payment.notes}</p>
            </div>
          )}

          {/* Informations système */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations Système</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">ID Paiement:</span>
                <p className="font-mono text-gray-800">{payment.id}</p>
              </div>
              
              <div>
                <span className="text-gray-600">Date d'enregistrement:</span>
                <p className="font-medium text-gray-800">
                  {new Date(payment.created_at).toLocaleString('fr-FR')}
                </p>
              </div>
              
              {payment.processed_by && (
                <div>
                  <span className="text-gray-600">Traité par:</span>
                  <p className="font-medium text-gray-800">Utilisateur système</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Paiement enregistré dans Supabase
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Imprimer Reçu</span>
              </button>
              
              <button
                onClick={onClose}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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

export default PaymentDetailModal;