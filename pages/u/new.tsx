import type { NextPage, GetServerSideProps } from 'next';
import type { User as UserTypes } from '@supabase/gotrue-js';
import type { NewSecretTypes } from '@/libs/form-data';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { MetaHead } from '@/libs/components/.';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button, Input, Text, Textarea } from '@geist-ui/core';
import { RefreshCcw, AtSign, ArrowLeft } from '@geist-ui/icons';
import { supabase } from '@/supabase/.';

interface Props {
  user: UserTypes;
}

const New: NextPage<Props> = ({ user }: Props) => {
  const router = useRouter();
  const { register, handleSubmit, formState, setError, clearErrors, setValue } =
    useForm<NewSecretTypes>();
  const [hideUser, setHideUser] = useState<boolean>(true);

  const onChange = (): void => clearErrors(['password', 'confirm']);

  const onSubmit: SubmitHandler<NewSecretTypes> = (data: NewSecretTypes) => {
    if (data.password !== data.confirm) {
      return (
        [
          { type: 'conflict', name: 'password' },
          { type: 'conflict', name: 'confirm' },
        ] as const
      ).forEach(({ name, type }) => {
        setError(name, { type });
      });
    }
  };

  return (
    <>
      <MetaHead title="New Secret" />
      <section className="min-h-screen flex justify-center items-center">
        <div className="z-10 bg-white px-8 py-10 rounded-md">
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
            <div className="flex items-center justify-between gap-5 mb-2">
              <h4 className="m-0">Create New Secret</h4>
              <Button icon={<ArrowLeft />} auto scale={1} onClick={() => router.back()} />
            </div>
            <Input
              width="100%"
              type={formState.errors.organisation && 'error'}
              {...register('organisation', { required: true })}
              placeholder="Acme Inc."
            >
              <Text small b>
                Organisation
              </Text>
            </Input>
            <Textarea
              {...register('description')}
              placeholder="a short description ... (optional)"
            />
            <div className="flex items-end gap-3">
              <Input clearable width="100%" {...register('email')} initialValue={user.email}>
                <Text small b>
                  Email Address
                </Text>
              </Input>
              <Button icon={<AtSign />} auto scale={1} onClick={() => setHideUser(!hideUser)} />
            </div>
            {!hideUser && (
              <Input width="100%" {...register('username')}>
                <Text small b>
                  Username
                </Text>
              </Input>
            )}
            <div className="flex items-end gap-3">
              <Input.Password
                width="100%"
                type={formState.errors.password && 'error'}
                {...register('password', { required: true })}
                onChange={(e) => {
                  setValue('password', e.target.value);
                  onChange();
                }}
              >
                <Text small b>
                  Password
                </Text>
              </Input.Password>
              <Button
                icon={<RefreshCcw />}
                auto
                scale={1}
                onClick={() =>
                  setValue(
                    'password',
                    Math.random().toString(36).slice(8) +
                      '@' +
                      Math.random().toString(36).slice(8).toUpperCase()
                  )
                }
              />
            </div>
            <Input.Password
              width="100%"
              type={formState.errors.confirm && 'error'}
              {...register('confirm', { required: true })}
              onChange={onChange}
            >
              <Text small b>
                Confirm Password
              </Text>
            </Input.Password>
            <Button htmlType="submit" type="success-light" className="mt-3">
              Save To Vault
            </Button>
          </form>
        </div>
      </section>
      <style jsx>{`
        section {
          background-color: #000;
          background-image: url('/assets/focus.webp');
          background-position: center;
        }
        section :global(.btn) {
          height: 2.3rem;
          padding: 0 0.7rem;
        }
      `}</style>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { user } = await supabase.auth.api.getUserByCookie(context.req);

  if (!user) return { props: {}, redirect: { destination: '/login', permanent: false } };

  return { props: { user } };
};

export default New;
