
const app = getApp()
import api from '../../api/index'
import {
  pagePathObj,
  valPageUrl
} from './method.js'
// Simple 简单组件
// SearchView 搜索组件
// ProductView 产品组件
// ActivityView 活动组件
// GroupView 轮播图
// ActivityPageView 活动页
// CatetoryView 分类组件
// ManualInput Label 标签组件 本小程序未配置
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    pageCode: {
      type: String,
      value: "FirstPage"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    swiperCurrent: 0,
    searchDefault: "水动力洁面乳",
    value: "",
    subPagesDto: null,
    loading: false,
    allVideoHeight: {},
  },
  attached() {
    this.getLoadPage()
  },
  observers: {
    'pageCode': function() {
      this.getLoadPage()
    }
  },

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function() {
      this.getLoadPage()
    },
    hide: function() {},
    resize: function() {},
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getLoadPage() {
      let {
        subPagesDto,
        loading,
        pageCode
      } = this.data
      if (!subPagesDto && !loading && pageCode) {
        this.loadPage()
      }
    },
    async loadPage() {
      if (this.data.loading) return
      this.data.loading = true
      await app.init().catch(err=>{
        this.data.loading = false
      })
      let {
        pageCode,
      } = this.data

      const res = await await api.activity.getPageSetting({
        code: pageCode
      }).catch(() => {
        this.data.loading = false
      })
      this.data.loading = false
      if (!res || !res.data) {
        wx.showToast({
          title: '当前页面配置为空',
          icon: 'none',
          duration: 2000
        })
        return
      }
   
      let subPagesDto = res.data.subPagesDto;
      let title = res.data.title || app.config.accountName
      subPagesDto.forEach(elem=>{
        if(elem.pageType=='GroupView'  && elem.showCount==2 &&  elem.subPagesDto.length){
          console.log('页面配置数据:',elem.subPagesDto)
            let handleArr=[]
            for(let i=0;i<elem.subPagesDto.length;i++){
              handleArr.push(elem.subPagesDto[i+1]?[elem.subPagesDto[i],elem.subPagesDto[++i]]:[elem.subPagesDto[i]])
            }
            elem.subPagesDto=handleArr
        }
      })
      this.setData({
        subPagesDto,
        shareInfo: {
          title,
        }
      })
    },

    getSwiperH(e) {
      var query = this.createSelectorQuery();
      const {
        code
      } = e.currentTarget.dataset
      //选择id
      query.select(`#id${code}`).boundingClientRect()
      query.exec((res) => {
        //取高度
        let obj = {}
        let key = `allSwiperHeight.swiperHeight_${code}`
        obj[key] = res[0].height
        this.setData(obj)
        console.log()
      })
    },
    getVideoH(e) {
      const sub = e.currentTarget.dataset.subfather
      const viewHeight = 750 / (e.detail.width / e.detail.height) / sub.showCount
      let key = `allVideoHeight.videoHeight_${sub.code}`
      let obj = {}
      obj[key] = viewHeight
      if (!this.data.allVideoHeight[key]) {
        this.setData(obj)
      }
    },
    swiperChange(e) {
      let {
        setCurrent
      } = this.data
      if (setCurrent) return
      this.data.setCurrent = true
      let {
        current
      } = e.detail
      this.setData({
        swiperCurrent: current
      }, () => {
        this.data.setCurrent = false
      })
    },
    toDetail(e) {
      console.log(e)
      let {
        item
      } = e.currentTarget.dataset
      console.log("item", item)
      let url = item.linkPage || ""
      valPageUrl(url) //验证url
      if (pagePathObj[item.pageType] && pagePathObj[item.pageType](item)) { //判断是否存在三个组件中
        url = pagePathObj[item.pageType](item)
      }
      console.log('url', url)
      if (url) {
        wx.navigateTo({
          url: url,
          fail() {
            wx.reLaunch({
              url,
            })
          }
        })
      }
    }
  }
})