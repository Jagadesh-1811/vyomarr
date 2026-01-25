import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Serve static files from the dist directory FIRST
// This ensures JS, CSS, images are served correctly
app.use(express.static(path.join(__dirname, 'dist'), {
    maxAge: '1d',
    setHeaders: (res, filePath) => {
        // Set correct MIME types
        if (filePath.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        } else if (filePath.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
    }
}));

// Handle SPA routing - only for non-file requests
// This catches routes like /admin/login, /dashboard, etc.
app.get('*', (req, res, next) => {
    // If request has a file extension, let it 404 naturally
    if (path.extname(req.path)) {
        return next();
    }
    // For all other routes, serve index.html for SPA routing
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Frontend server running on port ${PORT}`);
});
