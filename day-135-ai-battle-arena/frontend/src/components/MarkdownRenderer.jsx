import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function MarkdownRenderer({ content }) {
  return (
    <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-slate-900 dark:text-gray-100">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          code({node, inline, className, children, ...props}) {
            const match = /language-(\w+)/.exec(className || '')
            return !inline ? (
              <div className="rounded-md overflow-hidden my-4 bg-slate-900 border border-slate-800">
                <div className="px-4 py-2 bg-slate-800/50 text-xs text-slate-400 font-mono flex justify-between items-center">
                  <span>{match ? match[1] : 'code'}</span>
                </div>
                <div className="p-4 overflow-x-auto text-sm text-slate-300 font-mono">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </div>
              </div>
            ) : (
              <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-sm text-blue-600 dark:text-blue-400 font-mono" {...props}>
                {children}
              </code>
            )
          },
          p: ({children}) => <p className="mb-4 last:mb-0 leading-relaxed">{children}</p>,
          ul: ({children}) => <ul className="list-disc pl-5 mb-4 space-y-1">{children}</ul>,
          ol: ({children}) => <ol className="list-decimal pl-5 mb-4 space-y-1">{children}</ol>,
          h1: ({children}) => <h1 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">{children}</h1>,
          h2: ({children}) => <h2 className="text-lg font-bold mb-3 text-slate-900 dark:text-white">{children}</h2>,
          h3: ({children}) => <h3 className="text-base font-bold mb-3 text-slate-900 dark:text-white">{children}</h3>,
          a: ({href, children}) => <a href={href} className="text-blue-600 dark:text-blue-400 hover:underline">{children}</a>,
          blockquote: ({children}) => <blockquote className="border-l-4 border-slate-300 dark:border-slate-700 pl-4 py-1 italic text-slate-600 dark:text-slate-400">{children}</blockquote>
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default MarkdownRenderer;
