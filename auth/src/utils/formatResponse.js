const formatResponse = ({ message = [], data = {}, token = null }) => ({
  message,
  data,
  token,
});

export default formatResponse;
