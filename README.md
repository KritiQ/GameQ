# GameQ

GameQ is a web application for tracking video games you want to play, are currently playing, or have already completed.

The app is inspired by watchlist systems (like movie or anime trackers), allowing users to manage their personal gaming backlog in a clean cyberpunk-themed interface.

---

## Features

- User authentication (register & login)
- Browse games from external API (RAWG)
- Personal backlog management
- Track game status:
  - Planned
  - Playing
  - Completed
  - Dropped
- Search for games
- Detailed game view:
  - Description
  - Rating
  - Platforms
  - Official website
  - Screenshots
- Genre tags and navigation

---

## Screenshots

<img width="1861" height="961" alt="image" src="https://github.com/user-attachments/assets/32c4b1c2-153f-4bf9-a4b5-072ab7e3d27e" />
<img width="1858" height="962" alt="image" src="https://github.com/user-attachments/assets/1c19cbcd-802c-45a9-95fd-fb433d26ee2a" />
<img width="1860" height="957" alt="image" src="https://github.com/user-attachments/assets/cc68f0c7-aab3-4853-9866-7bffbc9cc27c" />
<img width="1861" height="957" alt="image" src="https://github.com/user-attachments/assets/17b1caa9-f11b-4220-9b87-66d190832a03" />
<img width="1862" height="961" alt="image" src="https://github.com/user-attachments/assets/e1f2d600-d816-4636-983f-e52a31fbc226" />

---

## Tech Stack

- Frontend: React + TypeScript
- Backend: Node.js
- Database: Prisma
- Styling: CSS / Bootstrap

---

## Getting Started

```bash
git clone https://github.com/KritiQ/GameQ
cd GameQ

# create .env file in /server with:
# DATABASE_URL=your_database_url
# RAWG_API_KEY=your_api_key
# JWT_SECRET=your_jwt_secret

cd server
npm install
npm run dev

# open new terminal

cd client
npm install
npm run dev

