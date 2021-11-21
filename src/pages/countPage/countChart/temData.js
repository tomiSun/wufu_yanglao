//2 2 2 2
const data1 = [
    {
        level: 1,
        span: 24,
        vheight: 24,
        id: '0',
        children: [
            {
                level: 2,
                span: 24,
                vheight: 12,
                id: '0-0',
                children: [
                    {
                        level: 3,
                        span: 6,
                        vheight:24,
                        id: '0-0',
                        temp: 23,
                        programId: "0001"
                    },
                    {
                        level: 2,
                        span: 6,
                        vheight: 24,
                        id: '0-1',
                        temp: 23,
                        programId: "0002"
                    },
                    {
                        level: 2,
                        span: 6,
                        vheight: 24,
                        id: '0-2',
                        temp: 23,
                        programId: "0003"
                    },
                    {
                        level: 2,
                        span: 6,
                        vheight: 24,
                        id: '0-3',
                        temp: 23,
                        programId: "0004"
                    }
                ],
            },
            {
                level: 2,
                span: 24,
                vheight: 24,
                id: '0-1',
                children: [

                    {
                        level: 3,
                        span: 6,
                        vheight: 24,
                        id: '0-0',
                        temp: 23,
                        programId: "0005"
                    },
                    {
                        level: 3,
                        span: 6,
                        vheight: 24,
                        id: '0-1',
                        temp: 23,
                        programId: "0006"
                    },
                    {
                        level: 3,
                        span: 6,
                        vheight: 24,
                        id: '0-2',
                        temp: 23,
                        programId: "0007"
                    },
                    {
                        level: 3,
                        span: 6,
                        vheight: 24,
                        id: '0-3',
                        temp: 23,
                        programId: "0008"
                    },
                    {
                        level: 3,
                        span: 6,
                        vheight: 24,
                        id: '0-3',
                        temp: 23,
                        programId: "0011"
                    }
                ],
            },
            {
                level: 2,
                span: 12,
                vheight: 48,
                id: '0-0',
                temp: 15,
                programId: "0009"
            },
            {
                level: 2,
                span: 12,
                vheight: 48,
                id: '0-1',
                temp: 15,
                programId: "0010"
            },
        ],
    },
]
//2 2
const data1_2 = [
    {
        level: 1,
        span: 24,
        vheight: 24,
        id: '0',
        children: [
            {
                level: 2,
                span: 6,
                vheight: 24,
                id: '0-0',
                temp: 23,
                programId: "0005"
            },
            {
                level: 2,
                span: 6,
                vheight: 24,
                id: '0-1',
                temp: 23,
                programId: "0006"
            },
            {
                level: 2,
                span: 6,
                vheight: 24,
                id: '0-2',
                temp: 23,
                programId: "0007"
            },
            {
                level: 2,
                span: 6,
                vheight: 24,
                id: '0-3',
                temp: 23,
                programId: "0008"
            }
        ],
    },
];
const data2 = [
    {
        level: 1,
        span: 24,
        vheight: 24,
        id: '0',
        children: [
            {
                level: 2,
                span: 12,
                vheight: 24,
                id: '0-0',
                temp: 15,
                programId: "0009"
            },
            {
                level: 2,
                span: 12,
                vheight: 24,
                id: '0-1',
                temp: 15,
                programId: "0010"
            },
        ],
    },
];
//1
const data3 = [
    {
        level: 1,
        span: 24,
        vheight: 24,
        id: '0',
        children: [
            {
                level: 2,
                span: 24,
                vheight: 24,
                id: '0-0',
                temp: 2,
                programId: "0011"
            }
        ],
    },
];
//1
const data4 = [
    {
        level: 1,
        span: 24,
        vheight: 24,
        id: '0',
        children: [
            {
                level: 2,
                span: 24,
                vheight: 24,
                id: '0-0',
                temp: 6,
                programId: "0012"
            }
        ],
    },
];
// 2 2 4
const data5 = [
    {
        level: 1,
        span: 24,
        vheight: 24,
        id: '0',
        children: [
            {
                level: 2,
                span: 12,
                vheight: 24,
                id: '0-0',
                children: [
                    {
                        level: 3,
                        span: 24,
                        vheight: 6,
                        id: '0-0-0',
                        children: [
                            { span: 12, vheight: 12, level: 4, id: '0-0-0-1', temp: 1 },
                            { span: 12, vheight: 12, level: 4, id: '0-0-0-1', temp: 2 },
                        ],
                    },
                    {
                        level: 3,
                        span: 24,
                        vheight: 18,
                        id: '0-0-1',
                        children: [
                            { span: 12, vheight: 12, level: 4, id: '0-0-1-0', temp: 3 },
                            { span: 12, vheight: 12, level: 4, id: '0-0-1-1', temp: 4 },
                        ],
                    },
                ],
            },
            {
                level: 2,
                span: 12,
                vheight: 24,
                id: '0-1',
                children: [
                    {
                        level: 3,
                        span: 24,
                        vheight: 12,
                        id: '0-1-0',
                        children: [
                            {
                                level: 4,
                                span: 12,
                                vheight: 12,
                                id: '0-1-0-0',
                                temp: 5
                            },
                            {
                                level: 4,
                                span: 12,
                                vheight: 12,
                                id: '0-1-0-1',
                                temp: 6
                            },
                        ],
                    },
                    {
                        level: 3,
                        span: 24,
                        vheight: 12,
                        id: '0-1-1',
                        temp: 1
                    },
                ],
            },
        ],
    },
];
//左四右二
const data6 = [
    {
        level: 1,
        span: 24,
        vheight: 24,
        id: '0',
        children: [
            {
                level: 2,
                span: 12,
                vheight: 24,
                id: '0-0',
                children: [
                    {
                        level: 3,
                        span: 24,
                        vheight: 6,
                        id: '0-0-0',
                        children: [
                            { span: 12, vheight: 8, level: 4, id: '0-0-0-1', temp: 12 },
                            { span: 12, vheight: 8, level: 4, id: '0-0-0-1', temp: 13 },
                        ],
                    },
                    {
                        level: 3,
                        span: 24,
                        vheight: 18,
                        id: '0-0-1',
                        children: [
                            { span: 12, vheight: 16, level: 4, id: '0-0-1-0', temp: 16 },
                            { span: 12, vheight: 16, level: 4, id: '0-0-1-1', temp: 19 },
                        ],
                    },
                ],
            },
            {
                level: 2,
                span: 12,
                vheight: 24,
                id: '0-1',
                children: [
                    {
                        level: 3,
                        span: 24,
                        vheight: 12,
                        id: '0-1-0',
                        temp: 17
                        // children: [
                        //     {
                        //         level: 4,
                        //         span: 12,
                        //         vheight: 12,
                        //         id: '0-1-0-0',
                        //     },
                        //     {
                        //         level: 4,
                        //         span: 12,
                        //         vheight: 12,
                        //         id: '0-1-0-1',
                        //     },
                        // ],
                    },
                    {
                        level: 3,
                        span: 24,
                        vheight: 12,
                        id: '0-1-1',
                        temp: 14
                    },
                ],
            },
        ],
    },
];


