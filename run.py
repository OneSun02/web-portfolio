import subprocess
import webbrowser
import time
import os

# Path Python của venv
venv_python = os.path.abspath("venv/Scripts/python.exe")

# Bật server FastAPI bằng uvicorn từ venv
proc = subprocess.Popen(
    [venv_python, "-m", "uvicorn", "server:app", "--reload"],
    cwd=os.getcwd()
)

# Chờ server khởi động
time.sleep(2)

# Mở frontend
frontend_path = os.path.abspath("../frontend/index.html")
webbrowser.open(f"file:///{frontend_path.replace(os.sep, '/')}")
