import React from 'react';
import { IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import styles from './ChatWindow.module.css';

const ChatWindow = ({ doctorName, onClose }) => {
  return (
    <div className={styles.chatWindow}>
      <div className={styles.chatHeader}>
        <span>Online Consultation</span>
        <IconButton onClick={onClose}>
          <Close fontSize="small" />
        </IconButton>
      </div>
      <div className={styles.chatBody}>
        <p>Connecting you with {doctorName}...</p>
        {/* Add chat components here */}
      </div>
    </div>
  );
};

export default ChatWindow;