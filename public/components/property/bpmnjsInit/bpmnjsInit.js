(function (vc) {

    vc.extends({
        data: {
            bpmnjsInfo: {
                condition: '',
                staffId: ''
            }
        },
        _initMethod: function () {
            $that._initBpmnjs();
        },
        watch: {
            'bpmnjsInfo.staffId': {
                deep: true,
                handler: function () {
                    let camundaAssignee = document.querySelector('#camunda-assignee');
                    camundaAssignee.value = $that.bpmnjsInfo.staffId;
                    //创建输入框修改事件
                    let changeEvent = document.createEvent("HTMLEvents");
                    changeEvent.initEvent("change", true, true);
                    //触发修改事件，触发绑定的事件，更新数据
                    camundaAssignee.dispatchEvent(changeEvent);
                }
            }
        },
        _initEvent: function () {
            //初始化侦听
            vc.on('bpmnjs', 'index', function (_data) {
                let camCondition = document.querySelector('#cam-condition');
                camCondition.value = _data.condition;
                //创建输入框修改事件
                let changeEvent = document.createEvent("HTMLEvents");
                changeEvent.initEvent("change", true, true);
                //触发修改事件，触发绑定的事件，更新数据
                camCondition.dispatchEvent(changeEvent);
            })
        },
        methods: {
            _initBpmnjs: function () {
                window._elementEvent = function (e) {
                    console.log('元素被点击', e);
                    // 线表达式 onclick 处理
                    let camCondition = document.querySelector('#cam-condition')
                    if (camCondition) {
                        camCondition.onclick = function () {
                            vc.emit('chooseFlowElementCondition', 'openModal', {
                                condition: camCondition.value
                            });
                        };
                    }

                    let camundaAssignee = document.querySelector('#camunda-assignee');
                    if (camundaAssignee) {
                        camundaAssignee.onclick = function () {
                            vc.emit('selectStaff', 'openStaff', $that.bpmnjsInfo);
                        };
                    }
                }
            }

        }
    });

})(window.vc);
