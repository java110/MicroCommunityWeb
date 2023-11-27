(function(vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addAdvertInfo: {
                advertId: '',
                adName: '',
                adTypeCd: '20000',
                classify: '',
                locationTypeCd: '',
                locationObjId: '-1',
                seq: '',
                startTime: '',
                endTime: '',
                floorId: '',
                advertType: '',
                pageUrl: '',
                floorNum: '',
                floorName: '',
                unitId: '',
                unitName: '',
                roomId: '',
                photos: [],
                viewType: '8888',
                vedioName: '',
            }
        },
        _initMethod: function() {
            vc.component._initAddAdvertDateInfo();
        },
        _initEvent: function() {
            vc.on('addAdvert', 'openAddAdvertModal', function() {
                $('#addAdvertModel').modal('show');
            });
            vc.on("addAdvert", "notify", function(_param) {
                if (_param.hasOwnProperty("floorId")) {
                    vc.component.addAdvertInfo.floorId = _param.floorId;
                }
                if (_param.hasOwnProperty("unitId")) {
                    vc.component.addAdvertInfo.unitId = _param.unitId;
                }
                if (_param.hasOwnProperty("roomId")) {
                    vc.component.addAdvertInfo.roomId = _param.roomId;
                }
            });
            vc.on("addAdvert", "notifyUploadImage", function(_param) {
                if (!_param || _param.length < 1) {
                    return;
                }
                vc.component.addAdvertInfo.photos = [];
                _param.forEach(item => {
                    vc.component.addAdvertInfo.photos.push(item);
                });
            });
            vc.on("addAdvert", "notifyUploadVedio", function(_param) {
                vc.component.addAdvertInfo.vedioName = _param.realFileName;
            });
        },
        methods: {
            _initAddAdvertDateInfo: function() {
                vc.component.addAdvertInfo.startTime = vc.dateTimeFormat(new Date().getTime());
                $('.addAdvertStartTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.addAdvertStartTime').datetimepicker()
                    .on('changeDate', function(ev) {
                        var value = $(".addAdvertStartTime").val();
                        vc.component.addAdvertInfo.startTime = value;
                    });
                $('.addAdvertEndTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.addAdvertEndTime').datetimepicker()
                    .on('changeDate', function(ev) {
                        var value = $(".addAdvertEndTime").val();
                        vc.component.addAdvertInfo.endTime = value;
                    });
            },
            addAdvertValidate: function() {
                return vc.validate.validate({
                    addAdvertInfo: vc.component.addAdvertInfo
                }, {
                    'addAdvertInfo.adName': [{
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
                    'addAdvertInfo.adTypeCd': [{
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
                    'addAdvertInfo.classify': [{
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
                    'addAdvertInfo.locationTypeCd': [{
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
                    'addAdvertInfo.advertType': [{
                        limit: "required",
                        param: "",
                        errInfo: "发布类型不能为空"
                    }],
                    'addAdvertInfo.seq': [{
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
                    'addAdvertInfo.startTime': [{
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
                    'addAdvertInfo.endTime': [{
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
                });
            },
            saveAdvertInfo: function() {
                if (!vc.component.addAdvertValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                if (vc.component.addAdvertInfo.viewType == '8888') {
                    vc.component.addAdvertInfo.vedioName = '';
                } else {
                    vc.component.addAdvertInfo.photos = [];
                }
                if (vc.component.addAdvertInfo.viewType == '8888' && vc.component.addAdvertInfo.photos.length < 1) {
                    vc.toast('请上传图片');
                    return;
                } else if (vc.component.addAdvertInfo.viewType == '9999' && vc.component.addAdvertInfo.vedioName == '') {
                    vc.toast('请上传视频');
                    return;
                }
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addAdvertInfo);
                    $('#addAdvertModel').modal('hide');
                    return;
                }
                vc.http.apiPost(
                    '/advert.saveAdvert',
                    JSON.stringify(vc.component.addAdvertInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            $('#addAdvertModel').modal('hide');
                            vc.component.clearAddAdvertInfo();
                            vc.emit('advertManage', 'listAdvert', {});
                            vc.toast("添加成功");
                            return;
                        }
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            clearAddAdvertInfo: function() {
                vc.emit('addAdvert', 'uploadImage', 'clearImage', {});
                vc.emit('addAdvert', 'uploadVedio', 'clearVedio', {});
                vc.component._initAddAdvertDateInfo();
                vc.component.addAdvertInfo = {
                    advertId: '',
                    adName: '',
                    adTypeCd: '20000',
                    classify: '',
                    locationTypeCd: '',
                    locationObjId: '-1',
                    seq: '',
                    startTime: '',
                    endTime: '',
                    advertType: '',
                    pageUrl: '',
                    floorId: '',
                    floorNum: '',
                    floorName: '',
                    unitId: '',
                    unitName: '',
                    roomId: '',
                    photos: [],
                    viewType: '8888',
                    vedioName: ''
                };
            }
        }
    });
})(window.vc);