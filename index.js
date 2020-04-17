var portalPostMessage;
var platform = '';

var PLATFORM_MOBILE_APP = 'MOBILE_APP';
var PLATFORM_TERMINAL = 'TERMINAL';
var PLATFORM_WEB_PORTAL = 'WEB_PORTAL';

// sdk code
var rm = {
  getSignedRequest: onPrepareSignedRequest,
  getPlatform: function () {
    return platform;
  },
  scanCode: onScanCode,
  showToast: onShowToast,
  showLoading: function () {
    onToggleLoader(true);
  },
  hideLoading: function () {
    onToggleLoader(false);
  },
  showAlert: onShowAlert,
  printReceipt: onPrintReceipt,
};

// util for sleep
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function onPrepareSignedRequest({ success, fail }) {

  var signedRequest = '';

  if ('revenuemonster' in window) {
    await sleep(100);
    platform = window.revenuemonster.platform;
    signedRequest = window.revenuemonster.getSignedRequest();
    success({ signedRequest, platform: platform })
  } else if ('signedRequest' in window) {
    await sleep(100);
    platform = PLATFORM_TERMINAL;
    signedRequest = window.signedRequest.getSignedRequest();
    success({ signedRequest, platform: platform })
  } else {
    platform = PLATFORM_WEB_PORTAL;
    window.addEventListener('message', function (event) {
      portalPostMessage = function (msg) {
        event.source.postMessage(JSON.stringify(msg), event.origin);
      };
      if (typeof event.data !== 'string') return;
      if (!event.data.startsWith("{") && !event.data.startsWith("setImmediate")) {
        success({ signedRequest: event.data, platform: platform });
        portalPostMessage({
          action: 'FINISH_HANDSHAKE',
        })
        window.onhashchange = function () {
          portalPostMessage({
            action: 'URL_CHANGE',
            message: window.location.href,
          })
        }
        return;
      }
    }, false);
  }

  return signedRequest;
}

function onScanCode({ success, fail, complete }) {
  switch (platform) {
    case PLATFORM_MOBILE_APP:
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          action: 'SCANNER',
          type: 'scanner',
        })
      );

      var elem = window.revenuemonster.os === 'android' ? document : window;
      elem.addEventListener(
        'message',
        function (event) {
          var msg = JSON.parse(event.data);
          if (msg.action === 'SCANNER') {
            success({ code: msg.result });
          }
        },
        false
      );
      break;

    case PLATFORM_TERMINAL:
      var code = window.Native.openScanner();
      success({ code });
      break;
  }
}

function onToggleLoader(isLoading) {
  switch (platform) {
    case PLATFORM_MOBILE_APP:
      var funcName = 'hide';
      if (isLoading) {
        funcName = 'show';
      }

      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          action: 'TOGGLE_LOADER',
          type: funcName,
        })
      );
      break;

    case PLATFORM_TERMINAL:
      window.Native.toggleLoader(isLoading);
      break;

    case PLATFORM_WEB_PORTAL:
      portalPostMessage({
        action: 'TOGGLE_LOADER',
        type: isLoading ? 'show' : 'hide',
      })
      break;
  }
}

function onShowToast({ title, type }) {
  switch (platform) {
    case PLATFORM_MOBILE_APP:
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          action: 'SHOW_TOAST',
          message: title,
        })
      );
      break;

    case PLATFORM_TERMINAL:
      window.Native.showToast(message);
      break;

    case PLATFORM_WEB_PORTAL:
      portalPostMessage({
        action: 'SHOW_NOTIFICATION',
        type,
        message: title,
      })
  }
}

function onShowAlert({ title = '', type = 'success' }) {
  switch (platform) {
    case PLATFORM_MOBILE_APP:
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          action: 'MODAL_MESSAGE',
          type,
          message: title,
        })
      );
      break;

    case PLATFORM_TERMINAL:
      window.Native.showMessageDialog(title);
      break;
  }
}

async function onPrintReceipt({ data }) {
  switch (platform) {
    case PLATFORM_TERMINAL:
      const messageStr = JSON.stringify(data);
      await window.Native.printReceipt(messageStr);
      break;
  }

}

export default {
  getSignedRequest: onPrepareSignedRequest,
  getPlatform: function getPlatform() {
    return platform;
  },
  scanCode: onScanCode,
  showToast: onShowToast,
  showLoading: function showLoading() {
    onToggleLoader(true);
  },
  hideLoading: function hideLoading() {
    onToggleLoader(false);
  },
  showAlert: onShowAlert,
  printReceipt: onPrintReceipt,
  PLATFORM_MOBILE_APP,
  PLATFORM_TERMINAL,
  PLATFORM_WEB_PORTAL
};