// データ処理用サーバ(Node.js)
// WebサーバはNetlifyを使用予定

// オセロのゲーム処理(./othello_core/src/lib.rs)
const wasm = require("./othello_core/pkg/core.js");
const fn = require("./lib/funcs.js");

// 開発用CLI
const readline = require("node:readline");

// Cretate WebSocket Server
const ws = require("ws");
const ws_server = new ws.Server({ port: port = process.env.PORT?? 3000 });
const server_address = "127.0.0.1";     // for local env

// gameState variables
// board = [white stone, black stone] -> &[u64]
let board = [0x1008000000n, 0x810000000n];
let counter = 0;

// クライアントとの接続待ち
ws_server.on("connection", socket => {
    console.log("Client connected");

    // 開発用CLI
    readline.createInterface({
        input: process.stdin,
        output: process.stdout
    }).on("line", input => socket.send(input));

    // 受信データの処理
    socket.on("message", data => {
        console.log(`\rReceved: ${data}`);

        let json = fn.json_parse(data);
        let res = {
            state: null, 
            color: wasm.next_turn(counter)
        }, rev_locs = [];

        if (!json) {
            // 伝送エラー？
            
        } else if (json.type == "click" && typeof(json.loc) == "number") {
            board = wasm.put_stone(board, json.loc, counter);
            
            // 合法手なら反転する石を算出
            if (board) {
                rev_locs = wasm.legalize(board, json.loc);
                res.state = "ok";
                counter++;

            // 非合法手なら赤表示
            } else {
                res.state = "ng";
            }

            console.log(board, res);
        }

        socket.send(JSON.stringify(res));

        // socket.send(JSON.stringify({
        //     state: "ok" | "ng", 
        //     color: "white" | "black", 
        //     add_loc: loc | 0, 
        //     rev_locs: [1, 2, 3]
        // }));
    });

    // 接続切れ
    socket.on("close", () => {
        console.log("Client disconnected");
    });
});


// add(BigInt, BigInt)
// console.log("7n: ", wasm.add(3n, 4n));

console.log(`\nServer running on ws://${server_address}:${port}`);
