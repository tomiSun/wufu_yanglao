/**双折线图 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Chart, Line, Point, Tooltip, Legend } from 'bizcharts';

const scale = {
	temperature: { min: 0 },
	city: {
		formatter: v => {
			return {
				London: '原有人数',
				Tokyo: '入院人数'
			}[v]
		}
	}
}
const formatData = (data) => {
	let arr = []
	data?.inHospital.forEach(item => {
		arr.push({
			month: item['tempData'],
			city: "inHospital",
			temperature: item["targetNum"]
		})
	})
	data?.outHospital.forEach(item => {
		arr.push({
			month: item['tempData'],
			city: "outHospital",
			temperature: item["targetNum"]
		})
	})
	return arr
}
export default function IndexPage(props) {
	const { chartData } = props;
	if (chartData.length == 0) {
		return<>暂无数据</>
	}
	const data = formatData(chartData)
	return <Chart scale={scale} padding={[30, 20, 60, 40]} autoFit data={data} interactions={['element-active']}>
		<Point position="month*temperature" color="city" shape='circle' />
		<Line shape="smooth" position="month*temperature" color="city" label="temperature" />
		<Tooltip shared showCrosshairs />
		<Legend background={{
			padding: [5, 100, 5, 36],
			style: {
				fill: '#eaeaea',
				stroke: '#fff'
			}
		}} />
	</Chart>
}

