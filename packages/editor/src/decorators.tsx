import { DraftDecorator, CompositeDecorator } from 'draft-js';
import BoldComponent from './components/BoldComponent';

// customStyleMap 存在局限性，比如不支持对 css 伪类，多主题样式的支持等，所以 EEEditor 使用 decorator 添加 classname

const boldDecorator: DraftDecorator = {
  strategy: (block, callback, contentState) => {
    console.log('bold strategy!!!!!!');
    block.findStyleRanges((value) => value.hasStyle('BOLD'), callback);
  },
  component: BoldComponent,
};

const decorators = new CompositeDecorator([boldDecorator]);

export default decorators;
