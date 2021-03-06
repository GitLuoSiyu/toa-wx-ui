import api from '../../api/index'
const app = getApp()
Component({
  properties: {

  },

  data: {
    hideBtn: false
  },
  async ready() {
    await app.init()
    console.log('用户基本信息:', app.globalData.userInfo)
    this.setData({
      hideBtn: app.globalData.userInfo.isUserAuth || false
    })
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: async function () {
      await app.init()
      this.setData({
        hideBtn: app.globalData.userInfo.isUserAuth || false
      })
    },
    hide: function () {},
    resize: function () {},
  },

  detached() {

  },
  /**
   * 组件的方法列表
   */
  methods: {
    async getuserinfo(e) {
      if (e.detail.errMsg.indexOf('getUserInfo:ok') >= 0) {
        const userInfo = JSON.parse(e.detail.rawData)
        await api.method.common.checkSession()
        /* 上报用户信息 */
        api.user.decodeUserInfo({
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
        }).then((res) => {
          userInfo.isUserAuth = true
          app.mutationUserInfo(userInfo)
          this.setData({
            hideBtn: true
          })
          this.triggerEvent('callback')
        })
      }
    },
  }
})