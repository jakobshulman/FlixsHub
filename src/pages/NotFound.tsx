import React from "react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-20">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-lg text-gray-600 mb-2">הדף לא נמצא</p>
      <a href="/" className="text-blue-500 underline">חזרה לדף הבית</a>
    </div>
  );
}
