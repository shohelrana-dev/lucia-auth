import { AFTER_LOGIN_REDIRECT_URL, LOGIN_URL } from '@/app-config'
import { facebook } from '@/lib/auth'
import { createSession } from '@/lib/session'
import { createAccountViaFacebook, getAccountByFacebookId } from '@/services/accounts'
import { createUser } from '@/services/users'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest): Promise<Response> {
    const stateCookie = request.cookies.get('facebook_oauth_state')?.value ?? null

    const url = new URL(request.url)
    const state = url.searchParams.get('state')
    const code = url.searchParams.get('code')
    const error = url.searchParams.get('error')

    if (error) {
        return Response.redirect(LOGIN_URL + '?authError=' + error)
    }

    // verify state
    if (!state || !stateCookie || !code || stateCookie !== state) {
        return Response.redirect(LOGIN_URL + '?authError=unknown_rror')
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

        await createSession(account.userId)
        return Response.redirect(AFTER_LOGIN_REDIRECT_URL)
    } catch (e: any) {
        console.log(e)
        return Response.redirect(encodeURI(LOGIN_URL + '?authError=' + e.message))
    }
}

interface FacebookUser {
    id: string
    name: string
}
