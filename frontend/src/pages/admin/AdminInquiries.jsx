import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, Card, CircularProgress, Container, Divider, Drawer, IconButton, MenuItem, Select, Stack, Typography, Chip, TablePagination } from '@mui/material';
import { styled } from '@mui/material/styles';
import { confirmAlert, errorAlert, successAlert } from '../../utils/alerts';
import { Close as CloseIcon } from '@mui/icons-material';
import { inquiryService } from '../../services';
import useAdminPanelData from './useAdminPanelData';

const PanelCard = styled(Card)({
  borderRadius: 22,
  border: '1px solid rgba(148,163,184,0.12)',
  boxShadow: '0 10px 30px rgba(15,23,42,0.05)',
});

const statusTone = {
  new: { bg: 'rgba(245,158,11,0.12)', color: '#b45309' },
  contacted: { bg: 'rgba(37,99,235,0.12)', color: '#1d4ed8' },
  converted: { bg: 'rgba(22,163,74,0.12)', color: '#15803d' },
  rejected: { bg: 'rgba(239,68,68,0.12)', color: '#dc2626' },
};

const statuses = ['new', 'contacted', 'converted', 'rejected'];

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
    <Container maxWidth="xl" disableGutters>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: '-0.04em', mb: 1 }}>
          Inquiries
        </Typography>
        <Typography sx={{ color: '#64748b', maxWidth: 760 }}>
          Review incoming leads, update their status, and keep the inbox organized.
        </Typography>
      </Box>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total', value: stats?.total ?? 0, tone: '#2563eb' },
          { label: 'New', value: stats?.new ?? 0, tone: '#f59e0b' },
          { label: 'Contacted', value: stats?.contacted ?? 0, tone: '#0ea5e9' },
          { label: 'Converted', value: stats?.converted ?? 0, tone: '#16a34a' },
        ].map((metric) => (
          <PanelCard key={metric.label} sx={{ p: 2.5, minWidth: { xs: '100%', sm: 160 }, flex: 1 }}>
            <Typography variant="caption" sx={{ color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {metric.label}
            </Typography>
            <Typography variant="h4" sx={{ mt: 1, fontWeight: 900, color: metric.tone }}>
              {metric.value}
            </Typography>
          </PanelCard>
        ))}
      </Stack>

      <PanelCard sx={{ p: { xs: 2, md: 3 } }}>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
          Inbox
        </Typography>

        {allInquiries.length === 0 ? (
          <Typography sx={{ color: '#64748b' }}>No inquiries available.</Typography>
        ) : (
          <Box sx={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', color: '#64748b' }}>
                  <th style={{ padding: '12px 8px', borderBottom: '1px solid rgba(148,163,184,0.2)' }}>Name</th>
                  <th style={{ padding: '12px 8px', borderBottom: '1px solid rgba(148,163,184,0.2)' }}>Email</th>
                  <th style={{ padding: '12px 8px', borderBottom: '1px solid rgba(148,163,184,0.2)' }}>Subject</th>
                  <th style={{ padding: '12px 8px', borderBottom: '1px solid rgba(148,163,184,0.2)' }}>Status</th>
                  <th style={{ padding: '12px 8px', borderBottom: '1px solid rgba(148,163,184,0.2)' }}>Date</th>
                  <th style={{ padding: '12px 8px', borderBottom: '1px solid rgba(148,163,184,0.2)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedInquiries.map((inquiry) => {
                  const tone = statusTone[inquiry.status] || statusTone.new;

                  return (
                    <tr key={inquiry._id}>
                      <td style={{ padding: '12px 8px', borderBottom: '1px solid rgba(148,163,184,0.12)', verticalAlign: 'top' }}>{inquiry.name}</td>
                      <td style={{ padding: '12px 8px', borderBottom: '1px solid rgba(148,163,184,0.12)', verticalAlign: 'top' }}>{inquiry.email}</td>
                      <td style={{ padding: '12px 8px', borderBottom: '1px solid rgba(148,163,184,0.12)', verticalAlign: 'top' }}>{inquiry.subject}</td>
                      <td style={{ padding: '12px 8px', borderBottom: '1px solid rgba(148,163,184,0.12)', verticalAlign: 'top' }}>
                        <Select
                          size="small"
                          value={inquiry.status || 'new'}
                          onChange={(event) => handleStatusChange(inquiry._id, event.target.value)}
                          sx={{
                            minWidth: 138,
                            backgroundColor: tone.bg,
                            color: tone.color,
                            fontWeight: 700,
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                          }}
                        >
                          {statuses.map((status) => (
                            <MenuItem key={status} value={status}>
                              {status}
                            </MenuItem>
                          ))}
                        </Select>
                      </td>
                      <td style={{ padding: '12px 8px', borderBottom: '1px solid rgba(148,163,184,0.12)', verticalAlign: 'top', color: '#64748b' }}>
                        {new Date(inquiry.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '12px 8px', borderBottom: '1px solid rgba(148,163,184,0.12)', verticalAlign: 'top' }}>
                        <Stack direction="row" spacing={1}>
                          <Button variant="text" onClick={() => setSelectedInquiry(inquiry)} sx={{ textTransform: 'none' }}>
                            Details
                          </Button>
                          <Button variant="outlined" color="error" onClick={() => handleDelete(inquiry._id)} sx={{ textTransform: 'none' }}>
                            Delete
                          </Button>
                        </Stack>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Box>
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
            sx={{ mt: 1 }}
          />
        )}
      </PanelCard>

      <Drawer anchor="right" open={Boolean(selectedInquiry)} onClose={() => setSelectedInquiry(null)}>
        <Box sx={{ width: { xs: 320, sm: 440 }, p: 3, position: 'relative' }}>
          <IconButton onClick={() => setSelectedInquiry(null)} sx={{ position: 'absolute', top: 12, right: 12 }} aria-label="Close inquiry details">
            <CloseIcon />
          </IconButton>

          {selectedInquiry && (
            <Stack spacing={2.5} sx={{ pr: 3 }}>
              <Box>
                <Typography variant="overline" sx={{ color: '#64748b', letterSpacing: '0.12em' }}>
                  Inquiry details
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 900, lineHeight: 1.1, mt: 0.5 }}>
                  {selectedInquiry.subject}
                </Typography>
              </Box>

              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                <Chip label={selectedInquiry.status || 'new'} sx={{ backgroundColor: (statusTone[selectedInquiry.status] || statusTone.new).bg, color: (statusTone[selectedInquiry.status] || statusTone.new).color, fontWeight: 700 }} />
                {selectedInquiry.serviceInterest && <Chip label={selectedInquiry.serviceInterest} variant="outlined" />}
              </Stack>

              <Divider />

              <Box>
                <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 0.5 }}>
                  Contact
                </Typography>
                <Typography sx={{ fontWeight: 700 }}>{selectedInquiry.name}</Typography>
                <Typography>{selectedInquiry.email}</Typography>
                {selectedInquiry.phone && <Typography>{selectedInquiry.phone}</Typography>}
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 0.5 }}>
                  Message
                </Typography>
                <Typography sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>{selectedInquiry.message}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 0.5 }}>
                  Created
                </Typography>
                <Typography>{new Date(selectedInquiry.createdAt).toLocaleString()}</Typography>
              </Box>

              <Button
                variant="contained"
                sx={{ background: 'linear-gradient(90deg, #2563eb, #0ea5e9)', textTransform: 'none' }}
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
