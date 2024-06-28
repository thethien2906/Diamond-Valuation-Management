import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { LineChart, axisClasses } from '@mui/x-charts';

export default function EarningChart() {
  const theme = useTheme();
  
  // Initialize the data state with the original time values and initial amounts
  const initialData = [
    { time: '00:00', amount: 0 }, // Set initial amount for the first time slot
    { time: '03:00', amount: 0 },
    { time: '06:00', amount: 0 },
    { time: '09:00', amount: 0 },
    { time: '12:00', amount: 0 },
    { time: '15:00', amount: 0 },
    { time: '18:00', amount: 0 },
    { time: '21:00', amount: 0 },
    { time: '24:00', amount: 0 },
  ];

  const [data, setData] = React.useState(initialData);
  const [updateCount, setUpdateCount] = React.useState(0);

  const updateEarnings = () => {
    setData((prevData) => {
      const newData = [...prevData];
      if (updateCount < 8) {
        const newAmount = Math.random() * 1000;
        newData[updateCount + 1].amount = newAmount;
      }
      return newData;
    });
    setUpdateCount((prevCount) => prevCount + 1);
  };

  React.useEffect(() => {
    // Simulate an update to the earnings data every 5 seconds, up to 8 times
    if (updateCount < 9) {
      const interval = setInterval(updateEarnings, 5000);
      return () => clearInterval(interval);
    }
  }, [updateCount]);

  return (
    <React.Fragment>
      <div>Today</div>
      <div style={{ width: '100%', flexGrow: 1, overflow: 'hidden' }}>
        <LineChart
          dataset={data}
          margin={{
            top: 16,
            right: 20,
            left: 70,
            bottom: 30,
          }}
          xAxis={[
            {
              scaleType: 'point',
              dataKey: 'time',
              tickNumber: 2,
              tickLabelStyle: theme.typography.body2,
            },
          ]}
          yAxis={[
            {
              label: 'Sales ($)',
              labelStyle: {
                ...theme.typography.body1,
                fill: theme.palette.text.primary,
              },
              tickLabelStyle: theme.typography.body2,
              max: 3000,
              tickNumber: 3,
            },
          ]}
          series={[
            {
              dataKey: 'amount',
              showMark: false,
              color: theme.palette.primary.light,
            },
          ]}
          sx={{
            [`.${axisClasses.root} line`]: { stroke: theme.palette.text.secondary },
            [`.${axisClasses.root} text`]: { fill: theme.palette.text.secondary },
            [`& .${axisClasses.left} .${axisClasses.label}`]: {
              transform: 'translateX(-25px)',
            },
          }}
        />
      </div>
    </React.Fragment>
  );
}
