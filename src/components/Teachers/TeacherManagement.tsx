import React from 'react';
import { UserCheck, Plus, Calendar, Phone, Mail, BookOpen } from 'lucide-react';

const TeacherManagement: React.FC = () => {
  const teachers = [
    {
      id: '1',
      firstName: 'Moussa',
      lastName: 'Traore',
      email: 'mtraore@school.edu',
      phone: '+223 70 11 22 33',
      subjects: ['Mathématiques', 'Sciences'],
      classes: ['CM2A', 'CM1B'],
      status: 'Actif',
      experience: '8 ans'
    },
    {
      id: '2',
      firstName: 'Aminata',
      lastName: 'Kone',
      email: 'akone@school.edu',
      phone: '+223 75 44 55 66',
      subjects: ['Français', 'Histoire'],
      classes: ['CE2A', 'CE1A'],
      status: 'Actif',
      experience: '12 ans'
    },
    {
      id: '3',
      firstName: 'Ibrahim',
      lastName: 'Sidibe',
      email: 'isidibe@school.edu',
      phone: '+223 65 77 88 99',
      subjects: ['Anglais'],
      classes: ['CM2A', 'CM1A', 'CM1B'],
      status: 'Actif',
      experience: '5 ans'
    }
  ];

  const absences = [
    {
      teacher: 'M. Traore',
      date: '15 Oct 2024',
      reason: 'Congé maladie',
      status: 'Approuvée',
      substitute: 'Mme Coulibaly'
    },
    {
      teacher: 'Mme Kone',
      date: '12 Oct 2024', 
      reason: 'Formation continue',
      status: 'Approuvée',
      substitute: 'M. Sangare'
    },
    {
      teacher: 'M. Sidibe',
      date: '10 Oct 2024',
      reason: 'Affaire personnelle',
      status: 'En attente',
      substitute: '-'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Enseignants</h1>
          <p className="text-gray-600">Personnel enseignant, affectations et suivi des absences</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Planning</span>
          </button>
          
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Nouvel Enseignant</span>
          </button>
        </div>
      </div>

      {/* Teacher Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Enseignants Actifs</p>
              <p className="text-2xl font-bold text-gray-800">24</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <UserCheck className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-blue-600 font-medium">+2 ce mois</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Taux de Présence</p>
              <p className="text-2xl font-bold text-gray-800">94%</p>
            </div>
            <div className="p-3 bg-green-50 rounded-xl">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '94%' }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Absences ce Mois</p>
              <p className="text-2xl font-bold text-gray-800">8</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-xl">
              <span className="text-2xl">⚠️</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-yellow-600 font-medium">-2 vs mois dernier</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Matières Couvertes</p>
              <p className="text-2xl font-bold text-gray-800">12</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl">
              <BookOpen className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-purple-600 font-medium">100% couverture</span>
          </div>
        </div>
      </div>

      {/* Teachers List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Liste des Enseignants</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Enseignant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Matières</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Classes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expérience</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {teachers.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {teacher.firstName[0]}{teacher.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{teacher.firstName} {teacher.lastName}</p>
                        <p className="text-sm text-gray-500">ID: {teacher.id}</p>
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
                    <div className="flex flex-wrap gap-1">
                      {teacher.subjects.map((subject, index) => (
                        <span key={index} className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs">
                          {subject}
                        </span>
                      ))}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {teacher.classes.map((classItem, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                          {classItem}
                        </span>
                      ))}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 text-gray-600">{teacher.experience}</td>
                  
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                      {teacher.status}
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

      {/* Recent Absences */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Absences Récentes</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Voir tout
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Enseignant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Raison</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remplaçant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {absences.map((absence, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-800">{absence.teacher}</td>
                  <td className="px-6 py-4 text-gray-600">{absence.date}</td>
                  <td className="px-6 py-4 text-gray-600">{absence.reason}</td>
                  <td className="px-6 py-4 text-gray-600">{absence.substitute}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      absence.status === 'Approuvée' 
                        ? 'bg-green-50 text-green-700'
                        : 'bg-yellow-50 text-yellow-700'
                    }`}>
                      {absence.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {absence.status === 'En attente' && (
                      <div className="flex items-center space-x-2">
                        <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                          Approuver
                        </button>
                        <span className="text-gray-300">|</span>
                        <button className="text-red-600 hover:text-red-800 text-sm font-medium">
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
    </div>
  );
};

export default TeacherManagement;