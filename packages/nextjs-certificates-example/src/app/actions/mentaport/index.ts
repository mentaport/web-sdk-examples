'use server'
import { _getMentaportSDK} from  '@/app/actions/mentaport/mentaport-sdk'
import {
  ICertificateArg,
  ContentTypes, 
  ContentFormat,
  ICertificate,
  IResults,
  VerificationStatus,
  CertificateStatus,
} from '@mentaport/certificates';

const sleep = (ms:number) => new Promise((r) => setTimeout(r, ms));
const getFileTypeStr = (fileType: string) => {
  const types = fileType.split('/');
  let type = ""
  let format: ContentFormat = ContentFormat[types[1] as keyof typeof ContentFormat];
  if(!format && types[1] == 'jpeg')
    format = ContentFormat.jpg;
  for (const key in ContentTypes) {
    if (ContentTypes[key as keyof typeof ContentTypes].toLowerCase() === types[0]) {
      type =  ContentTypes[key as keyof typeof ContentTypes];
    }
  }
  
  return {type, format};
};

// Create new certificate
export async function CreateCertificate(data: FormData, initCertificateArgs:ICertificateArg):Promise<IResults<ICertificate>> {
  try {
 
    const file: File | null = data.get('file') as unknown as File
    if (!file) {
      throw new Error('No file uploaded')
    }
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const blob = new Blob([buffer], { type: file.type });
    const typeInfo = getFileTypeStr(file.type)
    initCertificateArgs.contentType = typeInfo.type as ContentTypes;

    const sdk = await _getMentaportSDK();
    const initResult = await sdk.initCertificate(initCertificateArgs);
   
    if(!initResult.status || !initResult.data) {
      console.error('There was a problem creating the certificate')
      return {status:false, statusCode: initResult.statusCode, message:initResult.message}
    }
    console.log("now uploading content", initResult)
    const contractId = initCertificateArgs.contractId;
    const certId = initResult.data.certId;
    console.log(certId, typeInfo.format)
    // generate
    const genRes = await sdk.createCertificate(
      contractId,
      certId,
      typeInfo.format as ContentFormat,
      blob
    );
    if(!genRes.status){
      console.error('There was a problem uploading contnet for certificate')
      return genRes
    }
    let status=CertificateStatus.Initiating;
    let resCertStatus = await sdk.getCertificateStatus(contractId, certId);

    while (status !== CertificateStatus.Pending &&
        status !== CertificateStatus.NonActive
    ) {
      await sleep(2000);
      resCertStatus = await sdk.getCertificateStatus(contractId, certId);
     
      if(!resCertStatus.status) {
        console.log('error', resCertStatus)
        return {status: resCertStatus.status, message: resCertStatus.message, statusCode: resCertStatus.statusCode}
      }
      if(resCertStatus.data) {
        status = resCertStatus.data.status
      }
    }
    if(!resCertStatus!.status || resCertStatus.data?.status == CertificateStatus.NonActive ){
      console.error('There was a problem creating your certificate')
      return {status: resCertStatus.status, message: resCertStatus.message, statusCode: resCertStatus.statusCode}
    }
    console.log("Now approving certificate");
    // TODO: Before approving, confirm the data from the above call to ensure everything looks good.
    const appRes = await sdk.approveCertificate(initCertificateArgs.contractId, certId, true);
    return appRes;
    
  } // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch(error:any) {
    console.log(error)
    let message = "Error creating certificate"
    if(error.response && error.response.data ){
      message = error.response.data.message
    }
    return {status:false, message, statusCode:501}
  }
}

// Verify content 
export async function Verify(data: FormData) {
  try {
    const file: File | null = data.get('file') as unknown as File
    if (!file) {
      throw new Error('No file uploaded')
    }
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const blob = new Blob([buffer], { type: file.type });
    const typeInfo = getFileTypeStr(file.type)
    const sdk = await _getMentaportSDK();
    const url = "http://examples.mentaport.com/upload";
    const verRes = await sdk.verifyContent(typeInfo.format, url, blob);
    // check for result:
    if(!verRes.status || !verRes.data) { 
      return verRes
    }
    const verId = verRes.data.verId
    let status=VerificationStatus.Initiating;
    let resVerStatus=null
    while (
      status !== VerificationStatus.NoCertificate && 
      status !== VerificationStatus.Certified 
    ) {
      await sleep(2000);
      resVerStatus = await sdk.getVerificationStatus(verId);
      console.log(resVerStatus)
      if(resVerStatus.data) {
        status = resVerStatus.data.status
      }
    }

    return resVerStatus 

  } // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch(error:any) {
    let message = "Error verifying content"
    if(error.response && error.response.data ){
      message = error.response.data.message
    }
    return {status:false, message, statusCode:501}
  }
}

// Get Certificates
export async function GetCertificates(contractId?:string, certId?:string) {
  try {
    const sdk = await _getMentaportSDK();
    if(contractId) {
      const result = await sdk.getCertificates(contractId, certId);
      console.log(result);
      return result
    }
    const result = await sdk.getCertificates();
    console.log(result);
    return result
  }  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch(error:any) {
    let message = "Error getting certificates"
    if(error.response && error.response.data ){
      message = error.response.data.message
    }
    console.log(error)
    return {status:false, message, statusCode:501}
  }
}

// Get users contracts to extract certificates
export async function GetContracts(activeContracts:boolean) {
  try {
    const sdk = await _getMentaportSDK();
    const result = await sdk.getContracts(activeContracts);
    console.log(result);
    return result
  } // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch(error:any) {
    let message = "Error getting contracts"
    if(error.response && error.response.data ){
      message = error.response.data.message
    }
    console.log(error)
    return {status:false, message, statusCode:501}
  }
}

export async function GetDownloadUrl(
  contractId: string,
  certId: string,
  contentFormat: ContentFormat
): Promise<IResults<string>> {
  try {
    const sdk = await _getMentaportSDK();
    const result = await sdk.getDownloadUrl(contractId, certId, contentFormat);
    return result;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    let message = 'Error getting contracts';
    if (error.response && error.response.data) {
      message = error.response.data.message;
    }
    console.log(error);
    return { status: false, message, statusCode: 501 };
  }
}