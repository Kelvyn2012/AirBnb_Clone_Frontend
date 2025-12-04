import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import '../styles/Messages.css';

const Messages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showMobileConversations, setShowMobileConversations] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchConversation(selectedUser.user_id);
    }
  }, [selectedUser]);

  const fetchMessages = async () => {
    try {
      const response = await api.get('/api/messages/');
      setMessages(response.data);
      extractConversations(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const extractConversations = (messages) => {
    const uniqueUsers = {};

    messages.forEach((msg) => {
      const otherUser = msg.sender.user_id === user.user_id ? msg.recipient : msg.sender;

      if (!uniqueUsers[otherUser.user_id]) {
        uniqueUsers[otherUser.user_id] = {
          ...otherUser,
          lastMessage: msg.message_body,
          lastMessageTime: msg.sent_at
        };
      }
    });

    setConversations(Object.values(uniqueUsers));
  };

  const fetchConversation = async (userId) => {
    try {
      const response = await api.get(`/api/messages/conversation/${userId}/`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching conversation:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim() || !selectedUser) return;

    try {
      await api.post('/api/messages/create/', {
        recipient_id: selectedUser.user_id,
        message_body: newMessage
      });

      setNewMessage('');
      fetchConversation(selectedUser.user_id);
    } catch (error) {
      alert('Failed to send message');
    }
  };

  if (loading) return <div className="loading">Loading messages...</div>;

  const handleSelectConversation = (conv) => {
    setSelectedUser(conv);
    setShowMobileConversations(false);
  };

  const handleBackToConversations = () => {
    setShowMobileConversations(true);
    setSelectedUser(null);
  };

  return (
    <div className="messages-page">
      <div className="messages-container">
        <div className={`conversations-sidebar ${showMobileConversations ? 'mobile-visible' : ''}`}>
          <h2>Conversations</h2>
          <div className="conversations-list">
            {conversations.length === 0 ? (
              <p className="no-conversations">No conversations yet</p>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.user_id}
                  className={`conversation-item ${selectedUser?.user_id === conv.user_id ? 'active' : ''}`}
                  onClick={() => handleSelectConversation(conv)}
                >
                  <div className="conversation-user">
                    <strong>{conv.first_name} {conv.last_name}</strong>
                  </div>
                  <p className="last-message">{conv.lastMessage}</p>
                  <small>{new Date(conv.lastMessageTime).toLocaleString()}</small>
                </div>
              ))
            )}
          </div>
        </div>

        <div className={`messages-main ${!showMobileConversations ? 'mobile-visible' : ''}`}>
          {selectedUser ? (
            <>
              <div className="messages-header">
                <button
                  className="mobile-back-button"
                  onClick={handleBackToConversations}
                  aria-label="Back to conversations"
                >
                  ← Back
                </button>
                <h2>{selectedUser.first_name} {selectedUser.last_name}</h2>
              </div>

              <div className="messages-list">
                {messages.map((message) => (
                  <div
                    key={message.message_id}
                    className={`message-item ${message.sender.user_id === user.user_id ? 'sent' : 'received'}`}
                  >
                    <div className="message-content">
                      <p>{message.message_body}</p>
                      <small>{new Date(message.sent_at).toLocaleString()}</small>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="message-form">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="message-input"
                />
                <button type="submit" className="btn-primary">Send</button>
              </form>
            </>
          ) : (
            <div className="no-conversation-selected">
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
