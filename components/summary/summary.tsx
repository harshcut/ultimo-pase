import React from 'react';
import type { User as UserTypes } from '@supabase/gotrue-js';
import NextLink from 'next/link';
import { Link } from '@geist-ui/core';
import { User, Mail, Key, Clock, CheckInCircle, UserPlus } from '@geist-ui/icons';
import moment from 'moment';
import { definitions } from '@/supabase/.';

interface Props {
  user: UserTypes;
  profile: definitions['profile'];
  className?: string;
}

const Summary = ({ user, profile, className }: Props): React.ReactElement => {
  const list = [
    {
      icon: <User size={20} />,
      key: 'Account Name',
      value: profile.full_name ?? (
        <NextLink href="/u/settings">
          <Link color underline className="font-normal">
            Set Account Name &rarr;
          </Link>
        </NextLink>
      ),
    },
    {
      icon: <Mail size={20} />,
      key: 'Email Address',
      value: user.email,
    },
    {
      icon: <Key size={20} />,
      key: 'Auth Provider',
      value: profile.provider.charAt(0).toUpperCase() + profile.provider.slice(1),
    },
    {
      icon: <Clock size={20} />,
      key: 'Last Log In',
      value: moment(user.last_sign_in_at).format('LLL'),
    },
    {
      icon: <CheckInCircle size={20} />,
      key: 'Account Confirmed',
      value: moment(user.confirmed_at).format('LLL'),
    },
    {
      icon: <UserPlus size={20} />,
      key: 'Account Created',
      value: moment(user.created_at).format('LLL'),
    },
  ];

  return (
    <>
      <ul className={`m-0 ${className}`}>
        {list.map((li, index) => (
          <li className="flex justify-between flex-wrap m-0 py-3 text-sm" key={index}>
            <div className="flex items-center gap-3">
              {li.icon}
              <span>{li.key}</span>
            </div>
            <span className="font-medium">{li.value}</span>
          </li>
        ))}
      </ul>
      <style jsx>{`
        li {
          border-top: 1px solid #eaeaea;
        }
        li:last-child {
          border-bottom: 1px solid #eaeaea;
        }
        li::before {
          content: none;
        }
      `}</style>
    </>
  );
};

export default Summary;
