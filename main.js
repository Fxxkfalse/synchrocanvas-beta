import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onChildAdded, push } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// ★ ここに自分のFirebase設定を貼る
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  databaseURL: "YOUR_DB_URL",
  projectId: "YOUR_ID",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_SENDER",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const drawRef = ref(db, "draws");

const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

canvas.addEventListener("click", (e) => {
  const x = e.offsetX;
  const y = e.offsetY;

  ctx.fillStyle = "#000";
  ctx.font = "20px sans-serif";
  ctx.fillText("文字", x, y);
});

// 文字を描く
ctx.fillStyle = "#000";      // 文字の色
ctx.font = "24px sans-serif"; // フォントサイズと種類
ctx.fillText("Hello SynchroCanvas!", 20, 40); // (文字, x座標, y座標)

let drawing = false;

canvas.addEventListener("mousedown", () => drawing = true);
canvas.addEventListener("mouseup", () => drawing = false);
canvas.addEventListener("mousemove", draw);

function draw(e) {
  if (!drawing) return;

  const x = e.offsetX;
  const y = e.offsetY;

  // 自分の描画をFirebaseに送信
  push(drawRef, { x, y });

  drawPoint(x, y);
}

function drawPoint(x, y) {
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.arc(x, y, 3, 0, Math.PI * 2);
  ctx.fill();
}

// 他のユーザーの描画を受信
onChildAdded(drawRef, (snapshot) => {
  const { x, y } = snapshot.val();
  drawPoint(x, y);
});
