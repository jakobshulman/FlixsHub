import React from "react";

interface LocationPermissionModalProps {
  onApprove: () => void;
  onDeny: () => void;
}

const LocationPermissionModal: React.FC<LocationPermissionModalProps> = ({ onApprove, onDeny }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm text-center">
      <h2 className="text-xl font-bold mb-4">Location Permission</h2>
      <p className="mb-4">To offer you a personalized language experience, we request location permission. You can decline and choose a language manually.</p>
      <div className="flex gap-4 justify-center mt-6">
        <button className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700" onClick={onApprove}>Allow Location</button>
        <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300" onClick={onDeny}>Choose Language Manually</button>
      </div>
    </div>
  </div>
);

export default LocationPermissionModal;
