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
  
  const [code, setCode] = useState(`function sum(){
    return a+b;
    }`);

  const [review, setReview] = useState(``);

  useEffect(() => {
    prism.highlightAll()
  })


  async function reviewCode(){
    
    const response = await axios.post('http://localhost:3000/ai/get-review', { code })

    setReview(response.data);
  }
  


  return (
    <>
      <main>
        <div className="left">
          <div className="code">
            <Editor
              value={code}
              onValueChange={code => setCode(code)}
              highlight={code => prism.highlight(code, prism.languages.js, 'js')}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 16,
                width: "100%",
                height: "100%",
                borderRadius: "5px",
              }}
            />
          </div>
          <div onClick={reviewCode} className="review">Review</div>
        </div>
        <div className="right">
          <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
        </div>
      </main>
    </>
  )
}

export default App
