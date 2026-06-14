import React from 'react';
import './StuCalendar.css';

function ScheduleDetailModal({ isOpen, event, onClose }) {
  if (!isOpen || !event) return null;

  return (
    <div className="schedule-detail-overlay" onClick={onClose}>
      <div className="schedule-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="schedule-detail-header">
          <div>
            <p className="schedule-detail-label">일정 상세</p>
            <h2>{event.title}</h2>
          </div>
          <button type="button" className="schedule-detail-close" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="schedule-detail-body">
          <div className="schedule-detail-row">
            <span className="schedule-detail-key">날짜</span>
            <span className="schedule-detail-value">{event.date || '-'}</span>
          </div>
          <div className="schedule-detail-row">
            <span className="schedule-detail-key">시간</span>
            <span className="schedule-detail-value">{event.time || '-'}</span>
          </div>
          <div className="schedule-detail-row">
            <span className="schedule-detail-key">교수명</span>
            <span className="schedule-detail-value">{event.professor || '-'}</span>
          </div>
          <div className="schedule-detail-row">
            <span className="schedule-detail-key">장소</span>
            <span className="schedule-detail-value">{event.location || '-'}</span>
          </div>
          <div className="schedule-detail-row schedule-detail-row--stacked">
            <span className="schedule-detail-key">시험 범위</span>
            <span className="schedule-detail-value schedule-detail-value--wrap">{event.range || '-'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScheduleDetailModal;