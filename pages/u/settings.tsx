import type { NextPage, GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import { Fieldset, Button, useToasts, Input, Loading, Image, Radio, Text } from '@geist-ui/core';
import { MetaHead } from '@/libs/components/.';
import { Page } from '@/components/.';
import { definitions, supabase } from '@/supabase/.';
import { SubmitHandler, useForm } from 'react-hook-form';

const Settings: NextPage = () => {
  const { register: r1, handleSubmit: h1, formState: f1 } = useForm<{ full_name: string }>();
  const [profile, setProfile] = useState<definitions['profile'] | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const { setToast } = useToasts();

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

  const updateName: SubmitHandler<{ full_name: string }> = async ({ full_name }) => {
    if (full_name === profile?.full_name || (full_name === '' && profile?.full_name === null))
      return setToast({ text: 'Your account name was updated successfully', type: 'success' });
    const { data, error } = await supabase
      .from<definitions['profile']>('profile')
      // @ts-expect-error: undefined not supported for psql
      .update({ full_name: full_name || null })
      .match({ email: profile?.email });
    if (error) return setToast({ text: error.message, type: 'error' });
    if (data) {
      setToast({ text: 'Your account name was updated successfully', type: 'success' });
      setProfile(data[0]);
    }
  };

  const updateAvatar = async () => {
    if (avatar === profile?.avatar_type)
      return setToast({ text: 'Your profile avatar was updated successfully', type: 'success' });
    const { data, error } = await supabase
      .from<definitions['profile']>('profile')
      .update({ avatar_type: avatar ?? 'marble' })
      .match({ email: profile?.email });
    if (error) return setToast({ text: error.message, type: 'error' });
    if (data) {
      setToast({ text: 'Your profile avatar was updated successfully', type: 'success' });
      setProfile(data[0]);
    }
  };

  return (
    <>
      <MetaHead title="Settings" />
      <Page className="grid three-one gap-5">
        {profile ? (
          <div className="grid gap-5">
            <form onSubmit={(e) => e.preventDefault()}>
              <Fieldset>
                <Fieldset.Title>Account Name</Fieldset.Title>
                <Fieldset.Subtitle>
                  Please enter your full name, or a display name you are comfortable with.
                </Fieldset.Subtitle>
                <div className="max-w-sm sm:max-w-full">
                  <Input
                    width="100%"
                    type={f1.errors.full_name && 'error'}
                    initialValue={profile.full_name}
                    {...r1('full_name', { maxLength: 32 })}
                  />
                </div>
                <Fieldset.Footer>
                  <Text>Please use 32 characters at maximum.</Text>
                  <Button auto h="30px" scale={0.75} type="secondary" onClick={h1(updateName)}>
                    Update
                  </Button>
                </Fieldset.Footer>
              </Fieldset>
            </form>
            <Fieldset className="relative">
              <div className="absolute top-10 right-10 sm:static sm:text-center mb-5">
                <Image
                  src={`https://source.boringavatars.com/${avatar}/78/${profile.id}`}
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
                <Text>Avatars by Hayk An and Josep Martins.</Text>
                <Button auto h="30px" scale={0.75} type="secondary" onClick={updateAvatar}>
                  Update
                </Button>
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
