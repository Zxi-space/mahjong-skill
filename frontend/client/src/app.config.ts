export default defineAppConfig({
  pages: ['pages/index/index', 'pages/room/index'],
  // 较重的组件实验室不进入微信小程序主包；H5 端由 Taro 将分包页面并入路由。
  subPackages: [{ root: 'subpackages', pages: ['gallery/index'] }],
  window: {
    navigationBarTitleText: '雀变',
    navigationBarBackgroundColor: '#fff8ed',
    navigationBarTextStyle: 'black',
    backgroundColor: '#fff8ed',
  },
})
