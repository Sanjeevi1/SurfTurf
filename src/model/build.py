import pandas as pd
import numpy as np
from textblob import TextBlob
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import MinMaxScaler
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error,r2_score
from sklearn.model_selection import train_test_split

import joblib
import pymongo
import joblib

# Load the dataset
df_turfs = pd.read_csv("C://Users//sanjeevi//OneDrive//Desktop//synthetic_turf_data_200.csv")

# Step 1: Sentiment Analysis
def get_sentiment(text):
    blob = TextBlob(text)
    return blob.sentiment.polarity

df_turfs['description_sentiment'] = df_turfs['description'].apply(get_sentiment)
df_turfs['comments_sentiment'] = df_turfs['comments'].apply(get_sentiment)

# Step 2: TF-IDF Vectorization
tfidf_desc = TfidfVectorizer(stop_words='english')
tfidf_amen = TfidfVectorizer(stop_words='english')
tfidf_comments = TfidfVectorizer(stop_words='english')

description_matrix = tfidf_desc.fit_transform(df_turfs['description']).toarray()
amenities_matrix = tfidf_amen.fit_transform(df_turfs['amenities'].apply(lambda x: x.strip("[]").replace("'", "").replace(" ", ""))).toarray()
comments_matrix = tfidf_comments.fit_transform(df_turfs['comments']).toarray()

# Step 3: Feature Normalization
scaler = MinMaxScaler()
numerical_features = df_turfs[['booking_count', 'likes', 'dislikes', 'price', 'averageRating']].values
df_turfs[['booking_norm', 'likes_norm', 'dislikes_norm', 'price_norm', 'rating_norm']] = scaler.fit_transform(numerical_features)

# Step 4: Combine All Features
combined_features = np.hstack([
    amenities_matrix, 
    description_matrix, 
    comments_matrix, 
    df_turfs[['booking_norm', 'likes_norm', 'dislikes_norm', 'price_norm', 'rating_norm', 'description_sentiment', 'comments_sentiment']].values
])

# Step 5: Define Target Variable and Train-Test Split
df_turfs['composite_score'] = (
    0.3 * df_turfs['averageRating'] +
    0.2 * df_turfs['booking_count'] +
    0.2 * df_turfs['likes'] - 
    0.1 * df_turfs['dislikes'] +
    0.2 * df_turfs['price']
)

X_train, X_test, y_train, y_test = train_test_split(combined_features, df_turfs['composite_score'], test_size=0.2, random_state=42)

# Step 6: Train and Save Model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)
joblib.dump(model, 'random_forest_model.pkl')
joblib.dump(tfidf_desc, 'tfidf_desc.pkl')
joblib.dump(tfidf_amen, 'tfidf_amen.pkl')
joblib.dump(tfidf_comments, 'tfidf_comments.pkl')
joblib.dump(scaler, 'scaler.pkl')
