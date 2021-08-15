/**词云 */
import React from 'react';
import ReactDOM from 'react-dom';
import { WordCloudChart } from 'bizcharts';

// 数据源
const data = [
	{
		"value": 3,
		"name": "上城区"
	},
	{
		"value": 3,
		"name": "下城区"
	},
	{
		"value": 3,
		"name": "富阳区"
	},
	{
		"value": 3,
		"name": "滨江区"
	},
	{
		"value":3,
		"name": "拱墅区"
	},
	{
		"value": 3,
		"name": "临平区"
	},
	{
		"value": 3,
		"name": "江干区"
	},
	{
		"value": 3,
		"name": "下沙区"
	},
	{
		"value": 3,
		"name": "上城区"
	},
	{
		"value": 3,
		"name": "下城区"
	},
	{
		"value": 3,
		"name": "萧山区"
	},
	{
		"value":3,
		"name": "临安区"
	},
	{
		"value": 2,
		"name": "数智走廊"
	},
	{
		"value": 2,
		"name": "数智科创"
	},
	{
		"value": 2,
		"name": "钱塘新区"
	},
	{
		"value": 2,
		"name": "疫情防控"
	},
	{
		"value": 2,
		"name": "亲情在线"
	},
	{
		"value": 2,
		"name": "一表通"
	},
	{
		"value": 2,
		"name": "数字社会"
	},
	{
		"value": 2,
		"name": "数字法制"
	},
	{
		"value": 1,
		"name": "数字经济"
	},
	{
		"value": 1,
		"name": "党政机关"
	},
	{
		"value": 1,
		"name": "重大任务"
	},
	{
		"value": 1,
		"name": "主要领域"
	},
	{
		"value": 1,
		"name": "运行体系"
	},
	{
		"value": 1,
		"name": "指标任务"
	},
	{
		"value":1,
		"name": "新冠肺炎"
	},
	{
		"value": 1,
		"name": "亚运会"
	},
];

export default function Demo() {
	function getDataList(data) {
		const list = [];
		// change data type
		data.forEach((d) => {
			list.push({
				word: d.name,
				weight: d.value,
				id: list.length,
			});
		});
		return list;
	}
	function getRandomColor() {
		const arr = [
			'#5B8FF9',
			'#5AD8A6',
			'#5D7092',
			'#F6BD16',
			'#E8684A',
			'#6DC8EC',
			'#9270CA',
			'#FF9D4D',
			'#269A99',
			'#FF99C3',
		];
		return arr[Math.floor(Math.random() * (arr.length - 1))];
	}

	function hoverAction(item, dimension, evt, start) {
		console.log('hover action', item && item.word);
	}
	return (
		<WordCloudChart
			data={getDataList(data)}
			selected={1}
			// maskImage='https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*07tdTIOmvlYAAAAAAAAAAABkARQnAQ'
			wordStyle={{
				rotation: [-Math.PI / 2, Math.PI / 2],
				rotationSteps: 4,
				fontSize: [5, 40],				
				active: {
					shadowColor: '#999999',
					 shadowBlur: 10,
				},
				padding: 2,
			}}
			// random={0.4}
			backgroundColor='#fff'
			tooltip={{
				visible: true,
			}}
			onWordCloudClick={console.log}
		/>
	);
}
