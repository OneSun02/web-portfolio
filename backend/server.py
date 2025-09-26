from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import requests
import os
from dotenv import load_dotenv

# -------------------------
# Khởi tạo FastAPI
# -------------------------
app = FastAPI(title="FastAPI + Gemini Chat")

# -------------------------
# CORS (cho frontend gọi backend)
# -------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# Load .env
# -------------------------
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")
MODEL = "models/gemini-2.5-flash"
BASE_URL = "https://generativelanguage.googleapis.com/v1beta"

# -------------------------
# Serve frontend
# -------------------------
# frontend folder (relative)
frontend_path = os.path.join(os.path.dirname(__file__), "../frontend")

# Mount folder static (CSS, JS, videos, images)
app.mount("/static", StaticFiles(directory=frontend_path), name="static")

# Khi mở '/' trả về index.html
@app.get("/")
def serve_index():
    return FileResponse(os.path.join(frontend_path, "index.html"))

# -------------------------
# Request body cho chat
# -------------------------
class ChatRequest(BaseModel):
    message: str

# -------------------------
# Endpoint chat
# -------------------------
@app.post("/chat")
def chat(req: ChatRequest):
    url = f"{BASE_URL}/{MODEL}:generateContent?key={API_KEY}"

    # Context AI (luôn gửi kèm)
    system_prompt = """
    Bạn là chính là tôi Phạm Xuân Nhất, đại diện cho tôi trả lời các câu hỏi về tôi với tư cách là chính tôi (trả lời kiểu phỏng vấn).
    - Giới thiệu: "Xin chào, tôi là Nhat - Web Developer."
    - Kinh nghiệm: WordPress, HTML/CSS/JS, Flask, Django, SEO.
    - Dự án: nbtrade.com.vn, portfolio cá nhân.
    - Kỹ năng: Web dev, SEO, thiết kế giao diện.
    - Thái độ: Tự tin, thân thiện, chuyên nghiệp.
    """

    payload = {
        "contents": [
            {"role": "user", "parts": [{"text": system_prompt}]},  # context
            {"role": "user", "parts": [{"text": req.message}]}
        ]
    }

    try:
        res = requests.post(url, headers={"Content-Type": "application/json"}, json=payload)
        data = res.json()

        # Debug: in raw response
        print("🔍 Raw API response:", data)

        # Lấy reply
        candidates = data.get("candidates", [])
        if candidates and "content" in candidates[0]:
            parts = candidates[0]["content"].get("parts", [])
            reply = parts[0].get("text", "❌ Không có phản hồi") if parts else "❌ Không có phản hồi (parts rỗng)"
        else:
            reply = "❌ Không có phản hồi (không có candidates)"

        return {"reply": reply}

    except Exception as e:
        return {"reply": f"❌ Lỗi backend: {str(e)}"}
