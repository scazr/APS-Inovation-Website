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
            .withMessage('Nome é necessário.')
            .bail()
            .isLength({ max: 100 })
            .withMessage('Nome não pode exceder 100 caracteres.')
            .bail()
            .matches(/^[a-zÀ-ÿ .'-]+$/i)
            .withMessage('Nome pode conter apenas letras, espaços, hífens e apostrofes.')
            .bail()
            .matches(/\s+/)
            .withMessage('Precisa conter nome e sobrenome'),
        body('email')
            .trim()
            .isEmail({ require_tld: false })
            .withMessage('E-mail deve ser um formato válido.')
            .bail()
            .isLength({ max: 254 })
            .withMessage('E-mail não pode exceder 254 caracteres.'),
        body('primaryPhone')
            .notEmpty()
            .withMessage('Ao menos um telefone é necessário.')
            .bail()
            .isLength({ max: 50 })
            .withMessage('Telefone não pode exceder 50 caracteres.')
            .bail()
            .matches(/^\(\d{2}\) \d{4,5}-\d{4}$/)
            .withMessage('Telefone deve seguir o formato (XX) XXXXX-XXXX.'),
        body('secondaryPhone')
            .isLength({ max: 50 })
            .withMessage('Telefone não pode exceder 50 caracteres.')
            .bail()
            .matches(/^(\(\d{2}\) \d{4,5}-\d{4})?$/)
            .withMessage('Telefone deve seguir o formato (XX) XXXXX-XXXX.'),
        body('occupation-option')
            .notEmpty()
            .withMessage('Uma ocupação deve ser selecionada.'),
        body('college')
            .trim()
            .notEmpty()
            .withMessage('Precisa conter uma faculdade em curso.')
            .bail()
            .isLength({ max: 150 })
            .withMessage('Nome da faculdade não pode exceder 150 caractéres.')
            .bail()
            .matches(/^[a-zÀ-ÿ0-9 .'\-&]+$/i)
            .withMessage('Nome da faculdade pode conter apenas letras, espaços, hífens e apostrofes.'),
            
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
            return res.status(400).send({ message: 'Um currículo deve ser anexado.' });
        }
        
        if (req.file && req.file.size > 5 * 1024 * 1024) {
            return res.status(400).json({ message: 'O currículo deve ter um tamanho máximo de 5MB.' })
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