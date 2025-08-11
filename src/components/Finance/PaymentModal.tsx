import React, { useState } from 'react';
import { X, DollarSign, User, Calendar, CreditCard, Smartphone, Building, Search, AlertCircle, CheckCircle } from 'lucide-react';
import { studentService } from '../../services/studentService';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPayment: (paymentData: PaymentData) => void;
}

interface StudentForPayment {
  id: string;
  first_name: string;
  last_name: string;
  classes?: {
    name: string;
    levels?: {
      name: string;
    };
  };
  outstanding_amount: number;
  total_fees: number;
  paid_amount?: number;
  father_phone?: string;
  mother_phone?: string;
  parent_email: string;
}

interface PaymentData {
  studentId: string;
  studentName: string;
  studentClass: string;
  amount: number;
  method: 'Espèces' | 'Mobile Money' | 'Virement Bancaire';
  type: 'Inscription' | 'Mensualité' | 'Cantine' | 'Transport' | 'Fournitures' | 'Autre';
  month?: string;
  reference?: string;
  mobileNumber?: string;
  bankDetails?: string;
  notes?: string;
  date: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onAddPayment }) => {
  const [step, setStep] = useState<'student' | 'payment' | 'confirmation'>('student');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentForPayment | null>(null);
  const [students, setStudents] = useState<StudentForPayment[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [paymentData, setPaymentData] = useState<Partial<PaymentData>>({
    amount: 0,
    method: 'Espèces',
    type: 'Mensualité',
    date: new Date().toISOString().split('T')[0]
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Charger les élèves depuis Supabase
  React.useEffect(() => {
    if (isOpen) {
      loadStudents();
    }
  }, [isOpen]);

  const loadStudents = async () => {
    try {
      setLoadingStudents(true);
      const studentsData = await studentService.getStudents();
      setStudents(studentsData || []);
    } catch (error) {
      console.error('Erreur lors du chargement des élèves:', error);
      setStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };

  const paymentTypes = [
    { value: 'Inscription', label: 'Frais d\'inscription', amount: 50000 },
    { value: 'Scolarité', label: 'Paiement de scolarité (tranche)', amount: 0 },
    { value: 'Cantine', label: 'Frais de cantine', amount: 25000 },
    { value: 'Transport', label: 'Frais de transport', amount: 15000 },
    { value: 'Fournitures', label: 'Fournitures scolaires', amount: 20000 },
    { value: 'Autre', label: 'Autre paiement', amount: 0 }
  ];

  // Frais de scolarité annuels par niveau
  const scolariteAnnuelle = {
    'Maternelle': 300000,
    'CI': 350000,
    'CP': 350000,
    'CE1': 400000,
    'CE2': 400000,
    'CM1': 450000,
    'CM2': 450000
  };

  const filteredStudents = students.filter(student =>
    `${student.first_name} ${student.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.classes?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const validatePayment = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedStudent) {
      newErrors.student = 'Veuillez sélectionner un élève';
    }

    if (!paymentData.amount || paymentData.amount <= 0) {
      newErrors.amount = 'Le montant doit être supérieur à 0';
    }

    if (paymentData.method === 'Mobile Money' && !paymentData.mobileNumber) {
      newErrors.mobileNumber = 'Numéro de téléphone requis pour Mobile Money';
    }

    if (paymentData.method === 'Virement Bancaire' && !paymentData.bankDetails) {
      newErrors.bankDetails = 'Détails bancaires requis pour le virement';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStudentSelect = (student: StudentForPayment) => {
    setSelectedStudent(student);
    setPaymentData(prev => ({
      ...prev,
      studentId: student.id,
      studentName: `${student.first_name} ${student.last_name}`,
      studentClass: student.classes?.name || 'Non assigné'
    }));
    setStep('payment');
  };

  const handlePaymentTypeChange = (type: string) => {
    const paymentType = paymentTypes.find(pt => pt.value === type);
    if (type === 'Scolarité') {
      // Pour la scolarité, on ne prédéfinit pas le montant
      setPaymentData(prev => ({
        ...prev,
        type: type as PaymentData['type'],
        amount: 0
      }));
    } else {
      setPaymentData(prev => ({
        ...prev,
        type: type as PaymentData['type'],
        amount: paymentType?.amount || 0
      }));
    }
  };

  const handleSubmit = () => {
    if (validatePayment() && selectedStudent) {
      const completePaymentData: PaymentData = {
        studentId: selectedStudent.id,
        studentName: `${selectedStudent.first_name} ${selectedStudent.last_name}`,
        studentClass: selectedStudent.classes?.name || 'Non assigné',
        amount: paymentData.amount!,
        method: paymentData.method!,
        type: paymentData.type!,
        date: paymentData.date!,
        month: paymentData.month,
        reference: paymentData.reference,
        mobileNumber: paymentData.mobileNumber,
        bankDetails: paymentData.bankDetails,
        notes: paymentData.notes
      };

      onAddPayment(completePaymentData);
      handleClose();
    }
  };

  const handleClose = () => {
    setStep('student');
    setSelectedStudent(null);
    setPaymentData({
      amount: 0,
      method: 'Espèces',
      type: 'Mensualité',
      date: new Date().toISOString().split('T')[0]
    });
    setSearchTerm('');
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Nouveau Paiement</h2>
                <p className="text-gray-600">
                  {step === 'student' && 'Sélectionner un élève'}
                  {step === 'payment' && 'Détails du paiement'}
                  {step === 'confirmation' && 'Confirmation'}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center mt-6 space-x-4">
            <div className={`flex items-center space-x-2 ${step === 'student' ? 'text-blue-600' : step === 'payment' || step === 'confirmation' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === 'student' ? 'bg-blue-100' : step === 'payment' || step === 'confirmation' ? 'bg-green-100' : 'bg-gray-100'}`}>
                1
              </div>
              <span className="text-sm font-medium">Élève</span>
            </div>
            <div className="flex-1 h-px bg-gray-200"></div>
            <div className={`flex items-center space-x-2 ${step === 'payment' ? 'text-blue-600' : step === 'confirmation' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === 'payment' ? 'bg-blue-100' : step === 'confirmation' ? 'bg-green-100' : 'bg-gray-100'}`}>
                2
              </div>
              <span className="text-sm font-medium">Paiement</span>
            </div>
            <div className="flex-1 h-px bg-gray-200"></div>
            <div className={`flex items-center space-x-2 ${step === 'confirmation' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === 'confirmation' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                3
              </div>
              <span className="text-sm font-medium">Confirmation</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Student Selection */}
          {step === 'student' && (
            <div className="space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un élève par nom ou classe..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {loadingStudents ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">Chargement des élèves...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto">
                  {filteredStudents.map((student) => (
                    <div
                      key={student.id}
                      onClick={() => handleStudentSelect(student)}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-800">
                              {student.first_name} {student.last_name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {student.classes?.name || 'Non assigné'} • {student.classes?.levels?.name || 'Niveau non défini'}
                            </p>
                            {(student.father_phone || student.mother_phone) && (
                              <p className="text-xs text-gray-500">
                                📱 {student.father_phone || student.mother_phone}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          {(student.outstanding_amount || 0) > 0 ? (
                            <div>
                              <p className="text-lg font-bold text-red-600">
                                {(student.outstanding_amount || 0).toLocaleString()} FCFA
                              </p>
                              <p className="text-xs text-red-500">Montant dû</p>
                            </div>
                          ) : (
                            <div>
                              <p className="text-lg font-bold text-green-600">À jour</p>
                              <p className="text-xs text-green-500">Aucun impayé</p>
                            </div>
                          )}
                          <div className="mt-1">
                            <div className="w-16 bg-gray-200 rounded-full h-1">
                              <div 
                                className="bg-green-600 h-1 rounded-full"
                                style={{ 
                                  width: `${Math.min(((student.paid_amount || 0) / student.total_fees) * 100, 100)}%` 
                                }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                              {Math.round(((student.paid_amount || 0) / student.total_fees) * 100)}% payé
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {filteredStudents.length === 0 && !loadingStudents && (
                    <div className="text-center py-8">
                      <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">
                        {searchTerm ? 'Aucun élève trouvé pour cette recherche' : 'Aucun élève disponible'}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Payment Details */}
          {step === 'payment' && selectedStudent && (
            <div className="space-y-6">
              {/* Selected Student Info */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-blue-800">{selectedStudent.first_name} {selectedStudent.last_name}</h3>
                    <p className="text-sm text-blue-600">{selectedStudent.classes?.name || 'Non assigné'} • {selectedStudent.classes?.levels?.name || 'Non défini'}</p>
                  </div>
                  <button
                    onClick={() => setStep('student')}
                    className="ml-auto text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Changer
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Payment Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de Paiement *
                  </label>
                  <select
                    value={paymentData.type}
                    onChange={(e) => handlePaymentTypeChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {paymentTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label} {type.amount > 0 && `(${type.amount.toLocaleString()} FCFA)`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Montant (FCFA) *
                  </label>
                  <input
                    type="number"
                    value={paymentData.amount}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, amount: parseInt(e.target.value) || 0 }))}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.amount ? 'border-red-300' : 'border-gray-200'
                    }`}
                  />
                  {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
                </div>

                {/* Month (for Mensualité) */}
                {paymentData.type === 'Scolarité' && (
                  <div className="md:col-span-2">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mb-4">
                      <h4 className="font-medium text-blue-800 mb-3">Information Scolarité</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Classe actuelle:</p>
                          <p className="font-medium">{selectedStudent.classes?.name || 'Non assigné'}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Niveau:</p>
                          <p className="font-medium">{selectedStudent.classes?.levels?.name || 'Non défini'}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Frais annuels:</p>
                          <p className="font-medium">{selectedStudent.total_fees.toLocaleString()} FCFA</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Déjà payé:</p>
                          <p className="font-medium">{(selectedStudent.paid_amount || 0).toLocaleString()} FCFA</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Reste à payer:</p>
                          <p className="font-medium">{(selectedStudent.outstanding_amount || 0).toLocaleString()} FCFA</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description de la tranche (optionnel)
                      </label>
                      <input
                        type="text"
                        value={paymentData.month || ''}
                        onChange={(e) => setPaymentData(prev => ({ ...prev, month: e.target.value }))}
                        placeholder="Ex: 1ère tranche, Paiement partiel octobre..."
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}

                {/* Payment Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de Paiement *
                  </label>
                  <input
                    type="date"
                    value={paymentData.date}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Méthode de Paiement *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { value: 'Espèces', label: 'Espèces', icon: DollarSign, color: 'green' },
                    { value: 'Mobile Money', label: 'Mobile Money', icon: Smartphone, color: 'blue' },
                    { value: 'Virement Bancaire', label: 'Virement Bancaire', icon: Building, color: 'purple' }
                  ].map(method => {
                    const Icon = method.icon;
                    const isSelected = paymentData.method === method.value;
                    
                    return (
                      <div
                        key={method.value}
                        onClick={() => setPaymentData(prev => ({ ...prev, method: method.value as PaymentData['method'] }))}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          isSelected 
                            ? `border-${method.color}-500 bg-${method.color}-50` 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className={`h-5 w-5 ${isSelected ? `text-${method.color}-600` : 'text-gray-400'}`} />
                          <span className={`font-medium ${isSelected ? `text-${method.color}-800` : 'text-gray-700'}`}>
                            {method.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Additional Fields based on Payment Method */}
              {paymentData.method === 'Mobile Money' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro de Téléphone *
                  </label>
                  <input
                    type="tel"
                    value={paymentData.mobileNumber || ''}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, mobileNumber: e.target.value }))}
                    placeholder="+223 XX XX XX XX"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.mobileNumber ? 'border-red-300' : 'border-gray-200'
                    }`}
                  />
                  {errors.mobileNumber && <p className="text-red-500 text-sm mt-1">{errors.mobileNumber}</p>}
                </div>
              )}

              {paymentData.method === 'Virement Bancaire' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Référence Bancaire *
                  </label>
                  <input
                    type="text"
                    value={paymentData.bankDetails || ''}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, bankDetails: e.target.value }))}
                    placeholder="Numéro de référence ou RIB"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.bankDetails ? 'border-red-300' : 'border-gray-200'
                    }`}
                  />
                  {errors.bankDetails && <p className="text-red-500 text-sm mt-1">{errors.bankDetails}</p>}
                </div>
              )}

              {/* Reference Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro de Référence (Optionnel)
                </label>
                <input
                  type="text"
                  value={paymentData.reference || ''}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, reference: e.target.value }))}
                  placeholder="Référence interne ou reçu"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optionnel)
                </label>
                <textarea
                  value={paymentData.notes || ''}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Commentaires ou informations supplémentaires..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 'confirmation' && selectedStudent && (
            <div className="space-y-6">
              <div className="text-center">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Paiement Enregistré</h3>
                <p className="text-gray-600">Le paiement a été enregistré avec succès</p>
              </div>

              <div className="p-6 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-4">Récapitulatif du Paiement</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Élève:</span>
                    <span className="font-medium">
                      {selectedStudent.first_name} {selectedStudent.last_name} ({selectedStudent.classes?.name})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium">{paymentData.type}</span>
                  </div>
                  {paymentData.month && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mois:</span>
                      <span className="font-medium">{paymentData.month}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Montant:</span>
                    <span className="font-bold text-green-600">{paymentData.amount?.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Méthode:</span>
                    <span className="font-medium">{paymentData.method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{new Date(paymentData.date!).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              {step === 'payment' && (
                <button
                  onClick={() => setStep('student')}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Retour
                </button>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleClose}
                className="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {step === 'confirmation' ? 'Fermer' : 'Annuler'}
              </button>
              
              {step === 'payment' && (
                <button
                  onClick={() => {
                    if (validatePayment()) {
                      setStep('confirmation');
                      handleSubmit();
                    }
                  }}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <DollarSign className="h-4 w-4" />
                  <span>Enregistrer Paiement</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;