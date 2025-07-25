# Mini Galaga‑Style Canvas Game

A fast‑paced, endless “Galaga”‑inspired shooter built with **vanilla ES6 JavaScript** and **HTML5 Canvas**.  
No external dependencies — just drop it into VS Code, open with Live Server, and blast off!
(As of August 2025, there are still updates being made so definitely check back in!)
---

## 🎮 Features

- **Responsive Canvas**: fills the browser window and adapts on resize  
- **Player Ship**: fast movement, rapid fire (300 ms cooldown), easy-to-read outline  
- **Lives & Score**: start with 3 lives, earn 10 points per enemy  
- **Endless Waves**: 100 levels that progressively increase in difficulty  
- **Four Enemy Types** (from level 1!):  
  - **Normal** (magenta rectangle)  
  - **Fast** (orange triangle)  
  - **Big** (purple circle)  
  - **Zigzag** (lime diamond, drifts up/down)  
- **Turbo Start**: double the speeds from wave 1 for instant action  
- **HUD**: clear display of Score, Lives, and Level  
- **Game Over & Victory Screens**: press **R** to restart or replay  

---

## 📂 File Structure
/project-root
├── index.html
└── main.js


---

## ⚙️ Installation & Usage

1. **Clone** or **download** this folder.  
2. **Open** `project-root` in VS Code.  
3. **Install** the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) if you haven’t already.  
4. **Right‑click** on `index.html` → **Open with Live Server**.  
5. **Play** in your browser!

---

## 🕹️ Controls

- **← / →** – Move ship left and right  
- **Space** – Fire bullets (300 ms cooldown)  
- **R** – Restart game (at Game Over or Victory)  

---

## 🚀 How It Works

- **`index.html`**  
  - Sets up the canvas and includes `main.js` as an ES module.  

- **`main.js`**  
  - **Canvas Setup**: resizes to fit the window and handles redraws.  
  - **InputHandler**: tracks keyboard state for movement, shooting, restart.  
  - **Starfield**: simple twinkling background of 200 stars.  
  - **Player**: triangle ship with fast movement and shoot cooldown.  
  - **Bullet**: circle projectiles with high speed and collision logic.  
  - **Enemy**: four shapes/types, each with unique size, speed, color, and movement pattern.  
  - **Game Loop**: runs via `requestAnimationFrame`, updates/draws all entities, checks collisions, handles waves, lives, and end states.  

---

## 🔧 Customization Ideas

- **Sound Effects & Music**  
- **Power‑ups** (rapid fire, shields, multi‑shot)  
- **Boss Waves** every 10 levels  
- **Particle Explosions** on enemy death  
- **Mobile Touch Controls**  

Feel free to fork and extend—have fun coding your own arcade masterpiece!  

---

_Thank you for playing & happy shooting!_  
