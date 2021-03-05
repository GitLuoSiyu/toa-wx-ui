Component({
    relations: {
        "../loreal-tabs/index": {
            type: "parent",
            linked: function (t) {
                !this.data.parent && this.setData({
                    parent: t
                })
            }
        },
        "../loreal-combined-tabs/index": {
            type: "parent",
            linked: function (t) {
                !this.data.parent && this.setData({
                    parent: t
                })
            }
        }
    },
    properties: {
        tab: String,
        subTab: String,
        subKey: String,
        key: String,
        icon: String,
        iconSize: {
            type: String,
            value: "20"
        },
        image: Object,
        picPlacement: {
            type: String,
            value: "top"
        }
    },
    observers: {
        "**": function (t) {
            this.updateData(t)
        }
    },
    data: {
        isCurrent: !1,
        index: 0,
        parent: null
    },
    methods: {
        updateData() {
            let t = this.data.parent;
            t && t.initTabs()
        }
    }
});