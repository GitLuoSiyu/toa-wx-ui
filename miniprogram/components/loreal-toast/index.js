import computeOffset from "../behaviors/computeOffset";
import zIndex from "../behaviors/zIndex";
import watchShow from "../behaviors/watchShow";
Component({
    behaviors: [computeOffset, zIndex, watchShow],
    externalClasses: ["l-bg-class", "l-icon-class", "l-class", "l-image-class", "l-title-class "],
    properties: {
        show: {
            type: Boolean,
            value: !1
        },
        title: String,
        icon: String,
        iconSize: String,
        iconColor: String,
        image: String,
        placement: {
            type: String,
            value: "bottom"
        },
        duration: {
            type: Number,
            value: 1500
        },
        zIndex: {
            type: Number,
            value: 777
        },
        center: {
            type: Boolean,
            value: !0
        },
        mask: {
            type: Boolean,
            value: !1
        },
        openApi: {
            type: Boolean,
            value: !0
        },
        offsetX: Number,
        offsetY: Number
    },
    data: {
        status: !1,
        success: "",
        fail: "",
        complete: ""
    },
    observers: {
        icon: function () {}
    },
    attached() {
        this.data.openApi && this.initToast()
    },
    pageLifetimes: {
        show() {
            this.data.openApi && this.initToast(), this.offsetMargin()
        }
    },
    methods: {
        initToast() {
            wx.lin = wx.lin || {}, wx.lin.showToast = (e = {}) => {
                const {
                    title: t = "",
                    icon: o = "",
                    image: s = "",
                    placement: i = "bottom",
                    duration: a = 1500,
                    center: n = !0,
                    mask: l = !1,
                    success: r = null,
                    complete: c = null,
                    offsetX: h = 0,
                    offsetY: f = 0,
                    iconSize: m = "60",
                    iconColor: p = ""
                } = e;
                return this.setData({
                    title: t,
                    icon: o,
                    image: s,
                    placement: i,
                    duration: a,
                    center: n,
                    mask: l,
                    success: r,
                    complete: c,
                    offsetY: f,
                    offsetX: h,
                    iconSize: m,
                    iconColor: p
                }), this.changeStatus(), this
            }, wx.lin.hideToast = () => {
                this.setData({
                    status: !1
                })
            }
        },
        strlen(e) {
            for (var t = 0, o = 0; o < e.length; o++) {
                var s = e.charCodeAt(o);
                s >= "0x0001" && s <= "0x007e" || "0xff60" <= s && s <= "0xff9f" ? t++ : t += 2
            }
            return t
        },
        doNothingMove() {},
        onMaskTap() {
            !0 !== this.data.locked && this.setData({
                fullScreen: "hide",
                status: "hide"
            }), this.triggerEvent("lintap", !0, {
                bubbles: !0,
                composed: !0
            })
        }
    }
});