# RM Plugin SDK <img alt="npm" src="https://img.shields.io/npm/v/rm-plugin">

##### Support for Merchant App, Terminal and Merchant Portal

## Install

```
$ npm install rm-plugin
```

## Usage
```js
import rm from 'rm-plugin';

// Get signed request
var signedRequest = await rm.getSignedRequest();

// Show toast message
rm.showToast({
    title: 'hello'
})

// Scan qrcode (only for terminal and merchant-app)
rm.scanCode({
    success: function(resp) {
        console.log('success: ', resp.code)
    },
    fail: function() {
        console.log('failed')
    },
    complete: function() {
        console.log('complete')
    }
})

// show loading
rm.showLoading();

// hide loading
rm.hideLoading();

// show alert
rm.showAlert({
    type: 'success', // success, error
    title: 'hello world'
})

// print receipt (only for terminal)
rm.printReceipt({
    data: {} // object
})
```