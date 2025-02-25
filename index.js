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
    
    res.render(path.join(publicPath, 'form'), {minDate: formatDate(minDate), curDate: formatDate(curDate), maxDate: formatDate(maxDate)});
});

const rateLimit = require('express-rate-limit');

const formLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: "Muitas submissões já realizadas. Tente novamente mais tarde." },
    header: true,
})
const parsePhoneNumberFromString = require('libphonenumber-js');
const dayjs = require('dayjs');
const { error } = require('console');
const { cache } = require('ejs');
app.post(
    '/submit-form',
    formLimiter,
    upload.single('resume'),    
    
    [
        body('name')
            .trim()
            .notEmpty().withMessage('Nome é necessário.')
            .isLength({ max: 30 }).withMessage('Nome não pode exceder 30 caracteres.')
            .matches(/^[a-zÀ-ÿ .'-]+$/i).withMessage('Nome deve conter apenas letras, espaços, hífens e apostrofes.')
            // .matches(/\s+/).withMessage('Nome e sobrenome são necessários.')
            ,
        body('surname')
            .trim()
            .notEmpty().withMessage('Sobrenome é necessário.')
            .isLength({ max: 50 }).withMessage('Sobrenome não pode exceder 50 caracteres.')
            .matches(/^[a-zÀ-ÿ .'-]+$/i).withMessage('Sobrenome deve conter apenas letras, espaços, hífens e apostrofes.')
        ,
        body('email')
            .trim()
            .notEmpty().withMessage('E-mail é necessário.')
            .isEmail({ require_tld: false }).withMessage('E-mail deve estar em um formato válido.')
            .isLength({ max: 254 }).withMessage('E-mail não pode exceder 254 caracteres.'),
        body('primaryPhone')
            .custom((value, { req }) => {
                if (!value && !req.body.secondaryPhone) throw new Error('Ao menos um telefone é necessário.');
                
                return true;
            })
            .custom(value => {
                if (value === '') return true;

                const phone = parsePhoneNumberFromString(value, 'BR');
                if (!phone || !phone.isValid()) throw new Error('Telefone deve estar em um formato válido.');
                
                return true;
            })
            .isLength({ max: 50 }).withMessage('Telefone não pode exceder 50 caracteres.'),
        body('secondaryPhone')
            .custom((value, { req }) => {
                if (!value && !req.body.primaryPhone) throw new Error('Ao menos um telefone é necessário.');
                
                return true;
            })
            .custom(value => {
                if (value === '') return true;

                const phone = parsePhoneNumberFromString(value, 'BR');
                if (!phone || !phone.isValid()) throw new Error('Telefone deve estar em um formato válido.');
                
                return true;
            })
            .isLength({ max: 50 }).withMessage('Telefone não pode exceder 50 caracteres.'),
        body('dateOfBirth')
            .isISO8601().withMessage('Data deve estar em um formato válido.')
            .custom(value => {
                const dob = dayjs(value, 'YYYY-MM-DD', true);
                const minAge = dayjs().subtract(14, 'year');
                const maxAge = dayjs().subtract(60, 'year');

                if (dob.isAfter(minAge)) throw new Error('Idade mínima insuficiente.');
                if (dob.isBefore(maxAge)) throw new Error('Idade máxima atingida.');
                
                return true;
            }),
        body('yearOfConclusion')
            .notEmpty().withMessage('Ano de conclusão é necessário.')
            .isISO8601().withMessage('Data deve estar em um formato válido.')
            .custom(value => {
                const conclusionDate = dayjs(value, 'YYYY-MM-DD', true); // Strict parsing
                const currentDate = dayjs(); // Today's date
                const maxDate = currentDate.add(5, 'year'); // 5 years from now

                if (conclusionDate.isBefore(currentDate, 'day')) throw new Error('O ano de conclusão deve estar no futuro.');
                if (conclusionDate.isAfter(maxDate, 'day')) throw new Error('O ano de conclusão deve estar dentro dos próximos 5 anos.');
                
                return true;
            }),
        body('occupation')
            .notEmpty().withMessage('Ocupação é necessária.')
            .bail()
            .isIn(['student', 'professional', 'other']).withMessage('Seleção de ocupação inválida.'),
        body('college')
            .trim()
            .notEmpty().withMessage('Nome da faculdade cursada é necessário.')
            .isLength({ max: 150 }).withMessage('Nome da faculdade não pode exceder 150 caractéres.')
            .matches(/^[a-zÀ-ÿ0-9 .'\-&]+$/i).withMessage('Nome da faculdade deve conter apenas letras, números, espaços, hífens e apostrofes.'),
        body('resume')
            .custom((value, { req }) => {
                if (!req.file) throw new Error('Currículo é necessário.');
                return true;
            })
            .bail()
            .custom((value, { req }) => {
                if (!req.file.size > 5 * 1024 * 1024) throw new Error('O currículo deve ter um tamanho máximo de 5MB.');
                return true;
            })
            .custom((value, { req }) => {
                const allowedMimeTypes = ['application/pdf'];
                if (!allowedMimeTypes.includes(req.file.mimetype)) throw new Error('Currículo deve estar no formato PDF.');

                return true;
            }),            
    ],
    (req, res) => {
        const errors = validationResult(req);

                if (!errors.isEmpty()) {
            
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

console.log('lkajsfd');
