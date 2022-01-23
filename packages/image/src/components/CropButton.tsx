import React, {
  CSSProperties,
  useContext,
  ReactNode,
  useState,
  MouseEvent,
  useEffect,
  useRef,
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
import addEventListener from 'rc-util/lib/Dom/addEventListener';

// 偏移常量
const OFFSET: number = 1.5;
// 角 handler 尺寸
const CORNER_SIZE: number = 21;
// 边 handler 尺寸
const SIDE_WIDTH: number = 34;
const SIDE_HEIGHT: number = 3;
// 最小距离
const MIN_GAP: number = 13;

interface CropBarPosition {
  x: number;
  y: number;
}

const convertBarPosition = (position: string): CropBarPosition => {
  const coords: string[] = position.split(',');
  if (coords.length !== 2) {
    return {
      x: 0,
      y: 0,
    };
  }
  return {
    x: +coords[0].trim(),
    y: +coords[1].trim(),
  };
};

// const transformPosition = (position: CropBarPosition, svgElement: SVGSVGElement): SVGPoint => {
//   const point = svgElement.createSVGPoint();
//   point.x = position.x;
//   point.y = position.y;
//   const CTM = svgElement.getScreenCTM();
//   return point.matrixTransform(CTM.inverse());
// };

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

  // state 记录 clientX clientY 变化量
  const [x, setX] = useState<number>();
  const [y, setY] = useState<number>();

  // ref 记录 crop bar 位置
  // const [cropTl, setCropTl] = useState<CropBarPosition>({ x: 0, y: 0 });
  // const [cropT, setCropT] = useState<CropBarPosition>({x: 0, y: 0});
  // const [cropTr, setCropTr] = useState<CropBarPosition>({ x: 0, y: 0 });
  // const [cropL, setCropL] = useState<CropBarPosition>({ x: 0, y: 0 });
  // const [cropR, setCropR] = useState<CropBarPosition>({ x: 0, y: 0 });
  // const [cropBl, setCropBl] = useState<CropBarPosition>({ x: 0, y: 0 });
  // const [cropB, setCropB] = useState<CropBarPosition>({ x: 0, y: 0 });
  // const [cropBr, setCropBr] = useState<CropBarPosition>({ x: 0, y: 0 });
  const cropTl = useRef<CropBarPosition>({ x: 0, y: 0 });
  const cropT = useRef<CropBarPosition>({ x: 0, y: 0 });
  const cropTr = useRef<CropBarPosition>({ x: 0, y: 0 });
  const cropL = useRef<CropBarPosition>({ x: 0, y: 0 });
  const cropR = useRef<CropBarPosition>({ x: 0, y: 0 });
  const cropBl = useRef<CropBarPosition>({ x: 0, y: 0 });
  const cropB = useRef<CropBarPosition>({ x: 0, y: 0 });
  const cropBr = useRef<CropBarPosition>({ x: 0, y: 0 });

  // resize mode 下 image 的样式修改
  useEffect(() => {
    if (btnKey ? btnKey === activeBtn : active) {
      // crop 初始化
      // image & viewport 样式初始化
      const image = getImg();
      if (image) {
        image.style.transformOrigin = '50% 50%';
        image.style.transform = 'translate(0%, 0%)';
      }
      const viewport = image.parentElement;
      if (viewport) {
        viewport.style.width = `${image.naturalWidth}px`;
      }
      // crop bar position 初始化
      const { block } = getBlockProps();
      // setCropTl(convertBarPosition(block.getData().get('cropTl') || '-1.5,-1.5'));
      // setCropT(convertBarPosition(block.getData().get('cropT') || `${image.offsetWidth / 2 - 17},-1.5`));
      // setCropTr(convertBarPosition(block.getData().get('cropTr') || `${image.offsetWidth - 21 + 1.5},-1.5`));
      // setCropL(convertBarPosition(block.getData().get('cropL') || `-17,${image.offsetHeight / 2 - 1.5}`));
      // setCropR(convertBarPosition(block.getData().get('cropR') || `${image.offsetWidth - 17},${image.offsetHeight / 2 - 1.5}`));
      // setCropBl(convertBarPosition(block.getData().get('cropBr') || `-1.5,${image.offsetHeight - 21 + 1.5} `));
      // setCropB(convertBarPosition(block.getData().get('cropB') || `${image.offsetWidth / 2 - 17},${image.offsetHeight - 1.5}`));
      // setCropBr(convertBarPosition(block.getData().get('cropBl') || `${image.offsetWidth - 21 + 1.5},${image.offsetHeight - 21 + 1.5}` ));
      cropTl.current = convertBarPosition(
        block.getData().get('cropTl') || `${-OFFSET},${-OFFSET}`,
      );
      cropT.current = convertBarPosition(
        block.getData().get('cropT') ||
          `${image.offsetWidth / 2 - SIDE_WIDTH / 2},${-SIDE_HEIGHT / 2}`,
      );
      cropTr.current = convertBarPosition(
        block.getData().get('cropTr') ||
          `${image.offsetWidth - CORNER_SIZE + OFFSET},${-OFFSET}`,
      );
      cropL.current = convertBarPosition(
        block.getData().get('cropL') ||
          `${-SIDE_WIDTH / 2},${image.offsetHeight / 2 - SIDE_HEIGHT / 2}`,
      );
      cropR.current = convertBarPosition(
        block.getData().get('cropR') ||
          `${image.offsetWidth - SIDE_WIDTH / 2},${
            image.offsetHeight / 2 - SIDE_HEIGHT / 2
          }`,
      );
      cropBl.current = convertBarPosition(
        block.getData().get('cropBr') ||
          `${-OFFSET},${image.offsetHeight - CORNER_SIZE + OFFSET} `,
      );
      cropB.current = convertBarPosition(
        block.getData().get('cropB') ||
          `${image.offsetWidth / 2 - SIDE_WIDTH / 2},${
            image.offsetHeight - SIDE_HEIGHT / 2
          }`,
      );
      cropBr.current = convertBarPosition(
        block.getData().get('cropBl') ||
          `${image.offsetWidth - CORNER_SIZE + OFFSET},${
            image.offsetHeight - CORNER_SIZE + OFFSET
          }`,
      );

      setX(0);
      setY(0);
    }
  }, [btnKey, activeBtn, active]);

  // 存放每次 crop 开始时的 clientX clientY
  const startXRef = useRef<number>();
  const startYRef = useRef<number>();

  // 存放每次 crop 点击的 crop handler
  const handlerRef = useRef<
    'tl' | 't' | 'tr' | 'l' | 'r' | 'bl' | 'b' | 'br'
  >();

  // mousedown
  const onMouseDown = (e: MouseEvent): void => {
    e.preventDefault();

    const targetClassList = (e.target as SVGElement).classList;
    if (
      targetClassList.contains(`${prefixCls}-crop-handler`) ||
      targetClassList.contains(`${prefixCls}-crop-bar`)
    ) {
      // 确定 bar
      handlerRef.current = Array.from(targetClassList)
        .find((className) => className.startsWith(`${prefixCls}-cropper`))
        .split('-')
        .pop() as 'tl' | 't' | 'tr' | 'l' | 'r' | 'bl' | 'b' | 'br';
      // 确定起始位置
      startXRef.current = e.clientX;
      startYRef.current = e.clientY;
    }
  };

  const onMouseMove = (e: MouseEvent): void => {
    e.preventDefault();
    if (typeof startXRef.current === 'number') {
      const x = e.clientX - startXRef.current;
      const y = e.clientY - startYRef.current;

      const image = getImg();
      // setX(x);
      // setY(y);
      switch (handlerRef.current) {
        case 'tl':
          if (cropTl.current.x + x <= -OFFSET) {
            setX(-OFFSET - cropTl.current.x);
          } else if (cropTl.current.x + x >= cropTr.current.x - MIN_GAP) {
            setX(cropTr.current.x - MIN_GAP - cropTl.current.x);
          } else {
            setX(x);
          }
          if (cropTl.current.y + y <= -OFFSET) {
            setY(-OFFSET - cropTl.current.y);
          } else if (cropTl.current.y + y >= cropBl.current.y - MIN_GAP) {
            setY(cropBl.current.y - MIN_GAP - cropTl.current.y);
          } else {
            setY(y);
          }
          break;
        case 't':
          setX(0);
          if (cropT.current.y + y <= -SIDE_HEIGHT / 2) {
            setY(-SIDE_HEIGHT / 2 - cropT.current.y);
          } else if (cropT.current.y + y >= cropB.current.y - MIN_GAP) {
            setY(cropB.current.y - MIN_GAP - cropT.current.y);
          } else {
            setY(y);
          }
          break;
        case 'tr':
          if (cropTr.current.x + x <= cropTl.current.x + MIN_GAP) {
            setX(cropTl.current.x + MIN_GAP - cropTr.current.x);
          } else if (
            cropTr.current.x + x >=
            image.offsetWidth - CORNER_SIZE + OFFSET
          ) {
            setX(image.offsetWidth - CORNER_SIZE + OFFSET - cropTr.current.x);
          } else {
            setX(x);
          }
          if (cropTr.current.y + y <= -OFFSET) {
            setY(-OFFSET - cropTr.current.y);
          } else if (cropTr.current.y + y >= cropBr.current.y - MIN_GAP) {
            setY(cropBr.current.y - MIN_GAP - cropTr.current.y);
          } else {
            setY(y);
          }
          break;
        case 'l':
          if (cropL.current.x + x <= -SIDE_WIDTH / 2) {
            setX(-SIDE_WIDTH / 2 - cropL.current.x);
          } else if (cropL.current.x + x >= cropR.current.x - MIN_GAP) {
            setX(cropR.current.x - MIN_GAP - cropL.current.x);
          } else {
            setX(x);
          }
          setY(0);
          break;
        case 'r':
          if (cropR.current.x + x <= cropL.current.x + MIN_GAP) {
            setX(cropL.current.x + MIN_GAP - cropR.current.x);
          } else if (
            cropR.current.x + x >=
            image.offsetWidth - SIDE_WIDTH / 2
          ) {
            setX(image.offsetWidth - SIDE_WIDTH / 2 - cropR.current.x);
          } else {
            setX(x);
          }
          setY(0);
          break;
        case 'bl':
          if (cropBl.current.x + x <= -OFFSET) {
            setX(-OFFSET - cropBl.current.x);
          } else if (cropBl.current.x + x >= cropBr.current.x - MIN_GAP) {
            setX(cropBr.current.x - MIN_GAP - cropBl.current.x);
          } else {
            setX(x);
          }
          if (cropBl.current.y + y <= cropTl.current.y + MIN_GAP) {
            setY(cropTl.current.y + MIN_GAP - cropBl.current.y);
          } else if (
            cropBl.current.y + y >=
            image.offsetWidth - CORNER_SIZE + OFFSET
          ) {
            setY(image.offsetWidth - CORNER_SIZE + OFFSET - cropBl.current.y);
          } else {
            setY(y);
          }
          break;
        case 'b':
          setX(0);
          if (cropB.current.y + y <= cropT.current.y + MIN_GAP) {
            setY(cropT.current.y + MIN_GAP - cropB.current.y);
          } else if (
            cropB.current.y + y >=
            image.offsetHeight - SIDE_HEIGHT / 2
          ) {
            setY(image.offsetHeight - SIDE_HEIGHT / 2 - cropB.current.y);
          } else {
            setY(y);
          }
          break;
        case 'br':
          if (cropBr.current.x + x <= cropBl.current.x + MIN_GAP) {
            setX(cropBl.current.x + MIN_GAP - cropBr.current.x);
          } else if (
            cropBr.current.x + x >=
            image.offsetWidth - CORNER_SIZE + OFFSET
          ) {
            setX(image.offsetWidth - CORNER_SIZE + OFFSET - cropBr.current.x);
          } else {
            setX(x);
          }
          if (cropBr.current.y + y <= cropTr.current.y + MIN_GAP) {
            setY(cropTr.current.y + MIN_GAP - cropBr.current.y);
          } else if (
            cropBr.current.y + y >=
            image.offsetHeight - CORNER_SIZE + OFFSET
          ) {
            setY(image.offsetHeight - CORNER_SIZE + OFFSET - cropBr.current.y);
          }
          break;
      }
    }
  };

  const onMouseUp = (e: MouseEvent): void => {
    e.preventDefault();
    if (typeof startXRef.current === 'number') {
      startXRef.current = null;
      startYRef.current = null;

      handlerRef.current = null;
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

  // 根据 x, y 计算出当前各个 crop bar 位置
  const getCropBarPosition = () => {
    if (handlerRef.current) {
      switch (handlerRef.current) {
        case 'tl':
          return {
            cropTl: {
              x: cropTl.current.x + x,
              y: cropTl.current.y + y,
            },
            cropT: {
              x:
                (cropTl.current.x + x + cropTr.current.x + CORNER_SIZE) / 2 -
                SIDE_WIDTH / 2,
              y: cropT.current.y + y,
            },
            cropTr: {
              x: cropTr.current.x,
              y: cropTr.current.y + y,
            },
            cropL: {
              x: cropL.current.x + x,
              y:
                (cropTl.current.y + y + cropBl.current.y + CORNER_SIZE) / 2 -
                SIDE_HEIGHT / 2,
            },
            cropR: {
              x: cropR.current.x,
              y:
                (cropTl.current.y + y + cropBl.current.y + CORNER_SIZE) / 2 -
                SIDE_HEIGHT / 2,
            },
            cropBl: {
              x: cropBl.current.x + x,
              y: cropBl.current.y,
            },
            cropB: {
              x:
                (cropTl.current.x + x + cropTr.current.x + CORNER_SIZE) / 2 -
                SIDE_WIDTH / 2,
              y: cropB.current.y,
            },
            cropBr: cropBr.current,
          };
        case 't':
          return {};
        case 'tr':
          return {};
        case 'l':
          return {};
        case 'r':
          return {};
        case 'bl':
          return {};
        case 'b':
          return {};
        case 'br':
          return {};
      }
    }
    return {
      cropTl: cropTl.current,
      cropT: cropT.current,
      cropTr: cropTr.current,
      cropL: cropL.current,
      cropR: cropR.current,
      cropBl: cropBl.current,
      cropB: cropB.current,
      cropBr: cropBr.current,
    };
  };

  const position = getCropBarPosition();

  const getContainer = () => {
    if (getEditorRef()) {
      return getEditorRootDomNode(getEditorRef()).ownerDocument.querySelector(
        `[data-block="true"][data-offset-key="${
          getBlockProps().offsetKey
        }"] [data-container="true"]`,
      );
    }
    return null;
  };

  const getImg = () => {
    if (getContainer()) {
      return getContainer().querySelector('img');
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
            <svg onMouseDown={onMouseDown}>
              <defs>
                <g id="corner">
                  <path d="M18.5,-0.5 C19.0522847,-0.5 19.5522847,-0.276142375 19.9142136,0.0857864376 C20.2761424,0.44771525 20.5,0.94771525 20.5,1.5 C20.5,2.05228475 20.2761424,2.55228475 19.9142136,2.91421356 C19.5522847,3.27614237 19.0522847,3.5 18.5,3.5 L18.5,3.5 L3.5,3.5 L3.5,18.5 C3.5,19.0522847 3.27614237,19.5522847 2.91421356,19.9142136 C2.55228475,20.2761424 2.05228475,20.5 1.5,20.5 C0.94771525,20.5 0.44771525,20.2761424 0.0857864376,19.9142136 C-0.276142375,19.5522847 -0.5,19.0522847 -0.5,18.5 L-0.5,18.5 L-0.5,3 C-0.5,2.07071993 -0.137819527,1.2260429 0.453035214,0.599369341 C1.05065491,-0.0344792808 1.88229773,-0.445093206 2.80972104,-0.494902783 L2.80972104,-0.494902783 Z"></path>
                </g>
                <g id="handle">
                  <rect width="34" height="3" rx="1.5"></rect>
                </g>
              </defs>
              <g transform="translate(4, 4)">
                <path
                  className={`${prefixCls}-crop-mask`}
                  fillRule="nonzero"
                  d={`M0,0 h${getImg()!.offsetWidth} v${
                    getImg()!.offsetHeight
                  } h-${getImg()!.offsetWidth} z
            M${position.cropTl.x + OFFSET},${position.cropTl.y + OFFSET} v${
                    position.cropBl.y -
                    OFFSET +
                    CORNER_SIZE -
                    (position.cropTl.y + OFFSET)
                  }
            h${
              position.cropBr.x -
              OFFSET +
              CORNER_SIZE -
              (position.cropBl.x + OFFSET)
            } v${
                    position.cropTr.y +
                    OFFSET -
                    (position.cropBr.y - OFFSET) -
                    CORNER_SIZE
                  } z`}
                ></path>
                <path
                  className={`${prefixCls}-crop-area`}
                  d={`M${position.cropTl.x + OFFSET},${
                    position.cropTl.y + OFFSET
                  } v${
                    position.cropBl.y -
                    OFFSET +
                    CORNER_SIZE -
                    (position.cropTl.y + OFFSET)
                  }
            h${
              position.cropBr.x -
              OFFSET +
              CORNER_SIZE -
              (position.cropBl.x + OFFSET)
            } v${
                    position.cropTr.y +
                    OFFSET -
                    (position.cropBr.y - OFFSET) -
                    CORNER_SIZE
                  } z`}
                ></path>
                <rect
                  className={`${prefixCls}-crop-handler ${prefixCls}-cropper-tl`}
                  x={position.cropTl.x}
                  y={position.cropTl.y}
                  width={`${CORNER_SIZE}`}
                  height={`${CORNER_SIZE}`}
                ></rect>
                <use
                  x={position.cropTl.x}
                  y={position.cropTl.y}
                  transform={`rotate(0 ${
                    (position.cropTl.x + position.cropTl.x + CORNER_SIZE) / 2
                  } ${
                    (position.cropTl.y + position.cropTl.y + CORNER_SIZE) / 2
                  })`}
                  xlinkHref="#corner"
                  className={`${prefixCls}-crop-bar ${prefixCls}-cropper-tl`}
                ></use>
                <use
                  x={position.cropT.x}
                  y={position.cropT.y}
                  transform={`rotate(0 ${
                    (position.cropT.x + position.cropT.x + SIDE_WIDTH) / 2
                  } ${
                    (position.cropT.y + position.cropT.y + SIDE_HEIGHT) / 2
                  })`}
                  xlinkHref="#handle"
                  className={`${prefixCls}-crop-bar ${prefixCls}-cropper-t`}
                ></use>
                <rect
                  className={`${prefixCls}-crop-handler ${prefixCls}-cropper-tr`}
                  x={position.cropTr.x}
                  y={position.cropTr.y}
                  width={`${CORNER_SIZE}`}
                  height={`${CORNER_SIZE}`}
                ></rect>
                <use
                  x={position.cropTr.x}
                  y={position.cropTr.y}
                  transform={`rotate(90 ${
                    (position.cropTr.x + position.cropTr.x + CORNER_SIZE) / 2
                  } ${
                    (position.cropTr.y + position.cropTr.y + CORNER_SIZE) / 2
                  })`}
                  xlinkHref="#corner"
                  className={`${prefixCls}-crop-bar ${prefixCls}-cropper-tr`}
                ></use>
                <use
                  x={position.cropL.x}
                  y={position.cropL.y}
                  transform={`rotate(90 ${
                    (position.cropL.x + position.cropL.x + SIDE_WIDTH) / 2
                  } ${
                    (position.cropL.y + position.cropL.y + SIDE_HEIGHT) / 2
                  })`}
                  xlinkHref="#handle"
                  className={`${prefixCls}-crop-bar ${prefixCls}-cropper-l`}
                ></use>
                <use
                  x={position.cropR.x}
                  y={position.cropR.y}
                  transform={`rotate(90 ${
                    (position.cropR.x + position.cropR.x + SIDE_WIDTH) / 2
                  } ${
                    (position.cropR.y + position.cropR.y + SIDE_HEIGHT) / 2
                  })`}
                  xlinkHref="#handle"
                  className={`${prefixCls}-crop-bar ${prefixCls}-cropper-r`}
                ></use>
                <rect
                  className={`${prefixCls}-crop-handler ${prefixCls}-cropper-bl`}
                  x={position.cropBl.x}
                  y={position.cropBl.y}
                  width={`${CORNER_SIZE}`}
                  height={`${CORNER_SIZE}`}
                ></rect>
                <use
                  x={position.cropBl.x}
                  y={position.cropBl.y}
                  transform={`rotate(270 ${
                    (position.cropBl.x + position.cropBl.x + CORNER_SIZE) / 2
                  } ${
                    (position.cropBl.y + position.cropBl.y + CORNER_SIZE) / 2
                  })`}
                  xlinkHref="#corner"
                  className={`${prefixCls}-crop-bar ${prefixCls}-cropper-bl`}
                ></use>
                <use
                  x={position.cropB.x}
                  y={position.cropB.y}
                  transform={`rotate(0 ${
                    (position.cropB.x + position.cropB.x + SIDE_WIDTH) / 2
                  } ${
                    (position.cropB.y + position.cropB.y + SIDE_HEIGHT) / 2
                  })`}
                  xlinkHref="#handle"
                  className={`${prefixCls}-crop-bar ${prefixCls}-cropper-b`}
                ></use>
                <rect
                  className={`${prefixCls}-crop-handler ${prefixCls}-cropper-br`}
                  x={position.cropBr.x}
                  y={position.cropBr.y}
                  width={`${CORNER_SIZE}`}
                  height={`${CORNER_SIZE}`}
                ></rect>
                <use
                  x={position.cropBr.x}
                  y={position.cropBr.y}
                  transform={`rotate(180 ${
                    (position.cropBr.x + position.cropBr.x + CORNER_SIZE) / 2
                  } ${
                    (position.cropBr.y + position.cropBr.y + CORNER_SIZE) / 2
                  })`}
                  xlinkHref="#corner"
                  className={`${prefixCls}-crop-bar ${prefixCls}-cropper-br`}
                ></use>
              </g>
            </svg>
          </div>,
          getContainer(),
        )}
    </>
  );
};

export const CropButton: React.FC<CropButtonProps> = (props) => (
  <CropButtonComponent {...props} />
);

export default CropButton;
