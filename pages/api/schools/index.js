import db, { executeQuery } from '../../../lib/db';
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
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    console.log('API route handler started');
    console.log('Request method:', req.method);
    
    if (req.method === 'POST') {
      // --- POST: Add School Data (with Image Upload) ---
      try {
        console.log('Setting up form parser');
        // Ensure the upload directory exists
        const uploadDir = path.join(process.cwd(), 'public', 'schoolImages');
        try {
          await fs.promises.mkdir(uploadDir, { recursive: true });
        } catch (mkdirError) {
          console.error('Error creating upload directory:', mkdirError);
          return res.status(500).json({ error: 'Failed to create upload directory' });
        }

        const form = new IncomingForm({
          uploadDir: uploadDir,
          keepExtensions: true,
          maxFileSize: 5 * 1024 * 1024, // 5MB limit
          filename: (name, ext, part) => {
            return `${Date.now()}-${part.originalFilename}`; 
          }
        });
        
        // Parse form data
        const { fields, files } = await new Promise((resolve, reject) => {
          form.parse(req, (err, fields, files) => {
            if (err) {
              console.error('Formidable Error:', err);
              reject(err);
              return;
            }
            resolve({ fields, files });
          });
        });

        // Extract and standardize text fields
        const schoolData = Object.fromEntries(
          Object.entries(fields).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value])
        );

        // Handle image file
        const imageFile = files.image ? (Array.isArray(files.image) ? files.image[0] : files.image) : null;
        
        if (!imageFile) {
          return res.status(400).json({ error: 'School image is required.' });
        }
        
        // Construct the public URL path for the image
        const imagePath = `/schoolImages/${path.basename(imageFile.filepath)}`;
        schoolData.image = imagePath;

        try {
          console.log('School Data:', schoolData);

          const query = `
            INSERT INTO schools (name, address, city, state, contact, image, email_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `;
          const values = [
            schoolData.name,
            schoolData.address,
            schoolData.city,
            schoolData.state, 
            schoolData.contact,
            schoolData.image,
            schoolData.email_id
          ];
          
          console.log('Query:', query);
          console.log('Values:', values);

          // Using the executeQuery helper function
          const result = await executeQuery({ query, values });
          console.log('Insert Result:', result);

          return res.status(201).json({
            message: 'School added successfully!',
            imagePath: schoolData.image
          });
        } catch (sqlError) {
          console.error('SQL Error:', sqlError);
          console.error('SQL Error Code:', sqlError.code);
          console.error('SQL Error Message:', sqlError.message);
          
          // Clean up the uploaded file if DB insertion fails
          if (imageFile.filepath) {
            fs.unlink(imageFile.filepath, (unlinkErr) => {
              if (unlinkErr) console.error('Error deleting file:', unlinkErr);
            });
          }
          
          return res.status(500).json({
            error: `Database insertion failed: ${sqlError.message}`
          });
        }
      } catch (formError) {
        console.error('Form Processing Error:', formError);
        return res.status(500).json({
          error: 'Failed to process form data'
        });
      }
    } else if (req.method === 'GET') {
      // --- GET: Fetch Schools Data ---
      try {
        const [rows] = await db.query('SELECT * FROM schools ORDER BY id DESC');
        return res.status(200).json(rows);
      } catch (error) {
        console.error('SQL Error:', error);
        return res.status(500).json({
          error: 'Failed to fetch schools data.'
        });
      }
    } else {
      // Method Not Allowed
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    // Catch any unhandled errors
    console.error('Unhandled Error:', error);
    return res.status(500).json({
      error: 'An unexpected error occurred'
    });
  }
}