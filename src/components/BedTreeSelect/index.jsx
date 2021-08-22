import React, { useEffect, useState } from 'react';
import { TreeSelect } from 'antd';
import {
    bedTree,
} from '@/services/basicSetting/bedInfo';


export const BedTreeSelect = (props) => {
    const [value, setValue] = useState(undefined)
    const [treeData, setTreeData] = useState([]);
    const onSelect = (value, node, extra) => {
        props.onSelect(value, node, extra)
        setValue(value)
    }
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
            style={{ ...props?.style }}
            allowClear
            treeDefaultExpandAll={true}
            value={value}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={treeData}
            placeholder="请选择老人所在位置"
            onSelect={onSelect}
        />
    );
}

