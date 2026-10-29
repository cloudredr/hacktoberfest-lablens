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

    port = int(os.environ.get("PORT", sys.argv[1] if len(sys.argv) > 1 else 8088))

    print("=" * 65)
    print(f"  Starting LabLens Backend Server on port {port}")
    print(f"  API Base: http://127.0.0.1:{port}")
    print(f"  Interactive Docs (Swagger): http://127.0.0.1:{port}/docs")
    print("=" * 65)

    uvicorn.run("app.main:app", host="127.0.0.1", port=port, reload=True)
