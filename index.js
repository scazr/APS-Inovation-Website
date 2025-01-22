const multer = require('multer');
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

app.post('/submit-form', upload.single('resume'), (req, res) => {
    const { name, email, occupation, college } = req.body;
    const resume = req.file;

    console.log('Form data:', JSON.stringify(req.body));
    // console.log('Uploaded file:', resumeFile);

    res.status(200).send({
        message: 'Form submitted successfully!',
        data: {
          name,
          email,
          occupation,
          college,
          resume: resume.filename,
        },
    });
});

// Start server on http://localhost:<PORT>
app.listen(PORT, function() {
    console.log(`Server running on http://localhost:${PORT}`);
});