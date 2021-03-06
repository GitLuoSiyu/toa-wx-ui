import deviceUtil from "../tool/utils/device-util";
import validator from "../tool/behaviors/validator";
import eventUtil from "../tool/core/utils/event-util";
const app = getApp()
Component({
    behaviors: [validator],
    externalClasses: ["l-title-class"],
    properties: {
        bgColor: {
            type: String,
            value: "white"
        },
        statusBarColor: {
            type: String,
            value: "transparent"
        },
        titleBarColor: {
            type: String,
            value: "transparent"
        },
        titleColor: {
            type: String,
            value: "black"
        },
        capsuleColor: {
            type: String,
            value: "black",
            options: ["white", "black"]
        },
        disableBack: {
            type: Boolean,
            value: !1
        },
        disableHome: {
            type: Boolean,
            value: !1
        },
        hiddenCapsule: {
            type: Boolean,
            value: !1
        },
        homePage: {
            type: String,
            value: ""
        },
        title: {
            type: String,
            value: ""
        },
        hasPadding: {
            type: Boolean,
            value: !0
        }
    },
    data: {
        titleBarHeight: deviceUtil.getTitleBarHeight(),
        statusBarHeight: deviceUtil.getStatusBarHeight(),
        capsuleButtonInfo: null,
        ios: false
    },
    lifetimes: {
        ready: function () {
            console.log('是否是苹果X系列:', app.globalData.isIphoneX)
            this.setData({
                capsuleButtonInfo: this.getCapsuleButtonInfo(),
                ios: app.globalData.isIphoneX
            })
        }
    },
    methods: {
        getCapsuleButtonInfo() {
            const t = wx.getSystemInfoSync().screenWidth,
                e = wx.getMenuButtonBoundingClientRect();
            return e.left = t - e.right, e.right = e.left + e.width, e
        },
        onTapLeftButton() {
            eventUtil.emit(this, "linlefttap"), this.data.disableBack || wx.navigateBack()
        },
        onLongPressLeftButton() {
            eventUtil.emit(this, "linleftlongpress")
        },
        async onTapRightButton() {
            eventUtil.emit(this, "linrighttap");
            const t = this.data.homePage;
            this.data.disableHome || wx.switchTab({
                url: t,
                fail() {
                    wx.navigateTo({
                        url: t
                    })
                }
            })
        },
        onLongPressRightButton() {
            eventUtil.emit(this, "linrightlongpress")
        }
    }
});