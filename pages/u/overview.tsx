import type { NextPage, GetServerSideProps } from 'next';
import type { User as UserTypes } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Button, Card, Link, Text, User, Loading, useToasts } from '@geist-ui/core';
import { Clock, CheckInCircle } from '@geist-ui/icons';
import moment from 'moment';
import { MetaHead } from '@/libs/components/.';
import { Page } from '@/components/.';
import { supabase, definitions } from '@/supabase/.';

interface Props {
  user: UserTypes;
}

const Overview: NextPage<Props> = ({ user }: Props) => {
  const router = useRouter();
  const [profile, setProfile] = useState<definitions['profile'] | null>(null);
  const { setToast } = useToasts();

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from<definitions['profile']>('profile').select();
      if (error) return setToast({ text: error.message, type: 'error' });
      if (data) setProfile(data[0]);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <MetaHead title="Overview" />
      <Page className="grid three-one gap-5">
        <div>
          <Card>
            <div className="py-8 flex flex-col justify-center items-center sm:items-start">
              <Text h4 className="m-0">
                You dont have any secrets.
              </Text>
              <Text
                style={{ color: '#444' }}
                className="mb-5 max-w-md text-sm text-center sm:text-left"
              >
                Get started with creating a new secret, add notes or description and secure it with
                a personal identification number.
              </Text>
              <Button type="secondary" onClick={() => router.push('/u/new')}>
                Create New Secret
              </Button>
            </div>
          </Card>
          <div className="mt-5 grid">
            <Text small>Explore more integrations and expand your account security.</Text>
            <NextLink href="/u/settings">
              <Link color underline>
                <Text small>Create Personal Identification Number &rarr;</Text>
              </Link>
            </NextLink>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <Text h5 className="m-0">
            Recent Activity
          </Text>
          {profile ? (
            <>
              <User
                src={`https://source.boringavatars.com/${profile?.avatar_type}/32/${user.id}`}
                name={profile?.full_name}
                style={{ padding: 0 }}
              >
                via {user.app_metadata.provider}
              </User>
              <div className="pl-2 flex items-center gap-3">
                <Clock size={20} />
                <Text small>{moment(user.last_sign_in_at).fromNow()}</Text>
              </div>
              <div className="pl-2 flex items-center gap-3">
                <CheckInCircle size={20} />
                <Text small>{moment(user.confirmed_at).format('LLL')}</Text>
              </div>
            </>
          ) : (
            <div className="h-5">
              <Loading />
            </div>
          )}
          <NextLink href="/u/activity">
            <Link color underline>
              <Text small>View All Activity &rarr;</Text>
            </Link>
          </NextLink>
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

export default Overview;
