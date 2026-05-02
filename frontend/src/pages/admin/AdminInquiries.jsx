import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, Card, CircularProgress, Container, Divider, Drawer, IconButton, MenuItem, Select, Stack, Typography, Chip, TablePagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { confirmAlert, errorAlert, successAlert } from '../../utils/alerts';
import { Close as CloseIcon } from '@mui/icons-material';
import { inquiryService } from '../../services';
import useAdminPanelData from './useAdminPanelData';

const MotionCard = motion(Card);

const PanelCard = styled(Card)({
  borderRadius: 22,
  border: '1px solid rgba(255,255,255,0.5)',
  background: 'rgba(255,255,255,0.65)',
  backdropFilter: 'blur(24px)',
  boxShadow: '0 10px 30px rgba(15,23,42,0.05)',
});

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(241,245,249,0.8)',
    transform: 'scale(1.002)',
    boxShadow: '0 4px 12px rgba(15,23,42,0.05)',
    zIndex: 1,
    position: 'relative',
  },
  '& td': {
    borderBottom: '1px solid rgba(148,163,184,0.1)',
  },
}));

const statusTone = {
  new: { bg: 'rgba(245,158,11,0.12)', color: '#b45309' },
  contacted: { bg: 'rgba(37,99,235,0.12)', color: '#1d4ed8' },
  converted: { bg: 'rgba(22,163,74,0.12)', color: '#15803d' },
  rejected: { bg: 'rgba(239,68,68,0.12)', color: '#dc2626' },
};

