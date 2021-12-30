import React, {
  CSSProperties,
  useContext,
  ReactNode,
  useState,
  MouseEvent,
} from 'react';
import { createPortal } from 'react-dom';
import lang, { Languages, Locale, zhCN } from '../locale';
import {
  PluginMethods,
  EEEditorContext,
  getEditorRootDomNode,
} from '@eeeditor/editor';
import { AtomicBlockProps } from '@eeeditor/editor/es/built-in/atomic-block-toolbar';
import { cropIcon } from '../assets/extraIcons';
import { Tooltip } from 'antd';
import classNames from 'classnames';
import Cropper from 'react-cropper';

import 'cropperjs/dist/cropper.css';

export interface CropButtonProps {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
  languages?: Languages;
}

export interface CropButtonExtraProps {
  // RadioButton 提供
  btnKey?: string;
  activeBtn?: string;
  changeActiveBtn?: (activeBtn: string) => void;
  // ToolbarPopover 提供
  placement?: 'top' | 'bottom';
  pluginMethods?: PluginMethods;
  getBlockProps?: () => Partial<AtomicBlockProps>;
}

const CropButtonComponent: React.FC<CropButtonProps & CropButtonExtraProps> = (
  props,
) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    style,
    languages = lang,
    btnKey,
    activeBtn,
    changeActiveBtn,
    placement,
    pluginMethods,
    getBlockProps,
  } = props;

  const { getProps, getEditorRef, getEditorState } = pluginMethods;

  // image src
  const { offsetKey } = getBlockProps();
  // const { src } = getEditorState().getCurrentContent().getEntity(block.getEntityAt(0)).getData();
  const imgEl = getEditorRootDomNode(getEditorRef()).querySelector(
    `[data-block="true"][data-offset-key="${offsetKey}"] img`,
  );

  let locale: Locale = zhCN;
  if (getProps && languages) {
    const { locale: currLocale } = getProps();
    locale = languages[currLocale] || zhCN;
  }

  const { getPrefixCls } = useContext(EEEditorContext);
  const prefixCls = getPrefixCls(undefined, customizePrefixCls);

  // 非受控组件使用
  const [active, setActive] = useState<boolean>(false);

  const handleBtnClick = (e: MouseEvent): void => {
    if (btnKey) {
      const newActiveBtn = activeBtn === btnKey ? '' : btnKey;
      changeActiveBtn(newActiveBtn);
    } else {
      setActive(!active);
    }
  };

  const getContainer = () => {
    if (getEditorRef()) {
      return getEditorRootDomNode(getEditorRef()).ownerDocument.querySelector(
        `[data-block="true"][data-offset-key="${
          getBlockProps().offsetKey
        }"] img`,
      ).parentElement;
    }
    return null;
  };

  const getTipTitle = (name: string): ReactNode => (
    <span className={`${prefixCls}-tip`}>
      <span className={`${prefixCls}-tip-name`}>{locale[name] || name}</span>
    </span>
  );

  const btnCls = classNames(`${prefixCls}-popover-button`, className, {
    [`${prefixCls}-popover-button-active`]: btnKey
      ? activeBtn === btnKey
      : active,
  });

  return (
    <>
      <Tooltip
        title={getTipTitle('eeeditor.image.crop')}
        placement={placement}
        overlayClassName={`${prefixCls}-tip-wrapper`}
      >
        <span className={btnCls} style={style} onClick={handleBtnClick}>
          {cropIcon}
        </span>
      </Tooltip>
      {(btnKey ? activeBtn === btnKey : active) &&
        getContainer() &&
        createPortal(
          <Cropper
            className={`${prefixCls}-crop-wrapper`}
            viewMode={1}
            // src={URL.createObjectURL()}
            modal={false}
            movable={false}
            rotatable={false}
            scalable={false}
            zoomable={false}
            checkCrossOrigin={false}
          />,
          getContainer(),
        )}
    </>
  );
};

export const CropButton: React.FC<CropButtonProps> = (props) => (
  <CropButtonComponent {...props} />
);

export default CropButton;
