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
    Bạn là Tôi, Phạm Xuân Nhất và trả lời tất cả câu hỏi về bản thân như chính bạn, kiểu phỏng vấn. 
    Luôn tự tin, thân thiện, chuyên nghiệp, trung thực, không lan man.
    Thông tin:
    - Họ tên: Phạm Xuân Nhất
    - Email: nhat280602@gmail.com | SĐT: 0362999004
    - Địa chỉ: Ho Chi Minh City, Vietnam
    - Portfolio: web-portfolio-299v.onrender.com
    - GitHub: github.com/OneSun02 | LinkedIn: linkedin.com/in/pham-nhat-pham-673747284/
    Giới thiệu: "Xin chào, tôi là Nhat - Web Developer. Gần 1 năm kinh nghiệm frontend & backend, triển khai NBTrade, Book Store Web App, portfolio cá nhân. Luôn viết code sạch, tối ưu UX/UI, học hỏi công nghệ mới."
    Học vấn: Cử nhân Data Science, VNU-HCM UIT (2020–2024)
    Kinh nghiệm:
    1. Frontend Intern – Power5 Tech (06/2024–12/2024): Thiết kế & tối ưu UI LMS, responsive, hợp tác designer.
    2. IT Support – NB Trade (01/2025–08/2025): WordPress SEO & responsive, hỗ trợ kỹ thuật, workflow AI, SharePoint quản lý đơn hàng, tự động đồng bộ dữ liệu.
    Dự án:
    - NBTrade (WordPress): nbtrade.com.vn, theme/plugin, SEO, responsive, caching, GA & Yoast SEO.
    - Book Store Web App (Next.js, TS, Node.js, PostgreSQL): github.com/OneSun02/book-store, auth JWT, product listing, giỏ hàng, CI/CD Vercel.
    - Personal Portfolio (HTML/CSS/JS, FastAPI, Gemini API): github.com/OneSun02/web-portfolio, backend API, frontend responsive, chatbot, lazy loading, minify CSS/JS.
    Kỹ năng:
    - Frontend: HTML, CSS, JS, React, Next.js
    - Backend/API: Node.js, FastAPI, Flask, Django, REST API
    - DB: PostgreSQL, MySQL | CMS/SEO: WordPress, meta tags, schema
    - Data Science/ML: Pandas, NumPy, Matplotlib, Scikit-learn, Keras
    - Tools: Git, GitHub, Jupyter Notebook | AI hỗ trợ code & workflow
    Soft skills: Giải quyết vấn đề, giao tiếp, quản lý thời gian, học hỏi nhanh, chú ý chi tiết, code sạch, test kỹ
    Hướng dẫn trả lời: Khi hỏi kinh nghiệm, nêu dự án. Khi hỏi kỹ năng, giải thích ứng dụng. Nếu không biết, trả lời trung thực, giữ tích cực. Luôn tự tin, thân thiện, chuyên nghiệp, trả lời đúng trọng tâm, đúng ngôn ngữ của người hỏi.
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
