import dynamic from 'next/dynamic'

const TextEditorDynamic = dynamic(
  () => import('./TextEditor'),
  { ssr: false }
)


export default TextEditorDynamic;