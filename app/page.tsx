"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [events, setEvents] = useState<{ name: string; date: string; description: string; googlePhotoUrl: string; walicaUrl: string }[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [eventDetails, setEventDetails] = useState({ name: '', date: '', description: '', googlePhotoUrl: '', walicaUrl: '' });
  const [currentPage, setCurrentPage] = useState(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventDetails({ ...eventDetails, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEvents([...events, eventDetails]);
    setEventDetails({ name: '', date: '', description: '', googlePhotoUrl: '', walicaUrl: '' });
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
            <p><strong>Google Photos Album:</strong> <a href="${event.googlePhotoUrl}" target="_blank">Open Album</a></p>
            <p><strong>Walica Bill Split:</strong> <a href="${event.walicaUrl}" target="_blank">Go to Walica</a></p>
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

  // Google Photos Appを開くためのリンク
  const handleOpenGooglePhotos = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    // スマホの場合、Google Photosアプリを開く
    if (/android|iphone|ipad|ipod/.test(userAgent)) {
      window.location.href = 'googlephotos://'; // スマホでアプリを開く
    } else {
      // PCの場合、Web版Google Photosに遷移
      window.location.href = 'https://photos.google.com'; // Web版に遷移
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between mb-4">
        <button onClick={() => setShowForm(true)} className="bg-blue-500 text-white px-4 py-2 rounded">
          Create Event
        </button>
        <Link href="/login" legacyBehavior>
          <a className="bg-gray-500 text-white px-4 py-2 rounded">Login</a>
        </Link>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
            <label className="block text-gray-700">Event Name</label>
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
            <label className="block text-gray-700">Event Date</label>
            <input
              type="date"
              name="date"
              value={eventDetails.date}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea
              name="description"
              value={eventDetails.description}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Google Photos Album URL</label>
            <input
              type="url"
              name="googlePhotoUrl"
              value={eventDetails.googlePhotoUrl}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
            <button
              type="button"
              onClick={handleOpenGooglePhotos}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Open Google Photos App
            </button>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Walica URL</label>
            <input
              type="url"
              name="walicaUrl"
              value={eventDetails.walicaUrl}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
            Submit
          </button>
        </form>
      )}

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
                <p className="text-black">{event.date}</p>
                <button onClick={handleOpenGooglePhotos} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
                  Open Google Photos
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

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
