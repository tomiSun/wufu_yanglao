const hearInfo = [{
    title: "听力判断",
    extra: "评判标准：清楚：<5分；困难：5～10分；完全听不到：>10分",
    form: hearingForm,
    data: {
        score: "chokeFeedScore",
        degree: "chokeFeedDegree",
        items: 'chokeFeedItems',
        list: [{
            name: "在大会集中听讲",
            point: "0",
            plainOptions: ['清楚0分', '苦难1分', '听不到2分'],
            onChange: (data) => { console.log(data) }
        }, {
            name: "在大会集中听讲",
            point: "0",
            plainOptions: ['清楚0分', '苦难1分', '听不到2分'],
            onChange: (data) => { console.log(data) }
        }]
    }
}]
export  { hearInfo }