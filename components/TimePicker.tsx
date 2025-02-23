// /app/components/TimePicker.tsx

"use client";

const TimePicker = ({ time, onChange }) => (
  <div className="mb-4">
    <div className="flex space-x-40">
    <label className="block text-gray-700 font-bold">開始時間</label>
    <label className="block text-gray-700 font-bold">終了時間</label>
    </div>
    <div className="flex space-x-4">
      <select
        name="startHour"
        value={time.startHour}
        onChange={onChange}
        className="w-1/2 px-4 py-2 border rounded cursor-pointer"
      >
        {[...Array(24).keys()].map(hour => (
          <option key={hour} value={hour}>{hour < 10 ? `0${hour}` : hour}</option>
        ))}
      </select>
      <span>:</span>
      <select
        name="startMinute"
        value={time.startMinute}
        onChange={onChange}
        className="w-1/2 px-4 py-2 border rounded cursor-pointer"
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
        className="w-1/2 px-4 py-2 border rounded cursor-pointer"
      >
        {[...Array(24).keys()].map(hour => (
          <option key={hour} value={hour}>{hour < 10 ? `0${hour}` : hour}</option>
        ))}
      </select>
      <span>:</span>
      <select
        name="endMinute"
        value={time.endMinute}
        onChange={onChange}
        className="w-1/2 px-4 py-2 border rounded cursor-pointer"
      >
        {["00", "15", "30", "45"].map(minute => (
          <option key={minute} value={minute}>{minute}</option>
        ))}
      </select>
    </div>
  </div>
);


export default TimePicker;
