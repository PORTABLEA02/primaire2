import React, { useState } from 'react';
import { Search, Filter, Plus, Download, Users, X, Save, User, Phone, Mail, MapPin, Calendar, GraduationCap, DollarSign, FileText, Camera } from 'lucide-react';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  gender: 'M' | 'F';
  class: string;
  level: string;
  age: number;
  guardian: string;
  guardianRelation: string;
  phone: string;
  email?: string;
  address: string;
  previousSchool?: string;
  medicalInfo?: string;
  status: 'Actif' | 'Inactif' | 'Transféré';
  fees: 'À jour' | 'En retard' | 'Partiel';
  enrollmentDate: string;
  photo?: string;
  documents: string[];
  emergencyContact: string;
  emergencyPhone: string;
  allergies?: string;
  bloodType?: string;
  nationality: string;
  religion?: string;
  motherTongue: string;
  fatherName?: string;
  fatherProfession?: string;
  motherName?: string;
  motherProfession?: string;
  scholarshipStatus?: 'Aucune' | 'Partielle' | 'Complète';
  transportMode?: string;
  specialNeeds?: string;
}

interface NewStudentFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  gender: 'M' | 'F';
  class: string;
  guardian: string;
  guardianRelation: string;
  phone: string;
  email: string;
  address: string;
  previousSchool: string;
  medicalInfo: string;
  emergencyContact: string;
  emergencyPhone: string;
  allergies: string;
  bloodType: string;
  nationality: string;
  religion: string;
  motherTongue: string;
  fatherName: string;
  fatherProfession: string;
  motherName: string;
  motherProfession: string;
  scholarshipStatus: 'Aucune' | 'Partielle' | 'Complète';
  transportMode: string;
  specialNeeds: string;
}

const StudentManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<NewStudentFormData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    placeOfBirth: '',
    gender: 'M',
    class: '',
    guardian: '',
    guardianRelation: 'Père',
    phone: '',
    email: '',
    address: '',
    previousSchool: '',
    medicalInfo: '',
    emergencyContact: '',
    emergencyPhone: '',
    allergies: '',
    bloodType: '',
    nationality: 'Malienne',
    religion: '',
    motherTongue: 'Bambara',
    fatherName: '',
    fatherProfession: '',
    motherName: '',
    motherProfession: '',
    scholarshipStatus: 'Aucune',
    transportMode: '',
    specialNeeds: ''
  });

  const [students, setStudents] = useState<Student[]>([
    {
      id: '1',
      firstName: 'Kofi',
      lastName: 'Mensah',
      dateOfBirth: '2012-03-15',
      placeOfBirth: 'Bamako',
      gender: 'M',
      class: 'CM2A',
      level: 'CM2',
      age: 12,
      guardian: 'Agnes Mensah',
      guardianRelation: 'Mère',
      phone: '+223 70 12 34 56',
      email: 'agnes.mensah@email.com',
      address: 'Quartier Hippodrome, Bamako',
      status: 'Actif',
      fees: 'À jour',
      enrollmentDate: '2024-09-01',
      documents: ['acte_naissance.pdf', 'certificat_medical.pdf'],
      emergencyContact: 'Kwame Mensah',
      emergencyPhone: '+223 75 98 76 54',
      nationality: 'Ghanéenne',
      motherTongue: 'Twi'
    },
    {
      id: '2',
      firstName: 'Fatima',
      lastName: 'Diallo',
      dateOfBirth: '2016-07-22',
      placeOfBirth: 'Sikasso',
      gender: 'F',
      class: 'CE1B',
      level: 'CE1',
      age: 8,
      guardian: 'Mamadou Diallo',
      guardianRelation: 'Père',
      phone: '+223 75 98 76 54',
      address: 'Quartier ACI 2000, Bamako',
      status: 'Actif',
      fees: 'En retard',
      enrollmentDate: '2024-09-01',
      documents: ['acte_naissance.pdf'],
      emergencyContact: 'Aminata Diallo',
      emergencyPhone: '+223 65 44 33 22',
      nationality: 'Malienne',
      motherTongue: 'Peul'
    },
    {
      id: '3',
      firstName: 'Amadou',
      lastName: 'Kone',
      dateOfBirth: '2017-11-08',
      placeOfBirth: 'Mopti',
      gender: 'M',
      class: 'CP2',
      level: 'CP',
      age: 7,
      guardian: 'Aminata Kone',
      guardianRelation: 'Mère',
      phone: '+223 65 44 33 22',
      address: 'Quartier Magnambougou, Bamako',
      status: 'Actif',
      fees: 'À jour',
      enrollmentDate: '2024-09-01',
      documents: ['acte_naissance.pdf', 'certificat_medical.pdf', 'photos.jpg'],
      emergencyContact: 'Sekou Kone',
      emergencyPhone: '+223 70 11 22 33',
      nationality: 'Malienne',
      motherTongue: 'Bambara'
    }
  ]);

  const classes = [
    { id: 'maternelle-1a', name: 'Maternelle 1A', level: 'Maternelle', capacity: 30, enrolled: 25 },
    { id: 'maternelle-1b', name: 'Maternelle 1B', level: 'Maternelle', capacity: 30, enrolled: 28 },
    { id: 'ci-a', name: 'CI A', level: 'CI', capacity: 35, enrolled: 32 },
    { id: 'cp1', name: 'CP1', level: 'CP', capacity: 35, enrolled: 30 },
    { id: 'cp2', name: 'CP2', level: 'CP', capacity: 35, enrolled: 29 },
    { id: 'ce1a', name: 'CE1A', level: 'CE1', capacity: 40, enrolled: 35 },
    { id: 'ce1b', name: 'CE1B', level: 'CE1', capacity: 40, enrolled: 38 },
    { id: 'ce2a', name: 'CE2A', level: 'CE2', capacity: 40, enrolled: 36 },
    { id: 'ce2b', name: 'CE2B', level: 'CE2', capacity: 40, enrolled: 38 },
    { id: 'cm1a', name: 'CM1A', level: 'CM1', capacity: 45, enrolled: 42 },
    { id: 'cm1b', name: 'CM1B', level: 'CM1', capacity: 45, enrolled: 40 },
    { id: 'cm2a', name: 'CM2A', level: 'CM2', capacity: 45, enrolled: 42 },
    { id: 'cm2b', name: 'CM2B', level: 'CM2', capacity: 45, enrolled: 39 }
  ];

  const guardianRelations = ['Père', 'Mère', 'Tuteur', 'Grand-père', 'Grand-mère', 'Oncle', 'Tante', 'Autre'];
  const nationalities = ['Malienne', 'Burkinabé', 'Ivoirienne', 'Sénégalaise', 'Guinéenne', 'Nigérienne', 'Ghanéenne', 'Autre'];
  const languages = ['Bambara', 'Peul', 'Soninké', 'Dogon', 'Tamasheq', 'Français', 'Autre'];
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Inconnu'];
  const transportModes = ['À pied', 'Transport scolaire', 'Transport familial', 'Transport public', 'Vélo'];

  const handleInputChange = (field: keyof NewStudentFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const generateStudentId = (): string => {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${year}${randomNum}`;
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.firstName && formData.lastName && formData.dateOfBirth && formData.gender && formData.placeOfBirth);
      case 2:
        return !!(formData.guardian && formData.phone && formData.address && formData.emergencyContact && formData.emergencyPhone);
      case 3:
        return !!(formData.class);
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulation d'une requête API
      await new Promise(resolve => setTimeout(resolve, 2000));

      const selectedClass = classes.find(c => c.id === formData.class);
      const newStudent: Student = {
        id: generateStudentId(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        placeOfBirth: formData.placeOfBirth,
        gender: formData.gender,
        class: selectedClass?.name || '',
        level: selectedClass?.level || '',
        age: calculateAge(formData.dateOfBirth),
        guardian: formData.guardian,
        guardianRelation: formData.guardianRelation,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        previousSchool: formData.previousSchool,
        medicalInfo: formData.medicalInfo,
        status: 'Actif',
        fees: 'À jour',
        enrollmentDate: new Date().toISOString().split('T')[0],
        documents: [],
        emergencyContact: formData.emergencyContact,
        emergencyPhone: formData.emergencyPhone,
        allergies: formData.allergies,
        bloodType: formData.bloodType,
        nationality: formData.nationality,
        religion: formData.religion,
        motherTongue: formData.motherTongue,
        fatherName: formData.fatherName,
        fatherProfession: formData.fatherProfession,
        motherName: formData.motherName,
        motherProfession: formData.motherProfession,
        scholarshipStatus: formData.scholarshipStatus,
        transportMode: formData.transportMode,
        specialNeeds: formData.specialNeeds
      };

      setStudents(prev => [...prev, newStudent]);
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        placeOfBirth: '',
        gender: 'M',
        class: '',
        guardian: '',
        guardianRelation: 'Père',
        phone: '',
        email: '',
        address: '',
        previousSchool: '',
        medicalInfo: '',
        emergencyContact: '',
        emergencyPhone: '',
        allergies: '',
        bloodType: '',
        nationality: 'Malienne',
        religion: '',
        motherTongue: 'Bambara',
        fatherName: '',
        fatherProfession: '',
        motherName: '',
        motherProfession: '',
        scholarshipStatus: 'Aucune',
        transportMode: '',
        specialNeeds: ''
      });
      
      setCurrentStep(1);
      setShowAddModal(false);
      
      alert('Élève ajouté avec succès !');
    } catch (error) {
      alert('Erreur lors de l\'ajout de l\'élève');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.phone.includes(searchTerm) ||
                         student.id.includes(searchTerm);
    const matchesClass = selectedClass === 'all' || student.level.toLowerCase() === selectedClass;
    return matchesSearch && matchesClass;
  });

  const AddStudentModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Nouvel Élève</h2>
              <p className="text-gray-600">Inscription d'un nouvel élève - Étape {currentStep}/4</p>
            </div>
            <button
              onClick={() => {
                setShowAddModal(false);
                setCurrentStep(1);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center space-x-4">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step}
                  </div>
                  {step < 4 && (
                    <div className={`w-16 h-1 mx-2 ${
                      step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>Identité</span>
              <span>Famille</span>
              <span>Scolarité</span>
              <span>Finalisation</span>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {/* Step 1: Identité de l'élève */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-blue-50 rounded-xl">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Informations Personnelles</h3>
                  <p className="text-gray-600">Identité et informations de base de l'élève</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Prénom de l'élève"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nom de famille"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de Naissance <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lieu de Naissance <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.placeOfBirth}
                    onChange={(e) => handleInputChange('placeOfBirth', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ville de naissance"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sexe <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value as 'M' | 'F')}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="M">Masculin</option>
                    <option value="F">Féminin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nationalité
                  </label>
                  <select
                    value={formData.nationality}
                    onChange={(e) => handleInputChange('nationality', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {nationalities.map(nat => (
                      <option key={nat} value={nat}>{nat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Langue Maternelle
                  </label>
                  <select
                    value={formData.motherTongue}
                    onChange={(e) => handleInputChange('motherTongue', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {languages.map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Religion
                  </label>
                  <input
                    type="text"
                    value={formData.religion}
                    onChange={(e) => handleInputChange('religion', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Religion (optionnel)"
                  />
                </div>
              </div>

              {/* Medical Information */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-md font-semibold text-gray-800 mb-4">Informations Médicales</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Groupe Sanguin
                    </label>
                    <select
                      value={formData.bloodType}
                      onChange={(e) => handleInputChange('bloodType', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Sélectionner</option>
                      {bloodTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Allergies
                    </label>
                    <input
                      type="text"
                      value={formData.allergies}
                      onChange={(e) => handleInputChange('allergies', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Allergies connues"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Informations Médicales
                    </label>
                    <textarea
                      value={formData.medicalInfo}
                      onChange={(e) => handleInputChange('medicalInfo', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Conditions médicales, traitements en cours, etc."
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Besoins Spéciaux
                    </label>
                    <textarea
                      value={formData.specialNeeds}
                      onChange={(e) => handleInputChange('specialNeeds', e.target.value)}
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Besoins éducatifs spéciaux, handicaps, etc."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Informations Famille */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-green-50 rounded-xl">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Informations Familiales</h3>
                  <p className="text-gray-600">Tuteur légal et contacts d'urgence</p>
                </div>
              </div>

              {/* Tuteur Principal */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h4 className="text-md font-semibold text-gray-800 mb-4">Tuteur Principal</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom du Tuteur <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.guardian}
                      onChange={(e) => handleInputChange('guardian', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nom complet du tuteur"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Relation <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.guardianRelation}
                      onChange={(e) => handleInputChange('guardianRelation', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {guardianRelations.map(relation => (
                        <option key={relation} value={relation}>{relation}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+223 XX XX XX XX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="email@exemple.com"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adresse <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Adresse complète de résidence"
                    />
                  </div>
                </div>
              </div>

              {/* Parents */}
              <div className="bg-blue-50 p-6 rounded-xl">
                <h4 className="text-md font-semibold text-gray-800 mb-4">Informations des Parents</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom du Père
                    </label>
                    <input
                      type="text"
                      value={formData.fatherName}
                      onChange={(e) => handleInputChange('fatherName', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nom complet du père"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profession du Père
                    </label>
                    <input
                      type="text"
                      value={formData.fatherProfession}
                      onChange={(e) => handleInputChange('fatherProfession', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Profession du père"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom de la Mère
                    </label>
                    <input
                      type="text"
                      value={formData.motherName}
                      onChange={(e) => handleInputChange('motherName', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nom complet de la mère"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profession de la Mère
                    </label>
                    <input
                      type="text"
                      value={formData.motherProfession}
                      onChange={(e) => handleInputChange('motherProfession', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Profession de la mère"
                    />
                  </div>
                </div>
              </div>

              {/* Contact d'Urgence */}
              <div className="bg-red-50 p-6 rounded-xl">
                <h4 className="text-md font-semibold text-gray-800 mb-4">Contact d'Urgence</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom du Contact <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.emergencyContact}
                      onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Personne à contacter en cas d'urgence"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone d'Urgence <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.emergencyPhone}
                      onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+223 XX XX XX XX"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Informations Scolaires */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-purple-50 rounded-xl">
                  <GraduationCap className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Informations Scolaires</h3>
                  <p className="text-gray-600">Classe, transport et informations académiques</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Classe d'Inscription <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.class}
                    onChange={(e) => handleInputChange('class', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner une classe</option>
                    {classes.map(cls => (
                      <option key={cls.id} value={cls.id} disabled={cls.enrolled >= cls.capacity}>
                        {cls.name} ({cls.enrolled}/{cls.capacity}) {cls.enrolled >= cls.capacity ? '- COMPLET' : ''}
                      </option>
                    ))}
                  </select>
                  {formData.class && (
                    <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                      {(() => {
                        const selectedClass = classes.find(c => c.id === formData.class);
                        return selectedClass ? (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-blue-800">
                              <strong>{selectedClass.name}</strong> - Niveau {selectedClass.level}
                            </span>
                            <span className="text-blue-600">
                              Places disponibles: {selectedClass.capacity - selectedClass.enrolled}
                            </span>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    École Précédente
                  </label>
                  <input
                    type="text"
                    value={formData.previousSchool}
                    onChange={(e) => handleInputChange('previousSchool', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nom de l'école précédente"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mode de Transport
                  </label>
                  <select
                    value={formData.transportMode}
                    onChange={(e) => handleInputChange('transportMode', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner</option>
                    {transportModes.map(mode => (
                      <option key={mode} value={mode}>{mode}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Statut de Bourse
                  </label>
                  <select
                    value={formData.scholarshipStatus}
                    onChange={(e) => handleInputChange('scholarshipStatus', e.target.value as 'Aucune' | 'Partielle' | 'Complète')}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Aucune">Aucune bourse</option>
                    <option value="Partielle">Bourse partielle</option>
                    <option value="Complète">Bourse complète</option>
                  </select>
                </div>
              </div>

              {/* Class Information Display */}
              {formData.class && (
                <div className="bg-green-50 p-6 rounded-xl">
                  <h4 className="text-md font-semibold text-gray-800 mb-4">Informations sur la Classe</h4>
                  {(() => {
                    const selectedClass = classes.find(c => c.id === formData.class);
                    return selectedClass ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-white rounded-lg">
                          <p className="text-2xl font-bold text-green-600">{selectedClass.capacity - selectedClass.enrolled}</p>
                          <p className="text-sm text-gray-600">Places disponibles</p>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">{selectedClass.enrolled}</p>
                          <p className="text-sm text-gray-600">Élèves inscrits</p>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg">
                          <p className="text-2xl font-bold text-purple-600">{selectedClass.capacity}</p>
                          <p className="text-sm text-gray-600">Capacité totale</p>
                        </div>
                      </div>
                    ) : null;
                  })()}
                </div>
              )}
            </div>
          )}

          {/* Step 4: Récapitulatif */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-yellow-50 rounded-xl">
                  <FileText className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Récapitulatif</h3>
                  <p className="text-gray-600">Vérifiez les informations avant validation</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Informations Personnelles */}
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Informations Personnelles
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nom complet:</span>
                      <span className="font-medium">{formData.firstName} {formData.lastName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date de naissance:</span>
                      <span className="font-medium">{formData.dateOfBirth}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lieu de naissance:</span>
                      <span className="font-medium">{formData.placeOfBirth}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sexe:</span>
                      <span className="font-medium">{formData.gender === 'M' ? 'Masculin' : 'Féminin'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nationalité:</span>
                      <span className="font-medium">{formData.nationality}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Langue maternelle:</span>
                      <span className="font-medium">{formData.motherTongue}</span>
                    </div>
                    {formData.bloodType && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Groupe sanguin:</span>
                        <span className="font-medium">{formData.bloodType}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Informations Familiales */}
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Informations Familiales
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tuteur:</span>
                      <span className="font-medium">{formData.guardian}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Relation:</span>
                      <span className="font-medium">{formData.guardianRelation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Téléphone:</span>
                      <span className="font-medium">{formData.phone}</span>
                    </div>
                    {formData.email && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{formData.email}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Contact d'urgence:</span>
                      <span className="font-medium">{formData.emergencyContact}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tél. d'urgence:</span>
                      <span className="font-medium">{formData.emergencyPhone}</span>
                    </div>
                  </div>
                </div>

                {/* Informations Scolaires */}
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Informations Scolaires
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Classe:</span>
                      <span className="font-medium">
                        {classes.find(c => c.id === formData.class)?.name || 'Non sélectionnée'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Niveau:</span>
                      <span className="font-medium">
                        {classes.find(c => c.id === formData.class)?.level || 'Non défini'}
                      </span>
                    </div>
                    {formData.previousSchool && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">École précédente:</span>
                        <span className="font-medium">{formData.previousSchool}</span>
                      </div>
                    )}
                    {formData.transportMode && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Transport:</span>
                        <span className="font-medium">{formData.transportMode}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bourse:</span>
                      <span className="font-medium">{formData.scholarshipStatus}</span>
                    </div>
                  </div>
                </div>

                {/* Informations Médicales */}
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <span className="mr-2">🏥</span>
                    Informations Médicales
                  </h4>
                  <div className="space-y-2 text-sm">
                    {formData.allergies && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Allergies:</span>
                        <span className="font-medium">{formData.allergies}</span>
                      </div>
                    )}
                    {formData.medicalInfo && (
                      <div>
                        <span className="text-gray-600">Infos médicales:</span>
                        <p className="font-medium mt-1 text-xs">{formData.medicalInfo}</p>
                      </div>
                    )}
                    {formData.specialNeeds && (
                      <div>
                        <span className="text-gray-600">Besoins spéciaux:</span>
                        <p className="font-medium mt-1 text-xs">{formData.specialNeeds}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ID Preview */}
              <div className="bg-blue-50 p-6 rounded-xl">
                <h4 className="font-semibold text-gray-800 mb-4">Aperçu de l'ID Élève</h4>
                <div className="bg-white p-4 rounded-lg border-2 border-dashed border-blue-300">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-xl">
                        {formData.firstName[0]}{formData.lastName[0]}
                      </span>
                    </div>
                    <p className="font-bold text-gray-800">{formData.firstName} {formData.lastName}</p>
                    <p className="text-sm text-gray-600">ID: {generateStudentId()}</p>
                    <p className="text-sm text-blue-600">
                      {classes.find(c => c.id === formData.class)?.name}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 sticky bottom-0">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Précédent
            </button>

            <div className="flex items-center space-x-3">
              {currentStep < 4 ? (
                <button
                  onClick={() => {
                    if (validateStep(currentStep)) {
                      setCurrentStep(currentStep + 1);
                    } else {
                      alert('Veuillez remplir tous les champs obligatoires');
                    }
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Suivant
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Inscription...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Inscrire l'Élève</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Élèves</h1>
          <p className="text-gray-600">Gérer les inscriptions, profils et données des élèves</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Exporter</span>
          </button>
          
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Nouvel Élève</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Élèves</p>
              <p className="text-2xl font-bold text-gray-800">{students.length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-blue-600 font-medium">Inscrits cette année</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Nouveaux ce Mois</p>
              <p className="text-2xl font-bold text-gray-800">47</p>
            </div>
            <div className="p-3 bg-green-50 rounded-xl">
              <Plus className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600 font-medium">+12% vs mois dernier</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Frais à Jour</p>
              <p className="text-2xl font-bold text-gray-800">89%</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-xl">
              <DollarSign className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '89%' }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Transferts</p>
              <p className="text-2xl font-bold text-gray-800">12</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl">
              <span className="text-2xl">🔄</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-purple-600 font-medium">Ce trimestre</span>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, prénom ou ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select 
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Toutes les Classes</option>
            <option value="maternelle">Maternelle</option>
            <option value="ci">CI</option>
            <option value="cp">CP</option>
            <option value="ce1">CE1</option>
            <option value="ce2">CE2</option>
            <option value="cm1">CM1</option>
            <option value="cm2">CM2</option>
          </select>
          
          <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Filtres</span>
          </button>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Liste des Élèves</h2>
            <span className="text-sm text-gray-500">{filteredStudents.length} élève(s)</span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Élève</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Classe</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Âge</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tuteur</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Frais</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {student.firstName[0]}{student.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{student.firstName} {student.lastName}</p>
                        <p className="text-sm text-gray-500">ID: {student.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                      {student.class}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{student.age} ans</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-gray-800 font-medium">{student.guardian}</p>
                      <p className="text-sm text-gray-500">{student.guardianRelation}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-3 w-3 text-gray-400" />
                        <span className="text-sm text-gray-600">{student.phone}</span>
                      </div>
                      {student.email && (
                        <div className="flex items-center space-x-2">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <span className="text-sm text-gray-600">{student.email}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      student.fees === 'À jour' 
                        ? 'bg-green-50 text-green-700' 
                        : student.fees === 'En retard'
                        ? 'bg-red-50 text-red-700'
                        : 'bg-yellow-50 text-yellow-700'
                    }`}>
                      {student.fees}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Voir Détails
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && <AddStudentModal />}
    </div>
  );
};

export default StudentManagement;