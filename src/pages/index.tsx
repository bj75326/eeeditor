import React from 'react';
import { connect, ConnectProps } from 'umi';

import './index.less';

export interface PageProps extends ConnectProps {}

const Page: React.FC<PageProps> = () => {
  return <div></div>;
};

export default connect(({}) => ({}))(Page);
