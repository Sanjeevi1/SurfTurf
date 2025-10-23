# 🏟️ Turf Booking Platform

A full-featured turf booking platform where users can search, filter, and book sports turfs with real-time slot management, concurrency control, and intelligent turf recommendations powered by Flask.


# 🏟️ Turf Booking Platform

![Banner](https://i.postimg.cc/nrdrppS4/Whats-App-Image-2025-06-22-at-17-59-34-f1064223.jpg)
![Banner](https://i.postimg.cc/9MYzgGGN/Whats-App-Image-2025-06-22-at-17-58-55-0626716f.jpg)
![Admin Dashboard](https://i.postimg.cc/kR6XhRxn/Whats-App-Image-2025-06-22-at-18-00-09-125f71cc.jpg)
![Search](https://i.postimg.cc/WDNpcHMY/Whats-App-Image-2025-06-22-at-17-58-30-8b81dd86.jpg)
![Booking 1](https://i.postimg.cc/G89cHTgk/Whats-App-Image-2025-06-22-at-17-58-55-0626716f.jpg)
![Booking 2](https://i.postimg.cc/PpcdZf00/Whats-App-Image-2025-06-22-at-17-59-10-13d94c18.jpg)
![Recommendations](https://i.postimg.cc/GTydjwCt/Whats-App-Image-2025-06-22-at-17-59-34-f1064223.jpg)
![Owner Dashboard](https://i.postimg.cc/VJBsT8bb/Whats-App-Image-2025-06-22-at-17-59-38-536b8c94.jpg)

## 🚀 Features

### 👤 User Module
- Sign up, login, and manage profile
- Search and filter turfs by location, type, rating, etc.
- View turf details and book available slots
- Payment integration for slot booking
- View recommended turfs (based on rating, views, past activity)
- View similar turfs on turf detail page

### 🧑‍💼 Turf Owner Module
- View assigned turfs
- Create weekly (7-day) slot batches
- Lock/unlock specific slots (for maintenance or events)
- View user bookings for their turf(s)

### 🛠️ Admin Module
- Create, edit, or delete turfs
- Assign turfs to turf owners
- View all bookings and turf stats

### 🔒 Concurrency-Controlled Bookings
- Ensures no two users can book the same slot at the same time
- Slot is locked immediately upon booking confirmation

---

## 🧠 Intelligent Recommendations

A Flask microservice is used to provide:
- **Recommended Turfs** for each user based on:
  - Ratings
  - Views
  - Past bookings
  - User click behavior
- **Similar Turfs** shown on each turf detail page

---

## 🧰 Tech Stack

  -Next Js
  -React
  -Flask
  -
