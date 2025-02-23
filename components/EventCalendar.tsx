"use client";

import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

// イベント型（必要な情報を含む）
export type EventType = {
  name: string;
  date: string;
  description: string;
  // location など、必要に応じて追加
};

type EventCalendarProps = {
  events: EventType[];
};

const EventCalendar: React.FC<EventCalendarProps> = ({ events }) => {
  // 日付ごとにイベントをまとめるマップを作成
  const eventMap: { [key: string]: EventType[] } = {};
  events.forEach((event) => {
    const dateStr = new Date(event.date).toDateString();
    if (!eventMap[dateStr]) {
      eventMap[dateStr] = [];
    }
    eventMap[dateStr].push(event);
  });

  // tileClassName で、イベントがある日は .event-date を付与
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month" && eventMap[date.toDateString()]) {
      return "event-date";
    }
    return "";
  };

  // tileContent は何も返さない
  const tileContent = () => {
    return null;
  };

  return (
    <div className="my-8 event-calendar-container">
      <Calendar tileClassName={tileClassName} tileContent={tileContent} />
    </div>
  );
};

export default EventCalendar;
