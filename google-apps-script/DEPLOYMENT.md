# Google Sheets registration and final-result setup

## Exact `GameData` headers

Enter these values in cells `A1:O1`:

`Session ID | Name | Email | Employee ID | Plant | Language | Start Date | Start Time | Final Score | Correct Answers | Wrong Answers | Completion Date | Completion Time | Status | Game Duration (hh:mm:ss)`

If the tab is empty, the script creates and freezes this header row. If row
1 already contains data, the script validates the exact headers before it
appends registrations. The updated script also automatically migrates the
earlier six-column header layout by inserting the new Session ID column and
expanding the header row. Existing legacy rows remain unchanged and have no
session ID; newly registered attempts use the complete result flow.

## Deploy the Apps Script Web App

1. Open your Google Sheet and copy its ID from the URL. It is the value
   between `/d/` and `/edit`.
2. Open **Extensions → Apps Script**.
3. Replace the editor contents with `Code.gs` from this folder.
4. Confirm `SPREADSHEET_ID` contains the copied spreadsheet ID.
5. Confirm the tab is named exactly `GameData`.
6. Choose **Deploy → New deployment → Web app**.
7. Set **Execute as** to **Me**.
8. Set **Who has access** to **Anyone**, or the widest option allowed by your
   Google Workspace administrator.
9. Click **Deploy**, authorize access, and copy the URL ending in `/exec`.
10. Paste that URL into `frontend/.env`:

    `VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/.../exec`

11. Restart the Vite development server after changing `.env`.

For later code edits, use **Deploy → Manage deployments → Edit**, choose a
new version, and deploy. Use the `/exec` URL in React, not the `/dev` URL.

The Web App supports two JSON actions:

- `register`: appends one attempt and returns a unique `sessionId`.
- `complete`: finds that `sessionId` and updates score, counts, language,
  completion timestamp, and status. Repeating `complete` is idempotent.

## Game duration update

Replace the deployed Apps Script with the updated `Code.gs`, then use
**Deploy → Manage deployments → Edit → New version → Deploy** to retain
its existing URL. Deploy the updated frontend as well.

The script appends column O, `Game Duration (hh:mm:ss)`, automatically to
an existing 14-column result sheet. Existing rows remain unchanged.
The frontend measures from scenario 1 starting (after the countdown) until
the results screen opens. This includes question, animation, feedback and
idle time during gameplay, but excludes registration and results review.
The timestamps and final duration survive refreshes using session storage.
Duration is saved with the existing Finish / Play Again result submission;
retries reuse the same duration. Sessions begun before this update have a
blank duration rather than a fabricated value.

Durations are stored as native Sheets duration values with `[hh]:mm:ss`
formatting (125 seconds displays as `00:02:05`). Existing seconds values
are converted automatically once when the updated script receives a request.
Elapsed hours can exceed 24 without wrapping. The frontend still sends seconds.
