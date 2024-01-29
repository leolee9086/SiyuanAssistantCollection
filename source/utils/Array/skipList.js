class 跳表节点 {
    constructor(键, 值, 高度 = 0) {
        this.键 = 键;
        this.值 = 值;
        this.右侧 = Array(高度).fill(null);
    }
}
class 跳表 {
    constructor() {
        this.头节点 = new 跳表节点(null, null, 1);
        this.高度 = 1;
        this.节点数 = 0;
    }
    随机高度() {
        let 高度 = 1;
        while (Math.random() < 0.5 && 高度 < this.高度 + 1) {
            高度++;
        }
        return 高度;
    }
    插入(键, 值) {
        const 更新节点 = Array(this.高度).fill(this.头节点);
        let 当前节点 = this.头节点;

        for (let i = this.高度 - 1; i >= 0; i--) {
            while (当前节点.右侧[i] && 当前节点.右侧[i].键 < 键) {
                当前节点 = 当前节点.右侧[i];
            }
            更新节点[i] = 当前节点;
        }
        const 新节点高度 = this.随机高度();
        if (新节点高度 > this.高度) {
            for (let i = this.高度; i < 新节点高度; i++) {
                更新节点[i] = this.头节点;
            }
            this.高度 = 新节点高度;
        }
        const 新节点 = new 跳表节点(键, 值, 新节点高度);
        for (let i = 0; i < 新节点高度; i++) {
            新节点.右侧[i] = 更新节点[i].右侧[i];
            更新节点[i].右侧[i] = 新节点;
        }

        this.节点数++;
    }
    查找(键) {
        let 当前节点 = this.头节点;
        for (let i = this.高度 - 1; i >= 0; i--) {
            while (当前节点.右侧[i] && 当前节点.右侧[i].键 < 键) {
                当前节点 = 当前节点.右侧[i];
            }
        }
        当前节点 = 当前节点.右侧[0];
        if (当前节点 && 当前节点.键 === 键) {
            return 当前节点.值;
        } else {
            return null;
        }
    }
    删除(键) {
        const 更新节点 = Array(this.高度).fill(null);
        let 当前节点 = this.头节点;
        for (let i = this.高度 - 1; i >= 0; i--) {
            while (当前节点.右侧[i] && 当前节点.右侧[i].键 < 键) {
                当前节点 = 当前节点.右侧[i];
            }
            更新节点[i] = 当前节点;
        }
        当前节点 = 当前节点.右侧[0];
        if (当前节点 && 当前节点.键 === 键) {
            for (let i = 0; i < this.高度; i++) {
                if (更新节点[i].右侧[i] !== 当前节点) {
                    break;
                }
                更新节点[i].右侧[i] = 当前节点.右侧[i];
            }
            while (this.高度 > 1 && !this.头节点.右侧[this.高度 - 1]) {
                this.高度--;
            }

            this.节点数--;
        }
    }
}