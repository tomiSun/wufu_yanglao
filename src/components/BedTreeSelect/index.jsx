import React, { useEffect, useState } from 'react';
import { TreeSelect } from 'antd';
import {
    bedTree,
} from '@/services/basicSetting/bedInfo';
// const treeData = [
//     {
//         title: '一号楼',
//         value: '0-0',
//         children: [
//             {
//                 title: '一层',
//                 value: '0-0-1',
//                 children: [
//                     {
//                         title: '101室',
//                         value: '0-0-1-0',
//                     },
//                     {
//                         title: '102室',
//                         value: '0-0-1-1',
//                     }
//                 ]
//             },
//             {
//                 title: '二层',
//                 value: '0-0-2',
//                 children: [
//                     {
//                         title: '101室',
//                         value: '0-0-2-0',
//                     },
//                     {
//                         title: '102室',
//                         value: '0-0-2-1',
//                     }
//                 ]
//             },
//         ],
//     },
//     {
//         title: '二号楼',
//         value: '0-1',
//         children: [
//             {
//                 title: '一层',
//                 value: '0-1-1',
//                 children: [
//                     {
//                         title: '101室',
//                         value: '0-1-1-0',
//                     },
//                     {
//                         title: '102室',
//                         value: '0-1-1-1',
//                     }
//                 ]
//             }
//         ],
//     },
// ];

export const BedTreeSelect = (props) => {
    const [value, setValue] = useState(undefined)
    const [treeData, setTreeData] = useState([]);
    const onChange = (value,record) => {
        props.onSelect(value)
        setValue(value)
    };
    useEffect(() => {
        getRoomTree()
    }, [])
    //获取楼宇信息
    const getRoomTree = async () => {
        let res = await bedTree();
        setTreeData(res['data'])
    }
    return (
        <TreeSelect
            // size={"small"}
            // treeCheckable
            style={{ width: 273 }}
            value={value}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={treeData}
            placeholder="请选择老人所在位置"
            // treeDefaultExpandAll
            onChange={onChange}
        />
    );
}

