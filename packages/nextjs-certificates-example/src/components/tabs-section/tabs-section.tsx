'use client'
import { Tabs, TabList, TabPanels, Tab, TabPanel, SimpleGrid, Select } from '@chakra-ui/react'
import { Box, Flex, Text, Code, Button, Stack, Input } from '@chakra-ui/react'
import { CreateCertificate, Verify, GetCertificates, GetContracts, UpdateCertificate } from '@/app/actions/mentaport/index'
import { DownloadButton } from '@/components/buttons/download-button'

import './tabs-section.scss';

import {
  ContentFormat,
  ICertificateArg,
  AITrainingMiningInfo,
  ICertificate,
  ICertificateUpdateArg
} from '@mentaport/certificates';
import { useState, FunctionComponent, useEffect, ReactNode, useMemo } from 'react';
import { useFormStatus } from "react-dom";


// eslint-disable-next-line prefer-const
let newCert: ICertificateArg = {
  contractId: process.env.NEXT_PUBLIC_CONTRACT_ID!, // "your-contract-id",
  aiTrainingMiningInfo: AITrainingMiningInfo.NotAllowed,
  contentFormat: ContentFormat.png,  // will be updated when file is selected
  name: "Certificate Example",
  username: "ExampleUsername",
  description: "This certifcate was created to test the sdk example",
  usingAI: false,
  aiSoftware: '',
  aiModel: '',
  album: '',
  albumYear: '',
  city: '',
  country: '',
}

let updateCert: ICertificateUpdateArg = {
  contractId: process.env.NEXT_PUBLIC_CONTRACT_ID || '',
  certId: '',
  aiTrainingMiningInfo: AITrainingMiningInfo.NotAllowed,
  contentFormat: ContentFormat.png,
  name: "Certificate Example",
  username: "ExampleUsername",
  description: "This certifcate was created to test the sdk example",
  usingAI: false,
  aiSoftware: '',
  aiModel: '',
  album: '',
  albumYear: '',
  city: '',
  country: '',
}

