import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Download,
  Edit,
  Trash2,
  Eye,
  Phone,
  Mail,
  Calendar,
  MapPin,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  BookOpen,
  User
} from 'lucide-react';
import AddStudentModal from './AddStudentModal';

interface Student {
  id: string;
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
  status: 'Actif' | 'Inactif' | 'Suspendu';
  paymentStatus: 'À jour' | 'En retard' | 'Partiel';
  outstandingAmount: number;
  totalFees: number;
  paidAmount: number;
  lastPayment?: string;
  paymentHistory: Array<{
    date: string;
    amount: number;
    description: string;
    method: string;
  }>;
}

const StudentManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [students, setStudents] = useState<Student[]>([
    {
      id: '1',
      firstName: 'Kofi',
      lastName: 'Mensah',
      dateOfBirth: '2012-03-15',
      class: 'CM2A',
      level: 'CM2',
      parentName: 'Kwame Mensah',
      parentPhone: '+223 70 11 22 33',
      parentEmail: 'kmensah@email.com',
      address: 'Quartier Hippodrome, Bamako',
      enrollmentDate: '2024-09-01',
      status: 'Actif',
      paymentStatus: 'À jour',
      outstandingAmount: 0,
      totalFees: 450000, // CM2
      paidAmount: 450000,
      lastPayment: '2024-10-15',
      paymentHistory: [
        { date: '2024-09-15', amount: 200000, description: '1ère tranche', method: 'Mobile Money' },
        { date: '2024-10-15', amount: 250000, description: 'Solde scolarité', method: 'Espèces' }
      ]
    },
    {
      id: '2',
      firstName: 'Fatima',
      lastName: 'Diallo',
      dateOfBirth: '2015-07-22',
      class: 'CE1B',
      level: 'CE1',
      parentName: 'Mamadou Diallo',
      parentPhone: '+223 75 44 55 66',
      parentEmail: 'mdiallo@email.com',
      address: 'Quartier ACI 2000, Bamako',
      enrollmentDate: '2024-09-01',
      status: 'Actif',
      paymentStatus: 'À jour',
      outstandingAmount: 0,
      totalFees: 400000, // CE1
      paidAmount: 400000,
      lastPayment: '2024-10-12',
      paymentHistory: [
        { date: '2024-09-10', amount: 150000, description: 'Acompte rentrée', method: 'Virement' },
        { date: '2024-10-12', amount: 250000, description: 'Complément scolarité', method: 'Espèces' }
      ]
    },
    {
      id: '3',
      firstName: 'Amadou',
      lastName: 'Kone',
      dateOfBirth: '2016-11-08',
      class: 'CP2',
      level: 'CP',
      parentName: 'Salif Kone',
      parentPhone: '+223 65 77 88 99',
      parentEmail: 'skone@email.com',
      address: 'Quartier Magnambougou, Bamako',
      enrollmentDate: '2024-09-01',
      status: 'Actif',
      paymentStatus: 'En retard',
      outstandingAmount: 250000,
      totalFees: 350000, // CP
      paidAmount: 100000,
      lastPayment: '2024-09-15',
      paymentHistory: [
        { date: '2024-09-15', amount: 100000, description: 'Acompte inscription', method: 'Espèces' }
      ]
    },
    {
      id: '4',
      firstName: 'Aissata',
      lastName: 'Ba',
      dateOfBirth: '2014-05-12',
      class: 'CE2A',
      level: 'CE2',
      parentName: 'Ousmane Ba',
      parentPhone: '+223 78 99 00 11',
      parentEmail: 'oba@email.com',
      address: 'Quartier Lafiabougou, Bamako',
      enrollmentDate: '2024-09-01',
      status: 'Actif',
      paymentStatus: 'Partiel',
      outstandingAmount: 150000,
      totalFees: 400000, // CE2
      paidAmount: 250000,
      lastPayment: '2024-10-08',
      paymentHistory: [
        { date: '2024-09-05', amount: 250000, description: 'Paiement partiel', method: 'Mobile Money' }
      ]
    }
  ]);


  const classes = ['Maternelle 1A', 'Maternelle 1B', 'CI A', 'CP1', 'CP2', 'CE1A', 'CE1B', 'CE2A', 'CE2B', 'CM1A', 'CM2A'];

  const filteredStudents = students.filter(student => {
    const matchesSearch = `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.parentPhone.includes(searchTerm);
    const matchesClass = classFilter === 'all' || student.class === classFilter;
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    return matchesSearch && matchesClass && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Actif': return 'bg-green-50 text-green-700 border-green-200';
      case 'Inactif': return 'bg-red-50 text-red-700 border-red-200';
      case 'Suspendu': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'À jour': return 'bg-green-50 text-green-700';
      case 'En retard': return 'bg-red-50 text-red-700';
      case 'Partiel': return 'bg-yellow-50 text-yellow-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  const handleAddStudent = (studentData: any) => {
    const newStudent: Student = {
      id: (students.length + 1).toString(),
      firstName: studentData.firstName,
      lastName: studentData.lastName,
      dateOfBirth: studentData.dateOfBirth,
      class: studentData.class,
      level: studentData.level,
      parentName: studentData.parentName,
      parentPhone: studentData.parentPhone,
      parentEmail: studentData.parentEmail,
      address: studentData.address,
      enrollmentDate: studentData.enrollmentDate,
      status: 'Actif',
      paymentStatus: studentData.initialPayment >= studentData.totalFees ? 'À jour' : 
                    studentData.initialPayment > 0 ? 'Partiel' : 'En retard',
      outstandingAmount: studentData.totalFees - studentData.initialPayment,
      totalFees: studentData.totalFees,
      paidAmount: studentData.initialPayment,
      lastPayment: studentData.initialPayment > 0 ? new Date().toISOString().split('T')[0] : undefined,
      paymentHistory: studentData.initialPayment > 0 ? [
        {
          date: new Date().toISOString().split('T')[0],
          amount: studentData.initialPayment,
          description: 'Paiement d\'inscription',
          method: studentData.paymentMethod
        }
      ] : []
    };
    
    setStudents(prev => [...prev, newStudent]);
    
    // Notification de succès (optionnel)
    console.log('Nouvel élève ajouté:', newStudent);
  };

  const StudentDetailModal = ({ student, onClose }: { student: Student; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-xl">
                  {student.firstName[0]}{student.lastName[0]}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {student.firstName} {student.lastName}
                </h2>
                <p className="text-gray-600">{student.class} • {student.level}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border mt-2 ${getPaymentStatusColor(student.paymentStatus)}`}>
                  {student.paymentStatus}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Eye className="h-6 w-6 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Informations personnelles */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations Personnelles</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700">
                      Né(e) le {new Date(student.dateOfBirth).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                    <span className="text-gray-700">{student.address}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <BookOpen className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700">
                      Inscrit le {new Date(student.enrollmentDate).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Parent/Tuteur</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700 font-medium">{student.parentName}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700">{student.parentPhone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700">{student.parentEmail}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Informations financières */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Situation Financière</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Frais de scolarité annuels:</span>
                      <span className="font-bold text-gray-800">{student.totalFees.toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Montant payé:</span>
                      <span className="font-bold text-green-600">{student.paidAmount.toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Solde restant:</span>
                      <span className={`font-bold ${student.outstandingAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {(student.totalFees - student.paidAmount).toLocaleString()} FCFA
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-green-600 h-3 rounded-full"
                      style={{ width: `${(student.paidAmount / student.totalFees) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 text-center">
                    {Math.round((student.paidAmount / student.totalFees) * 100)}% payé
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Historique des Paiements</h3>
                <div className="space-y-3">
                  {student.paymentHistory.length > 0 ? (
                    student.paymentHistory.map((payment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <span className="font-medium text-gray-800">{payment.description}</span>
                          <p className="text-sm text-gray-500">
                            {new Date(payment.date).toLocaleDateString('fr-FR')} • {payment.method}
                          </p>
                        </div>
                        <span className="font-bold text-green-600">
                          {payment.amount.toLocaleString()} FCFA
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <p>Aucun paiement enregistré</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              Modifier
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
              <DollarSign className="h-4 w-4" />
              <span>Enregistrer Paiement</span>
            </button>
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
          <p className="text-gray-600">Inscriptions, suivi académique et paiements par tranches</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Exporter</span>
          </button>
          
          <button 
            onClick={() => setShowAddStudentModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Nouvel Élève</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Paiements à Jour</p>
              <p className="text-2xl font-bold text-green-600">
                {students.filter(s => s.paymentStatus === 'À jour').length}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-xl">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En Retard</p>
              <p className="text-2xl font-bold text-red-600">
                {students.filter(s => s.paymentStatus === 'En retard').length}
              </p>
            </div>
            <div className="p-3 bg-red-50 rounded-xl">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Paiements Partiels</p>
              <p className="text-2xl font-bold text-yellow-600">
                {students.filter(s => s.paymentStatus === 'Partiel').length}
              </p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-xl">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
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
              placeholder="Rechercher par nom d'élève ou parent..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select 
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Toutes les classes</option>
            {classes.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
          
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les statuts</option>
            <option value="Actif">Actif</option>
            <option value="Inactif">Inactif</option>
            <option value="Suspendu">Suspendu</option>
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
          <h2 className="text-lg font-semibold text-gray-800">Liste des Élèves</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Élève</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Classe</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parent/Tuteur</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Situation Financière</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
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
                        <p className="text-sm text-gray-500">
                          {new Date().getFullYear() - new Date(student.dateOfBirth).getFullYear()} ans
                        </p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                      {student.class}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="font-medium text-gray-800">{student.parentName}</p>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-3 w-3 text-gray-400" />
                        <span className="text-sm text-gray-600">{student.parentPhone}</span>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(student.paymentStatus)}`}>
                        {student.paymentStatus}
                      </span>
                      <div className="text-sm text-gray-600">
                        {student.paidAmount.toLocaleString()}/{student.totalFees.toLocaleString()} FCFA
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div 
                          className="bg-green-600 h-1 rounded-full"
                          style={{ width: `${(student.paidAmount / student.totalFees) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(student.status)}`}>
                      {student.status}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => setSelectedStudent(student)}
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
                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <StudentDetailModal 
          student={selectedStudent} 
          onClose={() => setSelectedStudent(null)} 
        />
      )}

      {/* Add Student Modal */}
      <AddStudentModal
        isOpen={showAddStudentModal}
        onClose={() => setShowAddStudentModal(false)}
        onAddStudent={handleAddStudent}
      />
    </div>
  );
};

export default StudentManagement;