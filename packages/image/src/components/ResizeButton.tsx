import React, {
  CSSProperties,
  useState,
  ReactNode,
  useContext,
  MouseEvent,
  useRef,
  useEffect,
} from 'react';
import { createPortal } from 'react-dom';
import { resizeIcon } from '../assets/extraIcons';
import {
  PluginMethods,
  EEEditorContext,
  getEditorRootDomNode,
} from '@eeeditor/editor';
import lang, { Languages, Locale, zhCN } from '../locale';
import { AtomicBlockProps } from '@eeeditor/editor/es/built-in/atomic-block-toolbar';
import { Tooltip } from 'antd';
import classNames from 'classnames';
import addEventListener from 'rc-util/lib/Dom/addEventListener';
import updateImageSize from '../modifiers/updateImageSize';
import { convertBarPosition } from './Image';

export interface ResizeButtonProps {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
  languages?: Languages;
}

export interface ResizeButtonExtraProps {
  // RadioButton 提供
  btnKey?: string;
  activeBtn?: string;
  changeActiveBtn?: (activeBtn: string) => void;
  // ToolbarPopover 提供
  placement?: 'top' | 'bottom';
  pluginMethods?: PluginMethods;
  getBlockProps?: () => Partial<AtomicBlockProps>;
}

const ResizeButtonComponent: React.FC<
  ResizeButtonProps & ResizeButtonExtraProps
