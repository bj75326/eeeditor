import React, { useState, useEffect } from 'react';
import { connect, ConnectProps } from 'umi';
import EEEditor from '@/components/eeeditor';
import { StateType } from './model';

import './index.less';

export interface PageProps extends ConnectProps {
  title: StateType['title'];
  content: StateType['content'];
}

const Page: React.FC<PageProps> = (props) => {
  const { title, content } = props;

  return (
    <div className="main">
      <header className="header"></header>
    </div>
  );
};

export default connect(({ page }: { page: StateType }) => ({
  title: page.title,
  content: page.content,
}))(Page);
