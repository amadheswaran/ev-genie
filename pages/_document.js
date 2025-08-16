import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Tailwind CDN for rapid styling (ok for microsite / MVP). In production consider proper Tailwind build. */}
          <script src="https://cdn.tailwindcss.com"></script>

          <meta name="description" content="EV Helper — find EV charging stations, compare costs, and view state-wise EV subsidies in India." />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <body className="antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
