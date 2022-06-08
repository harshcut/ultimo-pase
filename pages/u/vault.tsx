import type { NextPage, GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { MetaHead } from '@/libs/components/.';
import { supabase } from '@/supabase/.';
import { Button, Card, Input } from '@geist-ui/core';
import { Search } from '@geist-ui/icons';
import { Page } from '@/components/.';

const Vault: NextPage = () => {
  const router = useRouter();

  return (
    <>
      <MetaHead title="Vault" />
      <Page className="grid gap-5">
        <div className="flex gap-5">
          <Input placeholder="Search" icon={<Search color="#888" />} scale={1.3} width="100%" />
          <Button auto type="secondary" onClick={() => router.push('/u/new')}>
            New Secret
          </Button>
        </div>
        <Card style={{ background: '#fafafa' }}>
          <div className="flex justify-center py-28">
            <small style={{ color: '#9b9b9b' }}>NO SECRETS TO SHOW</small>
          </div>
        </Card>
      </Page>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { user } = await supabase.auth.api.getUserByCookie(context.req);

  if (!user) return { props: {}, redirect: { destination: '/login', permanent: false } };

  return { props: { user } };
};

export default Vault;
