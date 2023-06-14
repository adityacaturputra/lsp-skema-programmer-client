import httpCommon from "../../http-common";

const downloadFile = async (url: string, axiosConfig: {}) => {
  return httpCommon
    .get(url, {
      responseType: "blob",
      ...axiosConfig,
    })
    .then((response) => {
      return response.data;
    });
};

export default downloadFile;
