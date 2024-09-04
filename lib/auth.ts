import { SITE_URL } from '@/app-config'
import { db } from '@/db'
import { sessions, users } from '@/db/schema'
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle'
import { Facebook, Google } from 'arctic'
import { Lucia, Session, User } from 'lucia'
import { cookies } from 'next/headers'
import { cache } from 'react'

const adapter = new DrizzleSQLiteAdapter(db, sessions as any, users as any)

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        expires: false,
        attributes: {
            secure: process.env.NODE_ENV === 'production',
        },
    },
    getUserAttributes: (attributes) => {
        return attributes
    },
})

export const validateRequest = cache(
    async (): Promise<{ user: User; session: Session } | { user: null; session: null }> => {
        const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null
        if (!sessionId) {
            return {
                user: null,
                session: null,
            }
        }

        const result = await lucia.validateSession(sessionId)
        // next.js throws when you attempt to set cookie when rendering page
        try {
            if (result.session && result.session.fresh) {
                const sessionCookie = lucia.createSessionCookie(result.session.id)
                cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
            }
            if (!result.session) {
                const sessionCookie = lucia.createBlankSessionCookie()
                cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
            }
        } catch (error) {
            console.log(error)
        }
        return result
    }
)

// IMPORTANT!
declare module 'lucia' {
    interface Register {
        Lucia: typeof lucia
        DatabaseUserAttributes: typeof users.$inferSelect
    }
}

export const google = new Google(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    `${SITE_URL}/api/auth/callback/google`
)

export const facebook = new Facebook(
    process.env.FACEBOOK_CLIENT_ID!,
    process.env.FACEBOOK_CLIENT_SECRET!,
    `${SITE_URL}/api/auth/callback/facebook`
)
