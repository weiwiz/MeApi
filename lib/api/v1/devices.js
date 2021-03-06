/**
 * Created by song on 2015/7/2.
 */
'use strict';
var _ = require('lodash');
var util = require('util');
var result = require('./model/http-client-response.json');
var utilCommon = require('./util/common.js');
var logger = require('../../mlogger/mlogger.js');

var SUPPORTED_DEVICE_EN = {
  types: [
    {
      classId: "",
      className: "Energy Device",
      classIcon: "ic_dev_class_energy",
      classDescription: "Provide home Smart energy management services",
      classTypes: [
        {
          typeId: "040B08040004",
          typeName: "MeBoost",
          typeIcon: "ic_dev_meboost",
          typeDescription: "Smart water heater"
        },
        {
          typeId: "040B01000001",
          typeName: "MeRFCT",
          typeIcon: "ic_dev_merfct",
          typeDescription: "Smart collector of current"
        },
        {
          typeId: "040B01000005",
          typeName: "MeStorage",
          typeIcon: "ic_dev_mestorage",
          typeDescription: "Energy storage"
        },
        {
          typeId: "040B01000004",
          typeName: "MeInverter",
          typeIcon: "ic_dev_meinverter",
          typeDescription: "Free and clean energy providers"
        }
      ]
    },
    {
      classId: "",
      className: "Switch Device",
      classIcon: "ic_dev_class_switch",
      classDescription: "Provide light control service",
      classTypes: [
        {
          typeId: "040B09050101",
          typeName: "MeReceiver",
          typeIcon: "ic_dev_mereceiver1",
          typeDescription: "Single loop wireless receiver"
        },
        {
          typeId: "040B09051001",
          typeName: "MePanel1",
          typeIcon: "ic_dev_mepanel1",
          typeDescription: "Single channel switch panel"
        },
        {
          typeId: "040B09051002",
          typeName: "MePanel2",
          typeIcon: "ic_dev_mepanel2",
          typeDescription: "Double channel switch panel"
        },
        {
          typeId: "040B09051113",
          typeName: "MePanel3",
          typeIcon: "ic_dev_mepanel3",
          typeDescription: "Three channel switch panel"
        },
        {
          typeId: "040B09051114",
          typeName: "MePanel4",
          typeIcon: "ic_dev_mepanel4",
          typeDescription: "Four channel switch panel"
        }
      ]
    },
    {
      classId: "",
      className: "Hot water management device",
      classIcon: "ic_dev_class_hotwater",
      classDescription: "Provide hot water management services",
      classTypes: [
        {
          typeId: "040B08080001",
          typeName: "MeHotWater",
          typeIcon: "ic_dev_mehotwater",
          typeDescription: "Smart hot water manager"
        },
        {
          typeId: "040B08090001",
          typeName: "MeSwitch",
          typeIcon: "ic_dev_meswitch",
          typeDescription: "Smart switch control"
        }
      ]
    },
    {
      classId: "",
      className: "Temperature control device",
      classIcon: "ic_dev_class_temperature_control",
      classDescription: "Provide Smart temperature service",
      classTypes: [
        {
          typeId: "050608070001",
          typeName: "MeThermostat-Wifi",
          typeIcon: "ic_dev_methermostat",
          typeDescription: "Smart temperature manager"
        }
      ]
    }
  ]
};
var SUPPORTED_DEVICE_CN = {
  types: [
    {
      classId: "",
      className: "能源设备",
      classIcon: "ic_dev_class_energy",
      classDescription: "提供家庭智能能源管理服务",
      classTypes: [
        {
          typeId: "040B08040004",
          typeName: "热水箱控制器",
          typeIcon: "ic_dev_meboost",
          typeDescription: "智能热水器用电方案提供者"
        },
        {
          typeId: "040B01000001",
          typeName: "逆流传观器",
          typeIcon: "ic_dev_merfct",
          typeDescription: "智能电流流量流向采集器"
        },
        {
          typeId: "040B01000005",
          typeName: "储能机",
          typeIcon: "ic_dev_mestorage",
          typeDescription: "智能能源存储与调度管理"
        },
        {
          typeId: "040B01000004",
          typeName: "逆变器",
          typeIcon: "ic_dev_meinverter",
          typeDescription: "免费清洁能源提供者"
        }
      ]
    },
    {
      classId: "",
      className: "开关设备",
      classIcon: "ic_dev_class_switch",
      classDescription: "提供家庭灯控服务",
      classTypes: [
        {
          typeId: "040B09050101",
          typeName: "单路接收器",
          typeIcon: "ic_dev_mereceiver1",
          typeDescription: "单回路低功耗无线接收器"
        },
        {
          typeId: "040B09051001",
          typeName: "单开面板",
          typeIcon: "ic_dev_mepanel1",
          typeDescription: "单控无线无缘面板"
        },
        {
          typeId: "040B09051002",
          typeName: "双开面板",
          typeIcon: "ic_dev_mepanel2",
          typeDescription: "双控无线无缘面板"
        },
        {
          typeId: "040B09051113",
          typeName: "圆形三开面板",
          typeIcon: "ic_dev_mepanel3",
          typeDescription: "三控无线无缘面板"
        },
        {
          typeId: "040B09051114",
          typeName: "四开面板",
          typeIcon: "ic_dev_mepanel4",
          typeDescription: "四控无线无线面板"
        }
      ]
    },
    {
      classId: "",
      className: "热水管理设备",
      classIcon: "ic_dev_class_hotwater",
      classDescription: "提供家庭智能热水管理服务",
      classTypes: [
        {
          typeId: "040B08080001",
          typeName: "热水管理器",
          typeIcon: "ic_dev_mehotwater",
          typeDescription: "热水电池阀智能管理与控制"
        },
        {
          typeId: "040B08090001",
          typeName: "智能插座",
          typeIcon: "ic_dev_meswitch",
          typeDescription: "电热水箱智能开关控制"
        }
      ]
    },
    {
      classId: "",
      className: "温控设备",
      classIcon: "ic_dev_class_temperature_control",
      classDescription: "提供家庭智能温控服务",
      classTypes: [
        {
          typeId: "050608070001",
          typeName: "温控器(Wifi-月动)",
          typeIcon: "ic_dev_methermostat",
          typeDescription: "智能温度控制管理器"
        }
      ]
    }
  ]
};

function devices(conx) {
  this.get = function (request, userId, callback) {
    var res = JSON.parse(JSON.stringify(result));
    res.weiwiz.MHome.errorId = 200;
    res.weiwiz.MHome.errorMsg = "";
    res.weiwiz.MHome.response = SUPPORTED_DEVICE_EN;
    utilCommon.getUser(conx, userId, function (user) {
      if (!util.isNullOrUndefined(user) && !util.isNullOrUndefined(user.extra.settings)) {
        var index = _.findIndex(user.extra.settings, {"name": "language"});
        if (-1 !== index) {
          var userLanguage = user.extra.settings[index].value;
          if ("zh" === userLanguage) {
            res.weiwiz.MHome.response = SUPPORTED_DEVICE_CN;
          }
        }
      }
      callback(res);
    });
    /*var parameter = {
     version : {
     id : request.query["version"]
     }
     };
     utilCommon.sendMsg(conx, conx.configurator.getConfRandom("services.device_adapter"), "getDeviceSupported", parameter,
     function (response) {
     if ( response.code === 200) {
     res.flag = true;
     res.errorId = 200;
     res.response = response.data;
     }else
     {
     res.flag = false;
     res.errorId = response.code;
     }
     callback(res);
     });*/
  }
}

module.exports = devices;