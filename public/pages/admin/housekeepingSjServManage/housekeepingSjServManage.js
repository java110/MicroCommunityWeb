/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            housekeepingServManageInfo: {
                housekeepingServs: [],
                total: 0,
                records: 1,
                moreCondition: false,
                servId: '',
                componentShow: 'housekeepingServManage',
                housekeepingTypes: [],
                conditions: {
                    repairWay: '',
                    servName: '',
                    hktId: '',
                    state: '2002',
                    createTime: ''
                    //shopId:vc.getCurrentCommunity().shopId

                }
            }
        },
        _initMethod: function () {
            vc.component._listHousekeepingServs(DEFAULT_PAGE, DEFAULT_ROWS);
            vc.component._listHousekeepingTypes(1,50);
            vc.component._initservSjtmentTimeInfo();
        },
        _initEvent: function () {

            vc.on('housekeepingServManage', 'listHousekeepingServ', function (_param) {
                $that.housekeepingServManageInfo.componentShow ='housekeepingServManage';
                vc.component._listHousekeepingServs(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listHousekeepingServs(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listHousekeepingTypes: function (_page, _rows) {
                var param = {
                    params: {
                            page : _page,
                            row : _rows,
                            typeCd:1001,
                            shopId:vc.getCurrentCommunity().shopId
                        } };

                //发送get请求
                vc.http.apiGet('/housekeepingType/queryHousekeepingType',
                    param,
                    function (json, res) {
                        var _housekeepingTypeManageInfo = JSON.parse(json);
                        vc.component.housekeepingServManageInfo.housekeepingTypes = _housekeepingTypeManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listHousekeepingServs: function (_page, _rows) {

                vc.component.housekeepingServManageInfo.conditions.page = _page;
                vc.component.housekeepingServManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.housekeepingServManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/housekeepingServ/queryHousekeepingServ',
                    param,
                    function (json, res) {
                        var _housekeepingServManageInfo = JSON.parse(json);
                        vc.component.housekeepingServManageInfo.total = _housekeepingServManageInfo.total;
                        vc.component.housekeepingServManageInfo.records = _housekeepingServManageInfo.records;
                        vc.component.housekeepingServManageInfo.housekeepingServs = _housekeepingServManageInfo.data;
                        console.log(vc.component.housekeepingServManageInfo.housekeepingServs);
                        vc.emit('pagination', 'init', {
                            total: vc.component.housekeepingServManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _initservSjtmentTimeInfo: function () {

                $('.servSjtmentTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.servSjtmentTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".servSjtmentTime").val();
                        vc.component.housekeepingServManageInfo.conditions.createTime = value;
                    });
            },
            _listHousekeepingServsToDay: function(){
                vc.component.housekeepingServManageInfo.conditions.createTime = vc.dateTimeFormat(new Date().getTime());
                vc.component._listHousekeepingServs(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _listHousekeepingServsAll: function(){
                vc.component.housekeepingServManageInfo.conditions.createTime = '';
                vc.component._listHousekeepingServs(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openEditHousekeepingServModel: function (_housekeepingServ) {
                $that.housekeepingServManageInfo.componentShow = 'editHousekeepingServ';
                vc.emit('editHousekeepingServ', 'openEditHousekeepingServModal', _housekeepingServ);
            },
            _openDeleteHousekeepingServModel: function (_housekeepingServ) {
                vc.emit('deleteHousekeepingServ', 'openDeleteHousekeepingServModal', _housekeepingServ);
            },
            _queryHousekeepingServMethod: function () {
                vc.component._listHousekeepingServs(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _openAddHousekeepingFeeConfigRel: function(_servId,_servName){
                vc.emit('addHousekeepingFeeConfigRel', 'openAddHousekeepingFeeConfigRelModel',{_servId,_servName});
            },
            _moreCondition: function () {
                if (vc.component.housekeepingServManageInfo.moreCondition) {
                    vc.component.housekeepingServManageInfo.moreCondition = false;
                } else {
                    vc.component.housekeepingServManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
