module.exports = {
  filename: {
    appConfig: 'app-config.json',
    zmpConfig: 'zmp-cli.json',
    packageJson: 'package.json',
  },
  api_domain: 'https://zmp-api.developers.zalo.me/',
  zdn_url: '//h5.zdn.vn/zapps/',
  path: {
    login: 'admin/login',
    requestLogin: 'admin/request-login',
    checkLoginStatus: 'admin/get-login-status',
    // uploadApp: 'admin/upload-app',
    uploadAppByChunk: 'app/upload-chunk',
    requestUploadResumable: 'app/request-upload',
    getAppInfo: 'app/get-info',
  },
  dirname: __dirname,
  root_env: () => `${process.cwd()}/.env`,
  env: {
    appId: 'APP_ID',
    token: 'ZMP_TOKEN',
  },
  error_code: {
    app_config_not_found: -1400,
    permission_denied: -2001,
    request_timeout: -2003,
  },
  error_msg: {
    app_config_not_found:
      "App config not found. Please re-init project. (Tips: Run 'zmp init')",
    permission_denied:
      "Permission denied. Please login again. (Tips: Run 'zmp login')",
    request_timeout: 'Request Timeout',
  },
  resumable_option: {
    chunkSize: 512 * 1000, // bytes -> 512kb/chunk
    simultaneousUploads: 4,
    testChunks: true,
    throttleProgressCallbacks: 1,
    method: 'octet',
    forceChunkSize: false,
  },
};
