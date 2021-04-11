import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { SITE_NAME } from './constants'



ReactDOM.render(
    <React.StrictMode>
            <App siteName={SITE_NAME} />
    </React.StrictMode>,
    document.getElementById('root')
)