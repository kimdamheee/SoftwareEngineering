import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import StuMain from './StuComponent/StuCalendar';
import ProfMain from './ProfComponent/ProfCalendar';
import MyInfoPage from './InfoPage/MyInfoPage';

export const SAMPLE_STUDENTS = [
  { 
    id: 'st1', 
    pw: '1234', 
    name: '김철수', 
    studentId: '20261101', 
    dept: '컴퓨터공학과', 
    courseNames: ['소프트웨어공학', '인공지능'],
    courses: [
      { title: '소프트웨어공학', professor: '홍길동 교수', time: '월 1-3' },
      { title: '인공지능', professor: '이영희 교수', time: '수 2-4' }
    ] 
  },
  { 
    id: 'st2', 
    pw: '5678', 
    name: '박영희', 
    studentId: '20261102', 
    dept: '컴퓨터공학과', 
    courseNames: ['모바일프로그래밍', '자바프로그래밍'],
    courses: [
      { title: '모바일프로그래밍', professor: '김철 교수', time: '화 3-5' },
      { title: '자바프로그래밍', professor: '홍길동 교수', time: '목 2-4' }
    ] 
  }
];

export const SAMPLE_PROFESSORS = [
  { 
    id: 'pro1', 
    pw: '9012', 
    name: '홍길동 교수', 
    profId: 'P001', 
    dept: '컴퓨터공학과', 
    courseNames: ['소프트웨어공학', '자바프로그래밍 응용', '자바프로그래밍'],
    courses: [
      { title: '소프트웨어공학', professor: '홍길동 교수', time: '월 1-3' },
      { title: '자바프로그래밍 응용', professor: '홍길동 교수', time: '화 1-3' },
      { title: '자바프로그래밍', professor: '홍길동 교수', time: '목 2-4' }
    ] 
  }
];

const AUTH_STORAGE_KEY = 'exam_management_user';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = sessionStorage.getItem(AUTH_STORAGE_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [page, setPage] = useState('main');

  useEffect(() => {
    if (user) {
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem('global_notifications');
    localStorage.removeItem('read_notifications');
    setUser(null);
    setPage('main');
  };

  if (!user) return <LoginPage onLogin={setUser} />;

  if (page === 'info') {
    return <MyInfoPage userRole={user.role} userData={user} onLogout={handleLogout} onBack={() => setPage('main')} />;
  }

  return user.role === 'student' ? (
    <StuMain user={user} onLogout={handleLogout} onGoToInfo={() => setPage('info')} />
  ) : (
    <ProfMain user={user} onLogout={handleLogout} onGoToInfo={() => setPage('info')} />
  );
}

export default App;