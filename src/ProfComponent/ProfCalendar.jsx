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
  const [selectedEvent, setSelectedEvent] = useState(null);
  
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

  const handlePrevMonth = () => {
    calendarRef.current?.getApi()?.prev();
  };

  const handleNextMonth = () => {
    calendarRef.current?.getApi()?.next();
  };

  const handleSaveSchedule = (newTest) => {
    if (newTest.id) {
      setEvents(prev => prev.map((event) => (
        String(event.id) === String(newTest.id)
          ? {
              ...event,
              ...newTest,
              type: 'update',
              backgroundColor: '#007bff',
              borderColor: '#007bff',
              textColor: '#ffffff'
            }
          : event
      )));
      return;
    }

    const styledEvent = {
      ...newTest,
      id: newTest.id || `event-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type: 'create',
      backgroundColor: '#007bff',
      borderColor: '#007bff',
      textColor: '#ffffff'
    };

    setEvents(prev => [...prev, styledEvent]);
  };

  const handleDeleteSchedule = (eventToDelete) => {
    if (!eventToDelete) return;

    if (!window.confirm(`정말로 ${eventToDelete.title} 시험 일정을 삭제하시겠습니까?`)) {
      return;
    }

    setEvents(prev => prev.map((event) => (
      String(event.id) === String(eventToDelete.id)
        ? { ...event, type: 'delete' }
        : event
    )));

    const readStatus = localStorage.getItem('read_notifications') ? JSON.parse(localStorage.getItem('read_notifications')) : {};
    delete readStatus[eventToDelete.id];
    localStorage.setItem('read_notifications', JSON.stringify(readStatus));

    setIsFormOpen(false);
    setSelectedEvent(null);
  };

  const handleEventClick = (clickInfo) => {
    const eventId = clickInfo.event.id;
    const currentEvent = events.find(e => String(e.id) === String(eventId));
    
    if (!currentEvent) return;

    setSelectedEvent(currentEvent);
    setIsFormOpen(true);
  };

  const handleOpenCreateForm = () => {
    setSelectedEvent(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="prof-main-container">
      <div className="prof-content-area">
        
        {activeTab === 'calendar' && (
          <div className="prof-calendar-view">
            <div className="prof-calendar-title-bar">
              <button
                type="button"
                className="prof-calendar-nav-btn"
                onClick={handlePrevMonth}
                aria-label="이전 월"
              >
                ‹
              </button>
              <h1 className="prof-calendar-year-month">{calendarTitle}</h1>
              <button
                type="button"
                className="prof-calendar-nav-btn"
                onClick={handleNextMonth}
                aria-label="다음 월"
              >
                ›
              </button>
            </div>
            
            <button className="add-exam-btn" onClick={handleOpenCreateForm}>
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
        mode={selectedEvent ? 'edit' : 'create'}
        initialData={selectedEvent}
        onClose={handleCloseForm}
        onSave={handleSaveSchedule}
        onDelete={handleDeleteSchedule}
      />
    </div>
  );
}

export default ProfCalendar;