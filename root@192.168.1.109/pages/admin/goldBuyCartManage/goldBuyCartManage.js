/**
    入驻小区
**/
(function(vc){
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data:{
            goldBuyCartManageInfo:{
                systemGoldSettings:[],
                total:0,
                records:1,
                moreCondition:false,
                settingId:'',
                conditions:{
                    title:'',

                }
            }
        },
        _initMethod:function(){
            vc.component._listSystemGoldSettings(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent:function(){
            
            vc.on('systemGoldSettingManage','listSystemGoldSetting',function(_param){
                  vc.component._listSystemGoldSettings(DEFAULT_PAGE, DEFAULT_ROWS);
            });
             vc.on('pagination','page_event',function(_currentPage){
                vc.component._listSystemGoldSettings(_currentPage,DEFAULT_ROWS);
            });
        },
        methods:{
            _listSystemGoldSettings:function(_page, _rows){

                vc.component.goldBuyCartManageInfo.conditions.page = _page;
                vc.component.goldBuyCartManageInfo.conditions.row = _rows;
                var param = {
                    params:vc.component.goldBuyCartManageInfo.conditions
               };

               //发送get请求
               vc.http.apiGet('/goldBusiness/queryGoldBusiness',
                             param,
                             function(json,res){
                                var _goldBuyCartManageInfo=JSON.parse(json);
                                vc.component.goldBuyCartManageInfo.total = _goldBuyCartManageInfo.total;
                                vc.component.goldBuyCartManageInfo.records = _goldBuyCartManageInfo.records;
                                vc.component.goldBuyCartManageInfo.systemGoldSettings = _goldBuyCartManageInfo.data;
                                vc.emit('pagination','init',{
                                     total:vc.component.goldBuyCartManageInfo.records,
                                     currentPage:_page
                                 });
                             },function(errInfo,error){
                                console.log('请求失败处理');
                             }
                           );
            },
            _querySystemGoldSettingMethod:function(){
                vc.component._listSystemGoldSettings(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition:function(){
                if(vc.component.goldBuyCartManageInfo.moreCondition){
                    vc.component.goldBuyCartManageInfo.moreCondition = false;
                }else{
                    vc.component.goldBuyCartManageInfo.moreCondition = true;
                }
            }

             
        }
    });
})(window.vc);