interface ButtonProps {
  name: string
}
interface DownlaodProps {
  contractId: string;
  certId: string;
}
export const TabsSection = () => {
  const [loading, setOnLoading] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<DownlaodProps | null>(null);

  const [result, setResult] = useState<string>('');
  const [certId, setCertId] = useState<string>('');
  const [contractId, setContractId] = useState<string>(process.env.NEXT_PUBLIC_CONTRACT_ID!);
  const [onlyActiveContracts, setOnlyActiveContracts] = useState<boolean>(true);
  const [newCertificateArgs, setNewCertificateArgs] = useState<ICertificateArg>({ ...newCert });
  const [updateCertificateArgs, setUpdateCertificateArgs] = useState<ICertificateUpdateArg>({ ...updateCert });

  const handleCertIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCertId(event.target.value)
    setResult('')
    setUpdateCertificateArgs({ ...updateCertificateArgs, certId: event.target.value })
  }

  const handleContractIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setResult('')
    setContractId(event.target.value)
    setNewCertificateArgs({ ...newCertificateArgs, contractId: event.target.value })
    setUpdateCertificateArgs({ ...updateCertificateArgs, contractId: event.target.value })
  }

  function handleTabChange() {
    setResult("")
    setContractId(process.env.NEXT_PUBLIC_CONTRACT_ID || '')
    setCertId('')
    setNewCertificateArgs({ ...newCert })
    setUpdateCertificateArgs({ ...updateCert })
  }

  /* Begin Example Functions */
  async function onSubmitCreateCertificateExample(data: FormData) {
    setResult('')
    setDownloadUrl(null)
    setOnLoading(true)

    const res = await CreateCertificate(data, newCertificateArgs);
    const { status, data: resData, message } = res;
    setOnLoading(false)
    if (status && resData) {
      setResult(JSON.stringify(resData, null, 2))
      setDownloadUrl(
        {
          contractId: resData!.contractId,
          certId: resData!.certId
        })
    }
    else {
      console.log('res.message', res)
      setResult(message)
    }
  }
  async function onUpdateCertificateExample(data: FormData) {
    setResult('')
    setDownloadUrl(null)
    setOnLoading(true)

    const res = await UpdateCertificate(data, updateCertificateArgs);
    const { status, data: resData, message } = res;
    setOnLoading(false)
    if (status && resData) {
      setResult(JSON.stringify(resData, null, 2))
      setDownloadUrl(
        {
          contractId: resData!.contractId,
          certId: resData!.certId
        })
    }
    else {
      console.log('res.message', res)
      setResult(message)
    }
  }
  async function onVerifyUploadedContentExample(data: FormData) {
    setResult('')
    setOnLoading(true)
    // Get current time in milliseconds
    const startTime = new Date().getTime();

    const res = await Verify(data)
    setOnLoading(false)
    if (res && res.status)
      setResult(JSON.stringify(res.data, null, 2))
    else if (res)
      setResult(res.message)

    const endTime = new Date().getTime();
    // Calculate execution time in milliseconds
    const executionTime = endTime - startTime;
    console.log('executionTime', executionTime)
  }
  async function onGetCertificatesExample(contractId?: string, certId?: string) {
    setResult('')
    setOnLoading(true)
    const res = await GetCertificates(contractId, certId)
    setOnLoading(false)
    if (res.status)
      setResult(JSON.stringify(res.data, null, 2))
    else
      setResult(res.message)
  }
  async function onGetContractsExample() {
    setResult('')
    setOnLoading(true)
    const res = await GetContracts(onlyActiveContracts)
    setOnLoading(false)
    if (res.status)
      setResult(JSON.stringify(res.data, null, 2))
    else
      setResult(res.message)
  }
  /* End Example Functions */

  const SubmitButton: FunctionComponent<ButtonProps> = props => {
    const { pending } = useFormStatus();
    return (
      <Button colorScheme='purple' type="submit" isLoading={pending}>{props.name}</Button>
    );
  };

  useEffect(() => {
    console.log('updateCertificateArgs', updateCertificateArgs)
  }, [updateCertificateArgs])

  const tabs: { tab: JSX.Element; tabPanel: JSX.Element }[] = useMemo(() => {
    return [
      {
        tab: <Tab>Create Certificate</Tab>,
        tabPanel: <Box className="MainBoxWrapper" >
          <Stack spacing={4} direction='column' align='left'>
            <Text fontSize='3xl' fontWeight={600}>Creating A New Certificate</Text>
            <Text fontSize='1.2rem'>{"Initialize info -> Upload content -> Get status -> Approve"}</Text>
            <Stack className='CodeStackWrapper' spacing={3}>
              <Code className='CodeWrapper'>{`/* Add logic to capture fields necessary for ICertificateArg */`}</Code>
              <Code className='CodeWrapper'> const initRes = await mentaportSdk.createCertificate(initCertificateArgs: ICertificateArg, contentBlob: Blob);</Code>
              <Code className='CodeWrapper'> const status = await mentaportSdk.getCertificateStatus(contractId: string, certificateId: string);</Code>
              <Code className='CodeWrapper'>{`/* Add logic to wait for status to be uploaded */`}</Code>
              <Code className='CodeWrapper'> const certificate = await mentaportSdk.approveCertificate(contractId: string, certId: string, approve: boolean);</Code>
              <Code className='CodeWrapper'> const url = await mentaportSdk.getDownloadUrl(contractId: string, certId: string);</Code>
            </Stack>

            <Text mt={4} fontSize='2xl' fontWeight={600}>Example Certificate Fields</Text>
            <form action={onSubmitCreateCertificateExample}>
              <Stack spacing={4}>
                <Stack spacing={1}>
                  <Text lineHeight={1}>Contract ID:<span style={{ color: "red" }}> *</span></Text>
                  <Input className='InputWrapper' title='Enter Your Contract ID' placeholder='Enter Your Contract ID' value={contractId} onChange={handleContractIdChange} />
                </Stack>
                <SimpleGrid columns={2} spacing={4}>
                  <Stack spacing={1}>
                    <Text lineHeight={1}>Content File:<span style={{ color: "red" }}> *</span></Text>
                    <input className='InputWrapper' type="file" name="file" />
                  </Stack>
                  {
                    Object.entries(newCert).map(([key, value]) => {
                      if (key === 'contractId') return null
                      else if (key === "contentFormat") {
                        return (
                          <Stack key={key} spacing={1}>
                            <Text lineHeight={1}>{key}</Text>
                            <Select className='InputWrapper' value={newCertificateArgs.contentFormat} onChange={(e) => {
                              setNewCertificateArgs({ ...newCertificateArgs, contentFormat: e.target.value as ContentFormat })
                            }}>
                              {Object.values(ContentFormat).map((format) => {
                                return <option key={format} value={format}>{format}</option>
                              })}
                            </Select>
                          </Stack>
                        )
                      }
                      else if (key === "aiTrainingMiningInfo") {
                        return (
                          <Stack key={key} spacing={1}>
                            <Text lineHeight={1}>{key}<span style={{ color: "red" }}> *</span></Text>
                            <Select className='InputWrapper' value={newCertificateArgs.aiTrainingMiningInfo} onChange={(e) => {
                              setNewCertificateArgs({ ...newCertificateArgs, aiTrainingMiningInfo: e.target.value as AITrainingMiningInfo })
                            }}>
                              {Object.values(AITrainingMiningInfo).map((info) => {
                                return <option key={info} value={info}>{info}</option>
                              })}
                            </Select>
                          </Stack>
                        )
                      }
                      else if (key === "usingAI") {
                        return (
                          <Stack key={key} spacing={1}>
                            <Text lineHeight={1}>{key}</Text>
                            <Select className='InputWrapper' value={String(newCertificateArgs.usingAI)} onChange={(e) => {
                              setNewCertificateArgs({ ...newCertificateArgs, usingAI: e.target.value === 'true' })
                            }}>
                              <option value={"true"}>true</option>
                              <option value={"false"}>false</option>
                            </Select>
                          </Stack>
                        )
                      }
                      return (
                        <Stack key={key} spacing={1}>
                          <Text lineHeight={1}>{key}</Text>
                          <Input className='InputWrapper' value={value} />
                        </Stack>
                      )
                    })
                  }
                </SimpleGrid>
                <SubmitButton name="Create Certificate" />
              </Stack>
            </form>
          </Stack>

          {downloadUrl &&
            <DownloadButton contractId={downloadUrl.contractId} certId={downloadUrl.certId} />
          }
        </Box>
      },
      {
        tab: <Tab>Update Certificate</Tab>,
        tabPanel: (
          <Stack spacing={4}>
            <Box className='MainBoxWrapper' display={"flex"} flexDirection={"column"} gap={2}>
              <Text color={"#000"} fontSize={"xl"} fontWeight={600}>
                {"Special Note:"}
              </Text>
              <Code className='CodeWrapper' style={{
                borderRadius: '0.3rem',
                padding: '0.3rem 0.6rem',
                lineHeight: 1.6,
                width: 'fit-content',
              }} >function mentaportSdk.updateCertificate(updateData: ICertificateUpdateArg, contentBlob: Blob); </Code>
              <Text color={"#000"}>
                is designed as a retry-method when an issue occurs creating a certificate, but a certificate ID was still generated. A new file, contract ID, and certificate ID are required to update the certificate.
              </Text>
            </Box>
            <Box className="MainBoxWrapper" >
              <Stack spacing={4} direction='column' align='left'>
                <Text fontSize='3xl' fontWeight={600}>Update A Non-Active/Pending Certificate</Text>
                <Text fontSize='1.2rem'>{"Get inactive/pending certificate -> Update content -> Get status"}</Text>
                <Stack className='CodeStackWrapper' spacing={3}>
                  <Code className='CodeWrapper'> const certificate = await mentaportSdk.getCertificate(contractId, certificateId);</Code>
                  <Code className='CodeWrapper'>{`const \{ status \} = certificate;`}</Code>
                  <Code className='CodeWrapper'>{`/* Add logic to upload new content and modify any other fields */`}</Code>
                  <Code className='CodeWrapper'> const updatedCertificate = await mentaportSdk.updateCertificate(updateData: ICertificateUpdateArg, contentBlob: Blob);</Code>
                  <Code className='CodeWrapper'>{`/* Add logic to show user updated certificate`}</Code>
                </Stack>

                <Text mt={4} fontSize='2xl' fontWeight={600}>Example Certificate Fields to Update</Text>
                <form action={onUpdateCertificateExample}>
                  <Stack spacing={4}>

                    <SimpleGrid columns={2} spacing={4}>
                      <Stack spacing={1}>
                        <Text lineHeight={1}>Contract ID:<span style={{ color: "red" }}> *</span></Text>
                        <Input className='InputWrapper' title='Enter Your Contract ID' placeholder='Enter Your Contract ID' value={contractId} onChange={handleContractIdChange} isRequired />
                      </Stack>
                      <Stack spacing={1}>
                        <Text lineHeight={1}>Certificate ID:<span style={{ color: "red" }}> *</span></Text>
                        <Input className='InputWrapper' title='Enter Your Certificate ID' placeholder='Enter Your Certificate ID' value={certId} onChange={handleCertIdChange} isRequired />
                      </Stack>
                    </SimpleGrid>
                    <SimpleGrid columns={2} spacing={4}>
                      <Stack spacing={1}>
                        <Text lineHeight={1}>Content File:<span style={{ color: "red" }}> *</span></Text>
                        <input className='InputWrapper' type="file" name="file" />
                      </Stack>
                      {
                        Object.entries(newCert).map(([key, value]) => {
                          if (key === 'contractId') return null
                          else if (key === "contentFormat") {
                            return (
                              <Stack key={key} spacing={1}>
                                <Text lineHeight={1}>{key}</Text>
                                <Select className='InputWrapper' value={updateCertificateArgs.contentFormat} onChange={(e) => {
                                  setUpdateCertificateArgs({ ...updateCertificateArgs, contentFormat: e.target.value as ContentFormat })
                                }}>
                                  {Object.values(ContentFormat).map((format) => {
                                    return <option key={format} value={format}>{format}</option>
                                  })}
                                </Select>
                              </Stack>
                            )
                          }
                          else if (key === "aiTrainingMiningInfo") {
                            return (
                              <Stack key={key} spacing={1}>
                                <Text lineHeight={1}>{key}<span style={{ color: "red" }}> *</span></Text>
                                <Select className='InputWrapper' value={updateCertificateArgs.aiTrainingMiningInfo} onChange={(e) => {
                                  setUpdateCertificateArgs({ ...updateCertificateArgs, aiTrainingMiningInfo: e.target.value as AITrainingMiningInfo })
                                }}>
                                  {Object.values(AITrainingMiningInfo).map((info) => {
                                    return <option key={info} value={info}>{info}</option>
                                  })}
                                </Select>
                              </Stack>
                            )
                          }
                          else if (key === "usingAI") {
                            return (
                              <Stack key={key} spacing={1}>
                                <Text lineHeight={1}>{key}</Text>
                                <Select className='InputWrapper' value={String(updateCertificateArgs.usingAI)} onChange={(e) => {
                                  setUpdateCertificateArgs({ ...updateCertificateArgs, usingAI: e.target.value === 'true' })
                                }}>
                                  <option value={"true"}>true</option>
                                  <option value={"false"}>false</option>
                                </Select>
                              </Stack>
                            )
                          }
                          return (
                            <Stack key={key} spacing={1}>
                              <Text lineHeight={1}>{key}</Text>
                              <Input className='InputWrapper' value={value} />
                            </Stack>
                          )
                        })
                      }
                    </SimpleGrid>
                    <SubmitButton name="Update Certificate" />
                  </Stack>
                </form>
              </Stack>

              {downloadUrl &&
                <DownloadButton contractId={downloadUrl.contractId} certId={downloadUrl.certId} />
              }
            </Box>
          </Stack>
        )
      },
      {
        tab: <Tab>Get Certificates</Tab>,
        tabPanel: (
          <Stack spacing={4} direction='column' align='left'>
            <Box className='MainBoxWrapper' display={"flex"} flexDirection={"column"} gap={2}>
              <Text color={"#000"} fontSize={"xl"} fontWeight={600}>
                {"Special Note:"}
              </Text>
              <Code className='CodeWrapper' style={{
                borderRadius: '0.3rem',
                padding: '0.3rem 0.6rem',
                lineHeight: 1.6,
                width: 'fit-content',
              }} >function mentaportSdk.getCertificates(contractId? string, certificateId?: string); </Code>
              <Text color={"#000"}>
                will return all certificates belonging to the current user if no <b>contractId</b> or <b>certificateId</b> are provided.
              </Text>
            </Box>
            <SimpleGrid columns={2} spacing={4}>
              <Box className="MainBoxWrapper" >
                <Stack spacing={4} direction='column' align='left' h={"100%"} justifyContent={"space-between"}>
                  <Stack spacing={4}>
                    <Text fontSize='3xl' fontWeight={600}>Get All Certificates</Text>
                    <Box className='CodeStackWrapper'>
                      <Code className='CodeWrapper'> await mentaportSdk.getCertificates();</Code>
                    </Box>
                  </Stack>
                  <Stack justifyContent={"space-between"} h={"100%"}>
                    <Button colorScheme='purple' onClick={() => onGetCertificatesExample()} isLoading={loading}>Get Certificates</Button>
                  </Stack>
                </Stack>
              </Box>

              <Box className="MainBoxWrapper" >
                <Stack spacing={4} direction='column' align='left'>
                  <Text fontSize='3xl' fontWeight={600}>Get Certificate by ID</Text>
                  <Box className='CodeStackWrapper'>
                    <Code className='CodeWrapper'> await mentaportSdk.getCertificates(contractId, certificateId); </Code>
                  </Box>
                  <Stack spacing={0.5}>
                    <Text>Contract ID: </Text>
                    <Input className='InputWrapper' placeholder='contract ID' value={contractId} onChange={handleContractIdChange} />
                  </Stack>
                  <Stack spacing={0.5}>
                    <Text>Certificate ID:</Text>
                    <Input className='InputWrapper' placeholder='certificate ID' value={certId} onChange={handleCertIdChange} />
                  </Stack>
                  <Button colorScheme='purple' onClick={() => onGetCertificatesExample(contractId, certId)} isLoading={loading}>Get Certificates</Button>
                </Stack>
              </Box>
            </SimpleGrid>
          </Stack>
        )
      },
      {
        tab: <Tab>Verify Content</Tab>,
        tabPanel: <Stack spacing={4}>
          <Box className='MainBoxWrapper' display={"flex"} flexDirection={"column"} gap={2}>
            <Text color={"gray.900"} fontSize={"xl"} fontWeight={600}>
              {"Special Note:"}
            </Text>
            <Text color={"gray.900"} fontSize={"lg"}>
              We currently only support verifying <b>images</b> and <b>audio</b>. Video verification is coming soon!
            </Text>
          </Box>
          <Box className="MainBoxWrapper" >
            <Stack spacing={4} direction='column' align='left'>
              <Text fontSize='3xl' fontWeight={600}>Verify Content</Text>
              <Text fontSize='1.2rem'> {"Upload content -> Check status -> Get certificate (report if needed)"}</Text>
              <Stack className='CodeStackWrapper' spacing={3}>
                <Code className='CodeWrapper'>{`/* Add logic to capture fields file format and file blob */`}</Code>
                <Code className='CodeWrapper'>const verificationId = await mentaportSdk.verifyContent(contentFormat, contentBlob);</Code>
                <Code className='CodeWrapper'>{`const status = await mentaportSdk.getVerificationStatus(verificationId);`}</Code>
                <Code className='CodeWrapper'>const certificate = status?.certificate || null;</Code>
              </Stack>
              <form action={onVerifyUploadedContentExample}>
                <Stack spacing={4}>
                  <Stack spacing={1}>
                    <Text lineHeight={1}>Content File:<span style={{ color: "red" }}> *</span></Text>
                    <input className='InputWrapper' type="file" name="file" />
                  </Stack>
                  <SubmitButton name="Verify" />
                </Stack>
              </form>
            </Stack>
          </Box>
        </Stack>
      },
      {
        tab: <Tab>Get Contracts</Tab>,
        tabPanel: <Box className="MainBoxWrapper" >
          <Stack spacing={4} direction='column' align='left'>
            <Text fontSize='3xl' fontWeight={600}>Get Contracts</Text>
            <Text fontSize='md'> {"You will only have one in production. For testing you may have multiple, some of which may be inactive depending on your use case."}</Text>
            <Box className='CodeStackWrapper'>
              <Code className='CodeWrapper'> const data = await mentaportSdk.getContracts(onlyActive: boolean);</Code>
            </Box>
            <Stack spacing={0.5}>
              <Text>Only Active Contracts:</Text>
              <Select className='InputWrapper' value={String(onlyActiveContracts)} onChange={(e) => {
                setOnlyActiveContracts(e.target.value === 'true')
              }}>
                <option value={"true"}>true</option>
                <option value={"false"}>false</option>
              </Select>
            </Stack>
            <Button colorScheme='purple' onClick={() => onGetContractsExample()} isLoading={loading}>Get Contracts</Button>
          </Stack>
        </Box>
      }
    ]
  }, [contractId, certId, loading, downloadUrl, updateCertificateArgs, newCertificateArgs, onlyActiveContracts])

  return (
    <Stack spacing={4}>
      <Tabs
        variant='soft-rounded'
        colorScheme='purple'
        onChange={() => handleTabChange()}
        sx={{
          '.chakra-tabs__tab': {
            color: 'gray.200', // Default color
            border: `1px solid rgba(255, 255, 255, 0.2)`,
            borderRadius: '0.5rem',
            background: 'rgba(0, 0, 0, 0.15)',
            margin: '0 0.15rem',
            transition: 'all 0.3s',
          },
          '.chakra-tabs__tab[aria-selected="true"]': {
            background: 'purple.500',
            border: '1px solid',
            borderColor: 'purple.600',
            color: 'white',
          },
        }}
      >
        <Stack spacing={4}>
          <TabList sx={{
            // make unselected tab text color lighter
            tab: {
              color: 'gray.500',
            }
          }}>
            {tabs.map(({ tab }) => tab)}
          </TabList>
          <Box className='MainBoxWrapper'>
            <Text fontSize='xl'>For more detailed information on our SDK, you can visit our documentation <a href='https://docs.mentaport.com/docs/SDK/%20overview' target="_blank"><b>here</b></a>.</Text>
          </Box>
          <TabPanels p={0}>
            {tabs.map(({ tabPanel }) => {
              return <TabPanel p={0}>{tabPanel}</TabPanel>
            })}
          </TabPanels>

        </Stack>
      </Tabs>
      <Box
        className="MainBoxWrapper"
        overflowY="auto"
      >
        <Stack spacing={4}>
          <Text fontSize='xl'>Results:</Text>
          {<Box className='CodeStackWrapper'>
            <Code className='CodeWrapper'>
              {loading ? 'Loading...' : ''}
              {!!result && <div><pre>{result}</pre></div>}
            </Code>
          </Box>}
        </Stack>
      </Box>
    </Stack>
  );
};
