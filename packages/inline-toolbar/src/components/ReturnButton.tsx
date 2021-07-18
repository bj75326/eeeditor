import React, { useContext, MouseEvent, ReactElement } from 'react';
import { EEEditorContext } from '@eeeditor/editor';
import { returnIcon } from '../assets/extraIcon';

export interface ReturnButtonProps {
  onOverride?: (overrideContent: ReactElement | ReactElement[]) => void;
}

const ReturnButton: React.FC<ReturnButtonProps> = (props) => {
  const { onOverride } = props;

  const { getPrefixCls } = useContext(EEEditorContext);
  const prefixCls = getPrefixCls('btn');

  const preventBubblingUp = (event: MouseEvent): void => {
    event.preventDefault();
  };

  const handleOverride = () => {
    onOverride(null);
  };

  return (
    <div className={`${prefixCls}-wrapper`} onMouseDown={preventBubblingUp}>
      <div className={`${prefixCls}`} onClick={handleOverride}>
        {returnIcon}
      </div>
    </div>
  );
};

export default ReturnButton;
