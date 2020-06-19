(function (vc) {

    vc.extends({
        data: {
            selectStaffInfo: {
                flowId: '',
                flowName: '',
                describle: '',
                companys: [],
                departments: [],
                staffs: []
            }
        },
        _initMethod: function () {
            $that._initSelectStaffInfo();
        },
        _initEvent: function () {
            vc.on('selectStaff','openStaff',function(){
                $('#selectStaffModel').modal('show');
            })

        },
        methods: {
            _initSelectStaffInfo: function () {
                $('.dropdown li a').click(function () {
                    console.log(this);
                    title = $(this).attr("data-title");
                    id = $(this).attr("data-index");
                    $("#select-title").text(title);
                    $("#category_id").val(id);
                });
            },

            _changeCompany: function (_e) {
                console.log(_e);
            },
            _initOrg:function(_orgLevel,_parentOrgId){
                var param = {
                    params: {
                        page:1,
                        row:100,
                        orgLevel: _orgLevel,
                        parentOrgId: _parentOrgId
                    }
                };

                //发送get请求
                vc.http.get('orgManage',
                    'list',
                    param,
                    function (json, res) {
                        var _orgManageInfo = JSON.parse(json);
                        if(_orgLevel == 1){
                            $that.selectStaffInfo.companys = _orgManageInfo.orgs;
                        }else if(_orgLevel == 2){
                            $that.selectStaffInfo.departments = _orgManageInfo.orgs;
                        }else{
                            $that.selectStaffInfo.staffs = _orgManageInfo.orgs;
                        }
                        
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            }

        }
    });

})(window.vc);