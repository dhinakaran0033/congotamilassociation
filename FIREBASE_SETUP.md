# Setup: Firebase login + books saved in your GitHub repo

| Part | Where it lives | Cost |
|---|---|---|
| Admin login | Firebase Authentication | Free (Spark plan, no card) |
| Book records (title, description, file paths) | Firebase Firestore | Free |
| Cover images + PDFs | This GitHub repo, folders `uploads/covers` and `uploads/pdfs` | Free |
| Website | GitHub Pages | Free |

## Part 1 – Firebase (project `congotamil`; config already in `js/firebase-config.js`)
1. **Authentication > Get started > Sign-in method > Email/Password > Enable > Save.**
2. **Authentication > Users > Add user**: email `test@congotamil.com`, a strong password.
3. Optional: **Settings > User actions** > untick *Enable create (sign-up)*.
4. **Firestore Database > Create database** > production mode > pick a location.
5. Firestore **Rules** tab > paste > **Publish**:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /books/{id} {
      allow read: if true;
      allow create, update, delete: if request.auth != null
        && request.auth.token.email == 'test@congotamil.com';
    }
  }
}
```
6. **Authentication > Settings > Authorized domains** > **Add domain**: `dhinakaran0033.github.io`
   (and your custom domain if you add one). `localhost` is already there.

(No Firebase Storage needed, so no Blaze plan.)

## Part 2 – GitHub
Repo: `dhinakaran0033/congotamilassociation`, branch `main` (set in `GITHUB` inside `js/firebase-config.js`; change it if different).

### 2a. Turn on GitHub Pages
Repo > **Settings > Pages** > Source: **Deploy from a branch** > Branch `main`, folder `/ (root)` > Save.
Site URL: `https://dhinakaran0033.github.io/congotamilassociation/`.
(Free Pages needs a **public** repo; uploaded PDFs are therefore public, which is fine for a public magazine.)

### 2b. Create the upload token (fine-grained, limited to this repo)
1. GitHub > profile picture > **Settings > Developer settings > Personal access tokens > Fine-grained tokens > Generate new token**.
2. Name: `charal-upload`. Expiration: e.g. 90 days (renew when it expires).
3. **Repository access > Only select repositories** > `congotamilassociation`.
4. **Permissions > Repository permissions > Contents: Read and write.** Nothing else.
5. Generate and **copy the token** (`github_pat_...`); it is shown only once. Keep it in a password manager.

Never put this token in the code or commit it. The admin pastes it in the Add Book popup; it lives only in that browser tab's session.

## Part 3 – Use it
1. Open the live site, **Login** with the Firebase admin account.
2. **Add New Book**: title, description, cover image, PDF, paste the GitHub token > **Save Book**.
3. The files are committed to the repo by the GitHub API (you'll see commits like `Upload uploads/pdfs/....pdf`) and the record is saved in Firestore.
4. Wait about 1-2 minutes: GitHub Pages rebuilds, then the new card's image and PDF work for everyone.
5. **Delete** removes the Firestore record and commits a deletion of the two files (asks for the token if not already entered this session).
6. The first admin visit imports the two original issues into Firestore automatically.

> After uploads, your local clone is behind GitHub: run `git pull` before your next `git push`, or it will be rejected.

## Test locally
Modules need HTTP (not `file://`): VS Code **Live Server** is enough now (no PHP). Uploads still go to GitHub and show on the live site after Pages rebuilds; locally the new files appear only after `git pull`.
Add `http://127.0.0.1` / `localhost` to Authorized domains if Firebase complains (localhost is default).

## Security notes
- Only the admin email can write book records (Firestore rules).
- Anyone holding the token can change the repo's contents, so keep it private, use the repo-limited fine-grained type, and revoke it in GitHub settings if it leaks.
- The page checks that the cover is a real image type and the PDF starts with `%PDF-`, and uses random file names.

## Troubleshooting
| Symptom | Fix |
|---|---|
| "GitHub token is invalid or has no write access" | Token expired, wrong repo selected, or Contents isn't "Read and write" |
| "repository or branch not found" | Check `GITHUB` owner/repo/branch in `js/firebase-config.js` |
| Card shows broken image/PDF right after upload | Pages is still rebuilding; wait 1-2 minutes and refresh |
| Login fails with "unauthorized-domain" in console | Add the domain in Firebase > Authentication > Authorized domains |
| `Missing or insufficient permissions` | Firestore rules not published or email mismatch |
| `git push` rejected | Run `git pull` first (uploads create commits on GitHub) |
