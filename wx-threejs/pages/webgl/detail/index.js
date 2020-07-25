
Page({
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad (options) {
        this.initData()
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    async initData() {
        wx.createSelectorQuery()
            .select('#webgl')
            .node()
            .exec((res) => {
                const webgl = res[0].node
                const gl = webgl.getContext('webgl')
                if(!gl) {
                    wx.showToast({ title: '当前微信版本版本不支持3D展示，请升级'  })
                }
                console.log(gl)
            })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})