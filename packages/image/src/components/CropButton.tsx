import React, {
  CSSProperties,
  useContext,
  ReactNode,
  useState,
  MouseEvent,
  useEffect,
} from 'react';
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
import { createPortal } from 'react-dom';

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

  // // image src
  // const { offsetKey } = getBlockProps();
  // // const { src } = getEditorState().getCurrentContent().getEntity(block.getEntityAt(0)).getData();
  // const imgEl = getEditorRootDomNode(getEditorRef()).querySelector(
  //   `[data-block="true"][data-offset-key="${offsetKey}"] img`,
  // );

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

  // resize mode 下 image 的样式修改
  // useEffect(() => {
  //   const imageWrapper = getContainer();
  //   const cropCls = `${prefixCls}-crop-mode`;
  //   if (imageWrapper && (btnKey ? btnKey === activeBtn : active)) {
  //     imageWrapper.classList.add(cropCls);
  //   } else {
  //     imageWrapper.classList.remove(cropCls);
  //   }
  // }, [btnKey, activeBtn, active]);

  const getContainer = () => {
    if (getEditorRef()) {
      return getEditorRootDomNode(getEditorRef()).ownerDocument.querySelector(
        `[data-block="true"][data-offset-key="${getBlockProps().offsetKey
        }"] [data-container="true"]`);
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
      {(btnKey ? btnKey === activeBtn : active) && 
        getContainer() &&
        createPortal(
          <div className={`${prefixCls}-crop-box`}>
            <div className={`${prefixCls}-crop-screen`}>
              <div className={`${prefixCls}-crop-area`} style={{ width: '500px', height: '300px'}}>
                <div className={`${prefixCls}-crop-handlers`}>
                  <div className={`${prefixCls}-crop-handler ${prefixCls}-crop-handler-tl`}>
                    <div className={`${prefixCls}-crop-handler-outer`} style={{width: '20px', height: '5px', top: 0, left: 0}}></div>
                    <div className={`${prefixCls}-crop-handler-inner`} style={{width: '18px', height: '3px', top: '1px', left: '1px'}}></div>
                    <div className={`${prefixCls}-crop-handler-outer`} style={{width: '5px', height: '15px', top: '5px', left: 0}}></div>
                    <div className={`${prefixCls}-crop-handler-inner`} style={{ width: '3px', height: '18px', top: '1px', left: '1px'}}></div>
                  </div>
                  <div className={`${prefixCls}-crop-handler ${prefixCls}-crop-handler-t`}></div>
                  <div className={`${prefixCls}-crop-handler ${prefixCls}-crop-handler-tr`}></div>
                  <div className={`${prefixCls}-crop-handler ${prefixCls}-crop-handler-l`}></div>
                  <div className={`${prefixCls}-crop-handler ${prefixCls}-crop-handler-r`}></div>
                  <div className={`${prefixCls}-crop-handler ${prefixCls}-crop-handler-bl`}></div>
                  <div className={`${prefixCls}-crop-handler ${prefixCls}-crop-handler-b`}></div>
                  <div className={`${prefixCls}-crop-handler ${prefixCls}-crop-handler-br`}></div>
                </div>
              </div>
            </div>    
          </div>
          , getContainer()
        )
      }
    </>
  );
};

export const CropButton: React.FC<CropButtonProps> = (props) => (
  <CropButtonComponent {...props} />
);

export default CropButton;
