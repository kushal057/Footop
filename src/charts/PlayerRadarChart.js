import React, { PureComponent } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const metrics = {
  "very weak": 30,
  "weak": 60,
  "strong": 90,
  "very strong": 120,
}

const data = [
  {
    subject: 'Finishing',
    A: metrics["very strong"],
    fullMark: 150,
  },
  {
    subject: 'Passing',
    A: metrics["weak"],
    fullMark: 150,
  },
  {
    subject: 'Key passes',
    A: metrics["strong"],
    fullMark: 150,
  },
  {
    subject: 'Defensive Contribution',
    A: metrics["very weak"],
    fullMark: 150,
  },
  {
    subject: 'Holding on to the ball',
    A: metrics["strong"],
    fullMark: 150,
  },
  {
    subject: 'Aerial Duels',
    A: metrics["strong"],
    fullMark: 150,
  },
  {
    subject: 'Heading attempts',
    A: metrics["strong"],
    fullMark: 150,
  },
];

export default class Example extends PureComponent {
  static demoUrl = 'https://codesandbox.io/s/simple-radar-chart-rjoc6';

  render() {
    const customTickFormatter = (value) => {
      switch (value) {
        case 30:
          return 'Very Weak';
        case 60:
          return 'Weak';
        case 90:
          return 'Strong';
        case 120:
          return 'Very Strong';
        default:
          return value;
      }
    };

    const grayishColor = '#7F9BA6'; // Replace with the desired grayish color
    const radarLineColor = "#1B476C"; // Replace with the desired color for radar lines
    const backgroundColor = '#E1E9F0'; // Replace with the desired background color

    return (
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data} style={{ background: backgroundColor }}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" tick={{ fill: radarLineColor }} />
          <PolarRadiusAxis tickFormatter={customTickFormatter} angle={32} tick={{ fill: radarLineColor }} />
          <Radar name="Mike" dataKey="A" stroke={radarLineColor} fill={radarLineColor} fillOpacity={0.6} />
        </RadarChart>
      </ResponsiveContainer>
    );
  }
}
