const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const mongoose = require('mongoose')
const Device = require('./models/device');

mongoose.connect('mongodb+srv://mohnish:2345@cluster0.ylpiggj.mongodb.net/mydb', { useNewUrlParser: true, useUnifiedTopology: true });

const port = new SerialPort('COM10', { baudRate: 9600 });
const parser = port.pipe(new Readline({ delimiter: '\n' }));

// Read the port data
port.on("open", () => {
    console.log('serial port open');
});

parser.on('data', data => {
    console.log('Arduino saying: ', data);
    const newDevice = new Device({
        data: data,
    });
    newDevice.save()
});

app.get('/data', (req, res) => {
    Device.find({}, (err, devices) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(devices);
        }
    });
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});