import React from 'react';
import { Text } from '@geist-ui/core';

interface Props {
  title: string;
  description: string;
}

const Header = ({ title, description }: Props): React.ReactElement => {
  return (
    <>
      <header>
        <div className="max-w-xl mx-auto p-5 py-12">
          <Text h3 className="mb-0">
            {title}
          </Text>
          <Text small>{description}</Text>
        </div>
      </header>
      <style jsx>{`
        header {
          box-shadow: inset 0 -1px rgb(234, 234, 234);
        }
      `}</style>
    </>
  );
};

export default Header;
