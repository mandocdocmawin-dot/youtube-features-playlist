# 🎵 YouTube Playlist

A React web app that displays a playlist of YouTube videos/tracks — complete with a header, a list of songs, and pagination. Built with **React + Vite**.

🔗 **Live Demo:** [youtube-features-playlist.vercel.app](https://youtube-features-playlist.vercel.app/)

## 📸 Preview

The app includes:
- A header showing the playlist name ("YouTube Playlist – Broadcast Yourself") and the playlist creator's name
- A "Now Playing" badge to show what's currently playing
- An input field where you can paste a YouTube video or playlist link, along with an **Add Link** button
- A list of tracks — each showing a thumbnail, video title, and YouTube channel name
- A highlight/indicator on the track that is currently "playing"
- Pagination (Prev / Next) to browse through other pages of the playlist
- A footer with copyright info

## 🛠️ Tech Stack

- **React** – for building UI components
- **Vite** – as the build tool and dev server
- **CSS** – for styling the components

## 📂 Project Structure

```
youtube-features-playlist/
├── public/
├── src/
│   ├── assets/
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── components/
│   │   ├── tracks/
│   │   │   ├── YoutubeList.jsx
│   │   │   └── YoutubeList.css
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   └── Title.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── constants.js
│   ├── Divider.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

### Component Breakdown

| Component | Description |
|---|---|
| `Header.jsx` | Displays the playlist name and the owner's name |
| `Title.jsx` | Renders the title/heading section |
| `tracks/YoutubeList.jsx` | Handles the list of YouTube videos/tracks, including the add-link feature and pagination |
| `Footer.jsx` | Footer containing copyright info |
| `Divider.jsx` | A simple divider/separator component |
| `constants.js` | Stores constant values used throughout the app |

## 🚀 Running Locally

1. Clone the repository
   ```bash
   git clone <repo-url>
   cd youtube-features-playlist
   ```
2. Install dependencies
   ```bash
   npm install
   ```
3. Run the dev server
   ```bash
   npm run dev
   ```
4. Open your browser at `http://localhost:5173`

## 📦 Build for Production

```bash
npm run build
```

## ✨ Features (To-do / Planned)

- [ ] Connect to the actual YouTube Data API for real video info
- [ ] Play/pause functionality using the YouTube embed player
- [ ] Search/filter tracks
- [ ] Save/persist playlist using localStorage or a database

## 👤 Author

Made by **Marwin**

## 📬 Contact

Have suggestions for further features? Feel free to reach out via email: **mandocdocmawin@gmail.com**