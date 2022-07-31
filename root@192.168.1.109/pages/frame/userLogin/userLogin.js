(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            userLoginInfo: {
                moreCondition: false,
                branchOrgs: [],
                departmentOrgs: [],
                conditions: {
                    branchOrgId: '',
                    departmentOrgId: '',
                    orgId: '',
                    orgName: '',
                    orgLevel: '',
                    parentOrgId: '',
                    name: '',
                    tel: '',
                    userLoginId: ''
                }
            },
            userLoginData: [],

        },
        watch: {
            "userLoginInfo.conditions.branchOrgId": {//深度监听，可监听到对象、数组的变化
                handler(val, oldVal) {
                    vc.component._getOrgsByOrgLeveluserLogin(DEFAULT_PAGE, DEFAULT_ROWS, 3, val);

                    vc.component.userLoginInfo.conditions.branchOrgId = val;
                    vc.component.userLoginInfo.conditions.parentOrgId = val;


                    vc.component.userLoginInfo.conditions.departmentOrgId = '';

                    vc.component.loadData(DEFAULT_PAGE, DEFAULT_ROWS);

                },
                deep: true
            },
            "userLoginInfo.conditions.departmentOrgId": {//深度监听，可监听到对象、数组的变化
                handler(val, oldVal) {
                    vc.component.userLoginInfo.conditions.orgId = val;
                    vc.component.loadData(DEFAULT_PAGE, DEFAULT_ROWS);
                },
                deep: true
            }
        },
        _initMethod: function () {
            vc.component.loadData(1, 10);
            vc.component._getOrgsByOrgLeveluserLogin(DEFAULT_PAGE, DEFAULT_ROWS, 2, '');

        },
        _initEvent: function () {
            vc.component.$on('pagination_page_event', function (_currentPage) {
                vc.component.currentPage(_currentPage);
            });
            vc.component.$on('adduserLogin_reload_event', function () {
                vc.component.loadData(1, 10);
            });
            vc.component.$on('edituserLogin_reload_event', function () {
                vc.component.loadData(1, 10);
            });
            vc.component.$on('deleteuserLogin_reload_event', function () {
                vc.component.loadData(1, 10);
            });


        },
        methods: {
            loadData: function (_page, _rows) {
                vc.component.userLoginInfo.conditions.page = _page;
                vc.component.userLoginInfo.conditions.rows = _rows;
                vc.component.userLoginInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.userLoginInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/userLogin/queryUserLogin',
                    param,
                    function (json) {
                        var _userLoginInfo = JSON.parse(json);
                        vc.component.userLoginData = _userLoginInfo.data;
                        vc.component.$emit('pagination_info_event', {
                            total: _userLoginInfo.records,
                            currentPage: _userLoginInfo.page
                        });

                    }, function () {
                        console.log('请求失败处理');
                    }
                );

            },
            currentPage: function (_currentPage) {
                vc.component.loadData(_currentPage, 10);
            },

            _moreCondition: function () {
                if (vc.component.userLoginInfo.moreCondition) {
                    vc.component.userLoginInfo.moreCondition = false;
                } else {
                    vc.component.userLoginInfo.moreCondition = true;
                }
            },
            _getOrgsByOrgLeveluserLogin: function (_page, _rows, _orgLevel, _parentOrgId) {

                var param = {
                    params: {
                        page: _page,
                        row: _rows,
                        orgLevel: _orgLevel,
                        parentOrgId: _parentOrgId
                    }
                };

                //发送get请求
                vc.http.get('userLogin',
                    'list',
                    param,
                    function (json, res) {
                        var _orgInfo = JSON.parse(json);
                        if (_orgLevel == 2) {
                            vc.component.userLoginInfo.branchOrgs = _orgInfo.orgs;
                        } else {
                            vc.component.userLoginInfo.departmentOrgs = _orgInfo.orgs;
                        }
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },

            _queryuserLoginMethod: function () {
                vc.component.loadData(DEFAULT_PAGE, DEFAULT_ROWS)
            }


        },



    });

})(window.vc);