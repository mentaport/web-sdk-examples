import { FunctionComponent, useState } from 'react';
import { Button  } from '@chakra-ui/react'

export interface ButtonProps {
  url: string;
}
export const DownloadButton:FunctionComponent<ButtonProps> =props=> {
  const [loading, setOnLoading] = useState<boolean>(false);

  const handleDownload = async () => {
    setOnLoading(true)
    if (props.url) {
      const response = await fetch(props.url!); // replace this with your API call & options
      if (!response.ok)
        throw new Error(`unexpected response ${response.statusText}`);

      const fileBlob = await response.blob();
      const link = document.createElement('a'); // once we have the file buffer BLOB from the post request we simply need to send a GET request to retrieve the file data
      link.href = window.URL.createObjectURL(fileBlob);
      const parts = props.url!.split('/');

      link.download = parts[parts.length - 1];
      link.click();
      link.remove(); //afterwards we remove the element
    }
    setOnLoading(false)
  };

  return (
    <Button colorScheme='purple' onClick={()=>handleDownload()} isLoading={loading}>Download</Button>
  );
}