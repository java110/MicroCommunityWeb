(function (vc) {
    vc.extends({
        data: {
            addWorkInfo: {
                workName:'',
                workTypes:[],
                wtId:'',
                workCycle:'1001',
                startTime:'',
                endTime:'',
                staffs:[],
                copyStaffs:[],
                pathUrl:'',
                content:'',
                period:'',
                months: [],
                days: [],
                workdays: [],
                hours:'24',
                communityId:''
            }
        },
        _initMethod: function () {
            $that._listWorkTypes();

            $that.addWorkInfo.startTime = vc.dateTimeFormat(new Date().getTime());
            $that.addWorkInfo.endTime = vc.dateTimeFormat(vc.addOneDay(new Date().getTime()).getTime());

            $that.addWorkInfo.communityId = vc.getCurrentCommunity().communityId;


            vc.initDateTime('addWorkStartTime',function(_value){
                $that.addWorkInfo.startTime = _value;
            });
            vc.initDateTime('addWorkEndTime',function(_value){
                $that.addWorkInfo.endTime = _value;
            });

            vc.emit('textarea','init',$that.addWorkInfo);
        },
        _initEvent: function () {
            vc.on('addWorkInfo', 'notifyFile', function (_param) {
                $that.addWorkInfo.pathUrl = _param.realFileName;
            })
        },
        methods: {
            _initInspectionPlanAddInfo: function () {
                
            },
            addWorkValidate() {
                return vc.validate.validate({
                    addWorkInfo: $that.addWorkInfo
                }, {
                    'addWorkInfo.workName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "标题不能为空"
                        }
                    ],
                    'addWorkInfo.wtId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "类型不能为空"
                        }
                    ],
                    'addWorkInfo.workCycle': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "标识不能为空"
                        }
                    ],
                    'addWorkInfo.startTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "开始时间不能为空"
                        }
                    ],
                    'addWorkInfo.endTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "结束时间不能为空"
                        }
                    ],
                    
                    
                });
            },
            saveWorkPool: function () {
                if (!$that.addWorkValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/work.saveWorkPool',
                    JSON.stringify($that.addWorkInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.toast('添加成功');
                            vc.goBack();
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            _listWorkTypes: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/workType.listWorkType',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        $that.addWorkInfo.workTypes = _json.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _chooseWorkStaff:function(){

                vc.emit('selectStaff', 'openStaff', {
                    call:function(_staff){
                        $that.addWorkInfo.staffs.push(_staff);
                    }
                });
            },
            _deleteWorkStaff:function(_staff){
                let _staffs = [];
                $that.addWorkInfo.staffs.forEach(item => {
                    if(_staff.staffId != item.staffId){
                        _staff.push(item);
                    }
                });
                $that.addWorkInfo.staffs = _staffs;
            },
            _chooseCopyWorkStaff:function(){

                vc.emit('selectStaff', 'openStaff', {
                    call:function(_staff){
                        $that.addWorkInfo.copyStaffs.push(_staff);
                    }
                });
            },
            _deleteCopyWorkStaff:function(_staff){
                let _staffs = [];
                $that.addWorkInfo.copyStaffs.forEach(item => {
                    if(_staff.staffId != item.staffId){
                        _staff.push(item);
                    }
                });
                $that.addWorkInfo.copyStaffs = _staffs;
            }
        }
    });
})(window.vc);