> = (props) => {
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

  const { getProps, getEditorRef, setEditorState, getEditorState } =
    pluginMethods;

  let locale: Locale = zhCN;
  if (getProps && languages) {
    const { locale: currLocale } = getProps();
    locale = languages[currLocale] || zhCN;
  }

  const { getPrefixCls } = useContext(EEEditorContext);
  const prefixCls = getPrefixCls(undefined, customizePrefixCls);

  // 非受控组件使用
  const [active, setActive] = useState<boolean>(false);

  // resize 是否进行中
  const [resizing, setResizing] = useState<boolean>(false);

  // x 轴位移
  const [offsetX, setOffsetX] = useState<number>();

  const handleBtnClick = (e: MouseEvent): void => {
    if (btnKey) {
      const newActiveBtn = activeBtn === btnKey ? '' : btnKey;
      changeActiveBtn(newActiveBtn);
    } else {
      setActive(!active);
    }
  };

  // 存放每次 resize 开始时的 clientX
  const startXRef = useRef<number>();
  // 存放每次 resize 点击的 resize handler
  const handlerRef = useRef<'tl' | 'tr' | 'br' | 'bl'>();
  // 存放每次 resize 开始时的 img 长宽比例
  const ratioRef = useRef<number>();
  // 存放每次 resize 开始时 container 宽度
  const widthRef = useRef<number>();

  const onMouseDown = (e: MouseEvent): void => {
    e.preventDefault();
    // 确定 resize 开始时的 clientX
    startXRef.current = e.clientX;
    // 确定 resize handler 位置
    handlerRef.current = (e.target as HTMLDivElement).className
      .split(' ')
      .find((className) => className.startsWith(`${prefixCls}-resizer`))
      .slice(-2) as 'tl' | 'tr' | 'br' | 'bl';

    const container = getContainer();
    // 确定 resize img 原始尺寸
    ratioRef.current = container.offsetWidth / container.offsetHeight;
    // 保存 width
    widthRef.current = container.offsetWidth;

    setOffsetX(null);
  };

  const onMouseMove = (e: MouseEvent) => {
    e.preventDefault();
    if (typeof startXRef.current === 'number') {
      // resize 开始
      setResizing(true);

      // clientX 发生变化
      // if (((handlerRef.current === 'tl' || handlerRef.current === 'bl') && (e.clientX - startXRef.current) < widthRef.current) ||
      //   ((handlerRef.current === 'tr' || handlerRef.current === 'br') && (e.clientX - startXRef.current) > -widthRef.current)) {
      setOffsetX(e.clientX);
      // }
    }
  };

  const onMouseUp = (e: MouseEvent) => {
    e.preventDefault();
    if (typeof startXRef.current === 'number') {
      // resize 结束
      setResizing(false);

      // 重置 startX， handler 位置，img 长宽比
      startXRef.current = null;
      handlerRef.current = null;
      ratioRef.current = null;
      widthRef.current = null;

      // 重置 x 轴位移
      setOffsetX(null);

      // 将新的尺寸信息写入 block data
      const { block } = getBlockProps();
      const blockData = block.getData();

      const cropL = convertBarPosition(blockData.get('cropL'));
      const cropR = convertBarPosition(blockData.get('cropR'));
      const cropBasedWidth = blockData.get('cropBasedWidth');

      let width: number = null;
      if (cropL && cropR && cropBasedWidth) {
        const cropWidth = cropR.x - cropL.x;
        width = (resizeBoxRef.current.offsetWidth * cropBasedWidth) / cropWidth;
      } else {
        width = resizeBoxRef.current.offsetWidth;
      }
      setEditorState(updateImageSize(getEditorState(), width));
    }
  };

  useEffect(() => {
    if (btnKey ? btnKey === activeBtn : active) {
      const cleanMouseMoveHandler = addEventListener(
        window,
        'mousemove',
        onMouseMove,
      );
      const cleanMouseUpHandler = addEventListener(
        window,
        'mouseup',
        onMouseUp,
      );

      return () => {
        cleanMouseMoveHandler.remove();
        cleanMouseUpHandler.remove();
      };
    }
  }, [btnKey, activeBtn, active]);

  // resize mode 下 image 的样式修改
  // useEffect(() => {
  //   const imageWrapper = getContainer();
  //   const resizeCls = `${prefixCls}-resize-mode`;
  //   if (imageWrapper  && (btnKey ? btnKey === activeBtn : active)) {
  //     imageWrapper.classList.add(resizeCls);
  //   } else {
  //    imageWrapper.classList.remove(resizeCls);
  //   }
  // }, [btnKey, activeBtn, active]);

  const getContainer = (): HTMLElement => {
    if (getEditorRef()) {
      return getEditorRootDomNode(getEditorRef()).ownerDocument.querySelector(
        `[data-block="true"][data-offset-key="${
          getBlockProps().offsetKey
        }"] [data-container="true"]`,
      );
    }
    return null;
  };

  const getTipTitle = (name: string): ReactNode => (
    <span className={`${prefixCls}-tip`}>
      <span className={`${prefixCls}-tip-name`}>{locale[name] || name}</span>
    </span>
  );

  const getResizeBoxInset = (): { inset: string } => {
    if (typeof offsetX === 'number' && typeof widthRef.current === 'number') {
      let inset = '';
      switch (handlerRef.current) {
        case 'tl':
          const tlOffset =
            offsetX - startXRef.current <= widthRef.current
              ? offsetX - startXRef.current
              : widthRef.current;
          inset = `${tlOffset / ratioRef.current}px 0px 0px ${tlOffset}px`;
          break;
        case 'tr':
          const trOffset =
            startXRef.current - offsetX <= widthRef.current
              ? startXRef.current - offsetX
              : widthRef.current;
          inset = `${trOffset / ratioRef.current}px ${trOffset}px 0px 0px`;
          break;
        case 'br':
          const brOffset =
            startXRef.current - offsetX <= widthRef.current
              ? startXRef.current - offsetX
              : widthRef.current;
          inset = `0px ${brOffset}px ${brOffset / ratioRef.current}px 0px`;
          break;
        case 'bl':
          const blOffset =
            offsetX - startXRef.current <= widthRef.current
              ? offsetX - startXRef.current
              : widthRef.current;
          inset = `0px 0px ${blOffset / ratioRef.current}px ${blOffset}px`;
          break;
      }
      return { inset };
    }
    return null;
  };

  const resizeBoxRef = useRef<HTMLDivElement>();

  const getResizeBoxSize = (): string => {
    if (resizeBoxRef.current) {
      return `${resizeBoxRef.current.offsetWidth} x ${resizeBoxRef.current.offsetHeight}`;
    }
    return '';
  };

  const btnCls = classNames(`${prefixCls}-popover-button`, className, {
    [`${prefixCls}-popover-button-active`]: btnKey
      ? activeBtn === btnKey
      : active,
  });

  const boxCls = classNames(`${prefixCls}-resize-box`, {
    [`${prefixCls}-resizing`]: resizing,
  });

  return (
    <>
      <Tooltip
        title={getTipTitle('eeeditor.image.resize')}
        placement={placement}
        overlayClassName={`${prefixCls}-tip-wrapper`}
      >
        <span className={btnCls} style={style} onClick={handleBtnClick}>
          {resizeIcon}
        </span>
      </Tooltip>
      {(btnKey ? activeBtn === btnKey : active) &&
        getContainer() &&
        createPortal(
          <>
            <div
              className={boxCls}
              style={getResizeBoxInset()}
              data-size={getResizeBoxSize()}
              ref={resizeBoxRef}
            >
              <span
                className={`${prefixCls}-resizer ${prefixCls}-resizer-tl`}
              ></span>
              <span
                className={`${prefixCls}-resizer ${prefixCls}-resizer-tr`}
              ></span>
              <span
                className={`${prefixCls}-resizer ${prefixCls}-resizer-br`}
              ></span>
              <span
                className={`${prefixCls}-resizer ${prefixCls}-resizer-bl`}
              ></span>
            </div>
            <div
              className={`${prefixCls}-resize-handler ${prefixCls}-resizer-tl`}
              onMouseDown={onMouseDown}
            ></div>
            <div
              className={`${prefixCls}-resize-handler ${prefixCls}-resizer-tr`}
              onMouseDown={onMouseDown}
            ></div>
            <div
              className={`${prefixCls}-resize-handler ${prefixCls}-resizer-br`}
              onMouseDown={onMouseDown}
            ></div>
            <div
              className={`${prefixCls}-resize-handler ${prefixCls}-resizer-bl`}
              onMouseDown={onMouseDown}
            ></div>
          </>,
          getContainer(),
        )}
    </>
  );
};

export const ResizeButton: React.FC<ResizeButtonProps> = (props) => (
  <ResizeButtonComponent {...props} />
);

export default ResizeButton;
