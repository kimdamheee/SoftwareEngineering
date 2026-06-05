import React, { useState } from 'react';
import './ScheduleForm.css';

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
const MINUTE_OPTIONS = ['00', '15', '30', '45'];

function ScheduleForm({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    subject: '',
    professor: '',
    date: '',
    startHour: '09',
    startMinute: '00',
    endHour: '17',
    endMinute: '00',
    location: '',
    range: ''
  });

  const [activeSelect, setActiveSelect] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectClick = (field) => {
    setActiveSelect(activeSelect === field ? null : field);
  };

  const handleOptionClick = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setActiveSelect(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.subject || !formData.date) {
      alert('필수 항목을 입력해주세요.');
      return;
    }

    const startTime = Number(formData.startHour + formData.startMinute);
    const endTime = Number(formData.endHour + formData.endMinute);

    if (endTime < startTime) {
      alert('종료 시간이 시작 시간보다 빠를 수 없습니다.');
      return;
    }

    const formattedTime = `${formData.startHour}:${formData.startMinute}-${formData.endHour}:${formData.endMinute}`;
    const submissionData = { ...formData, time: formattedTime };
    delete submissionData.startHour;
    delete submissionData.startMinute;
    delete submissionData.endHour;
    delete submissionData.endMinute;
    onSave(submissionData);
    onClose();
  };

  const SelectInput = ({ name, value, label, options, field }) => (
    <div className="time-select-group">
      <label>{label}</label>
      <div className="select-container" onClick={() => handleSelectClick(field)}>
        <input type="text" value={value} readOnly />
        <span className="arrow">&#9662;</span>
        {activeSelect === field && (
          <ul className="options-dropdown">
            {options.map(option => (
              <li key={option} onClick={() => handleOptionClick(field, option)}>{option}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>예비 일정 등록</h2>
          <button className="close-x-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>과목명 <span className="required">*</span></label>
            <input
              type="text" name="subject" value={formData.subject} onChange={handleChange}
              placeholder="예: 소프트웨어공학" required
            />
          </div>

          <div className="form-group">
            <label>교수명 <span className="required">*</span></label>
            <input
              type="text" name="professor" value={formData.professor} onChange={handleChange}
              placeholder="예: 김교수" required
            />
          </div>

          <div className="form-group">
            <label>날짜 <span className="required">*</span></label>
            <input
              type="date" name="date" value={formData.date} onChange={handleChange}
              required
            />
          </div>

          <div className="form-group time-picker-group">
            <label>시험 시간 <span className="required">*</span></label>
            <div className="time-selects-container">
              <SelectInput label="시작 시간" value={formData.startHour} options={HOUR_OPTIONS} field="startHour" />
              <div className="separator">:</div>
              <SelectInput value={formData.startMinute} options={MINUTE_OPTIONS} field="startMinute" />
              <div className="range-separator">~</div>
              <SelectInput label="종료 시간" value={formData.endHour} options={HOUR_OPTIONS} field="endHour" />
              <div className="separator">:</div>
              <SelectInput value={formData.endMinute} options={MINUTE_OPTIONS} field="endMinute" />
            </div>
          </div>

          <div className="form-group">
            <label>장소 <span className="required">*</span></label>
            <input
              type="text" name="location" value={formData.location} onChange={handleChange}
              placeholder="예: 성결관 406호" required
            />
          </div>

          <div className="form-group">
            <label>시험 범위 <span className="required">*</span></label>
            <textarea
              name="range" value={formData.range} onChange={handleChange}
              placeholder="예: 1~5장" required
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>취소</button>
            <button type="submit" className="save-btn">저장</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ScheduleForm;