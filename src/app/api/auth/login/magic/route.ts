import { AFTER_LOGIN_REDIRECT_URL, LOGIN_URL } from '@/app-config'
import { createSession } from '@/lib/session'
import { getVerificationToken } from '@/services/verification-tokens'

export async function GET(request: Request): Promise<Response> {
    const url = new URL(request.url)
    const token = url.searchParams.get('token')
    const magicErrorUrl = LOGIN_URL + '/magic/error'
    try {
        if (!token) {
            return Response.redirect(magicErrorUrl)
        }

        const user = await getVerificationToken(token, 'magic_link')

        if (!user || user.tokenExpiresAt < new Date()) {
            return Response.redirect(magicErrorUrl)
        }

        await createSession(user.id)

        return Response.redirect(AFTER_LOGIN_REDIRECT_URL)
    } catch (err) {
        console.error(err)
        return Response.redirect(magicErrorUrl)
    }
}
