// Simple 简单组件
// SearchView 搜索组件
// ProductView 产品组件
// ActivityView 活动组件
// GroupView 轮播图
// ActivityPageView 活动页
// CatetoryView 分类组件
// ManualInput Label 标签组件 本小程序未配置

// 根据组件判断跳转
export const pagePathObj = {
  'ActivityView': function (item) {
    return `/pages/tabBar/index/activity/index?code=${item.relateActivityCode}`
  },
  'ProductView': function (item) {
    return `/pages/tabBar/product/detail/index?id=${item.productSetting.productId}&skuId=${item.productSetting.skuId}`
  },
  'CatetoryView': function (item) {
    return `/pages/tabBar/product/index?id=${item.categoryId}`
    // return `/pages/classification/classificationDetail/classificationDetail?id=${item.catetoryId}`
  },
  //跳转小程序
  'Simple': function (item) {
    try{
      if (item.linkPage.includes('toMiniProgram')) {
        const toMiniProgramObj = JSON.parse(item.linkPage)
        if (toMiniProgramObj.toMiniProgram) {
          wx.navigateToMiniProgram({
            envVersion: getApp().config.envVersion,
            ...toMiniProgramObj,
            success(res) {
              console.log('打开成功')
            }
          })
        }
      }
    }catch(err){
      console.log('获取配置错误',err)
    }
  
    return false
    // return `/pages/classification/classificationDetail/classificationDetail?id=${item.catetoryId}`
  },
}
//验证头部是否有斜杆
export const valPageUrl = function (url) {
  if (url != "" && url.indexOf('/') != 0) {
    url = `/${url}`
  }
  return url
}