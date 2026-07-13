import CustomOrder from '../models/CustomOrder.js'
import cloudinary from '../config/cloudinary.js'
import sendEmail from '../utils/sendEmail.js'
import sendWhatsApp from '../utils/sendWhatsApp.js'

const uploadToCloudinary = (fileBuffer, folder = 'vrc_custom_orders') => {
  return new Promise((resolve, reject) => {
    const base64Data = fileBuffer.toString('base64')
    const fileUri = `data:image/jpeg;base64,${base64Data}`
    cloudinary.uploader.upload(fileUri, { folder }, (error, result) => {
      if (error) return reject(error)
      resolve(result)
    })
  })
}

// ─── Beautiful HTML email template ─────────────────────────────────────────
const buildClientConfirmationEmail = (inquiry) => {
  const { name, email, phone, size, shape, material, color, pattern, budget, description } = inquiry

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Custom Rug Inquiry Confirmed</title>
  <style>
    body { margin: 0; padding: 0; background: #F4EFE8; font-family: Georgia, 'Times New Roman', serif; }
    .wrapper { max-width: 600px; margin: 0 auto; background: #FAF5F0; }
    .header { background: #1B2A45; padding: 36px 40px; text-align: center; }
    .header-logo { font-family: Arial, sans-serif; font-size: 11px; letter-spacing: 0.3em; color: #C9A56A; text-transform: uppercase; margin-bottom: 6px; }
    .header-title { font-size: 26px; color: #FAF5F0; font-weight: normal; letter-spacing: 0.04em; margin: 0; }
    .gold-bar { height: 3px; background: linear-gradient(90deg, transparent, #C9A56A, transparent); }
    .body { padding: 40px; }
    .greeting { font-size: 18px; color: #1B2A45; margin-bottom: 8px; }
    .intro { font-size: 14px; color: #5C5046; line-height: 1.7; margin-bottom: 28px; }
    .section-title { font-family: Arial, sans-serif; font-size: 9px; letter-spacing: 0.22em; color: #C9A56A; text-transform: uppercase; font-weight: bold; margin-bottom: 12px; border-bottom: 1px solid #E0D5C8; padding-bottom: 6px; }
    .detail-table { width: 100%; border-collapse: collapse; margin-bottom: 28px; }
    .detail-table td { padding: 10px 0; border-bottom: 1px solid #F0E8DE; font-size: 13px; vertical-align: top; }
    .detail-table .label { color: #7A7065; width: 38%; font-family: Arial, sans-serif; font-size: 11px; letter-spacing: 0.05em; }
    .detail-table .value { color: #1B2A45; font-weight: bold; }
    .highlight-box { background: #1B2A45; padding: 24px 28px; margin-bottom: 28px; border-left: 3px solid #C9A56A; }
    .highlight-box p { color: #FAF5F0; font-size: 13px; line-height: 1.7; margin: 0; }
    .cta-section { text-align: center; padding: 20px 0 28px; }
    .cta-btn { display: inline-block; background: #C9A56A; color: #1B2A45; text-decoration: none; font-family: Arial, sans-serif; font-size: 10px; letter-spacing: 0.2em; font-weight: bold; text-transform: uppercase; padding: 14px 32px; }
    .contact-row { display: flex; gap: 24px; margin-bottom: 28px; }
    .contact-card { flex: 1; background: #F2EBE1; padding: 16px 20px; border: 1px solid #E0D5C8; }
    .contact-card .label { font-family: Arial, sans-serif; font-size: 9px; letter-spacing: 0.15em; color: #7A7065; text-transform: uppercase; margin-bottom: 4px; }
    .contact-card .value { font-size: 13px; color: #1B2A45; font-weight: bold; }
    .footer { background: #1B2A45; padding: 24px 40px; text-align: center; }
    .footer p { color: #FAF5F0; font-family: Arial, sans-serif; font-size: 10px; letter-spacing: 0.08em; margin: 4px 0; opacity: 0.7; }
    .footer .brand { color: #C9A56A; font-size: 12px; letter-spacing: 0.2em; opacity: 1; margin-bottom: 8px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <!-- Header -->
    <div class="header">
      <div class="header-logo">Vaishnav Rug Collection</div>
      <h1 class="header-title">Custom Rug Inquiry Received</h1>
    </div>
    <div class="gold-bar"></div>

    <!-- Body -->
    <div class="body">
      <p class="greeting">Dear ${name},</p>
      <p class="intro">
        Thank you for reaching out to us at <strong>Vaishnav Rug Collection</strong>. 
        We have successfully received your custom rug inquiry and our master weavers will 
        review your requirements shortly. You can expect a detailed quote from our team 
        within <strong>24–48 business hours</strong>.
      </p>

      <!-- Inquiry Summary -->
      <div class="section-title">Your Inquiry Summary</div>
      <table class="detail-table">
        <tr>
          <td class="label">Size</td>
          <td class="value">${size || '—'}</td>
        </tr>
        <tr>
          <td class="label">Shape</td>
          <td class="value">${shape || '—'}</td>
        </tr>
        <tr>
          <td class="label">Material</td>
          <td class="value">${material || '—'}</td>
        </tr>
        <tr>
          <td class="label">Colour Preference</td>
          <td class="value">${color || '—'}</td>
        </tr>
        <tr>
          <td class="label">Pattern Style</td>
          <td class="value">${pattern || '—'}</td>
        </tr>
        <tr>
          <td class="label">Budget Range</td>
          <td class="value">${budget || '—'}</td>
        </tr>
        ${description ? `<tr><td class="label">Special Requirements</td><td class="value">${description}</td></tr>` : ''}
      </table>

      <!-- What happens next -->
      <div class="highlight-box">
        <p>
          Our master craftsmen from <strong>Mehboobpur, Bhadohi</strong> will personally 
          review your specifications. We will contact you at <strong>${email}</strong> 
          and <strong>${phone}</strong> with a detailed quote, material samples, and 
          estimated production timeline.
        </p>
      </div>

      <!-- CTA -->
      <div class="cta-section">
        <a href="https://wa.me/918707630603?text=Hi%2C%20I%20submitted%20a%20custom%20rug%20inquiry%20and%20want%20to%20follow%20up." class="cta-btn">
          Chat With Us on WhatsApp
        </a>
      </div>

      <!-- Contact -->
      <div class="section-title">Our Contact Details</div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">
        <tr>
          <td style="padding-right:12px;vertical-align:top;width:50%;">
            <div style="background:#F2EBE1;padding:16px 20px;border:1px solid #E0D5C8;">
              <div style="font-family:Arial,sans-serif;font-size:9px;letter-spacing:0.15em;color:#7A7065;text-transform:uppercase;margin-bottom:4px;">Phone / WhatsApp</div>
              <div style="font-size:13px;color:#1B2A45;font-weight:bold;">+91 87076 30603</div>
              <div style="font-size:13px;color:#1B2A45;font-weight:bold;">+91 91295 15971</div>
            </div>
          </td>
          <td style="padding-left:12px;vertical-align:top;width:50%;">
            <div style="background:#F2EBE1;padding:16px 20px;border:1px solid #E0D5C8;">
              <div style="font-family:Arial,sans-serif;font-size:9px;letter-spacing:0.15em;color:#7A7065;text-transform:uppercase;margin-bottom:4px;">Our Address</div>
              <div style="font-size:12px;color:#1B2A45;">Mehboobpur, Bhadohi<br/>Uttar Pradesh – 221401<br/>Near Indra Mill Chauraha</div>
            </div>
          </td>
        </tr>
      </table>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p class="brand">VAISHNAV RUG COLLECTION</p>
      <p>Woven with Tradition, Made for Generations.</p>
      <p>© ${new Date().getFullYear()} Vaishnav Rug Collection. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `.trim()

  const text = `
Dear ${name},

Thank you for your custom rug inquiry at Vaishnav Rug Collection!

YOUR INQUIRY SUMMARY:
- Size: ${size || '—'}
- Shape: ${shape || '—'}
- Material: ${material || '—'}
- Colour: ${color || '—'}
- Pattern: ${pattern || '—'}
- Budget: ${budget || '—'}
${description ? `- Requirements: ${description}` : ''}

Our team will review your specifications and contact you at ${email} / ${phone} within 24–48 business hours with a detailed quote.

Contact Us:
📞 +91 87076 30603 | +91 91295 15971
📍 Mehboobpur, Bhadohi, Uttar Pradesh – 221401

Woven with Tradition, Made for Generations.
— Vaishnav Rug Collection
  `.trim()

  return { html, text }
}

// ─── WhatsApp message template ──────────────────────────────────────────────
const buildWhatsAppMessage = (inquiry) => {
  const { name, size, shape, material, pattern, budget } = inquiry
  return `🌿 *Vaishnav Rug Collection*\n\nDear *${name}*,\n\nYour custom rug inquiry has been received! ✅\n\n*Your Specifications:*\n• Size: ${size || '—'}\n• Shape: ${shape || '—'}\n• Material: ${material || '—'}\n• Pattern: ${pattern || '—'}\n• Budget: ${budget || '—'}\n\nOur master weavers will review your requirements and contact you with a detailed quote within *24–48 hours*.\n\nFor any queries, reply to this message or call us at *+91 87076 30603*.\n\n_Woven with Tradition, Made for Generations._ 🏺`
}

// ─── Beautiful HTML status email template ──────────────────────────────────
const buildClientInquiryStatusEmail = (inquiry, oldStatus, newStatus) => {
  const { name, size, shape, material, adminNotes } = inquiry
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Custom Rug Request Update</title>
  <style>
    body { margin: 0; padding: 0; background: #F4EFE8; font-family: Georgia, 'Times New Roman', serif; }
    .wrapper { max-width: 600px; margin: 0 auto; background: #FAF5F0; }
    .header { background: #1B2A45; padding: 36px 40px; text-align: center; }
    .header-logo { font-family: Arial, sans-serif; font-size: 11px; letter-spacing: 0.3em; color: #C9A56A; text-transform: uppercase; margin-bottom: 6px; }
    .header-title { font-size: 24px; color: #FAF5F0; font-weight: normal; letter-spacing: 0.04em; margin: 0; }
    .gold-bar { height: 3px; background: linear-gradient(90deg, transparent, #C9A56A, transparent); }
    .body { padding: 40px; }
    .greeting { font-size: 18px; color: #1B2A45; margin-bottom: 8px; }
    .status-badge { display: inline-block; background: #C9A56A; color: #1B2A45; padding: 8px 16px; font-family: Arial, sans-serif; font-weight: bold; text-transform: uppercase; font-size: 11px; letter-spacing: 0.1em; margin-bottom: 24px; }
    .weavers-box { background: #F2EBE1; padding: 20px 24px; margin-bottom: 28px; border-left: 3px solid #C9A56A; }
    .weavers-box p { font-size: 13px; color: #5C5046; font-style: italic; margin: 0; line-height: 1.6; }
    .cta-btn { display: inline-block; background: #1B2A45; color: #FAF5F0; text-decoration: none; font-family: Arial, sans-serif; font-size: 10px; letter-spacing: 0.2em; font-weight: bold; text-transform: uppercase; padding: 14px 32px; }
    .footer { background: #1B2A45; padding: 24px 40px; text-align: center; }
    .footer p { color: #FAF5F0; font-family: Arial, sans-serif; font-size: 10px; letter-spacing: 0.08em; margin: 4px 0; opacity: 0.7; }
    .footer .brand { color: #C9A56A; font-size: 12px; letter-spacing: 0.2em; opacity: 1; margin-bottom: 8px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="header-logo">Vaishnav Rug Collection</div>
      <h1 class="header-title">Request Status Updated</h1>
    </div>
    <div class="gold-bar"></div>
    <div class="body">
      <p class="greeting">Dear ${name},</p>
      <p style="font-size: 14px; color: #5C5046; line-height: 1.7; margin-bottom: 20px;">
        The status of your custom rug request (Size: <strong>${size}</strong>, Shape: <strong>${shape}</strong>, Material: <strong>${material}</strong>) has been updated by our master weavers:
      </p>
      <span class="status-badge">${newStatus}</span>
      
      ${adminNotes ? `
      <div class="weavers-box">
        <p><strong>Weavers' Notes:</strong><br/>${adminNotes}</p>
      </div>
      ` : ''}

      <p style="font-size: 13px; color: #7A7065; line-height: 1.6; margin-bottom: 28px;">
        You can check the live tracking status, request summaries, and updates directly in your account profile dashboard.
      </p>

      <div style="text-align: center; margin-bottom: 36px;">
        <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/account/profile" class="cta-btn">
          Go To Profile Portal
        </a>
      </div>
    </div>
    <div class="footer">
      <p class="brand">VAISHNAV RUG COLLECTION</p>
      <p>Woven with Tradition, Made for Generations.</p>
      <p>© ${new Date().getFullYear()} Vaishnav Rug Collection. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `.trim()

  const text = `
Dear ${name},

The status of your custom rug request has been updated to: ${newStatus.toUpperCase()}.

${adminNotes ? `Weavers' Notes: ${adminNotes}\n` : ''}
Track request updates on: ${process.env.CLIENT_URL || 'http://localhost:5173'}/account/profile

— Vaishnav Rug Collection
  `.trim()

  return { html, text }
}

// ─── Controller: Submit Custom Inquiry ─────────────────────────────────────
export const submitInquiry = async (req, res, next) => {
  try {
    const { name, email, phone, size, shape, material, color, pattern, budget, description } = req.body

    let referenceImages = []
    if (req.files && req.files.length > 0) {
      try {
        const uploadPromises = req.files.map(file => uploadToCloudinary(file.buffer))
        const results = await Promise.all(uploadPromises)
        referenceImages = results.map(r => r.secure_url)
      } catch (uploadErr) {
        console.warn('Image upload failed — proceeding without images:', uploadErr.message)
      }
    }

    const inquiry = new CustomOrder({
      name, email, phone, size, shape, material, color, pattern, budget, description, referenceImages
    })

    await inquiry.save()

    // ── Send confirmation email to client (non-blocking) ──────────────────
    const { html, text } = buildClientConfirmationEmail(inquiry)
    sendEmail({
      to: email,
      subject: `✅ Custom Rug Inquiry Confirmed — Vaishnav Rug Collection`,
      html,
      text
    }).then(sent => {
      if (sent) console.log(`[Email] Confirmation sent to ${email}`)
      else console.warn(`[Email] Failed to send confirmation to ${email}`)
    })

    // ── Send WhatsApp confirmation to client (non-blocking) ──────────────
    if (phone) {
      const message = buildWhatsAppMessage(inquiry)
      sendWhatsApp({ to: phone, message }).then(sent => {
        if (sent) console.log(`[WhatsApp] Confirmation sent to ${phone}`)
      })
    }

    // ── Notify admin via email (non-blocking) ─────────────────────────────
    const adminEmail = process.env.EMAIL_USER
    if (adminEmail) {
      sendEmail({
        to: adminEmail,
        subject: `🆕 New Custom Rug Inquiry — ${name}`,
        html: `<h2>New Custom Inquiry Received</h2>
               <p><strong>Client:</strong> ${name} (${email} / ${phone})</p>
               <p><strong>Size:</strong> ${size} | <strong>Shape:</strong> ${shape}</p>
               <p><strong>Material:</strong> ${material} | <strong>Pattern:</strong> ${pattern}</p>
               <p><strong>Budget:</strong> ${budget}</p>
               <p><strong>Description:</strong> ${description || 'None'}</p>
               <p>Login to admin panel to review: <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/admin">/admin → Customs tab</a></p>`,
        text: `New custom inquiry from ${name} (${email} / ${phone}). Login to admin panel to review.`
      })
    }

    return res.status(201).json({
      ...inquiry.toObject(),
      _notifications: {
        email: 'queued',
        whatsapp: phone ? 'queued' : 'no_phone'
      }
    })
  } catch (error) {
    next(error)
  }
}

export const getInquiries = async (req, res, next) => {
  try {
    const items = await CustomOrder.find().sort({ createdAt: -1 })
    return res.json(items)
  } catch (error) {
    next(error)
  }
}

export const getMyInquiries = async (req, res, next) => {
  try {
    const items = await CustomOrder.find({ email: req.user.email }).sort({ createdAt: -1 })
    return res.json(items)
  } catch (error) {
    next(error)
  }
}

export const updateInquiryStatus = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body
    const inquiry = await CustomOrder.findById(req.params.id)
    if (!inquiry) {
      return res.status(404).json({ message: 'Custom inquiry not found.' })
    }

    const oldStatus = inquiry.status
    if (status) inquiry.status = status
    if (adminNotes !== undefined) inquiry.adminNotes = adminNotes

    await inquiry.save()

    // Send email on status update if it actually changed
    if (status && status !== oldStatus) {
      const { html, text } = buildClientInquiryStatusEmail(inquiry, oldStatus, status)
      sendEmail({
        to: inquiry.email,
        subject: `🔔 Custom Rug Request Update: ${status.toUpperCase()} — VRC`,
        html,
        text
      }).then(sent => {
        if (sent) console.log(`[Email] Status update email sent to ${inquiry.email}`)
      })
    }

    return res.json(inquiry)
  } catch (error) {
    next(error)
  }
}

export const deleteInquiry = async (req, res, next) => {
  try {
    const inquiry = await CustomOrder.findById(req.params.id)
    if (!inquiry) return res.status(404).json({ message: 'Custom inquiry not found.' })

    // Verify ownership or admin role
    if (inquiry.email !== req.user.email && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this inquiry.' })
    }

    await CustomOrder.findByIdAndDelete(req.params.id)
    return res.json({ message: 'Inquiry deleted successfully.' })
  } catch (error) {
    next(error)
  }
}
