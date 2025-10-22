import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { createUser } from '@/actions/user.action'
import { clerkClient } from '@clerk/nextjs/dist/types/server'
import { NextResponse } from 'next/server'

export async function POST(req) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Missing CLERK_WEBHOOK_SECRET environment variable')
  }

  const headerPayload = headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Missing Svix headers', { status: 400 })
  }

  const body = await req.text()
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error verifying webhook', { status: 400 })
  }

  const { id } = evt.data
  const eventType = evt.type

  if (eventType === "user.created"){
    const {id, email_addresses} =
    evt.data;

    const user = {
        clerkId: id,
        email: email_addresses[0].email_addresses
    }

    console.log(user);

    const newUser = await createUser(user);

    if (newUser){
        await clerkClient.users.updateUserMetadata(id, {
            publicMetadata: {
                userID: newUser._id,
            }
        })
    }

    return NextResponse.json({message: "New User created", user: newUser})
  }

  console.log(`Received webhook with ID ${id} and event type ${eventType}`)
  console.log('Webhook payload:', evt.data)

  return new Response('Webhook received', { status: 200 })
}
