import json
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. Load the Movie Data
with open('movies.json', 'r') as f:
    movies_data = json.load(f)

# 2. Prepare the AI Model
# Combine description and genre into a single string for analysis
descriptions = [movie['description'] + " " + movie['genre'] for movie in movies_data]

# Convert text to numbers (Vectors)
vectorizer = TfidfVectorizer(stop_words='english')
tfidf_matrix = vectorizer.fit_transform(descriptions)

# Calculate similarity (Compare every movie to every other movie)
cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

@app.get("/")
def read_root():
    return {"message": "CineMind AI is Running!"}

@app.get("/movies")
def get_movies():
    return movies_data

# The Magic AI Endpoint
@app.get("/recommend")
def recommend_movies(title: str = Query(..., description="The movie title to get recommendations for")):
    # Find the movie index
    movie_idx = next((index for (index, d) in enumerate(movies_data) if d["title"].lower() == title.lower()), None)

    if movie_idx is None:
        return {"error": "Movie not found"}

    # Calculate similarity
    sim_scores = list(enumerate(cosine_sim[movie_idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    
    # Get top 3 recommendations (skipping the first one because it is the movie itself)
    sim_scores = sim_scores[1:4]

    recommendations = []
    for i, score in sim_scores:
        recommendations.append(movies_data[i])

    return recommendations