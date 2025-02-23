"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

const EventDetail = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [eventData, setEventData] = useState({
    name: "",
    date: "",
    description: "",
    location: "",
    time: ["00:00", "01:00"],
    googlePhotoUrl: "",
    walicaUrl: "",
    isPastEvent: false,
    isTimeUndefined: false,
    startHour: "00",
    startMinute: "00",
    endHour: "01",
    endMinute: "00",
    creator: "",
    categories: [] as string[],
  });

  const [participants, setParticipants] = useState<string[]>([]);
  const [newParticipantName, setNewParticipantName] = useState("");
  const [participantKey, setParticipantKey] = useState("");

  useEffect(() => {
    const name = searchParams.get("name");
    const date = searchParams.get("date");
    const description = searchParams.get("description");
    const time = searchParams.get("time");
    const googlePhotoUrl = searchParams.get("googlePhotoUrl");
    const walicaUrl = searchParams.get("walicaUrl");
    const creator = searchParams.get("creator");
    const categoriesParam = searchParams.get("categories");
    const isTimeUndefined = searchParams.get("isTimeUndefined") === "true";

    const pad = (value: string) => (value.length === 1 ? "0" + value : value);

    let eventTime: string[];
    if (!time || time === "時間未定" || !time.includes("〜")) {
      eventTime = ["00:00", "01:00"];
    } else {
      eventTime = time.split("〜");
    }

    const startParts = eventTime[0].split(":");
    const endParts = eventTime[1].split(":");
    const paddedStartHour = pad(startParts[0]);
    const paddedStartMinute = pad(startParts[1]);
    const paddedEndHour = pad(endParts[0]);
    const paddedEndMinute = pad(endParts[1]);
    const paddedTime = [
      `${paddedStartHour}:${paddedStartMinute}`,
      `${paddedEndHour}:${paddedEndMinute}`,
    ];

    const isPastEvent = new Date(date || "") < new Date();
    const categories = categoriesParam ? categoriesParam.split(",") : [];

    setEventData({
      name: name || "",
      date: date || "",
      description: description || "",
      location: "",
      time: paddedTime,
      googlePhotoUrl: googlePhotoUrl || "",
      walicaUrl: walicaUrl || "",
      isPastEvent,
      isTimeUndefined,
      startHour: paddedStartHour,
      startMinute: paddedStartMinute,
      endHour: paddedEndHour,
      endMinute: paddedEndMinute,
      creator: creator || "",
      categories,
    });

    const key = "participants_" + encodeURIComponent((name || "") + "_" + (date || ""));
    setParticipantKey(key);

    const storedParticipants: string[] = JSON.parse(localStorage.getItem(key) || "[]");
    setParticipants(storedParticipants);
  }, [searchParams]);

  const handleJoin = () => {
    if (!newParticipantName.trim()) return;
    const updatedParticipants = [...participants, newParticipantName.trim()];
    setParticipants(updatedParticipants);
    localStorage.setItem(participantKey, JSON.stringify(updatedParticipants));
    setNewParticipantName("");
  };

  const handleDeleteEvent = () => {
    if (!confirm("このイベントを削除してもよろしいですか？")) return;

    const storedEvents: { name: string; date: string; description: string }[] = JSON.parse(localStorage.getItem("events") || "[]");
    const updatedEvents = storedEvents.filter((ev) => {
      return !(ev.name === eventData.name && ev.date === eventData.date && ev.description === eventData.description);
    });

    localStorage.setItem("events", JSON.stringify(updatedEvents));
    localStorage.removeItem(participantKey);
    router.push("/");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white p-8 rounded shadow-lg mb-4">
        <h1 className="text-3xl font-bold mb-4">{eventData.name}</h1>
        <div className="space-y-4">
          <div className="flex items-center">
            <span className="w-32 font-semibold">日付:</span>
            <span className="text-lg text-gray-700">{eventData.date}</span>
          </div>
          <div className="flex items-center">
            <span className="w-32 font-semibold">時間:</span>
            <span className="text-lg text-gray-700">
              {eventData.isTimeUndefined ? "時間未定" : eventData.time.join("〜")}
            </span>
          </div>
          {eventData.location && (
            <div className="flex items-center">
              <span className="w-32 font-semibold">場所:</span>
              <span className="text-lg text-gray-700">{eventData.location}</span>
            </div>
          )}
          <div className="flex items-start">
            <span className="w-32 font-semibold">内容:</span>
            <p className="text-gray-700">{eventData.description}</p>
          </div>
          <div className="flex items-center">
            <span className="w-32 font-semibold">作成者:</span>
            <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              {eventData.creator}
            </span>
          </div>
          {eventData.categories.length > 0 && (
            <div className="flex items-center">
              <span className="w-32 font-semibold">カテゴリー:</span>
              <span className="text-sm text-gray-500">
                {eventData.categories.map((cat) => `#${cat}`).join(" ")}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-8 rounded shadow-lg mb-4">
        <h2 className="text-2xl font-bold mb-4">参加する</h2>
        <div className="flex mb-4">
          <input
            type="text"
            placeholder="お名前を入力してください"
            value={newParticipantName}
            onChange={(e) => setNewParticipantName(e.target.value)}
            className="border p-2 flex-grow"
          />
          <button onClick={handleJoin} className="bg-green-500 text-white px-4 py-2 ml-2 rounded">
            参加する
          </button>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">参加者一覧:</h3>
          {participants.length === 0 ? (
            <p>まだ参加者はいません。</p>
          ) : (
            <ul className="list-disc pl-5">
              {participants.map((name, index) => (
                <li key={index}>{name}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="text-center mb-4">
        <button onClick={handleDeleteEvent} className="bg-red-500 text-white px-4 py-2 rounded">
          このイベントを削除する
        </button>
      </div>

      <div className="text-center mb-4">
        <Link href="/" className="inline-block">
          <div className="bg-blue-500 text-white px-4 py-2 rounded text-center w-48 mx-auto">
            トップページに戻る
          </div>
        </Link>
      </div>
    </div>
  );
};

export default EventDetail;
