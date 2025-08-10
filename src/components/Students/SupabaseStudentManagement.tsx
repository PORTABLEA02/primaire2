import React, { useState, useEffect } from 'react';
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
  AlertCircle,
  CheckCircle,
  Clock,
  Loader,
  RefreshCw,
  UserPlus,
  Calendar,
  MapPin
} from 'lucide-react';
import { studentService } from '../../services/studentService';
import { classService } from '../../services/classService';
import { paymentService } from '../../services/paymentService';
import AddStudentModal from './AddStudentModal';
import type { Student, Class } from '../../lib/supabase';

interface StudentWithClass extends Student {
  classes?: {
    id: string;
    name: string;
    levels: {
      name: string;
    };
  };
}

const SupabaseStudentManagement: React.FC = () => {
  const [students, setStudents] = useState<StudentWithClass[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState<StudentWithClass | null>(null);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    upToDate: 0,
    late: 0,
    partial: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [studentsData, classesData, statsData] = await Promise.all([
        studentService.getStudents(),
        classService.getClasses(),
        studentService.getStudentStats()
      ]);
      
      setStudents(studentsData || []);
      setClasses(classesData || []);
      setStats(statsData);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      // Afficher une notification d'erreur à l'utilisateur
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

  const handleAddStudent = async (studentData: any) => {
    try {
      // Adapter les données pour correspondre au service
      const newStudentData = {
        firstName: studentData.firstName,
        lastName: studentData.lastName,
        gender: studentData.gender,
        dateOfBirth: studentData.dateOfBirth,
        birthPlace: studentData.birthPlace,
        nationality: studentData.nationality,
        motherTongue: studentData.motherTongue,
        religion: studentData.religion,
        bloodType: studentData.bloodType,
        allergies: studentData.allergies,
        medicalInfo: studentData.medicalInfo,
        previousSchool: studentData.previousSchool,
        fatherName: studentData.fatherName,
        fatherPhone: studentData.fatherPhone,
        fatherOccupation: studentData.fatherOccupation,
        motherName: studentData.motherName,
        motherPhone: studentData.motherPhone,
        motherOccupation: studentData.motherOccupation,
        guardianType: studentData.guardianType,
        numberOfSiblings: studentData.numberOfSiblings,
        parentEmail: studentData.parentEmail,
        address: studentData.address,
        emergencyContactName: studentData.emergencyContactName,
        emergencyContactPhone: studentData.emergencyContactPhone,
        emergencyContactRelation: studentData.emergencyContactRelation,
        classId: studentData.classId,
        enrollmentDate: studentData.enrollmentDate,
        totalFees: studentData.totalFees,
        initialPayment: studentData.initialPayment,
        transportMode: studentData.transportMode,
        notes: studentData.notes
      };

      await studentService.createStudent(newStudentData);
      await loadData(); // Recharger les données
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'élève:', error);
      alert('Erreur lors de l\'ajout de l\'élève. Veuillez réessayer.');
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet élève ? Cette action est irréversible.')) {
      try {
        await studentService.deleteStudent(id);
        await loadData();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression. Veuillez réessayer.');
      }
    }
  };

  const handleUpdateStudent = async (id: string, updates: Partial<Student>) => {
    try {
      await studentService.updateStudent(id, updates);
      await loadData();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert('Erreur lors de la mise à jour. Veuillez réessayer.');
    }
  };

  const searchStudents = async (term: string) => {
    if (term.trim()) {
      try {
        const results = await studentService.searchStudents(term);
        setStudents(results || []);
      } catch (error) {
        console.error('Erreur lors de la recherche:', error);
      }
    } else {
      await loadData();
    }
  };

  // Debounce pour la recherche
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm) {
        searchStudents(searchTerm);
      } else {
        loadData();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const filteredStudents = students.filter(student => {
    const matchesClass = classFilter === 'all' || student.classes?.name === classFilter;
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || student.payment_status === paymentFilter;
    return matchesClass && matchesStatus && matchesPayment;
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

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    return today.getFullYear() - birth.getFullYear();
  };

  const exportStudents = async () => {
    try {
      // Créer un CSV avec les données des élèves
      const csvHeaders = [
        'Prénom', 'Nom', 'Sexe', 'Date de naissance', 'Classe', 'Niveau',
        'Père', 'Téléphone père', 'Mère', 'Téléphone mère', 'Email parent',
        'Adresse', 'Statut', 'Statut paiement', 'Montant payé', 'Montant total'
      ];

      const csvData = filteredStudents.map(student => [
        student.first_name,
        student.last_name,
        student.gender,
        new Date(student.date_of_birth).toLocaleDateString('fr-FR'),
        student.classes?.name || '',
        student.classes?.levels?.name || '',
        student.father_name || '',
        student.father_phone || '',
        student.mother_name || '',
        student.mother_phone || '',
        student.parent_email,
        student.address,
        student.status || '',
        student.payment_status || '',
        (student.paid_amount || 0).toLocaleString(),
        student.total_fees.toLocaleString()
      ]);

      const csvContent = [
        csvHeaders.join(','),
        ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `eleves_${new Date().toISOString().split('T')[0]}.csv`);
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
          <Loader className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Chargement des élèves depuis Supabase...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Élèves</h1>
          <p className="text-gray-600">Inscriptions, suivi académique et paiements - Données en temps réel</p>
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
            onClick={exportStudents}
            className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Exporter CSV</span>
          </button>
          
          <button 
            onClick={() => setShowAddStudentModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <UserPlus className="h-4 w-4" />
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
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
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
              <p className="text-sm text-gray-600">Paiements à Jour</p>
              <p className="text-2xl font-bold text-green-600">{stats.upToDate}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-xl">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600 font-medium">
              {stats.total > 0 ? Math.round((stats.upToDate / stats.total) * 100) : 0}% des élèves
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En Retard</p>
              <p className="text-2xl font-bold text-red-600">{stats.late}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-xl">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-red-600 font-medium">Nécessitent un suivi</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Paiements Partiels</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.partial}</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-xl">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-yellow-600 font-medium">En cours de paiement</span>
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
              placeholder="Rechercher par nom d'élève, parent, email ou téléphone..."
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
            {Array.from(new Set(students.map(s => s.classes?.name).filter(Boolean))).map(className => (
              <option key={className} value={className}>{className}</option>
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

          <select 
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les paiements</option>
            <option value="À jour">À jour</option>
            <option value="En retard">En retard</option>
            <option value="Partiel">Partiel</option>
          </select>
          
          <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Plus de filtres</span>
          </button>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              Liste des Élèves ({filteredStudents.length})
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Élève</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Classe</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact Parent</th>
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
                          {student.first_name[0]}{student.last_name[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{student.first_name} {student.last_name}</p>
                        <p className="text-sm text-gray-500">
                          {student.gender} • {calculateAge(student.date_of_birth)} ans
                        </p>
                        <p className="text-xs text-gray-400">
                          Inscrit le {new Date(student.enrollment_date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    {student.classes ? (
                      <div>
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                          {student.classes.name}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">{student.classes.levels?.name}</p>
                      </div>
                    ) : (
                      <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm">
                        Non assigné
                      </span>
                    )}
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="font-medium text-gray-800">
                        {student.father_name && student.mother_name 
                          ? `${student.father_name} / ${student.mother_name}`
                          : student.father_name || student.mother_name || 'Non renseigné'
                        }
                      </p>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-3 w-3 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {student.father_phone || student.mother_phone || 'Non renseigné'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-3 w-3 text-gray-400" />
                        <span className="text-sm text-gray-600">{student.parent_email}</span>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(student.payment_status)}`}>
                        {student.payment_status || 'Non défini'}
                      </span>
                      <div className="text-sm text-gray-600">
                        {(student.paid_amount || 0).toLocaleString()}/{student.total_fees.toLocaleString()} FCFA
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div 
                          className="bg-green-600 h-1 rounded-full"
                          style={{ width: `${Math.min(((student.paid_amount || 0) / student.total_fees) * 100, 100)}%` }}
                        ></div>
                      </div>
                      {student.outstanding_amount && student.outstanding_amount > 0 && (
                        <p className="text-xs text-red-600">
                          Reste: {student.outstanding_amount.toLocaleString()} FCFA
                        </p>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(student.status)}`}>
                      {student.status || 'Actif'}
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
                        onClick={() => {
                          // TODO: Implémenter la modification
                          console.log('Modifier élève:', student.id);
                        }}
                        className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
                        title="Modifier"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteStudent(student.id)}
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

        {filteredStudents.length === 0 && !loading && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">
              {searchTerm ? 'Aucun élève trouvé pour cette recherche' : 'Aucun élève inscrit'}
            </p>
            {!searchTerm && (
              <button 
                onClick={() => setShowAddStudentModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
              >
                <UserPlus className="h-4 w-4" />
                <span>Inscrire le premier élève</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <StudentDetailModal 
          student={selectedStudent} 
          onClose={() => setSelectedStudent(null)}
          onUpdate={handleUpdateStudent}
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

// Modal de détail d'un élève
const StudentDetailModal: React.FC<{
  student: StudentWithClass;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Student>) => void;
}> = ({ student, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'family' | 'financial' | 'academic'>('info');
  const [payments, setPayments] = useState<any[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);

  useEffect(() => {
    loadStudentPayments();
  }, [student.id]);

  const loadStudentPayments = async () => {
    try {
      setLoadingPayments(true);
      const paymentsData = await paymentService.getStudentPayments(student.id);
      setPayments(paymentsData || []);
    } catch (error) {
      console.error('Erreur lors du chargement des paiements:', error);
    } finally {
      setLoadingPayments(false);
    }
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    return today.getFullYear() - birth.getFullYear();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-xl">
                  {student.first_name[0]}{student.last_name[0]}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {student.first_name} {student.last_name}
                </h2>
                <p className="text-gray-600">
                  {student.classes?.name} • {student.classes?.levels?.name} • {student.gender}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    student.payment_status === 'À jour' ? 'bg-green-50 text-green-700' :
                    student.payment_status === 'En retard' ? 'bg-red-50 text-red-700' :
                    'bg-yellow-50 text-yellow-700'
                  }`}>
                    {student.payment_status || 'Non défini'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(student.status)}`}>
                    {student.status || 'Actif'}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-8 mt-6">
            {[
              { id: 'info', label: 'Informations', icon: Users },
              { id: 'family', label: 'Famille', icon: Phone },
              { id: 'financial', label: 'Financier', icon: CheckCircle },
              { id: 'academic', label: 'Académique', icon: Calendar }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {/* Informations personnelles */}
          {activeTab === 'info' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations Personnelles</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700">
                        Né(e) le {new Date(student.date_of_birth).toLocaleDateString('fr-FR')} ({calculateAge(student.date_of_birth)} ans)
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700">{student.birth_place}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-400">🏳️</span>
                      <span className="text-gray-700">Nationalité {student.nationality}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-400">🗣️</span>
                      <span className="text-gray-700">Langue: {student.mother_tongue}</span>
                    </div>
                    {student.religion && (
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-400">🕌</span>
                        <span className="text-gray-700">{student.religion}</span>
                      </div>
                    )}
                    {student.blood_type && (
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-400">🩸</span>
                        <span className="text-gray-700">Groupe {student.blood_type}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-400">🚌</span>
                      <span className="text-gray-700">{student.transport_mode || 'Non spécifié'}</span>
                    </div>
                    {student.number_of_siblings && student.number_of_siblings > 0 && (
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-400">👨‍👩‍👧‍👦</span>
                        <span className="text-gray-700">{student.number_of_siblings} frère(s)/sœur(s)</span>
                      </div>
                    )}
                  </div>
                </div>

                {(student.allergies || student.medical_info) && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations Médicales</h3>
                    <div className="space-y-3">
                      {student.allergies && (
                        <div className="p-3 bg-red-50 rounded-lg">
                          <p className="font-medium text-red-800 mb-1">Allergies</p>
                          <p className="text-sm text-red-700">{student.allergies}</p>
                        </div>
                      )}
                      {student.medical_info && (
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <p className="font-medium text-blue-800 mb-1">Informations Médicales</p>
                          <p className="text-sm text-blue-700">{student.medical_info}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Scolarité</h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Classe actuelle:</p>
                          <p className="font-medium">{student.classes?.name || 'Non assigné'}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Niveau:</p>
                          <p className="font-medium">{student.classes?.levels?.name || 'Non défini'}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Date d'inscription:</p>
                          <p className="font-medium">{new Date(student.enrollment_date).toLocaleDateString('fr-FR')}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Statut:</p>
                          <p className="font-medium">{student.status || 'Actif'}</p>
                        </div>
                      </div>
                    </div>
                    
                    {student.previous_school && (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="font-medium text-blue-800 mb-1">École Précédente</p>
                        <p className="text-sm text-blue-700">{student.previous_school}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Informations familiales */}
          {activeTab === 'family' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Principal</h3>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-3">
                      <div>
                        <p className="text-gray-600">Type de tuteur:</p>
                        <p className="font-medium text-gray-800">{student.guardian_type || 'Non spécifié'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Email principal:</p>
                        <p className="font-medium text-gray-800">{student.parent_email}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Adresse:</p>
                        <p className="font-medium text-gray-800">{student.address}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact d'Urgence</h3>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <div className="space-y-3">
                      <div>
                        <p className="text-gray-600">Nom:</p>
                        <p className="font-medium text-red-800">{student.emergency_contact_name}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Téléphone:</p>
                        <p className="font-medium text-red-800">{student.emergency_contact_phone}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Relation:</p>
                        <p className="font-medium text-red-800">{student.emergency_contact_relation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {student.father_name && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-3">Informations du Père</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Nom:</strong> {student.father_name}</p>
                      {student.father_phone && <p><strong>Téléphone:</strong> {student.father_phone}</p>}
                      {student.father_occupation && <p><strong>Profession:</strong> {student.father_occupation}</p>}
                    </div>
                  </div>
                )}
                
                {student.mother_name && (
                  <div className="p-4 bg-pink-50 rounded-lg">
                    <h4 className="font-medium text-pink-800 mb-3">Informations de la Mère</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Nom:</strong> {student.mother_name}</p>
                      {student.mother_phone && <p><strong>Téléphone:</strong> {student.mother_phone}</p>}
                      {student.mother_occupation && <p><strong>Profession:</strong> {student.mother_occupation}</p>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Informations financières */}
          {activeTab === 'financial' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Situation Financière</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total à payer:</span>
                          <span className="font-bold text-gray-800">{student.total_fees.toLocaleString()} FCFA</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Montant payé:</span>
                          <span className="font-bold text-green-600">{(student.paid_amount || 0).toLocaleString()} FCFA</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Reste à payer:</span>
                          <span className="font-bold text-red-600">
                            {(student.outstanding_amount || (student.total_fees - (student.paid_amount || 0))).toLocaleString()} FCFA
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-green-600 h-3 rounded-full"
                            style={{ width: `${Math.min(((student.paid_amount || 0) / student.total_fees) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {Math.round(((student.paid_amount || 0) / student.total_fees) * 100)}% payé
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Historique des Paiements</h3>
                    <button 
                      onClick={loadStudentPayments}
                      disabled={loadingPayments}
                      className="px-3 py-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      {loadingPayments ? 'Chargement...' : 'Actualiser'}
                    </button>
                  </div>
                  
                  {loadingPayments ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader className="h-6 w-6 animate-spin text-blue-600" />
                    </div>
                  ) : payments.length > 0 ? (
                    <div className="space-y-3">
                      {payments.map((payment) => (
                        <div key={payment.id} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-800">
                                {payment.payment_type} - {payment.period_description || 'Paiement'}
                              </p>
                              <p className="text-sm text-gray-600">
                                {new Date(payment.payment_date).toLocaleDateString('fr-FR')} • {payment.payment_method}
                              </p>
                              {payment.reference_number && (
                                <p className="text-xs text-gray-500">Réf: {payment.reference_number}</p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-green-600">{payment.amount.toLocaleString()} FCFA</p>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                payment.status === 'Confirmé' ? 'bg-green-50 text-green-700' :
                                payment.status === 'En attente' ? 'bg-yellow-50 text-yellow-700' :
                                'bg-red-50 text-red-700'
                              }`}>
                                {payment.status}
                              </span>
                            </div>
                          </div>
                          {payment.notes && (
                            <p className="text-sm text-gray-600 mt-2 italic">{payment.notes}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Aucun paiement enregistré</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Autres onglets à implémenter selon vos besoins */}
          {activeTab === 'family' && (
            <div className="text-center py-8">
              <Phone className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Détails familiaux - À implémenter</p>
            </div>
          )}

          {activeTab === 'academic' && (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Suivi académique - À implémenter</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200">
          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Fermer
            </button>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Modifier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupabaseStudentManagement;