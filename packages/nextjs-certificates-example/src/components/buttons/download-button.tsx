import { FunctionComponent, useState } from 'react';
import { Button } from '@chakra-ui/react'
import { GetDownloadUrl } from '@/app/actions/mentaport/index'
import "./download-button.scss"
import { ContentFormat } from '@mentaport/certificates';

export interface ButtonProps {
  contractId: string;
  certId: string;
  contentFormat?: ContentFormat;
}
export const DownloadButton: FunctionComponent<ButtonProps> = ({
  contractId,
  certId,
  contentFormat,
}) => {
  const [loading, setOnLoading] = useState<boolean>(false);

  let contentType = 'Image';
  if (contentFormat === ContentFormat.mp3 || contentFormat === ContentFormat.wav) {
    contentType = 'Audio File';
  } else if (contentFormat === ContentFormat.mp4) {
    contentType = 'Video';
  } else if (!contentFormat) {
    contentType = 'Content';
  }

  const handleDownload = async () => {
    setOnLoading(true)
    const urlRes = await GetDownloadUrl(contractId, certId)
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
    <Button className='DownloadButton' onClick={() => handleDownload()} isLoading={loading}>Download Certified {contentType}</Button>
  );
}