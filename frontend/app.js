// -------------------------
// Menu toggle
// -------------------------
document.querySelector('.menu-toggle').addEventListener('click', () => {
  document.querySelector('.head-right').classList.toggle('show');
});

// -------------------------
// Video banner next
// -------------------------
const nextButton = document.querySelector('.next-btn');
const video = document.querySelector('.banner-video');
const movielist = [
  '/static/videos/hero-1.mp4',
  '/static/videos/hero-2.mp4',
  '/static/videos/hero-3.mp4',
  '/static/videos/hero-4.mp4'
];
let index = 0;

nextButton.addEventListener('click', function() {
  index = (index + 1) % movielist.length;
  video.src = movielist[index];
});

// -------------------------
// Smooth scroll
// -------------------------
function linearScroll(distance, duration) {
    const start = window.scrollY;
    const startTime = performance.now();

    function animation(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        window.scrollTo(0, start + distance * progress);

        if (progress < 1) {
            requestAnimationFrame(animation);
        }
    }

    requestAnimationFrame(animation);
}

document.querySelector('.scroll-down').addEventListener('click', () => {
    linearScroll(window.innerHeight, 1000);
});

// -------------------------
// Chatbox toggle
// -------------------------
const chatbox = document.getElementById("chatbox");
const chatToggle = document.getElementById("chatToggle");
const chatClose = document.getElementById("chatClose");

// Click mở chat
chatToggle.addEventListener("click", () => {
    chatbox.style.display = "flex";
});

// Click đóng chat
chatClose.addEventListener("click", () => {
    chatbox.style.display = "none";
});

// -------------------------
// Gửi tin nhắn
// -------------------------
async function sendMessage() {
    const input = document.getElementById("userInput");
    const message = input.value.trim();
    if (!message) return;

    appendMessage("Bạn", message, "user"); // user luôn là "Bạn"
    input.value = "";

    try {
        const res = await fetch("/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message })
        });

        const data = await res.json();

        appendMessage("Nhat", data.reply, "ai"); // AI hiển thị là "Nhat"
    } catch (err) {
        appendMessage("System", "❌ Lỗi kết nối backend!", "error");
        console.error(err);
    }
}

// Gắn sự kiện Enter
document.getElementById("userInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});

// Gắn sự kiện nút gửi (nếu bạn có button)
const sendBtn = document.querySelector("#chatInput button");
if (sendBtn) sendBtn.addEventListener("click", sendMessage);

// -------------------------
// Hiển thị tin nhắn
// -------------------------
function appendMessage(sender, text, type) {
    const msgBox = document.getElementById("messages");
    const msg = document.createElement("div");

    // Nội dung
    msg.textContent = `${sender}: ${text}`;
    msg.style.padding = "6px 10px";
    msg.style.margin = "4px 0";
    msg.style.borderRadius = "10px";
    msg.style.maxWidth = "80%";
    msg.style.wordWrap = "break-word";

    // Kiểu tin nhắn
    if (type === "user") {
        msg.style.background = "#daf1ff";
        msg.style.alignSelf = "flex-end";
    } else if (type === "ai") {
        msg.style.background = "#e9e9e9";
        msg.style.alignSelf = "flex-start";
    } else {
        msg.style.color = "red";
        msg.style.fontStyle = "italic";
    }

    // Append và scroll
    msgBox.appendChild(msg);
    msgBox.scrollTop = msgBox.scrollHeight;
}
