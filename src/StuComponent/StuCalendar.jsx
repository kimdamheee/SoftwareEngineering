import React, { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import ScheduleForm from './ScheduleForm';
import MyInfoPage from '../InfoPage/MyInfoPage';
import Stunotice from './Stunotice';
import './StuCalendar.css';

function StuCalendar({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('calendar');
  const [calendarTitle, setCalendarTitle] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [personalEvents, setPersonalEvents] = useState([]);
  const [professorEvents, setProfessorEvents] = useState([]);
  const [displayEvents, setDisplayEvents] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const calendarRef = useRef(null);

  const getStudentCourseTitles = () => {
    const courseList = user?.courses ?? user?.calendarCourses ?? [];
    return courseList
      .map(course => typeof course === 'string' ? course : course.title)
      .filter(Boolean);
  };

  const updateUnreadCount = () => {
    const savedGlobal = localStorage.getItem('global_notifications') ? JSON.parse(localStorage.getItem('global_notifications')) : [];
    const readStatus = localStorage.getItem('read_notifications') ? JSON.parse(localStorage.getItem('read_notifications')) : {};
    const studentCourseTitles = getStudentCourseTitles();

    const unread = savedGlobal.filter(event => 
      studentCourseTitles.includes(event.title) && !readStatus[event.id]
    );
    setUnreadCount(unread.length);
  };

  useEffect(() => {
    const syncGlobalEvents = () => {
      const savedGlobal = localStorage.getItem('global_notifications');
      const globalList = savedGlobal ? JSON.parse(savedGlobal) : [];
      const studentCourseTitles = getStudentCourseTitles();

      const filteredGlobalEvents = globalList
        .filter(event => studentCourseTitles.includes(event.title) && event.type !== 'delete');

      setProfessorEvents(filteredGlobalEvents);
      setDisplayEvents([...filteredGlobalEvents, ...personalEvents]);
      updateUnreadCount();
    };

    syncGlobalEvents();

    const handleGlobalUpdate = () => syncGlobalEvents();
    const handleStorageEvent = (event) => {
      if (!event.key || event.key === 'global_notifications' || event.key === 'read_notifications') {
        syncGlobalEvents();
      }
    };

    window.addEventListener('global_notifications_updated', handleGlobalUpdate);
    window.addEventListener('storage', handleStorageEvent);

    return () => {
      window.removeEventListener('global_notifications_updated', handleGlobalUpdate);
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, [personalEvents, user]);

  const handleDatesSet = (dateInfo) => {
    setCalendarTitle(dateInfo.view.title);
  };

  const handleSaveSchedule = (newSchedule) => {
    const formattedEvent = {
      id: String(Date.now()),
      title: newSchedule.subject,
      date: newSchedule.date,
      professor: newSchedule.professor,
      location: newSchedule.location,
      range: newSchedule.range,
      time: newSchedule.time,
      backgroundColor: '#ffa801',
      borderColor: '#ffa801',
      textColor: '#ffffff'
    };

    setPersonalEvents(prev => [...prev, formattedEvent]);
  };

  const calculateDDay = (targetDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(targetDate);
    target.setHours(0, 0, 0, 0);
    
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'D-Day';
    return diffDays > 0 ? `D-${diffDays}` : `D+${Math.abs(diffDays)}`;
  };

  return (
    <div className="main-container">
      <div className="content-area">
        
        {activeTab === 'calendar' && (
          <div className="calendar-view">
            <h1 className="calendar-year-month">{calendarTitle}</h1>
            
            <button 
              className="add-schedule-btn" 
              onClick={() => setIsFormOpen(true)}
            >
              + 예비 일정 추가
            </button>
            
            <div className="calendar-box">
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                locale="ko"
                headerToolbar={false}
                datesSet={handleDatesSet}
                events={displayEvents}
              />
            </div>
            
            <div className="upcoming-exams-box">
              <h3>다가오는 시험</h3>
              <ul className="exam-list">
                {professorEvents.length === 0 ? (
                  <li style={{ color: '#888', textAlign: 'center', listStyle: 'none', padding: '10px 0' }}>
                    등록된 시험 일정이 없습니다.
                  </li>
                ) : (
                  professorEvents.map(event => (
                    <li key={event.id}>
                      <span className="d-day">{calculateDDay(event.date)}</span> {event.title}
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'noti' && (
          <div className="noti-view">
            <Stunotice user={user} />
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="profile-view">
            <MyInfoPage 
              userRole={user.role}
              userData={{
                name: user.name,
                id: user.id,
                dept: user.dept,
                courses: user.courses
              }} 
              onLogout={onLogout} 
            />
          </div>
        )}

      </div>

      <nav className="bottom-nav">
        <button 
          className={`nav-item ${activeTab === 'calendar' ? 'active student' : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          <span className="nav-icon">📅</span>
          <span className="nav-text">캘린더</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'noti' ? 'active student' : ''}`}
          onClick={() => setActiveTab('noti')}
          style={{ position: 'relative' }}
        >
          <span className="nav-icon">🔔</span>
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '4px',
              right: '20px',
              backgroundColor: '#ff4d4f',
              color: 'white',
              fontSize: '10px',
              fontWeight: 'bold',
              borderRadius: '10px',
              padding: '2px 6px',
              lineHeight: '1',
              minWidth: '10px',
              textAlign: 'center'
            }}>
              {unreadCount}
            </span>
          )}
          <span className="nav-text">알림</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'profile' ? 'active student' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <span className="nav-icon">👤</span>
          <span className="nav-text">내 정보</span>
        </button>
      </nav>

      <ScheduleForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSave={handleSaveSchedule} 
      />
    </div>
  );
}

export default StuCalendar;