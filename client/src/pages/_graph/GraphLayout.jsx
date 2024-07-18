// client/src/pages/GraphLayout.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';

const shapes = [
  'Marquise', 'Heart', 'Pear', 'Emerald', 'Princess', 'Oval', 'Round', 'Cushion'
];

const GraphLayout = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Diamond Shapes Historical Prices
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {shapes.map((shape) => (
          <Button
            key={shape}
            variant="contained"
            color="primary"
            onClick={() => navigate(`/historical-prices/${shape.toLowerCase()}`)}
          >
            {shape}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default GraphLayout;
