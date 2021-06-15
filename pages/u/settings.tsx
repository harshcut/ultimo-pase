import { useEffect, useState } from 'react';
import type { NextPage, GetServerSideProps } from 'next';
import { Fieldset, Button, useToasts, Input, Loading, Image, Radio } from '@geist-ui/react';
import { MetaHead } from '@/libs/components/.';
import { Page } from '@/components/.';
import { definitions, supabase } from '@/supabase/.';

const Settings: NextPage = () => {
  const [profile, setProfile] = useState<definitions['profile'] | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [, setToast] = useToasts();

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from<definitions['profile']>('profile').select();
      if (error) return setToast({ text: error.message, type: 'error' });
      if (data) {
        setProfile(data[0]);
        setAvatar(data[0].avatar_type);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <MetaHead title="Settings" />
      <Page className="grid three-one gap-5">
        {profile ? (
          <div className="grid gap-5">
            <Fieldset>
              <Fieldset.Title>Account Name</Fieldset.Title>
              <Fieldset.Subtitle>
                Please enter your full name, or a display name you are comfortable with.
              </Fieldset.Subtitle>
              <div className="max-w-sm sm:max-w-full">
                <Input width="100%" initialValue={profile.full_name} />
              </div>
              <Fieldset.Footer>
                <Fieldset.Footer.Status>
                  Please use 32 characters at maximum.
                </Fieldset.Footer.Status>
                <Fieldset.Footer.Actions>
                  <Button auto size="small" type="secondary">
                    Update
                  </Button>
                </Fieldset.Footer.Actions>
              </Fieldset.Footer>
            </Fieldset>
            <Fieldset className="relative">
              <div className="absolute top-10 right-10 sm:static mb-5">
                <Image
                  src={`https://source.boringavatars.com/${avatar}/78/${profile.id}`}
                  height={78}
                  width={78}
                  alt="avatar"
                />
              </div>
              <Fieldset.Title>Profile Avatar</Fieldset.Title>
              <Fieldset.Subtitle>
                Avatars are based on your account identifiers. Select your avatar type below.
              </Fieldset.Subtitle>
              <Radio.Group
                useRow
                initialValue={profile.avatar_type}
                onChange={(v) => setAvatar(v as string)}
              >
                <Radio value="beam">
                  Beam<Radio.Desc>Get that smiley look out</Radio.Desc>
                </Radio>
                <Radio value="marble">
                  Marble<Radio.Desc>Venture into deep space</Radio.Desc>
                </Radio>
              </Radio.Group>
              <Fieldset.Footer>
                <Fieldset.Footer.Status>
                  Avatar artwork by Hayk An and Josep Martins.
                </Fieldset.Footer.Status>
                <Fieldset.Footer.Actions>
                  <Button auto size="small" type="secondary">
                    Update
                  </Button>
                </Fieldset.Footer.Actions>
              </Fieldset.Footer>
            </Fieldset>
          </div>
        ) : (
          <div className="h-20">
            <Loading className="h-20" />
          </div>
        )}
      </Page>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { user } = await supabase.auth.api.getUserByCookie(context.req);

  if (!user) return { props: {}, redirect: { destination: '/login', permanent: false } };

  return { props: { user } };
};

export default Settings;
