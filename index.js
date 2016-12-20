const express = require('express');
const app = express();

require('./config/db')();
require('./config/express')(app);
require('./config/passport')(app);


const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log('SoundPile is running on port ' + port + '!');
});
