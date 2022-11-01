(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addClassesInfo: {
                classesId: '',
                name: '',
                remark: '',
                times:[],

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addClasses', 'openAddClassesModal', function () {
                $that.addClassesInfo.times.push(
                    {
                        id:vc.uuid(),
                        startTime:'',
                        endTime:''
                    }
                )
                $('#addClassesModel').modal('show');
            });
        },
        methods: {
            addClassesValidate() {
                return vc.validate.validate({
                    addClassesInfo: vc.component.addClassesInfo
                }, {
                    'addClassesInfo.name': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "班次名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "100",
                            errInfo: "班次名称不能超过100"
                        },
                    ],
                    'addClassesInfo.remark': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "备注说明不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "备注说明不能超过200"
                        },
                    ],
                });
            },
            saveClassesInfo: function () {
                if (!vc.component.addClassesValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/classes.saveClasses',
                    JSON.stringify(vc.component.addClassesInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addClassesModel').modal('hide');
                            vc.component.clearAddClassesInfo();
                            vc.emit('classesManage', 'listClasses', {});

                            return;
                        }
                        vc.toast(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);

                    });
            },
            clearAddClassesInfo: function () {
                vc.component.addClassesInfo = {
                    name: '',
                    remark: '',
                    times:[],

                };
            },
            _addTimes:function(){
                $that.addClassesInfo.times.push(
                    {
                        id:vc.uuid(),
                        startTime:'',
                        endTime:''
                    }
                )
            },
            _deleteTimes:function(_time){
                let _times = $that.addClassesInfo.times;

                for(let _timeIndex = 0; _timeIndex< _times.length; _timeIndex++){
                    if(_time.id == _times[_timeIndex].id){
                        _times.splice(_timeIndex,1);
                    }
                }

            }
        }
    });

})(window.vc);
