import { encode, decode } from '../vendors/base64';
// import { Base64 } from 'js-base64';

const webKey = 'p>c~hf';
const webKeyChar = webKey.split('').map(item => item.charCodeAt(0));

function encodeChannel(channelId, catalogId = 0, setId = 0, source = 0) {
  const len = catalogId > 65535 ? 13 : 11;
  const buffer = new ArrayBuffer(len);
  const dv = new DataView(buffer);
  dv.setInt32(0, channelId, true);
  dv.setInt32(4, setId, true);

  if (len === 11) {
    dv.setInt16(8, catalogId, true);
  } else {
    dv.setInt32(8, catalogId, true);
  }
  dv.setInt8(len - 1, source);

  const u = new Uint8Array(dv.buffer);
  // const result = [];
  if (u.forEach) {
    u.forEach((item, index) => {
      if (index !== 0) {
        u[index] = (item ^ u[index - 1]) + webKeyChar[index % webKeyChar.length];
        u[index] &= 0xff;
      }
    });
  } else {
    for (let index = 0; index < u.length; index++) {
      const item = u[index];
      if (index !== 0) {
        u[index] = (item ^ u[index - 1]) + webKeyChar[index % webKeyChar.length];
        u[index] &= 0xff;
      }
    }
  }
  let b64 = encode(String.fromCharCode.apply(null, u));
  b64 = b64.replace(/i/g, 'ia').replace(/\+/g, 'ib').replace(/\//g, 'ic').replace(/=/g, '');
  // console.info(u.map(item => String.fromCharCode(item)));
  return b64;
}

function decodeChannel(str) {
  if (str) {
    let base64 = str.replace(/ic/g, '/').replace(/ib/g, '+').replace(/ia/g, 'i');
    let i = base64.length % 4;
    if (i > 0) {
      i = 4 - i;
      switch (i) {
        case 1:
          base64 += '=';
          break;
        case 2:
          base64 += '==';
          break;
        case 3:
          base64 += '===';
          break;
        default:
          break;
      }
    }
    const decodeBase = decode(base64);
    const u = new Uint8Array(decodeBase.split('').map(item => item.charCodeAt(0)));
    let index = u.length;
    while (--index > 0) {
      u[index] -= webKeyChar[(index) % webKeyChar.length];
      u[index] ^= u[index - 1];
    }
    const dv = new DataView(u.buffer);
    const channelId = dv.getUint32(0, true);
    const setId = dv.getUint32(4, true);
    let cateId = 0;
    let source = 0;
    if (u.length === 11) {
      cateId = dv.getUint16(8, true);
      source = dv.getUint8(10, true);
    } else if (u.length > 11) {
      cateId = dv.getUint32(8, true);
      source = dv.getUint8(12, true);
    }
    return { channelId, setId, cateId, source };
  }
  return undefined;
}

function urlParamsGetSectionId(str) {
  let encodeSectionId;
  if (str.indexOf('.') > 0) {
    encodeSectionId = str.substring(0, str.indexOf('.'));
  } else {
    encodeSectionId = str.substring(0, str.length);
  }
  return encodeSectionId;
}

export { encodeChannel, decodeChannel, urlParamsGetSectionId };
