const sgMail = require('@sendgrid/mail');
const { sendGridKey } = require('../config/keys');
sgMail.setApiKey(sendGridKey);

const sendNewEmail = (name, email) => {
    const msg = {
        to: email,
        from: 'zablanc91@hotmail.com',
        subject: 'Sent with SendGrid',
        text: `Thank you for signing up, ${name}!`,
    };
    sgMail.send(msg);
};

const sendDeleteEmail = (name, email) => {
    const msg = {
        to: email,
        from: 'zablanc91@hotmail.com',
        subject: 'Your account has now been deleted.',
        text: `Hi ${name}, so sorry to hear that you are leaving. Please let us know if you have any feedback. Thank you.`,
    };
    sgMail.send(msg);
}

module.exports = {sendNewEmail, sendDeleteEmail};