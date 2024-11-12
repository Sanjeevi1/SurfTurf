import pymongo
import joblib
import numpy as np
from textblob import TextBlob
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import MinMaxScaler
from bson import ObjectId

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

        # Scale numerical features
        numerical_features = scaler.transform([[booking_count, likes, dislikes, price, averageRating]])

        # Combine all features for prediction
        combined_features = np.hstack([
            amenities_vector,
            description_vector,
            comments_vector,
            numerical_features,
            [[description_sentiment, comments_sentiment]]
        ])

        # Predict the score
        predicted_score = model.predict(combined_features)[0]

        # Collect the turf data
        turfs_data.append({
            "turf_id": turf_id,
            "description": description,
            "amenities": amenities,
            "comments": comments,
            "averageRating": averageRating,
            "booking_count": booking_count,
            "likes": likes,
            "dislikes": dislikes,
            "price": price,
            "predicted_score": predicted_score
        })

    return turfs_data
# Fetch, sort, and display the top turfs
turf_data_with_reviews = get_turf_data_with_reviews()
top_turfs = sorted(turf_data_with_reviews, key=lambda x: x['predicted_score'], reverse=True)[:10]

# Display the top turfs
for idx, turf in enumerate(top_turfs, 1):
    print(f"Rank {idx}:")
    print(f"Turf ID: {turf['turf_id']}")
    print(f"Predicted Score: {turf['predicted_score']:.2f}")
    print(f"Description: {turf['description']}")
    print(f"Amenities: {turf['amenities']}")
    print(f"Average Rating: {turf['averageRating']}")
    print(f"Booking Count: {turf['booking_count']}")
    print(f"Likes: {turf['likes']}, Dislikes: {turf['dislikes']}")
    print(f"Price per Hour: {turf['price']}")
    print()
