import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  FlatList,
  Image,
  ListRenderItemInfo,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { scaleSize } from 'react-native-responsive-design';
import { CommonTitleBar } from '../components/titlebars/CommonTitleBar';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import { colorWhite } from '../styles';
import { FeeId, PdaChargeListDto } from '../../apiclient/src/models';
import PaymentItem from '../components/PaymentItem';
import center from '../data';
import { MainStackParamList } from './routeParams';
import CircleCheckBox from '../components/CircleCheckBox';
import {
  getSystemSettings,
  SystemSettings,
} from '../utils/systemSettingsUtils';
import Modal from 'react-native-smart-modal';
import { Toast } from '@ant-design/react-native';
import QRCode from 'react-native-qrcode-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getPayViewModel, PayViewModel } from '../utils/payViewUtils';

export default function PaymentScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<MainStackParamList, 'Payment'>>();

  const [paymentBills, setPaymentBills] = useState<PdaChargeListDto[]>([]);
  const [payWay, setPayWay] = useState<string>('1');
  const [paymentVisible, setPaymentVisible] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>();
  const [cashRealValue, setCashRealValue] = useState<string>('');
  const [settings, setSettings] = useState<SystemSettings>();
  const [viewModel, setViewModel] = useState<PayViewModel>();

  useEffect(() => {
    getSystemSettings().then((r) => {
      if (r) {
        setSettings(r);
        const vm = getPayViewModel(
          paymentBills,
          route.params.data.deposit || 0,
          r.isOpenDeposit,
          r.isShowDepositPay,
        );
        setViewModel(vm);
        if (vm.money) {
          setCashRealValue(vm.money.toFixed(2));
        }
      }
    });
  }, [paymentBills, route.params.data.deposit]);

  useEffect(() => {
    center
      .getArrearageChargeList({ custId: route.params.data.custId })
      .then((items) => {
        setPaymentBills(items);
      })
      .catch((e) => {
        Toast.fail(e.message);
      });
  }, [route.params, route.params.data]);

  const onPayButtonClick = async () => {
    if (!viewModel?.canClickPay) {
      Toast.info('无需缴费');
      return;
    }
    try {
      if (payWay === '1') {
        setPaymentVisible(true);
      } else if (payWay === '2') {
        const result = await center.getWechatQrCodeUrl(
          route.params.data.custCode,
        );
        setQrCodeUrl(result);
        setPaymentVisible(true);
      } else if (payWay === '3') {
        const result = await center.getAlipayQrCodeUrl(
          route.params.data.custCode,
        );
        setQrCodeUrl(result);
        setPaymentVisible(true);
      } else {
        Toast.fail('请先选择付费方式');
      }
    } catch (e) {
      Toast.fail('暂不支持');
    }
  };

  const onCashConfirm = async () => {
    if (!cashRealValue) {
      Toast.fail('请先输入实收金额');
      return;
    }
    console.log('onCashConfirm', cashRealValue, viewModel?.money);
    if (
      cashRealValue &&
      viewModel?.money &&
      parseFloat(cashRealValue).toFixed(2) < viewModel?.money.toFixed(2)
    ) {
      Toast.fail('实收金额过小不得小于应缴总金额');
      return;
    }
    const key = Toast.loading('收款中');
    try {
      await center.getCashPaymentDetails(route.params.data.custId, {
        actualMoney: parseFloat(cashRealValue),
        chargeWay: '1',
        custCode: route.params.data.custCode,
        paymnetMobileFeeInput:
          paymentBills?.map((it) => {
            const item: FeeId = {
              feedId: it.feeId,
            };
            return item;
          }) || [],
      });
      setPaymentVisible(false);
    } catch (e) {
      Toast.fail('收款失败');
    } finally {
      Toast.remove(key);
      Toast.success('收款成功');
      navigation.goBack();
    }
  };

  const renderPayWay = (info: ListRenderItemInfo<string>) => {
    return (
      <TouchableOpacity
        style={styles.paywayRow}
        onPress={() => setPayWay(info.item)}>
        <View style={styles.paywayRowLeft}>
          <Image
            source={
              info.item === '1'
                ? require('../assets/qietu/shoufei/charge_icon_cash_normal.png')
                : info.item === '2'
                ? require('../assets/qietu/shoufei/charge_icon_WaChat_normal.png')
                : require('../assets/qietu/shoufei/charge_icon_Alipay_normal.png')
            }
            style={styles.paywayIcon}
          />
          <Text style={styles.paywayTitle}>
            {info.item === '1' ? '现金' : info.item === '2' ? '微信' : '支付宝'}
          </Text>
        </View>
        <CircleCheckBox
          iconNormal={require('../assets/qietu/shoufei/turnpike_ic_pick_normal.png')}
          iconSelected={require('../assets/qietu/shoufei/turnpike_ic_pick_selected.png')}
          checked={payWay === info.item}
          onClick={() => setPayWay(info.item)}
          iconStyle={{ width: scaleSize(48), height: scaleSize(48) }}
          iconContainerStyle={{ padding: 0 }}
        />
      </TouchableOpacity>
    );
  };

  const renderCashContent = () => {
    return (
      <View style={styles.cashContent}>
        <Text style={styles.cashContentTitle}>应缴金额</Text>
        <Text style={styles.cashContentAmount}>
          {viewModel?.money.toFixed(2)}
        </Text>
        <Text style={styles.cashContentActualAmountTitle}>实收金额</Text>
        <View style={styles.cashContentActualAmountContainer}>
          <TextInput
            onChangeText={(text) => {
              setCashRealValue(text);
            }}
            defaultValue={viewModel?.money.toFixed(2)}
            value={cashRealValue}
            style={styles.cashContentActualAmountInput}
            editable={viewModel?.canEditMoney}
          />
          {viewModel?.canEditMoney ? (
            <TouchableOpacity
              onPress={() => setCashRealValue('')}
              style={{ padding: scaleSize(10) }}>
              <Image
                source={require('../assets/qietu/dengluye/logon_icon_cancel.png')}
                style={{ width: scaleSize(20), height: scaleSize(20) }}
              />
            </TouchableOpacity>
          ) : null}
        </View>

        <TouchableOpacity
          onPress={onCashConfirm}
          style={styles.cashConfirmButton}>
          <Text
            style={{
              fontSize: scaleSize(26),
              color: colorWhite,
            }}>
            确定
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderQrcode = () => {
    return (
      <View style={styles.qrContainer}>
        <View style={styles.qrWrapper}>
          <QRCode size={scaleSize(240)} value={qrCodeUrl} />
        </View>
        <Text style={styles.qrText}>
          {payWay === '2' ? '微信' : '支付宝'}支付码
        </Text>
      </View>
    );
  };

  const renderPaymentModal = () => {
    return (
      <Modal
        visible={paymentVisible}
        fullScreen
        horizontalLayout="right"
        animationIn="zoomIn"
        animationOut="zoomOut"
        style={styles.paymentModal}
        onChange={setPaymentVisible}>
        <View style={styles.paymentModalContent}>
          <View style={styles.modalWrapper}>
            <Image
              style={{
                width: scaleSize(443),
                height: scaleSize(546),
              }}
              resizeMode="contain"
              source={require('../assets/qietu/shoufei/charge_picture_normal.png')}
            />
            {payWay === '1' ? renderCashContent() : renderQrcode()}
          </View>

          <TouchableOpacity onPress={() => setPaymentVisible(false)}>
            <Image
              style={{
                width: scaleSize(60),
                height: scaleSize(60),
                marginTop: scaleSize(40),
              }}
              source={require('../assets/qietu/shoufei/charge_icon_close_normal.png')}
            />
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };

  const renderPaymentItem = (info: ListRenderItemInfo<PdaChargeListDto>) => {
    return <PaymentItem key={info.item.feeId} data={info.item} />;
  };

  const renderItemSep = () => {
    return <View style={{ height: scaleSize(18) }} />;
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        translucent={true}
        backgroundColor="transparent"
      />
      {Platform.OS === 'ios' ? (
        <SafeAreaView edges={['top']}>
          <CommonTitleBar
            title={route.params.mode === 'pay' ? '收费' : '账单详情'}
            onBack={() => navigation.goBack()}
          />
        </SafeAreaView>
      ) : (
        <CommonTitleBar
          title={route.params.mode === 'pay' ? '收费' : '账单详情'}
          onBack={() => navigation.goBack()}
        />
      )}

      <ScrollView>
        <View>
          <View style={styles.content}>
            <View style={styles.contentLeft}>
              <View style={styles.summary}>
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>{route.params.data.custName}</Text>
                  <Text style={styles.subTitle}>
                    ({route.params.data.custCode})
                  </Text>
                </View>

                <View style={styles.numbers}>
                  <View style={styles.numberCol}>
                    <Text style={styles.numberLabel}>预存余额</Text>
                    <Text style={styles.numberValue}>
                      {route.params.data.deposit || 0}
                    </Text>
                  </View>
                  <View style={styles.numberCol}>
                    <Text style={styles.numberLabel}>合计金额</Text>
                    <Text style={styles.numberValue}>
                      {viewModel?.fees.toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.contentRight} />
          </View>

          <FlatList<PdaChargeListDto>
            data={paymentBills}
            renderItem={renderPaymentItem}
            keyExtractor={(item) => item.feeId.toString()}
            ItemSeparatorComponent={renderItemSep}
          />

          <View style={styles.total}>
            <Text style={styles.totalTitle}>
              {route.params.mode === 'pay' ? '应缴总金额' : '实收金额'}
            </Text>
            <Text style={styles.totalValue}>
              {route.params.mode === 'pay'
                ? viewModel?.money.toFixed(2)
                : route.params.data.actualMoney}
            </Text>
          </View>

          {route.params.mode === 'pay' ? (
            <View style={styles.payways}>
              <FlatList<string>
                data={settings?.mobileReadingChargeWay}
                renderItem={renderPayWay}
                keyExtractor={(i) => i}
                ItemSeparatorComponent={() => (
                  <View style={styles.paywayLine} />
                )}
              />
            </View>
          ) : null}

          {route.params.mode === 'pay' && settings?.isOpenDeposit ? (
            <TouchableOpacity
              style={styles.payButton}
              onPress={onPayButtonClick}>
              <Text style={styles.payButtonText}>去收费</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </ScrollView>

      {renderPaymentModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  content: {
    padding: scaleSize(30),
    display: 'flex',
    flexDirection: 'row',
  },
  contentLeft: {
    flex: 1,
  },
  contentRight: {},
  summary: {
    backgroundColor: '#096BF3',
    borderRadius: scaleSize(8),
    padding: scaleSize(30),
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: scaleSize(40),
    color: colorWhite,
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: scaleSize(34),
    color: colorWhite,
    marginStart: scaleSize(8),
  },
  numbers: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: scaleSize(24),
  },
  numberCol: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  numberLabel: {
    fontSize: scaleSize(28),
    color: colorWhite,
  },
  numberValue: {
    fontSize: scaleSize(56),
    color: colorWhite,
    fontWeight: 'bold',
    marginTop: scaleSize(8),
  },
  card: {
    paddingHorizontal: scaleSize(30),
    paddingVertical: scaleSize(21),
  },
  items: {
    display: 'flex',
    flexDirection: 'column',
  },
  total: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colorWhite,
    borderRadius: scaleSize(8),
    marginHorizontal: scaleSize(30),
    paddingHorizontal: scaleSize(30),
    paddingVertical: scaleSize(21),
    marginTop: scaleSize(18),
  },
  totalTitle: {
    fontSize: scaleSize(36),
    fontWeight: 'bold',
    color: '#333333',
  },
  totalValue: {
    color: '#F0655A',
    fontWeight: 'bold',
    fontSize: scaleSize(36),
  },
  payways: {
    marginTop: scaleSize(18),
    paddingHorizontal: scaleSize(34),
    paddingVertical: scaleSize(30),
    borderRadius: scaleSize(8),
    backgroundColor: colorWhite,
    marginHorizontal: scaleSize(30),
  },
  paywayRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paywayIcon: {
    width: scaleSize(50),
    height: scaleSize(50),
  },
  paywayLine: {
    height: scaleSize(1),
    backgroundColor: '#DEDEDE',
    marginVertical: scaleSize(18),
  },
  paywayRowLeft: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  paywayTitle: {
    fontSize: scaleSize(34),
    color: '#333333',
    marginStart: scaleSize(18),
  },
  payButton: {
    marginHorizontal: scaleSize(74),
    marginVertical: scaleSize(60),
    backgroundColor: '#5397F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scaleSize(10),
    paddingVertical: scaleSize(19),
  },
  payButtonText: {
    fontSize: scaleSize(40),
    color: colorWhite,
  },
  modalWrapper: {},
  cashContent: {
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    alignSelf: 'center',
    paddingTop: scaleSize(179),
    width: '100%',
    paddingHorizontal: scaleSize(41),
  },
  cashContentTitle: {
    color: '#333333',
    fontSize: scaleSize(28),
  },
  cashContentAmount: {
    color: '#666666',
    fontSize: scaleSize(28),
    marginTop: scaleSize(12),
    paddingVertical: scaleSize(4),
    paddingHorizontal: scaleSize(18),
    backgroundColor: '#EBEBEB',
    borderRadius: scaleSize(5),
    borderWidth: scaleSize(1),
    borderColor: '#B2B2B2',
  },
  cashContentActualAmountTitle: {
    color: '#333333',
    fontSize: scaleSize(28),
    marginTop: scaleSize(24),
  },
  cashContentActualAmountContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: scaleSize(12),
    paddingVertical: scaleSize(4),
    paddingHorizontal: scaleSize(18),
    borderRadius: scaleSize(5),
    borderWidth: scaleSize(1),
    borderColor: '#B2B2B2',
  },
  cashContentActualAmountInput: {
    color: '#EE2E1E',
    fontSize: scaleSize(28),
    padding: 0,
    flex: 1,
    width: '100%',
  },
  cashConfirmButton: {
    backgroundColor: '#4888E3',
    marginTop: scaleSize(60),
    paddingHorizontal: scaleSize(134),
    paddingVertical: scaleSize(6),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scaleSize(27),
  },
  paymentModal: { justifyContent: 'center', alignItems: 'center' },
  paymentModalContent: {
    width: scaleSize(443),
    height: scaleSize(546),
    alignSelf: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  qrContainer: {
    position: 'absolute',
    alignSelf: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  qrWrapper: {
    backgroundColor: '#CCCCCC',
    width: scaleSize(240),
    height: scaleSize(240),
    marginTop: scaleSize(179),
  },
  qrText: {
    fontSize: scaleSize(34),
    color: '#333333',
    marginTop: scaleSize(24),
    fontWeight: 'bold',
  },
});
