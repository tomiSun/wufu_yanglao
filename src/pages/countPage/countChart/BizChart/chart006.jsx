/**
 * 饼图
 */
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

let pieData = [
  { item: '自理老人数', percent: 10 },
  { item: '完全失能老人数', percent: 10 },
  { item: '部分失能老人数', percent: 10 },
];
const cols = {
  percent: {
    formatter: (val) => {
      val = val;
      return val;
    },
  },
};

export default function Demo(props) {
  const { chartData } = props;
  if (chartData.length == 0) {
    return <>暂无数据</>
  }
  const formatData = (data) => {
    let arr = []
    let a = 0
    let b = 0
    let c = 0
    arr.push({ item: '完全失能老人数', percent: data.disability.reduce(( total,it) => { return total = total + it['targetNum'] }, 0) })
    arr.push({
      item: '部分失能老人数', percent: data.partialDisability.reduce((total, it) => {
        debugger
        return total = total + it['targetNum']
      }, 0)
    })
    arr.push({ item: '自理老人数', percent: data.provideForOneself.reduce((total,it) => { return total = total + it['targetNum'] }, 0) })
    return arr
  }
   pieData = formatData(chartData)
  return (
    <Chart
      data={pieData}
      scale={cols}
      autoFit
      interactions={['element-single-selected']}
    >
      <Coordinate type="theta" radius={0.75} />
      <Tooltip showTitle={false} />
      <Axis visible={false} />
      <Interval
        position="percent"
        adjust="stack"
        color="item"
        style={{
          lineWidth: 1,
          stroke: '#fff',
        }}
        label={[
          '*',
          {
            content: (data) => {
              return `${data.item}: ${data.percent}`;
            },
          },
        ]}
      />
    </Chart>
  );
}


