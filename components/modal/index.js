var config = {
    type: '',           //设置弹窗显示类型 ->默认：0 （0表示信息框，1表示页面层）
    title: '',          //标题
    content: '',        //内容
    style: '',          //自定弹窗样式
    skin: '',           //自定弹窗显示风格 ->目前支持配置 toast(仿微信toast风格) footer(底部对话框风格)、msg(普通提示)
    icon: '',           //弹窗小图标(success | loading)

    shade: true,        //是否显示遮罩层
    shadeClose: true,   //是否点击遮罩时关闭层
    anim: 'scaleIn',    //scaleIn：缩放打开(默认)  fadeIn：渐变打开  fadeInUpBig：由上向下打开 fadeInDownBig：由下向上打开  rollIn：左侧翻转打开  shake：震动  footer：底部向上弹出
    time: 0,            //设置弹窗自动关闭秒数

    btns: null          //不设置则不显示按钮。如果只需要一个按钮，则btn: '按钮'，如果有两个，则：btn: ['按钮一', '按钮二']
};
