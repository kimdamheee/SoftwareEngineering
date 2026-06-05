import React from 'react';
import './Profinfo.css';
import './Stuinfo.css';

function MyInfoPage({ userRole, userData, onLogout, onBack }) {
  const courses = (userData?.courses || userData?.courseNames || []).map((course) => (
    typeof course === 'string' ? { title: course } : course
  ));

  const renderCourseItem = (course, index) => (
    <div key={index} className={`${userRole === 'professor' ? 'prof-course-item' : 'stu-course-item'}`}>
      <h4 className={`${userRole === 'professor' ? 'prof-course-title' : 'stu-course-title'}`}>{course.title}</h4>
      {course.professor && <p className={`${userRole === 'professor' ? 'prof-course-detail' : 'stu-course-detail'}`}>교수: {course.professor}</p>}
      {course.time && <p className={`${userRole === 'professor' ? 'prof-course-detail' : 'stu-course-detail'}`}>{course.time}</p>}
    </div>
  );

  if (userRole === 'professor') {
    return (
      <div className="prof-container">
        <header className="prof-header"><h1>내 정보</h1></header>
        <main className="prof-content">
          <section className="prof-profile-card">
            <div className="prof-profile-info"><h2 className="prof-name">{userData.name}</h2><p className="prof-id">교번: {userData.id}</p></div>
            <div className="prof-divider-line" />
            <div className="prof-profile-body"><span className="prof-label-text">소속</span><h3 className="prof-dept-name">{userData.dept}</h3></div>
          </section>
          <section className="prof-course-section">
            <h2 className="prof-section-title">담당 강의 목록</h2>
            <div className="prof-course-list">
              {courses.length > 0 ? courses.map(renderCourseItem) : <p style={{ color: '#666' }}>담당 강의가 없습니다.</p>}
            </div>
          </section>
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            {onBack && <button className="prof-logout-button" onClick={onBack} style={{ backgroundColor: '#6c757d' }}>메인화면으로</button>}
            <button className="prof-logout-button" onClick={onLogout}>로그아웃</button>
          </div>
        </main>
      </div>
    );
  }

  if (userRole === 'student') {
    return (
      <div className="stu-container">
        <header className="stu-header"><h1>내 정보</h1></header>
        <main className="stu-content">
          <section className="stu-profile-card">
            <div className="stu-profile-info"><h2 className="stu-name">{userData.name}</h2><p className="stu-id">학번: {userData.id}</p></div>
            <div className="stu-divider-line" />
            <div className="stu-profile-body"><span className="stu-label-text">학과</span><h3 className="stu-dept-name">{userData.dept}</h3></div>
          </section>
          <section className="stu-course-section">
            <h2 className="stu-section-title">수강 강의 목록</h2>
            <div className="stu-course-list">
              {courses.length > 0 ? courses.map(renderCourseItem) : <p style={{ color: '#666' }}>수강 중인 강의가 없습니다.</p>}
            </div>
          </section>
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            {onBack && <button className="stu-logout-button" onClick={onBack} style={{ backgroundColor: '#6c757d' }}>메인화면으로</button>}
            <button className="stu-logout-button" onClick={onLogout}>로그아웃</button>
          </div>
        </main>
      </div>
    );
  }
  return <div style={{ padding: '20px', textAlign: 'center' }}>올바르지 않은 접근입니다.</div>;
}

export default MyInfoPage;