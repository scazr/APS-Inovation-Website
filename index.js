const multer = require('multer');
const { body, validationResult } = require('express-validator');
const express = require('express');
const app = express();

const path = require('path');   
const publicPath = path.join(__dirname, 'public');
const PORT = 8080; // Set localhost port

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(publicPath));
app.set('view engine', 'ejs');

const upload = multer({
    storage: multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, 'uploads/');
        },
        filename: function(req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname)
        },
    }),
}); 

app.get('/', function(req, res) {
    res.sendFile(path.join(publicPath, 'index.html'));
});

app.get('/form', function(req, res) {
    const maxYearsToGraduate = 5 // Tempo máximo tolerado para a formação do estágiário: Até 5 anos a partir momento atual
    const internAgeLimit = 60 // Idade máxima disponível para um estagiário declarar, qualquer data anterior a 60 anos do momento atual estará indisponível no campo
    
    const curDate = new Date();
    const minDate = new Date(curDate.getFullYear() - internAgeLimit, 0, 1); // Data mínima que pode ser inserida no formulário: Até a idade máxima tolerada (definido em internAgeLimit)
    const maxDate = new Date(curDate.getFullYear() + maxYearsToGraduate, 11, 31);  // Data máxima que pode ser inserida: Até o tempo máximo tolerado para conclusão do estágio (definido em maxYearsToGraduate)
    
    const formatDate = (date) => date.toISOString().split('T')[0];
    
    // console.log(formatDate(minDate))
    res.render(path.join(publicPath, 'form'), {minDate: formatDate(minDate), curDate: formatDate(curDate), maxDate: formatDate(maxDate)});
    // res.sendFile(path.join(publicPath, 'form.html'));
});

app.post(
    '/submit-form',
    upload.single('resume'),
    
    [
        body('name')
            .trim()
            .notEmpty()
            .withMessage('Name is required.')
            .matches(/^[a-zÀ-ÿ .'-]+$/i)
            .withMessage('Name can only contain letters, spaces, hyphens, and apostrophes.')
            .matches(/.+ .+/)
            .withMessage('Precisa conter nome e sobrenome'),
        body('email')
            .trim()
            .isEmail()
            .withMessage('Invalid email format'),
        body('primaryPhone')
            .notEmpty()
            .withMessage('Primary phone is required')
            .matches(/^\(\d{2}\) \d{4,5}-\d{4}$/)
            .withMessage('Primary phone must follow the format (XX) XXXXX-XXXX.'),
        body('occupation-option')
            .notEmpty()
            .withMessage('Occupation must be selected.'),
    ],
    
    (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log('ERROR:', errors);
            console.log('error.param:', errors.param);
            // Return validation errors
            return res.status(400).json({
                message: 'Validation errors occurred.',
                errors: errors.array().map((error) => ({
                    field: error.path,
                    message: error.msg
                })),
            });
        }

        const { name, occupation, college, email, primaryPhone, secondaryPhone } = req.body;
        const resume = req.file;

        if (!resume) {
            return res.status(400).send({ message: 'Resume file is required.' });
        }

        console.log('Form data:', JSON.stringify(req.body));
        // console.log('Uploaded file:', resumeFile);

        res.status(200).send({
            message: 'Form submitted successfully!',
            data: {
            name,
            occupation,
            college,
            email,
            primaryPhone,
            secondaryPhone,
            resume: resume.filename,
            },
        });
    }
);

// Start server on http://localhost:<PORT>
app.listen(PORT, function() {
    console.log(`Server running on http://localhost:${PORT}`);
});