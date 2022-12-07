/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            carInoutManageInfo: {
                carInouts: [],
                total: 0,
                records: 1,
                moreCondition: false,
                carNum: '',
                conditions: {
                    state: '',
                    carNum: '',
                    inoutId: '',
                    startTime: '',
                    endTime: ''
                }
            }
        },
        _initMethod: function () {
            vc.component._initCarInoutDate();
            vc.component._listCarInouts(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('carInoutManage', 'listCarInout', function (_param) {
                vc.component._listCarInouts(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listCarInouts(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _initCarInoutDate: function () {
                $('.carInoutStartTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.carInoutStartTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".carInoutStartTime").val();
                        vc.component.carInoutManageInfo.conditions.startTime = value;
                    });
                $('.carInoutEndTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.carInoutEndTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".carInoutEndTime").val();
                        vc.component.carInoutManageInfo.conditions.endTime = value;
                    });
                //防止多次点击时间插件失去焦点
                document.getElementsByClassName('form-control carInoutStartTime')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName("form-control carInoutEndTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            _listCarInouts: function (_page, _rows) {
                vc.component.carInoutManageInfo.conditions.page = _page;
                vc.component.carInoutManageInfo.conditions.row = _rows;
                vc.component.carInoutManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.carInoutManageInfo.conditions
                };
                param.params.carNum = param.params.carNum.trim();
                param.params.inoutId = param.params.inoutId.trim();
                //发送get请求
                vc.http.apiGet('/carInout.listCarInouts',
                    param,
                    function (json, res) {
                        var _carInoutManageInfo = JSON.parse(json);
                        vc.component.carInoutManageInfo.total = _carInoutManageInfo.total;
                        vc.component.carInoutManageInfo.records = _carInoutManageInfo.records;
                        vc.component.carInoutManageInfo.carInouts = _carInoutManageInfo.carInouts;
                        vc.emit('pagination', 'init', {
                            total: vc.component.carInoutManageInfo.records,
                            dataCount: vc.component.carInoutManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddCarInoutModal: function () {
                vc.emit('addCarInout', 'openAddCarInoutModal', {});
            },
            _openEditCarInoutModel: function (_carInout) {
                vc.emit('editCarInout', 'openEditCarInoutModal', _carInout);
            },
            _openDeleteCarInoutModel: function (_carInout) {
                vc.emit('deleteCarInout', 'openDeleteCarInoutModal', _carInout);
            },
            //查询
            _queryCarInoutMethod: function () {
                vc.component._listCarInouts(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetCarInoutMethod: function () {
                vc.component.carInoutManageInfo.conditions.state = "";
                vc.component.carInoutManageInfo.conditions.carNum = "";
                vc.component.carInoutManageInfo.conditions.inoutId = "";
                vc.component.carInoutManageInfo.conditions.startTime = "";
                vc.component.carInoutManageInfo.conditions.endTime = "";
                vc.component._listCarInouts(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.carInoutManageInfo.moreCondition) {
                    vc.component.carInoutManageInfo.moreCondition = false;
                } else {
                    vc.component.carInoutManageInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);