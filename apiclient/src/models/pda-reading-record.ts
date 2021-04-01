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
 * 抄表记录
 * @export
 * @interface PdaReadingRecord
 */
export interface PdaReadingRecord {
    /**
     * 抄表年月
     * @type {number}
     * @memberof PdaReadingRecord
     */
    billMonth?: any;
    /**
     * 抄表时间
     * @type {string}
     * @memberof PdaReadingRecord
     */
    readingDate?: any | null;
    /**
     * 上期抄码
     * @type {number}
     * @memberof PdaReadingRecord
     */
    lastReading?: any;
    /**
     * 本期抄码
     * @type {number}
     * @memberof PdaReadingRecord
     */
    reading?: any;
    /**
     * 本期水量
     * @type {number}
     * @memberof PdaReadingRecord
     */
    readWater?: any;
}
