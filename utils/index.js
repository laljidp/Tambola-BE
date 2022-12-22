const sgMail = require('@sendgrid/mail')
require('dotenv').config()

const accountSid = process.env.ACCOUNT_SID
const twilioAuthToken = process.env.SMS_TWILIO_AUTH_TOKEN
const client = require('twilio')(accountSid, twilioAuthToken)

export const sendEmail = ({ to, from, subject, html }) => {
  // code to send email to the user
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  console.log('process.env.FROM_EMAIL', process.env.FROM_EMAIL)
  const msg = {
    to, // Change to your recipient
    from: process.env.FROM_EMAIL, // Change to your verified sender
    subject,
    text: 'Reset you password',
    html
  }
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
    })
}

export const sendSMS = (to, body) => {
  const from = process.env.SMS_TWILIO_FROM_NUMBER

  try {
    client.messages
      .create({ body, from, to })
      .then(message => console.log('SMS sent:--', message.sid)
      ).catch(err => console.log('Error sending SMS', err))
  } catch (err) {
    console.log('Error sending SMS', err)
  }
}
