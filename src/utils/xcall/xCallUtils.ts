import * as exec from "async-exec";

const xcall = `${import.meta.dir}/CallbackCLI`;

export function generateCallBackURL(
  scheme: string,
  action: string,
  params: any
) {
  let result = "";
  for(let key in params) {
    if (typeof params[key] === "object") {
      const jsonString = JSON.stringify(params[key]).replace(/"([^"]+)_([^"]+)":/g, '"$1-$2":');
      result += `${key}=${encodeURIComponent(jsonString)}&`;
    } else {
      result += `${key}=${encodeURIComponent(params[key])}&`;
    }
  }
  result = result.slice(0, -1); // remove last &
  return `${scheme}://x-callback-url/${action}?${result}`;
}


export async function executeXCallBackURL(url: string) {
  //@ts-ignore
  return (await exec.default(`${xcall} "${url}"`)) + "";
}
