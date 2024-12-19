'use server'
import { _getMentaportSDK } from '@/app/actions/mentaport/mentaport-sdk'
import {
  ICertificateArg,
  ContentTypes,
  ContentFormat,
  ICertificate,
  IResults,
  VerificationStatus,
  CertificateStatus,
  ICertificateUpdateArg,
  AITrainingMiningInfo,
} from '@mentaport/certificates';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const getFileTypeStr = (fileType: string) => {
  const types = fileType.split('/');
  let type = ""
  let format: ContentFormat = ContentFormat[types[1] as keyof typeof ContentFormat];
  if (!format && types[1] == 'jpeg')
    format = ContentFormat.jpg;
  for (const key in ContentTypes) {
    if (ContentTypes[key as keyof typeof ContentTypes].toLowerCase() === types[0]) {
      type = ContentTypes[key as keyof typeof ContentTypes];
    }
  }

  return { type, format };
};

// Create new certificate
export async function CreateCertificate(data: FormData, initCertificateArgs: ICertificateArg): Promise<IResults<ICertificate>> {
  try {

    const file: File | null = data.get('file') as unknown as File
    if (!file) {
      throw new Error('No file uploaded')
    }
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const blob = new Blob([buffer], { type: file.type });
    const typeInfo = getFileTypeStr(file.type)
    initCertificateArgs.contentFormat = typeInfo.format as ContentFormat;

    const sdk = await _getMentaportSDK();
    // 1. Create certificate by setting information and uploading content
    const genRes = await sdk.createCertificate(initCertificateArgs, blob);
    if (!genRes.status || genRes.data == null) {
      console.error('There was a problem uploading contnet for certificate')
      return genRes
    }
    const contractId = initCertificateArgs.contractId;
    const certId = genRes.data.certId;
    let status = genRes.data.status;
    console.log("creation started", certId)
    // 2. Check status until is ready (Pending if successful or NonActive if failed)
    let resCertStatus = await sdk.getCertificateStatus(contractId, certId);
    while (status !== CertificateStatus.Pending &&
      status !== CertificateStatus.NonActive
    ) {
      await sleep(2000);
      resCertStatus = await sdk.getCertificateStatus(contractId, certId);
      console.log(resCertStatus)
      if (!resCertStatus.status) {
        console.log('error', resCertStatus)
        return { status: resCertStatus.status, message: resCertStatus.message, statusCode: resCertStatus.statusCode }
      }
      if (resCertStatus.data) {
        if (resCertStatus.data.status.error) {
          // break error creating certificate
          console.log(resCertStatus)
          return { status: false, message: resCertStatus.data.status.statusMessage, statusCode: resCertStatus.statusCode }
        }
        status = resCertStatus.data.status.status;
      }
    }

    // if(!resCertStatus!.status || resCertStatus.data?.status == CertificateStatus.NonActive ){
    //   console.error('There was a problem creating your certificate')
    //   return {status: resCertStatus.status, message: resCertStatus.message, statusCode: resCertStatus.statusCode}
    // }
    console.log("Now approving certificate");
    // TODO: Before approving, confirm the data from the above call to ensure everything looks good.
    // 3. Approve certificate for it to be ready for download
    const appRes = await sdk.approveCertificate(initCertificateArgs.contractId, certId, true);
    return appRes;

  } // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch (error: any) {
    console.log(error)
    let message = "Error creating certificate"
    if (error.response && error.response.data) {
      message = error.response.data.message
    }
    return { status: false, message, statusCode: 501 }
  }
}

// Update Certificate
export async function UpdateCertificate(data: FormData, updateArgs: ICertificateUpdateArg): Promise<IResults<ICertificate>> {
  try {
    const file: File | null = data.get('file') as unknown as File
    if (!file) {
      throw new Error('No file uploaded')
    }
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const blob = new Blob([buffer], { type: file.type });
    const typeInfo = getFileTypeStr(file.type)

    updateArgs.contentFormat = typeInfo.format as ContentFormat;
    
    const sdk = await _getMentaportSDK();
    const genRes = await sdk.updateCertificate(updateArgs, blob);

    return genRes;
  } catch (error: any) {
    console.log(error)
    let message = "Error creating certificate"
    if (error.response && error.response.data) {
      message = error.response.data.message
    }
    return { status: false, message, statusCode: 501 }
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
      // 1. Verify content by uploading content
      console.log("jer 1e")
      const verRes = await sdk.verifyContent(typeInfo.format, url, blob);
      console.log('d', verRes)
      // check for result:
      if (!verRes.status || !verRes.data) {
        return verRes
      }
      // 2. Check status until is ready
      const verId = verRes.data.verId
      let status = VerificationStatus.Initiating;
      let resVerStatus = null
      while (
        status !== VerificationStatus.NoCertificate &&
        status !== VerificationStatus.Certified
      ) {
        await sleep(2000);
        resVerStatus = await sdk.getVerificationStatus(verId);
        console.log(resVerStatus)
        if (resVerStatus.data) {
          status = resVerStatus.data.status.status
        }
      }

      return resVerStatus

    } // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
      console.log(error)
      let message = "Error verifying content"
      if (error.response && error.response.data) {
        message = error.response.data.message
      }
      return { status: false, message, statusCode: 501 }
    }
  }

  // Get Certificates
  export async function GetCertificates(contractId?: string, certId?: string) {
    try {
      const sdk = await _getMentaportSDK();
      if (contractId && certId) {
        const result = await sdk.getCertificates(contractId, certId);
        console.log(result);
        return result
      }
      console.log("here")
      const result = await sdk.getCertificates();
      console.log(result);
      return result
    }  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
      let message = "Error getting certificates"
      if (error.response && error.response.data) {
        message = error.response.data.message
      }
      console.log(error)
      return { status: false, message, statusCode: 501 }
    }
  }

  // Get users contracts to extract certificates
  export async function GetContracts(activeContracts: boolean) {
    try {
      const sdk = await _getMentaportSDK();
      const result = await sdk.getContracts(activeContracts);
      console.log(result);
      return result
    } // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
      let message = "Error getting contracts"
      if (error.response && error.response.data) {
        message = error.response.data.message
      }
      console.log(error)
      return { status: false, message, statusCode: 501 }
    }
  }

  export async function GetDownloadUrl(
    contractId: string,
    certId: string,
  ): Promise<IResults<string>> {
    try {
      const sdk = await _getMentaportSDK();
      const result = await sdk.getDownloadUrl(contractId, certId);
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