// -------------------------
// HEADER
// -------------------------
const menuToggle = document.querySelector('.menu-toggle');
const headRight = document.querySelector('.head-right');
const menuLinks = document.querySelectorAll('.head-right a');
const header = document.querySelector('header');
let lastScroll = 0;

// Toggle menu
menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    headRight.classList.toggle('show');
    menuToggle.classList.toggle("open");
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!headRight.contains(e.target) && !menuToggle.contains(e.target)) {
        headRight.classList.remove('show');
        menuToggle.classList.remove("open");
    }
});
// Smooth scroll to sections & close mobile menu
menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) targetSection.scrollIntoView({ behavior: 'smooth' });
        headRight.classList.remove('show');
    });
});

// Hide/show header on scroll
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll <= 0) header.style.top = '0';
    else if (currentScroll > lastScroll) header.style.top = '-100px'; // scroll down → hide
    else header.style.top = '0'; // scroll up → show
    lastScroll = currentScroll;
});

// -------------------------
// Video banner
// -------------------------
const nextButton = document.querySelector('.next-btn');
const video = document.querySelector('.banner-video');
const movielist = ['/static/videos/hero-1.mp4', '/static/videos/hero-2.mp4', '/static/videos/hero-3.mp4'];
let index = 0;

nextButton.addEventListener('click', () => {
    index = (index + 1) % movielist.length;
    video.src = movielist[index];
});

// Custom linear scroll
function linearScroll(distance, duration) {
    const start = window.scrollY;
    const startTime = performance.now();

    function animation(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        window.scrollTo(0, start + distance * progress);
        if (progress < 1) requestAnimationFrame(animation);
    }

    requestAnimationFrame(animation);
}

document.querySelector('.scroll-down').addEventListener('click', () => linearScroll(window.innerHeight, 1000));

// -------------------------
// Chatbox
// -------------------------
const chatbox = document.getElementById("chatbox");
const chatToggle = document.getElementById("chatToggle");
const chatClose = document.getElementById("chatClose");

// Toggle chat visibility
chatToggle.addEventListener("click", () => {
    const isOpen = chatbox.style.display === "flex";
    chatbox.style.display = isOpen ? "none" : "flex";
    chatToggle.classList.toggle("active", !isOpen);
});

// Close chat
chatClose.addEventListener("click", () => {
    chatbox.style.display = "none";
    chatToggle.classList.remove("active");
});

// Simple markdown parser
function parseMarkdown(text) {
    text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    text = text.replace(/\*(.*?)\*/g, "<em>$1</em>");
    text = text.replace(/^\* (.*)$/gm, "<li>$1</li>");
    if (/<li>/.test(text)) text = "<ul>" + text + "</ul>";
    return text;
}

// Send message
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
        typing.remove();

        // AI message
        const aiMsg = document.createElement("div");
        aiMsg.className = "ai-msg";
        aiMsg.innerHTML = parseMarkdown(data.reply);
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

// Send message on Enter or button click
document.getElementById("userInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});
const sendBtn = document.querySelector("#chatInput button");
if (sendBtn) sendBtn.addEventListener("click", sendMessage);

// -------------------------
// Animation observer
// -------------------------
document.addEventListener("DOMContentLoaded", () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const el = entry.target;
            if (entry.isIntersecting) {
                el.classList.remove("animate");
                void el.offsetWidth; // force reflow
                el.classList.add("animate");
            } else el.classList.remove("animate");
        });
    }, { threshold: 0.2 });

    document.querySelectorAll(".autoBlur").forEach(el => observer.observe(el));
});
