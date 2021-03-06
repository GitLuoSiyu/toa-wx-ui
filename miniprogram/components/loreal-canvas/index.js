// +----------------------------------------------------------------------
// | canvas-paint
// +----------------------------------------------------------------------
// | HomePage : https://github.com/xujiazheng/wx-canvas
// +----------------------------------------------------------------------
// | Author: xujiazheng <18397968326@163.com>
// +----------------------------------------------------------------------

'use strict';

/**
 * canvas绘制图片组件封装
 * 使用如下：
 * 传递所需参数，其中config表示此canvas的基础信息
 * 通过绑定相应事件接收绘制完成的文件path。
 */
import {
    drawPoster,
    canvasToTempFilePath,
    saveFile,
    onlineImageToLocalImage,
    measureText,
    getUUID,
} from './utils';
Component({
    properties: {
        // 原数据
        config: {
            type: Array,
            value: [],
            observer(val) {
                if (val && typeof val === 'object' && val.length) {
                    this.startTask(val);
                }
            },
        },
        // 是否需要保存为本地文件
        useSave: {
            type: Boolean,
            value: false,
        },
        width: Number,
        height: Number,
        // 需要处理图片下载失败的异常情况,如果为false，则可以绑定error事件进行监听异常情况
        failover: {
            type: Boolean,
            value: true,
        },
        debug: {
            type: Boolean,
            value: false,
            observer(val) {
                if (val) {
                    this.setData({
                        top: 0,
                        left: 0,
                    });
                }
            },
        }
    },
    data: {
        // 生成一个随机id
        canvasId: `canvasId_${getUUID()}`,
        top: -999,
        left: -999,
    },
    methods: {
        getContext() {
            return wx.createCanvasContext(this.data.canvasId, this);
        },
        measureText(text, size) {
            return measureText(this.getContext(), text, size);
        },
        startTask(renderData) {
            const onLineMap = this.getOnLineImgMap(renderData);
            // 先将外部图片资源下载到本地，再进行绘制。
            return onlineImageToLocalImage(onLineMap)
                .then((pathMap) => {
                    Object.keys(pathMap).forEach((key) => {
                        renderData[key].image = pathMap[key];
                        if (!pathMap[key] && !this.data.failover) {
                            throw new Error('失败');
                        }
                    });
                })
                .then(() => this.startDraw(renderData))
                .then(() => this.transferTempFile())
                .then((res) => this.handleFile(res))
                .catch(() => this.handleError());
        },
        // 开始绘制
        startDraw(renderData) {
            return drawPoster({
                ctx: this.getContext(),
                data: renderData,
            });
        },
        // 将canvas转为临时文件
        transferTempFile() {
            return canvasToTempFilePath({
                canvasId: this.data.canvasId,
            }, this);
        },
        // 处理生成的文件
        handleFile({tempFilePath}) {
            this.triggerEvent('created', {
                path: tempFilePath,
            });
            if (this.data.useSave) {
                saveFile(tempFilePath)
                    .then(({savedFilePath}) => {
                        this.triggerEvent('saved', {
                            path: savedFilePath,
                        });
                    });
            }
        },
        handleError() {
            this.triggerEvent('error');
        },
        // 资源文件提取
        getOnLineImgMap(renderData) {
            // 匹配需要下载图片的绘制描述类型，目前image和box两种类型需要下载图片
            const pattDownLoadImage = /image|box/;
            const map = {};
            renderData.forEach((item, index) => {
                if (pattDownLoadImage.test(item.type) && item.src) {
                    map[index] = item.src;
                }
            });
            return map;
        },
    },
});
