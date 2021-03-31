
# EditorPlugin

initialize: PluginEditor 在 constructor 的时候依次执行，可以传递的参数有：
  getPlugins
  getProps
  setEditorState
  getEditorState
  getReadOnly
  setReadOnly
  getEditorRef

onChange: PluginEditor 在执行自己的 onChange 的时候先依次执行 Plugins 的 onChange，之后再执行 Props 传递的 onChange

0.11.0+ 中文字符不可以undo的问题 issue #2876

customStyleMap 在需要多种 theme 的时候，customStyleMap 需要为每种 theme 适配

