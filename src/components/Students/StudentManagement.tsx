import React, { useState } from 'react';
import { Search, Filter, Plus, Download, Users } from 'lucide-react';

const StudentManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');

  const students = [
    {
      id: '1',
      firstName: 'Kofi',
      lastName: 'Mensah',
      class: 'CM2A',
      level: 'CM2',
      age: 12,
      guardian: 'Agnes Mensah',
      phone: '+223 70 12 34 56',
      status: 'Actif',
      fees: 'À jour'
    },
    {
      id: '2',
      firstName: 'Fatima',
      lastName: 'Diallo',
      class: 'CE1B',
      level: 'CE1',
      age: 8,
      guardian: 'Mamadou Diallo',
      phone: '+223 75 98 76 54',
      status: 'Actif',
      fees: 'En retard'
    },
    {
      id: '3',
      firstName: 'Amadou',
      lastName: 'Kone',
      class: 'CP2',
      level: 'CP',
      age: 7,
      guardian: 'Aminata Kone',
      phone: '+223 65 44 33 22',
      status: 'Actif',
      fees: 'À jour'
    }
  ];

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
          
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
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
              <p className="text-2xl font-bold text-gray-800">1,247</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
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
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Frais à Jour</p>
              <p className="text-2xl font-bold text-gray-800">89%</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-xl">
              <span className="text-2xl">💰</span>
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
          <h2 className="text-lg font-semibold text-gray-800">Liste des Élèves</h2>
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
              {students.map((student) => (
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
                  <td className="px-6 py-4 text-gray-800">{student.guardian}</td>
                  <td className="px-6 py-4 text-gray-600">{student.phone}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      student.fees === 'À jour' 
                        ? 'bg-green-50 text-green-700' 
                        : 'bg-red-50 text-red-700'
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
    </div>
  );
};

export default StudentManagement;