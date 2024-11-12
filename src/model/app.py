from flask import Flask, jsonify
import pymongo
import joblib
import numpy as np
from textblob import TextBlob
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity
from bson import ObjectId

app = Flask(__name__)

# Load the trained model and preprocessing tools
model = joblib.load('random_forest_model.pkl')
tfidf_desc = joblib.load('tfidf_desc.pkl')
tfidf_amen = joblib.load('tfidf_amen.pkl')
tfidf_comments = joblib.load('tfidf_comments.pkl')
scaler = joblib.load('scaler.pkl')

# Connect to MongoDB
client = pymongo.MongoClient("mongodb+srv://Sanjeevi555pn:Sanjeevi@cluster0.vq9y9.mongodb.net/")
db = client["turf"]

# Function to calculate sentiment
def get_sentiment(text):
    blob = TextBlob(text)
    return blob.sentiment.polarity

# Function to get turf data with reviews
def get_turf_data_with_reviews():
    turfs_collection = db["turves"]
    reviews_collection = db["reviews"]
    bookings_collection = db["bookings"]

    turfs = turfs_collection.find({})
    turfs_data = []

    for turf in turfs:
        turf_id = turf["_id"]
        description = turf.get("description", "")
        amenities = ", ".join(turf.get("amenities", []))
        price = turf.get("pricePerHour", 0)

        # Sentiment Analysis
        description_sentiment = get_sentiment(description)

        # Reviews Data
        reviews = list(reviews_collection.find({"turf": turf_id}))
        comments = " ".join(review.get("comment", "") for review in reviews)
        comments_sentiment = get_sentiment(comments)
        averageRating = sum(review.get("rating", 0) for review in reviews) / len(reviews) if reviews else 0
        likes = sum(review.get("like", 0) for review in reviews)
        dislikes = sum(review.get("dislike", 0) for review in reviews)

        # Booking count
        booking_count = bookings_collection.count_documents({"turf": turf_id})

        # Vectorize Text Data
        amenities_vector = tfidf_amen.transform([amenities]).toarray()
        description_vector = tfidf_desc.transform([description]).toarray()
        comments_vector = tfidf_comments.transform([comments]).toarray()

        # Scale numerical features (booking_count, likes, dislikes, price, averageRating)
        numerical_features = np.array([[booking_count, likes, dislikes, price, averageRating]])
        scaled_numerical_features = scaler.transform(numerical_features)

        # Combine all features for prediction
        combined_features = np.hstack([
            amenities_vector,
            description_vector,
            comments_vector,
            scaled_numerical_features,
            [[description_sentiment, comments_sentiment]]
        ])

        # Predict the score
        predicted_score = model.predict(combined_features)[0]

        # Collect the turf data
        turfs_data.append({
            "id": str(turf_id),
            "name": turf.get("name"),
            "pricePerHour": price,
            "averageRating": averageRating,
            "reviewCount": len(reviews),
            "predicted_score": predicted_score
        })

    return turfs_data

# Route to fetch the top-ranked turfs
@app.route('/top-ranked-turfs', methods=['GET'])
def recommend_top_ranked_turfs():
    turf_data_with_reviews = get_turf_data_with_reviews()
    top_turfs = sorted(turf_data_with_reviews, key=lambda x: x['predicted_score'], reverse=True)[:5]
    print(top_turfs)
    return jsonify(top_turfs)

# Route to find similar turfs
@app.route('/similar-turfs/<turf_id>', methods=['GET'])
def find_similar_turfs(turf_id):
    # Fetch the data for the current turf
    turfs_data = get_turf_data_with_reviews()

    # Find the current turf
    current_turf = None
    for turf in turfs_data:
        if turf["id"] == turf_id:
            current_turf = turf
            break

    if not current_turf:
        return jsonify({"error": "Turf not found"}), 404

    # Extract the features for the current turf
    current_turf_features = get_turf_features_by_id(turf_id)

    # Calculate cosine similarity between the current turf and all other turfs
    similarities = []
    for turf in turfs_data:
        if turf["id"] == turf_id:  # Skip the current turf itself
            continue
        other_turf_features = get_turf_features_by_id(turf["id"])
        
        # Calculate cosine similarity between current turf and the other turf
        similarity_score = cosine_similarity(current_turf_features, other_turf_features)[0][0]
        
        similarities.append({
            "id": turf["id"],
            "name": turf["name"],
            "similarity_score": similarity_score
        })

    # Sort the turfs by similarity score in descending order and return the top 5 most similar turfs
    most_similar_turfs = sorted(similarities, key=lambda x: x['similarity_score'], reverse=True)[:5]
    print(most_similar_turfs)
    return jsonify(most_similar_turfs)

# Function to extract features for a specific turf by its ID
def get_turf_features_by_id(turf_id):
    # This function should extract the same features used for prediction for a given turf by its id.
    turfs_collection = db["turves"]
    reviews_collection = db["reviews"]
    
    turf = turfs_collection.find_one({"_id": ObjectId(turf_id)})
    if not turf:
        return None
    
    description = turf.get("description", "")
    amenities = ", ".join(turf.get("amenities", []))
    comments = " ".join(review.get("comment", "") for review in reviews_collection.find({"turf": ObjectId(turf_id)}))

    # Vectorize the text data (amenities, description, comments)
    amenities_vector = tfidf_amen.transform([amenities]).toarray()
    description_vector = tfidf_desc.transform([description]).toarray()
    comments_vector = tfidf_comments.transform([comments]).toarray()

    # Extract numerical features (booking_count, likes, dislikes, price, averageRating)
    reviews = list(reviews_collection.find({"turf": ObjectId(turf_id)}))
    booking_count = len(reviews)
    likes = sum(review.get("like", 0) for review in reviews)
    dislikes = sum(review.get("dislike", 0) for review in reviews)
    price = turf.get("pricePerHour", 0)
    averageRating = sum(review.get("rating", 0) for review in reviews) / len(reviews) if reviews else 0

    # Combine all features
    numerical_features = np.array([[booking_count, likes, dislikes, price, averageRating]])
    scaled_numerical_features = scaler.transform(numerical_features)

    # Combine all features for cosine similarity calculation
    combined_features = np.hstack([
        amenities_vector,
        description_vector,
        comments_vector,
        scaled_numerical_features
    ])

    return combined_features

if __name__ == '__main__':
    app.run(debug=True)
