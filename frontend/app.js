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
  '/static/videos/hero-3.mp4'
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

// Toggle hiển thị khi click nút toggle
chatToggle.addEventListener("click", () => {
    if (chatbox.style.display === "flex") {
        chatbox.style.display = "none"; // đóng chat
        chatToggle.classList.remove("active"); // nút về bình thường
    } else {
        chatbox.style.display = "flex"; // mở chat
        chatToggle.classList.add("active"); // giữ hover luôn
    }
});


// Click nút close luôn đóng chat
chatClose.addEventListener("click", () => {
    chatbox.style.display = "none";
    chatToggle.classList.remove("active");
});

async function sendMessage() {
    const input = document.getElementById("userInput");
    const message = input.value.trim();
    if (!message) return;

    const msgBox = document.getElementById("messages");

    // User message
    const userMsg = document.createElement("div");
    userMsg.className = "user-msg";
    userMsg.textContent = message;
    msgBox.appendChild(userMsg);

    // Typing indicator
    const typing = document.createElement("div");
    typing.className = "ai-msg typing-indicator";
    typing.innerHTML = '<span></span><span></span><span></span>';
    msgBox.appendChild(typing);
    msgBox.scrollTop = msgBox.scrollHeight;

    input.value = "";

    try {
        const res = await fetch("/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message })
        });

        const data = await res.json();

        // Remove typing indicator
        typing.remove();

        // AI message (Markdown supported)
        const aiMsg = document.createElement("div");
        aiMsg.className = "ai-msg";
        aiMsg.innerHTML = parseMarkdown(data.reply); // <-- parse Markdown
        msgBox.appendChild(aiMsg);

        msgBox.scrollTop = msgBox.scrollHeight;

    } catch (err) {
        typing.remove();
        const errorMsg = document.createElement("div");
        errorMsg.className = "system-msg";
        errorMsg.textContent = "❌ Backend connection error!";
        msgBox.appendChild(errorMsg);
        msgBox.scrollTop = msgBox.scrollHeight;
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

    msg.textContent = `${sender}: ${text}`;

    if (type === "user") {
        msg.className = "user-msg";
    } else if (type === "ai") {
        msg.className = "ai-msg";
    } else {
        msg.className = "system-msg";
    }

    msgBox.appendChild(msg);
    msgBox.scrollTop = msgBox.scrollHeight;
}


document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const el = entry.target;

      if (entry.isIntersecting) {
        // Reset để animation có thể chạy lại
        el.classList.remove("animate");
        void el.offsetWidth; // force reflow
        el.classList.add("animate");
      } else {
        // Khi ra khỏi viewport thì bỏ class đi
        el.classList.remove("animate");
      }
    });
  }, {
    threshold: 0.2 // hiển thị ≥20% thì trigger
  });

  document.querySelectorAll(".autoBlur")
    .forEach(el => observer.observe(el));
});
