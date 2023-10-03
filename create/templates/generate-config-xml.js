const indent = require('../utils/indent');

module.exports = () => {
  return indent(
    4,
    `
    <allow-navigation href="*" />
    <preference name="DisallowOverscroll" value="true" />
    <preference name="BackupWebStorage" value="local" />
    <preference name="AutoHideSplashScreen" value="false" />
    <preference name="ShowSplashScreenSpinner" value="false" />
    <preference name="SplashScreenDelay" value="0" />
    <preference name="Suppresses3DTouchGesture" value="true" />
    <preference name="Allow3DTouchLinkPreview" value="false" />
    <preference name="AllowInlineMediaPlayback" value="true" />
  `
  );
};
