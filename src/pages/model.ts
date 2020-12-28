import { Effect, Reducer } from 'umi';
import { message, notification } from 'antd';

export interface StateType {}

export interface ModelType {
  namespace: 'page';
}

const Modal: ModelType = {
  namespace: 'page',
};

export default Modal;
