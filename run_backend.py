import sys
import os

# Automatically ensure backend folder is on the Python path
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(ROOT_DIR, "backend")

if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

if __name__ == "__main__":
    # pyrefly: ignore[missing-import]
    import uvicorn

    print("=" * 65)
    print("  Starting LabLens Backend Server")
    print("  API Base: http://127.0.0.1:8000")
    print("  Interactive Docs (Swagger): http://127.0.0.1:8000/docs")
    print("=" * 65)

    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
