import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Grid, Card, Button, TextField, Divider, CircularProgress, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Send as SendIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const MetricCard = styled(Card)(({ theme }) => ({
  padding: '24px',
  borderRadius: 20,
  border: theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,255,255,0.4)',
  background: theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.65)' : 'rgba(255,255,255,0.7)',
  backdropFilter: 'blur(20px)',
  boxShadow: '0 10px 30px rgba(15,23,42,0.06)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 20px 40px rgba(15,23,42,0.1)',
  },
}));

const SectionCard = styled(Card)(({ theme }) => ({
  borderRadius: 22,
  border: theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,255,255,0.5)',
  background: theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.6)' : 'rgba(255,255,255,0.65)',
  backdropFilter: 'blur(24px)',
  boxShadow: '0 10px 30px rgba(15,23,42,0.05)',
  transition: 'box-shadow 0.3s ease',
  '&:hover': {
    boxShadow: '0 15px 35px rgba(15,23,42,0.08)',
  },
}));

const AdminMessages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeChatUser, setActiveChatUser] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const res = await api.get('/messages/conversations');
      if (res.data && res.data.success) {
        setConversations(res.data.conversations);
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setAlert({ type: 'error', msg: 'Failed to load conversations.' });
    } finally {
      setLoading(false);
    }
  };

  const fetchDirectChat = async (userId, userObj) => {
    try {
      const res = await api.get(`/messages/${userId}`);
      if (res.data && res.data.success) {
        setChatMessages(res.data.messages);
        setActiveChatUser(userObj || { _id: userId });
      }
    } catch (err) {
      console.error('Error fetching chat messages:', err);
    }
  };

  const handleReplyMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChatUser) return;
    setSending(true);
    setAlert(null);
    try {
      const res = await api.post('/messages', {
        recipientId: activeChatUser._id || activeChatUser.userId,
        message: newMessage,
      });
      if (res.data && res.data.success) {
        setNewMessage('');
        setAlert({ type: 'success', msg: 'Reply sent successfully!' });
        fetchDirectChat(activeChatUser._id || activeChatUser.userId, activeChatUser);
        fetchConversations();
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setAlert({ type: 'error', msg: err.response?.data?.message || 'Error sending message.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <Container maxWidth="xl" disableGutters sx={{ py: 3 }} component={motion.div} initial="hidden" animate="visible">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, background: 'linear-gradient(135deg, #4f46e5, #d946ef)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Direct Message Center
          </Typography>
          <Typography sx={{ color: 'text.secondary', maxWidth: 760, fontSize: '1.1rem' }}>
            Read and directly respond to support inquiries and conversations with your clients.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={fetchConversations}
          sx={{ background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)' }}
        >
          Refresh All
        </Button>
      </Box>

      {alert && (
        <Alert severity={alert.type} sx={{ mb: 3 }} onClose={() => setAlert(null)}>
          {alert.msg}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <SectionCard sx={{ height: '100%', minHeight: '500px', p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>
              Client Conversations
            </Typography>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : conversations.length === 0 ? (
              <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 4 }}>
                No message conversations found.
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {conversations.map((conv) => {
                  const isActive = activeChatUser && (activeChatUser._id === conv.userId || activeChatUser.userId === conv.userId);
                  return (
                    <Box
                      key={conv.userId}
                      onClick={() => fetchDirectChat(conv.userId, { _id: conv.userId, name: conv.name })}
                      sx={{
                        p: 2.5,
                        borderRadius: '16px',
                        border: isActive ? '1px solid #4f46e5' : '1px solid rgba(0,0,0,0.04)',
                        cursor: 'pointer',
                        backgroundColor: isActive ? 'rgba(79,70,229,0.06)' : 'background.paper',
                        transition: 'all 0.2s',
                        '&:hover': {
                          backgroundColor: 'rgba(79, 70, 229, 0.04)',
                        }
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
                        {conv.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {conv.lastMessage}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '10px', mt: 0.5, display: 'block' }}>
                        {new Date(conv.lastMessageTime).toLocaleString()}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            )}
          </SectionCard>
        </Grid>

        <Grid item xs={12} md={8}>
          <SectionCard sx={{ height: '100%', minHeight: '500px', p: 3, display: 'flex', flexDirection: 'column' }}>
            {!activeChatUser ? (
              <Box sx={{ m: 'auto', textAlign: 'center', p: 4 }}>
                <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  Select a client from the left to start viewing and replying to their support chat.
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', flex: 1 }}>
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Direct Chat with {activeChatUser.name}
                  </Typography>
                  <Button size="small" onClick={() => fetchDirectChat(activeChatUser._id || activeChatUser.userId, activeChatUser)}>
                    Refresh Messages
                  </Button>
                </Box>
                <Divider sx={{ mb: 2 }} />

                <Box sx={{ flex: 1, minHeight: '320px', maxHeight: '420px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2, mb: 3, p: 1 }}>
                  {chatMessages.length === 0 ? (
                    <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', my: 'auto' }}>
                      No messages in this chat.
                    </Typography>
                  ) : (
                    chatMessages.map((msg) => {
                      const isMe = msg.sender._id === user.id;
                      return (
                        <Box
                          key={msg._id}
                          sx={{
                            alignSelf: isMe ? 'flex-end' : 'flex-start',
                            maxWidth: '75%',
                            backgroundColor: isMe ? '#4f46e5' : 'background.default',
                            color: isMe ? '#fff' : 'text.primary',
                            borderRadius: isMe ? '16px 16px 0 16px' : '16px 16px 16px 0',
                            p: 2,
                            border: isMe ? 'none' : '1px solid rgba(0,0,0,0.04)',
                          }}
                        >
                          <Typography variant="body2">
                            {msg.message}
                          </Typography>
                          <Typography variant="caption" sx={{ color: isMe ? 'rgba(255,255,255,0.7)' : 'text.secondary', fontSize: '10px', display: 'block', mt: 0.5, textAlign: isMe ? 'right' : 'left' }}>
                            {new Date(msg.createdAt).toLocaleString()}
                          </Typography>
                        </Box>
                      );
                    })
                  )}
                </Box>

                <Divider sx={{ mb: 2 }} />
                <Box component="form" onSubmit={handleReplyMessage} sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Type a direct reply..."
                    variant="outlined"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    endIcon={sending ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : <SendIcon />}
                    disabled={sending}
                    sx={{ px: 3 }}
                  >
                    Send
                  </Button>
                </Box>
              </Box>
            )}
          </SectionCard>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminMessages;
