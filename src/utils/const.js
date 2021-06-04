export const config = {
  pageSize: 20,
  pageNum: 1,
  usedFlag: 0, // 0:不包含停用 1：包含停用
  reportPrintPageSize: 32, // 报告单每页最多条数
  dictTypeCodeList: {
    instrumentClassify: 1000, //仪器分类字典
    serialPort: 1001, //串口列表（COM口）字典
    baudRate: 1002, //波特率字典
    handshake: 1003, //握手协议字典
    sampleGenera: 1004, //检验项目大类
    sampleClassify: 1005, //检验项目分类
    sampleType: 1006, //标本类型字典
    collectPart: 1007, //采集部位字典
    resultUnit: 1008, //结果单位字典
    em: 1009, //实验方法字典
    testTubeType: 1010, //试管类型字典
    resultType: 1011, //结果类型字典
    result: 1012, //结果（集）字典
    sampleFrom: 1013, //仪器分类字典
    testingPrinciple: 1014, //检测原理字典
    yinYang: 1015, //阴阳性结果集
    semiQuantitative: 1016, //半定量结果集
    collectMethod: 1017, //采集方法
    therapyGenera: 1018, //检验目的大类
    therapyClassify: 1019, //检验目的小类
    runawayPrompt: 1020, //失控提示
    germGenera: 1021, //细菌大类
    bacillus: 1022, //菌属字典
    gramStainingResult: 1023, //革兰染色结果字典
    bioticType: 1024, //抗生素类别字典
    mediaType: 1025, //介质类型
    tatHandleType: 1026, //TAT操作类型
    applicationState: 1027, //申请单状态字典
    tollState: 1028, //收费状态字典
    barcodeSampleState: 1029, //条码标本状态字典
    specimenCollectUnusual: 1030, //标本采集异常字典
    specimenReachPoint: 1031, //标本接收点
    disposal: 1032, //不合格标本处置措施
    unqualified: 1033, //标本不合格原因
    outsidePoint: 1034, //外送单位
  },
};
