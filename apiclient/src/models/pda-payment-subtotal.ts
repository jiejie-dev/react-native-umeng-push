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
/**
 * 收费明细
 * @export
 * @interface PdaPaymentSubtotal
 */
export interface PdaPaymentSubtotal {
    /**
     * 收费小计编号
     * @type {number}
     * @memberof PdaPaymentSubtotal
     */
    subtotalId?: any;
    /**
     * 缴费方式
     * @type {string}
     * @memberof PdaPaymentSubtotal
     */
    chargeWay?: any;
    /**
     * 缴费时间
     * @type {Date}
     * @memberof PdaPaymentSubtotal
     */
    payTime?: any;
    /**
     * 客户Id
     * @type {number}
     * @memberof PdaPaymentSubtotal
     */
    custId?: any;
    /**
     * 客户编号
     * @type {string}
     * @memberof PdaPaymentSubtotal
     */
    custCode?: any;
    /**
     * 客户名称
     * @type {string}
     * @memberof PdaPaymentSubtotal
     */
    custName?: any;
    /**
     * 客户地址
     * @type {string}
     * @memberof PdaPaymentSubtotal
     */
    custAddress?: any;
    /**
     * 实收金额
     * @type {number}
     * @memberof PdaPaymentSubtotal
     */
    actualMoney?: any;
    /**
     * 实际销账
     * @type {number}
     * @memberof PdaPaymentSubtotal
     */
    soldMoney?: any;
    /**
     * 预存变化
     * @type {number}
     * @memberof PdaPaymentSubtotal
     */
    deposit?: any;
}