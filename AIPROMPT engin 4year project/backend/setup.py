import os
import subprocess
import sys

print("=" * 60)
print("PromptEngine Backend Setup Script")
print("=" * 60)

# 1. Create .env file
if not os.path.exists(".env"):
    print("\n[1] Creating .env file from template...")
    with open(".env.example", "r") as f_in:
        with open(".env", "w") as f_out:
            f_out.write(f_in.read())
    print("✓ .env created (update with your database and API keys)")
else:
    print("\n[1] .env file already exists")

# 2. Install dependencies
print("\n[2] Installing Python dependencies...")
try:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
    print("✓ Dependencies installed")
except Exception as e:
    print(f"✗ Error installing dependencies: {e}")
    sys.exit(1)

# 3. Create MySQL database (optional)
print("\n[3] MySQL Database Setup")
print("Before running the backend, ensure MySQL is running and create the database:")
print("")
print("  mysql -u root -p")
print("  CREATE DATABASE promptengine_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
print("  EXIT;")
print("")
print("Then update DATABASE_URL in .env with your MySQL credentials.")
print("")

# 4. Display next steps
print("\n[4] Next Steps:")
print("  1. Update .env file with:")
print("     - DATABASE_URL (MySQL connection)")
print("     - GEMINI_API_KEY (from Google AI Studio)")
print("")
print("  2. Create MySQL database (see instructions above)")
print("")
print("  3. Run the backend server:")
print("     python main.py")
print("")
print("  4. Backend will be available at: http://127.0.0.1:8000")
print("  5. API docs: http://127.0.0.1:8000/docs")
print("")
print("=" * 60)