const statuses = ['new', 'contacted', 'converted', 'rejected'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

const AdminInquiries = () => {
  const { stats, allInquiries, loading, refresh } = useAdminPanelData();
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  const paginatedInquiries = useMemo(
    () => allInquiries.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [allInquiries, page, rowsPerPage]
  );

  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(allInquiries.length / rowsPerPage) - 1);
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [allInquiries.length, page, rowsPerPage]);

  const handleStatusChange = async (id, status) => {
    try {
      await inquiryService.updateStatus(id, { status });
      successAlert('Inquiry updated');
      await refresh();
    } catch (error) {
      errorAlert(error.response?.data?.message || 'Failed to update inquiry');
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await confirmAlert('Delete this inquiry?', 'This will permanently remove the inquiry.');
    if (!confirmed) return;

    try {
      await inquiryService.delete(id);
      successAlert('Inquiry deleted');
      await refresh();
    } catch (error) {
      errorAlert('Failed to delete inquiry');
    }
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handlePageChange = (_, newPage) => {
    setPage(newPage);
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', py: { xs: 8, md: 12 } }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" disableGutters component={motion.div} initial="hidden" animate="visible" variants={containerVariants}>
      <Box sx={{ mb: 4 }} component={motion.div} variants={itemVariants}>
        <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: '-0.04em', mb: 1, background: 'linear-gradient(90deg, #0f172a, #334155)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Inquiries
        </Typography>
        <Typography sx={{ color: '#64748b', maxWidth: 760, fontSize: '1.1rem' }}>
          Review incoming leads, update their status, and keep the inbox organized.
        </Typography>
      </Box>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }} component={motion.div} variants={containerVariants}>
        {[
          { label: 'Total', value: stats?.total ?? 0, tone: '#2563eb' },
          { label: 'New', value: stats?.new ?? 0, tone: '#f59e0b' },
          { label: 'Contacted', value: stats?.contacted ?? 0, tone: '#0ea5e9' },
          { label: 'Converted', value: stats?.converted ?? 0, tone: '#16a34a' },
        ].map((metric) => (
          <PanelCard key={metric.label} component={motion.div} variants={itemVariants} sx={{ p: 2.5, minWidth: { xs: '100%', sm: 160 }, flex: 1 }}>
            <Typography variant="caption" sx={{ color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>
              {metric.label}
            </Typography>
            <Typography variant="h3" sx={{ mt: 1, fontWeight: 900, color: metric.tone }}>
              {metric.value}
            </Typography>
          </PanelCard>
        ))}
      </Stack>

      <MotionCard variants={itemVariants} sx={{ borderRadius: 22, border: '1px solid rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(24px)', p: { xs: 2, md: 3 }, boxShadow: '0 10px 30px rgba(15,23,42,0.05)' }}>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
          Inbox
        </Typography>

        {allInquiries.length === 0 ? (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Typography sx={{ color: '#64748b', fontSize: '1.1rem' }}>No inquiries available.</Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#64748b', fontWeight: 700, borderBottom: '2px solid rgba(148,163,184,0.1)' }}>Name</TableCell>
                  <TableCell sx={{ color: '#64748b', fontWeight: 700, borderBottom: '2px solid rgba(148,163,184,0.1)' }}>Email</TableCell>
                  <TableCell sx={{ color: '#64748b', fontWeight: 700, borderBottom: '2px solid rgba(148,163,184,0.1)' }}>Subject</TableCell>
                  <TableCell sx={{ color: '#64748b', fontWeight: 700, borderBottom: '2px solid rgba(148,163,184,0.1)' }}>Status</TableCell>
                  <TableCell sx={{ color: '#64748b', fontWeight: 700, borderBottom: '2px solid rgba(148,163,184,0.1)' }}>Date</TableCell>
                  <TableCell align="right" sx={{ color: '#64748b', fontWeight: 700, borderBottom: '2px solid rgba(148,163,184,0.1)' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody component={motion.tbody} variants={containerVariants} initial="hidden" animate="visible">
                <AnimatePresence>
                  {paginatedInquiries.map((inquiry) => {
                    const tone = statusTone[inquiry.status] || statusTone.new;

                    return (
                      <StyledTableRow key={inquiry._id} component={motion.tr} variants={itemVariants} layout exit={{ opacity: 0, x: -50 }}>
                        <TableCell sx={{ fontWeight: 600 }}>{inquiry.name}</TableCell>
                        <TableCell sx={{ color: '#475569' }}>{inquiry.email}</TableCell>
                        <TableCell sx={{ fontWeight: 500 }}>{inquiry.subject}</TableCell>
                        <TableCell>
                          <Select
                            size="small"
                            value={inquiry.status || 'new'}
                            onChange={(event) => handleStatusChange(inquiry._id, event.target.value)}
                            sx={{
                              minWidth: 138,
                              backgroundColor: tone.bg,
                              color: tone.color,
                              fontWeight: 700,
                              borderRadius: 2,
                              textTransform: 'capitalize',
                              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: tone.color },
                            }}
                          >
                            {statuses.map((status) => (
                              <MenuItem key={status} value={status} sx={{ textTransform: 'capitalize' }}>
                                {status}
                              </MenuItem>
                            ))}
                          </Select>
                        </TableCell>
                        <TableCell sx={{ color: '#64748b' }}>
                          {new Date(inquiry.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Button variant="text" size="small" onClick={() => setSelectedInquiry(inquiry)} sx={{ textTransform: 'none', fontWeight: 600 }}>
                              Details
                            </Button>
                            <Button variant="outlined" color="error" size="small" onClick={() => handleDelete(inquiry._id)} sx={{ textTransform: 'none', borderRadius: 2 }}>
                              Delete
                            </Button>
                          </Stack>
                        </TableCell>
                      </StyledTableRow>
                    );
                  })}
                </AnimatePresence>
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {allInquiries.length > 0 && (
          <TablePagination
            component="div"
            count={allInquiries.length}
            page={page}
            onPageChange={handlePageChange}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={[5, 8, 15]}
            sx={{ mt: 2, borderTop: '1px solid rgba(148,163,184,0.1)' }}
          />
        )}
      </MotionCard>

      <Drawer anchor="right" open={Boolean(selectedInquiry)} onClose={() => setSelectedInquiry(null)}>
        <Box sx={{ width: { xs: 320, sm: 440 }, p: 4, position: 'relative', background: '#f8fafc', height: '100%' }}>
          <IconButton onClick={() => setSelectedInquiry(null)} sx={{ position: 'absolute', top: 16, right: 16 }} aria-label="Close inquiry details">
            <CloseIcon />
          </IconButton>

          {selectedInquiry && (
            <Stack spacing={3} sx={{ pr: 2 }}>
              <Box>
                <Typography variant="overline" sx={{ color: '#64748b', letterSpacing: '0.12em', fontWeight: 700 }}>
                  Inquiry details
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 900, lineHeight: 1.1, mt: 0.5, color: '#0f172a' }}>
                  {selectedInquiry.subject}
                </Typography>
              </Box>

              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                <Chip label={selectedInquiry.status || 'new'} sx={{ backgroundColor: (statusTone[selectedInquiry.status] || statusTone.new).bg, color: (statusTone[selectedInquiry.status] || statusTone.new).color, fontWeight: 700, textTransform: 'capitalize' }} />
                {selectedInquiry.serviceInterest && <Chip label={selectedInquiry.serviceInterest} variant="outlined" sx={{ fontWeight: 600 }} />}
              </Stack>

              <Divider sx={{ borderColor: 'rgba(148,163,184,0.2)' }} />

              <Box>
                <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Contact Information
                </Typography>
                <Typography sx={{ fontWeight: 600, fontSize: '1.05rem', color: '#1e293b' }}>{selectedInquiry.name}</Typography>
                <Typography sx={{ mt: 0.5, color: '#475569' }}>{selectedInquiry.email}</Typography>
                {selectedInquiry.phone && <Typography sx={{ mt: 0.5, color: '#475569' }}>{selectedInquiry.phone}</Typography>}
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Message
                </Typography>
                <Typography sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, color: '#334155', background: '#fff', p: 2, borderRadius: 2, border: '1px solid rgba(148,163,184,0.1)' }}>{selectedInquiry.message}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  System Info
                </Typography>
                <Typography sx={{ color: '#475569' }}>Created: {new Date(selectedInquiry.createdAt).toLocaleString()}</Typography>
              </Box>

              <Button
                variant="contained"
                size="large"
                sx={{ background: 'linear-gradient(90deg, #2563eb, #0ea5e9)', textTransform: 'none', borderRadius: 2, boxShadow: '0 8px 20px rgba(37,99,235,0.2)', mt: 2 }}
                onClick={() => {
                  setSelectedInquiry(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                Back to inbox
              </Button>
            </Stack>
          )}
        </Box>
      </Drawer>
    </Container>
  );
};

export default AdminInquiries;
