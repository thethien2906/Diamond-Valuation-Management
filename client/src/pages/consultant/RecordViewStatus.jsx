import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { toast } from 'react-hot-toast';

const RecordViewStatus = () => {
  const { recordId } = useParams();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecordData = async () => {
      try {
        const response = await axios.get(`/api/valuation-records/${recordId}`);
        const receiptResponse = await axios.get(`/api/receipts/${response.data.receiptId}`);
        setRecord({
          ...response.data,
          receiptIssuedAt: receiptResponse.data.issueDate
        });
      } catch (error) {
        console.error('Error fetching valuation record data:', error);
        toast.error('Failed to fetch valuation record data');
      } finally {
        setLoading(false);
      }
    };

    fetchRecordData();
  }, [recordId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!record) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6" component="h2">No record found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        Status Timeline
      </Typography>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="status-content"
          id="status-header"
        >
          <Typography variant="subtitle1">Status Timeline</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ width: '100%' }}>
            {record.receiptIssuedAt && (
              <Typography variant="body2">
                {new Date(record.receiptIssuedAt).toLocaleString()} - Create Receipt
              </Typography>
            )}
            <Typography variant="body2">{new Date(record.createdAt).toLocaleString()} - Hand Over Appraiser</Typography>
            {record.actions && record.actions.map((action, index) => (
              <Typography key={index} variant="body2">{new Date(action.timestamp).toLocaleString()} - {action.action}</Typography>
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default RecordViewStatus;
