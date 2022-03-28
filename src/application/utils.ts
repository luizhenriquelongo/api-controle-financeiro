
export const formatSuccessfulResponse = (data: any, message?: string) => {
  return {
    response: 'successful',
    message,
    data
  };
};
