import multer from 'multer'
import path from 'path'
import { v4 as uuidv4 } from 'uuid';

// Settings
const storage = multer.diskStorage({
    destination: 'uploads',
    filename: (_, file, cb) => {
        cb(null, uuidv4() + path.extname(file.originalname))
    }
});

export default multer({
    storage,
    limits: { fileSize: 1000000, files: 1 },
    // fileFilter: async (_, file, next) => {
    //     const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    //     if (allowed.includes(file.mimetype)) {
    //       next(null, true);
    //     } else {
    //       next(null, false);
    //     };
    // }
}).single('file');
