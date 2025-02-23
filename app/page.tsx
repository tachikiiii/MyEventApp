"use client";

import { useState, useEffect } from 'react';
import GooglePhotosForm from '../components/GooglePhotosForm';
import WalicaForm from '../components/WalicaForm';
import TimePicker from '../components/TimePicker';
import EventCalendar from '../components/EventCalendar';

// Event型の定義（location と categories を追加）
type Event = {
  name: string;
  date: string;
  description: string;
  location: string; // 任意入力
  googlePhotoUrl: string;
  walicaUrl: string;
  time: {
    startHour: string;
    startMinute: string;
    endHour: string;
    endMinute: string;
  };
  isTimeUndefined: boolean;
  created: number;
  categories: string[];
  creator: string;
};

export default function Home() {
  // イベントデータの状態
  const [events, setEvents] = useState<Event[]>([]);
  // フォームの表示/非表示の状態
  const [showForm, setShowForm] = useState(false);
  // 新規イベントの入力情報（categories を追加）
  const [eventDetails, setEventDetails] = useState({
    name: '',
    date: '',
    description: '',
    location: '',
    googlePhotoUrl: '',
    walicaUrl: '',
    time: { startHour: '00', startMinute: '00', endHour: '01', endMinute: '00' },
    isTimeUndefined: false,
    categories: [] as string[],
    creator: '',
  });
  // 並べ替え順序の状態
  const [sortOrder, setSortOrder] = useState('date');
  // 参加者リストの状態
  const [participants, setParticipants] = useState<string[]>([]);

  // ページロード時にlocalStorageからデータを読み込む
  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem('events') || '[]');
    const storedParticipants = JSON.parse(localStorage.getItem('participants') || '[]');

    if (storedEvents.length > 0) {
      setEvents(storedEvents);
    }
    if (storedParticipants.length > 0) {
      setParticipants(storedParticipants);
    }
  }, []);

  // 並べ替え処理（sortOrderが"date"の場合は日付昇順、"newest"の場合は作成日の降順）
  const sortedEvents = [...events].sort((a, b) => {
    if (sortOrder === 'date') {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    } else {
      return b.created - a.created;
    }
  });

  // すべてのイベントを表示（ページネーションなし）
  const currentEvents = sortedEvents;

  // カテゴリーチェックボックスの変更処理
  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setEventDetails((prev) => ({
        ...prev,
        categories: [...prev.categories, value],
      }));
    } else {
      setEventDetails((prev) => ({
        ...prev,
        categories: prev.categories.filter((cat) => cat !== value),
      }));
    }
  };

  // イベント追加時にlocalStorageに保存
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventDetails.name || !eventDetails.date || !eventDetails.description) {
      alert('イベント名、日付、内容は必須です');
      return;
    }

    if (
      !eventDetails.isTimeUndefined &&
      (eventDetails.time.startHour === eventDetails.time.endHour &&
        eventDetails.time.startMinute === eventDetails.time.endMinute)
    ) {
      alert("開始時間と終了時間は異なる時間にしてください。");
      return;
    }

    // 新しいイベントを追加し、localStorageに保存
    const updatedEvents = [...events, { ...eventDetails, created: Date.now() }];
    setEvents(updatedEvents);
    setEventDetails({
      name: '',
      date: '',
      description: '',
      location: '',
      googlePhotoUrl: '',
      walicaUrl: '',
      time: { startHour: '00', startMinute: '00', endHour: '01', endMinute: '00' },
      isTimeUndefined: false,
      categories: [],
      creator: '',
    });
    localStorage.setItem('events', JSON.stringify(updatedEvents));
    setShowForm(false);
  };

  // イベント詳細ページに遷移するための処理（location 等を追加）
  const handleEventClick = (event: Event) => {
    const timeString = event.isTimeUndefined
      ? "時間未定"
      : `${event.time.startHour}:${event.time.startMinute}〜${event.time.endHour}:${event.time.endMinute}`;
    const eventDetailUrl = `/eventDetail?name=${encodeURIComponent(event.name)}&date=${encodeURIComponent(
      event.date
    )}&description=${encodeURIComponent(event.description)}&time=${encodeURIComponent(
      timeString
    )}&googlePhotoUrl=${encodeURIComponent(event.googlePhotoUrl)}&walicaUrl=${encodeURIComponent(
      event.walicaUrl
    )}&location=${encodeURIComponent(event.location)}&creator=${encodeURIComponent(
      event.creator
    )}&isTimeUndefined=${event.isTimeUndefined}`;
    window.open(eventDetailUrl, '_blank');
  };

  // 入力変更処理（チェックボックス以外はそのまま）
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setEventDetails({
        ...eventDetails,
        [name]: checked,
      });
    } else if (name === "startHour" || name === "startMinute" || name === "endHour" || name === "endMinute") {
      setEventDetails({
        ...eventDetails,
        time: { ...eventDetails.time, [name]: value },
      });
    } else {
      setEventDetails({ ...eventDetails, [name]: value });
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* イベント作成ボタン */}
      <div className="flex justify-center mb-8 mt-8">
        <button onClick={() => setShowForm(true)} className="bg-blue-500 text-white px-8 py-4 rounded font-bold">
          イベントを作る！
        </button>
      </div>

      {/* 並べ替え用プルダウン */}
      <div className="flex justify-end mb-8">
        <label htmlFor="sortOrder" className="mr-2">
          並べ替え:
        </label>
        <select
          id="sortOrder"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="px-4 py-2 border rounded"
        >
          <option value="date">日付順</option>
          <option value="newest">新着順</option>
        </select>
      </div>

      {/* モーダルウィンドウ（イベント作成フォーム） */}
      {showForm && (
        <div className="fixed inset-0 overflow-auto bg-black bg-opacity-50 flex items-start justify-center z-50">
          <div className="bg-white p-8 rounded shadow-lg mt-10 transform transition-all duration-500 opacity-100 animate-modal">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              ×
            </button>
            <form onSubmit={handleSubmit} className="mt-4">
              {/* 作成者 */}
              <div className="mb-4">
                <label className="block text-gray-700">作成者</label>
                <input
                  type="text"
                  name="creator"
                  value={eventDetails.creator}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded"
                  required
                />
              </div>
              {/* イベント名 */}
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
              {/* 日付 */}
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
              {/* 時間未定チェックボックス */}
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  name="isTimeUndefined"
                  checked={eventDetails.isTimeUndefined}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label className="text-gray-700">時間未定</label>
              </div>
              {/* イベント内容 */}
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
              {/* 場所 (任意) */}
              <div className="mb-4">
                <label className="block text-gray-700">場所 (任意)</label>
                <input
                  type="text"
                  name="location"
                  value={eventDetails.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
              {/* カテゴリー用チェックボックス */}
              <div className="mb-4">
                <label className="block text-gray-700">カテゴリー (複数選択可)</label>
                <div className="flex space-x-4">
                  {["飲み会", "旅行", "ドライブ", "ゲーム", "その他"].map((cat) => (
                    <label key={cat} className="flex items-center space-x-1">
                      <input
                        type="checkbox"
                        value={cat}
                        checked={eventDetails.categories.includes(cat)}
                        onChange={handleCategoryChange}
                      />
                      <span>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>
              {/* GooglePhotosForm */}
              <GooglePhotosForm value={eventDetails.googlePhotoUrl} onChange={handleInputChange} />
              {/* WalicaForm */}
              <WalicaForm value={eventDetails.walicaUrl} onChange={handleInputChange} />
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                登録する
              </button>
            </form>
          </div>
        </div>
      )}

      {/* イベント一覧表示 */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {currentEvents.map((event) => {
          const isPastEvent = new Date(event.date) < new Date();
          return (
            <div
              key={event.created}
              className={`relative h-48 md:h-64 aspect-w-4 aspect-h-3 border rounded overflow-hidden bg-cover bg-center text-white cursor-pointer ${isPastEvent ? 'opacity-50' : ''}`}
              style={{ backgroundImage: 'url("/background.png")' }}
              onClick={() => handleEventClick(event)}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white py-12 px-20 rounded shadow-lg text-center">
                  <h2 className="text-xl font-bold text-black">{event.name}</h2>
                  <hr className="w-full border-black my-2" />
                  <p className="text-xl font-semibold text-black">{event.date}</p>
                  <p className="text-lg text-black">
                    {event.isTimeUndefined
                      ? "時間未定"
                      : `${event.time.startHour}:${event.time.startMinute}〜${event.time.endHour}:${event.time.endMinute}`}
                  </p>
                  {/* カテゴリー表示：存在する場合、ハッシュタグ形式でグレー表示 */}
                  {event.categories && event.categories.length > 0 && (
                    <p className="text-sm text-gray-500 mt-2">
                      {event.categories.map((cat) => `#${cat}`).join(" ")}
                    </p>
                  )}
                  {/* 作成者表示をバッジ形式に変更 */}
                  <div className="absolute bottom-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    Created by: {event.creator}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* カレンダー表示：イベント一覧の下に配置 */}
      <EventCalendar events={events} />
    </div>
  );
}
