import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const customerEmail = session.customer_details?.email;
    const artTitle = session.metadata.artTitle;
    const sessionId = session.id;

    if (!customerEmail) {
      console.error('No customer email found');
      return NextResponse.json({ error: 'No email' }, { status: 400 });
    }

    const downloadLink = process.env.NEXT_PUBLIC_APP_URL + '/download?session_id=' + sessionId;

    try {
      await resend.emails.send({
        from: process.env.SENDER_EMAIL,
        to: customerEmail,
        subject: 'Your Download Link: ' + artTitle + ' 🎨',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body {
                  font-family: 'Helvetica Neue', Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                }
                .header {
                  background: linear-gradient(135deg, #f472b6 0%, #a855f7 100%);
                  color: white;
                  padding: 30px;
                  border-radius: 12px;
                  text-align: center;
                  margin-bottom: 30px;
                }
                .content {
                  background: #f9f9f9;
                  padding: 30px;
                  border-radius: 12px;
                  margin-bottom: 20px;
                }
                .download-button {
                  display: inline-block;
                  background: linear-gradient(135deg, #f472b6 0%, #a855f7 100%);
                  color: white;
                  padding: 15px 40px;
                  text-decoration: none;
                  border-radius: 25px;
                  font-weight: bold;
                  margin: 20px 0;
                }
                .info-box {
                  background: #fff;
                  border-left: 4px solid #f472b6;
                  padding: 15px;
                  margin: 15px 0;
                }
                .footer {
                  text-align: center;
                  color: #666;
                  font-size: 14px;
                  margin-top: 30px;
                }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>✨ Thank You for Your Purchase! ✨</h1>
              </div>
              
              <div class="content">
                <h2>Hi there! 👋</h2>
                <p>Thank you so much for supporting my art! Your purchase of <strong>${artTitle}</strong> means the world to me. 💕</p>
                
                <div style="text-align: center;">
                  <a href="${downloadLink}" class="download-button">
                    📥 Download Your Artwork
                  </a>
                </div>
                
                <div class="info-box">
                  <h3>📋 What's Next?</h3>
                  <ul>
                    <li>Click the button above to access your download page</li>
                    <li>You can download your high-resolution artwork</li>
                    <li>Save this email - you can download anytime using the link</li>
                    <li>The link never expires, so you can re-download if needed</li>
                  </ul>
                </div>
                
                <div class="info-box">
                  <h3>💡 Usage Rights</h3>
                  <p>This artwork is for <strong>personal use only</strong>. You may:</p>
                  <ul>
                    <li>Print it for your home or office</li>
                    <li>Use it as wallpaper or screensaver</li>
                    <li>Share it on social media (with credit appreciated!)</li>
                  </ul>
                  <p><strong>You may not:</strong> Resell, redistribute, or claim as your own work.</p>
                </div>
                
                <p>If you have any questions or issues with your download, please don't hesitate to reach out to me at <strong>shwetaparna111@gmail.com</strong></p>
                
                <p>Thank you again for your support! 🎨✨</p>
                
                <p style="margin-top: 20px;">
                  With love,<br>
                  <strong>Shweta</strong><br>
                  WhiteLeafs Art
                </p>
              </div>
              
              <div class="footer">
                <p>© 2025 WhiteLeafs Art | All Rights Reserved</p>
                <p>Follow me on <a href="https://www.facebook.com/share/15XBCS2WNf/?mibextid=wwXIfr">Facebook</a></p>
              </div>
            </body>
          </html>
        `,
      });

      console.log('Email sent successfully to:', customerEmail);
    } catch (emailError) {
      console.error('Error sending email:', emailError);
    }
  }

  return NextResponse.json({ received: true });
}