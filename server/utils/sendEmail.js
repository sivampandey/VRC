import nodemailer from 'nodemailer'

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })

    const info = await transporter.sendMail({
      from: `"Vaishnav Rug Collection" <${process.env.EMAIL_USER || 'no-reply@vaishnavrug.com'}>`,
      to,
      subject,
      text,
      html
    })
    console.log(`Mail sent successfully: ${info.messageId}`)
    return true
  } catch (error) {
    console.error('Mail dispatch error:', error)
    return false
  }
}

export default sendEmail
