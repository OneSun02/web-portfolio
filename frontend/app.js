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
// Chatbox
// -------------------------
async function sendMessage() {
    const input = document.getElementById("userInput");
    const message = input.value.trim();
    if (!message) return;

    appendMessage("Bạn", message, "user");
    input.value = "";

    try {
        // Fetch backend /chat (relative URL)
        const res = await fetch("/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message })
        });

        const data = await res.json();

        appendMessage("AI", data.reply, "ai");
    } catch (err) {
        appendMessage("System", "❌ Lỗi kết nối backend!", "error");
        console.error(err);
    }
}

// Gắn sự kiện Enter
document.getElementById("userInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});

// -------------------------
// Hiển thị tin nhắn
// -------------------------
function appendMessage(sender, text, type) {
    const msgBox = document.getElementById("messages");
    const msg = document.createElement("div");

    msg.textContent = `${sender}: ${text}`;
    msg.style.padding = "6px 10px";
    msg.style.margin = "4px 0";
    msg.style.borderRadius = "10px";
    msg.style.maxWidth = "80%";

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

    msgBox.appendChild(msg);
    msgBox.scrollTop = msgBox.scrollHeight; // auto scroll
}
