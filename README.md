# English FlashCard

A native WeChat Mini Program for contextual English vocabulary learning and spaced repetition.

## Implemented in V1

- **Card front:** English word/phrase and its full English example sentence only.
- **Card back:** Chinese meaning, synonyms/related words and usage notes.
- **Spaced repetition:** 1, 2, 4, 7, 15, 30 and 60-day intervals after successful recall.
- **Recall grading:** remembered cards move to the next interval; forgotten cards return the next day.
- **Daily dashboard:** due-card count, vocabulary count and review progress.
- **Vocabulary library:** browse and search words, example sentences and meanings.
- **Local persistence:** cards and review history are stored on the device using WeChat local storage.
- **Starter vocabulary:** 24 words and phrases from the learner's current deck.

## Run locally

1. Install [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html).
2. Import this repository folder as a Mini Program project.
3. The project currently uses the WeChat tourist/test AppID for local development. Replace it with your own AppID when publishing.
4. Compile and preview in WeChat Developer Tools.

## Project structure

- `miniprogram/app.js`, `app.json`, `app.wxss`: application shell
- `miniprogram/pages/index`: daily review dashboard
- `miniprogram/pages/review`: flip-card practice and recall grading
- `miniprogram/pages/library`: searchable vocabulary library
- `miniprogram/utils/scheduler.js`: spaced-repetition scheduling
- `miniprogram/utils/seed.js`: starter vocabulary data

## Current limitations / next steps

V1 stores data locally on one device. Card creation/editing, JSON import/export, cloud sync, account login and authorized subscription-message reminders are planned for later iterations. WeChat subscription messages require explicit user authorization and are not unrestricted daily push notifications.
