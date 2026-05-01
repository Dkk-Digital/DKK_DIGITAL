import React from 'react';
import { Grid, Card, Typography, Box } from '@mui/material';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { styled } from '@mui/material/styles';

const ChartCard = styled(Card)(({ theme }) => ({
  padding: '24px',
  background: 'linear-gradient(135deg, rgba(25,118,210,0.04), rgba(124,77,255,0.04))',
  border: '1px solid rgba(25,118,210,0.1)',
  borderRadius: '16px',
}));

const COLORS = ['#1976d2', '#0ea5e9', '#6366f1', '#f59e0b', '#ef4444'];

export const InquiryStatusChart = ({ data }) => {
  if (!data || Object.keys(data).length === 0) return null;

  const chartData = [
    { name: 'New', value: data.new || 0 },
    { name: 'Contacted', value: data.contacted || 0 },
    { name: 'Converted', value: data.converted || 0 },
  ];

  return (
    <Grid item xs={12} sm={6} md={4}>
      <ChartCard>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Inquiry Status
        </Typography>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => `${entry.name}: ${entry.value}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>
    </Grid>
  );
};

export const InquiryTrendChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <Grid item xs={12} sm={6} md={4}>
      <ChartCard>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Inquiry Trend (Last 7 Days)
        </Typography>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#1976d2" strokeWidth={2} dot={{ fill: '#1976d2' }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </Grid>
  );
};

export const ServiceCategoryChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <Grid item xs={12} md={4}>
      <ChartCard>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Services by Category
        </Typography>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#1976d2" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </Grid>
  );
};

export const QuickStatCard = ({ icon: Icon, title, value, color = '#1976d2' }) => {
  return (
    <ChartCard>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color }}>
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: '12px',
            background: `${color}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {Icon && <Icon sx={{ fontSize: 32, color }} />}
        </Box>
      </Box>
    </ChartCard>
  );
};
