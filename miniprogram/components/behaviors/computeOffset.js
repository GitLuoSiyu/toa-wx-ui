export default Behavior({
    behaviors: [],
    properties: {},
    data: {
        distance: 0
    },
    attached() {
        this.offsetMargin()
    },
    methods: {
        offsetMargin() {
            const {
                windowHeight: wHeight,
                screenHeight: sHeight
            } = wx.getSystemInfoSync();
            this.setData({
                distance: sHeight - wHeight
            })
        }
    }
});