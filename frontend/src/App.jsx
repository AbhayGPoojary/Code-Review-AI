import { useEffect, useState } from 'react'
import "prismjs/themes/prism-tomorrow.css"
import Editor from "react-simple-code-editor"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/github-dark.css"
import prism from "prismjs"
import axios from "axios"
import './App.css'

function App() {
  
  const [code, setCode] = useState(`function sum(a, b) {
  return a + b;
}

// Example usage
const result = sum(5, 3);
console.log(result);`);

  const [review, setReview] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    prism.highlightAll()
  })

  async function reviewCode() {
    if (!code.trim()) return;
    
    setIsLoading(true);
    
    try {
      const response = await axios.post('http://localhost:3000/ai/get-review', { code });
      setReview(response.data);
    } catch (error) {
      setReview('## Error\n\nFailed to get code review. Please check your connection and try again.');
      console.error('Review failed:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>

    <div className="copyright-notice">
      <span className="copyright-symbol">©</span>
      2024 Abhay G Poojary
    </div>

      <div className="app-header">
        <div>
          <div className="app-title">Code Review AI</div>
          <div className="app-subtitle">Intelligent code analysis and suggestions</div>
        </div>
      </div>
      
      <main>
        <div className="left">
          <div className="code">
            <Editor
              value={code}
              onValueChange={code => setCode(code)}
              highlight={code => prism.highlight(code, prism.languages.js, 'js')}
              padding={24}
              style={{
                fontFamily: '"JetBrains Mono", "Fira code", "Fira Mono", monospace',
                fontSize: 14,
                width: "100%",
                height: "100%",
                borderRadius: "16px",
                lineHeight: 1.6,
                caretColor: "#ffd700",
              }}
              textareaProps={{
                placeholder: "// Enter your code here...\n// The AI will analyze it and provide suggestions",
              }}
            />
          </div>
          <button 
            onClick={reviewCode} 
            className={`review ${isLoading ? 'loading' : ''}`}
            disabled={isLoading || !code.trim()}
          >
            {isLoading ? 'Analyzing...' : 'Review Code'}
          </button>
        </div>
        
        <div className="right">
          {review ? (
            <div className="markdown-content">
              <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">🤖</div>
              <div className="empty-state-text">Ready to review your code</div>
              <div className="empty-state-subtext">
                Write some code and click "Review Code" to get AI-powered insights
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}

export default App