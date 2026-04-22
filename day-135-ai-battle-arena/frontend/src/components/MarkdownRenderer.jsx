import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function MarkdownRenderer({ content }) {
  return (
    <div className="prose prose-sm md:prose-base max-w-none" style={{ color: 'var(--prose-body)' }}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          code({node, inline, className, children, ...props}) {
            const match = /language-(\w+)/.exec(className || '')
            return !inline ? (
              <div className="rounded-md overflow-hidden my-4" style={{ backgroundColor: 'var(--code-bg)', border: '1px solid var(--border)' }}>
                <div className="px-4 py-2 text-xs font-mono flex justify-between items-center" style={{ backgroundColor: 'var(--code-header-bg)', color: 'var(--code-header-text)' }}>
                  <span>{match ? match[1] : 'code'}</span>
                </div>
                <div className="p-4 overflow-x-auto text-sm font-mono" style={{ color: 'var(--code-text)' }}>
                  <code className={className} {...props}>
                    {children}
                  </code>
                </div>
              </div>
            ) : (
              <code className="px-1.5 py-0.5 rounded text-sm font-mono" style={{ backgroundColor: 'var(--code-inline-bg)', color: 'var(--code-inline-text)' }} {...props}>
                {children}
              </code>
            )
          },
          p: ({children}) => <p className="mb-4 last:mb-0 leading-relaxed">{children}</p>,
          ul: ({children}) => <ul className="list-disc pl-5 mb-4 space-y-1">{children}</ul>,
          ol: ({children}) => <ol className="list-decimal pl-5 mb-4 space-y-1">{children}</ol>,
          h1: ({children}) => <h1 className="text-xl font-bold mb-4" style={{ color: 'var(--prose-heading)' }}>{children}</h1>,
          h2: ({children}) => <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--prose-heading)' }}>{children}</h2>,
          h3: ({children}) => <h3 className="text-base font-bold mb-3" style={{ color: 'var(--prose-heading)' }}>{children}</h3>,
          strong: ({children}) => <strong className="font-bold" style={{ color: 'var(--prose-strong)' }}>{children}</strong>,
          em: ({children}) => <em className="italic" style={{ color: 'var(--prose-heading)' }}>{children}</em>,
          li: ({children, ...props}) => <li style={{ color: 'var(--prose-body)' }} {...props}>{children}</li>,
          a: ({href, children}) => <a href={href} className="hover:underline" style={{ color: 'var(--prose-link)' }}>{children}</a>,
          blockquote: ({children}) => <blockquote className="pl-4 py-1 italic" style={{ borderLeft: '4px solid var(--blockquote-border)', color: 'var(--blockquote-text)' }}>{children}</blockquote>
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default MarkdownRenderer;
