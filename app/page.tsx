"use client";

import { useState } from 'react';
import Link from 'next/link';

// Google Photos URL入力フォーム
const GooglePhotosForm = ({ value, onChange }) => (
  <div className="mb-4">
    <label className="block text-gray-700">Google Photos URL (任意)</label>
    <input
      type="url"
      name="googlePhotoUrl"
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border rounded"
    />
    <button
      type="button"
      onClick={() => window.open(value, '_blank')}
      className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
    >
      Google Photosを開く
    </button>
  </div>
);

// Walica URL入力フォーム
const WalicaForm = ({ value, onChange }) => (
  <div className="mb-4">
    <label className="block text-gray-700">Walica URL (任意)</label>
    <input
      type="url"
      name="walicaUrl"
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border rounded"
    />
    <button
      type="button"
      onClick={() => window.open(value, '_blank')}
      className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
    >
      Walicaを開く
    </button>
  </div>
);

// 時間と分の入力フォーム
const TimePicker = ({ time, onChange }) => (
  <div className="mb-4">
    <label className="block text-gray-700">時間</label>
    <div className="flex space-x-4">
      <select
        name="startHour"
        value={time.startHour}
        onChange={onChange}
        className="w-1/2 px-4 py-2 border rounded"
      >
        {[...Array(24).keys()].map(hour => (
          <option key={hour} value={hour}>{hour < 10 ? `0${hour}` : hour}</option>
        ))}
      </select>
      <select
        name="startMinute"
        value={time.startMinute}
        onChange={onChange}
        className="w-1/2 px-4 py-2 border rounded"
      >
        {["00", "15", "30", "45"].map(minute => (
          <option key={minute} value={minute}>{minute}</option>
        ))}
      </select>
      <span className="text-xl">〜</span>
      <select
        name="endHour"
        value={time.endHour}
        onChange={onChange}
        className="w-1/2 px-4 py-2 border rounded"
      >
        {[...Array(24).keys()].map(hour => (
          <option key={hour} value={hour}>{hour < 10 ? `0${hour}` : hour}</option>
        ))}
      </select>
      <select
        name="endMinute"
        value={time.endMinute}
        onChange={onChange}
        className="w-1/2 px-4 py-2 border rounded"
      >
        {["00", "15", "30", "45"].map(minute => (
          <option key={minute} value={minute}>{minute}</option>
        ))}
      </select>
    </div>
  </div>
);

export default function Home() {
  const [events, setEvents] = useState<{ name: string; date: string; description: string; googlePhotoUrl: string; walicaUrl: string; time: any }[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [eventDetails, setEventDetails] = useState({ name: '', date: '', description: '', googlePhotoUrl: '', walicaUrl: '', time: { startHour: '00', startMinute: '00', endHour: '01', endMinute: '00' } });
  const [currentPage, setCurrentPage] = useState(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "startHour" || name === "startMinute" || name === "endHour" || name === "endMinute") {
      setEventDetails({
        ...eventDetails,
        time: { ...eventDetails.time, [name]: value }
      });
    } else {
      setEventDetails({ ...eventDetails, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventDetails.name || !eventDetails.date || !eventDetails.description) {
      alert('イベント名、日付、内容は必須です');
      return;
    }
    setEvents([...events, eventDetails]);
    setEventDetails({ name: '', date: '', description: '', googlePhotoUrl: '', walicaUrl: '', time: { startHour: '00', startMinute: '00', endHour: '01', endMinute: '00' } });
    setShowForm(false);
  };

  const handleEventClick = (event: { name: string; date: string; description: string; googlePhotoUrl: string; walicaUrl: string }) => {
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>${event.name}</title>
          </head>
          <body>
            <h1>${event.name}</h1>
            <p><strong>Date:</strong> ${event.date}</p>
            <p><strong>Description:</strong> ${event.description}</p>
            <p><strong>Time:</strong> ${event.time.startHour}:${event.time.startMinute}〜${event.time.endHour}:${event.time.endMinute}</p>
            ${event.googlePhotoUrl && `<p><strong>Google Photos Album:</strong> <a href="${event.googlePhotoUrl}" target="_blank">Open Album</a></p>`}
            ${event.walicaUrl && `<p><strong>Walica Bill Split:</strong> <a href="${event.walicaUrl}" target="_blank">Go to Walica</a></p>`}
          </body>
        </html>
      `);
    }
  };

  const eventsPerPage = 3;
  const totalPages = Math.ceil(events.length / eventsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const currentEvents = events.slice(currentPage * eventsPerPage, (currentPage + 1) * eventsPerPage);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between mb-8 mt-16">
        <button onClick={() => setShowForm(true)} className="bg-blue-500 text-white px-8 py-4 rounded mx-auto font-bold">
          イベントをつくる！！
        </button>
      </div>

      {/* モーダルウィンドウの表示 */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded shadow-lg transform transition-all duration-500 translate-y-10 opacity-100 animate-modal">
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-gray-500 hover:text-black">×</button>
            <form onSubmit={handleSubmit} className="mt-4">
              <div className="mb-4">
                <label className="block text-gray-700">イベント名</label>
                <input
                  type="text"
                  name="name"
                  value={eventDetails.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">日付</label>
                <input
                  type="date"
                  name="date"
                  value={eventDetails.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded"
                  required
                />
              </div>
              {/* 時間入力 */}
              <TimePicker time={eventDetails.time} onChange={handleInputChange} />
              <div className="mb-4">
                <label className="block text-gray-700">イベント内容</label>
                <textarea
                  name="description"
                  value={eventDetails.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded"
                  required
                ></textarea>
              </div>
              <GooglePhotosForm value={eventDetails.googlePhotoUrl} onChange={handleInputChange} />
              <WalicaForm value={eventDetails.walicaUrl} onChange={handleInputChange} />
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                Submit
              </button>
            </form>
          </div>
        </div>
      )}

      {/* イベント一覧表示 */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {currentEvents.map((event, index) => (
          <div
            key={index}
            className="relative h-48 md:h-64 aspect-w-4 aspect-h-3 border rounded overflow-hidden bg-cover bg-center text-white cursor-pointer"
            style={{ backgroundImage: 'url("/background.png")' }}
            onClick={() => handleEventClick(event)}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white py-12 px-20 rounded shadow-lg text-center">
                <h2 className="text-xl font-bold text-black">{event.name}</h2>
                <hr className="w-full border-black my-2" />
                {/* 日付を大きく表示 */}
                <p className="text-xl font-semibold text-black">{event.date}</p>
                {/* 時間は通常のサイズ */}
                <p className="text-black">{event.time.startHour}:{event.time.startMinute}〜{event.time.endHour}:{event.time.endMinute}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ページネーション */}
      {events.length > eventsPerPage && (
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
            className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
