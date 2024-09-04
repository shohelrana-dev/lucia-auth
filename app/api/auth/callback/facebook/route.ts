import { LOGIN_URL } from '@/app-config'
import { facebook, lucia } from '@/lib/auth'
import { createAccountViaFacebook, getAccountByFacebookId } from '@/services/accounts'
import { createUser } from '@/services/users'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest): Promise<Response> {
    const stateCookie = request.cookies.get('facebook_oauth_state')?.value ?? null

    const url = new URL(request.url)
    const state = url.searchParams.get('state')
    const code = url.searchParams.get('code')
    const error = url.searchParams.get('error')

    if (error) {
        redirect(LOGIN_URL + '?authError=' + error)
    }

    // verify state
    if (!state || !stateCookie || !code || stateCookie !== state) {
        redirect(LOGIN_URL + '?authError=unknown_rror')
    }

    try {
        const tokens = await facebook.validateAuthorizationCode(code)
        const response = await fetch(`https://graph.facebook.com/me?access_token=${tokens.accessToken}`)
        const facebookUser: FacebookUser = await response.json()

        let account = await getAccountByFacebookId(facebookUser.id)

        if (!account) {
            const user = await createUser({
                name: facebookUser.name,
            })
            account = await createAccountViaFacebook(user.id, facebookUser.id)
        }

        const session = await lucia.createSession(account.userId.toString(), {})
        const sessionCookie = lucia.createSessionCookie(session.id)
        return new Response(null, {
            status: 302,
            headers: {
                Location: '/',
                'Set-Cookie': sessionCookie.serialize(),
            },
        })
    } catch (e: any) {
        console.log(e)
        redirect(encodeURI(LOGIN_URL + '?authError=' + e.message))
    }
}

interface FacebookUser {
    id: string
    name: string
}
