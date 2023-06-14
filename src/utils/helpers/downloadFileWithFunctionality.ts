import { saveAs } from "file-saver";
import nProgress from "nprogress";
import { notifications } from "@mantine/notifications";
import downloadFile from "./downloadFile";

type Options = { endpoint: string, filename: string, axiosConfigs?: any }

const downloadFileWithFuntionality = async (options: Options) => {
  nProgress.start();
  const blob = await downloadFile(
    options.endpoint,
    options.axiosConfigs,
    )
    .catch((e: Error) => {
      notifications.show({
        title: 'Maaf Terjadi Kegagalan',
        message: e.message,
      })
    })
    .finally(() => {
      nProgress.done();
    });
  saveAs(blob, `${options.filename || new Date().toLocaleString()}`);
};
export default downloadFileWithFuntionality;
