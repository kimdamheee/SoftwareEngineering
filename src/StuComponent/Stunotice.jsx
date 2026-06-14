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

    window.dispatchEvent(new Event('global_notifications_updated'));
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (activeTab === 'unread') return !notif.isRead; 
    if (activeTab === 'read') return notif.isRead;    
    return true; 
  });

  const unreadCount = notifications.filter((notif) => !notif.isRead).length;

  const renderTabButton = (tabKey, label, count) => (
    <button
      onClick={() => setActiveTab(tabKey)}
      className={activeTab === tabKey ? 'filter-tab-btn active' : 'filter-tab-btn'}
    >
      <span>{label}</span>
      {count > 0 && <span className="filter-tab-badge">{count}</span>}
    </button>
  );

  return (
    <div className="notice-container">
      <h2 className="notice-header-title">알림</h2>

      <div className="filter-tab-bar">
        {renderTabButton('all', '전체', unreadCount)}
        {renderTabButton('unread', '읽지 않음', unreadCount)}
        {renderTabButton('read', '읽음', 0)}
      </div>

      <div className="notice-list-wrapper">
        {filteredNotifications.length === 0 ? (
          <div className="no-notice-box">
            🔔 새로운 알림이 없습니다.
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div 
              key={notif.id} 
              onClick={() => handleNotificationClick(notif.id)}
              className={`notice-card-item ${notif.isRead ? '' : 'unread-bg'}`}
            >
              <div className="left-indicator-bar" style={{ backgroundColor: notif.isRead ? '#cbd5e1' : '#1a73e8' }} />
              <div className="notice-card-content">
                <div className="notice-card-top">
                  <h4 className="notice-card-title">{notif.title}</h4>
                  {!notif.isRead && <span className="blue-unread-dot" />}
                </div>
                <p className="notice-card-message">{notif.content}</p>
                <span className="notice-card-date">{notif.time}</span>
              </div>
              
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Stunotice;