from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import os
from dotenv import load_dotenv

# Tạo app FastAPI
app = FastAPI()

# Cho phép frontend (index.html) gọi backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# load .env
load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
MODEL = "models/gemini-2.5-flash"
BASE_URL = "https://generativelanguage.googleapis.com/v1beta"

# Request body
class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
def chat(req: ChatRequest):
    url = f"{BASE_URL}/{MODEL}:generateContent?key={API_KEY}"

    # 🟢 Chèn thông tin cá nhân ở đây
    system_prompt = """
    Bạn là chính là tôi Phạm Xuân Nhất, đại diện cho tôi trả lời các câu hỏi về tôi với tư cách là chính tôi( trả lời theo kiểu phỏng vấn).
    - Giới thiệu bản thân: "Xin chào, tôi là Nhat - một Web Developer."
    - Kinh nghiệm: Xây dựng website WordPress, HTML/CSS/JS, Flask, Django, SEO.
    - Dự án: nbtrade.com.vn, portfolio cá nhân.
    - Kỹ năng: Web dev, SEO, thiết kế giao diện.
    - Thái độ: Tự tin, thân thiện, chuyên nghiệp.
    """

    payload = {
        "contents": [
            {"role": "user", "parts": [{"text": system_prompt}]},  # luôn gửi context
            {"role": "user", "parts": [{"text": req.message}]}
        ]
    }

    try:
        res = requests.post(url, headers={"Content-Type": "application/json"}, json=payload)
        data = res.json()

        # 🔍 Debug: In toàn bộ response từ API
        print("🔍 Raw API response:", data)

        candidates = data.get("candidates", [])
        if candidates and "content" in candidates[0]:
            parts = candidates[0]["content"].get("parts", [])
            if parts:
                reply = parts[0].get("text", "❌ Không có phản hồi (parts rỗng)")
            else:
                reply = "❌ Không có phản hồi (không có parts)"
        else:
            reply = "❌ Không có phản hồi (không có candidates)"

        return {"reply": reply}

    except Exception as e:
        return {"reply": f"❌ Lỗi backend: {str(e)}"}
