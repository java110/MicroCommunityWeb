/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            communitySpaceConfirmInfo: {
                orders: [],
                order: {
                    remark: '',
                    appointmentTime: '',
                    createTime: '',
                    hours: '',
                    spaceName: '',
                    personName: '',
                    personTel: '',
                },
                timeId: '',
                total: 0,
                records: 1,
                moreCondition: false,
                conditions: {
                    spaceId: '',
                    personName: '',
                    personTel: '',
                    appointmentTime: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function () {
            $that._initCommunitySpaceConfirmDate();
            $that._listCommunitySpaceConfirms(1, 10);
        },
        _initEvent: function () {
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listCommunitySpaceConfirms(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _initCommunitySpaceConfirmDate: function () {
                $(".appointmentTime").datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.appointmentTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".appointmentTime").val();
                        $that.communitySpaceConfirmInfo.conditions.appointmentTime = value;
                    });
                //防止多次点击时间插件失去焦点
                document.getElementsByClassName(' form-control appointmentTime')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            _listCommunitySpaceConfirms: function (_page, _rows) {
                vc.component.communitySpaceConfirmInfo.conditions.page = _page;
                vc.component.communitySpaceConfirmInfo.conditions.row = _rows;
                let param = {
                    params: vc.component.communitySpaceConfirmInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/communitySpace.listCommunitySpaceConfirmOrder',
                    param,
                    function (json, res) {
                        let _communitySpaceConfirmInfo = JSON.parse(json);
                        vc.component.communitySpaceConfirmInfo.total = _communitySpaceConfirmInfo.total;
                        vc.component.communitySpaceConfirmInfo.records = _communitySpaceConfirmInfo.records;
                        vc.component.communitySpaceConfirmInfo.orders = _communitySpaceConfirmInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.communitySpaceConfirmInfo.records,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _confirmCommunitySpace: function (_page, _rows) {
                let _timeId = $that.communitySpaceConfirmInfo.timeId;
                if (!_timeId) {
                    vc.toast('请扫码');
                    return;
                }
                let _data = {
                    timeId: _timeId,
                    communityId: vc.getCurrentCommunity().communityId
                }
                vc.http.apiPost(
                    '/communitySpace.saveCommunitySpaceConfirmOrder',
                    JSON.stringify(_data), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        $that.communitySpaceConfirmInfo.timeId = '';
                        let _json = JSON.parse(json);
                        if (_json.code != 0) {
                            vc.toast(_json.msg);
                            return;
                        }
                        $that._listCommunitySpaceConfirms(1, 10);
                        vc.toast("核销成功");
                        if (!_json.data || _json.data.length < 1) {
                            return;
                        }
                        vc.copyObject(_json.data[0], $that.communitySpaceConfirmInfo.order);
                        if (!$that.communitySpaceConfirmInfo.order.remark) {
                            $that.communitySpaceConfirmInfo.order.remark = "核销成功";
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        $that.communitySpaceConfirmInfo.timeId = '';
                        vc.toast(errInfo);
                    });
            },
            _moreCondition: function () {
                if (vc.component.communitySpaceConfirmInfo.moreCondition) {
                    vc.component.communitySpaceConfirmInfo.moreCondition = false;
                } else {
                    vc.component.communitySpaceConfirmInfo.moreCondition = true;
                }
            },
            //查询
            _queryCommunitySpaceConfirmMethod: function () {
                $that._listCommunitySpaceConfirms(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetCommunitySpaceConfirmMethod: function () {
                vc.component.communitySpaceConfirmInfo.conditions.personName = "";
                vc.component.communitySpaceConfirmInfo.conditions.personTel = "";
                vc.component.communitySpaceConfirmInfo.conditions.appointmentTime = "";
                $that._listCommunitySpaceConfirms(DEFAULT_PAGE, DEFAULT_ROWS);
            }
        }
    });
})(window.vc);