import { connect } from '@/dbconfig/dbconfig';
import Turf from '@/models/turfModel';
import multer from 'multer';
import nextConnect from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

// Connect to the database
connect();

// Ensure 'uploads' directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: (arg0: null, arg1: string) => void) => {
    cb(null, uploadDir);
  },
  filename: (req: any, file: { originalname: any; }, cb: (arg0: null, arg1: string) => void) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Middleware setup with next-connect
const apiRoute = nextConnect<NextApiRequest, NextApiResponse>({
  onError(error: { message: any; }, req: any, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error: string; }): void; new(): any; }; }; }) {
    res.status(500).json({ error: `Something went wrong: ${error.message}` });
  },
  onNoMatch(req: { method: any; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error: string; }): void; new(): any; }; }; }) {
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  },
});

apiRoute.use(upload.single('image'));

apiRoute.post(async (req: { body: { name: any; category: any; location: any; address: any; characteristics: any;rate: any; slots: any; size: any; }; file: { path: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message?: string; success?: boolean; savedTurf?: any; error?: any; }): void; new(): any; }; }; }) => {
  try {
    // Extract body fields and the uploaded image
    const { name, category, location, address, characteristics, slots, size ,rate} = req.body;

    // Create a new Turf document using the parsed data
    const newTurf = new Turf({
      name,
      category,
      image: req.file.path, // Store the path of the uploaded image
      size,
      location,
      address,
      characteristics,
      rate,
      slots: JSON.parse(slots), // Assuming slots are sent as a JSON string
    });

    // Save the new Turf document to the database
    const savedTurf = await newTurf.save();
    console.log(savedTurf);

    res.status(200).json({
      message: 'Turf created',
      success: true,
      savedTurf,
    });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disable Next.js body parsing to allow Multer to handle it
  },
};
<LabelInputContainer className="mb-4">
          <Label htmlFor="image">Image</Label>
          <input
            id="image"
            type="file"
            accept="image/*"
            className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-violet-50 file:text-violet-700
            hover:file:bg-violet-100"
            onChange={handleFileChange}
          />
        </LabelInputContainer>
