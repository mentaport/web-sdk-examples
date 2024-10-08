import { FunctionComponent, useState } from 'react';
import { Button  } from '@chakra-ui/react'
import {GetDownloadUrl } from '@/app/actions/mentaport/index'
import { ContentFormat } from '@mentaport/certificates';

export interface ButtonProps {
  contractId: string;
  certId:string;
  contentFormat:ContentFormat
}
export const DownloadButton:FunctionComponent<ButtonProps> =props=> {
  const [loading, setOnLoading] = useState<boolean>(false);

  const handleDownload = async () => {
    setOnLoading(true)
    const urlRes = await GetDownloadUrl(props.contractId, props.certId, props.contentFormat)
    if (urlRes.status) {
      const link = document.createElement('a');
      link.href = urlRes.data!;
      link.click();
      link.remove(); //afterwards we remove the element
    } else {
      alert("Issue getting download URL")
    }
    setOnLoading(false)
  };

  return (
    <Button colorScheme='purple' onClick={()=>handleDownload()} isLoading={loading}>Download</Button>
  );
}