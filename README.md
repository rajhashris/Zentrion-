# Zentrion

One common learning platform for engineering students (CSE, ECE, Mechanical, EEE, Civil, AI & DS).

## Run on your computer
1. Install Node.js (LTS) and VS Code
2. Open this folder in VS Code, then in the terminal run:
   - `npm install`
   - `npm run dev`
3. Open http://localhost:5173

## Make a live website
1. `npm run build` (creates the `dist` folder)
2. Drag the `dist` folder into https://app.netlify.com/drop

## Notes
- This is a prototype. Progress, avatar and settings are saved in each user's own browser (localStorage), not on a server.
- Login does not check passwords yet, and the doubt helper uses a built-in answer library.
