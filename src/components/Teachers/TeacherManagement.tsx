import React, { useState } from 'react';
import { useEffect } from 'react';
import { 
  UserCheck, 
  Plus, 
  Calendar, 
  Phone, 
  Mail, 
  BookOpen, 
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Award,
  Clock,
  Users,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import AddTeacherModal from './AddTeacherModal';
import { teacherService } from '../../services/teacherService';
import { classService } from '../../services/classService';
import type { Teacher as SupabaseTeacher, Class } from '../../lib/supabase';

interface TeacherWithClass extends SupabaseTeacher {
  classes?: {
    id: string;
    name: string;
    levels: {
      name: string;
    };
  };
  assignedClass?: string;
  subjects?: string[];
}

interface TeacherLegacy {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subjects: string[];
  assignedClass: string | null;
  status: 'Actif' | 'Inactif' | 'Congé';
  experience: string;
  qualification: string;
  hireDate: string;
  salary: number;
  address: string;
  emergencyContact: string;
  specializations: string[];
  performanceRating: number;
}

interface Absence {
  id: string;
  teacherId: string;
  teacher: string;
  date: string;
  endDate?: string;
  reason: string;
  status: 'En attente' | 'Approuvée' | 'Refusée';
  substitute: string;
  documents?: string[];
  comments?: string;
}

const TeacherManagement: React.FC = () => {
  const [teachers, setTeachers] = useState<TeacherWithClass[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherWithClass | null>(null);
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'list' | 'absences' | 'performance'>('list');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    withClass: 0,
    available: 0,
    averagePerformance: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [teachersData, classesData, statsData] = await Promise.all([
        teacherService.getTeachers(),
        classService.getClasses(),
        teacherService.getTeacherStats()
      ]);
      
      // Adapter les données pour correspondre à l'interface
      const adaptedTeachers = teachersData?.map(teacher => ({
        ...teacher,
        assignedClass: teacher.classes?.name || null,
        subjects: teacher.classes ? getSubjectsForLevel(teacher.classes.levels?.name) : []
      })) || [];
      
      setTeachers(adaptedTeachers);
      setClasses(classesData || []);
      setStats(statsData);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
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

  const getSubjectsForLevel = (levelName?: string) => {
    const subjectsByLevel: Record<string, string[]> = {
      'Maternelle': ['Éveil', 'Langage', 'Graphisme', 'Jeux éducatifs', 'Motricité'],
      'CI': ['Français', 'Mathématiques', 'Éveil Scientifique', 'Éducation Civique', 'Dessin'],
      'CP': ['Français', 'Mathématiques', 'Éveil Scientifique', 'Éducation Civique', 'Dessin'],
      'CE1': ['Français', 'Mathématiques', 'Histoire-Géographie', 'Sciences', 'Éducation Civique', 'Dessin'],
      'CE2': ['Français', 'Mathématiques', 'Histoire-Géographie', 'Sciences', 'Éducation Civique', 'Dessin'],
      'CM1': ['Français', 'Mathématiques', 'Histoire-Géographie', 'Sciences', 'Éducation Civique', 'Anglais', 'Dessin'],
      'CM2': ['Français', 'Mathématiques', 'Histoire-Géographie', 'Sciences', 'Éducation Civique', 'Anglais', 'Dessin']
    };
    
    return subjectsByLevel[levelName || ''] || [];
  };

  const absences: Absence[] = [
    {
      id: '1',
      teacherId: '1',
      teacher: 'M. Moussa Traore',
      date: '2024-10-15',
      endDate: '2024-10-17',
      reason: 'Congé maladie',
      status: 'Approuvée',
      substitute: 'Mlle Fatoumata Coulibaly',
      documents: ['certificat_medical.pdf'],
      comments: 'Grippe saisonnière, repos recommandé'
    },
    {
      id: '2',
      teacherId: '2',
      teacher: 'Mme Aminata Kone',
      date: '2024-10-12',
      endDate: '2024-10-12',
      reason: 'Formation continue',
      status: 'Approuvée',
      substitute: 'M. Sekou Sangare',
      comments: 'Formation sur les nouvelles méthodes pédagogiques'
    },
    {
      id: '3',
      teacherId: '3',
      teacher: 'M. Ibrahim Sidibe',
      date: '2024-10-10',
      reason: 'Affaire personnelle',
      status: 'En attente',
      substitute: '-',
      comments: 'Demande urgente'
    }
  ];

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = `${teacher.first_name} ${teacher.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || teacher.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Actif': return 'bg-green-50 text-green-700 border-green-200';
      case 'Inactif': return 'bg-red-50 text-red-700 border-red-200';
      case 'Congé': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPerformanceColor = (rating?: number) => {
    if (!rating) return 'text-gray-400';
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-blue-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleAddTeacher = async (teacherData: any) => {
    try {
      await teacherService.createTeacher({
        firstName: teacherData.firstName,
        lastName: teacherData.lastName,
        email: teacherData.email,
        phone: teacherData.phone,
        address: teacherData.address,
        qualification: teacherData.qualification,
        experience: teacherData.experience,
        hireDate: teacherData.hireDate,
        salary: teacherData.salary,
        emergencyContact: teacherData.emergencyContact,
        specializations: teacherData.specializations
      });
      
      await loadData(); // Recharger les données
      alert('Enseignant ajouté avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'enseignant:', error);
      alert('Erreur lors de l\'ajout de l\'enseignant. Veuillez réessayer.');
    }
  };

  const handleDeleteTeacher = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet enseignant ? Cette action est irréversible.')) {
      try {
        await teacherService.deleteTeacher(id);
        await loadData();
        alert('Enseignant supprimé avec succès !');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression. Veuillez réessayer.');
      }
    }
  };

  const handleUpdateTeacher = async (id: string, updates: Partial<SupabaseTeacher>) => {
    try {
      await teacherService.updateTeacher(id, updates);
      await loadData();
      alert('Enseignant mis à jour avec succès !');
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert('Erreur lors de la mise à jour. Veuillez réessayer.');
    }
  };

  const renderStars = (rating?: number) => {
    if (!rating) return <span className="text-gray-400">Non évalué</span>;
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-sm ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  const calculateAge = (birthDate?: string) => {
    if (!birthDate) return 'Non renseigné';
    const today = new Date();
    const birth = new Date(birthDate);
    return today.getFullYear() - birth.getFullYear();
  };

  // Classes disponibles (sans enseignant assigné)
  const availableClasses = classes
    .filter(c => !c.teacher_id)
    .map(c => c.name);

  const TeacherDetailModal = ({ teacher, onClose }: { teacher: TeacherWithClass; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-xl">
                  {teacher.first_name[0]}{teacher.last_name[0]}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {teacher.first_name} {teacher.last_name}
                </h2>
                <p className="text-gray-600">{teacher.qualification}</p>
                <div className="flex items-center space-x-2 mt-1">
                  {renderStars(teacher.performance_rating)}
                  <span className={`font-medium ${getPerformanceColor(teacher.performance_rating)}`}>
                    {teacher.performance_rating}/5
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XCircle className="h-6 w-6 text-gray-500" />
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
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700">{teacher.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700">{teacher.phone}</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-gray-400 mt-1">🏠</span>
                    <span className="text-gray-700">{teacher.address}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-400">🚨</span>
                    <span className="text-gray-700">{teacher.emergency_contact}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Spécialisations</h3>
                <div className="flex flex-wrap gap-2">
                  {teacher.specializations?.map((spec, index) => (
                    <span key={index} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Informations professionnelles */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations Professionnelles</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Statut:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(teacher.status)}`}>
                      {teacher.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Classe assignée:</span>
                    <span className="font-medium text-gray-800">
                      {teacher.classes?.name || 'Aucune'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expérience:</span>
                    <span className="font-medium text-gray-800">{teacher.experience}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date d'embauche:</span>
                    <span className="font-medium text-gray-800">
                      {new Date(teacher.hire_date).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Salaire:</span>
                    <span className="font-medium text-gray-800">
                      {teacher.salary?.toLocaleString()} FCFA
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Matières Enseignées</h3>
                <div className="flex flex-wrap gap-2">
                  {teacher.subjects && teacher.subjects.length > 0 ? (
                    teacher.subjects.map((subject, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                        {subject}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 italic">Aucune matière assignée</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              Modifier
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Assigner Classe
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex items-center space-x-3">
          <Loader className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Chargement des enseignants depuis Supabase...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Enseignants</h1>
          <p className="text-gray-600">Personnel enseignant, affectations et suivi des performances - Données en temps réel</p>
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
          
          <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Planning</span>
          </button>
          
          <button 
            onClick={() => setShowAddTeacherModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Nouvel Enseignant</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Enseignants</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <UserCheck className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Actifs</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-xl">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avec Classe</p>
              <p className="text-2xl font-bold text-blue-600">{stats.withClass}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Disponibles</p>
              <p className="text-2xl font-bold text-orange-600">{stats.available}</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-xl">
              <AlertCircle className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Moyenne Perf.</p>
              <p className="text-2xl font-bold text-purple-600">{stats.averagePerformance.toFixed(1)}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('list')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'list'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Liste des Enseignants
            </button>
            <button
              onClick={() => setActiveTab('absences')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'absences'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Absences ({absences.filter(a => a.status === 'En attente').length})
            </button>
            <button
              onClick={() => setActiveTab('performance')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'performance'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Performances
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'list' && (
            <>
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher par nom, email ou téléphone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="Actif">Actif</option>
                  <option value="Inactif">Inactif</option>
                  <option value="Congé">En congé</option>
                </select>
                
                <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
                  <Filter className="h-4 w-4" />
                  <span>Filtres</span>
                </button>
              </div>

              {/* Teachers Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Enseignant</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Classe Assignée</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expérience</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Performance</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredTeachers.map((teacher) => (
                      <tr key={teacher.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-medium">
                                {teacher.first_name[0]}{teacher.last_name[0]}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{teacher.first_name} {teacher.last_name}</p>
                              <p className="text-sm text-gray-500">{teacher.qualification}</p>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Phone className="h-3 w-3 text-gray-400" />
                              <span className="text-sm text-gray-600">{teacher.phone}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Mail className="h-3 w-3 text-gray-400" />
                              <span className="text-sm text-gray-600">{teacher.email}</span>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          {teacher.classes?.name ? (
                            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                              {teacher.classes.name}
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-gray-50 text-gray-500 rounded-full text-sm">
                              Disponible
                            </span>
                          )}
                        </td>
                        
                        <td className="px-6 py-4 text-gray-600">{teacher.experience}</td>
                        
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            {renderStars(teacher.performance_rating)}
                            <span className={`font-medium ${getPerformanceColor(teacher.performance_rating)}`}>
                              {teacher.performance_rating || 'N/A'}
                            </span>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(teacher.status)}`}>
                            {teacher.status}
                          </span>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => setSelectedTeacher(teacher)}
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
                              onClick={() => handleDeleteTeacher(teacher.id)}
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
            </>
          )}

          {activeTab === 'absences' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Gestion des Absences</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Nouvelle Demande
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Enseignant</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Période</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Raison</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remplaçant</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {absences.map((absence) => (
                      <tr key={absence.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-800">{absence.teacher}</td>
                        <td className="px-6 py-4 text-gray-600">
                          {absence.endDate ? 
                            `${new Date(absence.date).toLocaleDateString('fr-FR')} - ${new Date(absence.endDate).toLocaleDateString('fr-FR')}` :
                            new Date(absence.date).toLocaleDateString('fr-FR')
                          }
                        </td>
                        <td className="px-6 py-4 text-gray-600">{absence.reason}</td>
                        <td className="px-6 py-4 text-gray-600">{absence.substitute}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            absence.status === 'Approuvée' 
                              ? 'bg-green-50 text-green-700'
                              : absence.status === 'Refusée'
                              ? 'bg-red-50 text-red-700'
                              : 'bg-yellow-50 text-yellow-700'
                          }`}>
                            {absence.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {absence.status === 'En attente' && (
                            <div className="flex items-center space-x-2">
                              <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors">
                                Approuver
                              </button>
                              <button className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors">
                                Refuser
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Évaluation des Performances</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teachers.map((teacher) => (
                  <div key={teacher.id} className="bg-gray-50 p-6 rounded-xl">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {teacher.first_name[0]}{teacher.last_name[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{teacher.first_name} {teacher.last_name}</p>
                        <p className="text-sm text-gray-500">{teacher.classes?.name || 'Disponible'}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Performance Globale</span>
                        <div className="flex items-center space-x-2">
                          {renderStars(teacher.performance_rating)}
                          <span className={`font-medium ${getPerformanceColor(teacher.performance_rating)}`}>
                            {teacher.performance_rating || 'N/A'}/5
                          </span>
                        </div>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            (teacher.performance_rating || 0) >= 4.5 ? 'bg-green-500' :
                            (teacher.performance_rating || 0) >= 4.0 ? 'bg-blue-500' :
                            (teacher.performance_rating || 0) >= 3.5 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${((teacher.performance_rating || 0) / 5) * 100}%` }}
                        ></div>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        Expérience: {teacher.experience} • Salaire: {teacher.salary?.toLocaleString()} FCFA
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {classes.length === 0 && !loading && (
        <div className="text-center py-12">
          <UserCheck className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">Aucun enseignant trouvé</p>
          <button 
            onClick={() => setShowAddTeacherModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Ajouter le premier enseignant</span>
          </button>
        </div>
      )}

      {/* Teacher Detail Modal */}
      {selectedTeacher && (
        <TeacherDetailModal 
          teacher={selectedTeacher} 
          onClose={() => setSelectedTeacher(null)} 
        />
      )}

      {/* Add Teacher Modal */}
      <AddTeacherModal
        isOpen={showAddTeacherModal}
        onClose={() => setShowAddTeacherModal(false)}
        onAddTeacher={handleAddTeacher}
        availableClasses={availableClasses}
      />
    </div>
  );
};

export default TeacherManagement;