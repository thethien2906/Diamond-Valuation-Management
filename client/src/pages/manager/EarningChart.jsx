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
  styled,
  TablePagination,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import SearchIcon from '@mui/icons-material/Search';

const valueFormatter = (value) => {
  const formattedValue = value.toFixed(2);
  return `$${formattedValue.padStart(6, '0')}`;
};

const RightAlignedBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
  height: '100%',
  '& .MuiBox-root .recharts-wrapper .recharts-yAxis': {
    right: '10px',
  },
}));

export default function EarningChart() {
  const [transactions, setTransactions] = useState([]);
  const [monthlyEarnings, setMonthlyEarnings] = useState(new Array(12).fill(0));
  const [totalPayments, setTotalPayments] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('/api/transactions');
        let transactions = response.data;

        transactions.sort((a, b) => new Date(b.created) - new Date(a.created));

        const earnings = new Array(12).fill(0);
        let total = 0;

        transactions.forEach(transaction => {
          const month = new Date(transaction.created).getUTCMonth();
          earnings[month] += transaction.amount;
          total += transaction.amount;
        });

        setMonthlyEarnings(earnings);
        setTotalPayments(total);
        setTransactions(transactions);
        setFilteredTransactions(transactions);
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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = () => {
    setFilteredTransactions(
      transactions.filter(transaction =>
        transaction.customerName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
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
        position: 'right',
        valueFormatter,
      },
    ],
    series: [{ dataKey: 'earnings', label: 'Monthly Earnings', valueFormatter }],
    height: 500,
    width: 1000,
    sx: {
      [`& .${axisClasses.directionX} .${axisClasses.label}`]: {
        fontSize: '12px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
    },
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    return `${hours}:${minutes}`;
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
              <Paper elevation={3} sx={{ p: 2, display: 'flex', alignItems: 'center', borderRadius: 16, backgroundColor: '#f0f0f0' }}>
                <MonetizationOnIcon sx={{ mr: 1 }} />
                <Typography variant="body1">
                  Total Payments for the Year: ${totalPayments.toFixed(2).padStart(6, '0')}
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
          <Grid container direction="row" justifyContent="space-between" alignItems="center">
            <Grid item>
              <TextField
                label="Search by Name"
                variant="outlined"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                sx={{ marginBottom: 2, width: 200 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleSearch}>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
}}
              />
            </Grid>
          </Grid>
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
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTransactions
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((transaction, index) => (
                    <TableRow key={index}>
                      <TableCell>{formatDate(transaction.created)}</TableCell>
                      <TableCell>{formatTime(transaction.created)}</TableCell>
                      <TableCell>{valueFormatter(transaction.amount)}</TableCell>
                      <TableCell>{transaction.currency}</TableCell>
                      <TableCell>{transaction.customerEmail}</TableCell>
                      <TableCell>{transaction.customerName}</TableCell>
                      <TableCell>{transaction.paymentMethod}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[rowsPerPage]}
            component="div"
            count={filteredTransactions.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handlePageChange}
          />
        </CardContent>
      </Card>
    </Box>
  );
}