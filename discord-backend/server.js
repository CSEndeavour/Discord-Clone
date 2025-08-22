import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import Pusher from 'pusher'
import mongoData from './mongoData.js'

const app = express()
const port = process.env.PORT || 8002

const pusher = new Pusher({
  appId: "2040462",
  key: "ccfe8699f752cde7bccc",
  secret: "f54714fc47fef6598d6c",
  cluster: "us2",
  useTLS: true
});

app.use(express.json())
app.use(cors())

const mongoURI = 'mongodb+srv://admin:n8uleRS9rpFuaeo0@cluster0.3aguetx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.once('open', () =>{
    console.log('DB Connected')
    const changeStream = mongoose.connection.collection('conversations').watch()

    changeStream.on('change', (change) =>{
        if (change.operationType === 'insert'){
            pusher.trigger('channels', 'newChannel',{
                'change': change
            });
        } else if (change.operationType === 'update'){
            pusher.trigger('conversation', 'newMessage', {
                'change': change
            });
        } else{
            console.log('Error pusher')
        }
    })
})

app.get('/', (req, res) => res.status(200).send('hello world'))


// Create new channel
app.post('/new/channel', async (req, res) => {
    try {
        const dbData = req.body;
        const data = await mongoData.create(dbData);
        res.status(201).send(data);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Get list of channels
app.get('/get/channelList', async (req, res) => {
    try {
        const data = await mongoData.find({});
        const channels = data.map((channelData) => ({
            id: channelData._id,
            name: channelData.channelName,
        }));
        res.status(200).send(channels);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Add new message to conversation
app.post('/new/message', async (req, res) => {
    try {
        const updated = await mongoData.findByIdAndUpdate(
            req.query.id,
            { $push: { conversation: req.body } },
            { new: true }
        );
        res.status(201).send(updated);
    } catch (err) {
        console.log('Error saving message...');
        console.error(err);
        res.status(500).send(err);
    }
});

// Get all data (like channels)
app.get('/get/data', async (req, res) => {
    try {
        const data = await mongoData.find({});
        res.status(200).send(data);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Get a specific conversation by ID
app.get('/get/conversation', async (req, res) => {
    try {
        const id = req.query.id;
        const data = await mongoData.find({ _id: id });
        res.status(200).send(data);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.listen(port, () => console.log(`listening on localhost:${port}`))