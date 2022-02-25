import React, {
  CSSProperties,
  useContext,
  ReactNode,
  useState,
  MouseEvent,
  useLayoutEffect,
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
import updateCropPositions from '../modifiers/updateCropPositions';

// 偏移常量
export const OFFSET: number = 1.5;
// 角 handler 尺寸
export const CORNER_SIZE: number = 21;
// 边 handler 尺寸
export const SIDE_WIDTH: number = 34;
export const SIDE_HEIGHT: number = 3;
// 最小距离
export const MIN_GAP: number = 13;

export interface CropBarPosition {
  x: number;
  y: number;
}

type Positions = {
  cropTl?: CropBarPosition;
  cropT?: CropBarPosition;
  cropTr?: CropBarPosition;
  cropL?: CropBarPosition;
  cropR?: CropBarPosition;
  cropBl?: CropBarPosition;
  cropB?: CropBarPosition;
  cropBr?: CropBarPosition;
};

const convertBarPosition = (
  position: string,
  ratio: number,
): CropBarPosition => {
  const coords: string[] = position.split(',');
  if (coords.length !== 2) {
    return null;
  }
  return {
    x: +coords[0].trim() * ratio,
    y: +coords[1].trim() * ratio,
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

  const { getProps, getEditorRef, getEditorState, setEditorState } =
    pluginMethods;

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
  // cropBasedWidth 记录 crop 时 cropbox 的宽度
  const cropBasedWidth = useRef<number>();

  // resize mode 下 image 的样式修改
  useLayoutEffect(() => {
    if (btnKey ? btnKey === activeBtn : active) {
      // crop 初始化
      // image & viewport 样式初始化
      const image = getImg();

      if (!image) return;

      image.style.position = 'relative';
      image.style.top = '0px';
      image.style.left = '0px';

      const { block } = getBlockProps();
      const blockData = block.getData();
      image.style.width = `${blockData.get('width') || image.naturalWidth}px`;
      image.style.maxWidth = '100%';

      const viewport = image.parentElement;
      if (viewport) {
        viewport.style.width = 'auto';
        viewport.style.height = 'auto';
      }
      // crop bar position 初始化
      cropBasedWidth.current = image.offsetWidth;

      const prevCropBasedWidth = blockData.get('cropBasedWidth');
      let ratio: number = null;
      if (prevCropBasedWidth) {
        ratio = cropBasedWidth.current / prevCropBasedWidth;
      }

      // cropTl.current = convertBarPosition(
      //   block.getData().get('cropTl') || `${-OFFSET},${-OFFSET}`,
      // );
      cropTl.current = ratio
        ? convertBarPosition(blockData.get('cropTl'), ratio)
        : { x: -OFFSET, y: -OFFSET };
      // cropT.current = convertBarPosition(
      //   block.getData().get('cropT') ||
      //     `${image.offsetWidth / 2 - SIDE_WIDTH / 2},${-SIDE_HEIGHT / 2}`,
      // );
      cropT.current = ratio
        ? convertBarPosition(blockData.get('cropT'), ratio)
        : { x: image.offsetWidth / 2 - SIDE_WIDTH / 2, y: -SIDE_HEIGHT / 2 };
      // cropTr.current = convertBarPosition(
      //   block.getData().get('cropTr') ||
      //     `${image.offsetWidth - CORNER_SIZE + OFFSET},${-OFFSET}`,
      // );
      cropTr.current = ratio
        ? convertBarPosition(blockData.get('cropTr'), ratio)
        : { x: image.offsetWidth - CORNER_SIZE + OFFSET, y: -OFFSET };
      // cropL.current = convertBarPosition(
      //   block.getData().get('cropL') ||
      //     `${-SIDE_WIDTH / 2},${image.offsetHeight / 2 - SIDE_HEIGHT / 2}`,
      // );
      cropL.current = ratio
        ? convertBarPosition(blockData.get('cropL'), ratio)
        : { x: -SIDE_WIDTH / 2, y: image.offsetHeight / 2 - SIDE_HEIGHT / 2 };
      // cropR.current = convertBarPosition(
      //   block.getData().get('cropR') ||
      //     `${image.offsetWidth - SIDE_WIDTH / 2},${
      //       image.offsetHeight / 2 - SIDE_HEIGHT / 2
      //     }`,
      // );
      cropR.current = ratio
        ? convertBarPosition(blockData.get('cropR'), ratio)
        : {
            x: image.offsetWidth - SIDE_WIDTH / 2,
            y: image.offsetHeight / 2 - SIDE_HEIGHT / 2,
          };
      // cropBl.current = convertBarPosition(
      //   block.getData().get('cropBl') ||
      //     `${-OFFSET},${image.offsetHeight - CORNER_SIZE + OFFSET} `,
      // );
      cropBl.current = ratio
        ? convertBarPosition(blockData.get('cropBl'), ratio)
        : { x: -OFFSET, y: image.offsetHeight - CORNER_SIZE + OFFSET };
      // cropB.current = convertBarPosition(
      //   block.getData().get('cropB') ||
      //     `${image.offsetWidth / 2 - SIDE_WIDTH / 2},${
      //       image.offsetHeight - SIDE_HEIGHT / 2
      //     }`,
      // );
      cropB.current = ratio
        ? convertBarPosition(blockData.get('cropB'), ratio)
        : {
            x: image.offsetWidth / 2 - SIDE_WIDTH / 2,
            y: image.offsetHeight - SIDE_HEIGHT / 2,
          };
      // cropBr.current = convertBarPosition(
      //   block.getData().get('cropBr') ||
      //     `${image.offsetWidth - CORNER_SIZE + OFFSET},${
      //       image.offsetHeight - CORNER_SIZE + OFFSET
      //     }`,
      // );
      cropBr.current = ratio
        ? convertBarPosition(blockData.get('cropBr'), ratio)
        : {
            x: image.offsetWidth - CORNER_SIZE + OFFSET,
            y: image.offsetHeight - CORNER_SIZE + OFFSET,
          };

      setX(0);
      setY(0);
    }
  }, [btnKey, activeBtn, active]);

  // 存放每次 crop 开始时的 clientX clientY
  const startXRef = useRef<number>();
  const startYRef = useRef<number>();

  // 存放每次 crop 点击的 crop handler
  const handlerRef = useRef<
    'tl' | 't' | 'tr' | 'l' | 'r' | 'bl' | 'b' | 'br' | 'area'
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
    if (targetClassList.contains(`${prefixCls}-crop-area`)) {
      handlerRef.current = 'area';
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
          } else if (
            cropT.current.y + y >=
            cropB.current.y - (MIN_GAP + CORNER_SIZE - OFFSET * 2)
          ) {
            setY(
              cropB.current.y -
                (MIN_GAP + CORNER_SIZE - OFFSET * 2) -
                cropT.current.y,
            );
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
          } else if (
            cropL.current.x + x >=
            cropR.current.x - (MIN_GAP + CORNER_SIZE - OFFSET * 2)
          ) {
            setX(
              cropR.current.x -
                (MIN_GAP + CORNER_SIZE - OFFSET * 2) -
                cropL.current.x,
            );
          } else {
            setX(x);
          }
          setY(0);
          break;
        case 'r':
          if (
            cropR.current.x + x <=
            cropL.current.x + (MIN_GAP + CORNER_SIZE - OFFSET * 2)
          ) {
            setX(
              cropL.current.x +
                (MIN_GAP + CORNER_SIZE - OFFSET * 2) -
                cropR.current.x,
            );
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
            image.offsetHeight - CORNER_SIZE + OFFSET
          ) {
            setY(image.offsetHeight - CORNER_SIZE + OFFSET - cropBl.current.y);
          } else {
            setY(y);
          }
          break;
        case 'b':
          setX(0);
          if (
            cropB.current.y + y <=
            cropT.current.y + (MIN_GAP + CORNER_SIZE - OFFSET * 2)
          ) {
            setY(
              cropT.current.y +
                (MIN_GAP + CORNER_SIZE - OFFSET * 2) -
                cropB.current.y,
            );
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
          } else {
            setY(y);
          }
          break;
        case 'area':
          if (cropL.current.x + x <= -SIDE_WIDTH / 2) {
            setX(-SIDE_WIDTH / 2 - cropL.current.x);
          } else if (
            cropR.current.x + x >=
            image.offsetWidth - SIDE_WIDTH / 2
          ) {
            setX(image.offsetWidth - SIDE_WIDTH / 2 - cropR.current.x);
          } else {
            setX(x);
          }
          if (cropT.current.y + y <= -SIDE_HEIGHT / 2) {
            setY(-SIDE_HEIGHT / 2 - cropT.current.y);
          } else if (
            cropB.current.y + y >=
            image.offsetHeight + SIDE_HEIGHT / 2
          ) {
            setY(image.offsetHeight + SIDE_HEIGHT / 2 - cropB.current.y);
          } else {
            setY(y);
          }
      }
    }
  };

  const onMouseUp = (e: MouseEvent): void => {
    e.preventDefault();
    if (typeof startXRef.current === 'number') {
      // 更改 ref 保存的坐标值
      const positions: Positions = {};
      ['tl', 't', 'tr', 'l', 'r', 'bl', 'b', 'br'].forEach(
        (position: string) => {
          // dom 获取 bar x, y attribute 值
          const bar = getContainer().querySelector(
            `.${prefixCls}-cropper-${position}`,
          );
          positions[
            `crop${position
              .split('')
              .map((value: string, index: number) =>
                index === 0 ? value.toUpperCase() : value,
              )
              .join('')}`
          ] = {
            x: +bar.getAttribute('x'),
            y: +bar.getAttribute('y'),
          };
        },
      );
      cropTl.current = positions.cropTl;
      cropT.current = positions.cropT;
      cropTr.current = positions.cropTr;
      cropL.current = positions.cropL;
      cropR.current = positions.cropR;
      cropBl.current = positions.cropBl;
      cropB.current = positions.cropB;
      cropBr.current = positions.cropBr;

      // 重置 ref
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

  // 什么时候将 position 保存到 block data ？
  // 1. CropButton active 时 unmount
  // 2. CropButton unactive 但 image 仍然保持 focused
  useEffect(() => {
    return () => {
      if (
        getContainer() &&
        getContainer().querySelector(`.${prefixCls}-crop-box`)
      ) {
        setEditorState(
          updateCropPositions(getEditorState(), getBlockProps().block, {
            cropBasedWidth: cropBasedWidth.current,
            cropTl: `${cropTl.current.x},${cropTl.current.y}`,
            cropT: `${cropT.current.x},${cropT.current.y}`,
            cropTr: `${cropTr.current.x},${cropTr.current.y}`,
            cropL: `${cropL.current.x},${cropL.current.y}`,
            cropR: `${cropR.current.x},${cropR.current.y}`,
            cropBl: `${cropBl.current.x},${cropBl.current.y}`,
            cropB: `${cropB.current.x},${cropB.current.y}`,
            cropBr: `${cropBr.current.x},${cropBr.current.y}`,
          }),
        );
      }
    };
  }, []);

  // 根据 x, y 计算出当前各个 crop bar 位置
  const getCropBarPositions = (): Positions => {
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
              (cropTr.current.y + y + cropBr.current.y + CORNER_SIZE) / 2 -
              SIDE_HEIGHT / 2,
          },
          cropBl: {
            x: cropBl.current.x + x,
            y: cropBl.current.y,
          },
          cropB: {
            x:
              (cropBl.current.x + x + cropBr.current.x + CORNER_SIZE) / 2 -
              SIDE_WIDTH / 2,
            y: cropB.current.y,
          },
          cropBr: cropBr.current,
        };
      case 't':
        return {
          cropTl: {
            x: cropTl.current.x,
            y: cropTl.current.y + y,
          },
          cropT: {
            x: cropT.current.x,
            y: cropT.current.y + y,
          },
          cropTr: {
            x: cropTr.current.x,
            y: cropTr.current.y + y,
          },
          cropL: {
            x: cropL.current.x,
            y:
              (cropTl.current.y + y + cropBl.current.y + CORNER_SIZE) / 2 -
              SIDE_HEIGHT / 2,
          },
          cropR: {
            x: cropR.current.x,
            y:
              (cropTr.current.y + y + cropBr.current.y + CORNER_SIZE) / 2 -
              SIDE_HEIGHT / 2,
          },
          cropBl: cropBl.current,
          cropB: cropB.current,
          cropBr: cropBr.current,
        };
      case 'tr':
        return {
          cropTl: {
            x: cropTl.current.x,
            y: cropTl.current.y + y,
          },
          cropT: {
            x:
              (cropTl.current.x + cropTr.current.x + x + CORNER_SIZE) / 2 -
              SIDE_WIDTH / 2,
            y: cropT.current.y + y,
          },
          cropTr: {
            x: cropTr.current.x + x,
            y: cropTr.current.y + y,
          },
          cropL: {
            x: cropL.current.x,
            y:
              (cropTl.current.y + y + cropBl.current.y + CORNER_SIZE) / 2 -
              SIDE_HEIGHT / 2,
          },
          cropR: {
            x: cropR.current.x + x,
            y:
              (cropTr.current.y + y + cropBr.current.y + CORNER_SIZE) / 2 -
              SIDE_HEIGHT / 2,
          },
          cropBl: cropBl.current,
          cropB: {
            x:
              (cropBl.current.x + cropBr.current.x + x + CORNER_SIZE) / 2 -
              SIDE_WIDTH / 2,
            y: cropB.current.y,
          },
          cropBr: {
            x: cropBr.current.x + x,
            y: cropBr.current.y,
          },
        };
      case 'l':
        return {
          cropTl: {
            x: cropTl.current.x + x,
            y: cropTl.current.y,
          },
          cropT: {
            x:
              (cropTl.current.x + x + cropTr.current.x + CORNER_SIZE) / 2 -
              SIDE_WIDTH / 2,
            y: cropT.current.y,
          },
          cropTr: cropTr.current,
          cropL: {
            x: cropL.current.x + x,
            y: cropL.current.y,
          },
          cropR: cropR.current,
          cropBl: {
            x: cropBl.current.x + x,
            y: cropBl.current.y,
          },
          cropB: {
            x:
              (cropBl.current.x + x + cropBr.current.x + CORNER_SIZE) / 2 -
              SIDE_WIDTH / 2,
            y: cropB.current.y,
          },
          cropBr: cropBr.current,
        };
      case 'r':
        return {
          cropTl: cropTl.current,
          cropT: {
            x:
              (cropTl.current.x + cropTr.current.x + x + CORNER_SIZE) / 2 -
              SIDE_WIDTH / 2,
            y: cropT.current.y,
          },
          cropTr: {
            x: cropTr.current.x + x,
            y: cropTr.current.y,
          },
          cropL: cropL.current,
          cropR: {
            x: cropR.current.x + x,
            y: cropR.current.y,
          },
          cropBl: cropBl.current,
          cropB: {
            x:
              (cropBl.current.x + cropBr.current.x + x + CORNER_SIZE) / 2 -
              SIDE_WIDTH / 2,
            y: cropB.current.y,
          },
          cropBr: {
            x: cropBr.current.x + x,
            y: cropBr.current.y,
          },
        };
      case 'bl':
        return {
          cropTl: {
            x: cropTl.current.x + x,
            y: cropTl.current.y,
          },
          cropT: {
            x:
              (cropTl.current.x + x + cropTr.current.x + CORNER_SIZE) / 2 -
              SIDE_WIDTH / 2,
            y: cropT.current.y,
          },
          cropTr: cropTr.current,
          cropL: {
            x: cropL.current.x + x,
            y:
              (cropTl.current.y + cropBl.current.y + y + CORNER_SIZE) / 2 -
              SIDE_HEIGHT / 2,
          },
          cropR: {
            x: cropR.current.x,
            y:
              (cropTr.current.y + cropBr.current.y + y + CORNER_SIZE) / 2 -
              SIDE_HEIGHT / 2,
          },
          cropBl: {
            x: cropBl.current.x + x,
            y: cropBl.current.y + y,
          },
          cropB: {
            x:
              (cropBl.current.x + x + cropBr.current.x + CORNER_SIZE) / 2 -
              SIDE_WIDTH / 2,
            y: cropB.current.y + y,
          },
          cropBr: {
            x: cropBr.current.x,
            y: cropBr.current.y + y,
          },
        };
      case 'b':
        return {
          cropTl: cropTl.current,
          cropT: cropT.current,
          cropTr: cropTr.current,
          cropL: {
            x: cropL.current.x,
            y:
              (cropTl.current.y + cropBl.current.y + y + CORNER_SIZE) / 2 -
              SIDE_HEIGHT / 2,
          },
          cropR: {
            x: cropR.current.x,
            y:
              (cropTr.current.y + cropBr.current.y + y + CORNER_SIZE) / 2 -
              SIDE_HEIGHT / 2,
          },
          cropBl: {
            x: cropBl.current.x,
            y: cropBl.current.y + y,
          },
          cropB: {
            x: cropB.current.x,
            y: cropB.current.y + y,
          },
          cropBr: {
            x: cropBr.current.x,
            y: cropBr.current.y + y,
          },
        };
      case 'br':
        return {
          cropTl: cropTl.current,
          cropT: {
            x:
              (cropTl.current.x + cropTr.current.x + x + CORNER_SIZE) / 2 -
              SIDE_WIDTH / 2,
            y: cropT.current.y,
          },
          cropTr: {
            x: cropTr.current.x + x,
            y: cropTr.current.y,
          },
          cropL: {
            x: cropL.current.x,
            y:
              (cropTl.current.y + cropBl.current.y + y + CORNER_SIZE) / 2 -
              SIDE_HEIGHT / 2,
          },
          cropR: {
            x: cropR.current.x + x,
            y:
              (cropTr.current.y + cropBr.current.y + y + CORNER_SIZE) / 2 -
              SIDE_HEIGHT / 2,
          },
          cropBl: {
            x: cropBl.current.x,
            y: cropBl.current.y + y,
          },
          cropB: {
            x:
              (cropBl.current.x + cropBr.current.x + x + CORNER_SIZE) / 2 -
              SIDE_WIDTH / 2,
            y: cropB.current.y + y,
          },
          cropBr: {
            x: cropBr.current.x + x,
            y: cropBr.current.y + y,
          },
        };
      case 'area':
        return {
          cropTl: {
            x: cropTl.current.x + x,
            y: cropTl.current.y + y,
          },
          cropT: {
            x: cropT.current.x + x,
            y: cropT.current.y + y,
          },
          cropTr: {
            x: cropTr.current.x + x,
            y: cropTr.current.y + y,
          },
          cropL: {
            x: cropL.current.x + x,
            y: cropL.current.y + y,
          },
          cropR: {
            x: cropR.current.x + x,
            y: cropR.current.y + y,
          },
          cropBl: {
            x: cropBl.current.x + x,
            y: cropBl.current.y + y,
          },
          cropB: {
            x: cropB.current.x + x,
            y: cropB.current.y + y,
          },
          cropBr: {
            x: cropBr.current.x + x,
            y: cropBr.current.y + y,
          },
        };
      default:
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
    }
  };

  const positions = getCropBarPositions();

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

  const areaCls = classNames(`${prefixCls}-crop-area`, {
    [`${prefixCls}-crop-area-moveable`]:
      positions.cropB.y - positions.cropT.y < getImg().offsetHeight ||
      positions.cropR.x - positions.cropL.x < getImg().offsetWidth,
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
            M${positions.cropTl.x + OFFSET},${positions.cropTl.y + OFFSET} v${
                    positions.cropBl.y -
                    OFFSET +
                    CORNER_SIZE -
                    (positions.cropTl.y + OFFSET)
                  }
            h${
              positions.cropBr.x -
              OFFSET +
              CORNER_SIZE -
              (positions.cropBl.x + OFFSET)
            } v${
                    positions.cropTr.y +
                    OFFSET -
                    (positions.cropBr.y - OFFSET) -
                    CORNER_SIZE
                  } z`}
                ></path>
                <path
                  className={areaCls}
                  d={`M${positions.cropTl.x + OFFSET},${
                    positions.cropTl.y + OFFSET
                  } v${
                    positions.cropBl.y -
                    OFFSET +
                    CORNER_SIZE -
                    (positions.cropTl.y + OFFSET)
                  }
            h${
              positions.cropBr.x -
              OFFSET +
              CORNER_SIZE -
              (positions.cropBl.x + OFFSET)
            } v${
                    positions.cropTr.y +
                    OFFSET -
                    (positions.cropBr.y - OFFSET) -
                    CORNER_SIZE
                  } z`}
                ></path>
                <rect
                  className={`${prefixCls}-crop-handler ${prefixCls}-cropper-tl`}
                  x={positions.cropTl.x}
                  y={positions.cropTl.y}
                  width={`${CORNER_SIZE}`}
                  height={`${CORNER_SIZE}`}
                ></rect>
                <use
                  x={positions.cropTl.x}
                  y={positions.cropTl.y}
                  transform={`rotate(0 ${
                    (positions.cropTl.x + positions.cropTl.x + CORNER_SIZE) / 2
                  } ${
                    (positions.cropTl.y + positions.cropTl.y + CORNER_SIZE) / 2
                  })`}
                  xlinkHref="#corner"
                  className={`${prefixCls}-crop-bar ${prefixCls}-cropper-tl`}
                ></use>
                <use
                  x={positions.cropT.x}
                  y={positions.cropT.y}
                  transform={`rotate(0 ${
                    (positions.cropT.x + positions.cropT.x + SIDE_WIDTH) / 2
                  } ${
                    (positions.cropT.y + positions.cropT.y + SIDE_HEIGHT) / 2
                  })`}
                  xlinkHref="#handle"
                  className={`${prefixCls}-crop-bar ${prefixCls}-cropper-t`}
                ></use>
                <rect
                  className={`${prefixCls}-crop-handler ${prefixCls}-cropper-tr`}
                  x={positions.cropTr.x}
                  y={positions.cropTr.y}
                  width={`${CORNER_SIZE}`}
                  height={`${CORNER_SIZE}`}
                ></rect>
                <use
                  x={positions.cropTr.x}
                  y={positions.cropTr.y}
                  transform={`rotate(90 ${
                    (positions.cropTr.x + positions.cropTr.x + CORNER_SIZE) / 2
                  } ${
                    (positions.cropTr.y + positions.cropTr.y + CORNER_SIZE) / 2
                  })`}
                  xlinkHref="#corner"
                  className={`${prefixCls}-crop-bar ${prefixCls}-cropper-tr`}
                ></use>
                <use
                  x={positions.cropL.x}
                  y={positions.cropL.y}
                  transform={`rotate(90 ${
                    (positions.cropL.x + positions.cropL.x + SIDE_WIDTH) / 2
                  } ${
                    (positions.cropL.y + positions.cropL.y + SIDE_HEIGHT) / 2
                  })`}
                  xlinkHref="#handle"
                  className={`${prefixCls}-crop-bar ${prefixCls}-cropper-l`}
                ></use>
                <use
                  x={positions.cropR.x}
                  y={positions.cropR.y}
                  transform={`rotate(90 ${
                    (positions.cropR.x + positions.cropR.x + SIDE_WIDTH) / 2
                  } ${
                    (positions.cropR.y + positions.cropR.y + SIDE_HEIGHT) / 2
                  })`}
                  xlinkHref="#handle"
                  className={`${prefixCls}-crop-bar ${prefixCls}-cropper-r`}
                ></use>
                <rect
                  className={`${prefixCls}-crop-handler ${prefixCls}-cropper-bl`}
                  x={positions.cropBl.x}
                  y={positions.cropBl.y}
                  width={`${CORNER_SIZE}`}
                  height={`${CORNER_SIZE}`}
                ></rect>
                <use
                  x={positions.cropBl.x}
                  y={positions.cropBl.y}
                  transform={`rotate(270 ${
                    (positions.cropBl.x + positions.cropBl.x + CORNER_SIZE) / 2
                  } ${
                    (positions.cropBl.y + positions.cropBl.y + CORNER_SIZE) / 2
                  })`}
                  xlinkHref="#corner"
                  className={`${prefixCls}-crop-bar ${prefixCls}-cropper-bl`}
                ></use>
                <use
                  x={positions.cropB.x}
                  y={positions.cropB.y}
                  transform={`rotate(0 ${
                    (positions.cropB.x + positions.cropB.x + SIDE_WIDTH) / 2
                  } ${
                    (positions.cropB.y + positions.cropB.y + SIDE_HEIGHT) / 2
                  })`}
                  xlinkHref="#handle"
                  className={`${prefixCls}-crop-bar ${prefixCls}-cropper-b`}
                ></use>
                <rect
                  className={`${prefixCls}-crop-handler ${prefixCls}-cropper-br`}
                  x={positions.cropBr.x}
                  y={positions.cropBr.y}
                  width={`${CORNER_SIZE}`}
                  height={`${CORNER_SIZE}`}
                ></rect>
                <use
                  x={positions.cropBr.x}
                  y={positions.cropBr.y}
                  transform={`rotate(180 ${
                    (positions.cropBr.x + positions.cropBr.x + CORNER_SIZE) / 2
                  } ${
                    (positions.cropBr.y + positions.cropBr.y + CORNER_SIZE) / 2
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
