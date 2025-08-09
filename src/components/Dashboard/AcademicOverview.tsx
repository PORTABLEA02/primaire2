import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const academicData = [
  {
    level: 'Maternelle',
    students: 180,
    classes: 8,
    trend: 'up',
    percentage: 5.2
  },
  {
    level: 'Primaire CI-CP',
    students: 240,
    classes: 10,
    trend: 'up',
    percentage: 8.1
  },
  {
    level: 'Primaire CE1-CE2',
    students: 320,
    classes: 12,
    trend: 'up',
    percentage: 3.4
  },
  {
    level: 'Primaire CM1-CM2',
    students: 285,
    classes: 12,
    trend: 'down',
    percentage: -2.1
  }
];

const AcademicOverview: React.FC = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">Répartition Académique</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Niveau</th>
              <th className="text-center py-3 px-2 text-sm font-medium text-gray-600">Élèves</th>
              <th className="text-center py-3 px-2 text-sm font-medium text-gray-600">Classes</th>
              <th className="text-center py-3 px-2 text-sm font-medium text-gray-600">Évolution</th>
            </tr>
          </thead>
          <tbody>
            {academicData.map((level, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-2">
                  <span className="font-medium text-gray-800">{level.level}</span>
                </td>
                <td className="py-4 px-2 text-center">
                  <span className="text-gray-800 font-medium">{level.students}</span>
                </td>
                <td className="py-4 px-2 text-center">
                  <span className="text-gray-600">{level.classes}</span>
                </td>
                <td className="py-4 px-2 text-center">
                  <div className="flex items-center justify-center space-x-1">
                    {level.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`text-sm font-medium ${
                      level.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {Math.abs(level.percentage)}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AcademicOverview;