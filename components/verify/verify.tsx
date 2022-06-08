import React from 'react';
import { Code, Link, Page, Text } from '@geist-ui/core';
import { MetaHead } from '@/libs/components/.';

interface Props {
  email: string;
}

const Verify = ({ email }: Props): React.ReactElement => {
  return (
    <>
      <MetaHead title="Awaiting Confirmation" />
      <Page dotBackdrop className="h-full w-full flex flex-col justify-center">
        <div className="max-w-xl mx-auto px-6">
          <header>
            <Text h3>Awaiting Confirmation</Text>
          </header>
          <main>
            <Text p>
              We just sent an email to <Code>{email}</Code>. Click verify and confirm your
              registration. You can now safely close this browser tab.
            </Text>
            <Text p>
              Not your email?{' '}
              <Link color href="/register">
                Undo
              </Link>
            </Text>
          </main>
        </div>
      </Page>
    </>
  );
};

export default Verify;
