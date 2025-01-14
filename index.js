const express = require('express');
const app = express();

const path = require('path');
const publicPath = path.join(__dirname, 'public');
const PORT = 8080; // Set localhost port

app.use(express.static(publicPath));
app.set('view engine', 'ejs');

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

// Start server on http://localhost:<PORT>
app.listen(PORT, function() {
    console.log(`Server running on http://localhost:${PORT}`);
});