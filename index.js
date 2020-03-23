var isMobileApp = false;

// sdk code
var rm = {
  platform: '',
  getSignedRequest: onPrepareSignedRequest,
  scanCode: onScanCode,
  showToast: showToast,
  showLoading: function() {
    onToggleLoader(true);
  },
  hideLoading: function() {
    onToggleLoader(false);
  },
  showAlert: showAlert,
  printReceipt: onPrintReceipt,
};

// util for sleep
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function onPrepareSignedRequest() {
  await sleep(100);
  var signedRequest = '';

  if ('revenuemonster' in window) {
    rm.platform = window.revenuemonster.platform;
    signedRequest = window.revenuemonster.getSignedRequest();
  } else {
    rm.platform = 'TERMINAL';
    signedRequest = window.signedRequest.getSignedRequest();
  }

  if (rm.platform === 'MOBILE_APP') {
    isMobileApp = true;
  }

  return signedRequest;
}

function onScanCode({ success, fail, complete }) {
  if (isMobileApp) {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        action: 'SCANNER',
        type: 'scanner',
      })
    );

    var elem = window.revenuemonster.os === 'android' ? document : window;
    elem.addEventListener(
      'message',
      function(event) {
        var msg = JSON.parse(event.data);
        success({ code: msg.result });
      },
      false
    );
  } else {
    var code = window.Native.openScanner();
    success({ code });
  }
}

function onToggleLoader(isLoading) {
  if (isMobileApp) {
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
  } else {
    window.Native.toggleLoader(isLoading);
  }
}

function showToast({ title }) {
  if (isMobileApp) {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        action: 'SHOW_TOAST',
        message: title,
      })
    );
  } else {
    window.Native.showToast(message);
  }
}

function showAlert({ title = '', type = 'success' }) {
  if (isMobileApp) {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        action: 'MODAL_MESSAGE',
        type,
        message: title,
      })
    );
  } else {
    window.Native.showMessageDialog(title);
  }
}

async function onPrintReceipt({ data }) {
  if (isMobileApp) return;
  const messageStr = JSON.stringify(data);
  console.log('messageStr', messageStr);
  await window.Native.printReceipt(messageStr);
}

export default { ...rm };
