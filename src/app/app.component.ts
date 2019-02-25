import { json } from './json';
import 'angular-calendar/css/angular-calendar.css';
import { Component, OnInit, DoCheck } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';

// @import '../node_modules/angular-calendar/css/angular-calendar.css';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit, DoCheck {
    tableData: Array<any> = json;
    unitPrice = 0;
    showType = true;
    constructor(private msg: NzMessageService) {}
    ngOnInit() {
        // this.jsonToTable(this.tableData);
    }
    ngDoCheck() {}

    /**
     *
     * @param list 计算序号和阶段列的rowspan
     */
    getStatusRow(list: Array<any>) {
        let length = 0;
        list.forEach(t => {
            length += t.children.length;
        });
        return length + list.length + 1;
    }
    /**
     *  单价change
     * @param value
     */
    priceChange(value) {
        this.tableData.forEach(arr => {
            arr.children.forEach(t => {
                t.children.forEach(m => {
                    m.price = m.workTime * value;
                });
            });
        });
        console.log(this.tableData);
    }
    /**
     *
     * @param val 工时change
     * @param item
     */
    priceAndLog(val, item) {
        item.price = this.unitPrice ? val * this.unitPrice : 0;
    }
    /**
     * 打印
     */
    log() {
        console.log(this.tableData);
    }
    /**
     * 新增
     *
     * @param {Array<any>} parent
     * @param {number} level 数据层级，1：阶段，2：类别，3：模块
     * @memberof AppComponent
     */
    add(parent: Array<any>, level: number) {
        if (level === 3) {
            parent.push({ level: level });
        } else if (level === 2) {
            parent.push({
                level: level,
                children: [{ level: 3 }]
            });
        } else if (level === 1) {
            parent.push({
                order: parent.length + 1,
                level: level,
                children: [
                    {
                        level: 2,
                        children: [{ level: 3 }]
                    }
                ]
            });
        }
        this.log();
    }
    /**
     *删除
     *
     * @param {*} child
     * @param {Array<any>} parant
     * @memberof AppComponent
     */
    delete(index: number, parant: Array<any>) {
        if (parant.length <= 1) {
            this.msg.warning('不能再删除啦！！');
        } else {
            parant.splice(index, 1);
            this.orderResort(parant);
        }
    }
    /**
     * 重新排序
     * @param list
     */
    orderResort(list: Array<any>) {
        list.forEach((item, index) => {
            item.order = index + 1;
        });
    }
    /**
     *
     * @param that 限制只输入数字
     */
    validatNumber(that) {
        that.value = that.value.replace(/[^\d]/g, '');
    }
    /**
     * 切换预览
     */
    preview() {
        this.showType = !this.showType;
    }
    /**
     * 合计总价
     *
     * @readonly
     * @memberof AppComponent
     */
    get sumPrice() {
        let sum = 0;
        this.tableData.forEach(arr => {
            arr.children.forEach(t => {
                t.children.forEach(m => {
                    sum += m.price ? m.price : 0;
                });
            });
        });
        return sum;
    }
}
