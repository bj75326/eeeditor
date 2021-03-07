import React, { CSSProperties } from 'react';
import classNames from 'classnames';

export interface SeparatorProps {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
}

const Separator: React.FC<SeparatorProps> = (props) => {
  const { prefixCls = 'eee', className, style } = props;

  const separatorCls = classNames(`${prefixCls}-separator`, className);

  return <div className={separatorCls} style={style} />;
};

export default Separator;
