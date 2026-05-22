import { NextResponse } from 'next/server'

// Email webhook endpoint for receiving order emails
// In production, this would be called by email service webhooks (Gmail, SendGrid, etc.)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Extract email data
    const { subject, from, body: emailBody, attachments, timestamp } = body
    
    // Validate required fields
    if (!subject || !from || !emailBody) {
      return NextResponse.json(
        { error: 'Missing required fields: subject, from, body' },
        { status: 400 }
      )
    }

    // Parse order details from email
    const orderData = parseOrderFromEmail({ subject, from, body: emailBody })
    
    // In production, this would:
    // 1. Save to database
    // 2. Trigger AI agent to process
    // 3. Create RFQ automatically
    // 4. Match vendors
    // 5. Send notifications

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500))

    return NextResponse.json({
      success: true,
      message: 'Email received and processed',
      orderId: orderData.orderId,
      parsedData: orderData,
      nextSteps: [
        'Create RFQ from order',
        'AI match vendors',
        'Generate quotation',
        'Process dispatch',
        'Create invoice'
      ]
    })

  } catch (error) {
    console.error('Email webhook error:', error)
    return NextResponse.json(
      { error: 'Failed to process email' },
      { status: 500 }
    )
  }
}

// Parse order details from email body
function parseOrderFromEmail(email: { subject: string; from: string; body: string }) {
  const body = email.body
  
  // Extract quantities
  const qtyMatch = body.match(/quantity[:\s]*(\d+)/i)
  const qty = qtyMatch ? parseInt(qtyMatch[1]) : 1
  
  // Extract prices
  const priceMatch = body.match(/(?:₹|Rs\.?|INR)[\s]*([\d,]+)/i)
  const price = priceMatch ? parseInt(priceMatch[1].replace(/,/g, '')) : 0
  
  // Extract total
  const totalMatch = body.match(/total[:\s]*(?:₹|Rs\.?)[\s]*([\d,]+)/i)
  const total = totalMatch ? parseInt(totalMatch[1].replace(/,/g, '')) : (qty * price)
  
  // Extract customer name
  const customerMatch = email.from.match(/^([^@]+)@/)
  const customerName = customerMatch 
    ? customerMatch[1].replace(/[._]/g, ' ').replace(/[0-9]/g, '')
    : 'Unknown'
  
  // Generate order ID
  const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
  
  return {
    orderId,
    customerName: customerName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    customerEmail: email.from,
    quantity: qty,
    unitPrice: price,
    totalAmount: total,
    items: [
      {
        name: email.subject.split('-').pop()?.trim() || 'Product',
        quantity: qty,
        price: price
      }
    ],
    source: 'email',
    receivedAt: new Date().toISOString()
  }
}

// GET endpoint for checking webhook status
export async function GET() {
  return NextResponse.json({
    status: 'active',
    endpoint: '/api/email-webhook',
    description: 'Email order import webhook',
    supportedFormats: ['JSON'],
    requiredFields: ['subject', 'from', 'body']
  })
}