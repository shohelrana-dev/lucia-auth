import * as React from 'react'

import { SITE_NAME } from '@/app-config'
import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Link,
    Section,
    Tailwind,
    Text,
} from '@react-email/components'

interface Props {
    url: string
    name: string
}

export default function MagicLinkEmail({ url, name }: Props) {
    return (
        <Html>
            <Head />
            <Tailwind>
                <React.Fragment>
                    <Body className='mx-auto my-auto bg-white font-sans'>
                        <Container className='mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]'>
                            <Section className='mb-[32px] mt-[32px] text-center'>
                                <Heading className='text-lg'>Hey, {name}</Heading>
                                <Text className='mb-8 text-[14px] font-medium leading-[24px] text-black'>
                                    You&apos;re magic link login is below, click to login.
                                </Text>

                                <Text className='text-[14px] font-medium leading-[24px] text-black'>
                                    <Link
                                        href={url}
                                        target='_blank'
                                        className='text-[#2754C5] underline'
                                    >
                                        Login using Magic Link
                                    </Link>
                                </Text>
                            </Section>

                            <Hr className='mx-0 my-[26px] w-full border border-solid border-[#eaeaea]' />

                            <Text className='flex items-center justify-center text-[12px] leading-[24px] text-[#666666]'>
                                © 2024 {SITE_NAME}. All rights reserved.
                            </Text>
                        </Container>
                    </Body>
                </React.Fragment>
            </Tailwind>
        </Html>
    )
}

MagicLinkEmail.PreviewProps = {
    url: '#',
    name: 'Alan Turing',
} as Props
