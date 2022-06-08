import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useCurrentState } from '@geist-ui/core';

const DEFAULT_LOCALE = '';
const DEFAULT_TAB = '';

type LocaleTypes = {
  locale: string;
  tabbar: string;
};

const useLocale = (): LocaleTypes => {
  const { pathname } = useRouter();

  const [locale, setLocale, localeRef] = useCurrentState<string>(DEFAULT_LOCALE);
  const [tabbar, setTab, tabRef] = useCurrentState<string>(DEFAULT_TAB);

  useEffect(() => {
    const paths = pathname.split('/').filter((r) => !!r);
    const currentLocale = paths[0] || DEFAULT_LOCALE;
    const currentTab = paths[1] || DEFAULT_TAB;

    if (currentLocale !== localeRef.current) setLocale(currentLocale);
    if (currentTab !== tabRef.current) setTab(currentTab);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return { locale, tabbar };
};

export default useLocale;
