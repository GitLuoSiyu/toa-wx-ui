const app = getApp()
import api from '../../api/index'
Component({
    properties: {

    },
    data: {

        image: false
    },

    observers: {

    },

    attached() {
        // this.getInitData()
    },

    methods: {
        /** 请求弹窗活动 */
        async getDayCheck() {
            const {
                popType
            } = this.data
            app.init().then(() => {
                this.initData(popType)
            })
        },

        async initData(popType) {
            const {
                data
            } = await api.activity.dayCheckByPopType({
                popType
            })
            if (data) {
                this.setData({
                    dayCheckData: data,
                    showDayCheck: data.show
                })
            }
        },

        async goDaycheck(e) {
            const url = e.currentTarget.dataset.url
            wx.navigateTo({
                url,
                fail() {
                    wx.switchTab({
                        url
                    })
                }
            })
        },

        async closePopup() {
            this.setData({
                showDayCheck: false
            })
        }


    }
})