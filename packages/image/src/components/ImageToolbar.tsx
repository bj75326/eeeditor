import React, { useContext } from 'react';
import {
  ToolbarPopover,
  ToolbarPopoverProps,
  EEEditorContext,
  RadioGroup,
  Separator,
  SelectorGroup,
  CopyButton,
} from '@eeeditor/editor';
import ResizeButton from './ResizeButton';
import CropButton from './CropButton';
import ResetButton from './ResetButton';
import lang, { Languages, zhCN, Locale } from '../locale';
import {
  AlignCenterButton,
  AlignLeftButton,
  AlignRightButton,
} from '@eeeditor/buttons';
import { TooltipPropsWithTitle } from 'antd/es/tooltip';

export interface ImageToolbarProps {
  prefixCls?: string;
  className?: string;
  store: ToolbarPopoverProps['store'];
  languages: Languages;
}

const ImageToolbar: React.FC<ImageToolbarProps> = (props) => {
  const { prefixCls: customizePrefixCls, className, store, languages } = props;

  const { getPrefixCls, textDirectionality } = useContext(EEEditorContext);
  const prefixCls = getPrefixCls(undefined, customizePrefixCls);

  let locale: Locale = zhCN;
  const { getProps } = store.getItem('pluginMethods');
  if (getProps && languages) {
    const { locale: currLocale } = getProps();
    locale = languages[currLocale] || zhCN;
  }

  const selectGroupBtnTip: Partial<Omit<TooltipPropsWithTitle, 'title'>> = {
    placement: textDirectionality === 'RTL' ? 'left' : 'right',
  };

  return (
    <ToolbarPopover className={className} store={store}>
      <RadioGroup>
        <ResizeButton />
        <CropButton />
      </RadioGroup>
      <Separator />
      <ResetButton />
      <Separator />
      <SelectorGroup>
        <AlignLeftButton
          className={`${prefixCls}-popover-button`}
          title={{
            name: 'eeeditor.button.align.left.tip.name',
          }}
          tipProps={selectGroupBtnTip}
        />
        <AlignCenterButton
          className={`${prefixCls}-popover-button`}
          title={{
            name: 'eeeditor.button.align.center.tip.name',
          }}
          tipProps={selectGroupBtnTip}
        />
        <AlignRightButton
          className={`${prefixCls}-popover-button`}
          title={{
            name: 'eeeditor.button.align.right.tip.name',
          }}
          tipProps={selectGroupBtnTip}
        />
      </SelectorGroup>
      <Separator />
      <CopyButton languages={lang} />
    </ToolbarPopover>
  );
};

export default ImageToolbar;
