/**折线图 */
import {
	Chart,
	Interval,
	Tooltip,
	Line,
	Axis,
	Coordinate,
	Point,
	Legend,
  } from 'bizcharts';
  
  const data = [
	{ year: '1951 年', sales: 38 },
	{ year: '1952 年', sales: 52 },
	{ year: '1956 年', sales: 61 },
	{ year: '1957 年', sales: 45 },
	{ year: '1958 年', sales: 48 },
	{ year: '1959 年', sales: 38 },
	{ year: '1960 年', sales: 38 },
	{ year: '1962 年', sales: 38 },
  ];
  const scale = {
	sales: {
	  min: 0,
	},
  };
  export default function Demo() {
	return (
		<Chart
		  scale={scale}
		  autoFit
		  data={data}
		  appendPadding={[20, 0, 0, 0]}
		>
		  <Line position="year*sales" shape="smooth" />
		  <Point position="year*sales" />
		  <Tooltip showCrosshairs />
		</Chart>
	);
  }
  
  
  