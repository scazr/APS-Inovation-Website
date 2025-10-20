const { body } = require('express-validator');
const parsePhoneNumberFromString = require('libphonenumber-js');
const dayjs = require('dayjs');

module.exports = [
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
        .isIn(['developer', 'data-scientist', 'production-engineer', 'marketing', 'apprentice']).withMessage('Seleção de ocupação inválida.'),
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
];