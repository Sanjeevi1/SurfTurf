#!/usr/bin/env python3
"""
Generate architecture diagram for SurfTurf using diagrams library.
Install: pip install diagrams
"""

try:
    from diagrams import Diagram, Cluster, Edge
    from diagrams.onprem.client import Users, Client
    from diagrams.onprem.compute import Server
    from diagrams.onprem.database import Mongodb
    from diagrams.onprem.network import Internet
    from diagrams.programming.framework import React, Nextjs
    from diagrams.programming.language import Python
    from diagrams.generic.storage import Storage
    from diagrams.onprem.inmemory import Redis
    from diagrams.saas.chat import Chat
    from diagrams.generic.compute import Rack
    from diagrams.onprem.analytics import Spark
    from diagrams.generic.device import Mobile
    from diagrams.custom import Custom
except ImportError:
    print("Please install diagrams library: pip install diagrams")
    print("Also install graphviz: https://graphviz.org/download/")
    exit(1)

def create_architecture_diagram():
    with Diagram("SurfTurf Architecture", filename="architecture-diagram", show=False, direction="TB"):
        
        # Client Layer
        with Cluster("Client Layer"):
            web = Client("Web Browser")
            customer = Users("Customer")
            owner = Users("Owner")
            admin = Users("Admin")
        
        # Next.js Application
        with Cluster("Next.js Application"):
            nextjs = Nextjs("Next.js 15\nApp Router")
            middleware = Server("Middleware\nAuth & Routes")
            pages = React("Pages")
            api = Server("API Routes")
        
        # Frontend Components
        with Cluster("Frontend Components"):
            navbar = React("Navbar")
            hero = React("Hero/Search")
            turf_card = React("Turf Cards")
            booking_ui = React("Booking UI")
            chatbot_ui = React("Chatbot UI")
            filter_comp = React("Filter")
            review_comp = React("Review")
        
        # API Endpoints
        with Cluster("API Endpoints"):
            auth_api = Server("Auth APIs")
            turf_api = Server("Turf APIs")
            booking_api = Server("Booking APIs")
            payment_api = Server("Payment APIs")
            review_api = Server("Review APIs")
            recommend_api = Server("Recommend API")
            chatbot_api = Server("Chatbot API")
            admin_api = Server("Admin APIs")
            upload_api = Server("Upload API")
        
        # Business Logic
        with Cluster("Business Logic"):
            auth_logic = Server("JWT Auth\nbcryptjs")
            validation = Server("Validation")
            mailer = Server("Email Service")
            multer = Server("File Upload")
        
        # Data Layer
        with Cluster("Data Layer"):
            mongo = Mongodb("MongoDB")
            models = Storage("Data Models\nUser, Turf, Booking\nReview, Payment")
        
        # External Services
        with Cluster("External Services"):
            razorpay = Server("Razorpay\nPayment Gateway")
            uploadthing = Storage("UploadThing\nFile Storage")
            grok_ai = Chat("Grok AI\nOpenAI")
            python_ml = Python("Python ML\nService")
        
        # ML Models
        with Cluster("ML Models"):
            rf_model = Spark("Random Forest\nModel")
            tfidf_desc = Storage("TF-IDF Desc")
            tfidf_amen = Storage("TF-IDF Amen")
            tfidf_comments = Storage("TF-IDF Comments")
            scaler = Storage("Scaler")
        
        # ML Processing
        with Cluster("ML Processing"):
            sentiment = Spark("Sentiment\nAnalysis")
            feature_eng = Spark("Feature\nEngineering")
            prediction = Spark("Score\nPrediction")
        
        # Connections
        web >> nextjs
        customer >> pages
        owner >> pages
        admin >> pages
        
        nextjs >> middleware
        middleware >> pages
        middleware >> api
        pages >> [navbar, hero, turf_card, booking_ui, chatbot_ui, filter_comp, review_comp]
        
        pages >> api
        api >> [auth_api, turf_api, booking_api, payment_api, review_api, 
                recommend_api, chatbot_api, admin_api, upload_api]
        
        auth_api >> auth_logic
        auth_api >> validation
        turf_api >> validation
        booking_api >> validation
        review_api >> validation
        upload_api >> multer
        
        auth_api >> models
        turf_api >> models
        booking_api >> models
        review_api >> models
        admin_api >> models
        models >> mongo
        
        payment_api >> razorpay
        upload_api >> uploadthing
        chatbot_api >> grok_ai
        recommend_api >> python_ml
        
        python_ml >> sentiment
        python_ml >> feature_eng
        python_ml >> prediction
        feature_eng >> [tfidf_desc, tfidf_amen, tfidf_comments]
        prediction >> rf_model
        prediction >> scaler
        python_ml >> mongo
        
        chatbot_api >> mongo
        chatbot_ui >> chatbot_api

if __name__ == "__main__":
    print("Generating architecture diagram...")
    create_architecture_diagram()
    print("Diagram generated as 'architecture-diagram.png'")

