const { validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');
const formModel = require('../models/formModel');
const upload = require('../middleware/upload');

exports.renderForm = (req, res) => {
    const maxYearsToGraduate = 5;
    const internAgeLimit = 60;

    const curDate = new Date();
    const minDate = new Date(curDate.getFullYear() - internAgeLimit, 0, 1);
    const maxDate = new Date(curDate.getFullYear() + maxYearsToGraduate, 11, 31);

    const formatDate = (date) => date.toISOString().split('T')[0];

    res.render(path.join(__dirname, '../public/form'), {
        minDate: formatDate(minDate),
        curDate: formatDate(curDate),
        maxDate: formatDate(maxDate),
    });
};

exports.handleFormSubmit = (req, res) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        if (req.file) {
            const filePath = path.join(__dirname, '../uploads/', req.file.filename);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                }
            });
        }
        return res.status(400).json({
            message: 'Validations errors occurred',
            errors: errors.array().map((error) => ({
                field: error.path,
                message: error.msg
            })),
        });
    }

    const { name, surname, occupation, college, dateOfBirth, yearOfConclusion, email, primaryPhone, secondaryPhone } = req.body;
    const resume = req.file;

    return res.status(200).send({
        message: 'Form submitted successfully!',
        data: {
            name,
            surname,
            occupation,
            college,
            dateOfBirth,
            yearOfConclusion,
            email,
            primaryPhone,
            secondaryPhone,
            resume: resume.filename,
        },
    });
};