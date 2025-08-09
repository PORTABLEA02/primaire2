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
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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
    <div className="min-h-screen bg-gray-50 flex relative">
      <Sidebar 
        activeModule={activeModule}
        onModuleChange={setActiveModule}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobile={isMobile}
      />
      
      {/* Overlay for mobile */}
      {isMobile && !sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
      
      <div className={`flex-1 transition-all duration-300 ${
        isMobile ? 'ml-0' : sidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        <Header 
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          isMobile={isMobile}
        />
        
        <main className="p-4 sm:p-6">
          {renderActiveModule()}
        </main>
      </div>
    </div>
  );
}

export default App;