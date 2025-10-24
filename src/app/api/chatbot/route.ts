import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import { Turf } from "@/models/model";
import axios from "axios";

// Function to query Grok AI for AI-based responses
const queryAI = async (turfDetails: string, userQuery: string) => {
    const GROK_API_KEY = '';
    
    if (!GROK_API_KEY) {
        console.error("GROK_API_KEY not found in environment variables");
        return null;
    }

    try {
        const systemPrompt = `You are SurfTurf AI Assistant, a helpful chatbot for a sports turf booking platform. 
        You help users find and book sports turfs, answer questions about facilities, pricing, and availability.
        Be friendly, informative, and helpful. If you don't have specific information, say so politely.
        
        Always respond in a conversational and helpful manner. Use emojis appropriately to make responses engaging.
        Focus on helping users with turf bookings, pricing, availability, and general sports facility information.`;

        const combinedInput = `${systemPrompt}\n\nTurf Database Information:\n${turfDetails}\n\nUser Query: ${userQuery}`;

        const response = await axios.post(
            'https://api.x.ai/v1/chat/completions',
            {
                model: "grok-beta",
                messages: [
                    {
                        role: "system",
                        content: systemPrompt
                    },
                    {
                        role: "user",
                        content: `Turf Database Information:\n${turfDetails}\n\nUser Query: ${userQuery}`
                    }
                ],
                temperature: 0.7,
                max_tokens: 1024,
                stream: false
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${GROK_API_KEY}`
                }
            }
        );

        if (response.data && response.data.choices && response.data.choices.length > 0) {
            const text = response.data.choices[0].message.content;
            console.log("Grok AI Response generated successfully");
            return { text };
        } else {
            console.error("No valid response from Grok API");
            return null;
        }
    } catch (error: any) {
        console.error("Error querying Grok AI:", error);
        console.error("Error details:", error.response?.data || error.message);
        return null;
    }
};

export async function POST(req: NextRequest) {
    try {
        const { message } = await req.json();
        
        if (!message || typeof message !== 'string') {
            return NextResponse.json({ 
                response: 'Please provide a valid message.' 
            }, { status: 400 });
        }

        await connect();

        // Initialize a default response
        let responseMessage = 'I am sorry, I didn\'t understand that.';

        // Check if the message relates to turfs
        if (message.toLowerCase().includes('turf') || message.toLowerCase().includes('booking') || message.toLowerCase().includes('slot') || message.toLowerCase().includes('sport')) {
            try {
                // Fetch turf details from the database
                const turfs = await Turf.find({});
                const turfDetails = turfs.map((turf) => {
                    return `
🌍 **Turf Name**: ${turf.name}
📍 **Location**: ${turf.city}
🏷️ **Category**: ${turf.turfCategory}
💵 **Price per Hour**: ₹${turf.pricePerHour}
🛠️ **Amenities**: ${Array.isArray(turf.amenities) ? turf.amenities.join(", ") : turf.amenities}
📏 **Dimensions**: Length: ${turf.dimensions?.length || 'N/A'}m, Width: ${turf.dimensions?.width || 'N/A'}m
🗺️ **Location Coordinates**: Latitude: ${turf.locationCoordinates?.coordinates?.[0] || 'N/A'}, Longitude: ${turf.locationCoordinates?.coordinates?.[1] || 'N/A'}

⏰ **Available Slots**: 
${turf.availableSlots?.map((slot: any) => {
                        return slot.slots?.map((slotDetail: any) => {
                            return `📅 Date: ${slot.date}, 🕓 Slot: ${slotDetail.startTime} - ${slotDetail.endTime}, 🏅 Max Players: ${slotDetail.maxPlayers}, Status: ${slotDetail.isBooked ? 'Booked' : 'Available'}`;
                        }).join("\n") || 'No slots available';
                    }).join("\n") || 'No available slots'}

🖼️ **Images**: ${Array.isArray(turf.images) ? turf.images.join(", ") : 'No images available'}
📜 **Description**: ${turf.description || 'No description available'}
                    `;
                }).join("\n\n");

                // Now, send the combined turf details and user query to AI
                const aiResponse = await queryAI(turfDetails, message);
                if (aiResponse && aiResponse.text) {
                    responseMessage = aiResponse.text;
                } else {
                    console.log("AI Response failed, providing fallback response");
                    responseMessage = `Based on our turf database, here are the available turfs:\n\n${turfDetails}\n\nPlease let me know if you need more specific information about any turf!`;
                }
            } catch (error) {
                console.error("Error fetching turfs:", error);
                responseMessage = 'There was an error fetching turf information.';
            }
        } else {
            // If not a turf-related query, try to get AI response for general queries
            try {
                const aiResponse = await queryAI("", message);
                if (aiResponse && aiResponse.text) {
                    responseMessage = aiResponse.text;
                } else {
                    responseMessage = `Hello! I'm the SurfTurf AI Assistant. I can help you with:
        
🏟️ **Turf Information**: Find details about available sports turfs
📅 **Booking Help**: Assist with slot booking and availability
💰 **Pricing**: Get information about turf rates and packages
📍 **Location**: Find turfs in specific areas or cities
⚽ **Sports**: Information about different sports facilities
🛠️ **Amenities**: Details about turf facilities and features

Please ask me about turfs, bookings, or any sports-related questions!`;
                }
            } catch (error) {
                console.error("Error with general AI query:", error);
                responseMessage = `Hello! I'm the SurfTurf AI Assistant. I can help you with turf bookings and sports facility information. Please ask me about turfs, availability, or pricing!`;
            }
        }

        // Return the AI response
        return NextResponse.json({ response: responseMessage });
    } catch (error) {
        console.error("Chatbot API Error:", error);
        return NextResponse.json({ 
            response: 'Sorry, I encountered an error. Please try again later.' 
        }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({ 
        message: 'SurfTurf Chatbot API is running!',
        status: 'healthy',
        endpoints: {
            POST: '/api/chatbot - Send messages to the AI assistant'
        }
    });
}