---
title: Webhooks
---

# Webhooks

## Overview

Webhooks allow you to receive real-time notifications when events occur on your Go Vocal platform. When an event happens (like a new idea being created), Go Vocal will send an HTTP POST request to your specified endpoint with event data.

**Common use cases:**
- Trigger workflows in automation platforms (n8n, Zapier, Make.com)
- Send notifications to Slack, Microsoft Teams, or other services
- Sync data with external systems
- Generate reports or analytics in real-time

## Getting Started

### Prerequisites

- Admin access to your Go Vocal platform
- A publicly accessible HTTPS endpoint to receive webhooks
- For local development: Use a tool like [ngrok](https://ngrok.com) to expose your local server

### Creating a Webhook Subscription

1. Navigate to **Admin Panel > Tools > Webhooks**
2. Click **Create Webhook**
3. Configure your webhook:
   - **Name**: Descriptive name for this webhook
   - **URL**: Your HTTPS endpoint (e.g., `https://your-app.com/webhooks`)
   - **Events**: Select which events to subscribe to (see [Supported Events](#supported-events))
   - **Project** (optional): Filter events to a specific project, or leave empty for all projects
4. Click **Save**
5. **Important**: Copy and securely store the **secret token** shown after creation - you'll need it to verify webhook signatures

### Testing Your Webhook

To test your webhook endpoint:
1. Wait for an actual event to occur (e.g., create an idea if you're subscribed to `idea.created`)
2. View the delivery history by clicking the **eye icon** next to your webhook
3. Use the **replay button** (refresh icon) on any previous delivery to resend it to your endpoint
4. This is useful for testing changes to your webhook handler without waiting for new events

## Supported Events

| Event Type | Description | Triggered When |
|------------|-------------|----------------|
| `idea.created` | New idea submitted | A new idea is created |
| `idea.published` | Idea published | An idea changes from draft to published |
| `idea.changed` | Idea updated | An idea's title, body, or other attributes are modified |
| `user.created` | New user registered | A new user account is created |

## Webhook Payload

### HTTP Request

**Method**: `POST`

**Headers**:
```
Content-Type: application/json
X-GoVocal-Event: idea.created
X-GoVocal-Signature: sha256=5f8d9a7b6c4e3f2a...
X-GoVocal-Delivery-ID: 550e8400-e29b-41d4-a716-446655440000
User-Agent: GoVocal-Webhooks/1.0
```

### Payload Structure

Here is an example of the payload structure of a webhook call.

```json
{
  "id": "activity-uuid",
  "event": "Idea created",
  "event_type": "idea.created",
  "timestamp": "2025-10-22T14:30:00Z",
  "item": {
    // event-dependent
  },
  "item_type": "Idea",
  "item_id": "idea-uuid",
  "action": "created",
  "user_id": "user-uuid",
  "project_id": "project-uuid",
  "tenant_id": "tenant-id"
}
```
The `item` contains a more detailed representation of the entity that triggered the event (e.g. for an `idea.created` event, it's the idea). For the specific representation, check the entity in our [public API](/api). The webhooks follow the same structure.

## Verifying Webhook Signatures

**Critical**: Always verify the webhook signature to ensure requests are from Go Vocal and haven't been tampered with.

### Signature Verification Process

1. Extract the signature from the `X-GoVocal-Signature` header
2. Compute HMAC-SHA256 of the raw request body using your secret token
3. Compare your computed signature with the provided signature using a timing-safe comparison

### Implementation Examples

**Node.js (Express)**:
```javascript
const crypto = require('crypto');

app.post('/webhook', (req, res) => {
  const signature = req.headers['x-govocal-signature'];
  const payload = JSON.stringify(req.body);

  // Compute expected signature
  const hmac = crypto.createHmac('sha256', process.env.WEBHOOK_SECRET);
  hmac.update(payload);
  const expectedSignature = 'sha256=' + hmac.digest('base64');

  // Verify using timing-safe comparison
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return res.status(401).send('Invalid signature');
  }

  // Process webhook
  console.log('Received event:', req.body.event_type);
  res.status(200).send('OK');
});
```

**Python (Flask)**:
```python
import hmac
import hashlib
import base64

@app.route('/webhook', methods=['POST'])
def webhook():
    signature = request.headers.get('X-GoVocal-Signature')
    payload = request.get_data()

    # Compute expected signature
    expected_signature = 'sha256=' + base64.b64encode(
        hmac.new(
            os.environ['WEBHOOK_SECRET'].encode(),
            payload,
            hashlib.sha256
        ).digest()
    ).decode()

    # Verify using timing-safe comparison
    if not hmac.compare_digest(signature, expected_signature):
        return 'Invalid signature', 401

    data = request.json
    print(f"Received event: {data['event_type']}")
    return 'OK', 200
```

**Ruby (Sinatra)**:
```ruby
require 'openssl'
require 'base64'

post '/webhook' do
  signature = request.env['HTTP_X_GOVOCAL_SIGNATURE']
  payload = request.body.read

  # Compute expected signature
  hmac = OpenSSL::HMAC.digest(OpenSSL::Digest.new('sha256'), ENV['WEBHOOK_SECRET'], payload)
  expected_signature = "sha256=#{Base64.strict_encode64(hmac)}"

  # Verify using timing-safe comparison
  unless Rack::Utils.secure_compare(signature, expected_signature)
    halt 401, 'Invalid signature'
  end

  data = JSON.parse(payload)
  puts "Received event: #{data['event_type']}"
  'OK'
end
```

## Delivery & Retries

### Retry Policy

If your endpoint fails to respond or returns an error, Go Vocal will automatically retry delivery:

- **Attempt 1**: Immediate (initial attempt)
- **Attempt 2**: After 3 seconds (first retry)
- **Attempt 3**: After 18 seconds (second retry)

After these 3 attempts, the delivery is marked as **failed** and no further automatic retries are made. You can manually replay failed deliveries from the delivery history.

### Response Requirements

Your endpoint must:
- Respond with HTTP status code **200-299** within **10 seconds**
- Return quickly - perform heavy processing asynchronously after responding

### Automatic Disabling

If a webhook subscription experiences **50 consecutive failed deliveries**, it will be automatically disabled to prevent further errors. You'll need to manually re-enable it after fixing the issue.

## Important Behaviors

### No Ordering Guarantees

**Webhooks may arrive out of order.** Due to retries, network latency, and parallel processing, events may not arrive in the order they occurred.

**Best practices:**
- Use the `timestamp` field to determine event order
- Implement idempotency - handle duplicate deliveries gracefully
- Query the Go Vocal API for current state when needed

**Example**:
```javascript
// Handle out-of-order events
function handleUserUpdatedWebhook(payload) {
  const user = findUser(payload.data.id);

  // Ignore if webhook is stale
  if (user.updatedAt > payload.timestamp) {
    console.log('Ignoring stale webhook');
    return;
  }

  user.update(payload.data.attributes);
}
```

### At-Least-Once Delivery

The same event may be delivered multiple times due to retries. Your endpoint should be **idempotent** - processing the same event multiple times should have the same effect as processing it once.

### Timeouts

Go Vocal enforces these timeouts when delivering webhooks:
- **Connection timeout**: 5 seconds
- **Read timeout**: 10 seconds
- **Write timeout**: 10 seconds

If your endpoint doesn't respond within these limits, the delivery will fail and be retried.

### Security Restrictions

For security reasons:
- **HTTPS only**: Webhook URLs must use HTTPS (HTTP allowed in development environments)
- **No redirects**: HTTP redirects are not followed - the URL must respond directly
- **Public endpoints only**: URLs resolving to private/internal IP addresses are blocked

## Managing Webhooks

### Viewing Delivery History

Click the **eye icon** next to a webhook subscription to view:
- Recent delivery attempts
- Success/failure status
- Response codes and error messages
- Delivery timestamps
- Full error details and response bodies

### Replaying Deliveries

If a delivery fails or you want to test your endpoint with a real event:
1. Open the delivery history (eye icon)
2. Click the **replay button** (refresh icon) next to any delivery
3. A new delivery attempt will be created and sent immediately
4. This creates a new delivery record - the original remains unchanged

### Enabling/Disabling

Use the toggle switch to temporarily disable a webhook without deleting it. Disabled webhooks won't receive any events.

### Regenerating the Secret Token

If your secret token is compromised:
1. Click the **refresh icon** next to the webhook
2. Confirm regeneration
3. **Important**: Update your endpoint with the new secret immediately - old secret becomes invalid

### Deleting a Webhook

Click the **delete icon** to permanently remove a webhook subscription. This action cannot be undone.

## Troubleshooting

### Webhook Not Receiving Events

**Check:**
- Webhook is **enabled** (toggle switch is on)
- Event types match the events you expect
- Project filter isn't excluding your events
- Your endpoint is publicly accessible via HTTPS
- Check the delivery history to see if attempts were made
- Use the **replay** feature to test with a real event

### "Invalid Signature" Errors

**Common causes:**
- Using the wrong secret token
- Verifying the parsed JSON instead of the raw request body
- Not using timing-safe comparison
- Incorrect signature algorithm (must be HMAC-SHA256)

### "Connection Timeout" Errors

**Solutions:**
- Ensure your endpoint responds within 10 seconds
- Return HTTP 200 quickly, then process asynchronously
- Check firewall rules allow incoming connections
- Verify your endpoint is accessible from the internet

### High Failure Rate

**Check your logs for:**
- Application errors in your webhook handler
- Long processing times causing timeouts
- Network connectivity issues
- Rate limiting on your endpoint

## Best Practices

1. **Verify signatures**: Always validate the `X-GoVocal-Signature` header
2. **Respond quickly**: Return HTTP 200 immediately, process asynchronously
3. **Handle duplicates**: Implement idempotent processing
4. **Use timestamps**: Don't assume ordering, check timestamps
5. **Monitor deliveries**: Regularly check delivery history for failures
6. **Log everything**: Log webhook receipts and processing for debugging
7. **Test thoroughly**: Use the replay feature to test with real events
8. **Secure your secret**: Store secret tokens in environment variables, never in code
9. **Handle retries**: Remember deliveries retry quickly (3s, 18s), so temporary failures may self-resolve

## Getting Help

- **Support**: Contact your Go Vocal support team for assistance
