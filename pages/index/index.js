/*
 * LeKeOpen-Applet
 * Copyright (c) 2017 https://lekee.cc All rights reserved.
 * Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
 * Author: gaopeng 
 */

var Api = require('../../utils/api.js');
var util = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');


Page({
  data: {
    title: '文章列表',
    postsList: {},
    pagesList: {},
    categoriesList: {},
    postsShowSwiperList: {},


    isLastPage:false,
    
    page: 1,
    search: '',
    categories: 0,
    showerror:"none",

    showCategoryName:"",

    categoryName:"",

    showallDisplay:"block",

    

    displayHeader:"none",
    displaySwiper: "none",
    floatDisplay: "none",

  },
  formSubmit: function (e) {
    var url = '../list/list'
    if (e.detail.value.input != '') {
      url = url + '?search=' + e.detail.value.input;
      wx.navigateTo({
        url: url
      })
    }
    else
    {
      wx.showModal({
        title: '提示',
        content: '请输入搜索内容',
        showCancel: false,
      });


    }
    
    
  },
  onShareAppMessage: function () {
    return {
      title: '码农的微世界，基于 WordPress。技术支持：乐可开源',
      path: 'pages/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  onPullDownRefresh: function () {
    var self = this;
    self.setData({
      showerror: "none",
      showallDisplay:"none",
      displaySwiper:"none",
      floatDisplay:"none"
    });
    this.fetchTopFivePosts(); 
    
  },
  onReachBottom: function () {

    //console.log("xialajiazai");  
   
  },
  onLoad: function (options) {
    var self = this; 
    this.fetchTopFivePosts();   
  },

  
  fetchTopFivePosts: function () {
    var self = this;
    self.setData({
      postsShowSwiperList: []
    });


    //先优先获取置顶的文章
    wx.request({
      url: Api.getStickyPosts(),
      success: function (response) {
        if (response.data.length > 0) {

          self.setData({
           postsShowSwiperList: response.data,
            postsShowSwiperList: self.data.postsShowSwiperList.concat(response.data.map(function (item) {
              //item.firstImage = Api.getContentFirstImage(item.content.rendered);
              if (item.post_medium_image_300 == null || item.post_medium_image_300 =='')
              {
                if (item.content_first_image != null && item.content_first_image !='')
                {
                  item.post_medium_image_300 = item.content_first_image;
                }
                else
                {
                  item.post_medium_image_300 = Api.getContentFirstImage(item.content.rendered);
                }

              }             
              return item;
            })),
            showallDisplay: "block",
            displaySwiper: "block"
          });

          self.fetchPostsData(self.data);
        }

        else {
          self.setData({
           
            displaySwiper: "none",
            displayHeader:"block",
            showallDisplay: "block",

          });
          self.fetchPostsData(self.data);
        }

      },
      fail: function (response) {
        //var temp = response.data;

      }
    });
  },

  //获取文章列表数据
  fetchPostsData: function (data) {
    var self = this;    
    if (!data) data = {};
    if (!data.page) data.page = 1;
    if (!data.categories) data.categories = 0;
    if (!data.search) data.search = '';
    if (data.page === 1) {
      self.setData({
        postsList: []
      });
    };

    wx.showLoading({
      title: '正在加载',
      mask:true
    }) 
    wx.request({
      url: Api.getPosts(data),
      success: function (response) {

        if (response.statusCode === 200) {

          if (response.data.length<6)
          {
            self.setData({
              isLastPage: true
            });
          }      
          self.setData({
            floatDisplay: "block",
            postsList: self.data.postsList.concat(response.data.map(function (item) {
          
              var strdate = item.date
              if (item.category_name !=null)
              {
                
                item.categoryImage ="../../images/topic.png";
              }
              else
              {
                item.categoryImage = "";
              }

              if (item.post_thumbnail_image == null ||item.post_thumbnail_image =='' )
              {
                item.post_thumbnail_image = Api.getContentFirstImage(item.content.rendered);
              }
              item.date = util.cutstr(strdate, 10, 1);
              return item;
            })),

          });          
          setTimeout(function () {
            wx.hideLoading();            
          }, 900);
        }
        else
        {

        
          if (response.data.code =="rest_post_invalid_page_number")
          {

            self.setData({
              isLastPage:true
            });
            wx.showToast({
              title: '没有更多内容',
              mask:false,
              duration: 1500
            });
          }
          else
          {
            wx.showToast({
              title: response.data.message,
              duration: 1500
            })
          }
        }
      },

       fail: function (res) {

         wx.hideLoading();
         if (data.page == 1) {

           self.setData({
             showerror: "block",
             floatDisplay: "none"
           });
          
         }
         else
         {
           wx.showModal({
             title: '加载失败',
             content: '加载数据失败,请重试.',
             showCancel: false,
           });


           self.setData({
             page: data.page-1
           });
         }
         

      },
      complete:function()
      {
        wx.stopPullDownRefresh();
      }

    });
  },
  //加载分页
  loadMore: function (e) {
    
    var self = this;
    if (!self.data.isLastPage)
    {
      self.setData({
        page: self.data.page + 1
      });
      console.log('当前页' + self.data.page);
      this.fetchPostsData(self.data);
    }
    else
    {
      wx.showToast({
        title: '没有更多内容',
        mask: false,
        duration: 1000
      });
    }
  },
  //获取页面列表
  fetchPagesData: function () {
    var self = this;
    wx.request({
      url: Api.getPages(),
      success: function (response) {
        self.setData({
          pagesList: response.data
        });
      }
    });
  },

  //获取分类列表
  fetchCategoriesData: function () {
    var self = this;
    wx.request({
      url: Api.getCategories(),
      success: function (response) {
        self.setData({
          categoriesList: response.data
        });
      }
    });
  },


  // 跳转至查看文章详情
  redictDetail: function (e) {
    // console.log('查看文章');
    var id = e.currentTarget.id,
      url = '../detail/detail?id=' + id;
    wx.navigateTo({
      url: url
    })
  },

  

  //返回首页
  redictHome: function (e) {
    //console.log('查看某类别下的文章');  
    var id = e.currentTarget.dataset.id,
      url = '/pages/index/index';

    wx.switchTab({
      url: url
    });
  }
})



