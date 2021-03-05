/**
 入驻小区
 **/
(function (vc) {
    vc.extends({
        data: {
            addRoomComplaintInfo: {
                flowComponent: 'addComplainView',
                typeCd: '',
                complaintName: '',
                tel: '',
                context: '',
                roomId:''
            }
        },
        _initMethod: function () {
            $that.addRoomComplaintInfo.roomId = vc.getParam('roomId')
        },
        _initEvent: function () {

        },
        methods: {

            addComplainValidate: function () {
                return vc.validate.validate({
                    addRoomComplaintInfo: vc.component.addRoomComplaintInfo
                }, {
                    'addRoomComplaintInfo.typeCd': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "投诉类型不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "投诉类型格式错误"
                        },
                    ],
                    'addRoomComplaintInfo.complaintName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "投诉人不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "投诉人不能大于200位"
                        },
                    ],
                    'addRoomComplaintInfo.tel': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "投诉电话不能为空"
                        },
                        {
                            limit: "phone",
                            param: "",
                            errInfo: "投诉电话格式错误"
                        },
                    ],
                    'addRoomComplaintInfo.context': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "投诉内容不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "4000",
                            errInfo: "投诉状态超过4000位"
                        },
                    ],

                });
            },
            saveAddComplainInfo: function () {
                vc.component.addRoomComplaintInfo.communityId = vc.getCurrentCommunity().communityId;
                if (!vc.component.addComplainValidate()) {
                    //侦听回传
                    vc.toast("请选择或填写必选信息");
                    return;
                }
                vc.http.post(
                    'addComplaintStepBinding',
                    'binding',
                    JSON.stringify(vc.component.addRoomComplaintInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        if (res.status == 200) {

                            vc.toast('处理成功');
                            //关闭model
                            //vc.jumpToPage("/admin.html#/pages/common/complaintManage?" + vc.objToGetParam(JSON.parse(json)));
                            vc.goBack();
                            return;
                        }
                        vc.toast(json);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);
                    });
            },
            _goBack:function(){
                vc.goBack();
            }
        }
    });
})(window.vc);
