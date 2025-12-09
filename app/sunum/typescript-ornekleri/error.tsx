"use client";

export default function Error({ 
  error, 
  reset 
}: { 
  error: Error; 
  reset: () => void;
}) {
  return (
    <div className="p-4 bg-red-50 rounded-lg">
      <p className="text-red-600">Hata: {error.message}</p>
      <button onClick={reset}>Tekrar Dene</button>
    </div>
  );
}