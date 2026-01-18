# othello

Online Othello game using Node.js (WebSocket) and Rust (WebAssembly).

---

## Requirements

- Node.js
- Rust (for building WebAssembly)
- wasm-pack

---

## Setup

### 1. Clone the repository

```sh
git clone https://github.com/kamei28/othello.git
cd othello
```

### 2. Install Node.js dependencies
```sh
npm install ws
```

### 3. Build WebAssembly (Rust)
```sh
cd othello_core
cargo install wasm-pack
wasm-pack build --target nodejs
cd ..
```

### How to run
```sh
Start WebSocket server
npm run start
```

### Open client

Open index.html in your browser.

## Notes

- Rust is only required when rebuilding the WebAssembly module.

~~ - The game currently supports one match (2 players) at a time.~~