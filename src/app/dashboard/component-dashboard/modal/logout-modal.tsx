"use client";

import React from "react";

interface ModalLogoutProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ModalLogout({
  isOpen,
  onClose,
  onConfirm,
}: ModalLogoutProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-[5px] shadow-xl w-96">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Confirm Logout</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-xl"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <p className="mb-6">Are you sure you want to log out?</p>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg  text-red-600 hover:bg-red-600 hover:text-white"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
