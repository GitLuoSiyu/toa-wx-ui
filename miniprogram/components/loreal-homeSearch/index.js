// components/searchInput/searchInput.js
import api  from '../../api/index'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    homeSearch: {
      value: false,
      type: Boolean
    },
    hot: {
      value: '',
      type: String
    },
    // 不跳转页面直接返回结果
    returnVal: {
      value: false,
      type: Boolean
    },
    //jumpsearchHistory 点击直接跳转搜索历史
    jumpsearchHistory: {
      value: false,
      type: Boolean
    },
    isShowValue: {
      value: false,
      type: Boolean
    },
    searchValue: {
      value: "",
      type: String
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    value: ""
  },
  ready() {
    if(this.data.isShowValue) {
      this.setData({
        searchDefault: this.data.searchValue
      })
    } else {
      let {
        hot
      } = this.data
      if (hot != '') {
        this.data.oldSearchDefault = hot
        this.setData({
          searchDefault: hot
        })
        return
      }
      this.loadKeyWord()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goSearch() {
      let {
        value,
        searchDefault = "",
        returnVal,
        jumpsearchHistory
      } = this.data
      if(jumpsearchHistory){
        this.toSearchHistoty()
        return
      }
      value = value.trim() || searchDefault
      if (!value) {
        wx.showToast({
          image: '/assets/img/common/cry.png',
          title: '请输入商品名称',
        })
        return
      }

      if (returnVal) {
        this.triggerEvent('callback', {
          value
        })
        return
      }
      wx.navigateTo({
        url: `/pages/tabBar/product/searchResult/index?keyword=${value}`,
      })
    },
    input(e) {
      let {
        value
      } = e.detail
      this.setData({
        value,
      })
    },
    inputFocus() {
      // this.setData({
      //   searchDefault: '',
      // })
    },
    inputBlur() {
      this.setData({
        searchDefault: this.data.oldSearchDefault
      })
    },
    async loadKeyWord() {
      let  result = await api.common.findKvDataByType({
        type: "keyword"
      })
      if (!result || !result.data ||  !result.data[0] || !result.data[0].name_cn) return
      let searchDefault = result.data[0].name_cn.replace(/[\r\n]/g, "")
      this.data.oldSearchDefault = searchDefault
      this.setData({
        searchDefault: searchDefault || "",
      })
    },
    toSearchHistoty() {
      let {
        jumpsearchHistory
      } = this.data
      if (!jumpsearchHistory) return
      wx.navigateTo({
        url: '/pages/tabBar/product/search/index',
      })
    },
  }
})