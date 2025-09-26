import subprocess
import webbrowser
import time

# Chạy uvicorn server trong background
subprocess.Popen(["uvicorn", "server:app", "--reload"])

# Chờ server lên (khoảng 2 giây)
time.sleep(2)

# Mở index.html
webbrowser.open("index.html")  # hoặc link tuyệt đối nếu không cùng thư mục
