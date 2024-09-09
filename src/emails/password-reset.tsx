import { Body, Button, Container, Head, Html, Section, Text } from '@react-email/components'

interface Props {
    name: string
    url: string
}

export default function PasswordResetEmail({ name, url }: Props) {
    return (
        <Html>
            <Head />
            <Body style={main}>
                <Container style={container}>
                    <Text style={title}>
                        <strong>{name}</strong>, reset your password.
                    </Text>

                    <Section style={section}>
                        <Text style={text}>
                            Hey <strong>{name}</strong>!
                        </Text>
                        <Text style={text}>
                            Someone recently requested a password change for your Dropbox account. If
                            this was you, you can set a new password here:
                        </Text>

                        <Button style={button} href={url}>
                            Reset Password
                        </Button>
                    </Section>

                    <Text style={footer}>
                        If you don&apos;t want to change your password or didn&apos;t request this, just
                        ignore and delete this message.
                    </Text>
                </Container>
            </Body>
        </Html>
    )
}

PasswordResetEmail.PreviewProps = {
    url: '#',
    name: 'Alan Turing',
} as Props

const main = {
    backgroundColor: '#FCFCFD',
    color: '#24292e',
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
}

const container = {
    maxWidth: '480px',
    margin: '0 auto',
    padding: '20px 0 48px',
}

const title = {
    marginTop: '50px',
    fontSize: '24px',
    lineHeight: 1.25,
}

const section = {
    padding: '24px',
    border: 'solid 1px #dedede',
    borderRadius: '5px',
    textAlign: 'center' as const,
    backgroundColor: '#fff',
}

const text = {
    margin: '0 0 10px 0',
    textAlign: 'left' as const,
}

const button = {
    fontSize: '14px',
    backgroundColor: '#000000',
    color: '#fff',
    lineHeight: 1.5,
    borderRadius: '0.5em',
    padding: '8px 20px',
    fontWeight: '500',
    marginTop: '20px',
}

const footer = {
    color: '#6a737d',
    fontSize: '12px',
    marginTop: '20px',
}
