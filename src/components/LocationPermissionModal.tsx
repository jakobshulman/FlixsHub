import React from "react";

interface LocationPermissionModalProps {
  onApprove: () => void;
  onDeny: () => void;
}

const LocationPermissionModal: React.FC<LocationPermissionModalProps> = ({ onApprove, onDeny }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm text-center">
      <h2 className="text-xl font-bold mb-4">הרשאת מיקום</h2>
      <p className="mb-4">כדי להציע לך חוויית שפה מותאמת, נבקש הרשאת מיקום. תוכל לסרב ולבחור שפה ידנית.</p>
      <div className="flex gap-4 justify-center mt-6">
        <button className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700" onClick={onApprove}>אפשר מיקום</button>
        <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300" onClick={onDeny}>בחר שפה ידנית</button>
      </div>
    </div>
  </div>
);

export default LocationPermissionModal;
