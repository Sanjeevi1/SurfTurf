import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import { Turf } from "@/models/model";

// Function to generate time slots (10 slots of 1 hour each)
const generateTimeSlots = () => {
    const slots = [];
    const startHour = 6; // Starting from 6 AM
    const endHour = 16; // Ending at 4 PM (10 slots)
    
    for (let hour = startHour; hour < endHour; hour++) {
        const startTime = `${hour.toString().padStart(2, '0')}:00`;
        const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
        
        slots.push({
            startTime,
            endTime,
            maxPlayers: 10,
            isBooked: false
        });
    }
    
    return slots;
};

// Function to generate dates for next 7 days
const generateDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        date.setHours(0, 0, 0, 0); // Reset time to start of day
        
        dates.push(date);
    }
    
    return dates;
};

export async function POST(req: NextRequest) {
    try {
        console.log('🚀 Starting slot seeding process...');
        
        // Connect to database
        await connect();
        console.log('✅ Connected to database');
        
        // Get all turfs
        const turfs = await Turf.find({});
        console.log(`📊 Found ${turfs.length} turfs`);
        
        if (turfs.length === 0) {
            return NextResponse.json({ 
                message: 'No turfs found in database',
                success: false 
            }, { status: 404 });
        }
        
        // Generate dates and slots
        const dates = generateDates();
        const timeSlots = generateTimeSlots();
        
        console.log(`📅 Generated ${dates.length} dates`);
        console.log(`⏰ Generated ${timeSlots.length} time slots per day`);
        
        const updateResults = [];
        
        // Update each turf
        for (const turf of turfs) {
            console.log(`🔄 Processing turf: ${turf.name}`);
            
            // Create available slots for each date
            const availableSlots = dates.map(date => ({
                date: date,
                slots: timeSlots
            }));
            
            // Update the turf with new slots
            const updateResult = await Turf.findByIdAndUpdate(
                turf._id,
                { 
                    $set: { 
                        availableSlots: availableSlots 
                    } 
                },
                { new: true }
            );
            
            updateResults.push({
                turfId: turf._id,
                turfName: turf.name,
                slotsCreated: dates.length * timeSlots.length
            });
            
            console.log(`✅ Updated slots for turf: ${turf.name}`);
        }
        
        console.log('🎉 Slot seeding completed successfully!');
        
        return NextResponse.json({
            message: 'Slot seeding completed successfully!',
            success: true,
            data: {
                turfsUpdated: turfs.length,
                datesGenerated: dates.length,
                slotsPerDay: timeSlots.length,
                totalSlotsPerTurf: dates.length * timeSlots.length,
                totalSlotsCreated: turfs.length * dates.length * timeSlots.length,
                updateResults: updateResults
            }
        });
        
    } catch (error: any) {
        console.error('❌ Error during slot seeding:', error);
        return NextResponse.json({ 
            message: 'Error during slot seeding',
            success: false,
            error: error.message 
        }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({
        message: 'Slot Seeding API',
        endpoints: {
            POST: '/api/admin/seed-slots - Seed slots for all turfs'
        },
        description: 'This endpoint creates new slots for all turfs for the next 7 days with 10 one-hour slots each (6 AM to 4 PM)'
    });
}
