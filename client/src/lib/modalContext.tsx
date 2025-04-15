import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ModalContextProps {
  isModalOpen: boolean;
  setModalOpen: (isOpen: boolean) => void;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export function useModalContext() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModalContext must be used within a ModalProvider');
  }
  return context;
}

interface ModalProviderProps {
  children: ReactNode;
}

export function ModalProvider({ children }: ModalProviderProps) {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <ModalContext.Provider value={{ isModalOpen, setModalOpen }}>
      {children}
    </ModalContext.Provider>
  );
}