import React from 'react';
import { PersonalConsultantChat } from './PersonalConsultantChat';

export interface AssistenteChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking: (tourId?: string) => void;
  onOpenCalendar: () => void;
}

export const AssistenteChatbot: React.FC<AssistenteChatbotProps> = (props) => {
  return <PersonalConsultantChat {...props} />;
};

export default AssistenteChatbot;

