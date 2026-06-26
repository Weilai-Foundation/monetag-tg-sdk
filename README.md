# Monetag Telegram SDK

You can use this package to display ads in your Telegram Mini-App. Rewarded Interstitial, Rewarded Pop, In-App Interstitial formats are supported. To use it, all you need is a zone ID.

This package is designed to work in any environment, including plain HTML/JavaScript. No Node.js or build steps are required if you use the script tag integration.

## HTML / Vanilla JS Integration

The easiest way to integrate the SDK is by adding a script tag to your HTML.

### Option 1: Simple Script Tag

Add this to your HTML to automatically initialize the SDK:

```html
<script src='//libtl.com/sdk.js' data-zone='11196240' data-sdk='show_11196240'></script>
```

### Option 2: Using the Global Object

Include `index.global.js` in your HTML to use the `createAdHandler` function. You can load it from your local files or via a CDN.

```html
<!-- Load the SDK -->
<script src="index.global.js"></script>

<script>
    // Initialize the ad handler with your zone ID
    const adHandler = createAdHandler(11196240);

    // Show a Rewarded Interstitial ad
    adHandler().then(() => {
        console.log('Ad watched!');
    });
</script>
```

---

## Ad Formats (Vanilla JS)

### Rewarded Interstitial

To show a Rewarded Interstitial, call the `adHandler` function. It returns a Promise that resolves after the user watches the ad.

```javascript
const adHandler = createAdHandler(11196240);

adHandler().then(() => {
    // Reward the user here
    console.log('User watched the full ad');
});
```

### Rewarded Pop

To show a Rewarded Pop, call the `adHandler` with the `'pop'` parameter.

```javascript
const adHandler = createAdHandler(11196240);

adHandler('pop').then(() => {
    // Reward the user here
    console.log('User watched the pop ad');
});
```

### In-App Interstitial

To enable In-App Interstitial ads, call the `adHandler` with configuration settings. These ads will then be displayed automatically based on your settings.

```javascript
const adHandler = createAdHandler(11196240);

adHandler({
    type: 'inApp',
    inAppSettings: {
      frequency: 3, // Max 3 times
      capping: 0.5,  // Per 0.5 hours
      interval: 30, // 30 seconds between displays
      timeout: 10,  // 10 seconds delay before first display
    },
});
```

---

## Advanced Integration (React)

If you are using React or another framework, you can install the package via npm:

```bash
npm install monetag-tg-sdk
```

### Rewarded Interstitial Example

```jsx
import React from 'react'
import createAdHandler from 'monetag-tg-sdk'

const adHandler = createAdHandler(11196240)

function RewardComponent () {
    const [balance, setBalance] = React.useState(0)

    const showAd = () => {
        adHandler().then(() => {
            setBalance(balance + 1)
        })
    }

    return (
        <div>
            <p>Balance: {balance}</p>
            <button onClick={showAd}>Get reward for watching ad</button>
        </div>
    )
}
```

### Rewarded Pop Example

```jsx
import React from 'react'
import createAdHandler from 'monetag-tg-sdk'

const adHandler = createAdHandler(11196240)

function RewardComponent () {
    const [balance, setBalance] = React.useState(0)

    const showAd = () => {
        adHandler('pop').then(() => {
            setBalance(balance + 1)
        })
    }

    return (
        <div>
            <p>Balance: {balance}</p>
            <button onClick={showAd}>Get reward for watching ad</button>
        </div>
    )
}
```
