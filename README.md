# Photo Gallery

A small Ionic + Vue app: take a photo with the device camera, see it in a
grid, tap a photo to view it full-size or delete it. Photos are saved on
the device, so they're still there the next time the app opens.

## How the app is organized

```
src/
  composables/usePhotoGallery.ts   <- all the app's logic
  components/PhotoGrid.vue         <- shows the grid of photo thumbnails
  components/PhotoViewerModal.vue  <- full-size photo + delete confirmation
  views/HomePage.vue               <- wires the pieces together
```

Everything the app *does* lives in `usePhotoGallery.ts`. The views and
components only display state and forward taps — they don't contain any
decision-making of their own. That split is what keeps the logic easy to
follow: read one file to understand the whole app's behavior.

## The logic, in plain terms

The composable keeps one array, `photos`, as the single source of truth.
There are exactly three operations, and every one of them ends the same
way — update `photos`, then save the whole list to the device:

1. **`load()`** — runs once when the app starts. Reads the saved list back
   from the device and puts it in `photos`.
2. **`takePhoto()`** — opens the camera, gets the picture back as a data
   URL (a self-contained base64 string — no separate image file to track),
   adds it to the front of `photos`, and saves the list.
3. **`deletePhoto(photo)`** — removes that one photo from `photos` and
   saves the list.

Storage uses a single Capacitor `Preferences` key (`"photos"`) holding the
whole list as JSON. There's no separate file system to manage and no
branching between web and native platforms — `Preferences` and the
camera's data-URL result both behave the same way everywhere, so the same
three functions work in the browser and on a real device.

### UI flow

- Empty gallery → a friendly placeholder telling you to tap the camera
  button.
- Tap the camera FAB (bottom-right) → takes a photo → it appears first in
  the grid.
- Tap any thumbnail → a modal opens showing the full photo with a
  **Delete Photo** button.
- Delete asks for confirmation before removing anything, so you can't lose
  a photo by mistake.

## What changed from the original tutorial app

The original app only held photos in memory: refreshing the page lost
every picture, and there was no way to remove one. This version adds:

- **Persistence** — photos survive a refresh or app restart.
- **Delete** — with a confirmation step.
- **A single logic module** instead of logic split across components and
  connected by events, so the whole app's behavior can be read in one
  file.

## Scripts

```bash
npm install
npm run dev        # start the dev server
npm run build       # type-check and build for production
npm run test:unit   # run the unit tests for usePhotoGallery
npm run lint
```

## Running on Android

This is a Capacitor app, so the same `src/` code also runs as a real
native Android app — not just in a browser. The native `android/` project
is committed to this repo (that's the normal Capacitor setup: the native
project is checked in, only its build output — `.gradle/`, `build/`,
`local.properties` — is git-ignored). After changing anything in `src/`
or the installed plugins, resync it:

```bash
npm run build
npx cap sync android   # copies the new web build + plugins into android/
npx cap open android    # opens the project in Android Studio
```

### CI: automatic APK build

`.github/workflows/build-apk.yml` does the same steps on every push to
`main`: install deps, build the web app, sync Capacitor into `android/`,
then build a debug APK with Gradle and upload it as a workflow artifact
(`IonicCalculator-APK`), downloadable from the Actions run's summary
page.
