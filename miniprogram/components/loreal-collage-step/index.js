const app = getApp()
import api from '../../api/index'
Component({
    properties: {
        collageData: {
            type: Object,
            value: {}
        },
        popType: {
            type: String,
            value: ""
        }
    },

    data: {
        currentDialogIndex: 0,
        currentDialog: {},
        collageCheckData: [],
        showCollageCheck: false,
        allDialogList: []
    },


    pageLifetimes: {
        hide: function () {

        }
    },

    attached() {
        this.getDayCheck()
    },

    methods: {
        /** 请求弹窗活动 */
        async getDayCheck() {
            await app.init()
            this.initData()
        },

        beforeFromTime(time) {
            var strtime = time.replace("/-/g", "/"); //时间转换
            //时间
            var date1 = new Date(strtime);
            //现在时间
            var date2 = new Date();
            //判断时间是否过期
            return date1.getTime() < date2.getTime() ? true : false;
        },

        async initData() {
            console.log('当前传递过来的团号:', this.data.popType)
            console.log('当前传递过来的拼团信息:', this.data.collageData)

            // const {
            //     data
            // } = await api.collage.getCollageViewById({
            //     launchInfoId: groupId
            // })
            // if (data) {
            //     console.log('根据团号查询详情:', data)
            //     var launchInfo = data.launchInfo
            //     var shareInfo = this.data.shareInfo
            //     launchInfo.closedTime = formatDateTime(launchInfo.to, 6)
            //     launchInfo.haveMe = launchInfo.memberInfos.some(item => {
            //         return item.memberId == app.globalData.allUserInfo ? .customerId
            //     })
            //     launchInfo.leaderUserInfo = launchInfo.memberInfos[0]
            //     launchInfo.otherUserInfo = launchInfo.memberInfos.slice(1, launchInfo.memberInfos.length)
            //     // console.log('拼团列表:', data)
            //     this.setData({
            //         'shareInfo.params': data
            //     }, () => {
            //         const that = this
            //         if (shareInfo ? .nickName && shareInfo ? .params ? .launchInfo ? .enable && shareInfo ? .params ? .launchInfo ? .status == 'STARTED') {
            //             that.setData({
            //                 showCollageDialogStatus: 1
            //             })
            //         }
            //         if (shareInfo ? .params ? .launchInfo ? .status == 'FAILURE' || shareInfo ? .params ? .launchInfo ? .status == 'CANCELLED') {
            //             that.setData({
            //                 showCollageDialogStatus: 2
            //             })
            //         }
            //         if (shareInfo ? .params ? .launchInfo ? .status == 'SUCCEED' && launchInfo.haveMe) {
            //             // 自己的团，成功了
            //             wx.getStorage({
            //                 key: data.activityId,
            //                 success: function (res) {
            //                     if (res.data === false) {
            //                         that.setData({
            //                             showCollageDialogStatus: 3
            //                         })
            //                         wx.setStorageSync(data.activityId, true)
            //                     }
            //                 },
            //                 fail: function () {
            //                     wx.setStorageSync(data.activityId, false)
            //                     that.setData({
            //                         showCollageDialogStatus: 3
            //                     })
            //                     wx.setStorageSync(data.activityId, true)
            //                 }
            //             })
            //         }
            //         if ((shareInfo ? .params ? .launchInfo ? .status != 'STARTED') && !launchInfo.haveMe) {
            //             // 别人的成功团
            //             that.setData({
            //                 showCollageDialogStatus: 4
            //             })
            //             // wx.showToast({
            //             //   title: "该拼团已成功",
            //             //   icon: "success",
            //             //   duration: 2000
            //             // })
            //         }
            //         if (that.data.closeCollage) {
            //             that.setData({
            //                 showCollageDialogStatus: 5
            //             })
            //         }
            //         if (that.data.sellOutFlag) {
            //             that.setData({
            //                 showCollageDialogStatus: 0
            //             })
            //         }

            //     })
            // }
        },

        async getAll(list) {
            const that = this
            var allDialogList = []

            if (list && list.length > 0) {
                for (let item of list) {
                    wx.getStorage({
                        key: item.id,
                        success: function (res) {
                            if (res.data === false) {
                                const itemIndex = list.find(item2 => {
                                    return item2.id == item.id
                                })
                                allDialogList.push(itemIndex)
                                console.log('当前需要弹窗个数:', allDialogList)
                                that.setData({
                                    currentDialog: allDialogList[that.data.currentDialogIndex],
                                    collageCheckData: allDialogList,
                                    // showCollageCheck: allDialogList.length > 0 ? true : false
                                }, () => {
                                    setTimeout(() => {
                                        console.log('我即将自动关闭某个弹窗:', that.data.collageCheckData[that.data.currentDialogIndex].id)
                                        wx.setStorageSync(that.data.collageCheckData[that.data.currentDialogIndex].id, true)
                                    }, 500)
                                })
                            }
                        },
                        fail: function () {
                            console.log('没有检测到')
                            // 这里需要重新触发
                            wx.setStorageSync(item.id, false)
                        }
                    })
                }
            }
        },

        closePopup(e) {
            const collageId = e.currentTarget.dataset.item.id
            console.log('当前弹窗:', this.data.currentDialog)
            console.log('当前弹窗index:', this.data.currentDialogIndex)
            console.log('点击了成功的弹窗ID:', collageId)
            wx.setStorageSync(this.data.collageCheckData[this.data.currentDialogIndex].id, true)
            if (this.data.collageCheckData.length > 0) {
                this.setData({
                    currentDialogIndex: this.data.currentDialogIndex + 1,
                    currentDialog: this.data.collageCheckData[this.data.currentDialogIndex + 1]
                }, () => {
                    if (this.data.collageCheckData.length === (this.data.currentDialogIndex)) {
                        this.setData({
                            showCollageCheck: false
                        })
                    }
                })
            }
        },

        /** 关闭所有弹窗 */


        /** 继续逛一逛 */
        async goOnCollage(e) {
            console.log('点击逛一逛')
            const collageId = e.currentTarget.dataset.item.id
            console.log('当前弹窗:', this.data.currentDialog)
            console.log('当前弹窗index:', this.data.currentDialogIndex)
            console.log('点击了成功的弹窗ID:', collageId)
            wx.switchTab({
                url: '/pages/tabBar/collage/index',
            })
        },

        /** 前往订单详情 */
        async goOrderDetail(e) {
            const collage = e.currentTarget.dataset.item
            console.log('正在跳转的订单:', collage)
            const {
                data
            } = await api.collage.getCollageViewById({
                launchInfoId: collage.id
            })
            if (data) {
                console.log('查询视图详情:', data)
                const currIndex = 0
                const orderId = data.memberOrderGoodsList[currIndex].orderId
                const url = orderId ? `/pages/order/detail/index?orderId=${orderId}` : '/pages/order/index?status=wait_shipment'
                wx.redirectTo({
                    url
                })
            }
        }


    }
})