const makeDemoData = (len) => {
    let arr = [];
    const makeChart = (num) => {
        return [
            {
                level: 1,
                span: 24,
                vheight: 24,
                id: '0',
                children: [
                    {
                        level: 2,
                        span: 12,
                        vheight: 24,
                        id: '0-0',
                        temp: num
                    }
                ],
            },
        ]
    }
    for (let index = 0; index < len; index++) {
        arr.push({ tempData: makeChart(index + 1), config: { height: 300, background: "#fff", gutterX: 10, gutterY: 10, name: "一排-1" }, oerder: 1 },)
    }
    return arr
}
//为了展示当前有的图标
const demoData = makeDemoData(23)

//实际使用的模版
const cssTempPageData = [
    { tempData: data1, config: { mode: "mode1", height: 150, background: "#fff", gutterX: 10, gutterY: 10, name: "一排-1" }, oerder: 1 },
    { tempData: data3, config: { mode: "mode2", height: 350, background: "#fff", gutterX: 10, gutterY: 10, name: "一排-1" }, oerder: 1 },
    { tempData: data4, config: { mode: "mode3", height: 350, background: "#fff", gutterX: 10, gutterY: 10, name: "一排-1" }, oerder: 1 },
]
//模版id映射
const programIdmap = {
    "0001": [],
    "0002": [],
    "0003": [],
    "0004": [],
    "0005": [],
    "0006": [],
    "0007": [],
    "0008": [],
}
export { cssTempPageData, demoData }