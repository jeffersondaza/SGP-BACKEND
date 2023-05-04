import { RespondInterface } from "../interfaces/commons/respond.interface";

export const respond: (
  status: string,
  msg: string,
  data: any
) => RespondInterface = (status: string, msg: string, data: any) => {
  return {
    status,
    msg,
    data,
  };
};
