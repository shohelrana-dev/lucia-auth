import { SITE_NAME } from '@/app-config'
import { Body, Container, Head, Html, Section, Text } from '@react-email/components'

interface Props {
    name: string
    verificationCode: string
}

export default function VerifyEmail({ name, verificationCode }: Props) {
    return (
        <Html>
            <Head />
            <Body style={main}>
                <Container style={container}>
                    <Text style={title}>
                        <strong>{name}</strong>, Verify your email.
                    </Text>

                    <Section style={section}>
                        <Text style={text}>
                            Hey <strong>{name}</strong>!
                        </Text>
                        <Text style={text}>
                            Thanks for starting the new {SITE_NAME} account creation process. We want to
                            make sure it&apos;s really you. Please enter the following verification code
                            when prompted.
                        </Text>

                        <Section style={verificationSection}>
                            <Text style={verifyText}>Verification code</Text>

                            <Text style={codeText}>{verificationCode}</Text>
                            <Text style={validityText}>(This code is valid for 10 minutes)</Text>
                        </Section>
                    </Section>

                    <Text style={footer}>
                        If you don&apos;t want to create an account, you can ignore this message.
                    </Text>
                </Container>
            </Body>
        </Html>
    )
}

VerifyEmail.PreviewProps = {
    verificationCode: '657567',
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
    backgroundColor: '#ffffff',
}

const text = {
    margin: '0 0 10px 0',
    textAlign: 'left' as const,
}

const verifyText = {
    ...text,
    margin: 0,
    fontWeight: 'bold',
    textAlign: 'center' as const,
}

const codeText = {
    ...text,
    fontWeight: 'bold',
    fontSize: '36px',
    margin: '10px 0',
    textAlign: 'center' as const,
}

const validityText = {
    ...text,
    margin: '0px',
    textAlign: 'center' as const,
}

const verificationSection = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center !important',
}

const footer = {
    color: '#6a737d',
    fontSize: '12px',
    marginTop: '20px',
}
