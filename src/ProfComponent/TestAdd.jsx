import React, { useState } from 'react';
import './TestAdd.css';

function TestAdd({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    subject: '',
    professor: '',
    date: '',
    location: '',
    range: ''
  });

  const [startTime, setStartTime] = useState({ hour: '09', minute: '00' });
  const [endTime, setEndTime] = useState({ hour: '10', minute: '00' });

  if (!isOpen) return null;

  const hours = Array.from({ length: 15 }, (_, i) => String(i + 9).padStart(2, '0')); 
  const minutes = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.subject || !formData.professor || !formData.date || !formData.location || !formData.range) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    const startTotal = Number(startTime.hour + startTime.minute);
    const endTotal = Number(endTime.hour + endTime.minute);

    if (endTotal <= startTotal) {
      alert('시험 종료 시간이 시작 시간보다 빠르거나 같을 수 없습니다.');
      return;
    }

    const formattedTime = `${startTime.hour}:${startTime.minute}-${endTime.hour}:${endTime.minute}`;
    const uniqueId = `event-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    onSave({
      id: uniqueId,
      title: formData.subject,
      date: formData.date,
      professor: formData.professor,
      location: formData.location,
      range: formData.range,
      time: formattedTime
    });

    setFormData({ subject: '', professor: '', date: '', location: '', range: '' });
    setStartTime({ hour: '09', minute: '00' });
    setEndTime({ hour: '10', minute: '00' });
    onClose();
  };

  return (
    <div className="test-modal-overlay">
      <div className="test-modal-container">
        
        <div className="test-modal-header">
          <h2>시험 등록</h2>
          <button className="test-close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="test-modal-form">
          <div className="test-form-group">
            <label>과목명 <span className="test-required">*</span></label>
            <input
              type="text" name="subject" value={formData.subject} onChange={handleChange}
              placeholder="예: 소프트웨어공학" required
            />
          </div>

          <div className="test-form-group">
            <label>교수명 <span className="test-required">*</span></label>
            <input
              type="text" name="professor" value={formData.professor} onChange={handleChange}
              placeholder="예: 김교수" required
            />
          </div>

          <div className="test-form-group">
            <label>날짜 <span className="test-required">*</span></label>
            <input
              type="date" name="date" value={formData.date} onChange={handleChange}
              required
            />
          </div>

          <div className="test-form-group">
            <label>시험 시간 <span className="test-required">*</span></label>
            <div className="time-picker-container">
              <div className="time-select-box">
                <select value={startTime.hour} onChange={(e) => setStartTime(prev => ({ ...prev, hour: e.target.value }))}>
                  {hours.map(h => <option key={h} value={h}>{h}시</option>)}
                </select>
                <select value={startTime.minute} onChange={(e) => setStartTime(prev => ({ ...prev, minute: e.target.value }))}>
                  {minutes.map(m => <option key={m} value={m}>{m}분</option>)}
                </select>
              </div>
              <span className="time-wave">~</span>
              <div className="time-select-box">
                <select value={endTime.hour} onChange={(e) => setEndTime(prev => ({ ...prev, hour: e.target.value }))}>
                  {hours.map(h => <option key={h} value={h}>{h}시</option>)}
                </select>
                <select value={endTime.minute} onChange={(e) => setEndTime(prev => ({ ...prev, minute: e.target.value }))}>
                  {minutes.map(m => <option key={m} value={m}>{m}분</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="test-form-group">
            <label>장소 <span className="test-required">*</span></label>
            <input
              type="text" name="location" value={formData.location} onChange={handleChange}
              placeholder="예: 성결관 406호" required
            />
          </div>

          <div className="test-form-group">
            <label>시험 범위 <span className="test-required">*</span></label>
            <textarea
              name="range" value={formData.range} onChange={handleChange}
              placeholder="예: 1~5장" required
            />
          </div>

          <div className="test-modal-actions">
            <button type="button" className="test-cancel-btn" onClick={onClose}>취소</button>
            <button type="submit" className="test-save-btn">저장</button>
          </div>
        </form>

      </div>
    </div>
  );
}

export default TestAdd;