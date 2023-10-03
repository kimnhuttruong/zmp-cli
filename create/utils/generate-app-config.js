module.exports = function generateAppConfig(options) {
  const { name } = options;

  // Window config
  const appConfig = {
    title: name,
    headerTitle: name,
    headerColor: '#1843EF',
    textColor: 'white',
    statusBarColor: '#1843EF',
    leftButton: 'back',
    statusBar: 'normal',
    actionBarHidden: false,
    hideAndroidBottomNavigationBar: false,
    hideIOSSafeAreaBottom: false,
  };
  // Content
  const content = JSON.stringify(
    {
      app: appConfig,
      debug: false,
      listCSS: [],
      listSyncJS: [],
      listAsyncJS: [],
    },
    '',
    2
  ).trim();

  return {
    content,
    appConfig,
  };
};
