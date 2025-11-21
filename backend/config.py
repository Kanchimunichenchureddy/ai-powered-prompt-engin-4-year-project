import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://root:password@localhost:3306/promptengine_db")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
# Optional: enable Raptor mini (Preview) for all clients
# Set `RAPTOR_MINI_ENABLED=True` in your .env to enable, and optionally override
# the model string with `RAPTOR_MODEL_NAME` (example: "raptor-mini-preview").
RAPTOR_MINI_ENABLED = os.getenv("RAPTOR_MINI_ENABLED", "False").lower() == "true"
RAPTOR_MODEL_NAME = os.getenv("RAPTOR_MODEL_NAME", "raptor-mini-preview")
HOST = os.getenv("HOST", "127.0.0.1")
PORT = int(os.getenv("PORT", 8000))
DEBUG = os.getenv("DEBUG", "True").lower() == "true"
