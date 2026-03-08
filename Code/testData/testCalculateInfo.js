function getTestCalculateInfo() {
    var t = localStorage.getItem("calculateInfo");
    if (t) {
        return JSON.parse(t);
    }
    return [
        {
            "id": 1, "formula": "P=F/S", "conditions": []
            , applyCount: 3
            , maps: {
                "P": ["table1.P1", "table1.P2", "table1.P3"],
                "F": ["table1.hz1", "table1.hz2", "table1.hz3"],
                "S": ["table1.S1", "table1.S2", "table1.S3"]
            }
        },
        {
            "id": 2, "formula": "S=3.14*r^2", "conditions": [
                [{ "c1": "table1.xingzhuang", "c2": "=", "c3": "圆柱体", "c4": "字符串" }]
            ], applyCount: 3, maps: {
                "S": ["table1.S1", "table1.S2", "table1.S3"],
                "r": ["table1.c1", "table1.c2", "table1.c3"]
            }
        },
        {
            "id": 3, "formula": "S=c*k", "conditions": [
                [
                    { "id": 1, "c1": "table1.xingzhuang", "c2": "=", "c3": "立方体", "c4": "字符串" }
                ]
            ], applyCount: 3, "maps": {
                "S": ["table1.S1", "table1.S2", "table1.S3"],
                "c": ["table1.c1", "table1.c2", "table1.c3"],
                "k": ["table1.k1", "table1.k2", "table1.k3"]
            }
        }
    ];
}