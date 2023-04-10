# RM Plugin SDK <img alt="npm" src="https://img.shields.io/npm/v/rm-plugin">

##### Support for Merchant App, Terminal and Merchant Portal

## Release

When someone changes the version in package.json to 1.2.3 and pushes a commit with the message Release 1.2.3, the github action will create a new tag v1.2.3 and publish the package to the npm registry.

## Install

```
$ npm install rm-plugin
```

## Usage

```js
import rm from "rm-plugin";

// get signed request
rm.getSignedRequest({
  success: function ({ signedRequest, platform }) {
    console.log("signedRequest: ", signedRequest, " platform: ", platform);
  },
});

// get platform
const platform = rm.getPlatform();

// show toast message
rm.showToast({
  type: "success", // success, error (only for web portal)
  title: "hello",
});

// scan qrcode (only for terminal and merchant-app)
rm.scanCode({
  success: function (resp) {
    console.log("success: ", resp.code);
  },
  fail: function () {
    console.log("failed");
  },
  complete: function () {
    console.log("complete");
  },
});

// show loading
rm.showLoading();

// hide loading
rm.hideLoading();

// show alert (only for terminal and merchant-app)
rm.showAlert({
  type: "success", // success, error
  title: "hello world",
});

// print receipt (only for terminal)
rm.printReceipt({
  data: {}, // object
});

// show navbar title (only for terminal and merchant-app)
rm.setBarTitle({
  title: "hello world",
});

// set storage by key and value
rm.setStorage({
  key: "test",
  value: "token",
});

// get storage by key name
rm.getStorage({
  key: "test",
  success: function ({ data }) {
    console.log("content", data);
  },
});
```
