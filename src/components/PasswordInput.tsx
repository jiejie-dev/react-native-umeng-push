import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { InputProps } from 'react-native-elements';
import { scaleHeight, scaleSize } from 'react-native-responsive-design';

interface Props extends InputProps {}

export default function PasswordInput(props: Props) {
  return (
    <View style={[styles.container, props.containerStyle]}>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder={props.placeholder}
          onChangeText={props.onChangeText}
          style={[styles.input, props.inputStyle]}
          underlineColorAndroid="transparent"
          {...props}
        />
      </View>

      <View style={[styles.rightContainer, props.rightIconContainerStyle]}>
        {props.rightIcon}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: scaleHeight(20),
    // borderBottomWidth: scaleHeight(1),
    // borderBottomColor: '#979797',
    // paddingBottom: scaleHeight(14),
    flex: 1,
  },
  inputContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingStart: scaleSize(30),
  },
  input: {
    height: scaleHeight(40),
    padding: 0,
    flex: 1,
  },
  leftContainer: {},
  rightContainer: {
    padding: scaleSize(10),
  },
});