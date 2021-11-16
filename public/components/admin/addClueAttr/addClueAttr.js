(function(vc){

    vc.extends({
        propTypes: {
               callBackListener:vc.propTypes.string, //父组件名称
               callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            addClueAttrInfo:{
                clueId:'',
                attrId:'',
                nowTime:'',
                nowSituation:'',
                nextSituation:'',

            }
        },
         _initMethod:function(){
            vc.initDateTime('addNowTime', function (_value) {
                $that.addClueAttrInfo.nowTime = _value;
            });
         },
         _initEvent:function(){
            vc.on('addClueAttr','openAddClueAttrModal',function(_parma){
                $that.addClueAttrInfo.clueId = _parma.clueId;
                console.log('99', $that.addClueAttrInfo.clueId);
                $('#addClueAttrModel').modal('show');
            });
        },
        methods:{
            addClueAttrValidate(){
                return vc.validate.validate({
                    addClueAttrInfo:vc.component.addClueAttrInfo
                },{
                    'addClueAttrInfo.nowSituation':[
{
                            limit:"required",
                            param:"",
                            errInfo:"目前进展情况不能为空"
                        },
 {
                            limit:"maxLength",
                            param:"500",
                            errInfo:"目前进展情况太长"
                        },
                    ],
                    'addClueAttrInfo.nowTime':[
                        {
                            limit:"required",
                            param:"",
                            errInfo:"跟进时间不能为空"
                        }
                        ],
'addClueAttrInfo.nextSituation':[
 {
                            limit:"maxLength",
                            param:"500",
                            errInfo:"下一步推进计划太长"
                        },
                    ],




                });
            },
            saveClueAttrInfo:function(){
                if(!vc.component.addClueAttrValidate()){
                    vc.toast(vc.validate.errInfo);

                    return ;
                }

                vc.component.addClueAttrInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if(vc.notNull($props.callBackListener)){
                    vc.emit($props.callBackListener,$props.callBackFunction,vc.component.addClueAttrInfo);
                    $('#addClueAttrModel').modal('hide');
                    return ;
                }

                vc.http.apiPost('/clueAttr/saveClueAttr',
                    JSON.stringify(vc.component.addClueAttrInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addClueAttrModel').modal('hide');
                            vc.component.clearAddClueAttrInfo();
                            vc.emit('clueAttrManage','listClueAttr',{});

                            return ;
                        }
                        vc.message(_json.msg);

                     },
                     function(errInfo,error){
                        console.log('请求失败处理');

                        vc.message(errInfo);

                     });
            },
            clearAddClueAttrInfo:function(){
                vc.component.addClueAttrInfo = {
                    clueId:'',
                    attrId:'',
                    nowSituation:'',
                    nextSituation:'',

                                        };
            }
        }
    });

})(window.vc);
