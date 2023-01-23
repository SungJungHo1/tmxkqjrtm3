
import Document, { Html, Head, Main, NextScript } from 'next/document'
import Script from "next/script"
class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang="ko">
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Open+Sans&display=swap"
            rel="stylesheet"
          />
        </Head>

        <body>
          {/* 채널톡 */}
          {/* <script
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: `(function() {
                var w = window;
                if (w.ChannelIO) {
                  return (window.console.error || window.console.log || function(){})('ChannelIO script included twice.');
                }
                var ch = function() {
                  ch.c(arguments);
                };
                ch.q = [];
                ch.c = function(args) {
                  ch.q.push(args);
                };
                w.ChannelIO = ch;
                function l() {
                  if (w.ChannelIOInitialized) {
                    return;
                  }
                  w.ChannelIOInitialized = true;
                  var s = document.createElement('script');
                  s.type = 'text/javascript';
                  s.async = true;
                  s.src = 'https://cdn.channel.io/plugin/ch-plugin-web.js';
                  s.charset = 'UTF-8';
                  var x = document.getElementsByTagName('script')[0];
                  x.parentNode.insertBefore(s, x);
                }
                if (document.readyState === 'complete') {
                  l();
                } else if (window.attachEvent) {
                  window.attachEvent('onload', l);
                } else {
                  window.addEventListener('DOMContentLoaded', l, false);
                  window.addEventListener('load', l, false);
                }
              })();
              ChannelIO('boot', {
                "pluginKey": "4744de45-9a2f-4655-83c7-814f1fab5ab9"
              });
	`}}
          /> */}
          {/* <div id="fb-root"></div>
          <div id="fb-customer-chat" className="fb-customerchat"></div>
          <script
            dangerouslySetInnerHTML={{
              __html: `
              var chatbox = document.getElementById('fb-customer-chat');
              chatbox.setAttribute("page_id", "105514625474268");
              chatbox.setAttribute("attribution", "biz_inbox");
        
              window.fbAsyncInit = function() {
                FB.init({
                  xfbml            : true,
                  version          : 'v14.0'
                });
              };
        
              (function(d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) return;
                js = d.createElement(s); js.id = id;
                js.src = 'https://connect.facebook.net/ko_KR/sdk/xfbml.customerchat.js';
                https://connect.facebook.net/ko_KR/sdk/xfbml.customerchat.js      
                fjs.parentNode.insertBefore(js, fjs);
              }(document, 'script', 'facebook-jssdk'));
          `
            }}
          /> */}
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument



