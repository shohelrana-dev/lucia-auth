import { integer, pgEnum, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const accountTypeEnum = pgEnum('account_type', ['email', 'google', 'facebook'])
export const verificationTypeEnum = pgEnum('verification_type', [
    'email_verification',
    'password_reset',
    'magic_link',
])

export type AccountTypeEnum = 'email' | 'google' | 'facebook'
export type VerificationTypeEnum = 'email_verification' | 'password_reset' | 'magic_link'

const commonColumns = {
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
}

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    picture: text('picture'),
    email: text('email').unique(),
    emailVerifiedAt: timestamp('email_verified_at'),
    ...commonColumns,
})

export const accounts = pgTable('accounts', {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
    accountType: accountTypeEnum('account_type').notNull(),
    googleId: text('google_id').unique(),
    facebookId: text('facebook_id').unique(),
    password: text('password'),
    salt: text('salt'),
    ...commonColumns,
})

export const sessions = pgTable('sessions', {
    id: text('id').primaryKey(),
    userId: integer('user_id')
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    ...commonColumns,
})

export const verificationTokens = pgTable('verification_tokens', {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
        .references(() => users.id, { onDelete: 'cascade' })
        .unique()
        .notNull(),
    token: text('token').notNull(),
    verificationType: verificationTypeEnum('verification_type').notNull(),
    tokenExpiresAt: timestamp('token_expires_at').notNull(),
    ...commonColumns,
})

export type User = typeof users.$inferSelect
export type Account = typeof accounts.$inferSelect
export type Session = typeof sessions.$inferSelect
export type VerificationToken = typeof verificationTokens.$inferSelect
