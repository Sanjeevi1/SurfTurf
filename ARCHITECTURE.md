# SurfTurf Architecture Diagram

## System Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        WEB[Web Browser]
        CUSTOMER[Customer Interface]
        OWNER[Owner Interface]
        ADMIN[Admin Interface]
    end

    subgraph "Next.js Application Layer"
        NEXT[Next.js 15 App Router]
        MIDDLEWARE[Middleware<br/>Auth & Route Protection]
        PAGES[Pages]
        API[API Routes]
    end

    subgraph "Frontend Components"
        NAV[Navbar]
        HERO[Hero/Search]
        TURF_CARD[Turf Cards]
        BOOKING[Booking UI]
        CHATBOT[Chatbot UI]
        FILTER[Filter Components]
        REVIEW[Review Components]
    end

    subgraph "API Endpoints"
        AUTH_API[Auth APIs<br/>/api/users/login<br/>/api/users/signup]
        TURF_API[Turf APIs<br/>/api/turf<br/>/api/turf/[id]]
        BOOKING_API[Booking APIs<br/>/api/book<br/>/api/bookings]
        PAYMENT_API[Payment APIs<br/>/api/createOrder<br/>/api/verifyOrder]
        REVIEW_API[Review APIs<br/>/api/review]
        RECOMMEND_API[Recommend API<br/>/api/recommend]
        CHATBOT_API[Chatbot API<br/>/api/chatbot]
        ADMIN_API[Admin APIs<br/>/api/admin/*]
        UPLOAD_API[Upload API<br/>/api/uploadthing]
    end

    subgraph "Business Logic Layer"
        AUTH_LOGIC[JWT Authentication<br/>bcryptjs]
        VALIDATION[Validation Utils]
        MAILER[Email Service]
        MULTER[File Upload Config]
    end

    subgraph "Data Layer"
        MONGO[(MongoDB<br/>Mongoose)]
        MODELS[Data Models<br/>User, Turf, Booking<br/>Review, Payment, SavedTurf]
    end

    subgraph "External Services"
        RAZORPAY[Razorpay<br/>Payment Gateway]
        UPLOADTHING[UploadThing<br/>File Storage]
        GROK_AI[Grok AI / OpenAI<br/>Chatbot Service]
        PYTHON_ML[Python ML Service<br/>Flask/FastAPI]
    end

    subgraph "ML Models"
        RF_MODEL[Random Forest Model<br/>random_forest_model.pkl]
        TFIDF_DESC[TF-IDF Description<br/>tfidf_desc.pkl]
        TFIDF_AMEN[TF-IDF Amenities<br/>tfidf_amen.pkl]
        TFIDF_COMMENTS[TF-IDF Comments<br/>tfidf_comments.pkl]
        SCALER[MinMax Scaler<br/>scaler.pkl]
    end

    subgraph "ML Processing"
        SENTIMENT[Sentiment Analysis<br/>TextBlob]
        FEATURE_ENG[Feature Engineering<br/>TF-IDF Vectorization]
        PREDICTION[Score Prediction]
    end

    %% Client to Application
    WEB --> NEXT
    CUSTOMER --> PAGES
    OWNER --> PAGES
    ADMIN --> PAGES

    %% Application Flow
    NEXT --> MIDDLEWARE
    MIDDLEWARE --> PAGES
    MIDDLEWARE --> API
    PAGES --> FRONTEND_COMPONENTS[Frontend Components]

    %% Frontend Components
    FRONTEND_COMPONENTS --> NAV
    FRONTEND_COMPONENTS --> HERO
    FRONTEND_COMPONENTS --> TURF_CARD
    FRONTEND_COMPONENTS --> BOOKING
    FRONTEND_COMPONENTS --> CHATBOT
    FRONTEND_COMPONENTS --> FILTER
    FRONTEND_COMPONENTS --> REVIEW

    %% API Routes
    PAGES --> API
    API --> AUTH_API
    API --> TURF_API
    API --> BOOKING_API
    API --> PAYMENT_API
    API --> REVIEW_API
    API --> RECOMMEND_API
    API --> CHATBOT_API
    API --> ADMIN_API
    API --> UPLOAD_API

    %% Business Logic
    AUTH_API --> AUTH_LOGIC
    AUTH_API --> VALIDATION
    TURF_API --> VALIDATION
    BOOKING_API --> VALIDATION
    REVIEW_API --> VALIDATION
    UPLOAD_API --> MULTER

    %% Data Access
    AUTH_API --> MODELS
    TURF_API --> MODELS
    BOOKING_API --> MODELS
    REVIEW_API --> MODELS
    ADMIN_API --> MODELS
    MODELS --> MONGO

    %% External Services
    PAYMENT_API --> RAZORPAY
    UPLOAD_API --> UPLOADTHING
    CHATBOT_API --> GROK_AI
    RECOMMEND_API --> PYTHON_ML

    %% ML Service Flow
    PYTHON_ML --> SENTIMENT
    PYTHON_ML --> FEATURE_ENG
    PYTHON_ML --> PREDICTION
    FEATURE_ENG --> TFIDF_DESC
    FEATURE_ENG --> TFIDF_AMEN
    FEATURE_ENG --> TFIDF_COMMENTS
    PREDICTION --> RF_MODEL
    PREDICTION --> SCALER
    PYTHON_ML --> MONGO

    %% Chatbot Flow
    CHATBOT_API --> MONGO
    CHATBOT --> CHATBOT_API

    style NEXT fill:#0070f3
    style MONGO fill:#47a248
    style RAZORPAY fill:#3395ff
    style UPLOADTHING fill:#3b82f6
    style GROK_AI fill:#10b981
    style PYTHON_ML fill:#ff6b6b
    style RF_MODEL fill:#f59e0b
```

## Component Details

### Frontend Layer
- **Next.js 15** with App Router
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Hot Toast** for notifications

### Authentication & Authorization
- **JWT** tokens stored in cookies
- **bcryptjs** for password hashing
- **Middleware** for route protection
- Roles: `user`, `owner`, `admin`

### Data Models
- **User**: Authentication, roles, profile
- **Turf**: Turf details, slots, pricing, location
- **Booking**: User bookings, time slots, payment status
- **Review**: Ratings, comments, likes/dislikes
- **Payment**: Transaction records
- **SavedTurf**: User favorites

### External Integrations
1. **Razorpay**: Payment processing
2. **UploadThing**: Image/file uploads
3. **Grok AI / OpenAI**: AI-powered chatbot
4. **Python ML Service**: Recommendation engine

### ML Recommendation System
- **Random Forest Regressor** for score prediction
- **TF-IDF** vectorization for text features
- **Sentiment Analysis** using TextBlob
- Features: amenities, description, reviews, ratings, booking count, price

### Key Features
- Turf search and filtering
- Slot-based booking system
- Payment integration
- Review and rating system
- AI chatbot for customer support
- ML-based recommendations
- Admin dashboard
- Owner management portal


