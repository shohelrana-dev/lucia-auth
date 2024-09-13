import { AFTER_LOGIN_REDIRECT_URL, LOGIN_URL } from '@/app-config'
import { google } from '@/lib/auth'
import { createSession } from '@/lib/session'
import { createAccountViaGoogle, getAccountByGoogleId } from '@/services/accounts'
import { createUser, getUserByEmail } from '@/services/users'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest): Promise<Response> {
    const stateCookie = request.cookies.get('google_oauth_state')?.value ?? null
    const codeVerifier = request.cookies.get('google_code_verifier')?.value ?? null

    const url = new URL(request.url)
    const state = url.searchParams.get('state')
    const code = url.searchParams.get('code')
    const error = url.searchParams.get('error')

    if (error) {
        return Response.redirect(LOGIN_URL + '?authError=' + error)
    }

    // verify state
    if (!state || !stateCookie || !code || stateCookie !== state || !codeVerifier) {
        return Response.redirect(LOGIN_URL + '?authError=unknown_error')
    }

    try {
        const tokens = await google.validateAuthorizationCode(code, codeVerifier)

        const response = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
            headers: {
                Authorization: `Bearer ${tokens.accessToken}`,
            },
        })
        const googleUser: GoogleUser = await response.json()

        let account = await getAccountByGoogleId(googleUser.sub)

        if (!account) {
            let user = await getUserByEmail(googleUser.email)

            if (!user) {
                user = await createUser({
                    name: googleUser.name,
                    picture: googleUser.picture,
                    email: googleUser.email,
                    emailVerifiedAt: googleUser.email_verified ? new Date() : null,
                })
            }
            account = await createAccountViaGoogle(user.id, googleUser.sub)
        }

        await createSession(account.userId)

        return Response.redirect(AFTER_LOGIN_REDIRECT_URL)
    } catch (e: any) {
        console.log(e)
        return Response.redirect(LOGIN_URL + '?authError=' + e.message)
    }
}

export interface GoogleUser {
    sub: string
    name: string
    given_name: string
    family_name: string
    picture: string
    email: string
    email_verified: boolean
    locale: string
}
