import ThemeDefault from 'vitepress/theme'
import CodeGroup from './components/CodeGroup.vue'
import Feedback from '@betahuhn/feedback-js'
import postJson from './util/util.js'

import 'virtual:windi.css'
import './style/index.scss'

const FEEDBACK_SRV = 'http://164.92.190.45'

export default {
  ...ThemeDefault,
  enhanceApp({ app }) {
    app.component('CodeGroup', CodeGroup)
        new Feedback({
            events: true,
            emailField: true,
            primary: '#bb0000',
            types: {
                suggestion: {
                    text: 'Suggestion',
                    icon: '💡'
                },
                error: {
                    text: 'Error',
                    icon: '🐞'
                },
            },
        }).renderButton()
        window.addEventListener('feedback-submit', (event) => {
            postJson(event['detail'], `${FEEDBACK_SRV}/feedback/form`)
        })
  },
}
