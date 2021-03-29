import React from 'react';

export interface CodeComponentProps {
  prefixCls?: string;
}

const CodeComponent: React.FC<CodeComponentProps> = (props) => {
  const { prefixCls = 'eee' } = props;

  return <span className={`${prefixCls}-inline-code`}>yyy</span>;
};

export default CodeComponent;
