import React from "react";
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type Props = {
    message: string 
}

const MarkdownRenderer = ({ message }: Props) => {
    //const markdown = typeof children === 'string' ? children : ''
    return (
        <div className="prose max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message}
            </ReactMarkdown>
        </div>
    )
}

export default MarkdownRenderer