import {
  MobileFileDto,
  PdaCustListDto,
  PdaPaymentSubtotal,
  PdaReadDataDto,
} from '../../apiclient/src/models';
import { NewReadSetting } from '../utils/newReadSettingUtils';

export type MainStackParamList = {
  Home: {};
  Profile: {};
  EditName: {};
  EditPhone: {};
  EditPassword: {};
  Books: {};
  ReadingCollect: {};
  Search: {};
  Arrearages: {};
  NewRead: {
    data: PdaReadDataDto;
    mode: 'read' | 'unread' | 'all';
    setting?: NewReadSetting;
  };
  BookTask: {
    bookId: number;
    title: string;
    setting?: NewReadSetting;
  };
  BookTaskSort: {
    bookId: number;
    title: string;
  };
  CustDetails: {
    data: PdaReadDataDto & PdaCustListDto;
  };
  Camera: {
    callback: (result: MobileFileDto) => void;
  };
  Payment: {
    data: PdaReadDataDto & PdaPaymentSubtotal;
    mode: 'pay' | 'details';
    cashPaid?: () => void;
  };
  PaymentCollect: {};
  PaymentSubtotal: {};
  LogView: {};
};
