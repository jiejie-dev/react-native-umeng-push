/* tslint:disable */
/* eslint-disable */
/**
 * 抄表系统 - Pda抄表
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

import { FeeId } from "./fee-id";

/**
 * Pda 现金收费
 * @export
 * @interface PdaPaymentInput
 */
export interface PdaPaymentInput {
    /**
     * 客户编号
     * @type {string}
     * @memberof PdaPaymentInput
     */
    custCode: any;
    /**
     * 费用编号
     * @type {Array&lt;FeeId&gt;}
     * @memberof PdaPaymentInput
     */
    paymnetMobileFeeInput?: FeeId[];
    /**
     * 实收金额
     * @type {number}
     * @memberof PdaPaymentInput
     */
    actualMoney: any;
    /**
     * 缴费方式
     * @type {number}
     * @memberof PdaPaymentInput
     */
    chargeWay: any;
    /**
     * 收费小类
     * @type {number}
     * @memberof PdaPaymentInput
     */
    chequeType?: any;
    /**
     * 凭证号、付款码
     * @type {string}
     * @memberof PdaPaymentInput
     */
    tradeCode?: any;
    /**
     * 第三方机构代码
     * @type {string}
     * @memberof PdaPaymentInput
     */
    thirdPartyCode?: any;
    /**
     * 第三方交易流水号
     * @type {string}
     * @memberof PdaPaymentInput
     */
    thirdPartyNum?: any;
    /**
     * 备注
     * @type {string}
     * @memberof PdaPaymentInput
     */
    remark?: any;
}
