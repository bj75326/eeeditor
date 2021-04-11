import React, { CSSProperties } from 'react';
import classNames from 'classnames';

export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
}

const Divider: React.FC<DividerProps> = (props) => {
  return <hr></hr>;
};

export default Divider;
