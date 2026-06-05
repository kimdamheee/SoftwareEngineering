import React, { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import TestAdd from './TestAdd';
import MyInfoPage from '../InfoPage/MyInfoPage';
import './ProfCalendar.css';

function ProfCalendar({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('calendar');
  const [calendarTitle, setCalendarTitle] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const [events, setEvents] = useState(() => {
    const savedNotifications = localStorage.getItem('global_notifications');
    if (savedNotifications) {
      return JSON.parse(savedNotifications);
    }
    return [];
  });

  const calendarRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('global_notifications', JSON.stringify(events));
    window.dispatchEvent(new Event('global_notifications_updated'));
  }, [events]);

  const handleDatesSet = (dateInfo) => {
    setCalendarTitle(dateInfo.view.title);
  };

  const handleSaveSchedule = (newTest) => {
    const styledEvent = {
      ...newTest,
      type: 'create',
      backgroundColor: '#007bff',
      borderColor: '#007bff',
      textColor: '#ffffff'
    };

    setEvents(prev => [...prev, styledEvent]);
  };

  const handleEventClick = (clickInfo) => {
    const eventId = clickInfo.event.id;
    const currentEvent = events.find(e => String(e.id) === String(eventId));
    
    if (!currentEvent) return;

    const action = prompt("원하는 작업을 선택하세요.\n(1: 일정 수정, 2: 일정 삭제, 취소: 취소)", "1");
    
    if (action === "1") {
      const newDate = prompt("새로운 시험 날짜를 입력하세요 (YYYY-MM-DD)", currentEvent.date);
      if (!newDate) return;
      const newLocation = prompt("새로운 시험 장소를 입력하세요", currentEvent.location);
      if (!newLocation) return;
      const newRange = prompt("새로운 시험 범위를 입력하세요", currentEvent.range);
      if (!newRange) return;

      const updatedEvents = events.map(e => {
        if (String(e.id) === String(eventId)) {
          return {
            ...e,
            date: newDate,
            location: newLocation,
            range: newRange,
            type: 'update'
          };
        }
        return e;
      });

      const readStatus = localStorage.getItem('read_notifications') ? JSON.parse(localStorage.getItem('read_notifications')) : {};
      delete readStatus[eventId];
      localStorage.setItem('read_notifications', JSON.stringify(readStatus));

      setEvents(updatedEvents);
      alert(`${currentEvent.title} 시험 일정이 수정되었습니다.`);
    } 
    
    else if (action === "2") {
      if (confirm(`정말로 ${currentEvent.title} 시험 일정을 삭제하시겠습니까?`)) {
        const updatedEvents = events.map(e => {
        if (String(e.id) === String(eventId)) {
          return {
            ...e,
            type: 'delete'
          };
        }
        return e;
      });

      const readStatus = localStorage.getItem('read_notifications') ? JSON.parse(localStorage.getItem('read_notifications')) : {};
      delete readStatus[eventId];
      localStorage.setItem('read_notifications', JSON.stringify(readStatus));

      setEvents(updatedEvents);
      alert(`${currentEvent.title} 시험 일정이 삭제되었습니다.`);
      }
    }
  };

  return (
    <div className="prof-main-container">
      <div className="prof-content-area">
        
        {activeTab === 'calendar' && (
          <div className="prof-calendar-view">
            <h1 className="prof-calendar-year-month">{calendarTitle}</h1>
            
            <button className="add-exam-btn" onClick={() => setIsFormOpen(true)}>
              + 시험 등록
            </button>
            
            <div className="prof-calendar-box">
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                locale="ko"
                headerToolbar={false}
                datesSet={handleDatesSet}
                events={events.filter(e => e.type !== 'delete')}
                eventClick={handleEventClick}
                dayCellClassNames={(arg) => {
                  if (arg.date.getDay() === 0) return ['sun-cell'];
                  if (arg.date.getDay() === 6) return ['sat-cell'];
                  return [];
                }}
              />
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="prof-profile-view">
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

      <nav className="prof-bottom-nav">
        <button 
          className={`prof-nav-item ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          <span className="prof-nav-icon">📅</span>
          <span className="prof-nav-text">캘린더</span>
        </button>
        <button 
          className={`prof-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <span className="prof-nav-icon">👤</span>
          <span className="prof-nav-text">내 정보</span>
        </button>
      </nav>

      <TestAdd 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveSchedule}
      />
    </div>
  );
}

export default ProfCalendar;