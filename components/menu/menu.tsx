import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Text, Tabs, Button, useCurrentState, useToasts } from '@geist-ui/core';
import { useLocale, tabData } from '@/libs/.';
import { Header } from '@/components/.';
import { supabase } from '@/supabase/.';

const Menu = (): React.ReactElement => {
  const router = useRouter();
  const { tabbar: currentUrlTabValue, locale } = useLocale();
  const [tabValue, setTabValue, tabValueRef] = useCurrentState<string>('');
  const [fixed, setFixed, fixedRef] = useCurrentState<boolean>(false);
  const { setToast } = useToasts();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setTabValue(currentUrlTabValue), [currentUrlTabValue]);

  useEffect(() => {
    const shouldRedirectDefaultPage = currentUrlTabValue !== tabValueRef.current;
    if (!shouldRedirectDefaultPage) return;
    const defaultPath = `/${locale}/${tabValueRef.current}`;
    void router.push(defaultPath);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabValue, currentUrlTabValue]);

  useEffect(() => {
    const scrollHandler = () => {
      const shouldFixed = document.documentElement.scrollTop > 60;
      if (shouldFixed === fixedRef.current) return;
      setFixed(shouldFixed);
    };
    document.addEventListener('scroll', scrollHandler);
    return () => document.removeEventListener('scroll', scrollHandler);
  });

  const onLogOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) return setToast({ text: error.message, type: 'error' });
  };

  return (
    <>
      <div className="select-none">
        <section className="flex justify-between items-center max-w-xl h-15 my-0 mx-auto px-5">
          <div className="cursor-pointer whitespace-nowrap">
            <Text span b>
              Ultimo Pase
            </Text>
          </div>
          <div className="flex gap-2 items-center">
            <Button auto h="30px" scale={0.75} onClick={onLogOut}>
              Log Out
            </Button>
          </div>
        </section>
        <div className={`pointer-events-none w-0 ${fixed ? 'h-12 visible' : 'h-0 invisible'}`} />
        <nav className={`h-12 w-full ${fixed ? 'fixed inset-x-0 top-0' : 'relative'}`}>
          <div className="inner max-w-xl h-full pr-5 flex items-end my-0 mx-auto">
            <Tabs value={tabValue} onChange={(val) => setTabValue(val)}>
              {tabData.map((tab, index) => (
                <Tabs.Item label={tab.name} value={tab.name.toLowerCase()} key={index} />
              ))}
            </Tabs>
          </div>
        </nav>
      </div>
      {tabData
        .filter((tab) => tab.name.toLowerCase() === tabValue)
        .map((tab, index) => (
          <Header title={tab.name} description={tab.description} key={index} />
        ))}
      <style jsx>{`
        nav {
          background: rgb(255, 255, 255);
          box-shadow: inset 0 -1px rgb(234, 234, 234);
        }
        nav.fixed {
          z-index: 999;
          box-shadow: rgba(0, 0, 0, 0.1) 0 0 15px 0;
        }
        .inner :global(.content) {
          display: none;
        }
        .inner :global(.tabs),
        .inner :global(header) {
          height: 100%;
          border: none;
          width: calc(100% - 2px);
        }
        .inner :global(.tab) {
          color: rgb(102, 102, 102);
          padding-top: 0;
          padding-bottom: 0;
          font-size: 0.875rem;
          height: calc(100% - 2px);
        }
        .inner :global(.active),
        .inner :global(.tab):hover {
          color: rgb(0, 0, 0);
        }
      `}</style>
    </>
  );
};

export default Menu;
