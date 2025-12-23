from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# This allows your React Frontend to talk to this Python Backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # This is your React app's address
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# This is our fake database for now
movies_db = [
    {"id": 1, "title": "Inception", "genre": "Sci-Fi", "rating": 8.8},
    {"id": 2, "title": "The Dark Knight", "genre": "Action", "rating": 9.0},
    {"id": 3, "title": "Interstellar", "genre": "Sci-Fi", "rating": 8.6},
    {"id": 4, "title": "Parasite", "genre": "Thriller", "rating": 8.6},
    {"id": 5, "title": "Avengers: Endgame", "genre": "Action", "rating": 8.4},
]

@app.get("/")
def read_root():
    return {"message": "Welcome to the CineMind API!"}

@app.get("/movies")
def get_movies():
    return movies_db