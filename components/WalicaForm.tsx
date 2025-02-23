// /app/components/WalicaForm.tsx

"use client";

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
      className="mt-2 bg-gray-200 text-gray-700 px-4 py-2 rounded border border-gray-300 shadow-sm hover:bg-gray-300 ml-auto block"
    >
      Walicaを開く
    </button>
  </div>
);

export default WalicaForm;
