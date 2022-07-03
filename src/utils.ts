export const generateCodeVerifier = (length = 128) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  for (let i = 0; i < length; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};


export const generateCodeChallenge = async (codeVerifier: string) => {
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(codeVerifier));
  const base64 = window.btoa(String.fromCharCode(...new Uint8Array(hash)));
  return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
};

export const objectToQuery = (object: { [key: string]: string | number | boolean }) =>
    Object.keys(object)
      .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(object[key]))
      .join('&');