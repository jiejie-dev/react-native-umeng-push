import dayjs from 'dayjs';
import db from '../data/database';
import { AttachmentDbItem } from '../data/models';
import { getSession } from './sesstionUtils';
import CosXmlReactNative, { COS_BUCKET_NAME } from './uploadUtils';
import * as uuid from 'uuid';
import center from '../data';
import DeviceInfo from 'react-native-device-info';
import { MobileFileDto } from '../../apiclient/src/models';

export const tryUploadAttachments = async (
  custId: number,
  billMonth: number,
  readTimes: number,
  files: AttachmentDbItem[],
) => {
  try {
    await uploadAttachments(custId, billMonth, readTimes, files);
  } catch (e) {
    console.log('尝试上传图片失败');
  }
};

export const uploadAttachments = async (
  custId: number,
  billMonth: number,
  readTimes: number,
  files: AttachmentDbItem[],
) => {
  const session = await getSession();
  const username = session?.userInfo.userName;
  const dtYearMonth = dayjs().format('YYYYMM');
  const objectName =
    `${session?.tenantName}/${dtYearMonth}/${username}` +
    `/${dayjs().format('YYYY-MM-DD')}-${uuid.v4().toString().replace('-', '')}`;
  const filesToUpload = files.filter((it) => !it.uploaded);
  const requests = filesToUpload.map((it) => {
    const uploadRequest = {
      bucket: `${COS_BUCKET_NAME}-1259078701`,
      object: objectName,
      // 文件本地 Uri 或者 路径
      fileUri: 'file://' + it.filePath,
    };
    return uploadRequest;
  });
  const rsp = requests.map((it) => CosXmlReactNative.upload(it));
  const results = await Promise.all(rsp);
  results.forEach((value, index) => {
    filesToUpload[index].url = value.Location;
  });
  await center.uploadAttachments({
    deviceCode: DeviceInfo.getUniqueId(),
    readingFiles: [
      {
        custId,
        billMonth,
        readTimes,
        files: filesToUpload.map((it) => {
          const item: MobileFileDto = {
            fileName: it.fileName,
            filePath: it.url,
            fileSize: it.fileSize,
            fileSource: it.fileSource,
          };
          return item;
        }),
      },
    ],
  });
  await db.updateAttachmentsUploaded(custId, filesToUpload);
};