import app from './app'

const PORT = process.env.PORT_ || 8267

app.listen(PORT, () => { console.log(`Listening on: http://localhost:${PORT}`) })
