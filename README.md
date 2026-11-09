# English FlashCard

A WeChat Mini Program for contextual English vocabulary learning with spaced repetition.

## MVP

- Flashcard front: English headword/phrase and an English example sentence only.
- Flashcard back: Chinese meaning, synonyms, usage notes and etymology.
- Spaced repetition schedule: day 1, 2, 4, 7, 15, 30 and 60, adjusted by recall result.
- Review queue, due counts, progress and local persistence.
- Add, edit and delete cards; import/export JSON.

## Run

Open this repository in WeChat Developer Tools as a Mini Program project. No backend is required for the first version; data is stored locally on the device.

## Project structure

- `app.js`, `app.json`, `app.wxss`: application shell
- `pages/index`: dashboard and due-review entry
- `pages/review`: flip cards and grade recall
- `pages/cards`: card library and card editor
- `utils/srs.js`: spaced repetition scheduling
- `utils/storage.js`: local data persistence
- `data/seed.js`: sample starter cards

## Notes

This is an MVP. Cloud sync, authenticated accounts, subscription-message reminders and automated import from ChatGPT are future enhancements. WeChat subscription messages require user authorization and cannot be sent as unrestricted daily push notifications.
