import React from 'react';

interface Event {
  name: string;
  date: string;
}

interface EventCalendarProps {
  events: Event[];
}

const EventCalendar: React.FC<EventCalendarProps> = ({ events }) => {
  const renderCalendar = () => {
    // カレンダー表示のロジックをここに実装
    // 例: イベントがある日付をカレンダーに表示する
    return (
      <div className="calendar">
        {events.map((event, index) => (
          <div key={index} className="event-day">
            <p>{event.name}</p>
            <p>{event.date}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="event-calendar">
      {renderCalendar()}
    </div>
  );
};

export default EventCalendar;
