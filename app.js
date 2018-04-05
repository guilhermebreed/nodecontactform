const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');
const smtTransport = require('nodemailer-smtp-transport');

const app = express();

// View engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser Hiddleware
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.render('contact');
});

app.post('/send', (req, res) => {
    const output = `
        <p>You have a new contact request</p>
        <h3>Contact Details</h3>
        <ul>
            <li>Name: ${req.body.name}</li>
            <li>Company: ${req.body.company}</li>
            <li>Email: ${req.body.email}</li>
            <li>Phone: ${req.body.phone}</li>
        </ul>
        <h3>Message</h3>
        <p>${req.body.message}</p>
    `;

    let transporter = nodemailer.createTransport(smtTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: '', // generated ethereal user
            pass: '' // generated ethereal password
        },
        tls:{
            rejectUnauthorized: false
        }
    }));

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Guilherme Silva Alves 👻" <guilhermebreed@gmail.com>', // sender address
        to: 'guilhermebreed@gmail.com, italoandrade04@hotmail.com', // list of receivers
        subject: 'Teste node email ✔', // Subject line
        text: 'Olá, me deposite pra mim nessa conta: 666-666-666', // plain text body
        html: output // html body
    };

    transporter.verify(function(error, success) {
        if (error) {
             console.log(error);
        } else {
             console.log('Server is ready to take our messages');
        }
     });

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        res.render('contact', {msg: 'Email enviado com sucesso!'});
    });
});

app.listen(3000, () => console.log('Server started...'));

