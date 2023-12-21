import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Button, notification } from "antd";

export default function Markdown({ content }: { content: string }) {
  const [api, contextHolder] = notification.useNotification();
  //   Add the CodeCopyBtn component to our PRE element
  const code = "";
  const Pre = ({ node, ...props }: any) => (
    <>
      <Button
        type="primary"
        onClick={() => {
          const text = String(props.children.props.children);
          console.log("here");
          api.success({
            message: "Copied to clipboard",
            description: text,
          });
          navigator.clipboard.writeText(text);
        }}
      >
        Copy to clipboard
      </Button>
      <pre {...props} />
    </>
  );
  return (
    <>
      {contextHolder}
      <ReactMarkdown
        children={content}
        components={{
          pre: Pre,
          code(props) {
            const { children, className, node, ...rest } = props;
            const match = /language-(\w+)/.exec(className || "");
            return match ? (
              // @ts-ignore
              <SyntaxHighlighter
                {...rest}
                PreTag="div"
                children={String(children).replace(/\n$/, "")}
                language={match[1]}
                style={coldarkDark}
              />
            ) : (
              <code {...rest} className={className}>
                {children}
              </code>
            );
          },
        }}
      />
    </>
  );
}
