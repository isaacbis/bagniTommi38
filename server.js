const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Abilita cors e parsing JSON nel body
app.use(cors());
app.use(express.json());

// Connessione a MongoDB (sostituisci <CONNECTION_STRING> con la tua da MongoDB Atlas)
mongoose.connect('mongodb+srv://isaacbis:Nnvorrei1@cluster0.8gzov.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connesso a MongoDB Atlas');
}).catch(err => {
  console.error('Errore di connessione a MongoDB:', err);
});

// Definiamo uno schema Mongoose per "prenotazione"
const reservationSchema = new mongoose.Schema({
  field: String,      // es. "Volley1", "Volley2"
  date: String,       // "YYYY-MM-DD"
  timeSlot: String,   // "11:00"
  username: String    // "Mario"
});
// Creiamo il model (tabella/collezione in MongoDB)
const Reservation = mongoose.model('Reservation', reservationSchema);

// Rotta GET: recupera tutte le prenotazioni
app.get('/api/reservations', async (req, res) => {
  try {
    const allReservations = await Reservation.find({});
    res.json(allReservations);
  } catch (err) {
    res.status(500).json({ error: 'Errore nel recupero prenotazioni' });
  }
});

// Rotta POST: crea una nuova prenotazione
app.post('/api/reservations', async (req, res) => {
  try {
    const { field, date, timeSlot, username } = req.body;
    const newRes = new Reservation({ field, date, timeSlot, username });
    await newRes.save();
    res.status(201).json(newRes);
  } catch (err) {
    res.status(500).json({ error: 'Errore nella creazione prenotazione' });
  }
});

// Rotta DELETE: cancella una prenotazione
app.delete('/api/reservations/:id', async (req, res) => {
  try {
    await Reservation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Prenotazione cancellata' });
  } catch (err) {
    res.status(500).json({ error: 'Errore nella cancellazione prenotazione' });
  }
});

// Avvio server su porta 3000 (o variabile d'ambiente)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server avviato su porta ${PORT}`);
});
