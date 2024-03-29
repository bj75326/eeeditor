import React, { CSSProperties, useContext } from 'react';
import classNames from 'classnames';
import { EEEditorContext } from '../../../Editor';

export interface SeparatorProps {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
}

export const Separator: React.FC<SeparatorProps> = (props) => {
  const { prefixCls: customizePrefixCls, className, style } = props;

  const { getPrefixCls } = useContext(EEEditorContext);
  const prefixCls = getPrefixCls('', customizePrefixCls);

  const separatorCls = classNames(`${prefixCls}-popover-separator`, className);

  return <span className={separatorCls} style={style} />;
};

export default Separator;
