import React, { useEffect, useState } from 'react';
import { TreeSelect } from 'antd';
const treeData = [
    {
        title: '一号楼',
        value: '0-0',
        children: [
            {
                title: '一层',
                value: '0-0-1',
                children: [
                    {
                        title: '101室',
                        value: '0-0-1-0',
                    },
                    {
                        title: '102室',
                        value: '0-0-1-1',
                    }
                ]
            },
            {
                title: '二层',
                value: '0-0-2',
                children: [
                    {
                        title: '101室',
                        value: '0-0-2-0',
                    },
                    {
                        title: '102室',
                        value: '0-0-2-1',
                    }
                ]
            },
        ],
    },
    {
        title: '二号楼',
        value: '0-1',
        children: [
            {
                title: '一层',
                value: '0-1-1',
                children: [
                    {
                        title: '101室',
                        value: '0-1-1-0',
                    },
                    {
                        title: '102室',
                        value: '0-1-1-1',
                    }
                ]
            }
        ],
    },
];

export const BedTreeSelect = (props) => {
    const [value, setValue] = useState(undefined)
    const onChange = value => {
        setValue(value)
    };
    return (
        <TreeSelect
            size={"small"}
            treeCheckable
            style={{ width: 300 }}
            value={value}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={treeData}
            placeholder="请选择老人所在位置"
            // treeDefaultExpandAll
            onChange={onChange}
        />
    );
}

