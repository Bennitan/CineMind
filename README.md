# 🎬 CineMind AI - Smart Movie Recommender

**CineMind** is a full-stack AI application that recommends movies based on content similarity and semantic search. Unlike basic keyword search, CineMind uses **Natural Language Processing (NLP)** to understand the user's intent (e.g., searching for *"scary hotel"* instantly finds *The Shining*).

## 🚀 Key Features

* **🧠 AI-Powered Recommendations:** Uses **Scikit-Learn** to calculate the mathematical similarity between movies based on their plot descriptions and genres.
* **🔍 Semantic Search:** Users can search by "vibe" or description. The system vectorizes the user's query and finds the closest matching movie plots using Cosine Similarity.
* **⚡ Modern UI:** Built with **React 18 + Vite** for blazing fast performance and **Framer Motion** for smooth, professional animations.
* **📡 High-Performance Backend:** A lightweight **FastAPI** server that handles data processing and machine learning inference in real-time.

## 🛠️ Tech Stack

### **Frontend (The Face)**
* **React.js** (Component-based UI)
* **Vite** (Next-gen build tool)
* **Framer Motion** (Animation library)
* **Lucide React** (Icons)

### **Backend (The Brain)**
* **Python 3.10+**
* **FastAPI** (API Framework)
* **Scikit-Learn** (Machine Learning Library)
* **Pandas & NumPy** (Data Manipulation)
* **Uvicorn** (ASGI Server)

---

## ⚙️ How to Run Locally

Follow these steps to set up CineMind on your own machine.

### **1. Clone the Repository**
```bash
git clone [https://github.com/YOUR_USERNAME/CineMind.git](https://github.com/YOUR_USERNAME/CineMind.git)
cd CineMind