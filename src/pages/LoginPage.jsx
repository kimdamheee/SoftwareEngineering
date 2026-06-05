import React, { useState } from 'react';
import './LoginPage.css';
import { SAMPLE_STUDENTS, SAMPLE_PROFESSORS } from '../App';

function LoginPage({ onLogin }) {
  const [selectedRole, setSelectedRole] = useState(null);
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!id || !password) {
      alert('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    if (selectedRole === 'student') {
      const student = SAMPLE_STUDENTS.find(s => s.id === id && s.pw === password);
      if (student) {
        onLogin({ 
          role: 'student', 
          name: student.name, 
          id: student.studentId, 
          dept: student.dept, 
          calendarCourses: student.courseNames,
          courses: student.courses
        });
      } else {
        alert('학생 정보가 일치하지 않습니다.\n(힌트: st1 / 1234 또는 st2 / 5678)');
      }
    } else if (selectedRole === 'professor') {
      const professor = SAMPLE_PROFESSORS.find(p => p.id === id && p.pw === password);
      if (professor) {
        onLogin({ 
          role: 'professor', 
          name: professor.name, 
          id: professor.profId, 
          dept: professor.dept, 
          calendarCourses: professor.courseNames,
          courses: professor.courses
        });
      } else {
        alert('교수 정보가 일치하지 않습니다.\n(힌트: pro1 / 9012)');
      }
    }
  };

  return (
    <div className="window-container">
      <div className="window-header">
        <div className="window-dots"><span className="dot"></span><span className="dot"></span><span className="dot"></span></div>
        <div className="window-address-bar"></div>
      </div>
      <div className="window-content">
        <div className="login-box">
          {!selectedRole ? (
            <>
              <h1 className="login-title">시험 일정 관리</h1>
              <p className="login-subtitle">사용자 유형을 선택하세요</p>
              <div className="button-group">
                <button className="btn btn-student" onClick={() => setSelectedRole('student')}>
                  <span className="btn-main-text">학생</span>
                  <span className="btn-sub-text">학생으로 로그인</span>
                </button>
                <button className="btn btn-professor" onClick={() => setSelectedRole('professor')}>
                  <span className="btn-main-text">교수</span>
                  <span className="btn-sub-text">교수로 로그인</span>
                </button>
              </div>
            </>
          ) : (
            <div className="form-container">
              <h1 className="form-title">{selectedRole === 'professor' ? '교수 로그인' : '학생 로그인'}</h1>
              <form onSubmit={handleSubmit} className="login-form">
                <div className="input-group">
                  <label htmlFor="userId">아이디</label>
                  <input type="text" id="userId" value={id} onChange={(e) => setId(e.target.value)} placeholder="아이디를 입력하세요" />
                </div>
                <div className="input-group">
                  <label htmlFor="userPw">비밀번호</label>
                  <input type="password" id="userPw" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호를 입력하세요" />
                </div>
                <button type="submit" className={`submit-btn ${selectedRole === 'professor' ? 'bg-professor' : 'bg-student'}`}>로그인</button>
              </form>
              <button className="back-btn" onClick={() => { setSelectedRole(null); setId(''); setPassword(''); }}>← 이전으로 돌아가기</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;