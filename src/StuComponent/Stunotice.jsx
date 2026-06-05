import React, { useState, useEffect } from 'react';
import './Stunotice.css';

function Stunotice({ user }) {
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState([]);

  const getStudentCourseTitles = () => {
    const courseList = user?.courses ?? user?.calendarCourses ?? [];
    return courseList
      .map(course => typeof course === 'string' ? course : course.title)
      .filter(Boolean);
  };

  useEffect(() => {
    const updateNotifications = () => {
      const savedGlobal = localStorage.getItem('global_notifications') ? JSON.parse(localStorage.getItem('global_notifications')) : [];
      const readStatus = localStorage.getItem('read_notifications') ? JSON.parse(localStorage.getItem('read_notifications')) : {};
      const studentCourses = getStudentCourseTitles();
      
      const filtered = savedGlobal
        .filter(event => studentCourses.includes(event.title))
        .map(event => {
        let noticeTitle = `[${event.title}] 시험 등록 공지`;
        let noticeContent = `일시: ${event.date} (${event.time || '시간 미지정'}) / 장소: ${event.location} / 범위: ${event.range}`;

        if (event.type === 'update') {
          noticeTitle = `[${event.title}] 시험 일정 수정 공지`;
          noticeContent = `변경 내용 ➔ 일시: ${event.date} (${event.time || '시간 미지정'}) / 장소: ${event.location} / 범위: ${event.range}`;
        } else if (event.type === 'delete') {
          noticeTitle = `[${event.title}] 시험 일정 삭제 안내`;
          noticeContent = `교수 대시보드에서 해당 시험 일정이 최종 취소(삭제)되었습니다.`;
        }

        return {
          id: event.id,
          title: noticeTitle,
          content: noticeContent,
          isRead: readStatus[event.id] || false,
          time: '방금 전'
        };
      });

    setNotifications(filtered);
    };

    updateNotifications();
    window.addEventListener('global_notifications_updated', updateNotifications);
    window.addEventListener('storage', updateNotifications);

    return () => {
      window.removeEventListener('global_notifications_updated', updateNotifications);
      window.removeEventListener('storage', updateNotifications);
    };
  }, [user]);

  const handleNotificationClick = (id) => {
    const readStatus = localStorage.getItem('read_notifications') ? JSON.parse(localStorage.getItem('read_notifications')) : {};
    readStatus[id] = true;
    localStorage.setItem('read_notifications', JSON.stringify(readStatus));

    setNotifications(prev =>
      prev.map(notif => notif.id === id ? { ...notif, isRead: true } : notif)
    );
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (activeTab === 'unread') return !notif.isRead; 
    if (activeTab === 'read') return notif.isRead;    
    return true; 
  });

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>알림</h2>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button 
          onClick={() => setActiveTab('all')}
          style={activeTab === 'all' ? activeTabStyle : inactiveTabStyle}
        >
          전체
        </button>
        <button 
          onClick={() => setActiveTab('unread')}
          style={activeTab === 'unread' ? activeTabStyle : inactiveTabStyle}
        >
          읽지 않음
        </button>
        <button 
          onClick={() => setActiveTab('read')}
          style={activeTab === 'read' ? activeTabStyle : inactiveTabStyle}
        >
          읽음
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {filteredNotifications.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#888', marginTop: '5px' }}>
            🔔 새로운 알림이 없습니다.
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div 
              key={notif.id} 
              onClick={() => handleNotificationClick(notif.id)}
              style={{
                border: '1px solid #eee',
                borderRadius: '8px',
                padding: '15px',
                backgroundColor: notif.isRead ? '#fff' : '#fff5f5', 
                position: 'relative',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              <h4 style={{ margin: '0 0 5px 0' }}>{notif.title}</h4>
              <p style={{ margin: '0 0 10px 0', color: '#555', fontSize: '14px', lineHeight: '1.4' }}>{notif.content}</p>
              <span style={{ fontSize: '12px', color: '#999' }}>{notif.time}</span>
              
              {!notif.isRead && (
                <span style={{
                  position: 'absolute', top: '15px', right: '15px',
                  width: '8px', height: '8px', backgroundColor: '#007bff', borderRadius: '50%'
                }} />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const activeTabStyle = {
  flex: 1, padding: '10px', border: 'none', borderRadius: '5px',
  backgroundColor: '#007bff', color: '#fff', fontWeight: 'bold', cursor: 'pointer'
};

const inactiveTabStyle = {
  flex: 1, padding: '10px', border: 'none', borderRadius: '5px',
  backgroundColor: '#e0e0e0', color: '#333', cursor: 'pointer'
};

export default Stunotice;