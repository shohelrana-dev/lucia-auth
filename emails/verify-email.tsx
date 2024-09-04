import { SITE_NAME } from '@/app-config'
import { Body, Container, Head, Heading, Html, Preview, Section, Text } from '@react-email/components'

interface Props {
    verificationCode: string
}

export default function VerifyEmail({ verificationCode = '596853' }: Props) {
    return (
        <Html>
            <Head />
            <Preview>{SITE_NAME} Email Verification</Preview>
            <Body style={main}>
                <Heading style={{ ...h1, fontSize: 36 }}>{SITE_NAME}</Heading>
                <Container style={container}>
                    <Section style={coverSection}>
                        <Section style={upperSection}>
                            <Heading style={h1}>Verify your email address</Heading>
                            <Text style={mainText}>
                                Thanks for starting the new {SITE_NAME} account creation process. We want
                                to make sure it&apos;s really you. Please enter the following
                                verification code when prompted. If you don&apos;t want to create an
                                account, you can ignore this message.
                            </Text>
                            <Section style={verificationSection}>
                                <Text style={verifyText}>Verification code</Text>

                                <Text style={codeText}>{verificationCode}</Text>
                                <Text style={validityText}>(This code is valid for 10 minutes)</Text>
                            </Section>
                        </Section>
                    </Section>
                </Container>
            </Body>
        </Html>
    )
}

const main = {
    backgroundColor: '#fff',
    color: '#212121',
}

const container = {
    padding: '20px',
    margin: '0 auto',
    backgroundColor: '#eee',
}

const h1 = {
    color: '#333',
    fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '15px',
    textAlign: 'center' as const,
}

const text = {
    color: '#333',
    fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: '14px',
    margin: '24px 0',
}

const coverSection = { backgroundColor: '#fff' }

const upperSection = { padding: '25px 35px' }

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
    justifyContent: 'center',
}

const mainText = { ...text, marginBottom: '14px', textAlign: 'center' as const }
