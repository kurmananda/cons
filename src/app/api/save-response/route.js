import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_PRIVATE_KEY || process.env.SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(req) {
  try {
    const body = await req.json()
    const { phone, name, workshop, felt } = body

    if (!phone) return new Response(JSON.stringify({ error: 'phone is required' }), { status: 400 })

    const { data, error } = await supabase.from('certificate_responses').insert([{ phone, name, workshop, felt }])

    if (error) {
      console.error('Supabase insert error:', error)
      return new Response(JSON.stringify({ error }), { status: 500 })
    }

    return new Response(JSON.stringify({ success: true, data }), { status: 200 })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
}
