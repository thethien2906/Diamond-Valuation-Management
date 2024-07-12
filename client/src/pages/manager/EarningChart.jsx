import * as React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart } from '@mui/x-charts/BarChart';
import {
  Box,
  Typography,
  Card,
  CardContent,
  FormControl,
  Select,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  styled, // Import styled from MUI for custom styling
  TablePagination, // Import TablePagination for pagination
} from '@mui/material';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'; // Import icon

const valueFormatter = (value) => `$${value?.toLocaleString()}`;

// Custom styling for moving yAxis to the right
const RightAlignedBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
  height: '100%',
  '& .MuiBox-root .recharts-wrapper .recharts-yAxis': {
    right: '10px', // Adjust margin to move yAxis labels to the right
  },
}));

export default function EarningChart() {
  const [transactions, setTransactions] = useState([]);
  const [monthlyEarnings, setMonthlyEarnings] = useState(new Array(12).fill(0));
  const [totalPayments, setTotalPayments] = useState(0); // State to hold total payments
  const [selectedMonth, setSelectedMonth] = useState(1); // Initialize selectedMonth to 1 for January
  const [page, setPage] = useState(0); // State for current page
  const rowsPerPage = 5; // Number of rows per page

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('/api/transactions');
        let transactions = response.data;

        // Sort transactions by created date in descending order
        transactions.sort((a, b) => new Date(b.created) - new Date(a.created));

        const earnings = new Array(12).fill(0);
        let total = 0;

        transactions.forEach(transaction => {
          const month = new Date(transaction.created).getUTCMonth(); // Get UTC month
          earnings[month] += transaction.amount;
          total += transaction.amount;
        });

        setMonthlyEarnings(earnings);
        setTotalPayments(total); // Set total payments
        setTransactions(transactions); // Set transactions
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions();
  }, []);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dataset = monthlyEarnings.map((value, index) => ({
    month: monthNames[index],
    earnings: value,
  }));

  const chartSetting = {
    yAxis: [
      {
        position: 'right', // Position yAxis labels on the right
        valueFormatter: (value) => `$${value.toLocaleString()}`, // Value formatter for Y-axis labels
      },
    ],
    series: [{ dataKey: 'earnings', label: 'Monthly Earnings', valueFormatter }],
    height: 500,
    width: 1000,
    sx: {
      [`& .${axisClasses.directionX} .${axisClasses.label}`]: {
        fontSize: '12px', // Adjust font size for xAxis labels
        whiteSpace: 'nowrap', // Prevent wrapping of labels
        overflow: 'hidden', // Hide overflow if any
        textOverflow: 'ellipsis', // Show ellipsis for long labels
      },
    },
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'UTC' };
    return new Date(dateString).toLocaleString('sv-SE', options).replace(' ', 'T') + 'Z';
  };

  return (
    <Box sx={{ width: '100%', marginTop: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h6" component="div" gutterBottom>
            Monthly Earnings
          </Typography>
          <Grid container direction="column" alignItems="center" spacing={2}>
            <Grid item>
              <FormControl sx={{ minWidth: 120 }}>
                <Select
                  native
                  value={selectedMonth}
                  onChange={handleMonthChange}
                  inputProps={{ 'aria-label': 'Select Month' }}
                  sx={{ borderRadius: 16, minWidth: 120 }}
                >
                  {monthNames.map((month, index) => (
                    <option key={index + 1} value={index + 1}>{month}</option>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <Paper elevation={3} sx={{ p: 2, display: 'flex', alignItems: 'center', borderRadius: 16, backgroundColor: '#f0f0f0' }}>
                <MonetizationOnIcon sx={{ mr: 1 }} />
                <Typography variant="body1">
                  Total Payments: ${monthlyEarnings[selectedMonth - 1].toLocaleString()}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
          <RightAlignedBox>
            <BarChart
              dataset={dataset}
              xAxis={[
                { scaleType: 'band', dataKey: 'month', tickPlacement: 'middle', tickLabelPlacement: 'middle' },
              ]}
              {...chartSetting}
            />
          </RightAlignedBox>
          <Typography variant="h6" component="div" gutterBottom>
            Transaction Details
          </Typography>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="Transaction table">
              <TableHead>
                <TableRow>
                  <TableCell>Created</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Currency</TableCell>
                  <TableCell>Customer Email</TableCell>
                  <TableCell>Customer Name</TableCell>
                  <TableCell>Payment Method</TableCell>
                  <TableCell>Is Live Mode</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // Pagination logic
                  .map((transaction, index) => (
                    <TableRow key={index}>
                      <TableCell>{formatDate(transaction.created)}</TableCell>
                      <TableCell>{transaction.time}</TableCell>
                      <TableCell>${transaction.amount.toLocaleString()}</TableCell>
                      <TableCell>{transaction.currency}</TableCell>
                      <TableCell>{transaction.customerEmail}</TableCell>
                      <TableCell>{transaction.customerName}</TableCell>
                      <TableCell>{transaction.paymentMethod}</TableCell>
                      <TableCell>{transaction.isLiveMode ? 'Yes' : 'No'}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[rowsPerPage]}
            component="div"
            count={transactions.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handlePageChange}
          />
        </CardContent>
      </Card>
    </Box>
  );
}
