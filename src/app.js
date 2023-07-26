const express = require('express');
// dot env
require('dotenv').config();
// puerto
const PORT = process.env.PORT;
const app = express();

app.listen(PORT, () => {
	console.log(`Server on in http://localhost:${PORT}`);
});
