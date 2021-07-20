const mongoose = require('mongoose');

mongoose
    .connect('mongodb://localhost/proyecto-bd', {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false
    })
    .then(db => console-console.log('Database is connected'))
    .catch((err) => console.error(err));