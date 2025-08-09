import React, { useState } from 'react';
import { X, User, Users, Phone, Mail, MapPin, Calendar, DollarSign, BookOpen, AlertCircle } from 'lucide-react';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStudent: (studentData: NewStudentData) => void;
}

interface NewStudentData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  class: string;
  level: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  address: string;
  enrollmentDate: string;
  totalFees: number;
  initialPayment: number;
  paymentMethod: 'Espèces' | 'Mobile Money' | 'Virement Bancaire';
  mobileNumber?: string;
  bankDetails?: string;
  notes?: string;
}

const AddStudentModal: React.FC<AddStudentModalProps> = ({
  isOpen,
  onClose,
  onAddStudent
}) => {
  const [step, setStep] = useState<'student' | 'parent' | 'financial' | 'confirmation'>('student');
  const [formData, setFormData] = useState<NewStudentData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    class: '',
    level: '',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    address: '',
    enrollmentDate: new Date().toISOString().split('T')[0],
    totalFees: 0,
    initialPayment: 0,
    paymentMethod: 'Espèces',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Classes disponibles avec leurs frais
  const classesWithFees = [
    { name: 'Maternelle 1A', level: 'Maternelle', fees: 300000 },
    { name: 'Maternelle 1B', level: 'Maternelle', fees: 300000 },
    { name: 'Maternelle 2A', level: 'Maternelle', fees: 300000 },
    { name: 'CI A', level: 'CI', fees: 350000 },
    { name: 'CI B', level: 'CI', fees: 350000 },
    { name: 'CP1', level: 'CP', fees: 350000 },
    { name: 'CP2', level: 'CP', fees: 350000 },
    { name: 'CE1A', level: 'CE1', fees: 400000 },
    { name: 'CE1B', level: 'CE1', fees: 400000 },
    { name: 'CE2A', level: 'CE2', fees: 400000 },
    { name: 'CE2B', level: 'CE2', fees: 400000 },
    { name: 'CM1A', level: 'CM1', fees: 450000 },
    { name: 'CM1B', level: 'CM1', fees: 450000 },
    { name: 'CM2A', level: 'CM2', fees: 450000 },
    { name: 'CM2B', level: 'CM2', fees: 450000 }
  ];

  const validateStep = (currentStep: string) => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 'student') {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'Le prénom est requis';
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Le nom est requis';
      }
      if (!formData.dateOfBirth) {
        newErrors.dateOfBirth = 'La date de naissance est requise';
      }
      if (!formData.class) {
        newErrors.class = 'La classe est requise';
      }
    }

    if (currentStep === 'parent') {
      if (!formData.parentName.trim()) {
        newErrors.parentName = 'Le nom du parent/tuteur est requis';
      }
      if (!formData.parentPhone.trim()) {
        newErrors.parentPhone = 'Le téléphone est requis';
      }
      if (!formData.parentEmail.trim()) {
        newErrors.parentEmail = 'L\'email est requis';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.parentEmail)) {
        newErrors.parentEmail = 'Format d\'email invalide';
      }
      if (!formData.address.trim()) {
        newErrors.address = 'L\'adresse est requise';
      }
    }

    if (currentStep === 'financial') {
      if (formData.initialPayment < 0) {
        newErrors.initialPayment = 'Le montant ne peut pas être négatif';
      }
      if (formData.initialPayment > formData.totalFees) {
        newErrors.initialPayment = 'Le paiement initial ne peut pas dépasser les frais totaux';
      }
      if (formData.paymentMethod === 'Mobile Money' && !formData.mobileNumber) {
        newErrors.mobileNumber = 'Numéro de téléphone requis pour Mobile Money';
      }
      if (formData.paymentMethod === 'Virement Bancaire' && !formData.bankDetails) {
        newErrors.bankDetails = 'Détails bancaires requis pour le virement';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      switch (step) {
        case 'student':
          setStep('parent');
          break;
        case 'parent':
          setStep('financial');
          break;
        case 'financial':
          setStep('confirmation');
          break;
      }
    }
  };

  const handleBack = () => {
    switch (step) {
      case 'parent':
        setStep('student');
        break;
      case 'financial':
        setStep('parent');
        break;
      case 'confirmation':
        setStep('financial');
        break;
    }
  };

  const handleSubmit = () => {
    if (validateStep('financial')) {
      onAddStudent(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setStep('student');
    setFormData({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      class: '',
      level: '',
      parentName: '',
      parentPhone: '',
      parentEmail: '',
      address: '',
      enrollmentDate: new Date().toISOString().split('T')[0],
      totalFees: 0,
      initialPayment: 0,
      paymentMethod: 'Espèces',
      notes: ''
    });
    setErrors({});
    onClose();
  };

  const handleClassChange = (className: string) => {
    const selectedClass = classesWithFees.find(c => c.name === className);
    if (selectedClass) {
      setFormData(prev => ({
        ...prev,
        class: className,
        level: selectedClass.level,
        totalFees: selectedClass.fees
      }));
    }
  };

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return '';
    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return (age - 1).toString();
    }
    return age.toString();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Nouvel Élève</h2>
                <p className="text-gray-600">
                  {step === 'student' && 'Informations de l\'élève'}
                  {step === 'parent' && 'Informations du parent/tuteur'}
                  {step === 'financial' && 'Informations financières'}
                  {step === 'confirmation' && 'Confirmation d\'inscription'}
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
            <div className={`flex items-center space-x-2 ${step === 'student' ? 'text-blue-600' : ['parent', 'financial', 'confirmation'].includes(step) ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === 'student' ? 'bg-blue-100' : ['parent', 'financial', 'confirmation'].includes(step) ? 'bg-green-100' : 'bg-gray-100'}`}>
                1
              </div>
              <span className="text-sm font-medium">Élève</span>
            </div>
            <div className="flex-1 h-px bg-gray-200"></div>
            <div className={`flex items-center space-x-2 ${step === 'parent' ? 'text-blue-600' : ['financial', 'confirmation'].includes(step) ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === 'parent' ? 'bg-blue-100' : ['financial', 'confirmation'].includes(step) ? 'bg-green-100' : 'bg-gray-100'}`}>
                2
              </div>
              <span className="text-sm font-medium">Parent</span>
            </div>
            <div className="flex-1 h-px bg-gray-200"></div>
            <div className={`flex items-center space-x-2 ${step === 'financial' ? 'text-blue-600' : step === 'confirmation' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === 'financial' ? 'bg-blue-100' : step === 'confirmation' ? 'bg-green-100' : 'bg-gray-100'}`}>
                3
              </div>
              <span className="text-sm font-medium">Paiement</span>
            </div>
            <div className="flex-1 h-px bg-gray-200"></div>
            <div className={`flex items-center space-x-2 ${step === 'confirmation' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === 'confirmation' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                4
              </div>
              <span className="text-sm font-medium">Confirmation</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Student Information */}
          {step === 'student' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.firstName ? 'border-red-300' : 'border-gray-200'
                    }`}
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.lastName ? 'border-red-300' : 'border-gray-200'
                    }`}
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de Naissance *
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.dateOfBirth ? 'border-red-300' : 'border-gray-200'
                    }`}
                  />
                  {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
                  {formData.dateOfBirth && (
                    <p className="text-sm text-gray-500 mt-1">Âge: {calculateAge(formData.dateOfBirth)} ans</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date d'Inscription
                  </label>
                  <input
                    type="date"
                    value={formData.enrollmentDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, enrollmentDate: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Classe *
                </label>
                <select
                  value={formData.class}
                  onChange={(e) => handleClassChange(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.class ? 'border-red-300' : 'border-gray-200'
                  }`}
                >
                  <option value="">Sélectionner une classe</option>
                  {classesWithFees.map(cls => (
                    <option key={cls.name} value={cls.name}>
                      {cls.name} ({cls.level}) - {cls.fees.toLocaleString()} FCFA/an
                    </option>
                  ))}
                </select>
                {errors.class && <p className="text-red-500 text-sm mt-1">{errors.class}</p>}
              </div>

              {formData.class && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Informations de la Classe</h4>
                  <div className="text-sm text-blue-700 space-y-1">
                    <p><strong>Classe:</strong> {formData.class}</p>
                    <p><strong>Niveau:</strong> {formData.level}</p>
                    <p><strong>Frais annuels:</strong> {formData.totalFees.toLocaleString()} FCFA</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Parent Information */}
          {step === 'parent' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du Parent/Tuteur *
                </label>
                <input
                  type="text"
                  value={formData.parentName}
                  onChange={(e) => setFormData(prev => ({ ...prev, parentName: e.target.value }))}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.parentName ? 'border-red-300' : 'border-gray-200'
                  }`}
                />
                {errors.parentName && <p className="text-red-500 text-sm mt-1">{errors.parentName}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="h-4 w-4 inline mr-1" />
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    value={formData.parentPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, parentPhone: e.target.value }))}
                    placeholder="+223 XX XX XX XX"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.parentPhone ? 'border-red-300' : 'border-gray-200'
                    }`}
                  />
                  {errors.parentPhone && <p className="text-red-500 text-sm mt-1">{errors.parentPhone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="h-4 w-4 inline mr-1" />
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.parentEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, parentEmail: e.target.value }))}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.parentEmail ? 'border-red-300' : 'border-gray-200'
                    }`}
                  />
                  {errors.parentEmail && <p className="text-red-500 text-sm mt-1">{errors.parentEmail}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  Adresse *
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  rows={3}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.address ? 'border-red-300' : 'border-gray-200'
                  }`}
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>
            </div>
          )}

          {/* Step 3: Financial Information */}
          {step === 'financial' && (
            <div className="space-y-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Frais de Scolarité</h4>
                <div className="text-sm text-gray-700 space-y-1">
                  <p><strong>Classe:</strong> {formData.class} ({formData.level})</p>
                  <p><strong>Frais annuels:</strong> {formData.totalFees.toLocaleString()} FCFA</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paiement Initial (FCFA)
                </label>
                <input
                  type="number"
                  min="0"
                  max={formData.totalFees}
                  value={formData.initialPayment}
                  onChange={(e) => setFormData(prev => ({ ...prev, initialPayment: parseInt(e.target.value) || 0 }))}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.initialPayment ? 'border-red-300' : 'border-gray-200'
                  }`}
                />
                {errors.initialPayment && <p className="text-red-500 text-sm mt-1">{errors.initialPayment}</p>}
                <p className="text-sm text-gray-500 mt-1">
                  Solde restant: {(formData.totalFees - formData.initialPayment).toLocaleString()} FCFA
                </p>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Méthode de Paiement *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { value: 'Espèces', label: 'Espèces', icon: DollarSign, color: 'green' },
                    { value: 'Mobile Money', label: 'Mobile Money', icon: Phone, color: 'blue' },
                    { value: 'Virement Bancaire', label: 'Virement Bancaire', icon: BookOpen, color: 'purple' }
                  ].map(method => {
                    const Icon = method.icon;
                    const isSelected = formData.paymentMethod === method.value;
                    
                    return (
                      <div
                        key={method.value}
                        onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method.value as any }))}
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
              {formData.paymentMethod === 'Mobile Money' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro de Téléphone *
                  </label>
                  <input
                    type="tel"
                    value={formData.mobileNumber || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, mobileNumber: e.target.value }))}
                    placeholder="+223 XX XX XX XX"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.mobileNumber ? 'border-red-300' : 'border-gray-200'
                    }`}
                  />
                  {errors.mobileNumber && <p className="text-red-500 text-sm mt-1">{errors.mobileNumber}</p>}
                </div>
              )}

              {formData.paymentMethod === 'Virement Bancaire' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Référence Bancaire *
                  </label>
                  <input
                    type="text"
                    value={formData.bankDetails || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, bankDetails: e.target.value }))}
                    placeholder="Numéro de référence ou RIB"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.bankDetails ? 'border-red-300' : 'border-gray-200'
                    }`}
                  />
                  {errors.bankDetails && <p className="text-red-500 text-sm mt-1">{errors.bankDetails}</p>}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optionnel)
                </label>
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Commentaires ou informations supplémentaires..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 'confirmation' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Inscription Prête</h3>
                <p className="text-gray-600">Vérifiez les informations avant de confirmer l'inscription</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-3">Informations de l'Élève</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Nom complet:</strong> {formData.firstName} {formData.lastName}</p>
                    <p><strong>Date de naissance:</strong> {new Date(formData.dateOfBirth).toLocaleDateString('fr-FR')}</p>
                    <p><strong>Âge:</strong> {calculateAge(formData.dateOfBirth)} ans</p>
                    <p><strong>Classe:</strong> {formData.class} ({formData.level})</p>
                    <p><strong>Date d'inscription:</strong> {new Date(formData.enrollmentDate).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-3">Contact Parent/Tuteur</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Nom:</strong> {formData.parentName}</p>
                    <p><strong>Téléphone:</strong> {formData.parentPhone}</p>
                    <p><strong>Email:</strong> {formData.parentEmail}</p>
                    <p><strong>Adresse:</strong> {formData.address}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-3">Situation Financière</h4>
                <div className="space-y-2 text-sm text-blue-700">
                  <p><strong>Frais annuels:</strong> {formData.totalFees.toLocaleString()} FCFA</p>
                  <p><strong>Paiement initial:</strong> {formData.initialPayment.toLocaleString()} FCFA</p>
                  <p><strong>Solde restant:</strong> {(formData.totalFees - formData.initialPayment).toLocaleString()} FCFA</p>
                  <p><strong>Méthode de paiement:</strong> {formData.paymentMethod}</p>
                  {formData.mobileNumber && <p><strong>Mobile Money:</strong> {formData.mobileNumber}</p>}
                  {formData.bankDetails && <p><strong>Référence bancaire:</strong> {formData.bankDetails}</p>}
                </div>
              </div>

              {formData.notes && (
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-2">Notes</h4>
                  <p className="text-sm text-yellow-700">{formData.notes}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              {step !== 'student' && (
                <button
                  onClick={handleBack}
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
                Annuler
              </button>
              
              {step !== 'confirmation' ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Suivant
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Users className="h-4 w-4" />
                  <span>Confirmer l'Inscription</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStudentModal;