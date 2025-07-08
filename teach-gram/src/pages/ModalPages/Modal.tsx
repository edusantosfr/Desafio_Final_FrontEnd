import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 "
      onClick={onClose}>
      <div
        className="bg-white rounded-[30px] shadow-lg z-60 max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}