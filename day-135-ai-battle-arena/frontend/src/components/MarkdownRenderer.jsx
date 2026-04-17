import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function MarkdownRenderer({ content }) {
  return (
    <div className="prose prose-sm md:prose-base max-w-none text-[#939eb5] prose-strong:text-[#dee5ff] prose-headings:text-[#dee5ff] prose-a:text-[#7bd0ff]">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          code({node, inline, className, children, ...props}) {
            const match = /language-(\w+)/.exec(className || '')
            return !inline ? (
              <div className="rounded-md overflow-hidden my-4 bg-[#00173d] border border-[#12244e]">
                <div className="px-4 py-2 bg-[#00225a] text-xs text-[#5b74b1] font-mono flex justify-between items-center">
                  <span>{match ? match[1] : 'code'}</span>
                </div>
                <div className="p-4 overflow-x-auto text-sm text-[#dee5ff] font-mono">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </div>
              </div>
            ) : (
              <code className="bg-[#00225a] px-1.5 py-0.5 rounded text-sm text-[#7bd0ff] font-mono" {...props}>
                {children}
              </code>
            )
          },
          p: ({children}) => <p className="mb-4 last:mb-0 leading-relaxed">{children}</p>,
          ul: ({children}) => <ul className="list-disc pl-5 mb-4 space-y-1">{children}</ul>,
          ol: ({children}) => <ol className="list-decimal pl-5 mb-4 space-y-1">{children}</ol>,
          h1: ({children}) => <h1 className="text-xl font-bold mb-4 text-[#dee5ff]">{children}</h1>,
          h2: ({children}) => <h2 className="text-lg font-bold mb-3 text-[#dee5ff]">{children}</h2>,
          h3: ({children}) => <h3 className="text-base font-bold mb-3 text-[#dee5ff]">{children}</h3>,
          strong: ({children}) => <strong className="font-bold text-[#dee5ff]">{children}</strong>,
          em: ({children}) => <em className="italic text-[#dee5ff]">{children}</em>,
          li: ({children, ...props}) => <li className="text-[#939eb5] marker:text-[#5b74b1] marker:font-bold" {...props}>{children}</li>,
          a: ({href, children}) => <a href={href} className="text-[#7bd0ff] hover:underline">{children}</a>,
          blockquote: ({children}) => <blockquote className="border-l-4 border-[#12244e] pl-4 py-1 italic text-[#5b74b1]">{children}</blockquote>
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default MarkdownRenderer;
