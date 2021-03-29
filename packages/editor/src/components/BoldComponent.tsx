import React from 'react';

export interface BoldComponentProps {
  prefixCls?: string;
}

const BoldComponent: React.FC<BoldComponentProps> = (props) => {
  console.log('11111');
  const { prefixCls = 'eee' } = props;

  return <span className={`${prefixCls}-bold`}>xxx</span>;
};

export default BoldComponent;
