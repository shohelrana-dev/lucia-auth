import { ReactNode } from 'react'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const emailFrom = process.env.EMAIL_FROM! || 'onboarding@resend.dev'

type Args = {
    to: string
    subject: string
    html?: string
    react?: ReactNode
}

export async function sendEmail({ to, subject, html, react }: Args) {
    const { error } = await resend.emails.send({
        from: emailFrom,
        to,
        subject,
        react,
        html,
    })

    if (error) {
        console.error(error)
        throw new Error('Failed to send email')
    }
}
