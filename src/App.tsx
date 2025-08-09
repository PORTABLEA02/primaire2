import React, { useState } from 'react';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard/Dashboard';
import StudentManagement from './components/Students/StudentManagement';
import ClassManagement from './components/Classes/ClassManagement';
import FinanceManagement from './components/Finance/FinanceManagement';
import AcademicManagement from './components/Academic/AcademicManagement';
import TeacherManagement from './components/Teachers/TeacherManagement';
import Settings from './components/Settings/Settings';
import ScheduleManagement from './components/Schedule/ScheduleManagement';

function App() {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard />;
      case 'students':
        return <StudentManagement />;
      case 'classes':
        return <ClassManagement />;
      case 'finance':
        return <FinanceManagement />;
      case 'academic':
        return <AcademicManagement />;
      case 'teachers':
        return <TeacherManagement />;
      case 'settings':
        return <Settings />;
      case 'schedule':
        return <ScheduleManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        activeModule={activeModule}
        onModuleChange={setActiveModule}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <Header 
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        <main className="p-6">
          {renderActiveModule()}
        </main>
      </div>
    </div>
  );
}

export default App;