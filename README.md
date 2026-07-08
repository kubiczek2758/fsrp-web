# Florida State Roleplay – Official Website

A modern, responsive, and animated website for the **Florida State Roleplay** server. Built with pure HTML, CSS, and JavaScript. No frameworks or build tools required.

![Florida State Roleplay](logo.png)

---

## Features

- 🎨 **Premium green glassmorphism UI** with smooth animations
- 📱 **Fully responsive** design for desktop, tablet, and mobile
- ⚡ **Custom loading screen** with animated rings and progress bar
- 🧭 **Floating navigation bar** with active section highlighting
- 👥 **Owners section** with Founder and Website Developer badges
- 🚔 **Departments section** for all roleplay departments
- 📰 **News system** with a dedicated `/news.html` subpage
- 📝 **Applications section** (Staff Application & Ban Appeal)
- 📜 **Server rules** section
- 💬 **Discord integration** with styled call-to-action buttons
- 🔒 **Admin Dashboard** (press `F8`) for editing content
- 💾 **LocalStorage persistence** for all edits and news
- 📤 **Import / Export** configuration as JSON

---

## Project Structure

```
fsrp-web/
├── index.html      # Main landing page
├── news.html       # News subpage
├── styles.css      # All styles, animations, and responsive design
├── app.js          # All JavaScript logic (loader, admin panel, news system)
├── logo.png        # Server logo
├── pfp222.png      # Kubiczek2758 avatar
├── lucky.png       # lucky_blade18 avatar
└── README.md       # This file
```

---

## Getting Started

1. Clone or download the repository.
2. Open `index.html` in your browser.
3. To test locally with a server, run:

```bash
python -m http.server 8080
```

Then visit: `http://localhost:8080`

---

## Admin Panel

The website includes a hidden admin panel for editing content without touching the code.

### How to access

1. Press **`F8`** on any page.
2. Enter the password: **`H&l9Jo0`**
3. Use the tabs to edit:
   - **General** – server name, subtitle, Discord link, footer text
   - **Departments** – descriptions and application links
   - **Applications** – Staff Application & Ban Appeal texts
   - **News** – add, edit, and delete news articles
   - **Rules** – server rules
   - **About / Owners** – about section texts
   - **Data** – export/import/reset configuration

### Important

All changes are saved in the browser's **localStorage**. They are visible only in the same browser on the same origin. To publish changes globally, you need to update the source files manually or deploy the exported JSON through your backend.

---

## News System

- News articles are managed from the **Admin Panel → News** tab.
- Added news appears automatically on `news.html`.
- News is sorted by date (newest first).
- Supported categories: `Update`, `Event`, `Announcement`, `Recruitment`.

---

## Customization

### Change default content

Edit the `defaultConfig` object in `app.js` to change the default text that appears when the site is loaded for the first time (or after a reset).

### Change colors

The color palette is defined as CSS variables at the top of `styles.css`:

```css
:root {
  --green-500: #10b981;
  --accent: #facc15;
  --discord: #5865f2;
  /* ... */
}
```

### Change owners

Edit the owner cards directly in `index.html`:

```html
<div class="owner-card reveal" data-owner="kubiczek">
  <img src="pfp222.png" alt="Kubiczek2758" class="owner-avatar" />
  <div class="owner-name">Kubiczek2758</div>
  <div class="owner-roles">
    <div class="owner-role">Founder</div>
    <div class="owner-role role-dev">Website Developer</div>
  </div>
</div>
```

---

## Credits

**Website made by [Kubiczek2758](https://discord.gg/pcP85r22KW)**

Server owners:
- **Kubiczek2758** – Founder & Website Developer
- **lucky_blade18** – Founder

---

## License

This project is private and created for the Florida State Roleplay community.
