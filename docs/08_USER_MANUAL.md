# User Manual — Form Builder

Welcome! This guide walks you through **Form Builder** end to end. Follow the chapters in order the first time you use it — every step is a click-by-click instruction.

> **Who is this for?** Anyone using the app for the first time. No technical background needed.

---

## Table of Contents

1. [What is Form Builder?](#1-what-is-form-builder)
2. [Before You Start](#2-before-you-start)
3. [Create Your Account](#3-create-your-account)
4. [Sign In](#4-sign-in)
5. [Your Dashboard](#5-your-dashboard)
6. [Organize with Folders](#6-organize-with-folders)
7. [Build Your First Form](#7-build-your-first-form)
8. [Understand the Block Types](#8-understand-the-block-types)
9. [Customize the Theme](#9-customize-the-theme)
10. [Share Your Form](#10-share-your-form)
11. [What Visitors See](#11-what-visitors-see)
12. [View Responses](#12-view-responses)
13. [Export Responses to CSV](#13-export-responses-to-csv)
14. [Change Account Settings](#14-change-account-settings)
15. [Sign Out & Sign Back In](#15-sign-out--sign-back-in)
16. [Danger Zone (Clear / Delete)](#16-danger-zone-clear--delete)
17. [Troubleshooting](#17-troubleshooting)
18. [Frequently Asked Questions](#18-frequently-asked-questions)

---

## 1. What is Form Builder?

Form Builder lets you **design conversational forms** — instead of a boring form with dozens of fields, your audience fills it out as a **chat**. One question at a time. More engaging = more completed responses.

You can:
- Create unlimited forms
- Organize them in folders
- Add text messages, images, videos, GIFs, and input fields (text, email, phone, rating, buttons, etc.)
- Choose from 3 themes (Light, Dark, Tail Blue)
- Share a link with anyone (no signup required for respondents)
- View responses in a table + export to CSV

---

## 2. Before You Start

You need:
- A **modern web browser** — Chrome, Edge, Firefox, or Safari (latest version recommended)
- An **email address** (used as your login)
- **Internet connection** — Form Builder is a web app

That's it. No downloads, no installations.

---

## 3. Create Your Account

If you don't have an account yet:

1. Open Form Builder in your browser (**http://your-form-builder-url/** — your admin will give you this)
2. On the landing page, click the **"Create a FormBot"** button (top-right)
   *— or if you're on any other page, click "Register now" at the bottom of the login form*
3. The **Sign Up** screen appears with a decorative dark background
4. Fill in the form:
   - **Username**: 3-30 characters. Letters, numbers, `.`, `-`, `_` allowed. This is unique — no two users can share the same username.
   - **Email**: Your real email address. Must be unique.
   - **Password**: At least 8 characters. Use a strong password (mix upper, lower, numbers, symbols). Click the **👁️** icon to reveal what you typed.
   - **Confirm Password**: Type the same password again.
5. Click the blue **"Sign Up"** button
6. Wait a moment. If everything's good:
   - A toast (little popup message) appears at top-right: *"Account created successfully."*
   - You are automatically signed in and redirected to your **Dashboard**

### If Sign Up Fails

Look at the toast message (top-right):

| Message | What to do |
|---------|------------|
| *"An account with this email already exists."* | Use a different email, or go back to `/login` and sign in. |
| *"This username is already taken."* | Choose a different username. |
| *"Enter a valid email address."* | Fix the email format (must contain `@` and a domain). |
| *"Password must be at least 8 characters."* | Type a longer password. |
| *"enter same password in both fields"* | The two password fields don't match — retype them. |

---

## 4. Sign In

Already have an account?

1. Go to the login page (**Form Builder URL** + `/login`)
2. Enter your **Email** (the one you registered with)
3. Enter your **Password**. Click **👁️** to reveal it if you want to double-check.
4. Click the blue **"Log In"** button
5. Toast: *"Logged in successfully."* → you land on the Dashboard.

### If Login Fails

- **"Invalid email or password."** — Check both fields. Passwords are case-sensitive.
- **Forgot your password?** — Currently there's no password-reset email (it's a future feature). Ask your admin to reset it, or create a new account with a different email.

---

## 5. Your Dashboard

The Dashboard (URL: `/dashboard`) is your workspace. Here's what you see:

### Top Header
- Centered dropdown showing **"[Your name]'s workspace ▼"**
- Click the dropdown to reveal:
  - **Settings** — goes to your account settings
  - **Log Out** — signs you out (orange text)

### Toolbar
- **"Create a folder"** button — with a folder icon

### Main Area
- A big blue **"Create a typebot"** card with a `+` icon
- Any existing folders appear as chips (small pill-shaped labels) next to the button
- Any forms appear as gray cards in a grid

If it's your first time, the toolbar and main area are mostly empty. That's normal.

---

## 6. Organize with Folders

Folders are optional but nice for keeping many forms tidy.

### Create a Folder

1. Click **"Create a folder"**
2. A modal (popup dialog) appears titled **"Create a folder"**
3. Type a name — e.g., `Customer Feedback` — the field auto-focuses
4. Click **Save** (or press Enter)
5. Modal closes. New folder chip appears in the toolbar. Toast: *"Folder created."*

### Open a Folder

1. Click any folder chip to open it (the chip turns blue)
2. The main grid now shows **only the forms inside that folder**
3. A **"← Back to all"** link appears — click it to go back to seeing all folders/forms

### Delete a Folder

1. Hover the folder chip → click the small red **🗑️** trash icon on the right
2. A confirmation modal appears: *"Delete folder? '<name>' and all forms inside it will be deleted..."*
3. Click **Cancel** to keep it, or the red **Delete** button to confirm.
4. Toast: *"Folder deleted."*

⚠️ **Deleting a folder also deletes ALL forms inside it, plus their responses.** This can't be undone.

---

## 7. Build Your First Form

### Create the Form

1. Click the big blue **"Create a typebot"** card
2. A modal appears titled **"Create a form"**
3. The name field is pre-filled with **"New form"** — replace it with something meaningful, e.g., `Product feedback survey`
4. Click **Save**
5. You are **immediately taken into the Form Builder** — the URL changes to `/dashboard/forms/{some-id}`

### The Form Builder Interface

You see three main areas:

**A. Top toolbar** (horizontal bar at the top)
- Left: **Form name input** — click here to rename the form
- Center: **Flow / Theme / Response** tabs — switch between building, styling, and viewing responses
- Right: **Share** (blue), **Save** (green), **✕** close (red)

**B. Left sidebar** (visible on Flow tab)
- Titled **BUBBLES** — click-to-add message blocks
- Titled **INPUTS** — click-to-add form fields

**C. Center canvas** (main area)
- A "🚩 Start" block always at the top
- Any blocks you add appear below, connected by a line

### Add Blocks

To add a block, **click its button in the left sidebar**. It appears in the canvas.

Try this now:
1. Click **Text** under **BUBBLES**
   → A **Text** block appears with a red outline + "Required field" message (because it's empty)
2. Click inside the text field and type: `Hi there! What's your name?`
   → The red outline disappears

3. Click **Text** under **INPUTS** (careful — there's a Text in both groups; Inputs are orange-colored, Bubbles are blue)
   → A **Text** input block appears
4. Type a **label** — e.g., `Your name`
5. Type a **placeholder** — e.g., `Type your name here...`
6. Check the **Required** box if you want to make it mandatory

7. Add another **Text** bubble (Bubbles group) — type `Thanks, [name]! What's your email?`
8. Add an **Email** input (Inputs group) — label it `Email`, mark Required

### Reorder / Delete Blocks

- **Hover** a block → three buttons appear in the top-right of the block:
  - **⬆️** Move up
  - **⬇️** Move down
  - **🗑️** Delete (red trash icon, always visible)
- Click **⬆️** / **⬇️** to reorder — the top of the canvas is the first question your audience sees.
- Click 🗑️ to delete a block (no confirmation modal for blocks — quick deletion; can be re-added).

### Save Your Work

The form **auto-saves on every change**. But you can also click the green **Save** button at the top to force a save + get a *"Saved"* toast.

Rename the form by clicking the **name input** at the top-left, typing a new name, then clicking away (or pressing Enter). Toast: *"Name saved."*

---

## 8. Understand the Block Types

There are **11 block types** in two groups.

### BUBBLES — Messages from You (the Bot)

| Block | What it does | You provide | Visitor sees |
|-------|-------------|-------------|--------------|
| **Text** 🗨️ | Bot message | The message content | A gray bubble on the left with your text |
| **Image** 🖼️ | Show an image | An image URL (e.g., `https://example.com/logo.png`) | The image displayed inline |
| **Video** 🎬 | Show a video | A video URL | The video (with player controls) |
| **GIF** 🎞️ | Show an animated GIF | A GIF URL | The animated GIF |

Tip: To use an image, upload it somewhere public first (Imgur, Cloudinary, your own server) and paste the URL.

### INPUTS — Questions Your Visitor Answers

| Block | What it collects | Extra options |
|-------|------------------|---------------|
| **Text** 📝 | Free text (single line) | Label, Placeholder, Required |
| **Number** 🔢 | Numeric answer | Label, Placeholder, Required |
| **Email** 📧 | Email address (validated) | Label, Placeholder, Required |
| **Phone** 📞 | Phone number | Label, Placeholder, Required |
| **Date** 📅 | Date picker | Label, Required |
| **Rating** ⭐ | Stars (1-N) | Label, Max stars (1-10), Required |
| **Buttons** 🔘 | Multiple choice pills | Label, Options (add/remove any number), Required |

### Required Fields

If a field is **Required**, the visitor cannot proceed until they answer. Non-required = they can skip it.

---

## 9. Customize the Theme

Themes control what your form (and the whole app) looks like.

1. In the Form Builder, click the **Theme** tab (top center)
2. The left sidebar shows **"Customize the theme"** with 3 cards:
   - **Light** — white background, dark text
   - **Dark** — deep black background, light text (default)
   - **Tail Blue** — teal background, navy accents
3. Each card shows a mini preview
4. Click any card → the whole app (dashboard, form builder, and public form) switches to that theme
5. Toast: *"Dark theme applied."* (etc.)

⚠️ **The theme is global** — it applies everywhere in Form Builder for your account. It's NOT per-form.

**Your theme choice is saved to your account** — sign out and back in, it's still there.

---

## 10. Share Your Form

Time to collect responses.

1. Make sure your form has at least **one block** (empty forms can't be shared)
2. Click the blue **Share** button at the top-right of the Form Builder
3. Toast: *"Link copied."* — the URL is now on your clipboard
4. Paste this URL wherever you want:
   - Email
   - WhatsApp / Slack / Discord
   - Social media
   - Your website
5. The URL looks like: `http://your-app.com/f/6a508e34610daabb25566e33`

Anyone with the link can fill your form — **they don't need an account.**

### Change the Share URL Later?

The URL is tied to the form ID and doesn't change. But if you **delete the form**, the URL stops working (visitors will see "Form not found").

### If Share Doesn't Work

If you click Share and see *"Add at least one block before sharing"* — your form is empty. Add at least one block (a Text bubble is enough) and try again.

---

## 11. What Visitors See

When someone opens your share link:

1. The chat interface loads (light/dark based on your theme choice)
2. Bot messages appear one by one with a 400ms stagger — like a real chat
3. When it's their turn (first Input block), an input bar appears at the bottom
4. They type their answer, click **▶** (send button)
5. Their answer appears as an **orange bubble on the right**
6. The next question appears automatically
7. This continues until all questions are answered
8. Final message from the bot: *"Thanks for your submission! 🎉"*

Types of inputs the visitor experiences:
- **Text / Number / Email / Phone**: type + send
- **Date**: date picker
- **Rating**: click a star (1-5, or whatever max you set)
- **Buttons**: click one of the option pills

If they try to skip a required field or enter something invalid (e.g., not-an-email in an Email field), they see a red error and can't proceed.

---

## 12. View Responses

Each response is saved automatically.

1. Open the form in the Form Builder (from Dashboard → click the form card)
2. Click the **Response** tab (top center)
3. You see:

### Stats Row (3 cards)
- **Views** — number of times someone opened the share link
- **Starts** — number of visitors who answered at least one question
- **Completion rate** — percentage of Starts that completed all questions

### Submissions Table

Below the stats, a table with columns:
- **#** — row number
- **Submitted at** — timestamp
- One column per input block, labeled with the field's label
- **🗑️** delete icon per row

Each row is one completed form fill.

### If There Are No Responses

You'll see either:
- *"Add input blocks in the Flow tab to start collecting responses."* — Your form has no input blocks yet.
- *"No responses yet. Share the form link to collect responses."* — Ready to receive but nobody has filled it yet.

### Delete a Response

1. Click the red **🗑️** icon on the row
2. Confirmation modal appears
3. Click **Delete** to confirm
4. The row is removed. Toast: *"Response deleted."*

⚠️ Deleting a response can't be undone.

---

## 13. Export Responses to CSV

Perfect for opening in Excel, Google Sheets, or importing into another tool.

1. In the Response tab, click the blue **"📥 Export CSV"** button (top-right of the table)
2. A file downloads to your Downloads folder, named after the form: `Product feedback survey.csv`
3. Open it in any spreadsheet program

The CSV includes:
- Row number
- Submitted-at timestamp
- One column per input block

If your form has no responses, the button is disabled and clicking shows: *"Nothing to export yet."*

---

## 14. Change Account Settings

1. In the Dashboard header, click **"[Your name]'s workspace ▼"** → **Settings**
2. You land on the Settings page (`/dashboard/settings`)

### 👤 Profile Section

- **Username** — read-only. Cannot be changed.
- **Display name** — how your name appears in the workspace header. Editable.
- **Email** — your login email. Editable (must be unique).

Change values → click **Save** → toast: *"Profile updated successfully."*

### 🔑 Change Password Section

To change your password, you must know your current one.

1. **Current password** — enter your existing password
2. **New password** — must be ≥ 8 characters, different from current
3. **Confirm new password** — retype the new one
4. Click **Save**

- Wrong current password → *"Current password is incorrect."* — try again
- Passwords don't match → *"Passwords do not match"*
- Success → *"Password changed successfully."*

Each password field has a 👁️ eye icon to reveal what you typed.

### 📁 Workspace Section

Shows a count: *"You have 3 folders and 12 forms."* + a button:

**"Clear all folders and forms"** — deletes everything in your workspace. Your account stays.

Click it → confirmation modal → **Clear all** → all folders, forms, and responses are gone. Toast: *"All folders and forms deleted."*

### 🚪 Log Out Section

Big orange **Log out** button.
1. Click it → orange-tinted confirmation modal
2. Click **Log out** → you're signed out and taken back to the login page
3. Your data stays saved — sign back in anytime.

### ⚠️ Danger Zone

**Delete account** button (red).
1. Click it → red confirmation modal
2. Click **Delete account** → your account and ALL data are permanently deleted
3. You are logged out and returned to the landing page

**This cannot be undone.** All folders, forms, and responses are gone.

---

## 15. Sign Out & Sign Back In

### Sign Out (Quick)

1. Click **"[Your name]'s workspace ▼"** in the Dashboard header
2. Click **Log Out** (orange text in the dropdown)
3. You are redirected to `/login`

### Sign Back In

1. Go to `/login`
2. Enter your **Email** and **Password**
3. Click **Log In**
4. You are back in your workspace with all folders, forms, and responses intact.

---

## 16. Danger Zone (Clear / Delete)

Three actions in the Settings page that **cannot be undone**:

| Action | What it removes | What it keeps |
|--------|-----------------|---------------|
| **Clear all folders and forms** | Every folder, form, and response | Your account (username, email, password) |
| **Delete account** | Your account + every folder, form, response | Nothing |
| **Delete a folder** (from Dashboard) | The folder + forms in it + their responses | Everything outside that folder |
| **Delete a form** (from Dashboard) | The form + its responses | Everything else |
| **Delete a response** (from Response tab) | That one response | Everything else |

Always read the confirmation modal carefully before clicking **Delete** / **Clear all**.

---

## 17. Troubleshooting

### I can't log in

- **Double-check** your email — is it exactly the one you registered with?
- **Double-check** your password — is Caps Lock off? Use the 👁️ icon to see what you're typing.
- Try registering with a different email if you've forgotten the original one (there's no password-reset email yet).

### I clicked "Create a typebot" but nothing happens

- Make sure you filled in the form name in the modal
- Check your internet connection
- Refresh the page (`F5`) — if the modal was stuck, this resets it
- If it still fails, sign out and back in

### My share link shows "Form not found"

- The form has been deleted, or
- The link is misspelled — copy it again by clicking **Share** in the Form Builder

### I don't see my responses

- Wait a moment and refresh the page — new responses may take a second to appear
- Check the **Views** stat — if it's 0, the visitor never actually opened your link
- Check that your inputs are set as **Required** — if all inputs are optional, the visitor may have submitted an empty response (which still counts, just with blank values)

### The theme doesn't change

- Themes are per-user, saved on the server. Refresh the page — the theme should apply.
- Some pages (Landing, Login) are always dark by design — the theme applies to your Dashboard, Form Builder, and Public Form pages.

### My form auto-saves feel slow

- Each block edit triggers a save. On slow connections, wait a moment for the toast to disappear before making the next edit. Data is safe — the app doesn't lose changes.

### I got signed out unexpectedly

- Your session token expires after **7 days** of inactivity. Just sign back in.

---

## 18. Frequently Asked Questions

**Q: Do my visitors need to create an account to fill my form?**
No. Anyone with the share link can fill it out anonymously.

**Q: How many forms can I create?**
Unlimited.

**Q: How many responses can one form collect?**
Unlimited (limited only by the backend storage).

**Q: Can I edit a form after sharing it?**
Yes! The share link stays the same, but visitors will see your latest version.

**Q: Can I move a form to a different folder?**
Currently no — you'd have to delete and recreate (this feature is on the roadmap).

**Q: Is my data private?**
Yes. Only YOU can see your responses in the Response tab. The public share link only lets people ADD responses, not read them.

**Q: Can visitors see other people's answers?**
No. Each visitor only sees their own conversation.

**Q: Can I embed the form on my website?**
Not yet as an iframe — for now, just share the link. Embedding is on the roadmap.

**Q: Can I have branching logic (e.g., different next question based on the answer)?**
Not yet. Currently all blocks play in sequence. Branching is on the roadmap.

**Q: What if I want to change my username?**
Usernames are permanent. You can change your **display name** in Settings, but the username itself is fixed.

**Q: What happens if I export CSV and then delete a response?**
The CSV file you downloaded still contains everything at that moment. But the app itself no longer has the deleted row.

**Q: Can I recover a deleted form/folder/response?**
No. Delete operations are permanent. There's no trash/recycle bin.

---

## Need More Help?

If you're stuck on something not covered here, contact your admin or check the technical docs:
- Full API reference: `docs/02_API_REFERENCE.md`
- Sample payloads for each endpoint: `docs/09_API_PAYLOADS.md`

Happy form-building! 🎉
