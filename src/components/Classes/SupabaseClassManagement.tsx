import React, { useState, useEffect } from 'react';
import { Plus, Users, Calendar, Settings, Loader, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { classService } from '../../services/classService';
import { teacherService } from '../../services/teacherService';
import { levelService } from '../../services/levelService';
import AddClassModal from './AddClassModal';
import TeacherAssignmentModal from './TeacherAssignmentModal';
import ClassDetailModal from './ClassDetailModal';
import ClassScheduleModal from './ClassScheduleModal';
import ChangeTeacherModal from './ChangeTeacherModal';
import type { Class, Teacher, Level } from '../../lib/supabase';

interface ClassWithDetails extends Class {
  levels?: {
    name: string;
    description: string;
    annual_fees: number;
  };
  teachers?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  student_count: number;
  level_name: string;
  teacher_name: string;
  subjects: string[];
}

const SupabaseClassManagement: React.FC = () => {
  const [classes, setClasses] = useState<ClassWithDetails[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    withTeacher: 0,
    withoutTeacher: 0,
    totalStudents: 0,
    averageSize: 0
  });

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showChangeTeacherModal, setShowChangeTeacherModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassWithDetails | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [classesData, levelsData, teachersData, statsData] = await Promise.all([
        classService.getClasses(),
        levelService?.getLevels() || Promise.resolve([]),
        teacherService.getTeachers(),
        classService.getClassStats()
      ]);
      
      setClasses(classesData || []);
      setLevels(levelsData || []);
      setTeachers(teachersData || []);
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

  const handleAddClass = async (classData: any) => {
    try {
      await classService.createClass({
        name: classData.name,
        levelId: classData.levelId,
        teacherId: classData.teacherId,
        capacity: classData.capacity,
        classroom: classData.classroom
      });
      
      await loadData(); // Recharger les données
      alert('Classe créée avec succès !');
    } catch (error) {
      console.error('Erreur lors de la création de la classe:', error);
      alert('Erreur lors de la création de la classe. Veuillez réessayer.');
    }
  };

  const handleTeacherAssignment = async (assignments: any[]) => {
    try {
      // Traiter chaque affectation
      for (const assignment of assignments) {
        await classService.changeClassTeacher(assignment.classId, assignment.teacherId);
      }
      
      await loadData();
      alert(`${assignments.length} affectation(s) enregistrée(s) avec succès !`);
    } catch (error) {
      console.error('Erreur lors des affectations:', error);
      alert('Erreur lors des affectations. Veuillez réessayer.');
    }
  };

  const handleManageClass = (classItem: ClassWithDetails) => {
    setSelectedClass(classItem);
    setShowDetailModal(true);
  };

  const handleViewSchedule = (classItem: ClassWithDetails) => {
    setSelectedClass(classItem);
    setShowScheduleModal(true);
  };

  const handleChangeTeacher = (classItem: ClassWithDetails) => {
    setSelectedClass(classItem);
    setShowChangeTeacherModal(true);
  };

  const handleUpdateClass = async (updatedClass: any) => {
    try {
      await classService.updateClass(updatedClass.id, updatedClass);
      await loadData();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert('Erreur lors de la mise à jour. Veuillez réessayer.');
    }
  };

  const handleTeacherChange = async (classId: string, newTeacherId: string, newTeacherName: string) => {
    try {
      await classService.changeClassTeacher(classId, newTeacherId);
      await loadData();
      alert(`Enseignant changé avec succès pour ${selectedClass?.name} !`);
    } catch (error) {
      console.error('Erreur lors du changement d\'enseignant:', error);
      alert('Erreur lors du changement d\'enseignant. Veuillez réessayer.');
    }
  };

  // Helper functions - defined before usage
  const getLevelColor = (levelName: string) => {
    const colorMap: Record<string, string> = {
      'Maternelle': 'purple',
      'CI': 'blue',
      'CP': 'green',
      'CE1': 'yellow',
      'CE2': 'orange',
      'CM1': 'red',
      'CM2': 'indigo'
    };
    return colorMap[levelName] || 'blue';
  };

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      purple: 'bg-purple-50 text-purple-700',
      blue: 'bg-blue-50 text-blue-700',
      green: 'bg-green-50 text-green-700',
      yellow: 'bg-yellow-50 text-yellow-700',
      orange: 'bg-orange-50 text-orange-700',
      red: 'bg-red-50 text-red-700',
      indigo: 'bg-indigo-50 text-indigo-700'
    };
    return colorMap[color] || colorMap.blue;
  };

  // Calculer les statistiques par niveau
  const levelStats = levels.map(level => {
    const levelClasses = classes.filter(c => c.levels?.name === level.name);
    const totalStudents = levelClasses.reduce((sum, c) => sum + c.student_count, 0);
    
    return {
      name: level.name,
      classes: levelClasses.length,
      students: totalStudents,
      color: getLevelColor(level.name)
    };
  });

  // Préparer les données pour les modals
  const availableTeachers = teachers.map(t => ({
    id: t.id,
    name: `${t.first_name} ${t.last_name}`,
    isAvailable: !classes.some(c => c.teacher_id === t.id)
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex items-center space-x-3">
          <Loader className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Chargement des classes depuis Supabase...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Gestion des Classes</h1>
          <p className="text-sm sm:text-base text-gray-600">Organisation des niveaux, classes et emplois du temps - Données en temps réel</p>
          <div className="flex items-center space-x-2 mt-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-green-600">Connecté à Supabase</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button 
            onClick={refreshData}
            disabled={refreshing}
            className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Actualiser</span>
          </button>
          
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
          >
            <Plus className="h-4 w-4" />
            <span>Nouvelle Classe</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Classes</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-blue-600 font-medium">Classes actives</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avec Enseignant</p>
              <p className="text-2xl font-bold text-green-600">{stats.withTeacher}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-xl">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600 font-medium">
              {stats.total > 0 ? Math.round((stats.withTeacher / stats.total) * 100) : 0}% des classes
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Sans Enseignant</p>
              <p className="text-2xl font-bold text-red-600">{stats.withoutTeacher}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-xl">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-red-600 font-medium">Nécessitent un enseignant</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Élèves</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalStudents}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-purple-600 font-medium">
              Moyenne: {stats.averageSize.toFixed(1)} élèves/classe
            </span>
          </div>
        </div>
      </div>

      {/* Levels Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3 sm:gap-4">
        {levelStats.map((level, index) => (
          <div key={index} className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getColorClasses(level.color)}`}>
                {level.name}
              </span>
              <Settings className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 cursor-pointer hover:text-gray-600" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-gray-600">Classes</span>
                <span className="font-medium text-gray-800">{level.classes}</span>
              </div>
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-gray-600">Élèves</span>
                <span className="font-medium text-gray-800">{level.students}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Classes Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">Liste des Classes</h2>
            <div className="flex items-center space-x-2">
              <span className="text-xs sm:text-sm text-gray-500">Total: {classes.length} classes</span>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Classe</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Niveau</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Enseignant Titulaire</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Effectif</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Taux de Remplissage</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {classes.map((classItem) => {
                const fillRate = (classItem.student_count / classItem.capacity) * 100;
                
                return (
                  <tr key={classItem.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 sm:px-6 py-4">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-blue-600 font-medium text-xs sm:text-sm">
                            {classItem.name.substring(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm sm:text-base font-medium text-gray-800">{classItem.name}</p>
                          <p className="text-xs text-gray-500">
                            {classItem.classroom || 'Salle non définie'}
                          </p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-3 sm:px-6 py-4">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {classItem.level_name}
                      </span>
                    </td>
                    
                    <td className="px-3 sm:px-6 py-4">
                      <div>
                        <p className="text-sm sm:text-base font-medium text-gray-800">
                          {classItem.teacher_name || 'Non assigné'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {classItem.teacher_name ? 'Enseignant unique' : 'Poste vacant'}
                        </p>
                      </div>
                    </td>
                    
                    <td className="px-3 sm:px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Users className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                        <span className="text-sm sm:text-base text-gray-800">
                          {classItem.student_count}/{classItem.capacity}
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-3 sm:px-6 py-4 hidden lg:table-cell">
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all ${
                              fillRate >= 90 ? 'bg-red-500' : 
                              fillRate >= 75 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${fillRate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-600 w-12">
                          {Math.round(fillRate)}%
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-3 sm:px-6 py-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                        <button 
                          onClick={() => handleManageClass(classItem)}
                          className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium"
                        >
                          Gérer Classe
                        </button>
                        <span className="text-gray-300 hidden sm:inline">|</span>
                        <button 
                          onClick={() => handleViewSchedule(classItem)}
                          className="text-green-600 hover:text-green-800 text-xs sm:text-sm font-medium"
                        >
                          Planning
                        </button>
                        <span className="text-gray-300 hidden sm:inline">|</span>
                        <button 
                          onClick={() => handleChangeTeacher(classItem)}
                          className="text-purple-600 hover:text-purple-800 text-xs sm:text-sm font-medium"
                        >
                          Changer Enseignant
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {classes.length === 0 && !loading && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">Aucune classe configurée</p>
            <button 
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
            >
              <Plus className="h-4 w-4" />
              <span>Créer la première classe</span>
            </button>
          </div>
        )}
      </div>

      {/* Teacher Assignment Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">Affectation des Enseignants</h3>
            <p className="text-sm sm:text-base text-gray-600">Système d'enseignant unique - Un enseignant par classe pour toutes les matières</p>
          </div>
          <button 
            onClick={() => setShowAssignmentModal(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base whitespace-nowrap"
          >
            Gérer les Affectations
          </button>
        </div>
        
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-100 rounded-lg">
            <p className="text-xs sm:text-sm text-gray-600">Classes sans enseignant</p>
            <p className="text-xl sm:text-2xl font-bold text-red-600">{stats.withoutTeacher}</p>
          </div>
          <div className="p-4 border border-gray-100 rounded-lg">
            <p className="text-xs sm:text-sm text-gray-600">Enseignants disponibles</p>
            <p className="text-xl sm:text-2xl font-bold text-green-600">{availableTeachers.filter(t => t.isAvailable).length}</p>
          </div>
          <div className="p-4 border border-gray-100 rounded-lg">
            <p className="text-xs sm:text-sm text-gray-600">Total élèves</p>
            <p className="text-xl sm:text-2xl font-bold text-blue-600">{stats.totalStudents}</p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddClassModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddClass={handleAddClass}
        availableTeachers={availableTeachers}
        levels={levels}
      />

      <TeacherAssignmentModal
        isOpen={showAssignmentModal}
        onClose={() => setShowAssignmentModal(false)}
        onAssignTeacher={handleTeacherAssignment}
        classes={classes}
        teachers={teachers}
      />

      {selectedClass && (
        <>
          <ClassDetailModal
            isOpen={showDetailModal}
            onClose={() => {
              setShowDetailModal(false);
              setSelectedClass(null);
            }}
            classData={selectedClass}
            onUpdateClass={handleUpdateClass}
          />

          <ClassScheduleModal
            isOpen={showScheduleModal}
            onClose={() => {
              setShowScheduleModal(false);
              setSelectedClass(null);
            }}
            classData={selectedClass}
          />

          <ChangeTeacherModal
            isOpen={showChangeTeacherModal}
            onClose={() => {
              setShowChangeTeacherModal(false);
              setSelectedClass(null);
            }}
            classData={selectedClass}
            onChangeTeacher={handleTeacherChange}
            availableTeachers={availableTeachers.filter(t => t.isAvailable)}
          />
        </>
        levels={levels}
      )}
    </div>
  );
};

export default SupabaseClassManagement;