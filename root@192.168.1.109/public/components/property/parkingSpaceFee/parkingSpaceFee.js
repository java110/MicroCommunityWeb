/**
    入驻小区
**/
(function(vc){
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROW = 10;
    vc.extends({
        data:{
            feeDetailInfo:{
                feeDetails:[],
                total:0,
                records:1,
                feeId:'',
                amount:"-1.00",
                startTime:'',
                endTime:''
            }
        },
        _initMethod:function(){
            vc.component.initDate();
        },
        _initEvent:function(){
            vc.on('propertyFee','listFeeDetail',function(_param){
                  vc.component.feeDetailInfo.feeId = _param.feeId;
                  vc.component.feeDetailInfo.amount = _param.amount;
                  vc.component.listFeeDetail(DEFAULT_PAGE,DEFAULT_ROW);
            });

            vc.on('pagination','page_event',function(_currentPage){
                vc.component.listRoom(_currentPage,DEFAULT_ROW);
            });
        },
        methods:{
            initDate:function(){
                $('.start_time').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd',
                    autoClose: 1,
                    minView: "month",
                    todayBtn: true
                });
                $('.start_time').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".start_time").val();
                        vc.component.feeDetailInfo.startTime = value;
                    });
                $('.end_time').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd',
                    autoClose: 1,
                    minView: "month",
                    todayBtn: true
                });
                $('.end_time').datetimepicker()
                  .on('changeDate', function (ev) {
                    var value = $(".end_time").val();
                    vc.component.feeDetailInfo.endTime = value ;
                  });
            },
            listFeeDetail:function(_page,_row){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        feeId:vc.component.feeDetailInfo.feeId,
                        startTime:vc.component.feeDetailInfo.startTime,
                        endTime:vc.component.feeDetailInfo.endTime
                    }
                }
               //发送get请求
               vc.http.get('propertyFee',
                            'listFeeDetail',
                             param,
                             function(json,res){
                                var listFeeDetailData =JSON.parse(json);

                                vc.component.feeDetailInfo.total = listFeeDetailData.total;
                                vc.component.feeDetailInfo.records = listFeeDetailData.records;
                                vc.component.feeDetailInfo.feeDetails = listFeeDetailData.feeDetails;

                                vc.emit('pagination','init',{
                                    total:vc.component.feeDetailInfo.records,
                                    currentPage:_page
                                });
                             },function(errInfo,error){
                                console.log('请求失败处理');
                             }
                           );
            },
            queryFeeDetailMethod:function(){
                vc.component.listFeeDetail(DEFAULT_PAGE,DEFAULT_ROW);
            }
        }
    });
})(window.vc);