/*
 * LeKeOpen-Applet
 * Copyright (c) 2017 https://lekee.cc All rights reserved.
 * Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
 * Author: gaopeng 
 */

var Api = require('../../utils/api.js');
var util = require('../../utils/util.js');


Page({
  data:{
    text:"Page topic",
    categoriesList:{},
    floatDisplay:"none"
  },
  onLoad:function(options){
    wx.setNavigationBarTitle({
      title: '码农的微世界-分类',
      success: function (res) {
        // success
      }
    });
    wx.showLoading({
      title: '正在加载',
      mask:true
    })
   

    this.fetchCategoriesData();
  },
  //获取分类列表
  fetchCategoriesData: function () {
    var self = this;
    self.setData({
      categoriesList: []
    });

    wx.request({
      url: Api.getCategories(),
      success: function (response) {
        self.setData({
          //categoriesList: response.data,

          floatDisplay:"block",

          categoriesList: self.data.categoriesList.concat(response.data.map(function (item) {
            if (typeof (item.category_thumbnail_image) == "undefined" || item.category_thumbnail_image=="") 
            {
              item.category_thumbnail_image ="../../images/website.png";
              
            }  
            return item;        
          })),


        });

        setTimeout(function () {
          wx.hideLoading();
        }, 900)
        wx.hideNavigationBarLoading();;

      }
    });
  },

  onShareAppMessage: function () {
    return {
      title: '分享“码农的微世界”小程序的分类栏目.',
      path: 'pages/topic/topic',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  //跳转至某分类下的文章列表
  redictIndex: function (e) {
    //console.log('查看某类别下的文章');  
    var id = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.item;
    var url = '../list/list?categoryID=' + id;
    wx.navigateTo({
      url: url
    });
  },
  onReady:function(){
    // 页面渲染完成
  },
  onPullDownRefresh: function () {
    
  },
  onShow:function(){
    
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})