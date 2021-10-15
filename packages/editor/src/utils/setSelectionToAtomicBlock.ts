// 类似 img 标签点击不能触发 onSelect 事件，所以使用 setSelectionToAtomicBlock 手动触发
export const setSelectionToAtomicBlock = (node: Node): void => {
  const selection = window.getSelection();
  const range = document.createRange();
  range.setStart(node, 0);
  range.setEnd(node, 0);

  selection.removeAllRanges();
  selection.addRange(range);
};

export default setSelectionToAtomicBlock;
