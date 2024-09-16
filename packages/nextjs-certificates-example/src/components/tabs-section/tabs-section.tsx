'use client'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import {Box,Flex,Text, Code, Button ,Stack, Input } from '@chakra-ui/react'
import {Create, Verify, GetCertificates, GetContracts } from '@/app/actions/mentaport/index'
import './tabs-section.scss';

import {
  ICertificateArg,
  ContentTypes,
  CopyrightInfo,
  AITrainingMiningInfo
} from '@mentaport/certificates';
import {  useState, FunctionComponent } from 'react';
import { useFormStatus } from "react-dom";


// eslint-disable-next-line prefer-const
let newCert:ICertificateArg = {
  contractId: process.env.NEXT_PUBLIC_CONTRACT_ID!, // "your-contract-id",
  contentType: ContentTypes.Image,
  name: "Certificate Example",
  username: "MentaportDev",
  description: "This certifcate was created to test the sdk example",
  usingAI: false,
  copyrightInfo: CopyrightInfo.Copyrighted,
  aiTrainingMiningInfo: AITrainingMiningInfo.NotAllowed
  // aiSoftware?: string;
  // aiModel?: string;
  // album?: string;
  // albumYear?: string;
  // city?: string;
  // country?: string;
}
interface ButtonProps {
  name: string
}
export const TabsSection = () => {
  const onlyActiveContracts = true;
 
  const [loading, setOnLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string>('Results:');
  const [certId, setCertId] = useState<string>("certId");
  const handleCertIdChange = (event:React.ChangeEvent<HTMLInputElement>) => setCertId(event.target.value)
  const [contractId, setContractId] = useState<string>(process.env.NEXT_PUBLIC_CONTRACT_ID!);
  
  const handleContractIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContractId(event.target.value)
    newCert.contractId = event.target.value
  }

  async function uploadCreateClient(data: FormData ) {
    setResult('')
    setOnLoading(true)
    const res =  await Create(data, newCert)
    setOnLoading(false)
    if(res.status && res.data) {
      setResult(JSON.stringify(res.data, null, 2))
    }
    else {
      setResult(res.message)
    }
  }
  async function uploadVerifyClient(data: FormData ) {
    setResult('')
    setOnLoading(true)
    const res = await Verify(data)
    setOnLoading(false)
    if(res.status)
      setResult(JSON.stringify(res.data, null, 2))
    else 
      setResult(res.message)
  }

  async function GetCertificatesClient(contractId?:string, certId?:string) {
    setResult('')
    setOnLoading(true)
    const res = await GetCertificates(contractId, certId)
    setOnLoading(false)
    if(res.status)
      setResult(JSON.stringify(res.data, null, 2))
    else 
      setResult(res.message)
  }
  async function GetContractsClient() {
    setResult('')
    setOnLoading(true)
    const res = await GetContracts(onlyActiveContracts)
    setOnLoading(false)
    if(res.status)
      setResult(JSON.stringify(res.data, null, 2))
    else 
      setResult(res.message)
  }
 
  const SubmitButton:FunctionComponent<ButtonProps> = props => {
    const { pending } = useFormStatus();
    return (
      <Button colorScheme='purple' type="submit" isLoading={pending}>{props.name}</Button> 
    );
  };

  return (
    <>
    <Tabs variant='enclosed' colorScheme='purple'>
      <TabList>
        <Tab>Create Certificate</Tab>
        <Tab>Verify Content</Tab>
        <Tab>Get Certificates</Tab>
        <Tab>Get ContractIds</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <Box className="MainBoxWrapper" >
            <Stack spacing={4} direction='column' align='left'>
              <Text fontSize='3xl'>Creating new Certificate</Text>
              <Text fontSize='md'>{"Initialize info -> upload content -> approve"}</Text>
              <Code> await mentaportSdk.initCertificate(initCertificateArgs);</Code>
              <Code> await mentaportSdk.generateCertificate(contractId, certId, contentFormat, blob);</Code>
              <Code> await mentaportSdk.approveCertificate(contractId, certId, approve:boolean);</Code>
              {/* <input type="file" onChange={handleFileInputChange} /> */}
              <form action={uploadCreateClient}>
                <Text>ContractId</Text>
                <Input placeholder='contractId' value={contractId} onChange={handleContractIdChange} />
                <input type="file" name="file" />
                <SubmitButton name="Create"/>
                {/* <Button colorScheme='purple' type="submit" isLoading={loading}>Create</Button> */}
              </form>
            </Stack>
          </Box>
        </TabPanel>
        <TabPanel>
          <Box className="MainBoxWrapper" >
            <Stack spacing={4} direction='column' align='left'>
              <Text fontSize='3xl'>Verify Content (images, audio)</Text>
              <Text fontSize='md'> {"Upload content -> Check certificate (report if neede)"}</Text>
              <Code> await mentaportSdk.verifyContent(contentFormat, blob);</Code>
              <Code> await mentaportSdk.verifyContentPresignURL(contentFormat, blob); //For big files</Code>
               <form action={uploadVerifyClient}>
                <input type="file" name="file" />
                <SubmitButton name="Verify"/>
                {/* <Button colorScheme='purple' type="submit" isLoading={loading}>Verify</Button> */}
              </form>
            </Stack>
          </Box>
        </TabPanel>
        <TabPanel>
          
          <Flex gap='2' >
            <Box className="MainBoxWrapper" >
             <Stack spacing={4} direction='column' align='left'>
                <Text fontSize='3xl'>Get Certificates</Text>
                <Text fontSize='md'> {"Get all certificates of user"}</Text>
                <Code> await mentaportSdk.getCertificates();</Code>
                <Button colorScheme='purple' onClick={()=>GetCertificatesClient()} isLoading={loading}>Get Certificates</Button>
              </Stack>
            </Box>
            
            <Box className="MainBoxWrapper" >
              <Stack spacing={4} direction='column' align='left'>
              <Text fontSize='3xl'>Get Certificate</Text>
              <Text fontSize='md'> {"Get certificate by id"}</Text>
              <Code> await mentaportSdk.getCertificate(contractId, certId); </Code>
              <Text>ContractId</Text>
              <Input placeholder='contractId' value={contractId} onChange={handleContractIdChange} />
              <Text>CertId</Text>
              <Input placeholder='certId' value={certId} onChange={handleCertIdChange} />
              <Button colorScheme='purple' onClick={()=>GetCertificatesClient(process.env.NEXT_PUBLIC_CONTRACT_ID, certId)} isLoading={loading}>Get Certificates</Button>
              </Stack>
            </Box>
          </Flex>
          
        </TabPanel>
        <TabPanel>
          <Box className="MainBoxWrapper" >
            <Stack spacing={4} direction='column' align='left'>
              <Text fontSize='3xl'>Get ContractIds</Text>
              <Text fontSize='md'> {"You will only have one in production. For testing you can have multiple."}</Text>
              <Code> await mentaportSdk.getContracts(onlyActive:boolean);</Code>
              <Button colorScheme='purple' onClick={()=>GetContractsClient()} isLoading={loading}>Get Contract</Button>
            </Stack>
          </Box>
          
        </TabPanel>
      </TabPanels>
    </Tabs>
    <Box
        maxW="1000px"        // Maximum width of the box
        overflowY="auto"    // Enable vertical scrolling if content overflows
        borderWidth="1px"   // Border width of the box
        borderRadius="md"   // Border radius for rounded corners
        p={4}               // Padding inside the box
      >
      <div><pre> {result} </pre></div>
    </Box>
    </>
  );
};
