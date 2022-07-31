(function(vc){
    vc.extends({
        propTypes: {
           emitChooseContractCollectionPlan:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseContractCollectionPlanInfo:{
                contractCollectionPlans:[],
                _currentContractCollectionPlanName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseContractCollectionPlan','openChooseContractCollectionPlanModel',function(_param){
                $('#chooseContractCollectionPlanModel').modal('show');
                vc.component._refreshChooseContractCollectionPlanInfo();
                vc.component._loadAllContractCollectionPlanInfo(1,10,'');
            });
        },
        methods:{
            _loadAllContractCollectionPlanInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('contractCollectionPlan.listContractCollectionPlans',
                             param,
                             function(json){
                                var _contractCollectionPlanInfo = JSON.parse(json);
                                vc.component.chooseContractCollectionPlanInfo.contractCollectionPlans = _contractCollectionPlanInfo.contractCollectionPlans;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseContractCollectionPlan:function(_contractCollectionPlan){
                if(_contractCollectionPlan.hasOwnProperty('name')){
                     _contractCollectionPlan.contractCollectionPlanName = _contractCollectionPlan.name;
                }
                vc.emit($props.emitChooseContractCollectionPlan,'chooseContractCollectionPlan',_contractCollectionPlan);
                vc.emit($props.emitLoadData,'listContractCollectionPlanData',{
                    contractCollectionPlanId:_contractCollectionPlan.contractCollectionPlanId
                });
                $('#chooseContractCollectionPlanModel').modal('hide');
            },
            queryContractCollectionPlans:function(){
                vc.component._loadAllContractCollectionPlanInfo(1,10,vc.component.chooseContractCollectionPlanInfo._currentContractCollectionPlanName);
            },
            _refreshChooseContractCollectionPlanInfo:function(){
                vc.component.chooseContractCollectionPlanInfo._currentContractCollectionPlanName = "";
            }
        }

    });
})(window.vc);
