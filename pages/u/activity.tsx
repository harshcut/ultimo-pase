import type { NextPage, GetServerSideProps } from 'next';
import type { User as UserTypes } from '@supabase/gotrue-js';
import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { Link, Loading, Text, useToasts } from '@geist-ui/core';
import { MetaHead } from '@/libs/components/.';
import { Page, Summary, Timeline } from '@/components/.';
import { definitions, supabase } from '@/supabase/.';

interface Props {
  user: UserTypes;
}

const Activity: NextPage<Props> = ({ user }: Props) => {
  const [profile, setProfile] = useState<definitions['profile'] | null>(null);
  const [timeline, setTimeline] = useState<definitions['timeline'][] | null>(null);
  const { setToast } = useToasts();

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from<definitions['profile']>('profile').select();
      if (error) return setToast({ text: error.message, type: 'error' });
      if (data) setProfile(data[0]);
    })();
    (async () => {
      const { data, error } = await supabase.from<definitions['timeline']>('timeline').select();
      if (error) return setToast({ text: error.message, type: 'error' });
      if (data) setTimeline(data.reverse());
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <MetaHead title="Activity" />
      <Page className="grid grid-cols-2 gap-5 md:grid-cols-1">
        <div>
          <Text h5>Summary</Text>
          {profile ? (
            <Summary user={user} profile={profile} className="my-5" />
          ) : (
            <div className="h-20">
              <Loading />
            </div>
          )}
          <NextLink href="/u/settings">
            <Link color underline>
              <Text small>View Account Settings &rarr;</Text>
            </Link>
          </NextLink>
        </div>
        <div>
          <Text h5>Timeline</Text>
          {timeline ? (
            <Timeline data={timeline} />
          ) : (
            <div className="h-20">
              <Loading />
            </div>
          )}
        </div>
      </Page>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { user } = await supabase.auth.api.getUserByCookie(context.req);

  if (!user) return { props: {}, redirect: { destination: '/login', permanent: false } };

  return { props: { user } };
};

export default Activity;
