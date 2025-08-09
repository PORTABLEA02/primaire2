import React, { useState } from 'react';
import { User, Clock, MapPin, BookOpen, Calendar } from 'lucide-react';

interface TeacherScheduleProps {
  teacherId?: string;
}

const TeacherSchedule: React.FC<TeacherScheduleProps> = ({ teacherId }) => {
  const [selectedTeacher, setSelectedTeacher] = useState(teacherId || 'traore');

  const teachers = [
    { id: 'traore', name: 'M. Moussa Traore', subjects: ['Mathématiques', 'Sciences'] },
    { id: 'kone', name: 'Mme Aminata Kone', subjects: ['Français', 'Histoire'] },
    { id: 'sidibe', name: 'M. Ibrahim Sidibe', subjects: ['Anglais'] },
    { id: 'coulibaly', name: 'Mlle Fatoumata Coulibaly', subjects: ['Arts', 'Sport'] }
  ];

  const teacherSchedules = {
    traore: [
      { day: 'Lundi', time: '08:00-09:00', subject: 'Mathématiques', class: 'CM2A', room: 'Salle 12' },
      { day: 'Lundi', time: '09:00-10:00', subject: 'Sciences', class: 'CM1A', room: 'Labo 1' },
      { day: 'Lundi', time: '10:30-11:30', subject: 'Mathématiques', class: 'CM2B', room: 'Salle 12' },
      { day: 'Mardi', time: '08:00-09:00', subject: 'Sciences', class: 'CM2A', room: 'Labo 1' },
      { day: 'Mardi', time: '14:00-15:00', subject: 'Mathématiques', class: 'CM1B', room: 'Salle 15' },
      { day: 'Mercredi', time: '08:00-09:00', subject: 'Mathématiques', class: 'CM2A', room: 'Salle 12' },
      { day: 'Jeudi', time: '09:00-10:00', subject: 'Sciences', class: 'CM1A', room: 'Labo 1' },
      { day: 'Vendredi', time: '08:00-09:00', subject: 'Mathématiques', class: 'CM2B', room: 'Salle 12' }
    ],
    kone: [
      { day: 'Lundi', time: '08:00-09:00', subject: 'Français', class: 'CE2A', room: 'Salle 8' },
      { day: 'Lundi', time: '09:00-10:00', subject: 'Histoire', class: 'CE1A', room: 'Salle 10' },
      { day: 'Mardi', time: '08:00-09:00', subject: 'Français', class: 'CE2B', room: 'Salle 8' },
      { day: 'Mercredi', time: '10:30-11:30', subject: 'Histoire', class: 'CE2A', room: 'Salle 10' },
      { day: 'Jeudi', time: '08:00-09:00', subject: 'Français', class: 'CE1B', room: 'Salle 8' },
      { day: 'Vendredi', time: '09:00-10:00', subject: 'Histoire', class: 'CE2B', room: 'Salle 10' }
    ]
  };

  const currentTeacher = teachers.find(t => t.id === selectedTeacher);
  const schedule = teacherSchedules[selectedTeacher as keyof typeof teacherSchedules] || [];

  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
  const timeSlots = ['08:00-09:00', '09:00-10:00', '10:30-11:30', '11:30-12:30', '14:00-15:00', '15:00-16:00'];

  const getScheduleForSlot = (day: string, timeSlot: string) => {
    return schedule.find(item => item.day === day && item.time === timeSlot);
  };

  const getSubjectColor = (subject: string) => {
    const colors = {
      'Mathématiques': 'bg-blue-100 text-blue-800 border-blue-200',
      'Français': 'bg-green-100 text-green-800 border-green-200',
      'Sciences': 'bg-purple-100 text-purple-800 border-purple-200',
      'Histoire': 'bg-orange-100 text-orange-800 border-orange-200',
      'Anglais': 'bg-pink-100 text-pink-800 border-pink-200',
      'Arts': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Sport': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[subject as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const totalHours = schedule.length;
  const subjectHours = schedule.reduce((acc, item) => {
    acc[item.subject] = (acc[item.subject] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Teacher Selection */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Emploi du Temps Enseignant</h2>
              <p className="text-gray-600">Vue détaillée par enseignant</p>
            </div>
          </div>
          
          <select 
            value={selectedTeacher}
            onChange={(e) => setSelectedTeacher(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {teachers.map(teacher => (
              <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Teacher Info */}
      {currentTeacher && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Heures/Semaine</p>
                <p className="text-2xl font-bold text-gray-800">{totalHours}h</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Classes</p>
                <p className="text-2xl font-bold text-gray-800">{new Set(schedule.map(s => s.class)).size}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Matières</p>
                <p className="text-2xl font-bold text-gray-800">{currentTeacher.subjects.length}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Salles</p>
                <p className="text-2xl font-bold text-gray-800">{new Set(schedule.map(s => s.room)).size}</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl">
                <MapPin className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              {currentTeacher?.name}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>Semaine du 14-18 Octobre 2024</span>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-24">
                  Horaires
                </th>
                {days.map(day => (
                  <th key={day} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {timeSlots.map((timeSlot, timeIndex) => (
                <tr key={timeIndex} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-medium text-gray-700 bg-gray-50">
                    {timeSlot}
                  </td>
                  {days.map(day => {
                    const scheduleItem = getScheduleForSlot(day, timeSlot);
                    
                    return (
                      <td key={day} className="px-2 py-2 text-center">
                        {scheduleItem ? (
                          <div className={`p-3 rounded-lg border-2 ${getSubjectColor(scheduleItem.subject)}`}>
                            <div className="font-medium text-sm mb-1">{scheduleItem.subject}</div>
                            <div className="text-xs opacity-75 mb-1">{scheduleItem.class}</div>
                            <div className="text-xs opacity-60 flex items-center justify-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {scheduleItem.room}
                            </div>
                          </div>
                        ) : (
                          <div className="h-20 flex items-center justify-center text-gray-300">
                            <span className="text-sm">Libre</span>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Subject Distribution */}
      {currentTeacher && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Répartition des Matières</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(subjectHours).map(([subject, hours]) => (
              <div key={subject} className={`p-4 rounded-lg border-2 ${getSubjectColor(subject)}`}>
                <div className="flex items-center justify-between">
                  <span className="font-medium">{subject}</span>
                  <span className="text-sm font-bold">{hours}h</span>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-white bg-opacity-50 rounded-full h-2">
                    <div 
                      className="bg-current h-2 rounded-full opacity-60"
                      style={{ width: `${(hours / totalHours) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherSchedule;