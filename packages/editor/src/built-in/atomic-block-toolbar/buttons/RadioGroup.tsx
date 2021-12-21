import React, { ReactElement, useState } from 'react';
import { PluginMethods } from '../../..';
import { AtomicBlockProps } from '..';

export interface RadioGroupProps {
  children?: ReactElement | ReactElement[];
}

export interface RadioGroupExtraProps {
  placement: 'top' | 'bottom';
  pluginMethods: PluginMethods;
  getBlockProps: () => Partial<AtomicBlockProps>;
}

export const RadioGroup: React.FC<RadioGroupProps & RadioGroupExtraProps> = (
  props,
) => {
  const { children, ...restProps } = props;

  const [activeBtn, setActiveBtn] = useState<string>('');

  const changeActiveBtn = (activeBtn: string): void => {
    setActiveBtn(activeBtn);
  };

  return (
    <>
      {React.Children.map<ReactElement, ReactElement>(children, (child, key) =>
        React.cloneElement(child, {
          ...restProps,
          ...child.props,
          btnKey: `radio_group_btn_${key}`,
          activeBtn,
          changeActiveBtn,
        }),
      )}
    </>
  );
};

export default RadioGroup;
