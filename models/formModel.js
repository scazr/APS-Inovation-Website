const db = require('../config/database');

exports.insertApplicaion = (formData, callback) => {
    const query = `
        INSERT INTO applications 
        (name, surname, email, primaryPhone, secondaryPhone, dateOfBirth, yearOfConclusion, occupation, college, resume) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
    
    const values = [
        formData.name,
        formData.surname,
        formData.email,
        formData.primaryPhone || null,
        formData.secondaryPhone || null,
        formData.dateOfBirth,
        formData.yearOfConclusion,
        formData.occupation,
        formData.college,
        formData.resume
    ];

    db.run(query, values, function(err) {
        callback(err, { id: this.lastID });
    });
};