import db from '../../../lib/db';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';

// IMPORTANT: Disable Next.js default body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // --- POST: Add School Data (with Image Upload) ---
    
    // Set up formidable to handle the multipart form data
    const form = new IncomingForm({
        // Define where to store the temporary file
        uploadDir: path.join(process.cwd(), 'public', 'schoolImages'), 
        keepExtensions: true,
        maxFileSize: 5 * 1024 * 1024, // 5MB limit
        filename: (name, ext, part) => {
            // Use a unique name to prevent collisions
            return `${Date.now()}-${part.originalFilename}`; 
        }
    });
    
    // Parse the form data
    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error('Formidable Error:', err);
            return res.status(500).json({ error: 'Error processing form data.' });
        }
        
        // 1. Extract and standardize text fields
        const schoolData = Object.fromEntries(
            Object.entries(fields).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value])
        );

        // 2. Handle image file
        const imageFile = files.image ? (Array.isArray(files.image) ? files.image[0] : files.image) : null;
        
        if (!imageFile) {
             return res.status(400).json({ error: 'School image is required.' });
        }
        
        // Construct the public URL path for the image to save in the DB
        const imagePath = `/schoolImages/${path.basename(imageFile.filepath)}`;
        schoolData.image = imagePath;

        try {
            // 3. SQL Query to Insert Data
            const query = `
                INSERT INTO schools (name, address, city, state, contact, image, email_id) 
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            const values = [
                schoolData.name, schoolData.address, schoolData.city, schoolData.state, 
                schoolData.contact, schoolData.image, schoolData.email_id
            ];
            
            await db.query(query, values);

            // 4. Success Response
            res.status(201).json({ message: 'School added successfully!', imagePath: schoolData.image });

        } catch (sqlError) {
            console.error('SQL Error:', sqlError);
            // Clean up the uploaded file if DB insertion fails
            if (imageFile.filepath) {
                 fs.unlink(imageFile.filepath, (unlinkErr) => {
                    if (unlinkErr) console.error('Error deleting file:', unlinkErr);
                 });
            }
            res.status(500).json({ error: 'Database insertion failed.' });
        }
    });
  
  } else if (req.method === 'GET') {
    // --- GET: Fetch Schools Data ---
    try {
      // Fetch all fields for complete school information
      const [rows] = await db.query(
        'SELECT * FROM schools ORDER BY id DESC'
      ); 
      res.status(200).json(rows);
    } catch (error) {
      console.error('SQL Error:', error);
      res.status(500).json({ error: 'Failed to fetch schools data.' });
    }

  } else {
    // Method Not Allowed
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}