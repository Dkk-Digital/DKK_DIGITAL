import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Grid, Paper, Accordion, AccordionSummary, AccordionDetails, Button, TextField, MenuItem, Divider, CircularProgress, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ExpandMore as ExpandMoreIcon, MailOutline as MailIcon, ArrowForward as ArrowForwardIcon, Send as SendIcon } from '@mui/icons-material';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(79,70,229,0.06) 0%, rgba(217,70,239,0.04) 100%)',
  padding: '80px 0',
  borderRadius: '24px',
  marginBottom: '48px',
  textAlign: 'center',
  border: theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(255, 255, 255, 0.4)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  [theme.breakpoints.down('sm')]: {
    padding: '56px 16px',
    marginBottom: '32px',
  },
}));

const SupportCard = styled(Paper)(({ theme }) => ({
  padding: '40px 36px',
  borderRadius: '22px',
  border: theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(255, 255, 255, 0.5)',
  background: theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.65)' : 'rgba(255, 255, 255, 0.65)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  boxShadow: '0 8px 30px rgba(0,0,0,0.02)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 20px 45px rgba(79,70,229,0.06)',
    borderColor: 'rgba(79,70,229,0.15)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '28px 20px',
  },
}));

const ContactCard = styled(Paper)(({ theme }) => ({
  padding: '36px',
  borderRadius: '22px',
  border: '1px solid rgba(79, 70, 229, 0.1)',
  background: 'linear-gradient(135deg, rgba(79,70,229,0.03) 0%, rgba(217,70,239,0.02) 100%)',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '16px',
  height: '100%',
}));

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  background: 'transparent',
  boxShadow: 'none',
  border: theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,255,255,0.4)',
  borderRadius: '16px !important',
  marginBottom: '14px',
  backdropFilter: 'blur(6px)',
  '&:before': {
    display: 'none',
  },
  '&.Mui-expanded': {
    margin: '0 0 14px 0',
    background: theme.palette.mode === 'dark' ? 'rgba(30,41,59,0.4)' : 'rgba(255,255,255,0.4)',
    border: '1px solid rgba(79,70,229,0.15)',
  }
}));

const faqData = [
  {
    question: "What digital marketing solutions do you specialize in?",
    answer: "We focus on conversion-driven digital strategies including SEO Optimization, Content Marketing, Paid Advertising (PPC), and Hyper-targeted Social Media Strategies designed to maximize your ROI."
  },
  {
    question: "How do I create a service inquiry?",
    answer: "To start an inquiry, head to the Services page, select a service of interest, or go directly to our Contact Us page to send a customized brief to our growth consultants."
  },
  {
    question: "Can I manage my inquiries online?",
    answer: "Yes. Once registered as a client, you gain access to the client dashboard where you can monitor inquiries, review quotes, and collaborate directly with our team."
  },
  {
    question: "What is your response time for support inquiries?",
    answer: "We aim to address all incoming inquiries and support requests within 24 to 48 business hours. If you are an active premium client, urgent tickets are addressed sooner."
  }
];

