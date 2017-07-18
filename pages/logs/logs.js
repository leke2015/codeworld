// +----------------------------------------------------------------------
// | LeKeOpen-Applet [ Improve the lives source ]
// +----------------------------------------------------------------------
// | Copyright (c) 2017 http://lekee.cc All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: gaopeng
// +----------------------------------------------------------------------
//logs.js


var util = require('../../utils/util.js')
Page({
  data: {
    logs: []
  },
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(function (log) {
        return util.formatTime(new Date(log))
      })
    })
  }
})
