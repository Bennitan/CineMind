import json
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. Load the Movie Data
with open('movies.json', 'r') as f:
    movies_data = json.load(f)

# 2. Prepare the AI Model
# Combine description and genre into a single string for analysis
descriptions = [movie['description'] + " " + movie['genre'] + " " + movie['title'] for movie in movies_data]

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

# === NEW: Smart Search Endpoint ===
@app.get("/search")
def search_movies(query: str):
    # 1. Convert user's search text into numbers (Vector)
    query_vec = vectorizer.transform([query])

    # 2. Compare user's search vector with all movie vectors
    similarity_scores = cosine_similarity(query_vec, tfidf_matrix).flatten()

    # 3. Get the indices of the top matches
    # This sorts the scores from highest to lowest
    related_indices = similarity_scores.argsort()[::-1]

    # 4. Return top 5 matches (only if they have some similarity)
    results = []
    for i in related_indices[:5]:
        if similarity_scores[i] > 0.1:  # Filter out irrelevant results
            results.append(movies_data[i])
            
    return results

@app.get("/recommend")
def recommend_movies(title: str = Query(..., description="The movie title to get recommendations for")):
    movie_idx = next((index for (index, d) in enumerate(movies_data) if d["title"].lower() == title.lower()), None)

    if movie_idx is None:
        return {"error": "Movie not found"}

    sim_scores = list(enumerate(cosine_sim[movie_idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = sim_scores[1:4]

    recommendations = []
    for i, score in sim_scores:
        recommendations.append(movies_data[i])

    return recommendations