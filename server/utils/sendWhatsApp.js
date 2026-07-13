/**
 * sendWhatsApp.js
 * Sends a WhatsApp message via Twilio's WhatsApp Business API.
 * Falls back gracefully if Twilio credentials are not configured.
 *
 * Setup: https://www.twilio.com/whatsapp
 * Free sandbox: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn
 */

const sendWhatsApp = async ({ to, message }) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const fromNumber = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886' // Twilio sandbox default

  if (!accountSid || !authToken || accountSid === 'your_twilio_account_sid') {
    console.log('[WhatsApp] Twilio not configured — skipping WhatsApp notification.')
    console.log('[WhatsApp] Would have sent to:', to)
    console.log('[WhatsApp] Message:', message)
    return false
  }

  try {
    // Dynamically import twilio only when credentials exist
    const twilio = (await import('twilio')).default
    const client = twilio(accountSid, authToken)

    // Normalize phone number — ensure it starts with country code
    let phone = to.replace(/\D/g, '') // strip non-digits
    if (!phone.startsWith('91') && phone.length === 10) {
      phone = '91' + phone // add India country code
    }

    await client.messages.create({
      from: fromNumber,
      to: `whatsapp:+${phone}`,
      body: message
    })

    console.log(`[WhatsApp] Message sent successfully to +${phone}`)
    return true
  } catch (error) {
    console.error('[WhatsApp] Send error:', error.message)
    return false
  }
}

export default sendWhatsApp
