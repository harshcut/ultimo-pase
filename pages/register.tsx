import type { NextPage, GetServerSideProps } from 'next';
import type { SignUpTypes } from '@/libs/form-data';
import { useState } from 'react';
import Link from 'next/link';
import { Text, Input, Button, Divider, useToasts } from '@geist-ui/core';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Verify } from '@/components/.';
import { MetaHead } from '@/libs/components/.';
import { supabase } from '@/supabase/.';

const Register: NextPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<false | string>(false);
  const { register, handleSubmit, formState, setError, clearErrors } = useForm<SignUpTypes>();
  const { setToast } = useToasts();

  const onChange = (): void => clearErrors(['password', 'confirm']);

  const onSubmit: SubmitHandler<SignUpTypes> = async ({
    email,
    password,
    confirm,
  }: SignUpTypes) => {
    if (password !== confirm) {
      return (
        [
          { type: 'conflict', name: 'password' },
          { type: 'conflict', name: 'confirm' },
        ] as const
      ).forEach(({ name, type }) => {
        setError(name, { type });
      });
    }
    setLoading(true);
    const { user, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setToast({ text: error.message, type: 'error' });
      return setLoading(false);
    }
    return setEmail(user?.email as string);
  };

  const withAuthProvider = async () => {
    const { error } = await supabase.auth.signIn({ provider: 'google' });
    if (error) return setToast({ text: error.message, type: 'error' });
  };

  if (email) return <Verify email={email} />;

  return (
    <>
      <MetaHead title="Sign Up" />
      <div className="flex flex-row min-h-screen">
        <div className="canvas w-98 md:w-40 sm:hidden" />
        <section className="w-98 p-12 box-border flex-shrink-0 sm:w-screen">
          <header className="mb-10">
            <Text h3>Ultimo Pase</Text>
            <Text type="success" span b>
              A safe vault for all your secrets.
            </Text>
          </header>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 mb-10">
            <Text h4>Create your account</Text>
            <Input
              htmlType="email"
              width="100%"
              type={formState.errors.email && 'error'}
              {...register('email', { required: true })}
              disabled={loading}
            >
              <Text small b>
                Email Address
              </Text>
            </Input>
            <Input.Password
              width="100%"
              type={formState.errors.password && 'error'}
              {...register('password', { required: true })}
              onChange={onChange}
              disabled={loading}
            >
              <Text small b>
                Password
              </Text>
            </Input.Password>
            <Input.Password
              width="100%"
              type={formState.errors.confirm && 'error'}
              {...register('confirm', { required: true })}
              onChange={onChange}
              disabled={loading}
            >
              <Text small b>
                Confirm Password
              </Text>
            </Input.Password>
            <Button htmlType="submit" shadow type="success" loading={loading}>
              Sign Up
            </Button>
            <Divider my={4}>
              <Text small b>
                OR
              </Text>
            </Divider>
            <Button shadow type="secondary" onClick={withAuthProvider}>
              Sign Up With Google
            </Button>
          </form>
          <Text>
            Already have an account?{' '}
            <Link href="/login">
              <a className="whitespace-nowrap">Log In</a>
            </Link>
          </Text>
        </section>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { user } = await supabase.auth.api.getUserByCookie(context.req);

  if (user) return { props: {}, redirect: { destination: '/u/overview', permanent: false } };

  return { props: {} };
};

export default Register;
