import type { DocumentContext, DocumentInitialProps } from 'next/document';
import { Fragment } from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { CssBaseline } from '@geist-ui/core';

class MyDocument extends Document {
  static getInitialProps = async (ctx: DocumentContext): Promise<DocumentInitialProps> => {
    const initialProps = await Document.getInitialProps(ctx);
    const styles = CssBaseline.flush();

    return {
      ...initialProps,
      styles: [
        <Fragment key="1">
          {initialProps.styles}
          {styles}
        </Fragment>,
      ],
    };
  };

  render(): JSX.Element {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
