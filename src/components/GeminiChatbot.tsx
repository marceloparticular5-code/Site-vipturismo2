import React from 'react';
import { PersonalConsultantChat } from './PersonalConsultantChat';

export interface GeminiChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking: (tourId?: string) => void;
  onOpenCalendar: () => void;
}

export const GeminiChatbot: React.FC<GeminiChatbotProps> = (props) => {
  return <PersonalConsultantChat {...props} />;
};

export default GeminiChatbot;
