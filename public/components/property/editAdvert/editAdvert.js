(function(vc, vm) {
    vc.extends({
        data: {
            editAdvertInfo: {
                advertId: '',
                adName: '',
                adTypeCd: '',
                classify: '',
                locationTypeCd: '',
                locationObjId: '',
                locationObjName: '',
                state: '',
                seq: '',
                advertType: '',
                pageUrl: '',
                startTime: '',
                endTime: '',
                floorId: '',
                floorNum: '',
                floorName: '',
                unitId: '',
                unitNum: '',
                roomId: '',
                roomNum: '',
                photos: [],
                viewType: '',
                vedioName: '',
                communityId: ''
            }
        },
        _initMethod: function() {
            vc.component._initEditAdvertDateInfo();
        },
        _initEvent: function() {
            vc.on('editAdvert', 'openEditAdvertModal', function(_params) {
                vc.component.refreshEditAdvertInfo();
                $('#editAdvertModel').modal('show');
                vc.copyObject(_params, vc.component.editAdvertInfo);
                vc.component._loadAdvertItem();
                //查询 广告属性
            });
            vc.on("editAdvert", "notify", function(_param) {
                if (_param.hasOwnProperty("floorId")) {
                    vc.component.editAdvertInfo.floorId = _param.floorId;
                }
                if (_param.hasOwnProperty("unitId")) {
                    vc.component.editAdvertInfo.unitId = _param.unitId;
                }
                if (_param.hasOwnProperty("roomId")) {
                    vc.component.editAdvertInfo.roomId = _param.roomId;
                }
            });
            vc.on("editAdvert", "notifyUploadImage", function(_param) {

                if (!_param || _param.length < 1) {
                    return;
                }
                vc.component.editAdvertInfo.photos = [];
                _param.forEach(item => {
                    vc.component.editAdvertInfo.photos.push(item)
                });
            });
            vc.on("editAdvert", "notifyUploadVedio", function(_param) {
                vc.component.editAdvertInfo.vedioName = _param.realFileName;
            });
        },
        methods: {
            _initEditAdvertDateInfo: function() {
                vc.component.editAdvertInfo.startTime = vc.dateTimeFormat(new Date().getTime());
                $('.editAdvertStartTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.editAdvertStartTime').datetimepicker()
                    .on('changeDate', function(ev) {
                        var value = $(".editAdvertStartTime").val();
                        vc.component.editAdvertInfo.startTime = value;
                    });
                $('.editAdvertEndTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.editAdvertEndTime').datetimepicker()
                    .on('changeDate', function(ev) {
                        var value = $(".editAdvertEndTime").val();
                        vc.component.editAdvertInfo.endTime = value;
                    });
            },
            editAdvertValidate: function() {
                return vc.validate.validate({
                    editAdvertInfo: vc.component.editAdvertInfo
                }, {
                    'editAdvertInfo.adName': [{
                            limit: "required",
                            param: "",
                            errInfo: "广告名称不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "1,200",
                            errInfo: "广告名称不能超过200位"
                        },
                    ],
                    'editAdvertInfo.adTypeCd': [{
                            limit: "required",
                            param: "",
                            errInfo: "广告类型不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "广告类型不能为空"
                        },
                    ],
                    'editAdvertInfo.classify': [{
                            limit: "required",
                            param: "",
                            errInfo: "广告分类不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "广告分类格式错误"
                        },
                    ],
                    'editAdvertInfo.advertType': [{
                        limit: "required",
                        param: "",
                        errInfo: "发布类型不能为空"
                    }],
                    'editAdvertInfo.locationTypeCd': [{
                            limit: "required",
                            param: "",
                            errInfo: "投放位置不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "投放位置格式错误"
                        },
                    ],
                    'editAdvertInfo.seq': [{
                            limit: "required",
                            param: "",
                            errInfo: "播放顺序不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "播放顺序不是有效的数字"
                        },
                    ],
                    'editAdvertInfo.startTime': [{
                            limit: "required",
                            param: "",
                            errInfo: "投放时间不能为空"
                        },
                        {
                            limit: "dateTime",
                            param: "",
                            errInfo: "不是有效的时间格式"
                        },
                    ],
                    'editAdvertInfo.endTime': [{
                            limit: "required",
                            param: "",
                            errInfo: "结束时间不能为空"
                        },
                        {
                            limit: "dateTime",
                            param: "",
                            errInfo: "不是有效的时间格式"
                        },
                    ],
                    'editAdvertInfo.advertId': [{
                        limit: "required",
                        param: "",
                        errInfo: "广告ID不能为空"
                    }]
                });
            },
            editAdvert: function() {
                if (!vc.component.editAdvertValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                if (vc.component.editAdvertInfo.viewType == '8888') {
                    vc.component.editAdvertInfo.vedioName = '';
                } else {
                    vc.component.editAdvertInfo.photos = [];
                }
                vc.http.apiPost(
                    '/advert.updateAdvert',
                    JSON.stringify(vc.component.editAdvertInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            $('#editAdvertModel').modal('hide');
                            vc.emit('advertManage', 'listAdvert', {});
                            vc.toast("修改成功");
                            return;
                        }
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            _loadAdvertItem: function() {
                var param = {
                    params: {
                        advertId: vc.component.editAdvertInfo.advertId,
                        page: 1,
                        row: 50,
                    }
                };
                //发送get请求
                vc.http.apiGet('/advert.listAdvertItems',
                    param,
                    function(json, res) {
                        var _advertItemInfo = JSON.parse(json);
                        vc.component._freshPhotoOrVedio(_advertItemInfo.advertItems);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _freshPhotoOrVedio: function(_advertItems) {

                if (!_advertItems || _advertItems.length < 1) {
                    vc.emit('editAdvert', 'uploadImage', 'notifyPhotos', []);
                }
                //判断属性中是否有照片
                _advertItems.forEach(function(_item) {
                    vc.component.editAdvertInfo.viewType = _item.itemTypeCd;
                    var _photos = [];
                    if (_item.itemTypeCd == '8888') {
                        //vc.component.editAdvertInfo.photos.push(_item.url);
                        _photos.push(_item.url);
                        vc.emit('editAdvert', 'uploadImage', 'notifyPhotos', _photos);
                    } else {
                        vc.component.editAdvertInfo.vedioName = _item.url;
                        vc.emit('editAdvert', 'uploadVedio', 'notifyVedio', _item.url);
                    }
                });
            },
            refreshEditAdvertInfo: function() {
                vc.component.editAdvertInfo = {
                    advertId: '',
                    adName: '',
                    adTypeCd: '',
                    classify: '',
                    locationTypeCd: '',
                    locationObjId: '',
                    state: '',
                    seq: '',
                    advertType: '',
                    pageUrl: '',
                    startTime: '',
                    endTime: '',
                    floorId: '',
                    floorNum: '',
                    floorName: '',
                    unitId: '',
                    unitNum: '',
                    roomId: '',
                    roomNum: '',
                    photos: [],
                    viewType: '',
                    vedioName: '',
                    communityId: ''
                }
            }
        }
    });
})(window.vc, window.vc.component);