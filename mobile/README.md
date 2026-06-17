# Beitna Manager Mobile Wrapper

This is a lightweight Expo wrapper around the deployed Beitna Manager web app.

It lets you test Beitna Manager in Expo Go using a native WebView while the main app remains a Next.js app hosted on Vercel.

## Run in Expo Go

```bash
cd mobile
npm install
npx expo start
```

Then scan the QR code with Expo Go.

## Important

Expo Go is useful for testing. For a real installable production app, use an Expo development build / EAS build and submit that build to the stores.

## App URL

The wrapper currently opens:

```text
https://homemangment.vercel.app
```

Update `BEITNA_URL` in `App.tsx` if the production URL changes.
