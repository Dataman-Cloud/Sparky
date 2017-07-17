import baseFormRule from './formRule'
import baseFormConstructor from './formConstructor'
import formAppend from './formAppend'

let app = Object.assign({}, baseFormRule, baseFormConstructor, formAppend)

export default app