const SupportCenter = () => {
  const { isAuthenticated, user } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState('');
  const [activeChatAdmin, setActiveChatAdmin] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingChats, setLoadingChats] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAdmins();
      fetchConversations();
    }
  }, [isAuthenticated]);

  const fetchAdmins = async () => {
    try {
      const res = await api.get('/auth/admins');
      if (res.data && res.data.success) {
        setAdmins(res.data.admins);
        if (res.data.admins.length > 0) {
          setSelectedAdmin(res.data.admins[0]._id);
        }
      }
    } catch (err) {
      console.error('Error fetching admins:', err);
    }
  };

  const fetchConversations = async () => {
    setLoadingChats(true);
    try {
      const res = await api.get('/messages/conversations');
      if (res.data && res.data.success) {
        setConversations(res.data.conversations);
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
    } finally {
      setLoadingChats(false);
    }
  };

  const fetchDirectChat = async (adminId, adminObj) => {
    try {
      const res = await api.get(`/messages/${adminId}`);
      if (res.data && res.data.success) {
        setChatMessages(res.data.messages);
        setActiveChatAdmin(adminObj || { _id: adminId });
      }
    } catch (err) {
      console.error('Error fetching chat messages:', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedAdmin) return;
    setSending(true);
    setAlert(null);
    try {
      const res = await api.post('/messages', {
        recipientId: selectedAdmin,
        message: newMessage,
      });
      if (res.data && res.data.success) {
        setNewMessage('');
        setAlert({ type: 'success', msg: 'Message sent successfully!' });
        fetchConversations();
        if (activeChatAdmin && activeChatAdmin._id === selectedAdmin) {
          fetchDirectChat(selectedAdmin, activeChatAdmin);
        }
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setAlert({ type: 'error', msg: err.response?.data?.message || 'Error sending message.' });
    } finally {
      setSending(false);
    }
  };

  const handleReplyMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChatAdmin) return;
    setSending(true);
    setAlert(null);
    try {
      const res = await api.post('/messages', {
        recipientId: activeChatAdmin._id,
        message: newMessage,
      });
      if (res.data && res.data.success) {
        setNewMessage('');
        setAlert({ type: 'success', msg: 'Message sent successfully!' });
        fetchDirectChat(activeChatAdmin._id, activeChatAdmin);
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
    <Layout>
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <HeroSection>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                mb: 2.5,
                fontSize: { xs: '2.25rem', sm: '2.75rem', md: '3.5rem' },
                background: 'linear-gradient(135deg, #4f46e5 0%, #d946ef 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                letterSpacing: '-1.2px',
              }}
            >
              Support Center
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                maxWidth: '720px',
                margin: '0 auto',
                px: { xs: 2, sm: 0 },
                fontSize: '1.125rem',
                fontWeight: 500,
                lineHeight: 1.6,
              }}
            >
              We're here to help! Explore the FAQs below or reach out directly to our dedicated support team.
            </Typography>
          </HeroSection>
        </motion.div>

        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} md={7}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <SupportCard>
                <Typography
                  variant="h5"
                  sx={{
                    mb: 4,
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                    letterSpacing: '-0.3px',
                  }}
                >
                  Frequently Asked Questions
                </Typography>

                {faqData.map((faq, index) => (
                  <StyledAccordion key={index}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon sx={{ color: '#4f46e5' }} />}
                      sx={{ py: 1 }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: 700, color: 'text.primary' }}>
                        {faq.question}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                        {faq.answer}
                      </Typography>
                    </AccordionDetails>
                  </StyledAccordion>
                ))}
              </SupportCard>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={5}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{ height: '100%' }}
            >
              <ContactCard>
                <MailIcon sx={{ fontSize: 54, color: '#4f46e5', mb: 1, filter: 'drop-shadow(0 4px 12px rgba(79,70,229,0.2))' }} />
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.2px' }}>
                  Need Further Help?
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: '320px', lineHeight: 1.6, mb: 2 }}>
                  Can't find the answers you're looking for? Contact us directly and we'll respond within 24-48 business hours.
                </Typography>
                <Button
                  component={RouterLink}
                  to="/contact"
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    background: 'linear-gradient(135deg, #4f46e5 0%, #d946ef 100%)',
                    boxShadow: '0 8px 25px rgba(79,70,229,0.2)',
                    fontWeight: 700,
                    px: 3.5,
                    py: 1.4,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #4338ca 0%, #c026d3 100%)',
                    }
                  }}
                >
                  Contact Support
                </Button>
              </ContactCard>
            </motion.div>
          </Grid>
        </Grid>

        {isAuthenticated && (
          <Box sx={{ mt: 8 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, letterSpacing: '-0.5px' }}>
              Your Support Tickets & Direct Chat
            </Typography>

            {alert && (
              <Alert severity={alert.type} sx={{ mb: 3 }} onClose={() => setAlert(null)}>
                {alert.msg}
              </Alert>
            )}

            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <SupportCard sx={{ height: '100%' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                    Send a Message to Support
                  </Typography>
                  {admins.length === 0 ? (
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      No support admins available currently.
                    </Typography>
                  ) : (
                    <Box component="form" onSubmit={handleSendMessage}>
                      <TextField
                        select
                        fullWidth
                        label="Support Admin"
                        variant="outlined"
                        value={selectedAdmin}
                        onChange={(e) => setSelectedAdmin(e.target.value)}
                        sx={{ mb: 2 }}
                      >
                        {admins.map((adm) => (
                          <MenuItem key={adm._id} value={adm._id}>
                            {adm.name} ({adm.email})
                          </MenuItem>
                        ))}
                      </TextField>

                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Your inquiry message"
                        variant="outlined"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        sx={{ mb: 3 }}
                      />

                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        endIcon={sending ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : <SendIcon />}
                        disabled={sending}
                      >
                        Send Message
                      </Button>
                    </Box>
                  )}

                  <Divider sx={{ my: 4 }} />

                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    Your Previous Chats
                  </Typography>

                  {loadingChats ? (
                    <CircularProgress size={30} />
                  ) : conversations.length === 0 ? (
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      No past conversations yet.
                    </Typography>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      {conversations.map((conv) => (
                        <Box
                          key={conv.userId}
                          onClick={() => fetchDirectChat(conv.userId, { _id: conv.userId, name: conv.name })}
                          sx={{
                            p: 2,
                            borderRadius: '12px',
                            border: '1px solid rgba(0,0,0,0.04)',
                            cursor: 'pointer',
                            backgroundColor: activeChatAdmin && activeChatAdmin._id === conv.userId ? 'rgba(79, 70, 229, 0.08)' : 'background.paper',
                            '&:hover': {
                              backgroundColor: 'rgba(79, 70, 229, 0.04)',
                            }
                          }}
                        >
                          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                            {conv.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                            {conv.lastMessage}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </SupportCard>
              </Grid>

              <Grid item xs={12} md={8}>
                <SupportCard sx={{ height: '100%', minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
                  {!activeChatAdmin ? (
                    <Box sx={{ m: 'auto', textAlign: 'center', p: 4 }}>
                      <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                        Select a chat or send a message to start direct communication with the team.
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', flex: 1 }}>
                      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          Chat with {activeChatAdmin.name}
                        </Typography>
                        <Button size="small" onClick={() => fetchDirectChat(activeChatAdmin._id, activeChatAdmin)}>
                          Refresh Messages
                        </Button>
                      </Box>
                      <Divider sx={{ mb: 2 }} />

                      <Box sx={{ flex: 1, minHeight: '300px', maxHeight: '420px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2, mb: 3, p: 1 }}>
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
                          label="Type a reply..."
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
                </SupportCard>
              </Grid>
            </Grid>
          </Box>
        )}
      </Container>
    </Layout>
  );
};

export default SupportCenter;
