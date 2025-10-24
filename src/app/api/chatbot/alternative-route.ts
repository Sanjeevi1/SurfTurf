import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import { Turf } from "@/models/model";
import { GoogleGenerativeAI } from '@google/generative-ai';

// Alternative implementation using Google Generative AI SDK
const queryAIWithSDK = async (turfDetails: string, userQuery: string) => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyAvLduhkslIb8Gn1F0o5UoWoVoY96MWolI');
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const systemPrompt = `You are SurfTurf AI Assistant, a helpful chatbot for a sports turf booking platform. 
        You help users find and book sports turfs, answer questions about facilities, pricing, and availability.
        Be friendly, informative, and helpful. If you don't have specific information, say so politely.`;

        const combinedInput = `${systemPrompt}\n\nTurf Database Information:\n${turfDetails}\n\nUser Query: ${userQuery}`;

        const result = await model.generateContent(combinedInput);
        const response = await result.response;
        const text = response.text();

        return { text };
    } catch (error: any) {
        console.error("Error with Google Generative AI SDK:", error);
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

                // Try the SDK approach first
                const aiResponse = await queryAIWithSDK(turfDetails, message);
                if (aiResponse && aiResponse.text) {
                    responseMessage = aiResponse.text;
                } else {
                    // Fallback to direct database response
                    responseMessage = `Here are the available turfs in our system:\n\n${turfDetails}\n\nFeel free to ask me about specific turfs, pricing, or availability!`;
                }
            } catch (error) {
                console.error("Error fetching turfs:", error);
                responseMessage = 'There was an error fetching turf information.';
            }
        } else {
            // If not a turf-related query, provide general assistance
            responseMessage = `Hello! I'm the SurfTurf AI Assistant. I can help you with:
        
🏟️ **Turf Information**: Find details about available sports turfs
📅 **Booking Help**: Assist with slot booking and availability
💰 **Pricing**: Get information about turf rates and packages
📍 **Location**: Find turfs in specific areas or cities
⚽ **Sports**: Information about different sports facilities
🛠️ **Amenities**: Details about turf facilities and features

Please ask me about turfs, bookings, or any sports-related questions!`;
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
